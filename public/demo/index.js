

import kothintEditor from '../src/editor';
import plugins from '../src/plugins';
import { zh_cn } from '../src/lang';
import lang from '../src/lang';
import '../src/assets/css/editor.css';
import '../src/assets/css/editor-contents.css';

import custom_plugin_submenu from './custom_plugin_submenu';
// import custom_plugin_dialog from './custom_plugin_dialog';
// import Resolutions from './Resolutions';
// import subLib from './sub_lib';
// import custom_container from './custom_container';

import CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/htmlmixed/htmlmixed';

import Katex from 'katex';
import 'katex/dist/katex.min.css';

Array.prototype._move = function (from, to) {
  this.splice(to, 0, this.splice(from, 1)[0]);
};

const align = require('../src/plugins/submenu/align');

// const shadow = document.querySelector('#app').attachShadow({ mode: 'open' })
// const appEl = document.createElement('textarea')
// const appStyle = document.createElement('style')
// appStyle.textContent = util.getPageStyle();

// shadow.appendChild(appStyle);
// shadow.appendChild(appEl);
// kothintEditor.create(appEl, {
//     width: '400px',
//     height: 500
// })


// ssss.disabled();

// ssss.setContents(`<p><br /></p><div class="ke-component ke-image-container __ke__float-none"><img src="http://kothing.github.io/editor/img/beauty.jpg" alt="" style="" /></div><p><br /></p>`)


kothintEditor.create('scrolleditor', {
  plugins: plugins,
  // mode: 'balloon-always',
  katex: Katex,
  // attributesWhitelist: 'style',
  width: '100%',
  toolbarItem: [
    ['font', 'fontSize', 'formatBlock'],
  ],
});

let s1 = kothintEditor.create('editor', {
  plugins: plugins,
  mode: "balloon-always",
  value: '',
  resizingBar: false,
  showPathLabel: false,
  display: "inline",
  tabDisable: false,
  placeholder: "Enter the question image here",
  toolbarItem: [["table", "removeFormat"]],
});

// s1.core._charCount = function (nextCharCount, blink) {
//     const charCounter = this.context.element.charCounter;
//     if (!charCounter) return true;
//     if (!nextCharCount || nextCharCount < 0) nextCharCount = 0;

//     const maxCharCount = this.context.options.maxCharCount;
//     const wysiwyg = this.context.element.wysiwyg;

//     ///// -- get empty list ////
//     const emptyListCount = this.util.getListChildren(wysiwyg, function (current) {
//         return this.isListCell(current) && current.childNodes.length === 1 && this.isBreak(current.firstChild)
//     }.bind(this.util)).length;
//     //// ------------------ ////

//     this._w.setTimeout(function () {
//         charCounter.textContent = wysiwyg.textContent.length + emptyListCount; // add empty list
//     });

//     if (maxCharCount > 0) {
//         let over = false;
//         const count = wysiwyg.textContent.length + emptyListCount; // add empty list

//         if (count > maxCharCount) {
//             this._editorRange();
//             const range = this.getRange();
//             const endOff = range.endOffset - 1;
//             const text = this.getSelectionNode().textContent;

//             this.getSelectionNode().textContent = text.slice(0, range.endOffset - 1) + text.slice(range.endOffset, text.length);
//             this.setRange(range.endContainer, endOff, range.endContainer, endOff);
//             over = true;
//         } else if ((count + nextCharCount) > maxCharCount) {
//             over = true;
//         }

//         if (over) {
//             if (blink && !this.util.hasClass(charCounter, 'ke-blink')) {
//                 this.util.addClass(charCounter, 'ke-blink');
//                 this._w.setTimeout(function () {
//                     this.removeClass(charCounter, 'ke-blink');
//                 }.bind(this.util), 600);
//             }

//             return false;
//         }
//     }

//     return true;
// }.bind(s1.core)

window.cm = CodeMirror;

// let s1 = window.s1 = kothintEditor.create(document.getElementById('editor'), {
//     plugins: [lineHeight],
//     toolbarItem: [
//         [
//             'lineHeight'
//         ]
//     ],
//     height: 'auto',
//     width: '500px',
//     // mode: 'balloon',
//     stickyToolbar: '0',
//     videoResizing: false,
//     imageWidth: 150,
//     placeholder: 'Start typing something...'
//     // fullPage: true,

