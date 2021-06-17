/*
 * KothingEditor
 *
 * The WYSIWYG Rich Text Editor
 * Copyright Kothing.
 * MIT license.
 */

export default {
  name: "fileBrowser",
  xmlHttp: null,
  loading: null,

  /**
   * @description Constructor
   * @param {Object} core Core object
   */
  add: function (core) {
    const context = core.context;
    context.fileBrowser = {
      closeSignal: false,
      area: null,
      header: null,
      tagArea: null,
      body: null,
      list: null,
      tagElements: null,
      items: [],
      selectedTags: [],
      selectorHandler: null,
      contextPlugin: "",
      columnSize: 4,
    };

    /** fileBrowser */
    let browser_div = core.util.createElement("DIV");
    browser_div.className = "ke-file-browser kothing-editor-common";

    let back = core.util.createElement("DIV");
    back.className = "ke-file-browser-back";

    let content = core.util.createElement("DIV");
    content.className = "ke-file-browser-inner";
    content.innerHTML = this.set_browser(core);

    browser_div.appendChild(back);
    browser_div.appendChild(content);
    this.loading = browser_div.querySelector(".ke-loading-box");

    context.fileBrowser.area = browser_div;
    context.fileBrowser.header = content.querySelector(
      ".ke-file-browser-header"
    );
    context.fileBrowser.titleArea = content.querySelector(
      ".ke-file-browser-title"
    );
    context.fileBrowser.tagArea = content.querySelector(
      ".ke-file-browser-tags"
    );
    context.fileBrowser.body = content.querySelector(".ke-file-browser-body");
    context.fileBrowser.list = content.querySelector(".ke-file-browser-list");

    /** add event listeners */
    context.fileBrowser.tagArea.addEventListener(
      "click",
      this.onClickTag.bind(core)
    );
    context.fileBrowser.list.addEventListener(
      "click",
      this.onClickFile.bind(core)
    );
    content.addEventListener("mousedown", this.onMouseDown_browser.bind(core));
    content.addEventListener("click", this.onClick_browser.bind(core));

    /** append html */
    context.element.relative.appendChild(browser_div);

    /** empty memory */
    browser_div = null;
    back = null;
    content = null;
  },

  set_browser: function (core) {
    const lang = core.lang;

    return (
      '<div class="ke-file-browser-content">' +
      '<div class="ke-file-browser-header">' +
      '<button type="button" data-command="close" class="ke-btn ke-file-browser-close" class="close" aria-label="Close" title="' +
      lang.dialogBox.close +
      '">' +
      core.icons.cancel +
      "</button>" +
      '<span class="ke-file-browser-title"></span>' +
      '<div class="ke-file-browser-tags"></div>' +
      "</div>" +
      '<div class="ke-file-browser-body">' +
      '<div class="ke-loading-box kothing-editor-common"><div class="ke-loading-effect"></div></div>' +
      '<div class="ke-file-browser-list"></div>' +
      "</div>" +
      "</div>"
    );
  },

  /**
   * @description Event to control the behavior of closing the browser
   * @param {MouseEvent} e Event object
   * @private
   */
  onMouseDown_browser: function (e) {
    if (/ke-file-browser-inner/.test(e.target.className)) {
      this.context.fileBrowser.closeSignal = true;
    } else {
      this.context.fileBrowser.closeSignal = false;
    }
  },

  /**
   * @description Event to close the window when the outside area of the browser or close button is click
   * @param {MouseEvent} e Event object
   * @private
   */
  onClick_browser: function (e) {
    e.stopPropagation();

    if (
      /close/.test(e.target.getAttribute("data-command")) ||
      this.context.fileBrowser.closeSignal
    ) {
      this.plugins.fileBrowser.close.call(this);
    }
  },

  /**
   * @description Open a file browser plugin
   * @param {String} pluginName Plugin name using the file browser
   * @param {Function|null} selectorHandler When the function comes as an argument value, it substitutes "context.selectorHandler".
   */
  open: function (pluginName, selectorHandler) {
    if (this.plugins.fileBrowser.bindClose) {
      this._document.removeEventListener(
        "keydown",
        this.plugins.fileBrowser.bindClose
      );
      this.plugins.fileBrowser.bindClose = null;
    }

    this.plugins.fileBrowser.bindClose = function (e) {
      if (!/27/.test(e.keyCode)) {
        return;
      }
      this.plugins.fileBrowser.close.call(this);
    }.bind(this);
    this._document.addEventListener(
      "keydown",
      this.plugins.fileBrowser.bindClose
    );

    const fileBrowserContext = this.context.fileBrowser;
    fileBrowserContext.contextPlugin = pluginName;
    fileBrowserContext.selectorHandler = selectorHandler;

    const pluginContext = this.context[pluginName];
    const listClassName = pluginContext.listClass;
    if (!this.util.hasClass(fileBrowserContext.list, listClassName)) {
      fileBrowserContext.list.className =
        "ke-file-browser-list " + listClassName;
    }

    if (this.options.popupDisplay === "full") {
      fileBrowserContext.area.style.position = "fixed";
    } else {
      fileBrowserContext.area.style.position = "absolute";
    }

    fileBrowserContext.titleArea.textContent = pluginContext.title;
    fileBrowserContext.area.style.display = "block";

    this.plugins.fileBrowser.drawFileList.call(
      this,
      this.context[pluginName].url,
      this.context[pluginName].header
    );
  },

  bindClose: null,

  /**
   * @description Close a fileBrowser plugin
   * The plugin's "init" method is called.
   */
  close: function () {
    const fileBrowserPlugin = this.plugins.fileBrowser;

    if (fileBrowserPlugin.xmlHttp) {
      fileBrowserPlugin.xmlHttp.abort();
    }

    if (fileBrowserPlugin.bindClose) {
      this._document.removeEventListener(
        "keydown",
        fileBrowserPlugin.bindClose
      );
      fileBrowserPlugin.bindClose = null;
    }

    const fileBrowserContext = this.context.fileBrowser;
    fileBrowserContext.area.style.display = "none";
    fileBrowserContext.selectorHandler = null;
    fileBrowserContext.selectedTags = [];
    fileBrowserContext.items = [];
    fileBrowserContext.list.innerHTML =
      fileBrowserContext.tagArea.innerHTML =
      fileBrowserContext.titleArea.textContent =
        "";

    if (
      typeof this.plugins[fileBrowserContext.contextPlugin].init === "function"
    ) {
      this.plugins[fileBrowserContext.contextPlugin].init.call(this);
    }
    fileBrowserContext.contextPlugin = "";
  },

  /**
   * @description Show file browser loading box
   */
  showBrowserLoading: function () {
    this.loading.style.display = "block";
  },

  /**
   * @description Close file browser loading box
   */
  closeBrowserLoading: function () {
    this.loading.style.display = "none";
  },

  drawFileList: function (url, browserHeader) {
    const fileBrowserPlugin = this.plugins.fileBrowser;

    const xmlHttp = (fileBrowserPlugin.xmlHttp = this.util.getXMLHttpRequest());
    xmlHttp.onreadystatechange = fileBrowserPlugin.callBackGet.bind(
      this,
      xmlHttp
    );
    xmlHttp.open("get", url, true);
    if (
      browserHeader !== null &&
      typeof browserHeader === "object" &&
      this._window.Object.keys(browserHeader).length > 0
    ) {
      for (const key in browserHeader) {
        xmlHttp.setRequestHeader(key, browserHeader[key]);
      }
    }
    xmlHttp.send(null);

    this.plugins.fileBrowser.showBrowserLoading();
  },

  callBackGet: function (xmlHttp) {
    if (xmlHttp.readyState === 4) {
      this.plugins.fileBrowser.xmlHttp = null;
      if (xmlHttp.status === 200) {
        try {
          this.plugins.fileBrowser.drawListItem.call(
            this,
            JSON.parse(xmlHttp.responseText).result,
            true
          );
        } catch (e) {
          throw Error(
            '[KothingEditor.fileBrowser.drawList.fail] cause : "' +
              e.message +
              '"'
          );
        } finally {
          this.plugins.fileBrowser.closeBrowserLoading();
          this.context.fileBrowser.body.style.maxHeight =
            this._window.innerHeight -
            this.context.fileBrowser.header.offsetHeight -
            50 +
            "px";
        }
      } else {
        // exception
        this.plugins.fileBrowser.closeBrowserLoading();
        if (xmlHttp.status !== 0) {
          const res = !xmlHttp.responseText
            ? xmlHttp
            : JSON.parse(xmlHttp.responseText);
          const err =
            "[KothingEditor.fileBrowser.get.serverException] status: " +
            xmlHttp.status +
            ", response: " +
            (res.errorMessage || xmlHttp.responseText);
          throw Error(err);
        }
      }
    }
  },

  drawListItem: function (items, update) {
    const fileBrowserContext = this.context.fileBrowser;
    const pluginContext = this.context[fileBrowserContext.contextPlugin];

    const _tags = [];
    const len = items.length;
    const columnSize =
      pluginContext.columnSize || fileBrowserContext.columnSize;
    const splitSize = columnSize <= 1 ? 1 : Math.round(len / columnSize) || 1;
    const drawItemHandler = pluginContext.itemTemplateHandler;

    let tagsHTML = "";
    let listHTML = '<div class="ke-file-item-column">';
    let columns = 1;
    for (let i = 0, item, tags; i < len; i++) {
      item = items[i];
      tags = !item.tag
        ? []
        : typeof item.tag === "string"
        ? item.tag.split(",")
        : item.tag;
      tags = item.tag = tags.map(function (v) {
        return v.trim();
      });
      listHTML += drawItemHandler(item);

      if ((i + 1) % splitSize === 0 && columns < columnSize && i + 1 < len) {
        columns++;
        listHTML += '</div><div class="ke-file-item-column">';
      }

      if (update && tags.length > 0) {
        for (let t = 0, tLen = tags.length, tag; t < tLen; t++) {
          tag = tags[t];
          if (tag && _tags.indexOf(tag) === -1) {
            _tags.push(tag);
            tagsHTML += '<a title="' + tag + '">' + tag + "</a>";
          }
        }
      }
    }
    listHTML += "</div>";

    fileBrowserContext.list.innerHTML = listHTML;

    if (update) {
      fileBrowserContext.items = items;
      fileBrowserContext.tagArea.innerHTML = tagsHTML;
      fileBrowserContext.tagElements =
        fileBrowserContext.tagArea.querySelectorAll("A");
    }
  },

  onClickTag: function (e) {
    const target = e.target;
    if (!this.util.isAnchor(target)) {
      return;
    }

    const tagName = target.textContent;
    const fileBrowserPlugin = this.plugins.fileBrowser;
    const fileBrowserContext = this.context.fileBrowser;

    const selectTag = fileBrowserContext.tagArea.querySelector(
      'a[title="' + tagName + '"]'
    );
    const selectedTags = fileBrowserContext.selectedTags;
    const sTagIndex = selectedTags.indexOf(tagName);

    if (sTagIndex > -1) {
      selectedTags.splice(sTagIndex, 1);
      this.util.removeClass(selectTag, "on");
    } else {
      selectedTags.push(tagName);
      this.util.addClass(selectTag, "on");
    }

    fileBrowserPlugin.drawListItem.call(
      this,
      selectedTags.length === 0
        ? fileBrowserContext.items
        : fileBrowserContext.items.filter(function (item) {
            return item.tag.some(function (tag) {
              return selectedTags.indexOf(tag) > -1;
            });
          }),
      false
    );
  },

  onClickFile: function (e) {
    e.preventDefault();
    e.stopPropagation();

    const fileBrowserContext = this.context.fileBrowser;
    const listEl = fileBrowserContext.list;
    let target = e.target;
    let command = null;

    if (target === listEl) {
      return;
    }

    while (listEl !== target.parentNode) {
      command = target.getAttribute("data-command");
      if (command) {
        break;
      }
      target = target.parentNode;
    }

    if (!command) {
      return;
    }

    const handler =
      fileBrowserContext.selectorHandler ||
      this.context[fileBrowserContext.contextPlugin].selectorHandler;
    this.plugins.fileBrowser.close.call(this);
    handler(target);
  },
};
