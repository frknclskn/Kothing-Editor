/*
 * KothingEditor
 *
 * The WYSIWYG Rich Text Editor
 * Copyright Kothing.
 * MIT license.
 */

export default {
  name: "lineHeight",
  display: "submenu",
  add: function (core, targetElement) {
    const context = core.context;
    context.lineHeight = {
      sizeList: null,
      currentSize: -1,
    };

    /** set submenu */
    let listDiv = this.setSubmenu(core);
    let listUl = listDiv.querySelector("ul");

    /** add event listeners */
    listUl.addEventListener("click", this.pickup.bind(core));

    context.lineHeight.sizeList = listUl.querySelectorAll("li button");

    /** append target button menu */
    core.initMenuTarget(this.name, targetElement, listDiv);

    /** empty memory */
    listDiv = null;
    listUl = null;
  },

  setSubmenu: function (core) {
    const option = core.options;
    const lang = core.lang;
    const listDiv = core.util.createElement("DIV");

    listDiv.className = "ke-submenu ke-list-layer";

    const sizeList = !option.lineHeights
      ? [
          { text: "1", value: 1 },
          { text: "1.15", value: 1.15 },
          { text: "1.5", value: 1.5 },
          { text: "2", value: 2 },
        ]
      : option.lineHeights;

    let list =
      '<div class="ke-list-inner">' +
      '<ul class="ke-list-basic">' +
      '<li><button type="button" class="default_value ke-btn-list" title="' +
      lang.toolbar.default +
      '">(' +
      lang.toolbar.default +
      ")</button></li>";
    for (let i = 0, len = sizeList.length, size; i < len; i++) {
      size = sizeList[i];
      list +=
        '<li><button type="button" class="ke-btn-list" data-value="' +
        size.value +
        '" title="' +
        size.text +
        '">' +
        size.text +
        "</button></li>";
    }
    list += "</ul></div>";

    listDiv.innerHTML = list;

    return listDiv;
  },

  /**
   * @Override submenu
   */
  on: function () {
    const lineHeightContext = this.context.lineHeight;
    const sizeList = lineHeightContext.sizeList;
    const format = this.util.getFormatElement(this.getSelectionNode());
    const currentSize = !format ? "" : format.style.lineHeight + "";

    if (currentSize !== lineHeightContext.currentSize) {
      for (let i = 0, len = sizeList.length; i < len; i++) {
        if (currentSize === sizeList[i].getAttribute("data-value")) {
          this.util.addClass(sizeList[i], "active");
        } else {
          this.util.removeClass(sizeList[i], "active");
        }
      }

      lineHeightContext.currentSize = currentSize;
    }
  },

  pickup: function (e) {
    if (!/^BUTTON$/i.test(e.target.tagName)) {
      return false;
    }

    e.preventDefault();
    e.stopPropagation();

    const value = e.target.getAttribute("data-value") || "";
    const formats = this.getSelectedElements();

    for (let i = 0, len = formats.length; i < len; i++) {
      formats[i].style.lineHeight = value;
    }

    this.submenuOff();

    // history stack
    this.history.push(false);
  },
};
