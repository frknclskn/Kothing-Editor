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
 * @param {object} constructed Toolbar element you created
 * @param {JSON|Object} options Inserted options
 * @returns {Object} {Elements, variables of the editor, option}
 * @private
 */
const $context = function (element, constructed, options) {
  return {
    element: {
      originElement: element,
      topArea: constructed.top,
      relative: constructed.relative,
      toolbar: constructed.toolBar,
      buttonTray: constructed.toolBar.querySelector(".ke-btn-tray"),
      menuTray: constructed.menuTray,
      resizingBar: constructed.resizingBar,
      navigation: constructed.navigation,
      charWrapper: constructed.charWrapper,
      charCounter: constructed.charCounter,
      editorArea: constructed.editorArea,
      wysiwygFrame: constructed.wysiwygArea,
      wysiwyg: constructed.wysiwygArea,
      code: constructed.codeArea,
      placeholder: constructed.placeholder,
      loading: constructed.loading,
      lineBreaker: constructed.lineBreaker,
      lineBreaker_t: constructed.lineBreaker_t,
      lineBreaker_b: constructed.lineBreaker_b,
      resizeBackground: constructed.resizeBack,
      stickyDummy: constructed.stickyDummy,
      arrow: constructed.arrow,
    },
    tool: {
      cover: constructed.toolBar.querySelector(".ke-toolbar-cover"),
      bold: constructed.toolBar.querySelector("._ke_command_bold"),
      underline: constructed.toolBar.querySelector("._ke_command_underline"),
      italic: constructed.toolBar.querySelector("._ke_command_italic"),
      strike: constructed.toolBar.querySelector("._ke_command_strike"),
      subscript: constructed.toolBar.querySelector("._ke_command_subscript"),
      superscript: constructed.toolBar.querySelector(
        "._ke_command_superscript"
      ),
      undo: constructed.toolBar.querySelector("._ke_command_undo"),
      redo: constructed.toolBar.querySelector("._ke_command_redo"),
      save: constructed.toolBar.querySelector("._ke_command_save"),
      outdent: constructed.toolBar.querySelector("._ke_command_outdent"),
      indent: constructed.toolBar.querySelector("._ke_command_indent"),
      fullScreen: constructed.toolBar.querySelector("._ke_command_fullScreen"),
      showBlocks: constructed.toolBar.querySelector("._ke_command_showBlocks"),
      codeView: constructed.toolBar.querySelector("._ke_command_codeView"),
    },
    options: options,
  };
};

export default $context;
