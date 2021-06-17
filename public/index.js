import "../src/assets/css/editor.css";
import "../src/assets/css/editor-contents.css";
import KothingEditor from "../src/editor";
import plugins from "../src/plugins";
import lang from "../src/lang";
import katex from "katex";
import "katex/dist/katex.min.css";
/**
 * ID : 'kt-editor1'
 * ClassName : 'kothing-eidtor'
 */
const editor1 = KothingEditor.create(document.getElementById("kt-editor1"), {
  width: "100%",
  // minHeight: "200px",
  height: "200px",
  plugins: plugins,
  katex: katex,
  lang: lang.en,
  stickyToolbar: false,
  mode: 'classic', // 'classic', 'inline', 'balloon'
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
  value: `<p><span style="color: rgb(0, 0, 0); font-family: &quot;Microsoft YaHei&quot;; font-size: medium; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;"><span style="background-color: rgb(255, 0, 0);"><u><em><del><strong>A powerful WYSIWYG rich text web editor by pure javascript</strong></del></em></u></span></span></p><p><font color="#000000" face="Microsoft YaHei" size="3"><b><i><u><strike><br></strike></u></i></b></font></p><table><tbody><tr><td><div>tt</div></td><td><div>bb</div></td><td><div>ccc</div></td><td><div>ddffff</div></td><td><div>tfff</div></td></tr><tr><td><div><br></div></td><td><div><br></div></td><td><div><br></div></td><td><div><br></div></td><td><div><br></div></td></tr><tr><td><div><br></div></td><td><div><br></div></td><td><div><br></div></td><td><div><br></div></td><td><div><br></div></td></tr><tr><td><div><br></div></td><td><div><br></div></td><td><div><br></div></td><td><div><br></div></td><td><div><br></div></td></tr></tbody></table>`
});

const getValueBtn = document.getElementById("get-content1");
getValueBtn.addEventListener(
  "click",
  () => {
    alert(editor1.getContents());
  },
  false
);

/////////////////////////////////////////

const editor2 = KothingEditor.create("kt-editor2", {
  width: "100%",
  // minHeight: "200px",
  height: "200px",
  plugins: plugins,
  katex: katex,
  lang: lang.en,
  stickyToolbar: false,
  mode: 'inline',
  toolbarItem: [
    ["undo", "redo"],
    ["font", "fontSize", "formatBlock"],
    ["bold", "underline", "italic", "strike", "subscript", "superscript", "fontColor", "hiliteColor"],
    ["outdent", "indent", "align", "list", "horizontalRule"],
    ["removeFormat"],
  ],
  charCounter: true,
  value: `<p>Hello World</p>`
});
