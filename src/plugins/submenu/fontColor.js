/*
 * KothingEditor
 *
 * The WYSIWYG Rich Text Editor
 * Copyright Kothing.
 * MIT license.
 */

import colorPicker from "../modules/colorPicker";

export default {
  name: "fontColor",
  display: "submenu",
  add: function (core, targetElement) {
    core.addModule([colorPicker]);
    const context = core.context;
    context.fontColor = {
      previewEl: null,
      colorInput: null,
      colorList: null,
    };

    /** set submenu */
    let listDiv = this.setSubmenu(core);
    context.fontColor.colorInput = listDiv.querySelector(
      "._ke_color_picker_input"
    );

    /** add event listeners */
    context.fontColor.colorInput.addEventListener(
      "keyup",
      this.onChangeInput.bind(core)
    );
    listDiv
      .querySelector("._ke_color_picker_submit")
      .addEventListener("click", this.submit.bind(core));
    listDiv
      .querySelector("._ke_color_picker_remove")
      .addEventListener("click", this.remove.bind(core));
    listDiv.addEventListener("click", this.pickup.bind(core));
    context.fontColor.colorList = listDiv.querySelectorAll("li button");

    /** append target button menu */
    core.initMenuTarget(this.name, targetElement, listDiv);

    /** empty memory */
    listDiv = null;
  },

  setSubmenu: function (core) {
    const colorArea = core.context.colorPicker.colorListHTML;
    const listDiv = core.util.createElement("DIV");

    listDiv.className = "ke-submenu ke-list-layer";
    listDiv.innerHTML = colorArea;

    return listDiv;
  },

  /**
   * @Override submenu
   */
  on: function () {
    const contextPicker = this.context.colorPicker;
    const contextFontColor = this.context.fontColor;

    contextPicker.colorInput = contextFontColor.colorInput;
    const color = this.wwComputedStyle.color;
    contextPicker.defaultColor = color
      ? this.plugins.colorPicker.isHexColor(color)
        ? color
        : this.plugins.colorPicker.rgb2hex(color)
      : "#333333";
    contextPicker.styleProperty = "color";
    contextPicker.colorList = contextFontColor.colorList;

    this.plugins.colorPicker.init.call(this, this.getSelectionNode(), null);
  },

  /**
   * @Override colorPicker
   */
  onChangeInput: function (e) {
    this.plugins.colorPicker.setCurrentColor.call(this, e.target.value);
  },

  submit: function () {
    this.plugins.fontColor.applyColor.call(
      this,
      this.context.colorPicker.currentColor
    );
  },

  pickup: function (e) {
    e.preventDefault();
    e.stopPropagation();

    this.plugins.fontColor.applyColor.call(
      this,
      e.target.getAttribute("data-value")
    );
  },

  remove: function () {
    this.nodeChange(null, ["color"], ["span"], true);
    this.submenuOff();
  },

  applyColor: function (color) {
    if (!color) {
      return;
    }

    const newNode = this.util.createElement("SPAN");
    newNode.style.color = color;
    this.nodeChange(newNode, ["color"], null, null);

    this.submenuOff();
  },
};
