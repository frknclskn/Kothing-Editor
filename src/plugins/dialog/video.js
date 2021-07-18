/*
 * KothingEditor
 *
 * The WYSIWYG Rich Text Editor
 * Copyright Kothing.
 * MIT license.
 */

import dialog from "../modules/dialog";
import component from "../modules/component";
import resizing from "../modules/resizing";
import fileManager from "../modules/fileManager";

export default {
  name: "video",
  display: "dialog",
  add: function (core) {
    core.addModule([dialog, component, resizing, fileManager]);

    const options = core.options;
    const context = core.context;
    const contextVideo = (context.video = {
      infoList: [], // @Override fileManager
      infoIndex: 0, // @Override fileManager
      uploadFileLength: 0, // @Override fileManager
      focusElement: null, // @Override dialog // This element has focus when the dialog is opened.
      sizeUnit: options.videoSizeUnit,
      align: "none",
      floatClassRegExp: "__ke__float\\-[a-z]+",
      youtubeQuery: options.youtubeQuery,
      videoRatio: options.videoRatio * 100 + "%",
      defaultRatio: options.videoRatio * 100 + "%",
      linkValue: "",
      // @require @Override component
      element: null,
      cover: null,
      container: null,
      // @Override resizing properties
      inputX: null,
      inputY: null,
      element_w: 1,
      element_h: 1,
      element_l: 0,
      element_t: 0,
      defaultSizeX: "100%",
      defaultSizeY: options.videoRatio * 100 + "%",
      origin_w: options.videoWidth === "100%" ? "" : options.videoWidth,
      origin_h: options.videoHeight === "56.25%" ? "" : options.videoHeight,
      proportionChecked: true,
      resizing: options.videoResizing,
      resizeDotHide: !options.videoHeightShow,
      rotation: options.videoRotation,
      onlyPercentage: options.videoSizeOnlyPercentage,
      ratio: false,
      ratioX: 1,
      ratioY: 1,
      captionShow: false,
    });

    /** video dialog */
    let video_dialog = this.setDialog(core);
    contextVideo.modal = video_dialog;
    contextVideo.videoInputFile = video_dialog.querySelector("._ke_video_file");
    contextVideo.videoUrlFile = video_dialog.querySelector(".ke-input-url");
    contextVideo.focusElement =
      contextVideo.videoUrlFile || contextVideo.videoInputFile;
    contextVideo.preview = video_dialog.querySelector(".ke-link-preview");

    /** add event listeners */
    video_dialog
      .querySelector("form")
      .addEventListener("submit", this.submit.bind(core));
    if (contextVideo.videoInputFile) {
      video_dialog
        .querySelector(".ke-dialog-files-edge-button")
        .addEventListener(
          "click",
          this.removeSelectedFiles.bind(
            contextVideo.videoInputFile,
            contextVideo.videoUrlFile,
            contextVideo.preview
          )
        );
    }
    if (contextVideo.videoInputFile && contextVideo.videoUrlFile) {
      contextVideo.videoInputFile.addEventListener(
        "change",
        this.fileInputChange.bind(contextVideo)
      );
    }
    if (contextVideo.videoUrlFile) {
      contextVideo.videoUrlFile.addEventListener(
        "input",
        this.onLinkPreview.bind(
          contextVideo.preview,
          contextVideo,
          options.linkProtocol
        )
      );
    }

    contextVideo.proportion = {};
    contextVideo.videoRatioOption = {};
    contextVideo.inputX = {};
    contextVideo.inputY = {};
    if (options.videoResizing) {
      contextVideo.proportion = video_dialog.querySelector(
        "._ke_video_check_proportion"
      );
      contextVideo.videoRatioOption =
        video_dialog.querySelector(".ke-video-ratio");
      contextVideo.inputX = video_dialog.querySelector("._ke_video_size_x");
      contextVideo.inputY = video_dialog.querySelector("._ke_video_size_y");
      contextVideo.inputX.value = options.videoWidth;
      contextVideo.inputY.value = options.videoHeight;

      contextVideo.inputX.addEventListener(
        "keyup",
        this.setInputSize.bind(core, "x")
      );
      contextVideo.inputY.addEventListener(
        "keyup",
        this.setInputSize.bind(core, "y")
      );

      contextVideo.inputX.addEventListener("change", this.setRatio.bind(core));
      contextVideo.inputY.addEventListener("change", this.setRatio.bind(core));
      contextVideo.proportion.addEventListener(
        "change",
        this.setRatio.bind(core)
      );
      contextVideo.videoRatioOption.addEventListener(
        "change",
        this.setVideoRatio.bind(core)
      );

      video_dialog
        .querySelector(".ke-dialog-btn-revert")
        .addEventListener("click", this.sizeRevert.bind(core));
    }

    /** append html */
    context.dialog.modal.appendChild(video_dialog);

    /** empty memory */
    video_dialog = null;
  },

  /** dialog */
  setDialog: function (core) {
    const option = core.options;
    const lang = core.lang;
    const dialog = core.util.createElement("DIV");

    dialog.className = "ke-dialog-content";
    dialog.style.display = "none";
    let html =
      "" +
      '<form method="post" enctype="multipart/form-data">' +
      '<div class="ke-dialog-header">' +
      '<button type="button" data-command="close" class="ke-btn ke-dialog-close" aria-label="Close" title="' +
      lang.dialogBox.close +
      '">' +
      core.icons.cancel +
      "</button>" +
      '<span class="ke-modal-title">' +
      lang.dialogBox.videoBox.title +
      "</span>" +
      "</div>" +
      '<div class="ke-dialog-body">';

    if (option.videoFileInput) {
      html +=
        "" +
        '<div class="ke-dialog-form">' +
        "<label>" +
        lang.dialogBox.videoBox.file +
        "</label>" +
        '<div class="ke-dialog-form-files">' +
        '<input class="ke-input-form _ke_video_file" type="file" accept="' +
        option.videoAccept +
        '"' +
        (option.videoMultipleFile ? ' multiple="multiple"' : "") +
        "/>" +
        '<button type="button" data-command="filesRemove" class="ke-btn ke-dialog-files-edge-button ke-file-remove" title="' +
        lang.controller.remove +
        '">' +
        core.icons.cancel +
        "</button>" +
        "</div>" +
        "</div>";
    }

    if (option.videoUrlInput) {
      html +=
        "" +
        '<div class="ke-dialog-form">' +
        "<label>" +
        lang.dialogBox.videoBox.url +
        "</label>" +
        '<input class="ke-input-form ke-input-url" type="text" />' +
        '<pre class="ke-link-preview"></pre>' +
        "</div>";
    }

    if (option.videoResizing) {
      const ratioList = option.videoRatioList || [
        { name: "16:9", value: 0.5625 },
        { name: "4:3", value: 0.75 },
        { name: "21:9", value: 0.4285 },
      ];
      const ratio = option.videoRatio;
      const onlyPercentage = option.videoSizeOnlyPercentage;
      const onlyPercentDisplay = onlyPercentage
        ? ' style="display: none !important;"'
        : "";
      const heightDisplay = !option.videoHeightShow
        ? ' style="display: none !important;"'
        : "";
      const ratioDisplay = !option.videoRatioShow
        ? ' style="display: none !important;"'
        : "";
      const onlyWidthDisplay =
        !onlyPercentage && !option.videoHeightShow && !option.videoRatioShow
          ? ' style="display: none !important;"'
          : "";
      html +=
        "" +
        '<div class="ke-dialog-form">' +
        '<div class="ke-dialog-size-text">' +
        '<label class="size-w">' +
        lang.dialogBox.width +
        "</label>" +
        '<label class="ke-dialog-size-x">&nbsp;</label>' +
        '<label class="size-h"' +
        heightDisplay +
        ">" +
        lang.dialogBox.height +
        "</label>" +
        '<label class="size-h"' +
        ratioDisplay +
        ">(" +
        lang.dialogBox.ratio +
        ")</label>" +
        "</div>" +
        '<input class="ke-input-control _ke_video_size_x" placeholder="100%"' +
        (onlyPercentage ? ' type="number" min="1"' : 'type="text"') +
        (onlyPercentage ? ' max="100"' : "") +
        "/>" +
        '<label class="ke-dialog-size-x"' +
        onlyWidthDisplay +
        ">" +
        (onlyPercentage ? "%" : "x") +
        "</label>" +
        '<input class="ke-input-control _ke_video_size_y" placeholder="' +
        option.videoRatio * 100 +
        '%"' +
        (onlyPercentage ? ' type="number" min="1"' : 'type="text"') +
        (onlyPercentage ? ' max="100"' : "") +
        heightDisplay +
        "/>" +
        '<select class="ke-input-select ke-video-ratio" title="' +
        lang.dialogBox.ratio +
        '"' +
        ratioDisplay +
        ">";
      if (!heightDisplay) {
        html += '<option value=""> - </option>';
      }
      for (let i = 0, len = ratioList.length; i < len; i++) {
        html +=
          '<option value="' +
          ratioList[i].value +
          '"' +
          (ratio.toString() === ratioList[i].value.toString()
            ? " selected"
            : "") +
          ">" +
          ratioList[i].name +
          "</option>";
      }
      html +=
        "</select>" +
        '<button type="button" title="' +
        lang.dialogBox.revertButton +
        '" class="ke-btn ke-dialog-btn-revert" style="float: right;">' +
        core.icons.revert +
        "</button>" +
        "</div>" +
        '<div class="ke-dialog-form ke-dialog-form-footer"' +
        onlyPercentDisplay +
        onlyWidthDisplay +
        ">" +
        '<label><input type="checkbox" class="ke-dialog-btn-check _ke_video_check_proportion" checked/>&nbsp;' +
        lang.dialogBox.proportion +
        "</label>" +
        "</div>";
    }

    html +=
      "" +
      "</div>" +
      '<div class="ke-dialog-footer">' +
      "<div>" +
      '<label><input type="radio" name="kothingEditor_video_radio" class="ke-dialog-btn-radio" value="none" checked>' +
      lang.dialogBox.basic +
      "</label>" +
      '<label><input type="radio" name="kothingEditor_video_radio" class="ke-dialog-btn-radio" value="left">' +
      lang.dialogBox.left +
      "</label>" +
      '<label><input type="radio" name="kothingEditor_video_radio" class="ke-dialog-btn-radio" value="center">' +
      lang.dialogBox.center +
      "</label>" +
      '<label><input type="radio" name="kothingEditor_video_radio" class="ke-dialog-btn-radio" value="right">' +
      lang.dialogBox.right +
      "</label>" +
      "</div>" +
      '<button type="submit" class="ke-btn-primary" title="' +
      lang.dialogBox.submitButton +
      '"><span>' +
      lang.dialogBox.submitButton +
      "</span></button>" +
      "</div>" +
      "</form>";

    dialog.innerHTML = html;

    return dialog;
  },

  fileInputChange: function () {
    if (!this.videoInputFile.value) {
      this.videoUrlFile.removeAttribute("disabled");
      this.preview.style.textDecoration = "";
    } else {
      this.videoUrlFile.setAttribute("disabled", true);
      this.preview.style.textDecoration = "line-through";
    }
  },

  removeSelectedFiles: function (urlInput, preview) {
    this.value = "";
    if (urlInput) {
      urlInput.removeAttribute("disabled");
      preview.style.textDecoration = "";
    }
  },

  onLinkPreview: function (context, protocol, e) {
    const value = e.target.value.trim();
    if (/^<iframe.*\/iframe>$/.test(value)) {
      context.linkValue = value;
      this.textContent = '<IFrame :src=".."></IFrame>';
    } else {
      context.linkValue = this.textContent = !value
        ? ""
        : protocol && value.indexOf("://") === -1 && value.indexOf("#") !== 0
        ? protocol + value
        : value.indexOf("://") === -1
        ? "/" + value
        : value;
    }
  },

  setTagAttrs: function (element) {
    element.setAttribute("controls", true);

    const attrs = this.options.videoTagAttrs;
    if (!attrs) {
      return;
    }

    for (const key in attrs) {
      if (!this.util.hasOwn(attrs, key)) {
        continue;
      }
      element.setAttribute(key, attrs[key]);
    }
  },

  createVideoTag: function () {
    const videoTag = this.util.createElement("VIDEO");
    this.plugins.video.setTagAttrs.call(this, videoTag);
    return videoTag;
  },

  setIframeAttrs: function (element) {
    element.frameBorder = "0";
    element.allowFullscreen = true;

    const attrs = this.options.videoIframeAttrs;
    if (!attrs) {
      return;
    }

    for (const key in attrs) {
      if (!this.util.hasOwn(attrs, key)) {
        continue;
      }
      element.setAttribute(key, attrs[key]);
    }
  },

  createIframeTag: function () {
    const iframeTag = this.util.createElement("IFRAME");
    this.plugins.video.setIframeAttrs.call(this, iframeTag);
    return iframeTag;
  },

  /**
   * @Override @Required fileManager
   */
  fileTags: ["iframe", "video"],

  /**
   * @Override core, resizing, fileManager
   * @description It is called from core.selectComponent.
   * @param {Element} element Target element
   */
  select: function (element) {
    this.plugins.video.onModifyMode.call(
      this,
      element,
      this.plugins.resizing.call_controller_resize.call(this, element, "video")
    );
  },

  /**
   * @Override fileManager, resizing
   */
  destroy: function (element) {
    const frame = element || this.context.video.element;
    const container = this.context.video.container;
    const dataIndex = frame.getAttribute("data-index") * 1;
    const focusEl =
      container.previousElementSibling || container.nextElementSibling;

    const emptyDiv = container.parentNode;
    this.util.removeItem(container);
    this.plugins.video.init.call(this);
    this.controllersOff();

    if (emptyDiv !== this.context.element.wysiwyg) {
      this.util.removeItemAllParents(
        emptyDiv,
        function (current) {
          return current.childNodes.length === 0;
        },
        null
      );
    }

    // focus
    this.focusEdge(focusEl);

    // event
    this.plugins.fileManager.deleteInfo.call(
      this,
      "video",
      dataIndex,
      this.functions.onVideoUpload
    );

    // history stack
    this.history.push(false);
  },

  /**
   * @Required @Override dialog
   */
  on: function (update) {
    const contextVideo = this.context.video;

    if (!update) {
      contextVideo.inputX.value = contextVideo.origin_w =
        this.options.videoWidth === contextVideo.defaultSizeX
          ? ""
          : this.options.videoWidth;
      contextVideo.inputY.value = contextVideo.origin_h =
        this.options.videoHeight === contextVideo.defaultSizeY
          ? ""
          : this.options.videoHeight;
      contextVideo.proportion.disabled = true;
      if (contextVideo.videoInputFile && this.options.videoMultipleFile) {
        contextVideo.videoInputFile.setAttribute("multiple", "multiple");
      }
    } else {
      if (contextVideo.videoInputFile && this.options.videoMultipleFile) {
        contextVideo.videoInputFile.removeAttribute("multiple");
      }
    }

    if (contextVideo.resizing) {
      this.plugins.video.setVideoRatioSelect.call(
        this,
        contextVideo.origin_h || contextVideo.defaultRatio
      );
    }
  },

  /**
   * @Required @Override dialog
   */
  open: function () {
    this.plugins.dialog.open.call(
      this,
      "video",
      "video" === this.currentControllerName
    );
  },

  setVideoRatio: function (e) {
    const contextVideo = this.context.video;
    const value = e.target.options[e.target.selectedIndex].value;

    contextVideo.defaultSizeY = contextVideo.videoRatio = !value
      ? contextVideo.defaultSizeY
      : value * 100 + "%";
    contextVideo.inputY.placeholder = !value ? "" : value * 100 + "%";
    contextVideo.inputY.value = "";
  },

  /**
   * @Override resizing
   * @param {String} xy 'x': width, 'y': height
   * @param {KeyboardEvent} e Event object
   */
  setInputSize: function (xy, e) {
    if (e && e.keyCode === 32) {
      e.preventDefault();
      return;
    }

    const contextVideo = this.context.video;
    this.plugins.resizing.module_setInputSize.call(this, contextVideo, xy);

    if (xy === "y") {
      this.plugins.video.setVideoRatioSelect.call(
        this,
        e.target.value || contextVideo.defaultRatio
      );
    }
  },

  /**
   * @Override resizing
   */
  setRatio: function () {
    this.plugins.resizing.module_setRatio.call(this, this.context.video);
  },

  submit: function (e) {
    const contextVideo = this.context.video;
    const videoPlugin = this.plugins.video;

    e.preventDefault();
    e.stopPropagation();

    contextVideo.align = contextVideo.modal.querySelector(
      'input[name="kothingEditor_video_radio"]:checked'
    ).value;

    try {
      if (
        contextVideo.videoInputFile &&
        contextVideo.videoInputFile.files.length > 0
      ) {
        this.showLoading();
        videoPlugin.submitAction.call(
          this,
          this.context.video.videoInputFile.files
        );
      } else if (
        contextVideo.videoUrlFile &&
        contextVideo.linkValue.length > 0
      ) {
        this.showLoading();
        videoPlugin.setup_url.call(this);
      }
    } catch (error) {
      this.closeLoading();
      throw Error(
        '[KothingEditor.video.submit.fail] cause : "' + error.message + '"'
      );
    } finally {
      this.plugins.dialog.close.call(this);
    }

    return false;
  },

  submitAction: function (fileList) {
    if (fileList.length === 0) {
      return;
    }

    let fileSize = 0;
    let files = [];
    for (let i = 0, len = fileList.length; i < len; i++) {
      if (/video/i.test(fileList[i].type)) {
        files.push(fileList[i]);
        fileSize += fileList[i].size;
      }
    }

    const limitSize = this.options.videoUploadSizeLimit;
    if (limitSize > 0) {
      let infoSize = 0;
      const videosInfo = this.context.video.infoList;
      for (let i = 0, len = videosInfo.length; i < len; i++) {
        infoSize += videosInfo[i].size * 1;
      }

      if (fileSize + infoSize > limitSize) {
        this.closeLoading();
        const err =
          "[KothingEditor.videoUpload.fail] Size of uploadable total videos: " +
          limitSize / 1000 +
          "KB";
        if (
          typeof this.functions.onVideoUploadError !== "function" ||
          this.functions.onVideoUploadError(
            err,
            {
              limitSize: limitSize,
              currentSize: infoSize,
              uploadSize: fileSize,
            },
            this
          )
        ) {
          this.functions.noticeOpen(err);
        }
        return;
      }
    }

    const contextVideo = this.context.video;
    contextVideo.uploadFileLength = files.length;

    const info = {
      inputWidth: contextVideo.inputX.value,
      inputHeight: contextVideo.inputY.value,
      align: contextVideo.align,
      isUpdate: this.context.dialog.updateModal,
      element: contextVideo.element,
    };

    if (typeof this.functions.onVideoUploadBefore === "function") {
      const result = this.functions.onVideoUploadBefore(
        files,
        info,
        this,
        function (data) {
          if (data && this._window.Array.isArray(data.result)) {
            this.plugins.video.register.call(this, info, data);
          } else {
            this.plugins.video.upload.call(this, info, data);
          }
        }.bind(this)
      );

      if (typeof result === "undefined") {
        return;
      }
      if (!result) {
        this.closeLoading();
        return;
      }
      if (typeof result === "object" && result.length > 0) {
        files = result;
      }
    }

    this.plugins.video.upload.call(this, info, files);
  },

  error: function (message, response) {
    this.closeLoading();
    if (
      typeof this.functions.onVideoUploadError !== "function" ||
      this.functions.onVideoUploadError(message, response, this)
    ) {
      this.functions.noticeOpen(message);
      throw Error("[KothingEditor.plugin.video.error] response: " + message);
    }
  },

  upload: function (info, files) {
    if (!files) {
      this.closeLoading();
      return;
    }
    if (typeof files === "string") {
      this.plugins.video.error.call(this, files, null);
      return;
    }

    const videoUploadUrl = this.options.videoUploadUrl;
    const filesLen = this.context.dialog.updateModal ? 1 : files.length;

    // server upload
    if (typeof videoUploadUrl === "string" && videoUploadUrl.length > 0) {
      const formData = new FormData();
      for (let i = 0; i < filesLen; i++) {
        formData.append("file-" + i, files[i]);
      }
      this.plugins.fileManager.upload.call(
        this,
        videoUploadUrl,
        this.options.videoUploadHeader,
        formData,
        this.plugins.video.callBack_videoUpload.bind(this, info),
        this.functions.onVideoUploadError
      );
    } else {
      throw Error(
        '[KothingEditor.videoUpload.fail] cause : There is no "videoUploadUrl" option.'
      );
    }
  },

  callBack_videoUpload: function (info, xmlHttp) {
    if (typeof this.functions.videoUploadHandler === "function") {
      this.functions.videoUploadHandler(xmlHttp, info, this);
    } else {
      const response = JSON.parse(xmlHttp.responseText);
      if (response.errorMessage) {
        this.plugins.video.error.call(this, response.errorMessage, response);
      } else {
        this.plugins.video.register.call(this, info, response);
      }
    }
  },

  register: function (info, response) {
    const fileList = response.result;
    const videoTag = this.plugins.video.createVideoTag.call(this);

    for (let i = 0, len = fileList.length, file; i < len; i++) {
      file = { name: fileList[i].name, size: fileList[i].size };
      this.plugins.video.create_video.call(
        this,
        info.isUpdate ? info.element : videoTag.cloneNode(false),
        fileList[i].url,
        info.inputWidth,
        info.inputHeight,
        info.align,
        file,
        info.isUpdate
      );
    }

    this.closeLoading();
  },

  setup_url: function () {
    try {
      const contextVideo = this.context.video;
      let url = contextVideo.linkValue;

      if (url.length === 0) {
        return false;
      }

      /** iframe source */
      if (/^<iframe.*\/iframe>$/.test(url)) {
        const oIframe = new this._window.DOMParser()
          .parseFromString(url, "text/html")
          .querySelector("iframe");
        url = oIframe.src;
        if (url.length === 0) {
          return false;
        }
      }

      /** youtube */
      if (/youtu\.?be/.test(url)) {
        if (!/^http/.test(url)) {
          url = "https://" + url;
        }
        url = url.replace("watch?v=", "");
        if (!/^\/\/.+\/embed\//.test(url)) {
          url = url
            .replace(url.match(/\/\/.+\//)[0], "//www.youtube.com/embed/")
            .replace("&", "?&");
        }

        if (contextVideo.youtubeQuery.length > 0) {
          if (/\?/.test(url)) {
            const splitUrl = url.split("?");
            url =
              splitUrl[0] + "?" + contextVideo.youtubeQuery + "&" + splitUrl[1];
          } else {
            url += "?" + contextVideo.youtubeQuery;
          }
        }
      } else if (/vimeo\.com/.test(url)) {
        if (url.endsWith("/")) {
          url = url.slice(0, -1);
        }
        url =
          "https://player.vimeo.com/video/" +
          url.slice(url.lastIndexOf("/") + 1);
      }

      this.plugins.video.create_video.call(
        this,
        this.plugins.video.createIframeTag.call(this),
        url,
        contextVideo.inputX.value,
        contextVideo.inputY.value,
        contextVideo.align,
        null,
        this.context.dialog.updateModal
      );
    } catch (error) {
      throw Error(
        '[KothingEditor.video.upload.fail] cause : "' + error.message + '"'
      );
    } finally {
      this.closeLoading();
    }
  },

  create_video: function (oFrame, src, width, height, align, file, isUpdate) {
    this.context.resizing.resize_plugin = "video";
    const contextVideo = this.context.video;

    let cover = null;
    let container = null;
    let init = false;

    /** update */
    if (isUpdate) {
      oFrame = contextVideo.element;
      if (oFrame.src !== src) {
        init = true;
        const isYoutube = /youtu\.?be/.test(src);
        const isVimeo = /vimeo\.com/.test(src);
        if ((isYoutube || isVimeo) && !/^iframe$/i.test(oFrame.nodeName)) {
          const newTag = this.plugins.video.createIframeTag.call(this);
          newTag.src = src;
          oFrame.parentNode.replaceChild(newTag, oFrame);
          contextVideo.element = oFrame = newTag;
        } else if (
          !isYoutube &&
          !isVimeo &&
          !/^videoo$/i.test(oFrame.nodeName)
        ) {
          const newTag = this.plugins.video.createVideoTag.call(this);
          newTag.src = src;
          oFrame.parentNode.replaceChild(newTag, oFrame);
          contextVideo.element = oFrame = newTag;
        } else {
          oFrame.src = src;
        }
      }
      container = contextVideo.container;
      cover = this.util.getParentElement(oFrame, "FIGURE");
    } else {
      /** create */
      init = true;
      oFrame.src = src;
      contextVideo.element = oFrame;
      cover = this.plugins.component.set_cover.call(this, oFrame);
      container = this.plugins.component.set_container.call(
        this,
        cover,
        "ke-video-container"
      );
    }

    /** rendering */
    contextVideo.cover = cover;
    contextVideo.container = container;

    const inputUpdate =
      this.plugins.resizing.module_getSizeX.call(this, contextVideo) !==
        (width || contextVideo.defaultSizeX) ||
      this.plugins.resizing.module_getSizeY.call(this, contextVideo) !==
        (height || contextVideo.videoRatio);
    const changeSize = !isUpdate || inputUpdate;

    if (contextVideo.resizing) {
      this.context.video.proportionChecked = contextVideo.proportion.checked;
      oFrame.setAttribute("data-proportion", contextVideo.proportionChecked);
    }

    // size
    let isPercent = false;
    if (changeSize) {
      isPercent = this.plugins.video.applySize.call(this);
    }

    // align
    if (!(isPercent && align === "center")) {
      this.plugins.video.setAlign.call(this, null, oFrame, cover, container);
    }

    let changed = true;
    if (!isUpdate) {
      changed = this.insertComponent(
        container,
        false,
        true,
        !this.options.mediaAutoSelect
      );
      if (!this.options.mediaAutoSelect) {
        const line = this.appendFormatTag(container, null);
        this.setRange(line, 0, line, 0);
      }
    } else if (
      contextVideo.resizing &&
      this.context.resizing.rotateVertical &&
      changeSize
    ) {
      this.plugins.resizing.setTransformSize.call(this, oFrame, null, null);
    }

    if (changed) {
      if (init) {
        this.plugins.fileManager.setInfo.call(
          this,
          "video",
          oFrame,
          this.functions.onVideoUpload,
          file,
          true
        );
      }
      if (isUpdate) {
        this.selectComponent(oFrame, "video");
        // history stack
        this.history.push(false);
      }
    }

    this.context.resizing.resize_plugin = "";
  },

  update_videoCover: function (oFrame) {
    if (!oFrame) {
      return;
    }

    const contextVideo = this.context.video;

    if (/^video$/i.test(oFrame.nodeName)) {
      this.plugins.video.setTagAttrs.call(this, oFrame);
    } else {
      this.plugins.video.setIframeAttrs.call(this, oFrame);
    }

    const existElement =
      this.util.getParentElement(oFrame, this.util.isMediaComponent) ||
      this.util.getParentElement(
        oFrame,
        function (current) {
          return this.isWysiwygDiv(current.parentNode);
        }.bind(this.util)
      );

    const prevFrame = oFrame;
    contextVideo.element = oFrame = oFrame.cloneNode(true);
    const cover = (contextVideo.cover = this.plugins.component.set_cover.call(
      this,
      oFrame
    ));
    const container = (contextVideo.container =
      this.plugins.component.set_container.call(
        this,
        cover,
        "ke-video-container"
      ));

    try {
      const figcaption = existElement.querySelector("figcaption");
      let caption = null;
      if (figcaption) {
        caption = this.util.createElement("DIV");
        caption.innerHTML = figcaption.innerHTML;
        this.util.removeItem(figcaption);
      }

      // size
      const size = (
        oFrame.getAttribute("data-size") ||
        oFrame.getAttribute("data-origin") ||
        ""
      ).split(",");
      this.plugins.video.applySize.call(
        this,
        size[0] || prevFrame.style.width || prevFrame.width || "",
        size[1] || prevFrame.style.height || prevFrame.height || ""
      );

      // align
      const format = this.util.getFormatElement(prevFrame);
      if (format) {
        contextVideo.align = format.style.textAlign || format.style.float;
      }
      this.plugins.video.setAlign.call(this, null, oFrame, cover, container);

      if (
        this.util.isFormatElement(existElement) &&
        existElement.childNodes.length > 0
      ) {
        existElement.parentNode.insertBefore(container, existElement);
        this.util.removeItem(prevFrame);
        // clean format tag
        this.util.removeEmptyNode(existElement, null);
        if (existElement.children.length === 0) {
          existElement.innerHTML = this.util.htmlRemoveWhiteSpace(
            existElement.innerHTML
          );
        }
      } else {
        existElement.parentNode.replaceChild(container, existElement);
      }

      if (caption) {
        existElement.parentNode.insertBefore(
          caption,
          container.nextElementSibling
        );
      }
    } catch (error) {
      console.warn(
        "[KothingEditor.video.error] Maybe the video tag is nested.",
        error
      );
    }

    this.plugins.fileManager.setInfo.call(
      this,
      "video",
      oFrame,
      this.functions.onVideoUpload,
      null,
      true
    );
  },

  /**
   * @Required @Override fileManager, resizing
   */
  onModifyMode: function (element, size) {
    const contextVideo = this.context.video;
    contextVideo.element = element;
    contextVideo.cover = this.util.getParentElement(element, "FIGURE");
    contextVideo.container = this.util.getParentElement(
      element,
      this.util.isMediaComponent
    );
    contextVideo.align =
      element.style.float || element.getAttribute("data-align") || "none";
    element.style.float = "";

    if (size) {
      contextVideo.element_w = size.w;
      contextVideo.element_h = size.h;
      contextVideo.element_t = size.t;
      contextVideo.element_l = size.l;
    }

    let origin =
      contextVideo.element.getAttribute("data-size") ||
      contextVideo.element.getAttribute("data-origin");
    let w, h;
    if (origin) {
      origin = origin.split(",");
      w = origin[0];
      h = origin[1];
    } else if (size) {
      w = size.w;
      h = size.h;
    }

    contextVideo.origin_w = w || element.style.width || element.width || "";
    contextVideo.origin_h = h || element.style.height || element.height || "";
  },

  /**
   * @Required @Override fileManager, resizing
   */
  openModify: function (notOpen) {
    const contextVideo = this.context.video;

    if (contextVideo.videoUrlFile) {
      contextVideo.linkValue =
        contextVideo.preview.textContent =
        contextVideo.videoUrlFile.value =
          contextVideo.element.src ||
          (contextVideo.element.querySelector("source") || "").src ||
          "";
    }
    contextVideo.modal.querySelector(
      'input[name="kothingEditor_video_radio"][value="' +
        contextVideo.align +
        '"]'
    ).checked = true;

    if (contextVideo.resizing) {
      this.plugins.resizing.module_setModifyInputSize.call(
        this,
        contextVideo,
        this.plugins.video
      );

      const y = (contextVideo.videoRatio =
        this.plugins.resizing.module_getSizeY.call(this, contextVideo));
      const ratioSelected = this.plugins.video.setVideoRatioSelect.call(
        this,
        y
      );
      if (!ratioSelected) {
        contextVideo.inputY.value = contextVideo.onlyPercentage
          ? this.util.getNumber(y, 2)
          : y;
      }
    }

    if (!notOpen) {
      this.plugins.dialog.open.call(this, "video", true);
    }
  },

  setVideoRatioSelect: function (value) {
    let ratioSelected = false;
    const contextVideo = this.context.video;
    const ratioOptions = contextVideo.videoRatioOption.options;

    if (/%$/.test(value) || contextVideo.onlyPercentage) {
      value = this.util.getNumber(value, 2) / 100 + "";
    } else if (!this.util.isNumber(value) || value * 1 >= 1) {
      value = "";
    }

    contextVideo.inputY.placeholder = "";
    for (let i = 0, len = ratioOptions.length; i < len; i++) {
      if (ratioOptions[i].value === value) {
        ratioSelected = ratioOptions[i].selected = true;
        contextVideo.inputY.placeholder = !value ? "" : value * 100 + "%";
      } else {
        ratioOptions[i].selected = false;
      }
    }

    return ratioSelected;
  },

  /**
   * @Override fileManager
   */
  checkFileInfo: function () {
    this.plugins.fileManager.checkInfo.call(
      this,
      "video",
      ["iframe", "video"],
      this.functions.onVideoUpload,
      this.plugins.video.update_videoCover.bind(this),
      true
    );
  },

  /**
   * @Override fileManager
   */
  resetFileInfo: function () {
    this.plugins.fileManager.resetInfo.call(
      this,
      "video",
      this.functions.onVideoUpload
    );
  },

  /**
   * @Override fileManager
   */
  applySize: function (w, h) {
    const contextVideo = this.context.video;

    if (!w) {
      w = contextVideo.inputX.value || this.options.videoWidth;
    }
    if (!h) {
      h = contextVideo.inputY.value || this.options.videoHeight;
    }

    if (contextVideo.onlyPercentage || /%$/.test(w) || !w) {
      this.plugins.video.setPercentSize.call(
        this,
        w || "100%",
        h ||
          (/%$/.test(contextVideo.videoRatio)
            ? contextVideo.videoRatio
            : contextVideo.defaultRatio)
      );
      return true;
    } else if ((!w || w === "auto") && (!h || h === "auto")) {
      this.plugins.video.setAutoSize.call(this);
    } else {
      this.plugins.video.setSize.call(
        this,
        w,
        h || contextVideo.videoRatio || contextVideo.defaultRatio,
        false
      );
    }

    return false;
  },

  /**
   * @Override resizing
   */
  sizeRevert: function () {
    this.plugins.resizing.module_sizeRevert.call(this, this.context.video);
  },

  /**
   * @Override resizing
   */
  setSize: function (w, h, notResetPercentage, direction) {
    const contextVideo = this.context.video;
    const onlyW = /^(rw|lw)$/.test(direction);
    const onlyH = /^(th|bh)$/.test(direction);

    if (!onlyH) {
      w = this.util.getNumber(w, 0);
    }
    if (!onlyW) {
      h = this.util.isNumber(h) ? h + contextVideo.sizeUnit : !h ? "" : h;
    }

    if (!onlyH) {
      contextVideo.element.style.width = w ? w + contextVideo.sizeUnit : "";
    }
    if (!onlyW) {
      contextVideo.cover.style.paddingBottom = contextVideo.cover.style.height =
        h;
    }

    if (!onlyH && !/%$/.test(w)) {
      contextVideo.cover.style.width = "";
      contextVideo.container.style.width = "";
    }

    if (!onlyW && !/%$/.test(h)) {
      contextVideo.element.style.height = h;
    } else {
      contextVideo.element.style.height = "";
    }

    if (!notResetPercentage) {
      contextVideo.element.removeAttribute("data-percentage");
    }

    // save current size
    this.plugins.resizing.module_saveCurrentSize.call(this, contextVideo);
  },

  /**
   * @Override resizing
   */
  setAutoSize: function () {
    this.plugins.video.setPercentSize.call(
      this,
      100,
      this.context.video.defaultRatio
    );
  },

  /**
   * @Override resizing
   */
  setOriginSize: function (dataSize) {
    const contextVideo = this.context.video;
    contextVideo.element.removeAttribute("data-percentage");

    this.plugins.resizing.resetTransform.call(this, contextVideo.element);
    this.plugins.video.cancelPercentAttr.call(this);

    const originSize = (
      (dataSize ? contextVideo.element.getAttribute("data-size") : "") ||
      contextVideo.element.getAttribute("data-origin") ||
      ""
    ).split(",");

    if (originSize) {
      const w = originSize[0];
      const h = originSize[1];

      if (
        contextVideo.onlyPercentage ||
        (/%$/.test(w) && (/%$/.test(h) || !/\d/.test(h)))
      ) {
        this.plugins.video.setPercentSize.call(this, w, h);
      } else {
        this.plugins.video.setSize.call(this, w, h);
      }

      // save current size
      this.plugins.resizing.module_saveCurrentSize.call(this, contextVideo);
    }
  },

  /**
   * @Override resizing
   */
  setPercentSize: function (w, h) {
    const contextVideo = this.context.video;
    h =
      !!h && !/%$/.test(h) && !this.util.getNumber(h, 0)
        ? this.util.isNumber(h)
          ? h + "%"
          : h
        : this.util.isNumber(h)
        ? h + contextVideo.sizeUnit
        : h || contextVideo.defaultRatio;

    contextVideo.container.style.width = this.util.isNumber(w) ? w + "%" : w;
    contextVideo.container.style.height = "";
    contextVideo.cover.style.width = "100%";
    contextVideo.cover.style.height = h;
    contextVideo.cover.style.paddingBottom = h;
    contextVideo.element.style.width = "100%";
    contextVideo.element.style.height = "100%";
    contextVideo.element.style.maxWidth = "";

    if (contextVideo.align === "center") {
      this.plugins.video.setAlign.call(this, null, null, null, null);
    }
    contextVideo.element.setAttribute("data-percentage", w + "," + h);

    // save current size
    this.plugins.resizing.module_saveCurrentSize.call(this, contextVideo);
  },

  /**
   * @Override resizing
   */
  cancelPercentAttr: function () {
    const contextVideo = this.context.video;

    contextVideo.cover.style.width = "";
    contextVideo.cover.style.height = "";
    contextVideo.cover.style.paddingBottom = "";
    contextVideo.container.style.width = "";
    contextVideo.container.style.height = "";

    this.util.removeClass(
      contextVideo.container,
      this.context.video.floatClassRegExp
    );
    this.util.addClass(
      contextVideo.container,
      "__ke__float-" + contextVideo.align
    );

    if (contextVideo.align === "center") {
      this.plugins.video.setAlign.call(this, null, null, null, null);
    }
  },

  /**
   * @Override resizing
   */
  setAlign: function (align, element, cover, container) {
    const contextVideo = this.context.video;

    if (!align) {
      align = contextVideo.align;
    }
    if (!element) {
      element = contextVideo.element;
    }
    if (!cover) {
      cover = contextVideo.cover;
    }
    if (!container) {
      container = contextVideo.container;
    }

    if (align && align !== "none") {
      cover.style.margin = "auto";
    } else {
      cover.style.margin = "0";
    }

    if (/%$/.test(element.style.width) && align === "center") {
      container.style.minWidth = "100%";
      cover.style.width = container.style.width;
      cover.style.height = container.style.height;
      cover.style.paddingBottom = !/%$/.test(cover.style.height)
        ? cover.style.height
        : this.util.getNumber(
            (this.util.getNumber(cover.style.height, 2) / 100) *
              this.util.getNumber(cover.style.width, 2),
            2
          ) + "%";
    } else {
      container.style.minWidth = "";
      cover.style.width = this.context.resizing.rotateVertical
        ? element.style.height || element.offsetHeight
        : element.style.width || "100%";
      cover.style.paddingBottom = cover.style.height;
    }

    if (!this.util.hasClass(container, "__ke__float-" + align)) {
      this.util.removeClass(container, contextVideo.floatClassRegExp);
      this.util.addClass(container, "__ke__float-" + align);
    }

    element.setAttribute("data-align", align);
  },

  /**
   * @Override dialog
   */
  init: function () {
    const contextVideo = this.context.video;
    if (contextVideo.videoInputFile) {
      contextVideo.videoInputFile.value = "";
    }
    if (contextVideo.videoUrlFile) {
      contextVideo.linkValue =
        contextVideo.preview.textContent =
        contextVideo.videoUrlFile.value =
          "";
    }
    if (contextVideo.videoInputFile && contextVideo.videoUrlFile) {
      contextVideo.videoUrlFile.removeAttribute("disabled");
      contextVideo.preview.style.textDecoration = "";
    }

    contextVideo.origin_w = this.options.videoWidth;
    contextVideo.origin_h = this.options.videoHeight;
    contextVideo.modal.querySelector(
      'input[name="kothingEditor_video_radio"][value="none"]'
    ).checked = true;

    if (contextVideo.resizing) {
      contextVideo.inputX.value =
        this.options.videoWidth === contextVideo.defaultSizeX
          ? ""
          : this.options.videoWidth;
      contextVideo.inputY.value =
        this.options.videoHeight === contextVideo.defaultSizeY
          ? ""
          : this.options.videoHeight;
      contextVideo.proportion.checked = true;
      contextVideo.proportion.disabled = true;
      this.plugins.video.setVideoRatioSelect.call(
        this,
        contextVideo.defaultRatio
      );
    }
  },
};
