/*
 * KothingEditor
 *
 * The WYSIWYG Rich Text Editor
 * Copyright Kothing.
 * MIT license.
 */

export default {
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