// });

window.kothing_destroy1 = function () {
  s1.destroy();

  // s1.setDefaultStyle('height: auto; font-family: cursive; font-size: 10px; width:300px;');

  // s1.setContents('<!DOCTYPE html>'+
  // '<html lang="en">'+
  // '<head>'+
  //     '<meta charset="UTF-8">'+
  //     '<meta name="viewport" content="width=device-width, initial-scale=1">'+
  //     '<meta name="author" content="https://github.com/kothing" />'+
  //     '<meta name="description" content="Pure javascript wysiwyg web editor" /> <!-- meta comment -->'+
  // '<style>'+
  // '/* css comment goes here */'+
  // '</style>'+
  // '</head>'+
  // '<body>'+
  // '<!-- html comment goes here -->'+

  // '</body>'+
  // '</html>')
};

window.kothing_create1 = function () {
  // s1.destroy();
  s1 = kothintEditor.create('editor', {
    plugins: [align, plugins.link],
    toolbarItem: [['align', 'link', 'bold', 'underline', 'italic', 'strike', 'removeFormat', 'codeView']],
    width: '100%',
    height: 'auto',
  });
};

s1.onKeyDown = function (e, core) {
  const keyCode = e.keyCode;
  const ctrl = e.ctrlKey || e.metaKey || keyCode === 91 || keyCode === 92;
  if (ctrl && keyCode === 187) {
    e.preventDefault();
    const anchor = core.util.getParentElement(core.getSelectionNode(), core.util.isAnchor);
    if (anchor) {
      window.open(anchor.href);
    }
  }
};

