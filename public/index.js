import "../src/assets/css/editor.css";
import "../src/assets/css/editor-contents.css";
import KothingEditor from "../src/editor";
import plugins from "../src/plugins";
import katex from "katex";
import "katex/dist/katex.min.css";
/**
 * ID : 'kt-editor1'
 * ClassName : 'kothing-eidtor'
 */
const editor1 = KothingEditor.create(document.getElementById("kt-editor1"), {
  width: "100%",
  // minHeight: "200px",
  height: "300px",
  plugins: plugins,
  katex: katex,
  lang: "en",
  stickyToolbar: false,
  mode: 'classic', // 'classic', 'inline', 'balloon'
  toolbarItem: [
    ["undo", "redo"],
    ["font", "fontSize", "formatBlock"],
    ["bold", "underline", "italic", "strike", "subscript", "superscript", "blockquote", "fontColor", "hiliteColor"],
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
  value: `<p><span style="color: rgb(0, 0, 0); font-family: &quot;Microsoft YaHei&quot;; font-size: medium; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;">A powerful WYSIWYG rich text web editor by pure javascript</span><br><br></p><p><span style="color: rgb(0, 0, 0); font-family: &quot;Microsoft YaHei&quot;; font-size: medium; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;"><span style="background-color: rgb(255, 0, 0);"><u><em><del><strong>A powerful WYSIWYG rich text web editor by pure javascript</strong></del></em></u></span></span></p><p><strong><em><u><del><br></del></u></em></strong></p><table><thead><tr><th><div><br></div></th><th><div><br></div></th><th><div><br></div></th><th><div><br></div></th></tr></thead><tbody><tr><td><div><br></div></td><td><div><br></div></td><td><div><br></div></td><td><div><br></div></td></tr><tr><td><div><br></div></td><td><div><br></div></td><td><div><br></div></td><td><div><br></div></td></tr><tr><td><div><br></div></td><td><div><br></div></td><td><div><br></div></td><td><div><br></div></td></tr></tbody></table>`
});

const getValueBtn = document.getElementById("get-content1");
const setOptionsBtn = document.getElementById("setOptions");
const resetOptions = document.getElementById("resetOptions");
getValueBtn.addEventListener(
  "click",
  () => {
    alert(editor1.getContents());
  },
  false
);

setOptionsBtn.addEventListener(
  "click",
  () => {
    editor1.setOptions({
      minHeight: '300px',
      colorList: [
        ['#ccc', '#dedede', 'OrangeRed', 'Orange', 'RoyalBlue', 'SaddleBrown']
      ],
      toolbarItem: [
        ['fontColor', 'hiliteColor']
      ]
    });
  },
  false
);

resetOptions.addEventListener(
  "click",
  () => {
    editor1.setOptions({
      width: "100%",
      // minHeight: "200px",
      height: "300px",
      plugins: plugins,
      katex: katex,
      lang: "en",
      stickyToolbar: false,
      mode: 'classic', // 'classic', 'inline', 'balloon'
      toolbarItem: [
        ["undo", "redo"],
        ["font", "fontSize", "formatBlock"],
        ["bold", "underline", "italic", "strike", "subscript", "superscript", "blockquote", "fontColor", "hiliteColor"],
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
      value: `<p><span style="color: rgb(0, 0, 0); font-family: &quot;Microsoft YaHei&quot;; font-size: medium; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;">A powerful WYSIWYG rich text web editor by pure javascript</span><br><br></p><p><span style="color: rgb(0, 0, 0); font-family: &quot;Microsoft YaHei&quot;; font-size: medium; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;"><span style="background-color: rgb(255, 0, 0);"><u><em><del><strong>A powerful WYSIWYG rich text web editor by pure javascript</strong></del></em></u></span></span></p><p><strong><em><u><del><br></del></u></em></strong></p><table><thead><tr><th><div><br></div></th><th><div><br></div></th><th><div><br></div></th><th><div><br></div></th></tr></thead><tbody><tr><td><div><br></div></td><td><div><br></div></td><td><div><br></div></td><td><div><br></div></td></tr><tr><td><div><br></div></td><td><div><br></div></td><td><div><br></div></td><td><div><br></div></td></tr><tr><td><div><br></div></td><td><div><br></div></td><td><div><br></div></td><td><div><br></div></td></tr></tbody></table>`
    });
  },
  false
);


/////////////////////////////////////////

KothingEditor.create("kt-editor2", {
  width: "100%",
  // minHeight: "200px",
  height: "200px",
  plugins: plugins,
  katex: katex,
  lang: "en",
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
