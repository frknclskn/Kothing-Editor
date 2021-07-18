# KothingEditor

A powerful WYSIWYG rich text web editor by pure javascript

> #### Demo : <a href="http://kothing.github.io/editor" target="_blank">kothing.github.io/editor</a>

> The KothingEditor is a lightweight, flexible, customizable WYSIWYG text editor for your web applications.
>
> - Pasting from Microsoft Word and Excel.
> - Custom table selection, merge and split.
> - Media embeds, image uploads.
> - Can use CodeMirror.
> - And.. many other features :)

## Table of contents

- [Browser Support](#browser-support)
- [Install](#install)
- [Getting Started](#getting-started)
- [Use import statement](#use-import-statement)
  - [Load only what you want](#1-load-only-what-you-want)
  - [Load all plugins](#2-load-all-plugins)
  - [Plugins can be used directly in the toolbar item](#3-plugins-can-be-used-directly-in-the-toolbar-item)
- [Init function](#init-function)
- [Use CodeMirror](#use-codemirror)
- [Options](#options)
- [Functions](#functions)
- [Examples](#examples)
  - [Defining menu items](#defining-menu-items)
  - [Char count, Button groups](#char-count-button-groups)
  - [Iframe, fullPage and use CodeMirror](#iframe-fullpage-and-use-codemirror)
  - [Image management](#image-management)
  - [User Functions](#user-functions)
- [Options template](#options-template)
- [Custom plugins](#custom-plugins)
- [Document](#document)
- [License](#license)

#### Browser Support

| Chrome | Firefox | Opera | Safari | Edge | Internet Explorer |
| :----: | :-----: | :---: | :----: | :--: | :---------------: |
|  Yes   |   Yes   |  Yes  |  Yes   | Yes  |        11+        |

## Install

#### npm

```sh
$ npm install --save kothing-editor
```

#### CDN

```html
<link href="./kothing-editor.min.css" rel="stylesheet" />
<script src="./kothing-editor.min.js"></script>
```

## Getting Started

### 1. Include

```html
<link href="./css/kothing-editor.min.css" rel="stylesheet" />
<script src="./kothing-editor.min.js"></script>
```

### 2. Target Element

```html
<textarea id="my-editor">Hi</textarea>
```

### 3. Create

```javascript
/**
 * ID : 'my-editor'
 * ClassName : 'kothing-eidtor'
 */
// ID or DOM object
KothingEditor.create(document.getElementById('my-editor'), {
  // All of the plugins are loaded in the "window.KothingEditor" object in kothing-editor.min.js file
  // Insert options
  width: '100%',
});
```

### 4. Contents display

```text
When you display a document created by KothingEditor
You need to include "kothing-editor/css/kothing-editor.min.css" file.
```

## Use import statement

### 1. Load only what you want

```javascript
import 'kothing-editor/css/kothing-editor.min.css';
import KothingEditor from 'kothing-editor';
import { font, fontSize, fontColor, horizontalRule, list, image } from 'kothing-editor/lib/plugins';
import lang from 'kothing-editor/lib/lang';

KothingEditor.create('my-editor', {
  plugins: [font, fontSize, fontColor, horizontalRule, link, image],
  toolbarItem: [['font', 'fontSize'], ['fontColor'], ['horizontalRule'], ['link', 'image']],
  lang: lang.zh_cn,
});
```

### 2. Load all plugins

```javascript
import KothingEditor from 'kothing-editor';
import lang from 'kothing-editor/lib/lang';
import plugins from 'kothing-editor/lib/plugins';
import 'kothing-editor/css/kothing-editor.min.css';
import katex from 'katex';
import 'katex/dist/katex.min.css'

KothingEditor.create('document', {
    width: '100%',
    height: 'auto',
    lang: lang.en,
    plugins: plugins,
    katex: katex,
    toolbarItem: [
      ['undo', 'redo'],
      ['font', 'fontSize', 'formatBlock'],
      ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript', 'fontColor', 'hiliteColor'],
      ['outdent', 'indent', 'align', 'list', 'horizontalRule'],
      ['link', 'table', 'image', 'audio', 'video'],
      '/', // Line break
      ['lineHeight', 'paragraphStyle', 'textStyle'],
      ['showBlocks', 'codeView'],
      ['math'],
      ['preview', 'print', 'fullScreen'],
      ['save', 'template'],
      ['removeFormat']
    ],
    templates: [
      {
        name: 'Template-1',
        html: '<p>HTML source1</p>'
      },
      {
        name: 'Template-2',
        html: '<p>HTML source2</p>'
      },
    ],
    charCounter: true,
})

// You can also load what you want
KothingEditor.create('my-editor', {
    plugins: [
        plugins.font
        plugins.fontSize
    ],
    toolbarItem: [
        ['font', 'fontSize'],
        // Plugins can be used directly in the toolbar item
        [plugins.formatBlock]
    ]
})
```

### 3. Plugins can be used directly in the toolbar item

```javascript
import 'kothing-editor/css/kothing-editor.min.css';
import KothingEditor from 'kothing-editor';
import {
  align,
  font,
  fontSize,
  fontColor,
  hiliteColor,
  horizontalRule,
  list,
  table,
  template,
  formatBlock,
  link,
  image,
  video,
} from 'kothing-editor/lib/plugins';

KothingEditor.create('my-editor', {
  toolbarItem: [
    ['undo', 'redo'],
    [font, fontSize, formatBlock],
    ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
    ['removeFormat'],
    [fontColor, hiliteColor],
    ['outdent', 'indent'],
    [align, horizontalRule, list, table],
    [link, image, video],
    ['fullScreen', 'showBlocks', 'codeView'],
    ['preview', 'print'],
    ['save', template],
  ],
});
```

## Init function

```text
The init function can be used by predefining options and calling the create function on the returned object.
The value of the option argument put in the "create" function call takes precedence
```

```javascript
import 'kothing-editor/css/kothing-editor.min.css';
import KothingEditor from 'kothing-editor';
import plugins from 'kothing-editor/lib/plugins';

// all plugins
const initEditor = KothingEditor.init({
  plugins: plugins,
  height: 200,
  toolbarItem: [
    [
      'undo',
      'redo',
      'font',
      'fontSize',
      'formatBlock',
      'bold',
      'underline',
      'italic',
      'strike',
      'subscript',
      'superscript',
      'removeFormat',
      'fontColor',
      'hiliteColor',
      'outdent',
      'indent',
      'align',
      'horizontalRule',
      'list',
      'table',
      'link',
      'image',
      'video',
      'fullScreen',
      'showBlocks',
      'codeView',
      'preview',
      'print',
      'save',
      'template',
    ],
  ],
});

initEditor.create('my-editor_1', {
  // The value of the option argument put in the "create" function call takes precedence
});

initEditor.create('my-editor_2', {
  // The value of the option argument put in the "create" function call takes precedence
  height: 'auto',
  toolbarItem: [['bold', 'underline', 'italic'], ['removeFormat'], ['preview', 'print']],
});
```

## Use CodeMirror

```html
<!-- codeMirror -->
<!-- Use version 5.0.0 or later. -->
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/codemirror@5.49.0/lib/codemirror.min.css"
/>
<script src="https://cdn.jsdelivr.net/npm/codemirror@5.49.0/lib/codemirror.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/codemirror@5.49.0/mode/htmlmixed/htmlmixed.js"></script>
<script src="https://cdn.jsdelivr.net/npm/codemirror@5.49.0/mode/xml/xml.js"></script>
<script src="https://cdn.jsdelivr.net/npm/codemirror@5.49.0/mode/css/css.js"></script>
```

```javascript
import 'kothing-editor/css/kothing-editor.min.css';
import KothingEditor from 'kothing-editor';
// Import codeMirror
import CodeMirror from 'codemirror';
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/lib/codemirror.css';

KothingEditor.create('my-editor', {
  codeMirror: CodeMirror,
  // Set options
  // codeMirror: {
  //     src: CodeMirror,
  //     options: {...}
  // }
  toolbarItem: [['codeView']],
  height: 400,
});
```

## Use KaTeX (math plugin)
```html
<!-- https://github.com/KaTeX/KaTeX -->
<!-- KaTeX (^0.11.1) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/katex.min.css">
<script src="https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/katex.min.js"></script>
```
```javascript
import 'kothing-editor/dist/css/kothing-editor.min.css'
import KothingEditor from 'kothing-editor'
// Import katex
import katex from 'katex'
import 'katex/dist/katex.min.css'

KothingEditor.create('sample', {
    katex: katex // window.katex,
    // Set options
    // katex: {
    //     src: katex,
    //     options: {...}
    // }
    toolbarItem: [
        ['math']
    ]
});
```

## Options

```javascript
plugins: [
    font,
    fontSize,
    formatBlock,
    fontColor,
    hiliteColor,
    align,
    horizontalRule,
    list,
    table,
    template,
    link,
    image,
    video
]               : Plugins array.     default: null {Array}

// Layout-------------------------------------------------------------------------------------------------------
lang            : language object.   default : en {Object}
mode            : The mode of the editor ('classic', 'inline', 'balloon'). default: 'classic' {String}
toolbarWidth    : The width of the toolbar. Applies only when the editor mode is
                  'inline' or 'balloon' mode. default: 'auto' {Number|String}
stickyToolbar   : Reference height value that should be changed to sticky toolbar mode.
                  It can also be used when there is another fixed toolbar at the top.
                  Set to 0, '0px', '50px', etc.
                  If set to -1 or false or null to turn off.        default: 0 {Number|String|Boolean}
iframe          : Content will be placed in an iframe and isolated from the rest of the page.  default: false {Boolean}
fullPage        : Allows the usage of HTML, HEAD, BODY tags and DOCTYPE declaration.  default: false {Boolean}
iframeCSSFileName : Name of the CSS file to apply inside the iframe.
                    Applied by searching by filename in the link tag of document.  default: 'KothingEditor' {String}
codeMirror      : If you put the CodeMirror object as an option, you can do Codeview using CodeMirror. default: null {Object}
                  Use version 5.0.0 or later.
                  ex) codeMirror: CodeMirror // Default option
                      codeMirror: { // Custom option
                        src: CodeMirror,
                        options: {
                            /** default options **
                            * mode: 'htmlmixed',
                            * htmlMode: true,
                            * lineNumbers: true
                            */
                        }
                      }


// Display-------------------------------------------------------------------------------------------------------
position        : The position property of KothingEditor.               default: null {String}
display         : The display property of KothingEditor.                default: 'block' {String}
popupDisplay    : Size of background area when activating dialog window ('full'||'local') default: 'full' {String}

// Bottom resizing bar-------------------------------------------------------------------------------------------
resizingBar     : Show the bottom resizing bar.
                  If 'height' value is 'auto', it will not be resized. default: true {Boolean}
showPathLabel   : Displays the current node structure to resizingBar.  default: true {Boolean}
charCounter     : Shows the number of characters in the editor.
                  If the maxCharCount option has a value, it becomes true. default: false {Boolean}
maxCharCount    : The maximum number of characters allowed to be inserted into the editor. default: null {Number}

// Width size----------------------------------------------------------------------------------------------------
width           : The width size of the editor.                     default: clientWidth||'100%' {Number|String}
minWidth        : The min-width size of the editor.
                  Used when 'width' value is 'auto' or '~%'.        default: null {Number|String}
maxWidth        : The max-width size of the editor.
                  Used when 'width' value is 'auto' or '~%'.        default: null {Number|String}

// Height size---------------------------------------------------------------------------------------------------
height          : The height size of the editor.                    default: clientHeight||'auto' {Number|String}
minHeight       : The min-height size of the editor.
                  Used when 'height' value is 'auto'.               default: null {Number|String}
maxHeight       : The max-height size of the editor.
                  Used when 'height' value is 'auto'.               default: null {Number|String}

// Defining menu items-------------------------------------------------------------------------------------------
font            : Change default font-family array.                 default: [...] {Array}
                  Default value: [
                    'Arial', 'Comic Sans MS', 'Courier New', 'Impact',
                    'Georgia','tahoma', 'Trebuchet MS', 'Verdana'
                  ]
fontSize        : Change default font-size array.                   default: [...] {Array}
                  Default value: [
                    8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72
                  ]
formats         : Change default formatBlock array.                 default: [...] {Array}
                  Default value: [
                      'p', 'div', 'blockquote', 'pre', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'
                  ],
                  Custom: [{
                      tag: 'div', // Tag name
                      class: '__ke__xxx' || null, // Class names must always begin with "__ke__"
                      title: 'Custom div' || null, // default: tag name
                      command: 'replace' || 'range' // default: "replace"
                  }]
colorList       : Change default color array of color picker.       default: [..[..]..] {Array}
                  Default value: [
                    '#ff0000', '#ff5e00', '#ffe400', '#abf200', '#00d8ff', '#0055ff', '#6600ff', '#ff00dd', '#000000',
                    '#ffd8d8', '#fae0d4', '#faf4c0', '#e4f7ba', '#d4f4fa', '#d9e5ff', '#e8d9ff', '#ffd9fa', '#f1f1f1',
                    '#ffa7a7', '#ffc19e', '#faed7d', '#cef279', '#b2ebf4', '#b2ccff', '#d1b2ff', '#ffb2f5', '#bdbdbd',
                    '#f15f5f', '#f29661', '#e5d85c', '#bce55c', '#5cd1e5', '#6699ff', '#a366ff', '#f261df', '#8c8c8c',
                    '#980000', '#993800', '#998a00', '#6b9900', '#008299', '#003399', '#3d0099', '#990085', '#353535',
                    '#670000', '#662500', '#665c00', '#476600', '#005766', '#002266', '#290066', '#660058', '#222222'
                  ]
                  ex) [
                    ['#ccc', '#dedede', 'OrangeRed', 'Orange', 'RoyalBlue', 'SaddleBrown'], // Line break
                    ['SlateGray', 'BurlyWood', 'DeepPink', 'FireBrick', 'Gold', 'SeaGreen']
                  ]

// Image---------------------------------------------------------------------------------------------------------
imageResizing   : Can resize the image.                             default: true {Boolean}
imageWidth      : The default width size of the image frame.        default: 'auto' {Number}
imageFileInput  : Choose whether to create a file input tag in the image upload window.  default: true {Boolean}
imageUrlInput   : Choose whether to create a image url input tag in the image upload window.
                  If the value of imageFileInput is false, it will be unconditionally.   default: true {Boolean}
imageUploadHeader : Http Header when uploading images.              default: null {Object}
imageUploadUrl  : The image upload to server mapping address.       default: null {String}
                  ex) "/editor/uploadImage.ajax"
                  When not used, it enters base64 data
                  return {
                            "errorMessage": "insert error message",
                            "result": [
                                {
                                    "url": "/download/editorImg/test_image.jpg",
                                    "name": "test_image.jpg",
                                    "size": "561276"
                                }
                            ]
                        }
imageUploadSizeLimit: The size of the total uploadable images (in bytes).
                      Invokes the "onImageUploadError" method.  default: null {Number}

// Video----------------------------------------------------------------------------------------------------------
videoResizing   : Can resize the video iframe.                       default: true {Boolean}
videoWidth      : The default width size of the video frame.         default: 560 {Number}
videoHeight     : The default heigth size of the video frame.        default: 315 {Number}
youtubeQuery    : The query string of a YouTube embedded URL.        default: '' {String}
                  It takes precedence over the value user entered.
                  ex) 'autoplay=1&mute=1&enablejsapi=1&controls=0&rel=0&modestbranding=1'
                    // https://developers.google.com/youtube/player_parameters

// Defining save button-------------------------------------------------------------------------------------------
callBackSave    : Callback functions that is called when the Save button is clicked.
                  Arguments - (contents).                            default: userFunction.save {Function}

// Templates Array------------------------------------------------------------------------------------------------
templates       : If you use a template plugin, add it.
                  Defines a list of templates.                       default: null {Array}
                  ex) [
                    {
                        name: 'Template-1',
                        html: '<p>HTML source1</p>'
                    },
                    {
                        name: 'Template-2',
                        html: '<p>HTML source2</p>'
                    }
                  ]

// Buttons--------------------------------------------------------------------------------------------------------
toolbarItem      : Defines toolbar item to array {Array}
                  default: [
                    ['undo', 'redo'],
                    // ['font', 'fontSize', 'formatBlock'],
                    ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
                    ['removeFormat'],
                    // '/', Line break
                    // ['fontColor', 'hiliteColor'],
                    ['outdent', 'indent'],
                    // ['align', 'horizontalRule', 'list', 'table'],
                    // ['link', 'image', 'video'],
                    ['fullScreen', 'showBlocks', 'codeView'],
                    ['preview', 'print'],
                    // ['save', 'template'],
                  ]
```

## Functions

```javascript
import KothingEditor from 'kothing-editor';

const editor = KothingEditor.create('example');

// Add or reset option property
editor.setOptions({
  minHeight: '300px',
  toolbarItem: [['fontColor', 'hiliteColor']],
  colorList: [['#ccc', '#dedede', 'OrangeRed', 'Orange', 'RoyalBlue', 'SaddleBrown']],
});

// Open a notice area
editor.noticeOpen('test notice');

// Close a notice area
editor.noticeClose();

// Copies the contents of the KothingEditor into a [textarea]
editor.save();

// Gets the KothingEditor's context object. Contains settings, plugins, and cached element objects
editor.getContext();

// Gets the contents of the KothingEditor
editor.getContents();

// Gets a list of images uploaded to the editor
/**
 * {
 *  src: imgage src
 *  index: data index
 *  name: file name
 *  size: file size
 *  select: select function
 *  delete: delete function
 * }
 **/
editor.getImagesInfo();

// Upload images using image plugin
editor.insertImage(FileList);

// Inserts an HTML element or HTML string or plain string at the current cursor position
editor.insertHTML('<img src="http://kothing.github.io/editor/img/beauty.jpg">');

// Change the contents of the KothingEditor
editor.setContents('set contents');

// Add content to the KothingEditor
editor.appendContents('append contents');

// Disable the KothingEditor
editor.disabled();

// Enabled the KothingEditor
editor.enabled();

// Hide the KothingEditor
editor.hide();

// Show the KothingEditor
editor.show();

// Destroy the KothingEditor
editor.destroy();
editor = null;

// Event functions
// It can be redefined by receiving event object as parameter.
// It is not called in exceptional cases and is called after the default event function has finished.
editor.onScroll = function(e) {
  console.log('onScroll', e);
};

editor.onClick = function(e) {
  console.log('onClick', e);
};

editor.onKeyDown = function(e) {
  console.log('onKeyDown', e);
};

editor.onKeyUp = function(e) {
  console.log('onKeyUp', e);
};

editor.onDrop = function(e) {
  console.log('onDrop', e);
};

editor.onChange = function(contents) {
  console.log('onChange', contents);
};

// Paste event.
// Called before the editor's default event action.
// If it returns false, it stops without executing the rest of the action.
/**
 * cleanData : HTML string modified for editor format
 * maxCharCount : maxChartCount option (true if max character is exceeded)
 */
editor.onPaste = function(e, cleanData, maxCharCount) {
  console.log('onPaste', e, cleanData, maxCharCount);
};

// Called when the image is uploaded or the uploaded image is deleted.
/**
 * targetImgElement: Current img element
 * index: Uploaded index (key value)
 * state: Upload status ('create', 'update', 'delete')
 * imageInfo: {
 * * index: data index
 * * name: file name
 * * size: file size
 * * select: select function
 * * delete: delete function
 * }
 * remainingFilesCount: Count of remaining image files
 */
editor.onImageUpload = function(targetImgElement, index, state, imageInfo, remainingFilesCount) {
  console.log(
    `targetImgElement:${targetImgElement}, index:${index}, state('create', 'update', 'delete'):${state}`
  );
  console.log(`imageInfo:${imageInfo}, remainingFilesCount:${remainingFilesCount}`);
};

// Called when the image is upload failed.
// If you return false, the default notices are not called.
/**
 * errorMessage: Error message to show
 * result: Result object
 */
editor.onImageUploadError = function(errorMessage, result) {
  alert(errorMessage);
};

// Paste event.
// Called before the editor's default event action.
// If it returns false, it stops without executing the rest of the action.
/**
 * toolbar: Toolbar Element
 * context: The editor's context object (editor.getContext())
 */
editor.showInline = function(toolbar, context) {
  console.log('toolbar', toolbar);
  console.log('context', context);
};
```

## Examples

<a id="defining-menu-items"></a> [Defining menu items](https://kothing.github.io/editor/html/examples.html#setting)

<a id="char-count-button-groups"></a> [Char count, Button groups](https://kothing.github.io/editor/html/examples.html#groups)

<a id="iframe-fullpage-and-use-codemirror"></a> [Iframe, fullPage and use CodeMirror](https://kothing.github.io/editor/html/examples.html#CodeMirror)

<a id="image-management"></a> [Image management](https://kothing.github.io/editor/html/examples.html#image)

<a id="user-functions"></a> [User Functions](https://kothing.github.io/editor/html/examples.html#functions)

## Options template

[Options template](https://kothing.github.io/editor/html/options.html)

## Custom plugins

[Custom plugins](https://kothing.github.io/editor/html/customPlugins.html)

## Document

[Document](https://kothing.github.io/editor/html/document.html)

## License

KothingEditor may be freely distributed under the MIT license.