let ss = window.ss = kothintEditor.create(document.getElementById('editor1'), {
  lang: lang.zh_cn,
  plugins: plugins,
  katex: Katex,
  // value: '',
  codeMirror: CodeMirror,
  display: 'block',
  width: '100%',
  height: '500px',
  audioTagAttrs: {
    controlslist: "nodownload",
  },
  videoTagAttrs: {
    poster: "http://kothing.github.io/editor/img/loading.gif",
    autoplay: true,
  },
  videoIframeAttrs: {
    style: "border: 2px solid red;",
  },
  // height: 'auto',
  iframeCSSFileName: '.+',
  addTagsWhitelist: 'i',
  popupDisplay: 'full',
  charCounter: true,
  charCounterType: 'byte-html',
  charCounterLabel: 'Characters :',
  imageMultipleFile: true,
  videoMultipleFile: true,
  audioMultipleFile: true,
  // imageUploadUrl: 'http://localhost:3000/editor/upload',
  // videoUploadUrl: 'http://localhost:3000/editor/upload',
  // audioUploadUrl: 'http://localhost:3000/editor/upload',
  icons: {
    expansion: "<span>A</span>",
    reduction: "<span>Z</span>",
  },
  iframe: true,
  videoFileInput: true,
  audioFileInput: true,
  placeholder: 'Start typing something...',
  templates: [
    {
      name: 'Template-1',
      html: '<p>HTML source1</p>',
    },
    {
      name: 'Template-2',
      html: '<p>HTML source2</p>',
    },
  ],
  // maxCharCount: 670,
  imageGalleryUrl: '',
  toolbarItem: [
    // default
    ['undo', 'redo'],
    ['font', 'fontSize', 'formatBlock'],
    ['paragraphStyle', 'blockquote'],
    ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
    ['fontColor', 'hiliteColor', 'textStyle'],
    ['removeFormat'],
    ['outdent', 'indent'],
    ['align', 'horizontalRule', 'list', 'lineHeight'],
    ['table', 'link', 'image', 'video', 'audio', 'math'],
    ['imageGallery'],
    ['fullScreen', 'showBlocks', 'codeView'],
    ['preview', 'print'],
    ['save', 'template'],
    // (min-width: 1565)
    ['%1565', [
      ['undo', 'redo'],
      ['font', 'fontSize', 'formatBlock'],
      ['paragraphStyle', 'blockquote'],
      ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
      ['fontColor', 'hiliteColor', 'textStyle'],
      ['removeFormat'],
      ['outdent', 'indent'],
      ['align', 'horizontalRule', 'list', 'lineHeight'],
      ['table', 'link', 'image', 'video', 'audio', 'math'],
      ['imageGallery'],
      ['fullScreen', 'showBlocks', 'codeView'],
      ['-right', ':i-More Misc-default.more_vertical', 'preview', 'print', 'save', 'template'],
    ]],
    // (min-width: 1455)
    ['%1455', [
      ['undo', 'redo'],
      ['font', 'fontSize', 'formatBlock'],
      ['paragraphStyle', 'blockquote'],
      ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
      ['fontColor', 'hiliteColor', 'textStyle'],
      ['removeFormat'],
      ['outdent', 'indent'],
      ['align', 'horizontalRule', 'list', 'lineHeight'],
      ['table', 'link', 'image', 'video', 'audio', 'math'],
      ['imageGallery'],
      ['-right', ':i-More Misc-default.more_vertical', 'fullScreen', 'showBlocks', 'codeView', 'preview', 'print', 'save', 'template'],
    ]],
    // (min-width: 1326)
    ['%1326', [
      ['undo', 'redo'],
      ['font', 'fontSize', 'formatBlock'],
      ['paragraphStyle', 'blockquote'],
      ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
      ['fontColor', 'hiliteColor', 'textStyle'],
      ['removeFormat'],
      ['outdent', 'indent'],
      ['align', 'horizontalRule', 'list', 'lineHeight'],
      ['-right', ':i-More Misc-default.more_vertical', 'fullScreen', 'showBlocks', 'codeView', 'preview', 'print', 'save', 'template'],
      ['-right', ':r-More Rich-default.more_plus', 'table', 'link', 'image', 'video', 'audio', 'math', 'imageGallery'],
    ]],
    // (min-width: 1123)
    ['%1123', [
      ['undo', 'redo'],
      [':p-More Paragraph-default.more_paragraph', 'font', 'fontSize', 'formatBlock', 'paragraphStyle', 'blockquote'],
      ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
      ['fontColor', 'hiliteColor', 'textStyle'],
      ['removeFormat'],
      ['outdent', 'indent'],
      ['align', 'horizontalRule', 'list', 'lineHeight'],
      ['-right', ':i-More Misc-default.more_vertical', 'fullScreen', 'showBlocks', 'codeView', 'preview', 'print', 'save', 'template'],
      ['-right', ':r-More Rich-default.more_plus', 'table', 'link', 'image', 'video', 'audio', 'math', 'imageGallery'],
    ]],
    // (min-width: 817)
    ['%817', [
      ['undo', 'redo'],
      [':p-More Paragraph-default.more_paragraph', 'font', 'fontSize', 'formatBlock', 'paragraphStyle', 'blockquote'],
      ['bold', 'underline', 'italic', 'strike'],
      [':t-More Text-default.more_text', 'subscript', 'superscript', 'fontColor', 'hiliteColor', 'textStyle'],
      ['removeFormat'],
      ['outdent', 'indent'],
      ['align', 'horizontalRule', 'list', 'lineHeight'],
      ['-right', ':i-More Misc-default.more_vertical', 'fullScreen', 'showBlocks', 'codeView', 'preview', 'print', 'save', 'template'],
      ['-right', ':r-More Rich-default.more_plus', 'table', 'link', 'image', 'video', 'audio', 'math', 'imageGallery'],
    ]],
    // (min-width: 673)
    ['%673', [
      ['undo', 'redo'],
      [':p-More Paragraph-default.more_paragraph', 'font', 'fontSize', 'formatBlock', 'paragraphStyle', 'blockquote'],
      [':t-More Text-default.more_text', 'bold', 'underline', 'italic', 'strike', 'subscript', 'superscript', 'fontColor', 'hiliteColor', 'textStyle'],
      ['removeFormat'],
      ['outdent', 'indent'],
      ['align', 'horizontalRule', 'list', 'lineHeight'],
      [':r-More Rich-default.more_plus', 'table', 'link', 'image', 'video', 'audio', 'math', 'imageGallery'],
      ['-right', ':i-More Misc-default.more_vertical', 'fullScreen', 'showBlocks', 'codeView', 'preview', 'print', 'save', 'template'],
    ]],
    // (min-width: 525)
    ['%525', [
      ['undo', 'redo'],
      [':p-More Paragraph-default.more_paragraph', 'font', 'fontSize', 'formatBlock', 'paragraphStyle', 'blockquote'],
      [':t-More Text-default.more_text', 'bold', 'underline', 'italic', 'strike', 'subscript', 'superscript', 'fontColor', 'hiliteColor', 'textStyle'],
      ['removeFormat'],
      ['outdent', 'indent'],
      [':e-More Line-default.more_horizontal', 'align', 'horizontalRule', 'list', 'lineHeight'],
      [':r-More Rich-default.more_plus', 'table', 'link', 'image', 'video', 'audio', 'math', 'imageGallery'],
      ['-right', ':i-More Misc-default.more_vertical', 'fullScreen', 'showBlocks', 'codeView', 'preview', 'print', 'save', 'template'],
    ]],
    // (min-width: 420)
    ['%420', [
      ['undo', 'redo'],
      [':p-More Paragraph-default.more_paragraph', 'font', 'fontSize', 'formatBlock', 'paragraphStyle', 'blockquote'],
      [':t-More Text-default.more_text', 'bold', 'underline', 'italic', 'strike', 'subscript', 'superscript', 'fontColor', 'hiliteColor', 'textStyle', 'removeFormat'],
      [':e-More Line-default.more_horizontal', 'outdent', 'indent', 'align', 'horizontalRule', 'list', 'lineHeight'],
      [':r-More Rich-default.more_plus', 'table', 'link', 'image', 'video', 'audio', 'math', 'imageGallery'],
      ['-right', ':i-More Misc-default.more_vertical', 'fullScreen', 'showBlocks', 'codeView', 'preview', 'print', 'save', 'template'],
    ]],
  ],
});
// ss.setContents('fsafsa')
ss.onload = function (core) {
  console.log('onload', core.context.video._infoList);
  // core.focus();
};
ss.onScroll = function () {
  // console.log('onScroll', e);
};
ss.onClick = function () {
  // console.log('onClick', e);
};
ss.onFocus = function (e) {
  console.log('onFocus', e);
};
ss.onBlur = function (e) {
  console.log('onBlur', e);
};
ss.onKeyDown = function () {
  // console.log('onKeyDown', e);
};
ss.onKeyUp = function () {
  // console.log('onKeyUp', e);
};
ss.onDrop = function () {
  // console.log('onDrop', e);
  return true;
};
ss.onPaste = function () {
  // console.log('onPaste', e.clipboardData.files)
  return true;
};
ss.onAudioUpload = function (targetElement, index, state, videoInfo) {
  // console.log('targetElement:${targetElement}, index:${index}, state:${state}')
  console.log('videoInfo-----', videoInfo);
};
// ss.onVideoUploadError = function (messge, result, core) {
//     console.log('video error-----', messge)
//     return true
// }
ss.onAudioUploadBefore = function (files, info) {
  console.log('before-----', files);
  console.log('before----info-', info);
  return true;
};
ss.onChange = function (contents, core) {
  console.log('change', core.context.video._infoList);
};

