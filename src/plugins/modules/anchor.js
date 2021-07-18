/*
 * KothingEditor
 *
 * The WYSIWYG Rich Text Editor
 * Copyright Kothing.
 * MIT license.
 */

import selectMenu from "./selectMenu";

export default {
  name: "anchor",
  add: function (core) {
    core.addModule([selectMenu]);

    core.context.anchor = {
      caller: {},
      forms: this.setDialogForm(core),
      host: (
        core._window.location.origin + core._window.location.pathname
      ).replace(/\/$/, ""),
      callerContext: null,
    };
  },

  /** dialog */
  setDialogForm: function (core) {
    const lang = core.lang;
    const relList = core.options.linkRel;
    const defaultRel = (core.options.linkRelDefault.default || "").split(" ");
    const icons = core.icons;
    const forms = core.util.createElement("DIV");

    let html =
      '<div class="ke-dialog-body">' +
      '<div class="ke-dialog-form">' +
      "<label>" +
      lang.dialogBox.linkBox.url +
      "</label>" +
      '<div class="ke-dialog-form-files">' +
      '<input class="ke-input-form ke-input-url" type="text" placeholder="' +
      (core.options.protocol || "") +
      '" />' +
      '<button type="button" class="ke-btn ke-dialog-files-edge-button _ke_bookmark_button" title="' +
      lang.dialogBox.linkBox.bookmark +
      '">' +
      icons.bookmark +
      "</button>" +
      core.plugins.selectMenu.setForm() +
      "</div>" +
      '<div class="ke-anchor-preview-form">' +
      '<span class="ke-svg ke-anchor-preview-icon _ke_anchor_bookmark_icon">' +
      icons.bookmark +
      "</span>" +
      '<span class="ke-svg ke-anchor-preview-icon _ke_anchor_download_icon">' +
      icons.download +
      "</span>" +
      '<pre class="ke-link-preview"></pre>' +
      "</div>" +
      "</div>" +
      '<div class="ke-dialog-form">' +
      "<label>" +
      lang.dialogBox.linkBox.text +
      '</label><input class="ke-input-form _ke_anchor_text" type="text" />' +
      "</div>" +
      '<div class="ke-dialog-form-footer">' +
      '<label><input type="checkbox" class="ke-dialog-btn-check _ke_anchor_check" />&nbsp;' +
      lang.dialogBox.linkBox.newWindowCheck +
      "</label>" +
      '<label><input type="checkbox" class="ke-dialog-btn-check _ke_anchor_download" />&nbsp;' +
      lang.dialogBox.linkBox.downloadLinkCheck +
      "</label>";
    if (relList.length > 0) {
      html +=
        '<div class="ke-anchor-rel"><button type="button" class="ke-btn ke-btn-select ke-anchor-rel-btn">&lt;rel&gt;</button>' +
        '<div class="ke-anchor-rel-wrapper"><pre class="ke-link-preview ke-anchor-rel-preview"></pre></div>' +
        '<div class="ke-list-layer">' +
        '<div class="ke-list-inner">' +
        '<ul class="ke-list-basic ke-list-checked">';
      for (let i = 0, len = relList.length, rel; i < len; i++) {
        rel = relList[i];
        html +=
          '<li><button type="button" class="ke-btn-list' +
          (defaultRel.indexOf(rel) > -1 ? " ke-checked" : "") +
          '" data-command="' +
          rel +
          '" title="' +
          rel +
          '"><span class="ke-svg">' +
          icons.checked +
          "</span>" +
          rel +
          "</button></li>";
      }
      html += "</ul></div></div></div>";
    }

    html += "</div></div>";

    forms.innerHTML = html;
    return forms;
  },

  initEvent: function (pluginName, forms) {
    const anchorPlugin = this.plugins.anchor;
    const context = (this.context.anchor.caller[pluginName] = {
      modal: forms,
      urlInput: null,
      linkDefaultRel: this.options.linkRelDefault,
      defaultRel: this.options.linkRelDefault.default || "",
      currentRel: [],
      linkAnchor: null,
      linkValue: "",
      change: false,
      callerName: pluginName,
    });

    if (typeof context.linkDefaultRel.default === "string") {
      context.linkDefaultRel.default = context.linkDefaultRel.default.trim();
    }
    if (typeof context.linkDefaultRel.check_new_window === "string") {
      context.linkDefaultRel.check_new_window =
        context.linkDefaultRel.check_new_window.trim();
    }
    if (typeof context.linkDefaultRel.check_bookmark === "string") {
      context.linkDefaultRel.check_bookmark =
        context.linkDefaultRel.check_bookmark.trim();
    }

    context.urlInput = forms.querySelector(".ke-input-url");
    context.anchorText = forms.querySelector("._ke_anchor_text");
    context.newWindowCheck = forms.querySelector("._ke_anchor_check");
    context.downloadCheck = forms.querySelector("._ke_anchor_download");
    context.download = forms.querySelector("._ke_anchor_download_icon");
    context.preview = forms.querySelector(".ke-link-preview");
    context.bookmark = forms.querySelector("._ke_anchor_bookmark_icon");
    context.bookmarkButton = forms.querySelector("._ke_bookmark_button");

    this.plugins.selectMenu.initEvent.call(this, pluginName, forms);
    const listContext = this.context.selectMenu.caller[pluginName];

    /** rel */
    if (this.options.linkRel.length > 0) {
      context.relButton = forms.querySelector(".ke-anchor-rel-btn");
      context.relList = forms.querySelector(".ke-list-layer");
      context.relPreview = forms.querySelector(".ke-anchor-rel-preview");
      context.relButton.addEventListener(
        "click",
        anchorPlugin.onClick_relButton.bind(this, context)
      );
      context.relList.addEventListener(
        "click",
        anchorPlugin.onClick_relList.bind(this, context)
      );
    }

    context.newWindowCheck.addEventListener(
      "change",
      anchorPlugin.onChange_newWindowCheck.bind(this, context)
    );
    context.downloadCheck.addEventListener(
      "change",
      anchorPlugin.onChange_downloadCheck.bind(this, context)
    );
    context.anchorText.addEventListener(
      "input",
      anchorPlugin.onChangeAnchorText.bind(this, context)
    );
    context.urlInput.addEventListener(
      "input",
      anchorPlugin.onChangeUrlInput.bind(this, context)
    );
    context.urlInput.addEventListener(
      "keydown",
      anchorPlugin.onKeyDownUrlInput.bind(this, listContext)
    );
    context.urlInput.addEventListener(
      "focus",
      anchorPlugin.onFocusUrlInput.bind(this, context, listContext)
    );
    context.urlInput.addEventListener(
      "blur",
      anchorPlugin.onBlurUrlInput.bind(this, listContext)
    );
    context.bookmarkButton.addEventListener(
      "click",
      anchorPlugin.onClick_bookmarkButton.bind(this, context)
    );
  },

  on: function (contextAnchor, update) {
    if (!update) {
      this.plugins.anchor.init.call(this, contextAnchor);
      contextAnchor.anchorText.value = this.getSelection().toString();
    } else if (contextAnchor.linkAnchor) {
      this.context.dialog.updateModal = true;
      const href = contextAnchor.linkAnchor.href;
      contextAnchor.linkValue =
        contextAnchor.preview.textContent =
        contextAnchor.urlInput.value =
          /#.+$/.test(href) ? href.substr(href.lastIndexOf("#")) : href;
      contextAnchor.anchorText.value =
        contextAnchor.linkAnchor.textContent.trim() ||
        contextAnchor.linkAnchor.getAttribute("alt");
      contextAnchor.newWindowCheck.checked = /_blank/i.test(
        contextAnchor.linkAnchor.target
      )
        ? true
        : false;
      contextAnchor.downloadCheck.checked = contextAnchor.linkAnchor.download;
    }

    this.context.anchor.callerContext = contextAnchor;
    this.plugins.anchor.setRel.call(
      this,
      contextAnchor,
      update && contextAnchor.linkAnchor
        ? contextAnchor.linkAnchor.rel
        : contextAnchor.defaultRel
    );
    this.plugins.anchor.setLinkPreview.call(
      this,
      contextAnchor,
      contextAnchor.linkValue
    );
    this.plugins.selectMenu.on.call(
      this,
      contextAnchor.callerName,
      this.plugins.anchor.setHeaderBookmark
    );
  },

  closeRelMenu: null,
  toggleRelList: function (contextAnchor, show) {
    if (!show) {
      if (this.plugins.anchor.closeRelMenu) {
        this.plugins.anchor.closeRelMenu();
      }
    } else {
      const target = contextAnchor.relButton;
      const relList = contextAnchor.relList;
      this.util.addClass(target, "active");
      relList.style.visibility = "hidden";
      relList.style.display = "block";
      if (!this.options.rtl) {
        relList.style.left = target.offsetLeft + target.offsetWidth + 1 + "px";
      } else {
        relList.style.left = target.offsetLeft - relList.offsetWidth - 1 + "px";
      }
      relList.style.top =
        target.offsetTop +
        target.offsetHeight / 2 -
        relList.offsetHeight / 2 +
        "px";
      relList.style.visibility = "";

      this.plugins.anchor.closeRelMenu = function (context, target, e) {
        if (
          e &&
          (context.relButton.contains(e.target) ||
            context.relList.contains(e.target))
        ) {
          return;
        }
        this.util.removeClass(target, "active");
        context.relList.style.display = "none";
        this.modalForm.removeEventListener(
          "click",
          this.plugins.anchor.closeRelMenu
        );
        this.plugins.anchor.closeRelMenu = null;
      }.bind(this, contextAnchor, target);

      this.modalForm.addEventListener(
        "click",
        this.plugins.anchor.closeRelMenu
      );
    }
  },

  onClick_relButton: function (contextAnchor, e) {
    this.plugins.anchor.toggleRelList.call(
      this,
      contextAnchor,
      !this.util.hasClass(e.target, "active")
    );
  },

  onClick_relList: function (contextAnchor, e) {
    const target = e.target;
    const cmd = target.getAttribute("data-command");
    if (!cmd) {
      return;
    }

    const current = contextAnchor.currentRel;
    const checked = this.util.toggleClass(target, "ke-checked");
    const index = current.indexOf(cmd);
    if (checked) {
      if (index === -1) {
        current.push(cmd);
      }
    } else {
      if (index > -1) {
        current.splice(index, 1);
      }
    }

    contextAnchor.relPreview.title = contextAnchor.relPreview.textContent =
      current.join(" ");
  },

  setRel: function (contextAnchor, relAttr) {
    const relListEl = contextAnchor.relList;
    const rels = (contextAnchor.currentRel = !relAttr
      ? []
      : relAttr.split(" "));
    if (!relListEl) {
      return;
    }

    const checkedRel = relListEl.querySelectorAll("button");
    for (let i = 0, len = checkedRel.length, cmd; i < len; i++) {
      cmd = checkedRel[i].getAttribute("data-command");
      if (rels.indexOf(cmd) > -1) {
        this.util.addClass(checkedRel[i], "ke-checked");
      } else {
        this.util.removeClass(checkedRel[i], "ke-checked");
      }
    }

    contextAnchor.relPreview.title = contextAnchor.relPreview.textContent =
      rels.join(" ");
  },

  createHeaderList: function (contextAnchor, contextList, urlValue) {
    const headers = this.util.getListChildren(
      this.context.element.wysiwyg,
      function (current) {
        return /h[1-6]/i.test(current.nodeName);
      }
    );
    if (headers.length === 0) {
      return;
    }

    const valueRegExp = new this._window.RegExp(
      "^" + urlValue.replace(/^#/, ""),
      "i"
    );
    const list = [];
    let html = "";
    for (let i = 0, len = headers.length, h; i < len; i++) {
      h = headers[i];
      if (!valueRegExp.test(h.textContent)) {
        continue;
      }
      list.push(h);
      html +=
        '<li class="ke-select-item" data-index="' +
        i +
        '">' +
        h.textContent +
        "</li>";
    }

    if (list.length === 0) {
      this.plugins.selectMenu.close.call(this, contextList);
    } else {
      this.plugins.selectMenu.createList(contextList, list, html);
      this.plugins.selectMenu.open.call(
        this,
        contextList,
        this.plugins.anchor.setMenuListPosition.bind(this, contextAnchor)
      );
    }
  },

  setMenuListPosition: function (contextAnchor, list) {
    list.style.top = contextAnchor.urlInput.offsetHeight + 1 + "px";
  },

  onKeyDownUrlInput: function (contextList, e) {
    const keyCode = e.keyCode;
    switch (keyCode) {
      case 38: // up
        e.preventDefault();
        e.stopPropagation();
        this.plugins.selectMenu.moveItem.call(this, contextList, -1);
        break;
      case 40: // down
        e.preventDefault();
        e.stopPropagation();
        this.plugins.selectMenu.moveItem.call(this, contextList, 1);
        break;
      case 13: // enter
        if (contextList.index > -1) {
          e.preventDefault();
          e.stopPropagation();
          this.plugins.anchor.setHeaderBookmark.call(
            this,
            this.plugins.selectMenu.getItem(contextList, null)
          );
        }
        break;
    }
  },

  setHeaderBookmark: function (header) {
    const contextAnchor = this.context.anchor.callerContext;
    const id =
      header.id ||
      "h_" + this._window.Math.random().toString().replace(/.+\./, "");
    header.id = id;
    contextAnchor.urlInput.value = "#" + id;

    if (!contextAnchor.anchorText.value.trim() || !contextAnchor.change) {
      contextAnchor.anchorText.value = header.textContent;
    }

    this.plugins.anchor.setLinkPreview.call(
      this,
      contextAnchor,
      contextAnchor.urlInput.value
    );
    this.plugins.selectMenu.close.call(
      this,
      this.context.selectMenu.callerContext
    );
    this.context.anchor.callerContext.urlInput.focus();
  },

  onChangeAnchorText: function (contextAnchor, e) {
    contextAnchor.change = !!e.target.value.trim();
  },

  onChangeUrlInput: function (contextAnchor, e) {
    const value = e.target.value.trim();
    this.plugins.anchor.setLinkPreview.call(this, contextAnchor, value);

    if (/^#/.test(value)) {
      this.plugins.anchor.createHeaderList.call(
        this,
        contextAnchor,
        this.context.selectMenu.callerContext,
        value
      );
    } else {
      this.plugins.selectMenu.close.call(
        this,
        this.context.selectMenu.callerContext
      );
    }
  },

  onFocusUrlInput: function (contextAnchor, contextLink) {
    const value = contextAnchor.urlInput.value;
    if (/^#/.test(value)) {
      this.plugins.anchor.createHeaderList.call(
        this,
        contextAnchor,
        contextLink,
        value
      );
    }
  },

  onBlurUrlInput: function (contextList) {
    this.plugins.selectMenu.close.call(this, contextList);
  },

  setLinkPreview: function (context, value) {
    const preview = context.preview;
    const protocol = this.options.linkProtocol;
    const reservedProtocol = /^(mailto:|tel:|sms:|https*:\/\/|#)/.test(value);
    const sameProtocol = !protocol
      ? false
      : this._window
          .RegExp("^" + value.substr(0, protocol.length))
          .test(protocol);
    context.linkValue = preview.textContent = !value
      ? ""
      : protocol && !reservedProtocol && !sameProtocol
      ? protocol + value
      : reservedProtocol
      ? value
      : /^www\./.test(value)
      ? "http://" + value
      : this.context.anchor.host + (/^\//.test(value) ? "" : "/") + value;

    if (value.indexOf("#") === 0) {
      context.bookmark.style.display = "inline-block";
      this.util.addClass(context.bookmarkButton, "active");
    } else {
      context.bookmark.style.display = "none";
      this.util.removeClass(context.bookmarkButton, "active");
    }

    if (value.indexOf("#") === -1 && context.downloadCheck.checked) {
      context.download.style.display = "block";
    } else {
      context.download.style.display = "none";
    }
  },

  setCtx: function (anchor, contextAnchor) {
    if (!anchor) {
      return;
    }
    contextAnchor.linkAnchor = anchor;
    contextAnchor.linkValue = anchor.href;
    contextAnchor.currentRel = anchor.rel.split(" ");
  },

  updateAnchor: function (anchor, url, alt, contextAnchor, notText) {
    // download
    if (!/^#/.test(url) && contextAnchor.downloadCheck.checked) {
      anchor.setAttribute("download", alt || url);
    } else {
      anchor.removeAttribute("download");
    }

    // new window
    if (contextAnchor.newWindowCheck.checked) {
      anchor.target = "_blank";
    } else {
      anchor.removeAttribute("target");
    }

    // rel
    const rel = contextAnchor.currentRel.join(" ");
    if (!rel) {
      anchor.removeAttribute("rel");
    } else {
      anchor.rel = rel;
    }

    // est url, alt
    anchor.href = url;
    anchor.setAttribute("alt", alt);
    if (notText) {
      if (anchor.children.length === 0) {
        anchor.textContent = "";
      }
    } else {
      anchor.textContent = alt;
    }
  },

  createAnchor: function (contextAnchor, notText) {
    if (contextAnchor.linkValue.length === 0) {
      return null;
    }

    const url = contextAnchor.linkValue;
    const anchor = contextAnchor.anchorText;
    const anchorText = anchor.value.length === 0 ? url : anchor.value;

    const oA = contextAnchor.linkAnchor || this.util.createElement("A");
    this.plugins.anchor.updateAnchor(
      oA,
      url,
      anchorText,
      contextAnchor,
      notText
    );

    contextAnchor.linkValue =
      contextAnchor.preview.textContent =
      contextAnchor.urlInput.value =
      contextAnchor.anchorText.value =
        "";

    return oA;
  },

  onClick_bookmarkButton: function (contextAnchor) {
    let url = contextAnchor.urlInput.value;
    if (/^#/.test(url)) {
      url = url.substr(1);
      contextAnchor.bookmark.style.display = "none";
      this.util.removeClass(contextAnchor.bookmarkButton, "active");
      this.plugins.selectMenu.close.call(
        this,
        this.context.selectMenu.callerContext
      );
    } else {
      url = "#" + url;
      contextAnchor.bookmark.style.display = "block";
      this.util.addClass(contextAnchor.bookmarkButton, "active");
      contextAnchor.downloadCheck.checked = false;
      contextAnchor.download.style.display = "none";
      this.plugins.anchor.createHeaderList.call(
        this,
        contextAnchor,
        this.context.selectMenu.callerContext,
        url
      );
    }

    contextAnchor.urlInput.value = url;
    this.plugins.anchor.setLinkPreview.call(this, contextAnchor, url);
    contextAnchor.urlInput.focus();
  },

  onChange_newWindowCheck: function (contextAnchor, e) {
    if (typeof contextAnchor.linkDefaultRel.check_new_window !== "string") {
      return;
    }
    if (e.target.checked) {
      this.plugins.anchor.setRel.call(
        this,
        contextAnchor,
        this.plugins.anchor.relMerge.call(
          this,
          contextAnchor,
          contextAnchor.linkDefaultRel.check_new_window
        )
      );
    } else {
      this.plugins.anchor.setRel.call(
        this,
        contextAnchor,
        this.plugins.anchor.relDelete.call(
          this,
          contextAnchor,
          contextAnchor.linkDefaultRel.check_new_window
        )
      );
    }
  },

  onChange_downloadCheck: function (contextAnchor, e) {
    if (e.target.checked) {
      contextAnchor.download.style.display = "block";
      contextAnchor.bookmark.style.display = "none";
      this.util.removeClass(contextAnchor.bookmarkButton, "active");
      contextAnchor.linkValue =
        contextAnchor.preview.textContent =
        contextAnchor.urlInput.value =
          contextAnchor.urlInput.value.replace(/^#+/, "");
      if (typeof contextAnchor.linkDefaultRel.check_bookmark === "string") {
        this.plugins.anchor.setRel.call(
          this,
          contextAnchor,
          this.plugins.anchor.relMerge.call(
            this,
            contextAnchor,
            contextAnchor.linkDefaultRel.check_bookmark
          )
        );
      }
    } else {
      contextAnchor.download.style.display = "none";
      if (typeof contextAnchor.linkDefaultRel.check_bookmark === "string") {
        this.plugins.anchor.setRel.call(
          this,
          contextAnchor,
          this.plugins.anchor.relDelete.call(
            this,
            contextAnchor,
            contextAnchor.linkDefaultRel.check_bookmark
          )
        );
      }
    }
  },

  relMerge: function (contextAnchor, relAttr) {
    const current = contextAnchor.currentRel;
    if (!relAttr) {
      return current.join(" ");
    }

    if (/^only:/.test(relAttr)) {
      relAttr = relAttr.replace(/^only:/, "").trim();
      contextAnchor.currentRel = relAttr.split(" ");
      return relAttr;
    }

    const rels = relAttr.split(" ");
    for (let i = 0, len = rels.length, index; i < len; i++) {
      index = current.indexOf(rels[i]);
      if (index === -1) {
        current.push(rels[i]);
      }
    }

    return current.join(" ");
  },

  relDelete: function (contextAnchor, relAttr) {
    if (!relAttr) {
      return contextAnchor.currentRel.join(" ");
    }
    if (/^only:/.test(relAttr)) {
      relAttr = relAttr.replace(/^only:/, "").trim();
    }

    const rels = contextAnchor.currentRel
      .join(" ")
      .replace(this._window.RegExp(relAttr + "\\s*"), "");
    contextAnchor.currentRel = rels.split(" ");
    return rels;
  },

  init: function (contextAnchor) {
    contextAnchor.linkAnchor = null;
    contextAnchor.linkValue =
      contextAnchor.preview.textContent =
      contextAnchor.urlInput.value =
        "";
    contextAnchor.anchorText.value = "";
    contextAnchor.newWindowCheck.checked = false;
    contextAnchor.downloadCheck.checked = false;
    contextAnchor.change = false;
    this.plugins.anchor.setRel.call(
      this,
      contextAnchor,
      contextAnchor.defaultRel
    );
    if (contextAnchor.relList) {
      this.plugins.anchor.toggleRelList.call(this, contextAnchor, false);
    }
    this.context.anchor.callerContext = null;
    this.plugins.selectMenu.init.call(
      this,
      this.context.selectMenu.callerContext
    );
  },
};
