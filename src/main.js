/*
 * KothingEditor
 *
 * The WYSIWYG Rich Text Editor
 * Copyright Kothing.
 * MIT license.
 */

import "./assets/css/editor.css";
import "./assets/css/editor-contents.css";

import plugins from "./plugins";
import KothingEditor from "./editor";

if (!window.KothingEditor) {
  Object.defineProperty(window, "KothingEditor", {
    enumerable: true,
    writable: false,
    configurable: false,
    value: KothingEditor.init({
      plugins: plugins,
    }),
  });
}