// ss.imageUploadHandler = function (response, core) {
//     console.log('rrrr', response)
// }

// ss.onImageUploadBefore = function (files, info, core, uploadHandler) {
//     // ResizeImage(files, uploadHandler)

//     const response = { // Same format as "videoUploadUrl" response
//         "result": [ { "url": "http://kothing.github.io/editor/img/beauty.jpg", "name": "test", "size": "0" }, ]
//     };
//     uploadHandler(response);
// }

// ss.onImageUpload = function (targetElement, index, state, info, core) {
//     console.log('imageInfo-----', info);
// }

ss.showInline = function () {

},

  // ss.showController = function (name, controllers, core) {
  //     let c = null;
  //     console.log('target', core.currentControllerTarget);
  //     for (let i in controllers) {
  //         c = controllers[i];
  //         if (core.util.hasClass(c, 'ke-controller-resizing')) {
  //             const updateButton = c.querySelector('[data-command="update"]');
  //             if (name === 'image') updateButton.setAttribute('disabled', true);
  //             else updateButton.removeAttribute('disabled');
  //         }
  //     }
  // }

  window.kothing_noticeOpen = function () {
    ss.noticeOpen('test notice');
  };

window.kothing_noticeClose = function () {
  ss.noticeClose();
};

window.kothing_save = function () {
  ss.save();
};

