/*
 * KothingEditor
 *
 * The WYSIWYG Rich Text Editor
 * Copyright Kothing.
 * MIT license.
 */

import dialog from "../modules/dialog";

function insertAt(parent, child, index) {
  if (!index) {
    index = 0;
  }
  if (index >= parent.children.length) {
    parent.appendChild(child);
  } else {
    parent.insertBefore(child, parent.children[index]);
  }
}

export default {
  name: "mention",
  display: "dialog",

  renderItem: function (item) {
    return `<span>${item}</span>`;
  },

  getItems: function (term) {
    return Promise.resolve(
      ["overwite", "the", "mention", "plugin", "getItems", "method"].filter(
        (w) => w.includes(term.toLowerCase())
      )
    );
  },

  renderList: function (term) {
    const { mention } = this.context;
    let promise = Promise.resolve();
    if (mention.term !== term) {
      mention.focussed = 0;
      mention.term = term;
      promise = mention.getItems(term).then((items) => {
        mention.items = items;

        Object.keys(mention.itemElements).forEach((id) => {
          if (!items.find((i) => mention.getId(i) === id)) {
            const child = mention.itemElements[id];
            child.parentNode.removeChild(child);
            delete mention.itemElements[id];
          }
        });

        items.forEach((item, idx) => {
          const id = mention.getId(item);
          if (!mention.itemElements[id]) {
            const el = this.util.createElement("LI");
            el.setAttribute("data-mention", id);
            this.util.addClass(el, "ke-mention-item");
            el.innerHTML = mention.renderItem(item);
            el.addEventListener("click", () => {
              mention.addMention(item);
            });
            insertAt(mention.list, el, idx);
            mention.itemElements[id] = el;
          }
        });
      });
    }

    promise.then(() => {
      const current =
        mention.list.querySelectorAll(".ke-mention-item")[mention.focussed];
      if (current && !this.util.hasClass(current, "ke-mention-active")) {
        const prev = mention.list.querySelector(".ke-mention-active");
        if (prev) {
          this.util.removeClass(prev, "ke-mention-active");
        }
        this.util.addClass(current, "ke-mention-active");
      }
    });
  },

  setDialog: function (core) {
    const mention_dialog = core.util.createElement("DIV");
    const lang = core.lang;
    mention_dialog.className = "ke-dialog-content";
    mention_dialog.style.display = "none";
    const html = `
      <form class="ke-dialog-form">
        <div class="ke-dialog-header">
          <button type="button" data-command="close" class="ke-btn ke-dialog-close" aria-label="Close" title="${lang.dialogBox.close}">
            ${core.icons.cancel}
          </button>
          <span class="ke-modal-title">${lang.dialogBox.mentionBox.title}</span>
        </div>
        <div class="ke-dialog-body">
          <input class="ke-input-form ke-mention-search" type="text" placeholder="${lang.dialogBox.browser.search}" />
          <ul class="ke-mention-list">
          </ul>
        </div>
      </form>
    `;
    mention_dialog.innerHTML = html;
    return mention_dialog;
  },

  getId(mention) {
    return mention;
  },

  getValue(mention) {
    return `@${mention}`;
  },

  getLinkHref(/*mention*/) {
    return "";
  },

  open: function () {
    const { mention } = this.context;
    this.plugins.dialog.open.call(
      this,
      "mention",
      "mention" === this.currentControllerName
    );
    mention.search.focus();
    mention.renderList("");
  },

  on: function (update) {
    if (update) {
      return;
    }
    this.plugins.mention.init.call(this);
  },

  init: function () {
    const { mention } = this.context;
    mention.search.value = "";
    mention.focussed = 0;
    mention.items = [];
    mention.itemElements = {};
    mention.list.innerHTML = "";
    delete mention.term;
  },

  onKeyPress: function (e) {
    const { mention } = this.context;
    switch (e.key) {
      case "ArrowDown":
        mention.focussed += 1;
        e.preventDefault();
        e.stopPropagation();
        break;

      case "ArrowUp":
        if (mention.focussed > 0) {
          mention.focussed -= 1;
        }
        e.preventDefault();
        e.stopPropagation();
        break;

      case "Enter":
        mention.addMention();
        e.preventDefault();
        e.stopPropagation();
        break;

      default:
    }
  },

  onKeyUp: function (e) {
    const { mention } = this.context;
    mention.renderList(e.target.value);
  },

  getMentions: function (core) {
    const { mentions, getId } = core.context.mention;
    return mentions.filter((mention) => {
      const id = getId(mention);
      return core.context.element.wysiwyg.querySelector(
        `[data-mention="${id}"]`
      );
    });
  },

  addMention: function (item) {
    const { mention } = this.context;
    const new_mention = item || mention.items[mention.focussed];
    if (new_mention) {
      if (
        !mention.mentions.find(
          (m) => mention.getId(m) === mention.getId(new_mention)
        )
      ) {
        mention.mentions.push(new_mention);
      }
      const el = this.util.createElement("A");
      el.href = mention.getLinkHref(new_mention);
      el.target = "_blank";
      el.innerHTML = mention.getValue(new_mention);
      el.setAttribute("data-mention", mention.getId(new_mention));
      this.insertNode(el, null, false);
      const spacer = this.util.createElement("SPAN");
      spacer.innerHTML = " ";
      this.insertNode(spacer, el, false);
    }
    this.plugins.dialog.close.call(this);
  },
  add: function (core) {
    core.addModule([dialog]);
    this.title = core.lang.toolbar.mention;
    const _dialog = this.setDialog(core);
    core.getMentions = this.getMentions(core);

    const search = _dialog.querySelector(".ke-mention-search");
    search.addEventListener("keyup", this.onKeyUp.bind(core));
    search.addEventListener("keydown", this.onKeyPress.bind(core));
    const list = _dialog.querySelector(".ke-mention-list");

    core.context.mention = {
      addMention: this.addMention.bind(core),
      itemElements: {},
      items: [],
      list,
      search,
      focussed: 0,
      getId: this.getId.bind(core),
      getItems: this.getItems,
      getLinkHref: this.getLinkHref.bind(core),
      getValue: this.getValue.bind(core),
      mentions: [],
      modal: _dialog,
      open: this.open.bind(core),
      renderItem: this.renderItem,
      renderList: this.renderList.bind(core),
    };
    core.context.dialog.modal.appendChild(_dialog);
  },
  action: function () {},
};
