/*
 * KothingEditor
 *
 * The WYSIWYG Rich Text Editor
 * Copyright Kothing.
 * MIT license.
 */

import dialog from "../modules/dialog";
import component from "../modules/component";
import fileManager from "../modules/fileManager";

export default {
  name: "audio",
  display: "dialog",
  add: function (core) {
    core.addModule([dialog, component, fileManager]);

    const context = core.context;
    const contextAudio = (context.audio = {
      infoList: [], // @Override fileManager
      infoIndex: 0, // @Override fileManager
      uploadFileLength: 0, // @Override fileManager
      focusElement: null, // @Override dialog // This element has focus when the dialog is opened.
      targetSelect: null,
      origin_w: core.options.audioWidth,
      origin_h: core.options.audioHeight,
      linkValue: "",
      // @require @Override component
      element: null,
      cover: null,
      container: null,
    });

    /** dialog */
    let audio_dialog = this.setDialog(core);
    contextAudio.modal = audio_dialog;
    contextAudio.audioInputFile =
      audio_dialog.querySelector("._ke_audio_files");
    contextAudio.audioUrlFile = audio_dialog.querySelector(".ke-input-url");
    contextAudio.focusElement =
      contextAudio.audioInputFile || contextAudio.audioUrlFile;
    contextAudio.preview = audio_dialog.querySelector(".ke-link-preview");

    /** controller */
    let audio_controller = this.setController(core);
    contextAudio.controller = audio_controller;

    /** add event listeners */
    audio_dialog
      .querySelector("form")
      .addEventListener("submit", this.submit.bind(core));
    if (contextAudio.audioInputFile) {
      audio_dialog
        .querySelector(".ke-dialog-files-edge-button")
        .addEventListener(
          "click",
          this.removeSelectedFiles.bind(
            contextAudio.audioInputFile,
            contextAudio.audioUrlFile,
            contextAudio.preview
          )
        );
    }
    if (contextAudio.audioInputFile && contextAudio.audioUrlFile) {
      contextAudio.audioInputFile.addEventListener(
        "change",
        this.fileInputChange.bind(contextAudio)
      );
    }
    audio_controller.addEventListener(
      "click",
      this.onClick_controller.bind(core)
    );
    if (contextAudio.audioUrlFile) {
      contextAudio.audioUrlFile.addEventListener(
        "input",
        this.onLinkPreview.bind(
          contextAudio.preview,
          contextAudio,
          core.options.linkProtocol
        )
      );
    }

    /** append html */
    context.dialog.modal.appendChild(audio_dialog);

    /** append controller */
    context.element.relative.appendChild(audio_controller);

    /** empty memory */
    audio_dialog = null;
    audio_controller = null;
  },

  /** HTML - dialog */
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
      lang.dialogBox.audioBox.title +
      "</span>" +
      "</div>" +
      '<div class="ke-dialog-body">';

    if (option.audioFileInput) {
      html +=
        "" +
        '<div class="ke-dialog-form">' +
        "<label>" +
        lang.dialogBox.audioBox.file +
        "</label>" +
        '<div class="ke-dialog-form-files">' +
        '<input class="ke-input-form _ke_audio_files" type="file" accept="' +
        option.audioAccept +
        '"' +
        (option.audioMultipleFile ? ' multiple="multiple"' : "") +
        "/>" +
        '<button type="button" data-command="filesRemove" class="ke-btn ke-dialog-files-edge-button ke-file-remove" title="' +
        lang.controller.remove +
        '">' +
        core.icons.cancel +
        "</button>" +
        "</div>" +
        "</div>";
    }

    if (option.audioUrlInput) {
      html +=
        "" +
        '<div class="ke-dialog-form">' +
        "<label>" +
        lang.dialogBox.audioBox.url +
        "</label>" +
        '<input class="ke-input-form ke-input-url" type="text" />' +
        '<pre class="ke-link-preview"></pre>' +
        "</div>";
    }

    html +=
      "" +
      "</div>" +
      '<div class="ke-dialog-footer">' +
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

  /** HTML - controller */
  setController: function (core) {
    const lang = core.lang;
    const icons = core.icons;
    const link_btn = core.util.createElement("DIV");

    link_btn.className = "ke-controller ke-controller-link";
    link_btn.innerHTML =
      "" +
      '<div class="ke-arrow ke-arrow-up"></div>' +
      '<div class="link-content">' +
      '<div class="ke-btn-group">' +
      '<button type="button" data-command="update" tabindex="-1" class="ke-tooltip">' +
      icons.edit +
      '<span class="ke-tooltip-inner"><span class="ke-tooltip-text">' +
      lang.controller.edit +
      "</span></span>" +
      "</button>" +
      '<button type="button" data-command="delete" tabindex="-1" class="ke-tooltip">' +
      icons.delete +
      '<span class="ke-tooltip-inner"><span class="ke-tooltip-text">' +
      lang.controller.remove +
      "</span></span>" +
      "</button>" +
      "</div>" +
      "</div>";

    return link_btn;
  },

  // Disable url input when uploading files
  fileInputChange: function () {
    if (!this.audioInputFile.value) {
      this.audioUrlFile.removeAttribute("disabled");
      this.preview.style.textDecoration = "";
    } else {
      this.audioUrlFile.setAttribute("disabled", true);
      this.preview.style.textDecoration = "line-through";
    }
  },

  // Disable url input when uploading files
  removeSelectedFiles: function (urlInput, preview) {
    this.value = "";
    if (urlInput) {
      urlInput.removeAttribute("disabled");
      preview.style.textDecoration = "";
    }
  },

  // create new audio tag
  createAudioTag: function () {
    const oAudio = this.util.createElement("AUDIO");
    this.plugins.audio.setTagAttrs.call(this, oAudio);

    const w = this.context.audio.origin_w;
    const h = this.context.audio.origin_h;
    oAudio.setAttribute("origin-size", w + "," + h);
    oAudio.style.cssText =
      (w ? "width:" + w + "; " : "") + (h ? "height:" + h + ";" : "");

    return oAudio;
  },

  setTagAttrs: function (element) {
    element.setAttribute("controls", true);

    const attrs = this.options.audioTagAttrs;
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

  onLinkPreview: function (context, protocol, e) {
    const value = e.target.value.trim();
    context.linkValue = this.textContent = !value
      ? ""
      : protocol && value.indexOf("://") === -1 && value.indexOf("#") !== 0
      ? protocol + value
      : value.indexOf("://") === -1
      ? "/" + value
      : value;
  },

  /**
   * @Required @Override fileManager
   */
  fileTags: ["audio"],

  /**
   * @Override core, fileManager, resizing
   * @description It is called from core.selectComponent.
   * @param {Element} element Target element
   */
  select: function (element) {
    this.plugins.audio.onModifyMode.call(this, element);
  },

  /**
   * @Override fileManager, resizing
   */
  destroy: function (element) {
    element = element || this.context.audio.element;
    const container =
      this.util.getParentElement(element, this.util.isComponent) || element;
    const dataIndex = element.getAttribute("data-index") * 1;
    const focusEl =
      container.previousElementSibling || container.nextElementSibling;

    const emptyDiv = container.parentNode;
    this.util.removeItem(container);
    this.plugins.audio.init.call(this);
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

    // fileManager event
    this.plugins.fileManager.deleteInfo.call(
      this,
      "audio",
      dataIndex,
      this.functions.onAudioUpload
    );

    // history stack
    this.history.push(false);
  },

  /**
   * @Override fileManager
   */
  checkFileInfo: function () {
    this.plugins.fileManager.checkInfo.call(
      this,
      "audio",
      ["audio"],
      this.functions.onAudioUpload,
      this.plugins.audio.updateCover.bind(this),
      false
    );
  },

  /**
   * @Override fileManager
   */
  resetFileInfo: function () {
    this.plugins.fileManager.resetInfo.call(
      this,
      "audio",
      this.functions.onAudioUpload
    );
  },

  /**
   * @Required @Override dialog
   */
  on: function (update) {
    const contextAudio = this.context.audio;

    if (!update) {
      this.plugins.audio.init.call(this);
      if (contextAudio.audioInputFile && this.options.audioMultipleFile) {
        contextAudio.audioInputFile.setAttribute("multiple", "multiple");
      }
    } else if (contextAudio.element) {
      this.context.dialog.updateModal = true;
      contextAudio.linkValue =
        contextAudio.preview.textContent =
        contextAudio.audioUrlFile.value =
          contextAudio.element.src;
      if (contextAudio.audioInputFile && this.options.audioMultipleFile) {
        contextAudio.audioInputFile.removeAttribute("multiple");
      }
    } else {
      if (contextAudio.audioInputFile && this.options.audioMultipleFile) {
        contextAudio.audioInputFile.removeAttribute("multiple");
      }
    }
  },

  /**
   * @Required @Override dialog
   */
  open: function () {
    this.plugins.dialog.open.call(
      this,
      "audio",
      "audio" === this.currentControllerName
    );
  },

  submit: function (e) {
    const contextAudio = this.context.audio;

    e.preventDefault();
    e.stopPropagation();

    try {
      if (
        contextAudio.audioInputFile &&
        contextAudio.audioInputFile.files.length > 0
      ) {
        this.showLoading();
        this.plugins.audio.submitAction.call(
          this,
          contextAudio.audioInputFile.files
        );
      } else if (
        contextAudio.audioUrlFile &&
        contextAudio.linkValue.length > 0
      ) {
        this.showLoading();
        this.plugins.audio.setupUrl.call(this, contextAudio.linkValue);
      }
    } catch (error) {
      this.closeLoading();
      throw Error(
        '[KothingEditor.audio.submit.fail] cause : "' + error.message + '"'
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
      if (/audio/i.test(fileList[i].type)) {
        files.push(fileList[i]);
        fileSize += fileList[i].size;
      }
    }

    const limitSize = this.options.audioUploadSizeLimit;
    if (limitSize > 0) {
      let infoSize = 0;
      const audiosInfo = this.context.audio.infoList;
      for (let i = 0, len = audiosInfo.length; i < len; i++) {
        infoSize += audiosInfo[i].size * 1;
      }

      if (fileSize + infoSize > limitSize) {
        this.closeLoading();
        const err =
          "[KothingEditor.audioUpload.fail] Size of uploadable total audios: " +
          limitSize / 1000 +
          "KB";
        if (
          typeof this.functions.onAudioUploadError !== "function" ||
          this.functions.onAudioUploadError(
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

    const contextAudio = this.context.audio;
    contextAudio.uploadFileLength = files.length;

    const info = {
      isUpdate: this.context.dialog.updateModal,
      element: contextAudio.element,
    };

    if (typeof this.functions.onAudioUploadBefore === "function") {
      const result = this.functions.onAudioUploadBefore(
        files,
        info,
        this,
        function (data) {
          if (data && this._window.Array.isArray(data.result)) {
            this.plugins.audio.register.call(this, info, data);
          } else {
            this.plugins.audio.upload.call(this, info, data);
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

    this.plugins.audio.upload.call(this, info, files);
  },

  error: function (message, response) {
    this.closeLoading();
    if (
      typeof this.functions.onAudioUploadError !== "function" ||
      this.functions.onAudioUploadError(message, response, this)
    ) {
      this.functions.noticeOpen(message);
      throw Error(
        "[KothingEditor.plugin.audio.exception] response: " + message
      );
    }
  },

  upload: function (info, files) {
    if (!files) {
      this.closeLoading();
      return;
    }
    if (typeof files === "string") {
      this.plugins.audio.error.call(this, files, null);
      return;
    }

    const audioUploadUrl = this.options.audioUploadUrl;
    const filesLen = this.context.dialog.updateModal ? 1 : files.length;

    // create formData
    const formData = new FormData();
    for (let i = 0; i < filesLen; i++) {
      formData.append("file-" + i, files[i]);
    }

    // server upload
    this.plugins.fileManager.upload.call(
      this,
      audioUploadUrl,
      this.options.audioUploadHeader,
      formData,
      this.plugins.audio.callBack_upload.bind(this, info),
      this.functions.onAudioUploadError
    );
  },

  callBack_upload: function (info, xmlHttp) {
    if (typeof this.functions.audioUploadHandler === "function") {
      this.functions.audioUploadHandler(xmlHttp, info, this);
    } else {
      const response = JSON.parse(xmlHttp.responseText);
      if (response.errorMessage) {
        this.plugins.audio.error.call(this, response.errorMessage, response);
      } else {
        this.plugins.audio.register.call(this, info, response);
      }
    }
  },

  register: function (info, response) {
    const fileList = response.result;

    for (let i = 0, len = fileList.length, file, oAudio; i < len; i++) {
      if (info.isUpdate) {
        oAudio = info.element;
      } else {
        oAudio = this.plugins.audio.createAudioTag.call(this);
      }

      file = { name: fileList[i].name, size: fileList[i].size };
      this.plugins.audio.create_audio.call(
        this,
        oAudio,
        fileList[i].url,
        file,
        info.isUpdate
      );
    }

    this.closeLoading();
  },

  setupUrl: function (src) {
    try {
      if (src.length === 0) {
        return false;
      }
      this.plugins.audio.create_audio.call(
        this,
        this.plugins.audio.createAudioTag.call(this),
        src,
        null,
        this.context.dialog.updateModal
      );
    } catch (error) {
      throw Error(
        '[KothingEditor.audio.audio.fail] cause : "' + error.message + '"'
      );
    } finally {
      this.closeLoading();
    }
  },

  create_audio: function (element, src, file, isUpdate) {
    const contextAudio = this.context.audio;

    // create new tag
    if (!isUpdate) {
      element.src = src;
      const cover = this.plugins.component.set_cover.call(this, element);
      const container = this.plugins.component.set_container.call(
        this,
        cover,
        ""
      );
      if (
        !this.insertComponent(
          container,
          false,
          true,
          !this.options.mediaAutoSelect
        )
      ) {
        this.focus();
        return;
      }
      if (!this.options.mediaAutoSelect) {
        const line = this.appendFormatTag(container, null);
        this.setRange(line, 0, line, 0);
      }
    } else {
      // update
      if (contextAudio.element) {
        element = contextAudio.element;
      }
      if (element && element.src !== src) {
        element.src = src;
        this.selectComponent(element, "audio");
      } else {
        this.selectComponent(element, "audio");
        return;
      }
    }

    this.plugins.fileManager.setInfo.call(
      this,
      "audio",
      element,
      this.functions.onAudioUpload,
      file,
      false
    );
    if (isUpdate) {
      this.history.push(false);
    }
  },

  updateCover: function (element) {
    const contextAudio = this.context.audio;
    this.plugins.audio.setTagAttrs.call(this, element);

    // find component element
    const existElement =
      this.util.getParentElement(element, this.util.isMediaComponent) ||
      this.util.getParentElement(
        element,
        function (current) {
          return this.isWysiwygDiv(current.parentNode);
        }.bind(this.util)
      );

    // clone element
    const prevElement = element;
    contextAudio.element = element = element.cloneNode(false);
    const cover = this.plugins.component.set_cover.call(this, element);
    const container = this.plugins.component.set_container.call(
      this,
      cover,
      "ke-audio-container"
    );

    try {
      if (
        this.util.isFormatElement(existElement) &&
        existElement.childNodes.length > 0
      ) {
        existElement.parentNode.insertBefore(container, existElement);
        this.util.removeItem(prevElement);
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
    } catch (error) {
      console.warn(
        "[KothingEditor.audio.error] Maybe the audio tag is nested.",
        error
      );
    }

    this.plugins.fileManager.setInfo.call(
      this,
      "audio",
      element,
      this.functions.onAudioUpload,
      null,
      false
    );
  },

  /**
   * @Required @Override fileManager, resizing
   */
  onModifyMode: function (selectionTag) {
    const contextAudio = this.context.audio;

    this.setControllerPosition(
      contextAudio.controller,
      selectionTag,
      "bottom",
      { left: 0, top: 0 }
    );
    this.controllersOn(
      contextAudio.controller,
      selectionTag,
      this.plugins.audio.onControllerOff.bind(this, selectionTag),
      "audio"
    );

    this.util.addClass(selectionTag, "active");
    contextAudio.element = selectionTag;
    contextAudio.cover = this.util.getParentElement(selectionTag, "FIGURE");
    contextAudio.container = this.util.getParentElement(
      selectionTag,
      this.util.isComponent
    );
  },

  /**
   * @Required @Override fileManager, resizing
   */
  openModify: function (notOpen) {
    if (this.context.audio.audioUrlFile) {
      const contextAudio = this.context.audio;
      contextAudio.linkValue =
        contextAudio.preview.textContent =
        contextAudio.audioUrlFile.value =
          contextAudio.element.src;
    }
    if (!notOpen) {
      this.plugins.dialog.open.call(this, "audio", true);
    }
  },

  onClick_controller: function (e) {
    e.stopPropagation();

    const command = e.target.getAttribute("data-command");
    if (!command) {
      return;
    }

    e.preventDefault();

    if (/update/.test(command)) {
      this.plugins.audio.openModify.call(this, false);
    } else {
      /** delete */
      this.plugins.audio.destroy.call(this, this.context.audio.element);
    }

    this.controllersOff();
  },

  onControllerOff: function (selectionTag) {
    this.util.removeClass(selectionTag, "active");
    this.context.audio.controller.style.display = "none";
  },

  /**
   * @Required @Override dialog
   */
  init: function () {
    if (this.context.dialog.updateModal) {
      return;
    }
    const contextAudio = this.context.audio;

    if (contextAudio.audioInputFile) {
      contextAudio.audioInputFile.value = "";
    }
    if (contextAudio.audioUrlFile) {
      contextAudio.linkValue =
        contextAudio.preview.textContent =
        contextAudio.audioUrlFile.value =
          "";
    }
    if (contextAudio.audioInputFile && contextAudio.audioUrlFile) {
      contextAudio.audioUrlFile.removeAttribute("disabled");
      contextAudio.preview.style.textDecoration = "";
    }

    contextAudio.element = null;
  },
};