window.kothing_getContext = function () {
  console.log(ss.getContext());
};

window.kothing_getImagesInfo = function () {
  console.log(ss.getImagesInfo());
  ss.getImagesInfo().list[0].select();
};

window.kothing_insertHTML = function () {
  ss.insertHTML('<img style="height:100px; width:100px;" src="http://kothing.github.io/editor/img/beauty.jpg" /><p>fdafds</p>', true, true, true);
};

window.kothing_getContents = function () {
  // alert(ss.getContents());

  console.log(ss.getText());

  // ss.core.commandHandler(null, 'selectAll')
  // let t = '';
  // const lines = ss.core.getSelectedElements();
  // for (let i = 0, len = lines.length; i < len; i++) {
  //     t += lines[i].textContent + '\n';
  // }
  // console.log(t);

  // console.log(ss.core.context.element.wysiwyg.textContent)
};

window.kothing_setContents = function () {
  ss.setContents('<style>div{color: red;}</style><p><br></p><img src="https://picsum.photos/200/300"><img src="https://picsum.photos/200/300"><p><br></p>');
  ss.core.history.reset(true);
  ss.core.focusEdge(null);
  // ss.core.context.tool.save.disabled = true;
};

window.kothing_appendContents = function (content) {
  ss.appendContents(content);
};

window.kothing_disabled = function () {
  ss.disabled();
};

window.kothing_enabled = function () {
  ss.enabled();
};

window.kothing_show = function () {
  ss.show();
};

window.kothing_hide = function () {
  ss.hide();
};

window.kothing_destroy = function () {
  // ss.destroy();
  ss.setToolbarButtons([
    [':command2-title2-text.Insert', 'codeView', 'preview'],
    ['outdent', 'indent'],
  ]);
};

window.kothing_create = function () {
  // ss = kothintEditor.create('editor1', {
  //     plugins: plugins,
  //     height: 148
  // });
  ss.setOptions({
    height: 'auto',
  });
};


const editor = kothintEditor.init({
  plugins: [
    plugins.hiliteColor,
    plugins.align,
    plugins.horizontalRule,
    plugins.list,
    plugins.table,
    plugins.link,
    custom_plugin_submenu,
  ],
  width: '100%',
  // iframe: true,
});

let s2 = window.s2 = editor.create(document.getElementById('editor2'), {
  // lang: lang.ru,
  // mode: 'inline',
  // toolbarWidth: 150,
  attributesWhitelist: { 'all': 'uk-icon' },
  plugins: plugins,
  // maxHeight: '400px',
  height: '700px',
  defaultStyle: 'height: 500px; font-size:10px;',
  imageGalleryUrl: 'http://localhost:3000/editor/gallery',
  // height: 400,
  fontSizeUnit: 'pt',
  imageResizing: true,
  // imageWidth: '400',
  toolbarItem: [
    // ['undo', 'redo'],
    // ['font', 'fontSize', 'formatBlock'],
    // ['paragraphStyle'],
    // ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
    ['fontColor', 'hiliteColor', 'textStyle'],
    // ['removeFormat'],
    // ['outdent', 'indent'],
    // ['align', 'horizontalRule', 'list', 'lineHeight', 'table'],
    ['link', 'image', 'video'],
    // ['fullScreen', 'showBlocks', 'codeView'],
    // ['preview', 'print'],
    // ['save', 'template'],
  ],
  icons: {
    underline: '',
    strike: '',
    caption: '',
  },
  templates: [
    {
      name: 'template1',
      html: '<p>fdkjslfjdslkf</p>',
    },
    {
      name: 'templeeeeeeeeeeeeeate2',
      html: '<p><strong>11111</strong></p>',
    },
    {
      name: 'template3',
      html: '<p><u>22222</u></p>',
    },
  ],
  callBackSave: function (contents) {
    alert(contents);
  },
  formats: ['h1', 'p', 'blockquote', {
    tag: 'div',
    class: '__ke__format__aaa',
    name: 'custom div',
    command: 'replace',
  }],
  // iframe: true,
  // fullPage: true,
  // mode: 'balloon',
  codeMirror: CodeMirror,
  // codeMirror: {
  //     src: CodeMirror,
  //     options: {
  //         mode: 'xml'
  //     }
  // },
  // placeholder: 'Start typing something.3..'
  // imageUploadSizeLimit: 30000
});

