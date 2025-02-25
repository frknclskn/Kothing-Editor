/*
 * KothingEditor
 *
 * The WYSIWYG Rich Text Editor
 * Copyright Kothing.
 * MIT license.
 */

import dialog from "../modules/dialog";
import anchor from "../modules/anchor";
import component from "../modules/component";
import resizing from "../modules/resizing";
import fileManager from "../modules/fileManager";

export default {
  name: "image",
  display: "dialog",
  add: function (core) {
    core.addModule([dialog, anchor, component, resizing, fileManager]);

    const options = core.options;
    const context = core.context;
    const contextImage = (context.image = {
      infoList: [], // @Override fileManager
      infoIndex: 0, // @Override fileManager
      uploadFileLength: 0, // @Override fileManager
      focusElement: null, // @Override dialog // This element has focus when the dialog is opened.
      sizeUnit: options.imageSizeUnit,
      linkElement: "",
      altText: {},
      align: "none",
      floatClassRegExp: "__ke__float\\-[a-z]+",
      v_src: { linkValue: "" },
      svgDefaultSize: "30%",
      base64RenderIndex: 0,
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
      defaultSizeX: "auto",
      defaultSizeY: "auto",
      origin_w: options.imageWidth === "auto" ? "" : options.imageWidth,
      origin_h: options.imageHeight === "auto" ? "" : options.imageHeight,
      proportionChecked: true,
      resizing: options.imageResizing,
      resizeDotHide: !options.imageHeightShow,
      rotation: options.imageRotation,
      onlyPercentage: options.imageSizeOnlyPercentage,
      ratio: false,
      ratioX: 1,
      ratioY: 1,
      captionShow: true,
      captionChecked: false,
      caption: null,
      captionCheckEl: null,
    });

    /** image dialog */
    let image_dialog = this.setDialog(core);
    contextImage.modal = image_dialog;
    contextImage.imgInputFile = image_dialog.querySelector("._ke_image_file");
    contextImage.imgUrlFile = image_dialog.querySelector("._ke_image_url");
    contextImage.focusElement =
      contextImage.imgInputFile || contextImage.imgUrlFile;
    contextImage.altText = image_dialog.querySelector("._ke_image_alt");
    contextImage.captionCheckEl = image_dialog.querySelector(
      "._ke_image_check_caption"
    );
    contextImage.previewSrc = image_dialog.querySelector(
      "._ke_tab_content_image .ke-link-preview"
    );

    /** add event listeners */
    image_dialog
      .querySelector(".ke-dialog-tabs")
      .addEventListener("click", this.openTab.bind(core));
    image_dialog
      .querySelector("form")
      .addEventListener("submit", this.submit.bind(core));
    if (contextImage.imgInputFile) {
      image_dialog
        .querySelector(".ke-file-remove")
        .addEventListener(
          "click",
          this.removeSelectedFiles.bind(
            contextImage.imgInputFile,
            contextImage.imgUrlFile,
            contextImage.previewSrc
          )
        );
    }
    if (contextImage.imgUrlFile) {
      contextImage.imgUrlFile.addEventListener(
        "input",
        this.onLinkPreview.bind(
          contextImage.previewSrc,
          contextImage.v_src,
          options.linkProtocol
        )
      );
    }
    if (contextImage.imgInputFile && contextImage.imgUrlFile) {
      contextImage.imgInputFile.addEventListener(
        "change",
        this.fileInputChange.bind(contextImage)
      );
    }

    const imageGalleryButton = image_dialog.querySelector(".__ke__gallery");
    if (imageGalleryButton) {
      imageGalleryButton.addEventListener("click", this.openGallery.bind(core));
    }

    contextImage.proportion = {};
    contextImage.inputX = {};
    contextImage.inputY = {};
    if (options.imageResizing) {
      contextImage.proportion = image_dialog.querySelector(
        "._ke_image_check_proportion"
      );
      contextImage.inputX = image_dialog.querySelector("._ke_image_size_x");
      contextImage.inputY = image_dialog.querySelector("._ke_image_size_y");
      contextImage.inputX.value = options.imageWidth;
      contextImage.inputY.value = options.imageHeight;

      contextImage.inputX.addEventListener(
        "keyup",
        this.setInputSize.bind(core, "x")
      );
      contextImage.inputY.addEventListener(
        "keyup",
        this.setInputSize.bind(core, "y")
      );

      contextImage.inputX.addEventListener("change", this.setRatio.bind(core));
      contextImage.inputY.addEventListener("change", this.setRatio.bind(core));
      contextImage.proportion.addEventListener(
        "change",
        this.setRatio.bind(core)
      );

      image_dialog
        .querySelector(".ke-dialog-btn-revert")
        .addEventListener("click", this.sizeRevert.bind(core));
    }

    /** append html */
    context.dialog.modal.appendChild(image_dialog);

    /** link event */
    core.plugins.anchor.initEvent.call(
      core,
      "image",
      image_dialog.querySelector("._ke_tab_content_url")
    );
    contextImage.anchorCtx = core.context.anchor.caller.image;

    /** empty memory */
    image_dialog = null;
  },

  /** dialog */
  setDialog: function (core) {
    const option = core.options;
    const lang = core.lang;
    const dialog = core.util.createElement("DIV");

    dialog.className = "ke-dialog-content ke-dialog-image";
    dialog.style.display = "none";

    let html =
      "" +
      '<div class="ke-dialog-header">' +
      '<button type="button" data-command="close" class="ke-btn ke-dialog-close" class="close" aria-label="Close" title="' +
      lang.dialogBox.close +
      '">' +
      core.icons.cancel +
      "</button>" +
      '<span class="ke-modal-title">' +
      lang.dialogBox.imageBox.title +
      "</span>" +
      "</div>" +
      '<div class="ke-dialog-tabs">' +
      '<button type="button" class="_ke_tab_link active" data-tab-link="image">' +
      lang.toolbar.image +
      "</button>" +
      '<button type="button" class="_ke_tab_link" data-tab-link="url">' +
      lang.toolbar.link +
      "</button>" +
      "</div>" +
      '<form method="post" enctype="multipart/form-data">' +
      '<div class="_ke_tab_content _ke_tab_content_image">' +
      '<div class="ke-dialog-body"><div style="border-bottom: 1px dashed #ccc;">';

    if (option.imageFileInput) {
      html +=
        "" +
        '<div class="ke-dialog-form">' +
        "<label>" +
        lang.dialogBox.imageBox.file +
        "</label>" +
        '<div class="ke-dialog-form-files">' +
        '<input class="ke-input-form _ke_image_file" type="file" accept="' +
        option.imageAccept +
        '"' +
        (option.imageMultipleFile ? ' multiple="multiple"' : "") +
        "/>" +
        '<button type="button" class="ke-btn ke-dialog-files-edge-button ke-file-remove" title="' +
        lang.controller.remove +
        '">' +
        core.icons.cancel +
        "</button>" +
        "</div>" +
        "</div>";
    }

    if (option.imageUrlInput) {
      html +=
        "" +
        '<div class="ke-dialog-form">' +
        "<label>" +
        lang.dialogBox.imageBox.url +
        "</label>" +
        '<div class="ke-dialog-form-files">' +
        '<input class="ke-input-form ke-input-url _ke_image_url" type="text" />' +
        (option.imageGalleryUrl && core.plugins.imageGallery
          ? '<button type="button" class="ke-btn ke-dialog-files-edge-button __ke__gallery" title="' +
            lang.toolbar.imageGallery +
            '">' +
            core.icons.image_gallery +
            "</button>"
          : "") +
        "</div>" +
        '<pre class="ke-link-preview"></pre>' +
        "</div>";
    }

    html +=
      "</div>" +
      '<div class="ke-dialog-form">' +
      "<label>" +
      lang.dialogBox.imageBox.altText +
      '</label><input class="ke-input-form _ke_image_alt" type="text" />' +
      "</div>";

    if (option.imageResizing) {
      const onlyPercentage = option.imageSizeOnlyPercentage;
      const onlyPercentDisplay = onlyPercentage
        ? ' style="display: none !important;"'
        : "";
      const heightDisplay = !option.imageHeightShow
        ? ' style="display: none !important;"'
        : "";
      html += '<div class="ke-dialog-form">';
      if (onlyPercentage || !option.imageHeightShow) {
        html +=
          "" +
          '<div class="ke-dialog-size-text">' +
          '<label class="size-w">' +
          lang.dialogBox.size +
          "</label>" +
          "</div>";
      } else {
        html +=
          "" +
          '<div class="ke-dialog-size-text">' +
          '<label class="size-w">' +
          lang.dialogBox.width +
          "</label>" +
          '<label class="ke-dialog-size-x">&nbsp;</label>' +
          '<label class="size-h">' +
          lang.dialogBox.height +
          "</label>" +
          "</div>";
      }
      html +=
        "" +
        '<input class="ke-input-control _ke_image_size_x" placeholder="auto"' +
        (onlyPercentage ? ' type="number" min="1"' : 'type="text"') +
        (onlyPercentage ? ' max="100"' : "") +
        " />" +
        '<label class="ke-dialog-size-x"' +
        heightDisplay +
        ">" +
        (onlyPercentage ? "%" : "x") +
        "</label>" +
        '<input type="text" class="ke-input-control _ke_image_size_y" placeholder="auto"' +
        onlyPercentDisplay +
        (onlyPercentage ? ' max="100"' : "") +
        heightDisplay +
        "/>" +
        "<label" +
        onlyPercentDisplay +
        heightDisplay +
        '><input type="checkbox" class="ke-dialog-btn-check _ke_image_check_proportion" checked/>&nbsp;' +
        lang.dialogBox.proportion +
        "</label>" +
        '<button type="button" title="' +
        lang.dialogBox.revertButton +
        '" class="ke-btn ke-dialog-btn-revert" style="float: right;">' +
        core.icons.revert +
        "</button>" +
        "</div>";
    }

    html +=
      "" +
      '<div class="ke-dialog-form ke-dialog-form-footer">' +
      '<label><input type="checkbox" class="ke-dialog-btn-check _ke_image_check_caption" />&nbsp;' +
      lang.dialogBox.caption +
      "</label>" +
      "</div>" +
      "</div>" +
      "</div>" +
      '<div class="_ke_tab_content _ke_tab_content_url" style="display: none">' +
      core.context.anchor.forms.innerHTML +
      "</div>" +
      '<div class="ke-dialog-footer">' +
      "<div>" +
      '<label><input type="radio" name="kothingEditor_image_radio" class="ke-dialog-btn-radio" value="none" checked>' +
      lang.dialogBox.basic +
      "</label>" +
      '<label><input type="radio" name="kothingEditor_image_radio" class="ke-dialog-btn-radio" value="left">' +
      lang.dialogBox.left +
      "</label>" +
      '<label><input type="radio" name="kothingEditor_image_radio" class="ke-dialog-btn-radio" value="center">' +
      lang.dialogBox.center +
      "</label>" +
      '<label><input type="radio" name="kothingEditor_image_radio" class="ke-dialog-btn-radio" value="right">' +
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
    if (!this.imgInputFile.value) {
      this.imgUrlFile.removeAttribute("disabled");
      this.previewSrc.style.textDecoration = "";
    } else {
      this.imgUrlFile.setAttribute("disabled", true);
      this.previewSrc.style.textDecoration = "line-through";
    }
  },

  removeSelectedFiles: function (urlInput, previewSrc) {
    this.value = "";
    if (urlInput) {
      urlInput.removeAttribute("disabled");
      previewSrc.style.textDecoration = "";
    }
  },

  openGallery: function () {
    this.callPlugin(
      "imageGallery",
      this.plugins.imageGallery.open.bind(
        this,
        this.plugins.image.setUrlInput.bind(this.context.image)
      ),
      null
    );
  },

  setUrlInput: function (target) {
    this.altText.value = target.alt;
    this.v_src.linkValue =
      this.previewSrc.textContent =
      this.imgUrlFile.value =
        target.src;
    this.imgUrlFile.focus();
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
   * @Override @Required fileManager
   */
  fileTags: ["img"],

  /**
   * @Override core, fileManager, resizing
   * @description It is called from core.selectComponent.
   * @param {Element} element Target element
   */
  select: function (element) {
    this.plugins.image.onModifyMode.call(
      this,
      element,
      this.plugins.resizing.call_controller_resize.call(this, element, "image")
    );
  },

  /**
   * @Override fileManager, resizing
   */
  destroy: function (element) {
    const imageEl = element || this.context.image.element;
    const imageContainer =
      this.util.getParentElement(imageEl, this.util.isMediaComponent) ||
      imageEl;
    const dataIndex = imageEl.getAttribute("data-index") * 1;
    const focusEl =
      imageContainer.previousElementSibling ||
      imageContainer.nextElementSibling;

    const emptyDiv = imageContainer.parentNode;
    this.util.removeItem(imageContainer);
    this.plugins.image.init.call(this);
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
      "image",
      dataIndex,
      this.functions.onImageUpload
    );

    // history stack
    this.history.push(false);
  },

  /**
   * @Required @Override dialog
   */
  on: function (update) {
    const contextImage = this.context.image;

    if (!update) {
      contextImage.inputX.value = contextImage.origin_w =
        this.options.imageWidth === contextImage.defaultSizeX
          ? ""
          : this.options.imageWidth;
      contextImage.inputY.value = contextImage.origin_h =
        this.options.imageHeight === contextImage.defaultSizeY
          ? ""
          : this.options.imageHeight;
      if (contextImage.imgInputFile && this.options.imageMultipleFile) {
        contextImage.imgInputFile.setAttribute("multiple", "multiple");
      }
    } else {
      if (contextImage.imgInputFile && this.options.imageMultipleFile) {
        contextImage.imgInputFile.removeAttribute("multiple");
      }
    }
    this.plugins.anchor.on.call(this, contextImage.anchorCtx, update);
  },

  /**
   * @Required @Override dialog
   */
  open: function () {
    this.plugins.dialog.open.call(
      this,
      "image",
      "image" === this.currentControllerName
    );
  },

  openTab: function (e) {
    const modal = this.context.image.modal;
    const targetElement =
      e === "init" ? modal.querySelector("._ke_tab_link") : e.target;

    if (!/^BUTTON$/i.test(targetElement.tagName)) {
      return false;
    }

    // Declare all variables
    const tabName = targetElement.getAttribute("data-tab-link");
    const contentClassName = "_ke_tab_content";

    // Get all elements with class="tabcontent" and hide them
    const tabContent = modal.getElementsByClassName(contentClassName);
    for (let i = 0; i < tabContent.length; i++) {
      tabContent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    const tabLinks = modal.getElementsByClassName("_ke_tab_link");
    for (let i = 0; i < tabLinks.length; i++) {
      this.util.removeClass(tabLinks[i], "active");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    modal.querySelector("." + contentClassName + "_" + tabName).style.display =
      "block";
    this.util.addClass(targetElement, "active");

    // focus
    if (tabName === "image" && this.context.image.focusElement) {
      this.context.image.focusElement.focus();
    } else if (tabName === "url") {
      this.context.anchor.caller.image.urlInput.focus();
    }

    return false;
  },

  submit: function (e) {
    const contextImage = this.context.image;
    const imagePlugin = this.plugins.image;

    e.preventDefault();
    e.stopPropagation();

    contextImage.align = contextImage.modal.querySelector(
      'input[name="kothingEditor_image_radio"]:checked'
    ).value;
    contextImage.captionChecked = contextImage.captionCheckEl.checked;
    if (contextImage.resizing) {
      contextImage.proportionChecked = contextImage.proportion.checked;
    }

    try {
      if (this.context.dialog.updateModal) {
        imagePlugin.update_image.call(this, false, true, false);
      }

      if (
        contextImage.imgInputFile &&
        contextImage.imgInputFile.files.length > 0
      ) {
        this.showLoading();
        imagePlugin.submitAction.call(
          this,
          this.context.image.imgInputFile.files
        );
      } else if (
        contextImage.imgUrlFile &&
        contextImage.v_src.linkValue.length > 0
      ) {
        this.showLoading();
        imagePlugin.onRender_imgUrl.call(this);
      }
    } catch (error) {
      this.closeLoading();
      throw Error(
        '[KothingEditor.image.submit.fail] cause : "' + error.message + '"'
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
      if (/image/i.test(fileList[i].type)) {
        files.push(fileList[i]);
        fileSize += fileList[i].size;
      }
    }

    const limitSize = this.options.imageUploadSizeLimit;
    if (limitSize > 0) {
      let infoSize = 0;
      const imagesInfo = this.context.image.infoList;
      for (let i = 0, len = imagesInfo.length; i < len; i++) {
        infoSize += imagesInfo[i].size * 1;
      }

      if (fileSize + infoSize > limitSize) {
        this.closeLoading();
        const err =
          "[KothingEditor.imageUpload.fail] Size of uploadable total images: " +
          limitSize / 1000 +
          "KB";
        if (
          typeof this.functions.onImageUploadError !== "function" ||
          this.functions.onImageUploadError(
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

    const contextImage = this.context.image;
    contextImage.uploadFileLength = files.length;

    const anchor = this.plugins.anchor.createAnchor.call(
      this,
      contextImage.anchorCtx,
      true
    );
    const info = {
      anchor: anchor,
      inputWidth: contextImage.inputX.value,
      inputHeight: contextImage.inputY.value,
      align: contextImage.align,
      isUpdate: this.context.dialog.updateModal,
      element: contextImage.element,
    };

    if (typeof this.functions.onImageUploadBefore === "function") {
      const result = this.functions.onImageUploadBefore(
        files,
        info,
        this,
        function (data) {
          if (data && this._window.Array.isArray(data.result)) {
            this.plugins.image.register.call(this, info, data);
          } else {
            this.plugins.image.upload.call(this, info, data);
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
      if (this._window.Array.isArray(result) && result.length > 0) {
        files = result;
      }
    }

    this.plugins.image.upload.call(this, info, files);
  },

  error: function (message, response) {
    this.closeLoading();
    if (
      typeof this.functions.onImageUploadError !== "function" ||
      this.functions.onImageUploadError(message, response, this)
    ) {
      this.functions.noticeOpen(message);
      throw Error("[KothingEditor.plugin.image.error] response: " + message);
    }
  },

  upload: function (info, files) {
    if (!files) {
      this.closeLoading();
      return;
    }
    if (typeof files === "string") {
      this.plugins.image.error.call(this, files, null);
      return;
    }

    const imageUploadUrl = this.options.imageUploadUrl;
    const filesLen = this.context.dialog.updateModal ? 1 : files.length;

    // server upload
    if (typeof imageUploadUrl === "string" && imageUploadUrl.length > 0) {
      const formData = new FormData();
      for (let i = 0; i < filesLen; i++) {
        formData.append("file-" + i, files[i]);
      }
      this.plugins.fileManager.upload.call(
        this,
        imageUploadUrl,
        this.options.imageUploadHeader,
        formData,
        this.plugins.image.callBack_imgUpload.bind(this, info),
        this.functions.onImageUploadError
      );
    } else {
      // base64
      this.plugins.image.setup_reader.call(
        this,
        files,
        info.anchor,
        info.inputWidth,
        info.inputHeight,
        info.align,
        filesLen,
        info.isUpdate
      );
    }
  },

  callBack_imgUpload: function (info, xmlHttp) {
    if (typeof this.functions.imageUploadHandler === "function") {
      this.functions.imageUploadHandler(xmlHttp, info, this);
    } else {
      const response = JSON.parse(xmlHttp.responseText);
      if (response.errorMessage) {
        this.plugins.image.error.call(this, response.errorMessage, response);
      } else {
        this.plugins.image.register.call(this, info, response);
      }
    }
  },

  register: function (info, response) {
    const fileList = response.result;

    for (let i = 0, len = fileList.length, file; i < len; i++) {
      file = { name: fileList[i].name, size: fileList[i].size };
      if (info.isUpdate) {
        this.plugins.image.update_src.call(
          this,
          fileList[i].url,
          info.element,
          file
        );
        break;
      } else {
        this.plugins.image.create_image.call(
          this,
          fileList[i].url,
          info.anchor,
          info.inputWidth,
          info.inputHeight,
          info.align,
          file
        );
      }
    }

    this.closeLoading();
  },

  setup_reader: function (
    files,
    anchor,
    width,
    height,
    align,
    filesLen,
    isUpdate
  ) {
    try {
      this.context.image.base64RenderIndex = filesLen;
      const wFileReader = this._window.FileReader;
      const filesStack = [filesLen];
      this.context.image.inputX.value = width;
      this.context.image.inputY.value = height;

      for (let i = 0, reader, file; i < filesLen; i++) {
        reader = new wFileReader();
        file = files[i];

        reader.onload = function (reader, update, updateElement, file, index) {
          filesStack[index] = { result: reader.result, file: file };

          if (--this.context.image.base64RenderIndex === 0) {
            this.plugins.image.onRender_imgBase64.call(
              this,
              update,
              filesStack,
              updateElement,
              anchor,
              width,
              height,
              align
            );
            this.closeLoading();
          }
        }.bind(this, reader, isUpdate, this.context.image.element, file, i);

        reader.readAsDataURL(file);
      }
    } catch (e) {
      this.closeLoading();
      throw Error(
        '[KothingEditor.image.setup_reader.fail] cause : "' + e.message + '"'
      );
    }
  },

  onRender_imgBase64: function (
    update,
    filesStack,
    updateElement,
    anchor,
    width,
    height,
    align
  ) {
    const updateMethod = this.plugins.image.update_src;
    const createMethod = this.plugins.image.create_image;

    for (let i = 0, len = filesStack.length; i < len; i++) {
      if (update) {
        this.context.image.element.setAttribute(
          "data-file-name",
          filesStack[i].file.name
        );
        this.context.image.element.setAttribute(
          "data-file-size",
          filesStack[i].file.size
        );
        updateMethod.call(
          this,
          filesStack[i].result,
          updateElement,
          filesStack[i].file
        );
      } else {
        createMethod.call(
          this,
          filesStack[i].result,
          anchor,
          width,
          height,
          align,
          filesStack[i].file
        );
      }
    }
  },

  onRender_imgUrl: function () {
    const contextImage = this.context.image;
    if (contextImage.v_src.linkValue.length === 0) {
      return false;
    }

    try {
      const file = {
        name: contextImage.v_src.linkValue.split("/").pop(),
        size: 0,
      };
      if (this.context.dialog.updateModal) {
        this.plugins.image.update_src.call(
          this,
          contextImage.v_src.linkValue,
          contextImage.element,
          file
        );
      } else {
        this.plugins.image.create_image.call(
          this,
          contextImage.v_src.linkValue,
          this.plugins.anchor.createAnchor.call(
            this,
            contextImage.anchorCtx,
            true
          ),
          contextImage.inputX.value,
          contextImage.inputY.value,
          contextImage.align,
          file
        );
      }
    } catch (e) {
      throw Error(
        '[KothingEditor.image.URLRendering.fail] cause : "' + e.message + '"'
      );
    } finally {
      this.closeLoading();
    }
  },

  onRender_link: function (imgTag, anchor) {
    if (anchor) {
      anchor.setAttribute("data-image-link", "image");
      imgTag.setAttribute("data-image-link", anchor.href);
      anchor.appendChild(imgTag);
      return anchor;
    }

    return imgTag;
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

    this.plugins.resizing.module_setInputSize.call(
      this,
      this.context.image,
      xy
    );
  },

  /**
   * @Override resizing
   */
  setRatio: function () {
    this.plugins.resizing.module_setRatio.call(this, this.context.image);
  },

  /**
   * @Override fileManager
   */
  checkFileInfo: function () {
    const imagePlugin = this.plugins.image;
    const contextImage = this.context.image;

    const modifyHandler = function (tag) {
      imagePlugin.onModifyMode.call(this, tag, null);
      imagePlugin.openModify.call(this, true);
      // get size
      contextImage.inputX.value = contextImage.origin_w;
      contextImage.inputY.value = contextImage.origin_h;
      // get align
      const format = this.util.getFormatElement(tag);
      if (format) {
        contextImage.align = format.style.textAlign || format.style.float;
      }
      // link
      const link = this.util.getParentElement(tag, this.util.isAnchor);
      if (link && !contextImage.anchorCtx.linkValue) {
        contextImage.anchorCtx.linkValue = " ";
      }

      imagePlugin.update_image.call(this, true, false, true);
    }.bind(this);

    this.plugins.fileManager.checkInfo.call(
      this,
      "image",
      ["img"],
      this.functions.onImageUpload,
      modifyHandler,
      true
    );
  },

  /**
   * @Override fileManager
   */
  resetFileInfo: function () {
    this.plugins.fileManager.resetInfo.call(
      this,
      "image",
      this.functions.onImageUpload
    );
  },

  create_image: function (src, anchor, width, height, align, file) {
    const imagePlugin = this.plugins.image;
    const contextImage = this.context.image;
    this.context.resizing.resize_plugin = "image";

    const oImg = this.util.createElement("IMG");
    oImg.src = src;
    oImg.alt = contextImage.altText.value;
    oImg.setAttribute("data-rotate", "0");
    anchor = imagePlugin.onRender_link.call(this, oImg, anchor);

    if (contextImage.resizing) {
      oImg.setAttribute("data-proportion", contextImage.proportionChecked);
    }

    const cover = this.plugins.component.set_cover.call(this, anchor);
    const container = this.plugins.component.set_container.call(
      this,
      cover,
      "ke-image-container"
    );

    // caption
    if (contextImage.captionChecked) {
      contextImage.caption = this.plugins.component.create_caption.call(this);
      contextImage.caption.setAttribute("contenteditable", false);
      cover.appendChild(contextImage.caption);
    }

    contextImage.element = oImg;
    contextImage.cover = cover;
    contextImage.container = container;

    // set size
    imagePlugin.applySize.call(this, width, height);

    // align
    imagePlugin.setAlign.call(this, align, oImg, cover, container);

    oImg.onload = imagePlugin.image_create_onload.bind(
      this,
      oImg,
      contextImage.svgDefaultSize,
      container
    );
    if (this.insertComponent(container, true, true, true)) {
      this.plugins.fileManager.setInfo.call(
        this,
        "image",
        oImg,
        this.functions.onImageUpload,
        file,
        true
      );
    }
    this.context.resizing.resize_plugin = "";
  },

  image_create_onload: function (oImg, svgDefaultSize, container) {
    // svg exception handling
    if (oImg.offsetWidth === 0) {
      this.plugins.image.applySize.call(this, svgDefaultSize, "");
    }
    if (this.options.mediaAutoSelect) {
      this.selectComponent(oImg, "image");
    } else {
      const line = this.appendFormatTag(container, null);
      this.setRange(line, 0, line, 0);
    }
  },

  update_image: function (init, openController, notHistoryPush) {
    const contextImage = this.context.image;
    let imageEl = contextImage.element;
    let cover = contextImage.cover;
    let container = contextImage.container;
    let isNewContainer = false;

    if (cover === null) {
      isNewContainer = true;
      imageEl = contextImage.element.cloneNode(true);
      cover = this.plugins.component.set_cover.call(this, imageEl);
    }

    if (container === null) {
      cover = cover.cloneNode(true);
      imageEl = cover.querySelector("img");
      isNewContainer = true;
      container = this.plugins.component.set_container.call(
        this,
        cover,
        "ke-image-container"
      );
    } else if (isNewContainer) {
      container.innerHTML = "";
      container.appendChild(cover);
      contextImage.cover = cover;
      contextImage.element = imageEl;
      isNewContainer = false;
    }

    // check size
    let changeSize;
    const x = this.util.isNumber(contextImage.inputX.value)
      ? contextImage.inputX.value + contextImage.sizeUnit
      : contextImage.inputX.value;
    const y = this.util.isNumber(contextImage.inputY.value)
      ? contextImage.inputY.value + contextImage.sizeUnit
      : contextImage.inputY.value;
    if (/%$/.test(imageEl.style.width)) {
      changeSize = x !== container.style.width || y !== container.style.height;
    } else {
      changeSize = x !== imageEl.style.width || y !== imageEl.style.height;
    }

    // alt
    imageEl.alt = contextImage.altText.value;

    // caption
    let modifiedCaption = false;
    if (contextImage.captionChecked) {
      if (!contextImage.caption) {
        contextImage.caption = this.plugins.component.create_caption.call(this);
        cover.appendChild(contextImage.caption);
        modifiedCaption = true;
      }
    } else {
      if (contextImage.caption) {
        this.util.removeItem(contextImage.caption);
        contextImage.caption = null;
        modifiedCaption = true;
      }
    }

    // link
    const anchor = this.plugins.anchor.createAnchor.call(
      this,
      contextImage.anchorCtx,
      true
    );
    if (anchor) {
      contextImage.linkElement =
        contextImage.linkElement === anchor ? anchor.cloneNode(false) : anchor;
      cover.insertBefore(
        this.plugins.image.onRender_link.call(
          this,
          imageEl,
          contextImage.linkElement
        ),
        contextImage.caption
      );
    } else if (contextImage.linkElement !== null) {
      const imageElement = imageEl;
      imageElement.setAttribute("data-image-link", "");
      if (cover.contains(contextImage.linkElement)) {
        const newEl = imageElement.cloneNode(true);
        cover.removeChild(contextImage.linkElement);
        cover.insertBefore(newEl, contextImage.caption);
        imageEl = newEl;
      }
    }

    if (isNewContainer) {
      const existElement =
        this.util.isRangeFormatElement(contextImage.element.parentNode) ||
        this.util.isWysiwygDiv(contextImage.element.parentNode)
          ? contextImage.element
          : /^A$/i.test(contextImage.element.parentNode.nodeName)
          ? contextImage.element.parentNode
          : this.util.getFormatElement(contextImage.element) ||
            contextImage.element;

      if (
        this.util.isFormatElement(existElement) &&
        existElement.childNodes.length > 0
      ) {
        existElement.parentNode.insertBefore(container, existElement);
        this.util.removeItem(contextImage.element);
        // clean format tag
        this.util.removeEmptyNode(existElement, null);
        if (existElement.children.length === 0) {
          existElement.innerHTML = this.util.htmlRemoveWhiteSpace(
            existElement.innerHTML
          );
        }
      } else {
        if (this.util.isFormatElement(existElement.parentNode)) {
          const formats = existElement.parentNode;
          formats.parentNode.insertBefore(
            container,
            existElement.previousSibling ? formats.nextElementSibling : formats
          );
          this.util.removeItem(existElement);
        } else {
          existElement.parentNode.replaceChild(container, existElement);
        }
      }

      imageEl = container.querySelector("img");

      contextImage.element = imageEl;
      contextImage.cover = cover;
      contextImage.container = container;
    }

    // transform
    if (modifiedCaption || (!contextImage.onlyPercentage && changeSize)) {
      if (
        !init &&
        (/\d+/.test(imageEl.style.height) ||
          (this.context.resizing.rotateVertical && contextImage.captionChecked))
      ) {
        if (
          /%$/.test(contextImage.inputX.value) ||
          /%$/.test(contextImage.inputY.value)
        ) {
          this.plugins.resizing.resetTransform.call(this, imageEl);
        } else {
          this.plugins.resizing.setTransformSize.call(
            this,
            imageEl,
            this.util.getNumber(contextImage.inputX.value, 0),
            this.util.getNumber(contextImage.inputY.value, 0)
          );
        }
      }
    }

    // size
    if (contextImage.resizing) {
      imageEl.setAttribute("data-proportion", contextImage.proportionChecked);
      if (changeSize) {
        this.plugins.image.applySize.call(this);
      }
    }

    // align
    this.plugins.image.setAlign.call(this, null, imageEl, null, null);

    // set imagesInfo
    if (init) {
      this.plugins.fileManager.setInfo.call(
        this,
        "image",
        imageEl,
        this.functions.onImageUpload,
        null,
        true
      );
    }

    if (openController) {
      this.selectComponent(imageEl, "image");
    }

    // history stack
    if (!notHistoryPush) {
      this.history.push(false);
    }
  },

  update_src: function (src, element, file) {
    element.src = src;
    this._window.setTimeout(
      this.plugins.fileManager.setInfo.bind(
        this,
        "image",
        element,
        this.functions.onImageUpload,
        file,
        true
      )
    );
    this.selectComponent(element, "image");
  },

  /**
   * @Required @Override fileManager, resizing
   */
  onModifyMode: function (element, size) {
    if (!element) {
      return;
    }

    const contextImage = this.context.image;
    contextImage.linkElement = contextImage.anchorCtx.linkAnchor = /^A$/i.test(
      element.parentNode.nodeName
    )
      ? element.parentNode
      : null;
    contextImage.element = element;
    contextImage.cover = this.util.getParentElement(element, "FIGURE");
    contextImage.container = this.util.getParentElement(
      element,
      this.util.isMediaComponent
    );
    contextImage.caption = this.util.getChildElement(
      contextImage.cover,
      "FIGCAPTION"
    );
    contextImage.align =
      element.style.float || element.getAttribute("data-align") || "none";
    element.style.float = "";
    this.plugins.anchor.setCtx(
      contextImage.linkElement,
      contextImage.anchorCtx
    );

    if (size) {
      contextImage.element_w = size.w;
      contextImage.element_h = size.h;
      contextImage.element_t = size.t;
      contextImage.element_l = size.l;
    }

    let userSize =
      contextImage.element.getAttribute("data-size") ||
      contextImage.element.getAttribute("data-origin");
    let w, h;
    if (userSize) {
      userSize = userSize.split(",");
      w = userSize[0];
      h = userSize[1];
    } else if (size) {
      w = size.w;
      h = size.h;
    }

    contextImage.origin_w = w || element.style.width || element.width || "";
    contextImage.origin_h = h || element.style.height || element.height || "";
  },

  /**
   * @Required @Override fileManager, resizing
   */
  openModify: function (notOpen) {
    const contextImage = this.context.image;
    if (contextImage.imgUrlFile) {
      contextImage.v_src.linkValue =
        contextImage.previewSrc.textContent =
        contextImage.imgUrlFile.value =
          contextImage.element.src;
    }
    contextImage.altText.value = contextImage.element.alt;
    contextImage.modal.querySelector(
      'input[name="kothingEditor_image_radio"][value="' +
        contextImage.align +
        '"]'
    ).checked = true;
    contextImage.align = contextImage.modal.querySelector(
      'input[name="kothingEditor_image_radio"]:checked'
    ).value;
    contextImage.captionChecked = contextImage.captionCheckEl.checked =
      !!contextImage.caption;

    if (contextImage.resizing) {
      this.plugins.resizing.module_setModifyInputSize.call(
        this,
        contextImage,
        this.plugins.image
      );
    }

    if (!notOpen) {
      this.plugins.dialog.open.call(this, "image", true);
    }
  },

  /**
   * @Override fileManager
   */
  applySize: function (w, h) {
    const contextImage = this.context.image;

    if (!w) {
      w = contextImage.inputX.value || this.options.imageWidth;
    }
    if (!h) {
      h = contextImage.inputY.value || this.options.imageHeight;
    }

    if ((contextImage.onlyPercentage && !!w) || /%$/.test(w)) {
      this.plugins.image.setPercentSize.call(this, w, h);
      return true;
    } else if ((!w || w === "auto") && (!h || h === "auto")) {
      this.plugins.image.setAutoSize.call(this);
    } else {
      this.plugins.image.setSize.call(this, w, h, false);
    }

    return false;
  },

  /**
   * @Override resizing
   */
  sizeRevert: function () {
    this.plugins.resizing.module_sizeRevert.call(this, this.context.image);
  },

  /**
   * @Override resizing
   */
  setSize: function (w, h, notResetPercentage, direction) {
    const contextImage = this.context.image;
    const onlyW = /^(rw|lw)$/.test(direction);
    const onlyH = /^(th|bh)$/.test(direction);

    if (!onlyH) {
      contextImage.element.style.width = this.util.isNumber(w)
        ? w + contextImage.sizeUnit
        : w;
      this.plugins.image.cancelPercentAttr.call(this);
    }
    if (!onlyW) {
      contextImage.element.style.height = this.util.isNumber(h)
        ? h + contextImage.sizeUnit
        : /%$/.test(h)
        ? ""
        : h;
    }

    if (contextImage.align === "center") {
      this.plugins.image.setAlign.call(this, null, null, null, null);
    }
    if (!notResetPercentage) {
      contextImage.element.removeAttribute("data-percentage");
    }

    // save current size
    this.plugins.resizing.module_saveCurrentSize.call(this, contextImage);
  },

  /**
   * @Override resizing
   */
  setAutoSize: function () {
    const contextImage = this.context.image;

    this.plugins.resizing.resetTransform.call(this, contextImage.element);
    this.plugins.image.cancelPercentAttr.call(this);

    contextImage.element.style.maxWidth = "";
    contextImage.element.style.width = "";
    contextImage.element.style.height = "";
    contextImage.cover.style.width = "";
    contextImage.cover.style.height = "";

    this.plugins.image.setAlign.call(this, null, null, null, null);
    contextImage.element.setAttribute("data-percentage", "auto,auto");

    // save current size
    this.plugins.resizing.module_saveCurrentSize.call(this, contextImage);
  },

  /**
   * @Override resizing
   */
  setOriginSize: function () {
    const contextImage = this.context.image;
    contextImage.element.removeAttribute("data-percentage");

    this.plugins.resizing.resetTransform.call(this, contextImage.element);
    this.plugins.image.cancelPercentAttr.call(this);

    const originSize = (
      contextImage.element.getAttribute("data-origin") || ""
    ).split(",");
    const w = originSize[0];
    const h = originSize[1];

    if (originSize) {
      if (
        contextImage.onlyPercentage ||
        (/%$/.test(w) && (/%$/.test(h) || !/\d/.test(h)))
      ) {
        this.plugins.image.setPercentSize.call(this, w, h);
      } else {
        this.plugins.image.setSize.call(this, w, h);
      }

      // save current size
      this.plugins.resizing.module_saveCurrentSize.call(this, contextImage);
    }
  },

  /**
   * @Override resizing
   */
  setPercentSize: function (w, h) {
    const contextImage = this.context.image;
    h =
      !!h && !/%$/.test(h) && !this.util.getNumber(h, 0)
        ? this.util.isNumber(h)
          ? h + "%"
          : h
        : this.util.isNumber(h)
        ? h + contextImage.sizeUnit
        : h || "";
    const heightPercentage = /%$/.test(h);

    contextImage.container.style.width = this.util.isNumber(w) ? w + "%" : w;
    contextImage.container.style.height = "";
    contextImage.cover.style.width = "100%";
    contextImage.cover.style.height = !heightPercentage ? "" : h;
    contextImage.element.style.width = "100%";
    contextImage.element.style.height = heightPercentage ? "" : h;
    contextImage.element.style.maxWidth = "";

    if (contextImage.align === "center") {
      this.plugins.image.setAlign.call(this, null, null, null, null);
    }

    contextImage.element.setAttribute("data-percentage", w + "," + h);
    this.plugins.resizing.setCaptionPosition.call(this, contextImage.element);

    // save current size
    this.plugins.resizing.module_saveCurrentSize.call(this, contextImage);
  },

  /**
   * @Override resizing
   */
  cancelPercentAttr: function () {
    const contextImage = this.context.image;

    contextImage.cover.style.width = "";
    contextImage.cover.style.height = "";
    contextImage.container.style.width = "";
    contextImage.container.style.height = "";

    this.util.removeClass(
      contextImage.container,
      this.context.image.floatClassRegExp
    );
    this.util.addClass(
      contextImage.container,
      "__ke__float-" + contextImage.align
    );

    if (contextImage.align === "center") {
      this.plugins.image.setAlign.call(this, null, null, null, null);
    }
  },

  /**
   * @Override resizing
   */
  setAlign: function (align, element, cover, container) {
    const contextImage = this.context.image;

    if (!align) {
      align = contextImage.align;
    }
    if (!element) {
      element = contextImage.element;
    }
    if (!cover) {
      cover = contextImage.cover;
    }
    if (!container) {
      container = contextImage.container;
    }

    if (align && align !== "none") {
      cover.style.margin = "auto";
    } else {
      cover.style.margin = "0";
    }

    if (/%$/.test(element.style.width) && align === "center") {
      container.style.minWidth = "100%";
      cover.style.width = container.style.width;
    } else {
      container.style.minWidth = "";
      cover.style.width = this.context.resizing.rotateVertical
        ? element.style.height || element.offsetHeight
        : !element.style.width || element.style.width === "auto"
        ? ""
        : element.style.width || "100%";
    }

    if (!this.util.hasClass(container, "__ke__float-" + align)) {
      this.util.removeClass(container, contextImage.floatClassRegExp);
      this.util.addClass(container, "__ke__float-" + align);
    }

    element.setAttribute("data-align", align);
  },

  /**
   * @Override dialog
   */
  init: function () {
    const contextImage = this.context.image;
    if (contextImage.imgInputFile) {
      contextImage.imgInputFile.value = "";
    }
    if (contextImage.imgUrlFile) {
      contextImage.v_src.linkValue =
        contextImage.previewSrc.textContent =
        contextImage.imgUrlFile.value =
          "";
    }
    if (contextImage.imgInputFile && contextImage.imgUrlFile) {
      contextImage.imgUrlFile.removeAttribute("disabled");
      contextImage.previewSrc.style.textDecoration = "";
    }

    contextImage.altText.value = "";
    contextImage.modal.querySelector(
      'input[name="kothingEditor_image_radio"][value="none"]'
    ).checked = true;
    contextImage.captionCheckEl.checked = false;
    contextImage.element = null;
    this.plugins.image.openTab.call(this, "init");

    if (contextImage.resizing) {
      contextImage.inputX.value =
        this.options.imageWidth === contextImage.defaultSizeX
          ? ""
          : this.options.imageWidth;
      contextImage.inputY.value =
        this.options.imageHeight === contextImage.defaultSizeY
          ? ""
          : this.options.imageHeight;
      contextImage.proportion.checked = true;
      contextImage.ratio = false;
      contextImage.ratioX = 1;
      contextImage.ratioY = 1;
    }

    this.plugins.anchor.init.call(this, contextImage.anchorCtx);
  },
};
