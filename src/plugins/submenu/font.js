/*
 * KothingEditor
 *
 * The WYSIWYG Rich Text Editor
 * Copyright Kothing.
 * MIT license.
 */

export default {
  name: "font",
  display: "submenu",
  add: function (core, targetElement) {
    const context = core.context;
    const icons = core.icons;
    context.font = {
      targetText: targetElement.querySelector(".txt"),
      targetTooltip: targetElement.parentNode.querySelector(".ke-tooltip-text"),
      _fontList: null,
      currentFont: "",
      icon: icons.font,
    };

    /** set submenu */
    let listDiv = this.setSubmenu(core);

    /** add event listeners */
    listDiv
      .querySelector(".ke-list-inner")
      .addEventListener("click", this.pickup.bind(core));

    context.font._fontList = listDiv.querySelectorAll("ul li button");

    /** append target button menu */
    core.initMenuTarget(this.name, targetElement, listDiv);

    /** empty memory */
    listDiv = null;
  },

  setSubmenu: function (core) {
    const option = core.options;
    const lang = core.lang;
    const listDiv = core.util.createElement("DIV");

    listDiv.className = "ke-submenu ke-list-layer ke-list-font-family";

    let font, text, i, len;
    let fontList = !option.font
      ? [
          "Arial",
          "Comic Sans MS",
          "Courier New",
          "Impact",
          "Georgia",
          "tahoma",
          "Trebuchet MS",
          "Verdana",
        ]
      : option.font;

    let list =
      '<div class="ke-list-inner">' +
      '<ul class="ke-list-basic">' +
      '<li><button type="button" class="default_value ke-btn-list" title="' +
      lang.toolbar.default +
      '">(' +
      lang.toolbar.default +
      ")</button></li>";
    for (i = 0, len = fontList.length; i < len; i++) {
      font = fontList[i];
      text = font.split(",")[0];
      list +=
        '<li><button type="button" class="ke-btn-list" data-value="' +
        font +
        '" data-txt="' +
        text +
        '" title="' +
        text +
        '" style="font-family:' +
        font +
        ';">' +
        text +
        "</button></li>";
    }
    list += "</ul></div>";
    listDiv.innerHTML = list;

    return listDiv;
  },

  /**
   * @Override core
   */
  active: function (element) {
    // const target = this.context.font.targetText;
    const target = this.context.font.targetText.firstElementChild;
    const tooltip = this.context.font.targetTooltip;
    const icon = this.context.font.icon;

    if (!element) {
      const fontElement = this.hasFocus
        ? this.wwComputedStyle.fontFamily
          ? `<span>${JSON.parse(this.wwComputedStyle.fontFamily)}</span>`
          : ""
        : icon;
      this.util.changeElement(target, fontElement);
      const font = this.hasFocus
        ? this.wwComputedStyle.fontFamily
          ? JSON.parse(this.wwComputedStyle.fontFamily)
          : ""
        : this.lang.toolbar.font;
      this.util.changeTxt(
        tooltip,
        this.hasFocus ? this.lang.toolbar.font + " (" + font + ")" : font
      );
    } else if (element.style && element.style.fontFamily.length > 0) {
      const selectFont = element.style.fontFamily.replace(/["']/g, "");
      this.util.changeElement(target, `<span>${selectFont}</span>`);
      this.util.changeTxt(
        tooltip,
        this.lang.toolbar.font + " (" + selectFont + ")"
      );
      return true;
    }

    return false;
  },

  /**
   * @Override submenu
   */
  on: function () {
    const fontContext = this.context.font;
    const fontList = fontContext._fontList;
    const currentFont = fontContext.targetText.textContent;

    if (currentFont !== fontContext.currentFont) {
      for (let i = 0, len = fontList.length; i < len; i++) {
        if (currentFont === fontList[i].getAttribute("data-value")) {
          this.util.addClass(fontList[i], "active");
        } else {
          this.util.removeClass(fontList[i], "active");
        }
      }

      fontContext.currentFont = currentFont;
    }
  },

  pickup: function (e) {
    if (!/^BUTTON$/i.test(e.target.tagName)) {
      return false;
    }

    e.preventDefault();
    e.stopPropagation();

    const value = e.target.getAttribute("data-value");

    if (value) {
      const newNode = this.util.createElement("SPAN");
      newNode.style.fontFamily = value;
      this.nodeChange(newNode, ["font-family"], null, null);
    } else {
      this.nodeChange(null, ["font-family"], ["span"], true);
    }

    this.submenuOff();
  },
};