const newOption = {
  mode: 'balloon',
  iframe: false,
  plugins: plugins,
  // defaultStyle: 'height: 200px;',
  height: 150,
  textSizeUnit: 'pt',
  toolbarItem: [
    ['undo', 'redo'],
    ['font', 'fontSize', 'formatBlock'],
    ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
    ['removeFormat'],
    ['fontColor', 'hiliteColor'],
    ['outdent', 'indent'],
    ['align', 'horizontalRule', 'list', 'table'],
    ['link', 'image', 'video'],
    ['fullScreen', 'showBlocks', 'codeView'],
    ['preview', 'print'],
    ['save'],
  ],
  colorList: [
    ['#ccc', '#dedede', 'OrangeRed', 'Orange', 'RoyalBlue', 'SaddleBrown'],
    ['SlateGray', 'BurlyWood', 'DeepPink', 'FireBrick', 'Gold', 'SeaGreen'],
  ],
  placeholder: 'Placeholder...',
};
const newOption2 = {
  plugins: [plugins.align],
  mode: 'classic',
  toolbarContainer: document.getElementById('test_tool'),
  maxHeight: '400px',
  height: 150,
  imageWidth: '100%',
  colorList: null,
  iframe: true,
  charCounter: true,
  maxCharCount: 200,
};
const newOption3 = {
  mode: 'inline',
  minHeight: '300px',
  colorList: [
    ['#ccc', '#dedede', 'OrangeRed', 'Orange', 'RoyalBlue', 'SaddleBrown'],
  ],
  toolbarItem: [
    ['fontColor', 'hiliteColor'],
  ],
};

let imageList = [];
let videoList = [];
let selectedImages = [];
const imageWrapper = document.getElementById('image_wrapper');
const imageSize = document.getElementById('image_size');
const imageRemove = document.getElementById('image_remove');
const imageTable = document.getElementById('image_list');
const videoTable = document.getElementById('video_list');

window.findIndex = function (arr, index) {
  let idx = -1;

  arr.some(function (a, i) {
    if ((typeof a === 'number' ? a : a.index) === index) {
      idx = i;
      return true;
    }
    return false;
  });

  return idx;
};

window.setVideoList = function () {
  let list = '';

  for (let i = 0, video; i < videoList.length; i++) {
    video = videoList[i];

    list += '<li>' +
      '<button title="delete" onclick="selectVideo(\'delete\',' + video.index + ')">X</button>' +
      '<a href="javascript:void(0)" onclick="selectVideo(\'select\',' + video.index + ')">' + video.src + '</a>' +
      '</li>';
  }

  videoTable.innerHTML = list;
};

window.selectVideo = function (type, index) {
  videoList.findIndex(videoList, index)[type]();
};

window.setImage = function (type, index) {
  imageList.findIndex(imageList, index)[type]();
};

window.checkImage = function (index) {
  const li = imageTable.querySelector('#img_' + index);
  const currentImageIdx = li.findIndex(selectedImages, index);

  if (currentImageIdx > -1) {
    selectedImages.splice(currentImageIdx, 1);
    li.className = '';
  } else {
    selectedImages.push(index);
    li.className = 'checked';
  }

  if (selectedImages.length > 0) {
    imageRemove.removeAttribute('disabled');
  } else {
    imageRemove.setAttribute('disabled', true);
  }
};

window.deleteCheckedImages = function () {
  const iamgesInfo = s2.getImagesInfo();

  for (let i = 0; i < iamgesInfo.length; i++) {
    if (selectedImages.indexOf(iamgesInfo[i].index) > -1) {
      iamgesInfo[i].delete();
      i--;
    }
  }

  selectedImages = [];
};

