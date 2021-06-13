/*
 * KothingEditor
 *
 * The WYSIWYG Rich Text Editor
 * Copyright Kothing.
 * MIT license.
 */

/**
 * @description Elements and variables you should have
 * @param {Element} element textarea element
 * @param {object} cons Toolbar element you created
 * @param {JSON|Object} options Inserted options
 * @returns {Object} {Elements, variables of the editor, option}
 * @private
 */
const $context = function (element, cons, options) {
  return {
    element: {
      originElement: element,
      topArea: cons.top,
      relative: cons.relative,
      toolbar: cons.toolBar,
      buttonTray: cons.toolBar.querySelector(".ke-btn-tray"),
      menuTray: cons.menuTray,
      resizingBar: cons.resizingBar,
      navigation: cons.navigation,
      charWrapper: cons.charWrapper,
      charCounter: cons.charCounter,
      editorArea: cons.editorArea,
      wysiwygFrame: cons.wysiwygArea,
      wysiwyg: cons.wysiwygArea, // if (options.iframe) cons.wysiwygArea.contentDocument.body
      code: cons.codeArea,
      placeholder: cons.placeholder,
      loading: cons.loading,
      lineBreaker: cons.lineBreaker,
      lineBreaker_t: cons.lineBreaker_t,
      lineBreaker_b: cons.lineBreaker_b,
      resizeBackground: cons.resizeBack,
      stickyDummy: cons.stickyDummy,
      arrow: cons.arrow,
    },
    tool: {
      cover: cons.toolBar.querySelector(".ke-toolbar-cover"),
      bold: cons.toolBar.querySelector("._ke_command_bold"),
      underline: cons.toolBar.querySelector("._ke_command_underline"),
      italic: cons.toolBar.querySelector("._ke_command_italic"),
      strike: cons.toolBar.querySelector("._ke_command_strike"),
      subscript: cons.toolBar.querySelector("._ke_command_subscript"),
      superscript: cons.toolBar.querySelector("._ke_command_superscript"),
      undo: cons.toolBar.querySelector("._ke_command_undo"),
      redo: cons.toolBar.querySelector("._ke_command_redo"),
      save: cons.toolBar.querySelector("._ke_command_save"),
      outdent: cons.toolBar.querySelector("._ke_command_outdent"),
      indent: cons.toolBar.querySelector("._ke_command_indent"),
      fullScreen: cons.toolBar.querySelector("._ke_command_fullScreen"),
      showBlocks: cons.toolBar.querySelector("._ke_command_showBlocks"),
      codeView: cons.toolBar.querySelector("._ke_command_codeView"),
    },
    options: options,
    option: options,
  };
};

export default $context;
