/*
 * KothingEditor
 *
 * The WYSIWYG Rich Text Editor
 * Copyright Kothing.
 * MIT license.
 */

(function (global, factory) {
  if (typeof module === "object" && typeof module.exports === "object") {
    module.exports = global.document
      ? factory(global, true)
      : function (w) {
          if (!w.document) {
            throw new Error("KothingEditor_MODULES a window with a document");
          }
          return factory(w);
        };
  } else {
    factory(global);
  }
})(typeof window !== "undefined" ? window : this, function (window, noGlobal) {
  const component = {
    name: "component",
    /**
     * @description Create a container for the resizing component and insert the element.
     * @param {Element} cover Cover element (FIGURE)
     * @param {String} className Class name of container (fixed: ke-component)
     * @returns {Element} Created container element
     */
    set_container: function (cover, className) {
      const container = this.util.createElement("DIV");
      container.className = "ke-component " + className;
      container.setAttribute("contenteditable", false);
      container.appendChild(cover);

      return container;
    },

    /**
     * @description Cover the target element with a FIGURE element.
     * @param {Element} element Target element
     */
    set_cover: function (element) {
      const cover = this.util.createElement("FIGURE");
      cover.appendChild(element);

      return cover;
    },

    /**
     * @description Return HTML string of caption(FIGCAPTION) element
     * @returns {String}
     */
    create_caption: function () {
      const caption = this.util.createElement("FIGCAPTION");
      caption.setAttribute("contenteditable", true);
      caption.innerHTML = "<div>" + this.lang.dialogBox.caption + "</div>";
      return caption;
    },
  };

  if (typeof noGlobal === typeof undefined) {
    if (!window.KothingEditor_MODULES) {
      Object.defineProperty(window, "KothingEditor_MODULES", {
        enumerable: true,
        writable: false,
        configurable: false,
        value: {},
      });
    }

    Object.defineProperty(window.KothingEditor_MODULES, "component", {
      enumerable: true,
      writable: false,
      configurable: false,
      value: component,
    });
  }

  return component;
});