window.setImageList = function () {
  if (imageList.length > 0) { imageWrapper.style.display = 'flex'; } else { imageWrapper.style.display = 'none'; }

  let list = '';
  let size = 0;

  for (let i = 0, image, fixSize; i < imageList.length; i++) {
    image = imageList[i];
    fixSize = (image.size / 1000).toFixed(1) * 1;

    list += '<li id="img_' + image.index + '">' +
      '<div onclick="checkImage(' + image.index + ')">' +
      '<div><img src="' + image.src + '"></div>' +
      '</div>' +
      '<a href="javascript:void(0)" onclick="setImage(\'select\',' + image.index + ')" class="image-size">' + fixSize + 'KB</a>' +
      '<div class="image-check"><svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path></svg></div>' +
      '</li>';

    size += fixSize;
  }

  imageSize.innerText = size.toFixed(1) + 'KB';
  imageTable.innerHTML = list;
};

s2.onload = function (core, isUpdate) {
  console.log('2222onload222', isUpdate);
};

s2.onImageUpload = function (targetElement, index, state, imageInfo, remainingFilesCount) {
  console.log('imageInfo', imageInfo);

  if (state === 'delete') {
    // imageList.splice(findIndex(imageList, index), 1);
  } else {
    if (state === 'create') {
      const image = s2.getImagesInfo().findIndex(s2.getImagesInfo(), index);
      imageList.push(image);
    } else { // update

    }
  }

  if (remainingFilesCount === 0) {
    console.log('imageList', imageList);
    window.setImageList(imageList);
  }
};

s2.onVideoUpload = function (targetElement, index, state, videoInfo, remainingFilesCount) {
  console.log('videoInfo', videoInfo);

  if (state === 'delete') {
    // videoList.splice(findIndex(videoList, index), 1);
  } else {
    if (state === 'create') {
      videoList.push(videoInfo);
    } else { // update
      //
    }
  }

  if (remainingFilesCount === 0) {
    console.log('videoList', videoList);
    window.setVideoList(videoList);
  }
};

window.kothing_setOptions2 = function () {
  s2.setOptions(newOption);
};

window.kothing_setOptions3 = function () {
  s2.setOptions(newOption2);
};
window.kothing_setOptions4 = function () {
  s2.setOptions(newOption3);
};

window.kothing_insertImage2 = function () {
  s2.insertImage(document.getElementById('kothing_files').files);
};


window.kothing_destroy2 = function () {
  s2.destroy();
};

window.kothing_create2 = function () {
  s2 = kothintEditor.create('editor2', {
  });
};

let s3 = editor.create(document.getElementsByName('editor3')[0], {
  toolbarItem: [
    [plugins.formatBlock, 'align', 'horizontalRule', 'list', 'table', 'codeView', plugins.image, plugins.video, plugins.link, plugins.link, plugins.fontColor, plugins.hiliteColor, plugins.fontSize],
  ],
  mode: 'balloon-always',
  lang: zh_cn,
  width: '100%',
  height: '500px',
  stickyToolbar: false,
  popupDisplay: 'local',
  // iframe: true,
  // maxCharCount: 300,
  // resizingBar: false
  // showPathLabel:false
  charCounter: true,
  // formats: ['h1', 'h4', 'pre', 'p', 'blockquote', {
  //     tag: 'div',
  //     class: '__ke__format__aaa',
  //     name: 'red div',
  //     style: 'margin: 10px; background-color: #f5f5f5;',
  //     command: 'replace'
  // }],
  placeholder: 'Start typing something.4..',
  // maxCharCount: 280,
});
window.kothing_destroy3 = function () {
  s3.destroy();
};

window.kothing_create3 = function () {
  s3 = kothintEditor.create(document.getElementsByName('editor3')[0], {
  });
};


window.kothing_create4 = function () {
  const win = window.open();
  document.querySelectorAll('link').forEach(function (linkNode) {
    win.document.write(linkNode.outerHTML);
  });
  win.document.write('<textarea name="editor4" id="editor4" style="width: 1080px; height: 200px;"></textarea>');
};
