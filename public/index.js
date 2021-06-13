import "../src/assets/css/editor.css";
import "../src/assets/css/editor-contents.css";
import KothingEditor from "../src/editor";
import plugins from "../src/plugins";
import lang from "../src/lang";
import katex from "katex";
import "katex/dist/katex.min.css";
/**
 * ID : 'kt-editor'
 * ClassName : 'kothing-eidtor'
 */
const editor = KothingEditor.create(document.getElementById("kt-editor"), {
  width: "100%",
  // minHeight: "200px",
  height: "200px",
  plugins: plugins,
  katex: katex,
  lang: lang.en,
  stickyToolbar: false,
  toolbarItem: [
    ["undo", "redo"],
    ["font", "fontSize", "formatBlock"],
    ["bold", "underline", "italic", "strike", "subscript", "superscript", "fontColor", "hiliteColor"],
    ["outdent", "indent", "align", "list", "horizontalRule"],
    ["link", "table", "image", "audio", "video"],
    ["lineHeight", "paragraphStyle", "textStyle"],
    ["showBlocks", "codeView"],
    ["math"],
    ["preview", "print", "fullScreen"],
    ["save", "template"],
    ["removeFormat"],
  ],
  templates: [
    {
      name: "Template-1",
      html: "<p>HTML source1</p>",
    },
    {
      name: "Template-2",
      html: "<p>HTML source2</p>",
    },
  ],
  charCounter: true,
});

const getValueBtn = document.getElementById("get-content");
getValueBtn.addEventListener(
  "click",
  () => {
    alert(editor.getContents());
  },
  false
);
