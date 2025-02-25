/*
 * KothingEditor
 *
 * The WYSIWYG Rich Text Editor
 * Copyright Kothing.
 * MIT license.
 */

export default {
  name: "paragraphStyle",
  display: "submenu",
  add: function (core, targetElement) {
    const context = core.context;
    context.paragraphStyle = {
      classList: null,
    };

    /** set submenu */
    let listDiv = this.setSubmenu(core);

    /** add event listeners */
    listDiv
      .querySelector("ul")
      .addEventListener("click", this.pickUp.bind(core));

    context.paragraphStyle.classList = listDiv.querySelectorAll("li button");

    /** append target button menu */
    core.initMenuTarget(this.name, targetElement, listDiv);

    /** empty memory */
    listDiv = null;
  },

  setSubmenu: function (core) {
    const option = core.options;
    const listDiv = core.util.createElement("DIV");
    listDiv.className = "ke-submenu ke-list-layer ke-list-format";

    const menuLang = core.lang.menu;
    const defaultList = {
      spaced: {
        name: menuLang.spaced,
        class: "__ke__p-spaced",
        _class: "",
      },
      bordered: {
        name: menuLang.bordered,
        class: "__ke__p-bordered",
        _class: "",
      },
      neon: {
        name: menuLang.neon,
        class: "__ke__p-neon",
        _class: "",
      },
    };
    const paragraphStyles =
      !option.paragraphStyles || option.paragraphStyles.length === 0
        ? ["spaced", "bordered", "neon"]
        : option.paragraphStyles;

    let list = '<div class="ke-list-inner"><ul class="ke-list-basic">';
    for (
      let i = 0, len = paragraphStyles.length, p, name, attrs, _class;
      i < len;
      i++
    ) {
      p = paragraphStyles[i];

      if (typeof p === "string") {
        const defaultStyle = defaultList[p.toLowerCase()];
        if (!defaultStyle) {
          continue;
        }
        p = defaultStyle;
      }

      name = p.name;
      attrs = p.class ? ' class="' + p.class + '"' : "";
      _class = p.class;

      list +=
        "<li>" +
        '<button type="button" class="ke-btn-list' +
        (_class ? " " + _class : "") +
        '" data-value="' +
        p.class +
        '" title="' +
        name +
        '">' +
        "<div" +
        attrs +
        ">" +
        name +
        "</div>" +
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
    const paragraphContext = this.context.paragraphStyle;
    const paragraphList = paragraphContext.classList;
    const currentFormat = this.util.getFormatElement(this.getSelectionNode());

    for (let i = 0, len = paragraphList.length; i < len; i++) {
      if (
        this.util.hasClass(
          currentFormat,
          paragraphList[i].getAttribute("data-value")
        )
      ) {
        this.util.addClass(paragraphList[i], "active");
      } else {
        this.util.removeClass(paragraphList[i], "active");
      }
    }
  },

  pickUp: function (e) {
    e.preventDefault();
    e.stopPropagation();

    let target = e.target;
    let value = null;

    while (!/^UL$/i.test(target.tagName)) {
      value = target.getAttribute("data-value");
      if (value) {
        break;
      }
      target = target.parentNode;
    }

    if (!value) {
      return;
    }

    let selectedFormsts = this.getSelectedElements();
    if (selectedFormsts.length === 0) {
      this.getRange_addLine(this.getRange(), null);
      selectedFormsts = this.getSelectedElements();
      if (selectedFormsts.length === 0) {
        return;
      }
    }

    // change format class
    const toggleClass = this.util.hasClass(target, "active")
      ? this.util.removeClass.bind(this.util)
      : this.util.addClass.bind(this.util);
    for (let i = 0, len = selectedFormsts.length; i < len; i++) {
      toggleClass(selectedFormsts[i], value);
    }

    this.submenuOff();

    // history stack
    this.history.push(false);
  },
};
