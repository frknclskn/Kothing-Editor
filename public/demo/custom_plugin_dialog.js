'use strict';

// Import "dialog" module
import dialog from '../src/plugins/modules/dialog';

// ex) A link dialog plugin with multiple target options.
export default {
  // @Required
  // plugin name
  name: 'customLink',

  // @Required
  // data display
  display: 'dialog',

  title: 'L---I---N---k',
  innerHTML: '<span class="ke-icon-text">L</span>',
  buttonClass: 'ke-btn-primary',

  // @Required
  // add function - It is called only once when the plugin is first run.
  // This function generates HTML to append and register the event.
  // arguments - (core : core object, targetElement : clicked button element)
  add: function (core) {
    // If you are using a module, you must register the module using the "addModule" method.
    core.addModule([dialog]);

    // @Required
    // Registering a namespace for caching as a plugin name in the context object
    const context = core.context;
    context.customLink = {
      focusElement: null, // @Override // This element has focus when the dialog is opened.
      targetSelect: null,
      linkAnchorText: null,
      _linkAnchor: null,
    };

    /** link dialog */
    let link_dialog = this.setDialog.call(core);
    context.customLink.modal = link_dialog;
    context.customLink.focusElement = link_dialog.querySelector('._ke_link_url');
    context.customLink.linkAnchorText = link_dialog.querySelector('._ke_link_text');
    context.customLink.targetSelect = link_dialog.querySelector('.ke-input-select');

    /** link controller */
    let link_controller = this.setController_LinkButton.call(core);
    context.customLink.linkController = link_controller;
    context.customLink._linkAnchor = null;
    // @Required
    // You must register the event propagation stop code in the "mousedown" event of the controller.
    link_controller.addEventListener('mousedown', function (e) { e.stopPropagation(); }, false);

    /** add event listeners */
    link_dialog.querySelector('.ke-btn-primary').addEventListener('click', this.submit.bind(core));
    link_controller.addEventListener('click', this.onClick_linkController.bind(core));

    /** append html */
    context.dialog.modal.appendChild(link_dialog);

    /** append controller */
    context.element.relative.appendChild(link_controller);

    /** empty memory */
    link_dialog = null;
    link_controller = null;
  },

  /** dialog */
  setDialog: function () {
    const lang = this.lang;
    const dialog = this.util.createElement('DIV');
    const targetList = [
      { target: '_blank', name: 'New window' },
      { target: '_parent', name: 'Parent frame' },
      { target: '_top', name: 'First frame', selected: true },
      { target: 'AnyFrame', name: 'Frame name' },
      { target: '_dialog', name: 'Self defined dialog' },
    ];

    dialog.className = 'ke-dialog-content';
    dialog.style.display = 'none';
    let html = '' +
      '<form class="editor_link">' +
      '<div class="ke-dialog-header">' +
      '<button type="button" data-command="close" class="ke-btn ke-dialog-close" aria-label="Close" title="' + lang.dialogBox.close + '">' +
      this.icons.cancel +
      '</button>' +
      '<span class="ke-modal-title">' + lang.dialogBox.linkBox.title + '</span>' +
      '</div>' +
      '<div class="ke-dialog-body">' +
      '<div class="ke-dialog-form">' +
      '<label>' + lang.dialogBox.linkBox.url + '</label>' +
      '<input class="ke-input-form _ke_link_url" type="text" />' +
      '</div>' +
      '<div class="ke-dialog-form">' +
      '<label>' + lang.dialogBox.linkBox.text + '</label><input class="ke-input-form _ke_link_text" type="text" />' +
      '</div>' +
      '<div class="ke-dialog-form ke-dialog-form">' +
      '<select class="ke-input-select" title="links">';
    for (let i = 0, len = targetList.length, t, selected; i < len; i++) {
      t = targetList[i];
      selected = t.selected ? ' selected' : '';
      html += '<option value="' + t.target + '"' + selected + '>' + t.name + '</option>';
    }
    html += '</select>' +
      '</div>' +
      '</div>' +
      '<div class="ke-dialog-footer">' +
      '<button type="submit" class="ke-btn-primary" title="' + lang.dialogBox.submitButton + '"><span>' + lang.dialogBox.submitButton + '</span></button>' +
      '</div>' +
      '</form>';


    dialog.innerHTML = html;

    return dialog;
  },

  /** modify controller button */
  setController_LinkButton: function () {
    const lang = this.lang;
    const icons = this.icons;
    const link_btn = this.util.createElement('DIV');

    link_btn.className = 'ke-controller ke-controller-link';
    link_btn.innerHTML = '' +
      '<div class="ke-arrow ke-arrow-up"></div>' +
      '<div class="link-content"><span><a target="_blank" href=""></a>&nbsp;</span>' +
      '<div class="ke-btn-group">' +
      '<button type="button" data-command="update" tabindex="-1" class="ke-tooltip">' +
      icons.edit +
      '<span class="ke-tooltip-inner"><span class="ke-tooltip-text">' + lang.controller.edit + '</span></span>' +
      '</button>' +
      '<button type="button" data-command="unlink" tabindex="-1" class="ke-tooltip">' +
      icons.unlink +
      '<span class="ke-tooltip-inner"><span class="ke-tooltip-text">' + lang.controller.unlink + '</span></span>' +
      '</button>' +
      '<button type="button" data-command="delete" tabindex="-1" class="ke-tooltip">' +
      icons.delete +
      '<span class="ke-tooltip-inner"><span class="ke-tooltip-text">' + lang.controller.remove + '</span></span>' +
      '</button>' +
      '</div>' +
      '</div>';

    return link_btn;
  },

  // @Required
  // This method is called when the plugin button is clicked.
  // Open the modal window here.
  open: function () {
    // open.call(core, pluginName, isModify)
    this.plugins.dialog.open.call(this, 'customLink', 'customLink' === this.currentControllerName);
  },

  submit: function (e) {
    this.showLoading();

    e.preventDefault();
    e.stopPropagation();

    const submitAction = function () {
      if (this.context.customLink.focusElement.value.trim().length === 0) { return false; }

      const contextLink = this.context.customLink;
      const url = contextLink.focusElement.value;
      const anchor = contextLink.linkAnchorText;
      const anchorText = anchor.value.length === 0 ? url : anchor.value;

      if (!this.context.dialog.updateModal) {
        const oA = this.util.createElement('A');
        oA.href = url;
        oA.textContent = anchorText;
        oA.target = contextLink.targetSelect.selectedOptions[0].value;

        const selectedFormats = this.getSelectedElements();
        if (selectedFormats.length > 1) {
          const oFormat = this.util.createElement(selectedFormats[0].nodeName);
          oFormat.appendChild(oA);
          this.insertNode(oFormat);
        } else {
          this.insertNode(oA);
        }

        this.setRange(oA.childNodes[0], 0, oA.childNodes[0], oA.textContent.length);
      } else {
        contextLink._linkAnchor.href = url;
        contextLink._linkAnchor.textContent = anchorText;
        contextLink._linkAnchor.target = contextLink.targetSelect.selectedOptions[0].value;

        // set range
        this.setRange(contextLink._linkAnchor.childNodes[0], 0, contextLink._linkAnchor.childNodes[0], contextLink._linkAnchor.textContent.length);
      }

      // history stack
      this.history.push(false);

      contextLink.focusElement.value = '';
      contextLink.linkAnchorText.value = '';
    }.bind(this);

    try {
      submitAction();
    } finally {
      this.plugins.dialog.close.call(this);
      this.closeLoading();
      this.focus();
    }

    return false;
  },

  // @Override
  // Plugins with active methods load immediately when the editor loads.
  // Called each time the selection is moved.
  active: function (element) {
    if (!element) {
      if (this.controllerArray.indexOf(this.context.customLink.linkController) > -1) {
        this.controllersOff();
      }
    } else if (this.util.isAnchor(element) && element.getAttribute('data-image-link') === null) {
      if (this.controllerArray.indexOf(this.context.customLink.linkController) < 0) {
        this.plugins.customLink.call_controller.call(this, element);
      }
      return true;
    }

    return false;
  },

  // @Override
  // This method is called just before the dialog opens.
  // If "update" argument is true, it is not a new call, but a call to modify an already created element.
  on: function (update) {
    if (!update) {
      this.plugins.customLink.init.call(this);
      this.context.customLink.linkAnchorText.value = this.getSelection().toString();
    } else if (this.context.customLink._linkAnchor) {
      this.context.dialog.updateModal = true;
      this.context.customLink.focusElement.value = this.context.customLink._linkAnchor.href;
      this.context.customLink.linkAnchorText.value = this.context.customLink._linkAnchor.textContent;
      this.context.customLink.targetSelect.value = this.context.customLink._linkAnchor.target || '';
    }
  },

  call_controller: function (selectionATag) {
    this.editLink = selectionATag;
    this.context.customLink._linkAnchor = selectionATag;
    const linkBtn = this.context.customLink.linkController;
    const link = linkBtn.querySelector('a');

    link.href = selectionATag.href;
    link.title = selectionATag.textContent;
    link.textContent = selectionATag.textContent;

    const offset = this.util.getOffset(selectionATag, this.context.element.wysiwygFrame);
    linkBtn.style.top = (offset.top + selectionATag.offsetHeight + 10) + 'px';
    linkBtn.style.left = (offset.left - this.context.element.wysiwygFrame.scrollLeft) + 'px';

    linkBtn.style.display = 'block';

    const overLeft = this.context.element.wysiwygFrame.offsetWidth - (linkBtn.offsetLeft + linkBtn.offsetWidth);
    if (overLeft < 0) {
      linkBtn.style.left = (linkBtn.offsetLeft + overLeft) + 'px';
      linkBtn.firstElementChild.style.left = (20 - overLeft) + 'px';
    } else {
      linkBtn.firstElementChild.style.left = '20px';
    }

    // Show controller at editor area (controller elements, function, "controller target element(@Required)", "controller name(@Required)", etc..)
    this.controllersOn(linkBtn, selectionATag, 'customLink');
  },

  onClick_linkController: function (e) {
    e.stopPropagation();

    const command = e.target.getAttribute('data-command');
    if (!command) { return; }

    e.preventDefault();

    if (/update/.test(command)) {
      const contextLink = this.context.customLink;
      contextLink.focusElement.value = contextLink._linkAnchor.href;
      contextLink.linkAnchorText.value = contextLink._linkAnchor.textContent;
      contextLink.targetSelect.value = contextLink.targetSelect.value;
      this.plugins.dialog.open.call(this, 'customLink', true);
    } else if (/unlink/.test(command)) {
      const sc = this.util.getChildElement(this.context.customLink._linkAnchor, function (current) { return current.childNodes.length === 0 || current.nodeType === 3; }, false);
      const ec = this.util.getChildElement(this.context.customLink._linkAnchor, function (current) { return current.childNodes.length === 0 || current.nodeType === 3; }, true);
      this.setRange(sc, 0, ec, ec.textContent.length);
      this.nodeChange(null, null, ['A'], false);
    } else {
      /** delete */
      this.util.removeItem(this.context.customLink._linkAnchor);
      this.context.customLink._linkAnchor = null;
      this.focus();

      // history stack
      this.history.push(false);
    }

    this.controllersOff();
  },

  // @Required
  // This method is called when the dialog window is closed.
  // Initialize the properties.
  init: function () {
    const contextLink = this.context.customLink;
    contextLink.linkController.style.display = 'none';
    contextLink._linkAnchor = null;
    contextLink.focusElement.value = '';
    contextLink.linkAnchorText.value = '';
    contextLink.targetSelect.selectedIndex = 0;
  },
};