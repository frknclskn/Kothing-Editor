/*
 * Rich Text Editor
 *
 * kothing-ditor.js
 * Copyright Kothing.
 * MIT license.
 */
import util from "../../lib/util";

export default {
  name: "dialog",
  /**
   * @description Constructor
   * @param {Object} core Core object
   */
  util: util,
  add: function (core) {
    const context = core.context;
    context.dialog = {
      kind: "",
      updateModal: false,
      closeSignal: false,
    };

    /** dialog */
    let dialog_div = core.util.createElement("DIV");
    dialog_div.className = "ke-dialog kothing-editor-common";

    let dialog_back = core.util.createElement("DIV");
    dialog_back.className = "ke-dialog-back";
    dialog_back.style.display = "none";

    let dialog_area = core.util.createElement("DIV");
    dialog_area.className = "ke-dialog-inner";
    dialog_area.style.display = "none";

    dialog_div.appendChild(dialog_back);
    dialog_div.appendChild(dialog_area);

    context.dialog.modalArea = dialog_div;
    context.dialog.back = dialog_back;
    context.dialog.modal = dialog_area;

    /** add event listeners */
    context.dialog.modal.addEventListener(
      "mousedown",
      this.onMouseDown_dialog.bind(core)
    );
    context.dialog.modal.addEventListener(
      "click",
      this.onClick_dialog.bind(core)
    );

    /** append html */
    context.element.relative.appendChild(dialog_div);

    /** empty memory */
    dialog_div = null;
    dialog_back = null;
    dialog_area = null;
  },

  /**
   * @description Event to control the behavior of closing the dialog
   * @param {MouseEvent} e Event object
   * @private
   */
  onMouseDown_dialog: function (e) {
    if (/ke-dialog-inner/.test(e.target.className)) {
      this.context.dialog.closeSignal = true;
    } else {
      this.context.dialog.closeSignal = false;
    }
  },

  /**
   * @description Event to close the window when the outside area of the dialog or close button is click
   * @param {MouseEvent} e Event object
   * @private
   */
  onClick_dialog: function (e) {
    e.stopPropagation();

    if (
      /close/.test(e.target.getAttribute("data-command")) ||
      this.context.dialog.closeSignal
    ) {
      this.plugins.dialog.close.call(this);
    }
  },

  /**
   * @description Open a Dialog plugin
   * @param {String} kind Dialog plugin name
   * @param {Boolean} update Whether it will open for update ('image' === this.currentControllerName)
   */
  open: function (kind, update) {
    if (this.modalForm) {
      return false;
    }
    if (this.plugins.dialog.bindClose) {
      this._document.removeEventListener(
        "keydown",
        this.plugins.dialog.bindClose
      );
      this.plugins.dialog.bindClose = null;
    }

    this.plugins.dialog.bindClose = function (e) {
      if (!/27/.test(e.keyCode)) {
        return;
      }
      this.plugins.dialog.close.call(this);
    }.bind(this);
    this._document.addEventListener("keydown", this.plugins.dialog.bindClose);

    this.context.dialog.updateModal = update;

    if (this.context.options.popupDisplay === "full") {
      this.context.dialog.modalArea.style.position = "fixed";
    } else {
      this.context.dialog.modalArea.style.position = "absolute";
    }

    this.context.dialog.kind = kind;
    this.modalForm = this.context[kind].modal;
    const focusElement = this.context[kind].focusElement;

    if (typeof this.plugins[kind].on === "function") {
      this.plugins[kind].on.call(this, update);
    }

    util.addClass(this.context.dialog.modalArea, "dialog--open");

    this.context.dialog.modalArea.style.display = "block";
    this.context.dialog.back.style.display = "block";
    this.context.dialog.modal.style.display = "block";
    this.modalForm.style.display = "block";

    if (focusElement) {
      focusElement.focus();
    }
  },

  bindClose: null,

  /**
   * @description Close a Dialog plugin
   * The plugin's "init" method is called.
   */
  close: function () {
    if (this.plugins.dialog.bindClose) {
      this._document.removeEventListener(
        "keydown",
        this.plugins.dialog.bindClose
      );
      this.plugins.dialog.bindClose = null;
    }

    const contextDialog = this.context.dialog;
    const kind = this.context.dialog.kind;

    util.removeClass(contextDialog.modalArea, "dialog--open");
    util.addClass(contextDialog.modalArea, "dialog--close");

    setTimeout(() => {
      util.removeClass(contextDialog.modalArea, "dialog--close");
      contextDialog.back.style.display = "none";
      contextDialog.modalArea.style.display = "none";
      this.modalForm.style.display = "none";
      contextDialog.updateModal = false;
      contextDialog.kind = "";
      this.modalForm = null;
      this.focus();
    }, 200);
    if (typeof this.plugins[kind].init === "function") {
      this.plugins[kind].init.call(this);
    }
  },
};
