/*
 * KothingEditor
 *
 * The WYSIWYG Rich Text Editor
 * Copyright Kothing.
 * MIT license.
 */

export default {
  name: "resizing",
  /**
   * @description Constructor
   * Require context properties when resizing module
      inputX: Element,
      inputY: Element,
      container: null,
      cover: null,
      element: null,
      element_w: 1,
      element_h: 1,
      element_l: 0,
      element_t: 0,
      defaultSizeX: 'auto',
      defaultSizeY: 'auto',
      origin_w: core.options.imageWidth === 'auto' ? '' : core.options.imageWidth,
      origin_h: core.options.imageHeight === 'auto' ? '' : core.options.imageHeight,
      proportionChecked: true,
      // -- select function --
      resizing: core.options.imageResizing,
      resizeDotHide: !core.options.imageHeightShow,
      rotation: core.options.imageRotation,
      onlyPercentage: core.options.imageSizeOnlyPercentage,
      ratio: false,
      ratioX: 1,
      ratioY: 1
      captionShow: true,
      // -- when used caption (captionShow: true) --
      caption: null,
      captionChecked: false,
      captionCheckEl: null,
    * @param {Object} core Core object 
    */
  add: function (core) {
    const icons = core.icons;
    const context = core.context;
    context.resizing = {
      resizeClientX: 0,
      resizeClientY: 0,
      resize_plugin: "",
      resize_w: 0,
      resize_h: 0,
      origin_w: 0,
      origin_h: 0,
      rotateVertical: false,
      resize_direction: "",
      move_path: null,
      isChange: false,
      alignIcons: {
        basic: icons.align_justify,
        left: icons.align_left,
        right: icons.align_right,
        center: icons.align_center,
      },
    };

    /** resize controller, button */
    let resize_div_container = this.setController_resize(core);
    context.resizing.resizeContainer = resize_div_container;

    context.resizing.resizeDiv =
      resize_div_container.querySelector(".ke-modal-resize");
    context.resizing.resizeDot =
      resize_div_container.querySelector(".ke-resize-dot");
    context.resizing.resizeDisplay =
      resize_div_container.querySelector(".ke-resize-display");

    let resize_button = this.setController_button(core);
    context.resizing.resizeButton = resize_button;

    let resize_handles = (context.resizing.resizeHandles =
      context.resizing.resizeDot.querySelectorAll("span"));
    context.resizing.resizeButtonGroup = resize_button.querySelector(
      "._ke_resizing_btn_group"
    );
    context.resizing.rotationButtons = resize_button.querySelectorAll(
      "._ke_resizing_btn_group ._ke_rotation"
    );
    context.resizing.percentageButtons = resize_button.querySelectorAll(
      "._ke_resizing_btn_group ._ke_percentage"
    );

    context.resizing.alignMenu = resize_button.querySelector(
      ".ke-resizing-align-list"
    );
    context.resizing.alignMenuList =
      context.resizing.alignMenu.querySelectorAll("button");

    context.resizing.alignButton = resize_button.querySelector(
      "._ke_resizing_align_button"
    );
    context.resizing.autoSizeButton = resize_button.querySelector(
      "._ke_resizing_btn_group ._ke_auto_size"
    );
    context.resizing.captionButton = resize_button.querySelector(
      "._ke_resizing_caption_button"
    );

    /** add event listeners */
    resize_div_container.addEventListener("mousedown", function (e) {
      e.preventDefault();
    });
    resize_handles[0].addEventListener(
      "mousedown",
      this.onMouseDown_resize_handle.bind(core)
    );
    resize_handles[1].addEventListener(
      "mousedown",
      this.onMouseDown_resize_handle.bind(core)
    );
    resize_handles[2].addEventListener(
      "mousedown",
      this.onMouseDown_resize_handle.bind(core)
    );
    resize_handles[3].addEventListener(
      "mousedown",
      this.onMouseDown_resize_handle.bind(core)
    );
    resize_handles[4].addEventListener(
      "mousedown",
      this.onMouseDown_resize_handle.bind(core)
    );
    resize_handles[5].addEventListener(
      "mousedown",
      this.onMouseDown_resize_handle.bind(core)
    );
    resize_handles[6].addEventListener(
      "mousedown",
      this.onMouseDown_resize_handle.bind(core)
    );
    resize_handles[7].addEventListener(
      "mousedown",
      this.onMouseDown_resize_handle.bind(core)
    );
    resize_button.addEventListener(
      "click",
      this.onClick_resizeButton.bind(core)
    );

    /** append html */
    context.element.relative.appendChild(resize_div_container);
    context.element.relative.appendChild(resize_button);

    /** empty memory */
    resize_div_container = null;
    resize_button = null;
    resize_handles = null;
  },

  /** resize controller, button (image, iframe, video) */
  setController_resize: function (core) {
    const resize_container = core.util.createElement("DIV");

    resize_container.className = "ke-controller ke-resizing-container";
    resize_container.style.display = "none";
    resize_container.innerHTML =
      "" +
      '<div class="ke-modal-resize"></div>' +
      '<div class="ke-resize-dot">' +
      '<span class="tl"></span>' +
      '<span class="tr"></span>' +
      '<span class="bl"></span>' +
      '<span class="br"></span>' +
      '<span class="lw"></span>' +
      '<span class="th"></span>' +
      '<span class="rw"></span>' +
      '<span class="bh"></span>' +
      '<div class="ke-resize-display"></div>' +
      "</div>";

    return resize_container;
  },

  setController_button: function (core) {
    const lang = core.lang;
    const icons = core.icons;
    const resize_button = core.util.createElement("DIV");

    resize_button.className = "ke-controller ke-controller-resizing";
    resize_button.innerHTML =
      "" +
      '<div class="ke-arrow ke-arrow-up"></div>' +
      '<div class="ke-btn-group _ke_resizing_btn_group">' +
      '<button type="button" data-command="percent" data-value="1" class="ke-tooltip _ke_percentage">' +
      "<span>100%</span>" +
      '<span class="ke-tooltip-inner"><span class="ke-tooltip-text">' +
      lang.controller.resize100 +
      "</span></span>" +
      "</button>" +
      '<button type="button" data-command="percent" data-value="0.75" class="ke-tooltip _ke_percentage">' +
      "<span>75%</span>" +
      '<span class="ke-tooltip-inner"><span class="ke-tooltip-text">' +
      lang.controller.resize75 +
      "</span></span>" +
      "</button>" +
      '<button type="button" data-command="percent" data-value="0.5" class="ke-tooltip _ke_percentage">' +
      "<span>50%</span>" +
      '<span class="ke-tooltip-inner"><span class="ke-tooltip-text">' +
      lang.controller.resize50 +
      "</span></span>" +
      "</button>" +
      '<button type="button" data-command="auto" class="ke-btn ke-tooltip _ke_auto_size">' +
      icons.auto_size +
      '<span class="ke-tooltip-inner"><span class="ke-tooltip-text">' +
      lang.controller.autoSize +
      "</span></span>" +
      "</button>" +
      '<button type="button" data-command="rotate" data-value="-90" class="ke-btn ke-tooltip _ke_rotation">' +
      icons.rotate_left +
      '<span class="ke-tooltip-inner"><span class="ke-tooltip-text">' +
      lang.controller.rotateLeft +
      "</span></span>" +
      "</button>" +
      '<button type="button" data-command="rotate" data-value="90" class="ke-btn ke-tooltip _ke_rotation">' +
      icons.rotate_right +
      '<span class="ke-tooltip-inner"><span class="ke-tooltip-text">' +
      lang.controller.rotateRight +
      "</span></span>" +
      "</button>" +
      "</div>" +
      '<div class="ke-btn-group" style="padding-top: 0;">' +
      '<button type="button" data-command="mirror" data-value="h" class="ke-btn ke-tooltip">' +
      icons.mirror_horizontal +
      '<span class="ke-tooltip-inner"><span class="ke-tooltip-text">' +
      lang.controller.mirrorHorizontal +
      "</span></span>" +
      "</button>" +
      '<button type="button" data-command="mirror" data-value="v" class="ke-btn ke-tooltip">' +
      icons.mirror_vertical +
      '<span class="ke-tooltip-inner"><span class="ke-tooltip-text">' +
      lang.controller.mirrorVertical +
      "</span></span>" +
      "</button>" +
      '<button type="button" data-command="onalign" class="ke-btn ke-tooltip _ke_resizing_align_button">' +
      icons.align_justify +
      '<span class="ke-tooltip-inner"><span class="ke-tooltip-text">' +
      lang.toolbar.align +
      "</span></span>" +
      "</button>" +
      '<div class="ke-btn-group-sub kothing-editor-common ke-list-layer ke-resizing-align-list">' +
      '<div class="ke-list-inner">' +
      '<ul class="ke-list-basic">' +
      '<li><button type="button" class="ke-btn-list ke-tooltip" data-command="align" data-value="basic">' +
      icons.align_justify +
      '<span class="ke-tooltip-inner"><span class="ke-tooltip-text">' +
      lang.dialogBox.basic +
      "</span></span>" +
      "</button></li>" +
      '<li><button type="button" class="ke-btn-list ke-tooltip" data-command="align" data-value="left">' +
      icons.align_left +
      '<span class="ke-tooltip-inner"><span class="ke-tooltip-text">' +
      lang.dialogBox.left +
      "</span></span>" +
      "</button></li>" +
      '<li><button type="button" class="ke-btn-list ke-tooltip" data-command="align" data-value="center">' +
      icons.align_center +
      '<span class="ke-tooltip-inner"><span class="ke-tooltip-text">' +
      lang.dialogBox.center +
      "</span></span>" +
      "</button></li>" +
      '<li><button type="button" class="ke-btn-list ke-tooltip" data-command="align" data-value="right">' +
      icons.align_right +
      '<span class="ke-tooltip-inner"><span class="ke-tooltip-text">' +
      lang.dialogBox.right +
      "</span></span>" +
      "</button></li>" +
      "</ul>" +
      "</div>" +
      "</div>" +
      '<button type="button" data-command="caption" class="ke-btn ke-tooltip _ke_resizing_caption_button">' +
      icons.caption +
      '<span class="ke-tooltip-inner"><span class="ke-tooltip-text">' +
      lang.dialogBox.caption +
      "</span></span>" +
      "</button>" +
      '<button type="button" data-command="revert" class="ke-btn ke-tooltip">' +
      icons.revert +
      '<span class="ke-tooltip-inner"><span class="ke-tooltip-text">' +
      lang.dialogBox.revertButton +
      "</span></span>" +
      "</button>" +
      '<button type="button" data-command="update" class="ke-btn ke-tooltip">' +
      icons.modify +
      '<span class="ke-tooltip-inner"><span class="ke-tooltip-text">' +
      lang.controller.edit +
      "</span></span>" +
      "</button>" +
      '<button type="button" data-command="delete" class="ke-btn ke-tooltip">' +
      icons.delete +
      '<span class="ke-tooltip-inner"><span class="ke-tooltip-text">' +
      lang.controller.remove +
      "</span></span>" +
      "</button>" +
      "</div>";

    return resize_button;
  },

  /**
   * @description Gets the width size
   * @param {Object} contextPlugin context object of plugin (core.context[plugin])
   * @param {Element} element Target element
   * @param {Element} cover Cover element (FIGURE)
   * @param {Element} container Container element (DIV.ke-component)
   * @returns {String}
   */
  module_getSizeX: function (contextPlugin, element, cover, container) {
    if (!element) {
      element = contextPlugin.element;
    }
    if (!cover) {
      cover = contextPlugin.cover;
    }
    if (!container) {
      container = contextPlugin.container;
    }

    if (!element) {
      return "";
    }

    return !/%$/.test(element.style.width)
      ? element.style.width
      : ((container && this.util.getNumber(container.style.width, 2)) || 100) +
          "%";
  },

  /**
   * @description Gets the height size
   * @param {Object} contextPlugin context object of plugin (core.context[plugin])
   * @param {Element} element Target element
   * @param {Element} cover Cover element (FIGURE)
   * @param {Element} container Container element (DIV.ke-component)
   * @returns {String}
   */
  module_getSizeY: function (contextPlugin, element, cover, container) {
    if (!element) {
      element = contextPlugin.element;
    }
    if (!cover) {
      cover = contextPlugin.cover;
    }
    if (!container) {
      container = contextPlugin.container;
    }

    if (!container || !cover) {
      return (element && element.style.height) || "";
    }

    return this.util.getNumber(cover.style.paddingBottom, 0) > 0 &&
      !this.context.resizing.rotateVertical
      ? cover.style.height
      : !/%$/.test(element.style.height) || !/%$/.test(element.style.width)
      ? element.style.height
      : ((container && this.util.getNumber(container.style.height, 2)) || 100) +
        "%";
  },

  /**
   * @description Called at the "openModify" to put the size of the current target into the size input element.
   * @param {Object} contextPlugin context object of plugin (core.context[plugin])
   * @param {Object} pluginObj Plugin object
   */
  module_setModifyInputSize: function (contextPlugin, pluginObj) {
    const percentageRotation =
      contextPlugin.onlyPercentage && this.context.resizing.rotateVertical;
    contextPlugin.proportion.checked = contextPlugin.proportionChecked =
      contextPlugin.element.getAttribute("data-proportion") !== "false";

    let x = percentageRotation
      ? ""
      : this.plugins.resizing.module_getSizeX.call(this, contextPlugin);
    if (x === contextPlugin.defaultSizeX) {
      x = "";
    }
    if (contextPlugin.onlyPercentage) {
      x = this.util.getNumber(x, 2);
    }
    contextPlugin.inputX.value = x;
    pluginObj.setInputSize.call(this, "x");

    if (!contextPlugin.onlyPercentage) {
      let y = percentageRotation
        ? ""
        : this.plugins.resizing.module_getSizeY.call(this, contextPlugin);
      if (y === contextPlugin.defaultSizeY) {
        y = "";
      }
      if (contextPlugin.onlyPercentage) {
        y = this.util.getNumber(y, 2);
      }
      contextPlugin.inputY.value = y;
    }

    contextPlugin.inputX.disabled = percentageRotation ? true : false;
    contextPlugin.inputY.disabled = percentageRotation ? true : false;
    contextPlugin.proportion.disabled = percentageRotation ? true : false;

    pluginObj.setRatio.call(this);
  },

  /**
   * @description It is called in "setInputSize" (input tag keyupEvent),
   * checks the value entered in the input tag,
   * calculates the ratio, and sets the calculated value in the input tag of the opposite size.
   * @param {Object} contextPlugin context object of plugin (core.context[plugin])
   * @param {String} xy 'x': width, 'y': height
   */
  module_setInputSize: function (contextPlugin, xy) {
    if (contextPlugin.onlyPercentage) {
      if (xy === "x" && contextPlugin.inputX.value > 100) {
        contextPlugin.inputX.value = 100;
      }
      return;
    }

    if (
      contextPlugin.proportion.checked &&
      contextPlugin.ratio &&
      /\d/.test(contextPlugin.inputX.value) &&
      /\d/.test(contextPlugin.inputY.value)
    ) {
      const xUnit =
        contextPlugin.inputX.value.replace(/\d+|\./g, "") ||
        contextPlugin.sizeUnit;
      const yUnit =
        contextPlugin.inputY.value.replace(/\d+|\./g, "") ||
        contextPlugin.sizeUnit;

      if (xUnit !== yUnit) {
        return;
      }

      const dec = xUnit === "%" ? 2 : 0;

      if (xy === "x") {
        contextPlugin.inputY.value =
          this.util.getNumber(
            contextPlugin.ratioY *
              this.util.getNumber(contextPlugin.inputX.value, dec),
            dec
          ) + yUnit;
      } else {
        contextPlugin.inputX.value =
          this.util.getNumber(
            contextPlugin.ratioX *
              this.util.getNumber(contextPlugin.inputY.value, dec),
            dec
          ) + xUnit;
      }
    }
  },

  /**
   * @description It is called in "setRatio" (input and proportionCheck tags changeEvent),
   * checks the value of the input tag, calculates the ratio, and resets it in the input tag.
   * @param {Object} contextPlugin context object of plugin (core.context[plugin])
   */
  module_setRatio: function (contextPlugin) {
    const xValue = contextPlugin.inputX.value;
    const yValue = contextPlugin.inputY.value;

    if (
      contextPlugin.proportion.checked &&
      /\d+/.test(xValue) &&
      /\d+/.test(yValue)
    ) {
      const xUnit = xValue.replace(/\d+|\./g, "") || contextPlugin.sizeUnit;
      const yUnit = yValue.replace(/\d+|\./g, "") || contextPlugin.sizeUnit;

      if (xUnit !== yUnit) {
        contextPlugin.ratio = false;
      } else if (!contextPlugin.ratio) {
        const x = this.util.getNumber(xValue, 0);
        const y = this.util.getNumber(yValue, 0);

        contextPlugin.ratio = true;
        contextPlugin.ratioX = x / y;
        contextPlugin.ratioY = y / x;
      }
    } else {
      contextPlugin.ratio = false;
    }
  },

  /**
   * @description Revert size of element to origin size (plugin.origin_w, plugin.origin_h)
   * @param {Object} contextPlugin context object of plugin (core.context[plugin])
   */
  module_sizeRevert: function (contextPlugin) {
    if (contextPlugin.onlyPercentage) {
      contextPlugin.inputX.value =
        contextPlugin.origin_w > 100 ? 100 : contextPlugin.origin_w;
    } else {
      contextPlugin.inputX.value = contextPlugin.origin_w;
      contextPlugin.inputY.value = contextPlugin.origin_h;
    }
  },

  /**
   * @description Save the size data (element.setAttribute("data-size"))
   * Used at the "setSize" method
   * @param {Object} contextPlugin context object of plugin (core.context[plugin])
   */
  module_saveCurrentSize: function (contextPlugin) {
    const x = this.plugins.resizing.module_getSizeX.call(this, contextPlugin);
    const y = this.plugins.resizing.module_getSizeY.call(this, contextPlugin);
    contextPlugin.element.setAttribute("data-size", x + "," + y);
    if (contextPlugin.videoRatio) {
      contextPlugin.videoRatio = y;
    }
  },

  /**
   * @description Call the resizing module
   * @param {Element} targetElement Resizing target element
   * @param {string} plugin Plugin name
   * @returns {Object} Size of resizing div {w, h, t, l}
   */
  call_controller_resize: function (targetElement, plugin) {
    const contextResizing = this.context.resizing;
    const contextPlugin = this.context[plugin];
    contextResizing.resize_plugin = plugin;

    const resizeContainer = contextResizing.resizeContainer;
    const resizeDiv = contextResizing.resizeDiv;
    const offset = this.util.getOffset(
      targetElement,
      this.context.element.wysiwygFrame
    );

    const isVertical = (contextResizing.rotateVertical = /^(90|270)$/.test(
      Math.abs(targetElement.getAttribute("data-rotate")).toString()
    ));

    const w = isVertical
      ? targetElement.offsetHeight
      : targetElement.offsetWidth;
    const h = isVertical
      ? targetElement.offsetWidth
      : targetElement.offsetHeight;
    const t = offset.top;
    const l = offset.left - this.context.element.wysiwygFrame.scrollLeft;

    resizeContainer.style.top = t + "px";
    resizeContainer.style.left = l + "px";
    resizeContainer.style.width = w + "px";
    resizeContainer.style.height = h + "px";

    resizeDiv.style.top = "0px";
    resizeDiv.style.left = "0px";
    resizeDiv.style.width = w + "px";
    resizeDiv.style.height = h + "px";

    let align = targetElement.getAttribute("data-align") || "basic";
    align = align === "none" ? "basic" : align;

    // text
    const container = this.util.getParentElement(
      targetElement,
      this.util.isComponent
    );
    const cover = this.util.getParentElement(targetElement, "FIGURE");
    const displayX =
      this.plugins.resizing.module_getSizeX.call(
        this,
        contextPlugin,
        targetElement,
        cover,
        container
      ) || "auto";
    const displayY =
      contextPlugin.onlyPercentage && plugin === "image"
        ? ""
        : ", " +
          (this.plugins.resizing.module_getSizeY.call(
            this,
            contextPlugin,
            targetElement,
            cover,
            container
          ) || "auto");
    this.util.changeTxt(
      contextResizing.resizeDisplay,
      this.lang.dialogBox[align] + " (" + displayX + displayY + ")"
    );

    // resizing display
    contextResizing.resizeButtonGroup.style.display = contextPlugin.resizing
      ? ""
      : "none";
    const resizeDotShow =
      contextPlugin.resizing &&
      !contextPlugin.resizeDotHide &&
      !contextPlugin.onlyPercentage
        ? "flex"
        : "none";
    const resizeHandles = contextResizing.resizeHandles;
    for (let i = 0, len = resizeHandles.length; i < len; i++) {
      resizeHandles[i].style.display = resizeDotShow;
    }

    if (contextPlugin.resizing) {
      const rotations = contextResizing.rotationButtons;
      rotations[0].style.display = rotations[1].style.display =
        contextPlugin.rotation ? "" : "none";
    }

    // align icon
    const alignList = contextResizing.alignMenuList;
    this.util.changeElement(
      contextResizing.alignButton.firstElementChild,
      contextResizing.alignIcons[align]
    );
    for (let i = 0, len = alignList.length; i < len; i++) {
      if (alignList[i].getAttribute("data-value") === align) {
        this.util.addClass(alignList[i], "on");
      } else {
        this.util.removeClass(alignList[i], "on");
      }
    }

    // percentage active
    const pButtons = contextResizing.percentageButtons;
    const value =
      /%$/.test(targetElement.style.width) && /%$/.test(container.style.width)
        ? this.util.getNumber(container.style.width, 0) / 100 + ""
        : "";
    for (let i = 0, len = pButtons.length; i < len; i++) {
      if (pButtons[i].getAttribute("data-value") === value) {
        this.util.addClass(pButtons[i], "active");
      } else {
        this.util.removeClass(pButtons[i], "active");
      }
    }

    // caption display, active
    if (!contextPlugin.captionShow) {
      contextResizing.captionButton.style.display = "none";
    } else {
      contextResizing.captionButton.style.display = "";
      if (this.util.getChildElement(targetElement.parentNode, "figcaption")) {
        this.util.addClass(contextResizing.captionButton, "active");
        contextPlugin.captionChecked = true;
      } else {
        this.util.removeClass(contextResizing.captionButton, "active");
        contextPlugin.captionChecked = false;
      }
    }

    resizeContainer.style.display = "block";

    const addOffset = { left: 0, top: 50 };
    if (this.options.iframe) {
      addOffset.left -=
        this.context.element.wysiwygFrame.parentElement.offsetLeft;
      addOffset.top -=
        this.context.element.wysiwygFrame.parentElement.offsetTop;
    }

    this.setControllerPosition(
      contextResizing.resizeButton,
      resizeContainer,
      "bottom",
      addOffset
    );
    this.controllersOn(
      resizeContainer,
      contextResizing.resizeButton,
      this.util.setDisabledButtons.bind(
        this,
        false,
        this.resizingDisabledButtons
      ),
      targetElement,
      plugin
    );
    this.util.setDisabledButtons(true, this.resizingDisabledButtons);

    contextResizing.resize_w = w;
    contextResizing.resize_h = h;

    const originSize = (targetElement.getAttribute("origin-size") || "").split(
      ","
    );
    contextResizing.origin_w = originSize[0] || targetElement.naturalWidth;
    contextResizing.origin_h = originSize[1] || targetElement.naturalHeight;

    return {
      w: w,
      h: h,
      t: t,
      l: l,
    };
  },

  closeAlignMenu: null,

  /**
   * @description Open align submenu of module
   */
  openAlignMenu: function () {
    const alignButton = this.context.resizing.alignButton;
    this.util.addClass(alignButton, "on");
    this.context.resizing.alignMenu.style.top =
      alignButton.offsetTop + alignButton.offsetHeight + "px";
    this.context.resizing.alignMenu.style.left =
      alignButton.offsetLeft - alignButton.offsetWidth / 2 + "px";
    this.context.resizing.alignMenu.style.display = "block";

    this.plugins.resizing.closeAlignMenu = function () {
      this.util.removeClass(this.context.resizing.alignButton, "on");
      this.context.resizing.alignMenu.style.display = "none";
      this.removeDocEvent("click", this.plugins.resizing.closeAlignMenu);
      this.plugins.resizing.closeAlignMenu = null;
    }.bind(this);

    this.addDocEvent("click", this.plugins.resizing.closeAlignMenu);
  },

  /**
   * @description Click event of resizing toolbar
   * Performs the action of the clicked toolbar button.
   * @param {MouseEvent} e Event object
   */
  onClick_resizeButton: function (e) {
    e.stopPropagation();

    const target = e.target;
    const command =
      target.getAttribute("data-command") ||
      target.parentNode.getAttribute("data-command");

    if (!command) {
      return;
    }

    const value =
      target.getAttribute("data-value") ||
      target.parentNode.getAttribute("data-value");

    const pluginName = this.context.resizing.resize_plugin;
    const currentContext = this.context[pluginName];
    const contextEl = currentContext.element;
    const currentModule = this.plugins[pluginName];

    e.preventDefault();

    if (typeof this.plugins.resizing.closeAlignMenu === "function") {
      this.plugins.resizing.closeAlignMenu();
      if (command === "onalign") {
        return;
      }
    }

    switch (command) {
      case "auto":
        this.plugins.resizing.resetTransform.call(this, contextEl);
        currentModule.setAutoSize.call(this);
        this.selectComponent(contextEl, pluginName);
        break;
      case "percent":
        let percentY = this.plugins.resizing.module_getSizeY.call(
          this,
          currentContext
        );
        if (this.context.resizing.rotateVertical) {
          const percentage = contextEl.getAttribute("data-percentage");
          if (percentage) {
            percentY = percentage.split(",")[1];
          }
        }

        this.plugins.resizing.resetTransform.call(this, contextEl);
        currentModule.setPercentSize.call(
          this,
          value * 100,
          this.util.getNumber(percentY, 0) === null || !/%$/.test(percentY)
            ? ""
            : percentY
        );
        this.selectComponent(contextEl, pluginName);
        break;
      case "mirror":
        const r = contextEl.getAttribute("data-rotate") || "0";
        let x = contextEl.getAttribute("data-rotateX") || "";
        let y = contextEl.getAttribute("data-rotateY") || "";

        if (
          (value === "h" && !this.context.resizing.rotateVertical) ||
          (value === "v" && this.context.resizing.rotateVertical)
        ) {
          y = y ? "" : "180";
        } else {
          x = x ? "" : "180";
        }

        contextEl.setAttribute("data-rotateX", x);
        contextEl.setAttribute("data-rotateY", y);

        this.plugins.resizing.setTransForm(contextEl, r, x, y);
        break;
      case "rotate":
        const contextResizing = this.context.resizing;
        const slope = contextEl.getAttribute("data-rotate") * 1 + value * 1;
        const deg = this._window.Math.abs(slope) >= 360 ? 0 : slope;

        contextEl.setAttribute("data-rotate", deg);
        contextResizing.rotateVertical = /^(90|270)$/.test(
          this._window.Math.abs(deg).toString()
        );
        this.plugins.resizing.setTransformSize.call(
          this,
          contextEl,
          null,
          null
        );

        this.selectComponent(contextEl, pluginName);
        break;
      case "onalign":
        this.plugins.resizing.openAlignMenu.call(this);
        return;
      case "align":
        const alignValue = value === "basic" ? "none" : value;
        currentModule.setAlign.call(this, alignValue, null, null, null);
        this.selectComponent(contextEl, pluginName);
        break;
      case "caption":
        const caption = !currentContext.captionChecked;
        currentModule.openModify.call(this, true);
        currentContext.captionChecked = currentContext.captionCheckEl.checked =
          caption;

        currentModule.update_image.call(this, false, false, false);

        if (caption) {
          const captionText = this.util.getChildElement(
            currentContext.caption,
            function (current) {
              return current.nodeType === 3;
            }
          );

          if (!captionText) {
            currentContext.caption.focus();
          } else {
            this.setRange(
              captionText,
              0,
              captionText,
              captionText.textContent.length
            );
          }

          this.controllersOff();
        } else {
          this.selectComponent(contextEl, pluginName);
          currentModule.openModify.call(this, true);
        }

        break;
      case "revert":
        currentModule.setOriginSize.call(this);
        this.selectComponent(contextEl, pluginName);
        break;
      case "update":
        currentModule.openModify.call(this);
        this.controllersOff();
        break;
      case "delete":
        currentModule.destroy.call(this);
        break;
    }

    // history stack
    this.history.push(false);
  },

  /**
   * @description Initialize the transform style (rotation) of the element.
   * @param {Element} element Target element
   */
  resetTransform: function (element) {
    const size = (
      element.getAttribute("data-size") ||
      element.getAttribute("data-origin") ||
      ""
    ).split(",");
    this.context.resizing.rotateVertical = false;

    element.style.maxWidth = "";
    element.style.transform = "";
    element.style.transformOrigin = "";
    element.setAttribute("data-rotate", "");
    element.setAttribute("data-rotateX", "");
    element.setAttribute("data-rotateY", "");

    this.plugins[this.context.resizing.resize_plugin].setSize.call(
      this,
      size[0] ? size[0] : "auto",
      size[1] ? size[1] : "",
      true
    );
  },

  /**
   * @description Set the transform style (rotation) of the element.
   * @param {Element} element Target element
   * @param {Number|null} width Element's width size
   * @param {Number|null} height Element's height size
   */
  setTransformSize: function (element, width, height) {
    let percentage = element.getAttribute("data-percentage");
    const isVertical = this.context.resizing.rotateVertical;
    const deg = element.getAttribute("data-rotate") * 1;
    let transOrigin = "";

    if (percentage && !isVertical) {
      percentage = percentage.split(",");
      if (percentage[0] === "auto" && percentage[1] === "auto") {
        this.plugins[this.context.resizing.resize_plugin].setAutoSize.call(
          this
        );
      } else {
        this.plugins[this.context.resizing.resize_plugin].setPercentSize.call(
          this,
          percentage[0],
          percentage[1]
        );
      }
    } else {
      const cover = this.util.getParentElement(element, "FIGURE");

      const offsetW = width || element.offsetWidth;
      const offsetH = height || element.offsetHeight;
      const w = (isVertical ? offsetH : offsetW) + "px";
      const h = (isVertical ? offsetW : offsetH) + "px";

      this.plugins[this.context.resizing.resize_plugin].cancelPercentAttr.call(
        this
      );
      this.plugins[this.context.resizing.resize_plugin].setSize.call(
        this,
        offsetW + "px",
        offsetH + "px",
        true
      );

      cover.style.width = w;
      cover.style.height = this.context[this.context.resizing.resize_plugin]
        .caption
        ? ""
        : h;

      if (isVertical) {
        const transW = offsetW / 2 + "px " + offsetW / 2 + "px 0";
        const transH = offsetH / 2 + "px " + offsetH / 2 + "px 0";
        transOrigin = deg === 90 || deg === -270 ? transH : transW;
      }
    }

    element.style.transformOrigin = transOrigin;
    this.plugins.resizing.setTransForm(
      element,
      deg.toString(),
      element.getAttribute("data-rotateX") || "",
      element.getAttribute("data-rotateY") || ""
    );

    if (isVertical) {
      element.style.maxWidth = "none";
    } else {
      element.style.maxWidth = "";
    }

    this.plugins.resizing.setCaptionPosition.call(this, element);
  },

  setTransForm: function (element, r, x, y) {
    let width =
      (element.offsetWidth - element.offsetHeight) * (/-/.test(r) ? 1 : -1);
    let translate = "";

    if (/[1-9]/.test(r) && (x || y)) {
      translate = x ? "Y" : "X";

      switch (r) {
        case "90":
          translate = x && y ? "X" : y ? translate : "";
          break;
        case "270":
          width *= -1;
          translate = x && y ? "Y" : x ? translate : "";
          break;
        case "-90":
          translate = x && y ? "Y" : x ? translate : "";
          break;
        case "-270":
          width *= -1;
          translate = x && y ? "X" : y ? translate : "";
          break;
        default:
          translate = "";
      }
    }

    if (r % 180 === 0) {
      element.style.maxWidth = "";
    }

    element.style.transform =
      "rotate(" +
      r +
      "deg)" +
      (x ? " rotateX(" + x + "deg)" : "") +
      (y ? " rotateY(" + y + "deg)" : "") +
      (translate ? " translate" + translate + "(" + width + "px)" : "");
  },

  /**
   * @description The position of the caption is set automatically.
   * @param {Element} element Target element (not caption element)
   */
  setCaptionPosition: function (element) {
    const figcaption = this.util.getChildElement(
      this.util.getParentElement(element, "FIGURE"),
      "FIGCAPTION"
    );
    if (figcaption) {
      figcaption.style.marginTop =
        (this.context.resizing.rotateVertical
          ? element.offsetWidth - element.offsetHeight
          : 0) + "px";
    }
  },

  /**
   * @description Mouse down event of resize handles
   * @param {MouseEvent} e Event object
   */
  onMouseDown_resize_handle: function (e) {
    e.stopPropagation();
    e.preventDefault();

    const contextResizing = this.context.resizing;
    const direction = (contextResizing.resize_direction =
      e.target.classList[0]);

    contextResizing.resizeClientX = e.clientX;
    contextResizing.resizeClientY = e.clientY;
    this.context.element.resizeBackground.style.display = "block";
    contextResizing.resizeButton.style.display = "none";
    contextResizing.resizeDiv.style.float = /l/.test(direction)
      ? "right"
      : /r/.test(direction)
      ? "left"
      : "none";

    const resizing_element_bind = this.plugins.resizing.resizing_element.bind(
      this,
      contextResizing,
      direction,
      this.context[contextResizing.resize_plugin]
    );

    const closureFunc_bind = function closureFunc(e) {
      if (e.type === "keydown" && e.keyCode !== 27) {
        return;
      }

      const change = contextResizing.isChange;
      contextResizing.isChange = false;

      this.removeDocEvent("mousemove", resizing_element_bind);
      this.removeDocEvent("mouseup", closureFunc_bind);
      this.removeDocEvent("keydown", closureFunc_bind);

      if (e.type === "keydown") {
        this.controllersOff();
        this.context.element.resizeBackground.style.display = "none";
        this.plugins[this.context.resizing.resize_plugin].init.call(this);
      } else {
        // element resize
        this.plugins.resizing.cancel_controller_resize.call(this, direction);
        // history stack
        if (change) {
          this.history.push(false);
        }
      }
    }.bind(this);

    this.addDocEvent("mousemove", resizing_element_bind);
    this.addDocEvent("mouseup", closureFunc_bind);
    this.addDocEvent("keydown", closureFunc_bind);
  },

  /**
   * @description Mouse move event after call "onMouseDown_resize_handle" of resize handles
   * The size of the module's "div" is adjusted according to the mouse move event.
   * @param {Object} contextResizing "core.context.resizing" object (binding argument)
   * @param {String} direction Direction ("tl", "tr", "bl", "br", "lw", "th", "rw", "bh") (binding argument)
   * @param {Object} plugin "core.context[currentPlugin]" object (binding argument)
   * @param {MouseEvent} e Event object
   */
  resizing_element: function (contextResizing, direction, plugin, e) {
    const clientX = e.clientX;
    const clientY = e.clientY;

    let resultW = plugin.element_w;
    let resultH = plugin.element_h;

    const w =
      plugin.element_w +
      (/r/.test(direction)
        ? clientX - contextResizing.resizeClientX
        : contextResizing.resizeClientX - clientX);
    const h =
      plugin.element_h +
      (/b/.test(direction)
        ? clientY - contextResizing.resizeClientY
        : contextResizing.resizeClientY - clientY);
    const wh = (plugin.element_h / plugin.element_w) * w;

    if (/t/.test(direction)) {
      contextResizing.resizeDiv.style.top =
        plugin.element_h - (/h/.test(direction) ? h : wh) + "px";
    }
    if (/l/.test(direction)) {
      contextResizing.resizeDiv.style.left = plugin.element_w - w + "px";
    }

    if (/r|l/.test(direction)) {
      contextResizing.resizeDiv.style.width = w + "px";
      resultW = w;
    }

    if (/^(t|b)[^h]$/.test(direction)) {
      contextResizing.resizeDiv.style.height = wh + "px";
      resultH = wh;
    } else if (/^(t|b)h$/.test(direction)) {
      contextResizing.resizeDiv.style.height = h + "px";
      resultH = h;
    }

    contextResizing.resize_w = resultW;
    contextResizing.resize_h = resultH;
    this.util.changeTxt(
      contextResizing.resizeDisplay,
      this._window.Math.round(resultW) +
        " x " +
        this._window.Math.round(resultH)
    );
    contextResizing.isChange = true;
  },

  /**
   * @description Resize the element to the size of the "div" adjusted in the "resizing_element" method.
   * Called at the mouse-up event registered in "onMouseDown_resize_handle".
   * @param {String} direction Direction ("tl", "tr", "bl", "br", "lw", "th", "rw", "bh")
   */
  cancel_controller_resize: function (direction) {
    const isVertical = this.context.resizing.rotateVertical;
    this.controllersOff();
    this.context.element.resizeBackground.style.display = "none";

    let w = this._window.Math.round(
      isVertical
        ? this.context.resizing.resize_h
        : this.context.resizing.resize_w
    );
    let h = this._window.Math.round(
      isVertical
        ? this.context.resizing.resize_w
        : this.context.resizing.resize_h
    );

    if (!isVertical && !/%$/.test(w)) {
      const padding = 16;
      const limit =
        this.context.element.wysiwygFrame.clientWidth - padding * 2 - 2;

      if (this.util.getNumber(w, 0) > limit) {
        h = this._window.Math.round((h / w) * limit);
        w = limit;
      }
    }

    const pluginName = this.context.resizing.resize_plugin;
    this.plugins[pluginName].setSize.call(this, w, h, false, direction);
    if (isVertical) {
      this.plugins.resizing.setTransformSize.call(
        this,
        this.context[this.context.resizing.resize_plugin].element,
        w,
        h
      );
    }

    this.selectComponent(this.context[pluginName].element, pluginName);
  },
};
