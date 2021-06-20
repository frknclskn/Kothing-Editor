/*
 * KothingEditor
 *
 * The WYSIWYG Rich Text Editor
 * Copyright Kothing.
 * MIT license.
 */

import defaultIcons from "../assets/defaultIcons";
import {
  ckb,
  da,
  de,
  en,
  es,
  fr,
  he,
  it,
  ja,
  ko,
  lv,
  pl,
  pt_br,
  ro,
  ru,
  se,
  ua,
  zh_cn,
} from "../lang";
import util from "./util";

/**
 * Constructor
 */
export default {
  /**
   * @description document create
   * @param {Element} element Textarea
   * @param {Object} options Options
   * @returns {Object}
   */
  init: function (element, options) {
    if (typeof options !== "object") {
      options = {};
    }

    /** --- init options --- */
    this.initOptions(element, options);

    // KothingEditor div
    const top_div = document.createElement("DIV");
    top_div.className = "kothing-editor" + (options.rtl ? " ke-rtl" : "");
    if (element.id) {
      top_div.id = "kothing-editor_" + element.id;
    }

    // relative div
    const relative = document.createElement("DIV");
    relative.className = "ke-container";

    // toolbar
    const tool_bar = this.createToolBar(
      options.toolbarItem,
      options.plugins,
      options
    );
    tool_bar.element.style.visibility = "hidden";
    if (tool_bar.pluginCallButtons.math) {
      this.checkKatexMath(options.katex);
    }
    const arrow = document.createElement("DIV");
    arrow.className = "ke-arrow";

    // sticky toolbar dummy
    const sticky_dummy = document.createElement("DIV");
    sticky_dummy.className = "ke-toolbar-sticky-dummy";

    // inner editor div
    const editor_div = document.createElement("DIV");
    editor_div.className = "ke-wrapper";

    /** --- init elements and create bottom bar --- */
    const init_elements = this.initElements(
      options,
      top_div,
      tool_bar.element,
      arrow
    );

    const bottomBar = init_elements.bottomBar;
    const wysiwyg_div = init_elements.wysiwygFrame;
    const placeholder_span = init_elements.placeholder;
    let textarea = init_elements.codeView;

    // resizing bar
    const resizing_bar = bottomBar.resizingBar;
    const navigation = bottomBar.navigation;
    const char_wrapper = bottomBar.charWrapper;
    const char_counter = bottomBar.charCounter;

    // loading box
    const loading_box = document.createElement("DIV");
    loading_box.className = "ke-loading-box kothing-editor-common";
    loading_box.innerHTML = '<div class="ke-loading-effect"></div>';

    // enter line
    const line_breaker = document.createElement("DIV");
    line_breaker.className = "ke-line-breaker";
    line_breaker.innerHTML =
      '<button class="ke-btn">' + options.icons.line_break + "</button>";
    const line_breaker_t = document.createElement("DIV");
    line_breaker_t.className += "ke-line-breaker-component";
    const line_breaker_b = line_breaker_t.cloneNode(true);
    line_breaker_t.innerHTML = line_breaker_b.innerHTML =
      options.icons.line_break;

    // resize operation background
    const resize_back = document.createElement("DIV");
    resize_back.className = "ke-resizing-back";

    // toolbar container
    const toolbarContainer = options.toolbarContainer;
    if (toolbarContainer) {
      toolbarContainer.appendChild(tool_bar.element);
    }

    /** append html */
    editor_div.appendChild(textarea);
    if (placeholder_span) {
      editor_div.appendChild(placeholder_span);
    }
    if (!toolbarContainer) {
      relative.appendChild(tool_bar.element);
    }
    relative.appendChild(sticky_dummy);
    relative.appendChild(editor_div);
    relative.appendChild(resize_back);
    relative.appendChild(loading_box);
    relative.appendChild(line_breaker);
    relative.appendChild(line_breaker_t);
    relative.appendChild(line_breaker_b);
    if (resizing_bar) {
      relative.appendChild(resizing_bar);
    }
    top_div.appendChild(relative);

    textarea = this.checkCodeMirror(options, textarea);

    return {
      constructed: {
        top: top_div,
        relative: relative,
        toolBar: tool_bar.element,
        menuTray: tool_bar.menuTray,
        editorArea: editor_div,
        wysiwygArea: wysiwyg_div,
        codeArea: textarea,
        placeholder: placeholder_span,
        resizingBar: resizing_bar,
        navigation: navigation,
        charWrapper: char_wrapper,
        charCounter: char_counter,
        loading: loading_box,
        lineBreaker: line_breaker,
        lineBreaker_t: line_breaker_t,
        lineBreaker_b: line_breaker_b,
        resizeBack: resize_back,
        stickyDummy: sticky_dummy,
        arrow: arrow,
      },
      options: options,
      plugins: tool_bar.plugins,
      pluginCallButtons: tool_bar.pluginCallButtons,
      responsiveButtons: tool_bar.responsiveButtons,
    };
  },

  /**
   * @param {Sting} langCode
   * @returns {Lang}
   */
  getLang: function (langCode) {
    const langs = {
      ckb,
      da,
      de,
      en,
      es,
      fr,
      he,
      it,
      ja,
      ko,
      lv,
      pl,
      pt_br,
      ro,
      ru,
      se,
      ua,
      zh_cn,
    };
    let lang = typeof langCode === "string" ? langCode : "en";
    return Object.keys(langs).includes(lang) ? langs[lang] : langs.en;
  },

  /**
   * @description Check the CodeMirror option to apply the CodeMirror and return the CodeMirror element.
   * @param {Object} options options
   * @param {Element} textarea textarea element
   * @private
   */
  checkCodeMirror: function (options, textarea) {
    if (options.codeMirror) {
      const cmOptions = [
        {
          mode: "htmlmixed",
          htmlMode: true,
          lineNumbers: true,
          lineWrapping: true,
        },
        options.codeMirror.options || {},
      ].reduce(function (init, option) {
        for (let key in option) {
          if (util.hasOwn(option, key)) {
            init[key] = option[key];
          }
        }
        return init;
      }, {});

      if (options.height === "auto") {
        cmOptions.viewportMargin = Infinity;
        cmOptions.height = "auto";
      }

      const cm = options.codeMirror.src.fromTextArea(textarea, cmOptions);
      cm.display.wrapper.style.cssText = textarea.style.cssText;

      options.codeMirrorEditor = cm;
      textarea = cm.display.wrapper;
      textarea.className += " ke-wrapper-code-mirror";
    }

    return textarea;
  },

  /**
   * @description Check for a katex object.
   * @param {Object} katex katex object
   * @private
   */
  checkKatexMath: function (katex) {
    if (!katex) {
      throw Error(
        '[KothingEditor.create.fail] To use the math button you need to add a "katex" object to the options.'
      );
    }

    const katexOptions = [
      {
        throwOnError: false,
      },
      katex.options || {},
    ].reduce(function (init, option) {
      for (let key in option) {
        if (util.hasOwn(option, key)) {
          init[key] = option[key];
        }
      }
      return init;
    }, {});

    katex.options = katexOptions;
  },

  /**
   * @description Add or reset options
   * @param {Object} mergeOptions New options property
   * @param {Object} context Context object of core
   * @param {Object} originOptions Origin options
   * @returns {Object} pluginCallButtons
   * @private
   */
  setOptions: function (mergeOptions, context, originOptions) {
    this.initOptions(context.element.originElement, mergeOptions);

    const el = context.element;
    const relative = el.relative;
    const editorArea = el.editorArea;
    const isNewToolbarContainer =
      mergeOptions.toolbarContainer &&
      mergeOptions.toolbarContainer !== originOptions.toolbarContainer;
    const lang =
      util.typeOf(originOptions.lang) === "string"
        ? this.getLang(originOptions.lang)
        : util.typeOf(originOptions.lang) === "object"
        ? this.getLang(originOptions.lang.code)
        : this.getLang("en");
    const isNewToolbar =
      mergeOptions.lang !== lang ||
      mergeOptions.toolbarItem !== originOptions.toolbarItem ||
      mergeOptions.mode !== originOptions.mode ||
      isNewToolbarContainer;

    const tool_bar = this.createToolBar(
      isNewToolbar ? mergeOptions.toolbarItem : originOptions.toolbarItem,
      mergeOptions.plugins,
      mergeOptions
    );
    if (tool_bar.pluginCallButtons.math) {
      this.checkKatexMath(mergeOptions.katex);
    }

    const arrow = document.createElement("DIV");
    arrow.className = "ke-arrow";

    if (isNewToolbar) {
      tool_bar.element.style.visibility = "hidden";
      // toolbar container
      if (isNewToolbarContainer) {
        mergeOptions.toolbarContainer.appendChild(tool_bar.element);
        el.toolbar.parentElement.removeChild(el.toolbar);
      } else {
        el.toolbar.parentElement.replaceChild(tool_bar.element, el.toolbar);
      }

      el.toolbar = tool_bar.element;
      el.menuTray = tool_bar.menuTray;
      el.arrow = arrow;
    }

    const init_elements = this.initElements(
      mergeOptions,
      el.topArea,
      isNewToolbar ? tool_bar.element : el.toolbar,
      arrow
    );

    const bottomBar = init_elements.bottomBar;
    const wysiwygFrame = init_elements.wysiwygFrame;
    const placeholder_span = init_elements.placeholder;
    let code = init_elements.codeView;

    if (el.resizingBar) {
      relative.removeChild(el.resizingBar);
    }
    if (bottomBar.resizingBar) {
      relative.appendChild(bottomBar.resizingBar);
    }

    editorArea.innerHTML = "";
    editorArea.appendChild(code);
    if (placeholder_span) {
      editorArea.appendChild(placeholder_span);
    }

    code = this.checkCodeMirror(mergeOptions, code);

    el.resizingBar = bottomBar.resizingBar;
    el.navigation = bottomBar.navigation;
    el.charWrapper = bottomBar.charWrapper;
    el.charCounter = bottomBar.charCounter;
    el.wysiwygFrame = wysiwygFrame;
    el.code = code;
    el.placeholder = placeholder_span;

    if (mergeOptions.rtl) {
      util.addClass(el.topArea, "ke-rtl");
    } else {
      util.removeClass(el.topArea, "ke-rtl");
    }

    return {
      callButtons: tool_bar.pluginCallButtons,
      plugins: tool_bar.plugins,
      toolbar: tool_bar,
    };
  },

  /**
   * @description Initialize property of KothingEditor elements
   * @param {Object} options Options
   * @param {Element} topDiv KothingEditor top div
   * @param {Element} toolBar Tool bar
   * @param {Element} toolBarArrow Tool bar arrow (balloon editor)
   * @returns {Object} Bottom bar elements (resizingBar, navigation, charWrapper, charCounter)
   * @private
   */
  initElements: function (options, topDiv, toolBar, toolBarArrow) {
    /** top div */
    topDiv.style.cssText = options.editorStyles.top;

    /** toolbar */
    if (/inline/i.test(options.mode)) {
      toolBar.className += " ke-toolbar-inline";
      toolBar.style.width = options.toolbarWidth;
    } else if (/balloon/i.test(options.mode)) {
      toolBar.className += " ke-toolbar-balloon";
      toolBar.style.width = options.toolbarWidth;
      toolBar.appendChild(toolBarArrow);
    }

    /** editor */
    // wysiwyg div or iframe
    const wysiwygDiv = document.createElement(
      !options.iframe ? "DIV" : "IFRAME"
    );
    wysiwygDiv.className = "ke-wrapper-inner ke-wrapper-wysiwyg";

    if (!options.iframe) {
      wysiwygDiv.setAttribute("contenteditable", "true");
      wysiwygDiv.setAttribute("scrolling", "auto");
      wysiwygDiv.className += " " + options.editableClass;
      wysiwygDiv.style.cssText =
        options.editorStyles.frame + options.editorStyles.editor;
    } else {
      wysiwygDiv.allowFullscreen = true;
      wysiwygDiv.frameBorder = 0;
      wysiwygDiv.style.cssText = options.editorStyles.frame;
    }

    // textarea for code view
    const textarea = document.createElement("TEXTAREA");
    textarea.className = "ke-wrapper-inner ke-wrapper-code";
    textarea.style.cssText = options.editorStyles.frame;
    textarea.style.display = "none";
    if (options.height === "auto") {
      textarea.style.overflow = "hidden";
    }

    /** resize bar */
    let resizingBar = null;
    let resizinIcon = null;
    let navigation = null;
    let charWrapper = null;
    let charCounter = null;
    let poweredBy = null;
    if (options.resizingBar) {
      resizingBar = document.createElement("DIV");
      resizingBar.className = "ke-resizing-bar";

      /** resizinIcon */
      if (/\d+/.test(options.height)) {
        resizinIcon = document.createElement("DIV");
        resizinIcon.className = "ke-resizing-icon";
        resizingBar.appendChild(resizinIcon);
      }

      /** navigation */
      navigation = document.createElement("DIV");
      navigation.className = "ke-navigation";
      resizingBar.appendChild(navigation);

      /** char counter */
      if (options.charCounter) {
        charWrapper = document.createElement("DIV");
        charWrapper.className = "ke-char-counter-wrapper";

        if (options.charCounterLabel) {
          const charLabel = document.createElement("SPAN");
          charLabel.className = "ke-char-label";
          charLabel.textContent = options.charCounterLabel;
          charWrapper.appendChild(charLabel);
        }

        charCounter = document.createElement("SPAN");
        charCounter.className = "ke-char-counter";
        charCounter.textContent = "0";
        charWrapper.appendChild(charCounter);

        if (options.maxCharCount > 0) {
          const char_max = document.createElement("SPAN");
          char_max.textContent = " / " + options.maxCharCount;
          charWrapper.appendChild(char_max);
        }

        resizingBar.appendChild(charWrapper);
      }

      /** poweredBy */
      poweredBy = document.createElement("DIV");
      poweredBy.className = "ke-powered-by";
      poweredBy.innerHTML = `<a href="https://github.com/kothing/kothing-editor" target="_blank" title="Kothing-Editor">Powered By Kothing</a>`;
      resizingBar.appendChild(poweredBy);
    }

    let placeholder = null;
    if (options.placeholder) {
      placeholder = document.createElement("SPAN");
      placeholder.className = "ke-placeholder";
      placeholder.innerText = options.placeholder;
    }

    return {
      bottomBar: {
        resizingBar: resizingBar,
        navigation: navigation,
        charWrapper: charWrapper,
        charCounter: charCounter,
      },
      wysiwygFrame: wysiwygDiv,
      codeView: textarea,
      placeholder: placeholder,
    };
  },

  /**
   * @description Initialize options
   * @param {Element} element Options object
   * @param {Object} options Options object
   * @private
   */
  initOptions: function (element, options) {
    /** Values */
    options.lang =
      util.typeOf(options.lang) === "string"
        ? this.getLang(options.lang)
        : util.typeOf(options.lang) === "object"
        ? this.getLang(options.lang.code)
        : this.getLang("en");

    options.defaultTag =
      typeof options.defaultTag === "string" ? options.defaultTag : "p";
    const textTags = (options.textTags = [
      {
        bold: "STRONG",
        underline: "U",
        italic: "EM",
        strike: "DEL",
        sub: "SUB",
        sup: "SUP",
      },
      options.textTags || {},
    ].reduce(function (_default, _new) {
      for (let key in _new) {
        _default[key] = _new[key];
      }
      return _default;
    }, {}));
    options.textTagsMap = {
      strong: textTags.bold.toLowerCase(),
      b: textTags.bold.toLowerCase(),
      u: textTags.underline.toLowerCase(),
      ins: textTags.underline.toLowerCase(),
      em: textTags.italic.toLowerCase(),
      i: textTags.italic.toLowerCase(),
      del: textTags.strike.toLowerCase(),
      strike: textTags.strike.toLowerCase(),
      s: textTags.strike.toLowerCase(),
      sub: textTags.sub.toLowerCase(),
      sup: textTags.sup.toLowerCase(),
    };
    options.value = typeof options.value === "string" ? options.value : null;
    options.historyStackDelayTime =
      typeof options.historyStackDelayTime === "number"
        ? options.historyStackDelayTime
        : 400;
    /** Whitelist */
    const whitelist =
      "br|p|div|pre|blockquote|h1|h2|h3|h4|h5|h6|ol|ul|li|hr|figure|figcaption|img|iframe|audio|video|source|table|thead|tbody|tr|th|td|a|b|strong|var|i|em|u|ins|s|span|strike|del|sub|sup|code|svg|path";
    options.defaultTagsWhitelist =
      typeof options.defaultTagsWhitelist === "string"
        ? options.defaultTagsWhitelist
        : whitelist;
    options.editorTagsWhitelist = this.setWhitelist(
      options.defaultTagsWhitelist +
        (typeof options.addTagsWhitelist === "string" &&
        options.addTagsWhitelist.length > 0
          ? "|" + options.addTagsWhitelist
          : ""),
      options.tagsBlacklist
    );
    options.pasteTagsWhitelist = this.setWhitelist(
      typeof options.pasteTagsWhitelist === "string"
        ? options.pasteTagsWhitelist
        : options.editorTagsWhitelist,
      options.pasteTagsBlacklist
    );
    options.attributesWhitelist =
      !options.attributesWhitelist ||
      typeof options.attributesWhitelist !== "object"
        ? null
        : options.attributesWhitelist;
    /** Layout */
    options.mode = options.mode || "classic"; // classic, inline, balloon, balloon-always
    options.rtl = !!options.rtl;
    options.editableClass =
      "kothing-editor-editable" + (options.rtl ? " ke-rtl" : "");
    options.printClass =
      typeof options.printClass === "string" ? options.printClass : null;
    options.toolbarWidth = options.toolbarWidth
      ? util.isNumber(options.toolbarWidth)
        ? options.toolbarWidth + "px"
        : options.toolbarWidth
      : "auto";
    options.toolbarContainer =
      typeof options.toolbarContainer === "string"
        ? document.querySelector(options.toolbarContainer)
        : options.toolbarContainer;
    options.stickyToolbar =
      /balloon/i.test(options.mode) || !!options.toolbarContainer
        ? -1
        : options.stickyToolbar === undefined
        ? 0
        : /^\d+/.test(options.stickyToolbar)
        ? util.getNumber(options.stickyToolbar, 0)
        : -1;
    options.fullScreenOffset =
      options.fullScreenOffset === undefined
        ? 0
        : /^\d+/.test(options.fullScreenOffset)
        ? util.getNumber(options.fullScreenOffset, 0)
        : 0;
    options.iframe = options.fullPage || options.iframe;
    options.fullPage = !!options.fullPage;
    options.iframeCSSFileName = options.iframe
      ? typeof options.iframeCSSFileName === "string"
        ? [options.iframeCSSFileName]
        : options.iframeCSSFileName || ["kothing-editor"]
      : null;
    options.previewTemplate =
      typeof options.previewTemplate === "string"
        ? options.previewTemplate
        : null;
    options.printTemplate =
      typeof options.printTemplate === "string" ? options.printTemplate : null;
    /** CodeMirror object */
    options.codeMirror = options.codeMirror
      ? options.codeMirror.src
        ? options.codeMirror
        : { src: options.codeMirror }
      : null;
    /** katex object (Math plugin) */
    options.katex = options.katex
      ? options.katex.src
        ? options.katex
        : { src: options.katex }
      : null;
    options.mathFontSize = !!options.mathFontSize
      ? options.mathFontSize
      : [
          { text: "1", value: "1em" },
          { text: "1.5", value: "1.5em" },
          { text: "2", value: "2em" },
          { text: "2.5", value: "2.5em" },
        ];
    /** Display */
    options.position =
      typeof options.position === "string" ? options.position : null;
    options.display =
      options.display ||
      (element.style.display === "none" || !element.style.display
        ? "block"
        : element.style.display);
    options.popupDisplay = options.popupDisplay || "full";
    /** Bottom resizing bar */
    options.resizingBar =
      options.resizingBar === undefined
        ? /inline|balloon/i.test(options.mode)
          ? false
          : true
        : options.resizingBar;
    options.showPathLabel = !options.resizingBar
      ? false
      : typeof options.showPathLabel === "boolean"
      ? options.showPathLabel
      : true;
    /** Character count */
    options.charCounter =
      options.maxCharCount > 0
        ? true
        : typeof options.charCounter === "boolean"
        ? options.charCounter
        : false;
    options.charCounterType =
      typeof options.charCounterType === "string"
        ? options.charCounterType
        : "char";
    options.charCounterLabel =
      typeof options.charCounterLabel === "string"
        ? options.charCounterLabel.trim()
        : null;
    options.maxCharCount =
      util.isNumber(options.maxCharCount) && options.maxCharCount > -1
        ? options.maxCharCount * 1
        : null;
    /** Width size */
    options.width = options.width
      ? util.isNumber(options.width)
        ? options.width + "px"
        : options.width
      : element.clientWidth
      ? element.clientWidth + "px"
      : "100%";
    options.minWidth =
      (util.isNumber(options.minWidth)
        ? options.minWidth + "px"
        : options.minWidth) || "";
    options.maxWidth =
      (util.isNumber(options.maxWidth)
        ? options.maxWidth + "px"
        : options.maxWidth) || "";
    /** Height size */
    options.height = options.height
      ? util.isNumber(options.height)
        ? options.height + "px"
        : options.height
      : element.clientHeight
      ? element.clientHeight + "px"
      : "auto";
    options.minHeight =
      (util.isNumber(options.minHeight)
        ? options.minHeight + "px"
        : options.minHeight) || "";
    options.maxHeight =
      (util.isNumber(options.maxHeight)
        ? options.maxHeight + "px"
        : options.maxHeight) || "";
    /** Editing area default style */
    options.defaultStyle =
      typeof options.defaultStyle === "string" ? options.defaultStyle : "";
    /** Defining menu items */
    options.font = !options.font ? null : options.font;
    options.fontSize = !options.fontSize ? null : options.fontSize;
    options.formats = !options.formats ? null : options.formats;
    options.colorList = !options.colorList ? null : options.colorList;
    options.lineHeights = !options.lineHeights ? null : options.lineHeights;
    options.paragraphStyles = !options.paragraphStyles
      ? null
      : options.paragraphStyles;
    options.textStyles = !options.textStyles ? null : options.textStyles;
    options.fontSizeUnit =
      typeof options.fontSizeUnit === "string"
        ? options.fontSizeUnit.trim() || "px"
        : "px";
    /** Image */
    options.imageResizing =
      options.imageResizing === undefined ? true : options.imageResizing;
    options.imageHeightShow =
      options.imageHeightShow === undefined ? true : !!options.imageHeightShow;
    options.imageWidth = !options.imageWidth
      ? "auto"
      : util.isNumber(options.imageWidth)
      ? options.imageWidth + "px"
      : options.imageWidth;
    options.imageHeight = !options.imageHeight
      ? "auto"
      : util.isNumber(options.imageHeight)
      ? options.imageHeight + "px"
      : options.imageHeight;
    options.imageSizeOnlyPercentage = !!options.imageSizeOnlyPercentage;
    options.imageSizeUnit = options.imageSizeOnlyPercentage ? "%" : "px";
    options.imageRotation =
      options.imageRotation !== undefined
        ? options.imageRotation
        : !(options.imageSizeOnlyPercentage || !options.imageHeightShow);
    options.imageFileInput =
      options.imageFileInput === undefined ? true : options.imageFileInput;
    options.imageUrlInput =
      options.imageUrlInput === undefined || !options.imageFileInput
        ? true
        : options.imageUrlInput;
    options.imageUploadHeader = options.imageUploadHeader || null;
    options.imageUploadUrl =
      typeof options.imageUploadUrl === "string"
        ? options.imageUploadUrl
        : null;
    options.imageUploadSizeLimit = /\d+/.test(options.imageUploadSizeLimit)
      ? util.getNumber(options.imageUploadSizeLimit, 0)
      : null;
    options.imageMultipleFile = !!options.imageMultipleFile;
    options.imageAccept =
      typeof options.imageAccept !== "string" ||
      options.imageAccept.trim() === "*"
        ? "image/*"
        : options.imageAccept.trim() || "image/*";
    /** Image - image gallery */
    options.imageGalleryUrl =
      typeof options.imageGalleryUrl === "string"
        ? options.imageGalleryUrl
        : null;
    options.imageGalleryHeader = options.imageGalleryHeader || null;
    /** Video */
    options.videoResizing =
      options.videoResizing === undefined ? true : options.videoResizing;
    options.videoHeightShow =
      options.videoHeightShow === undefined ? true : !!options.videoHeightShow;
    options.videoRatioShow =
      options.videoRatioShow === undefined ? true : !!options.videoRatioShow;
    options.videoWidth =
      !options.videoWidth || !util.getNumber(options.videoWidth, 0)
        ? ""
        : util.isNumber(options.videoWidth)
        ? options.videoWidth + "px"
        : options.videoWidth;
    options.videoHeight =
      !options.videoHeight || !util.getNumber(options.videoHeight, 0)
        ? ""
        : util.isNumber(options.videoHeight)
        ? options.videoHeight + "px"
        : options.videoHeight;
    options.videoSizeOnlyPercentage = !!options.videoSizeOnlyPercentage;
    options.videoSizeUnit = options.videoSizeOnlyPercentage ? "%" : "px";
    options.videoRotation =
      options.videoRotation !== undefined
        ? options.videoRotation
        : !(options.videoSizeOnlyPercentage || !options.videoHeightShow);
    options.videoRatio = util.getNumber(options.videoRatio, 4) || 0.5625;
    options.videoRatioList = !options.videoRatioList
      ? null
      : options.videoRatioList;
    options.youtubeQuery = (options.youtubeQuery || "").replace("?", "");
    options.videoFileInput = !!options.videoFileInput;
    options.videoUrlInput =
      options.videoUrlInput === undefined || !options.videoFileInput
        ? true
        : options.videoUrlInput;
    options.videoUploadHeader = options.videoUploadHeader || null;
    options.videoUploadUrl =
      typeof options.videoUploadUrl === "string"
        ? options.videoUploadUrl
        : null;
    options.videoUploadSizeLimit = /\d+/.test(options.videoUploadSizeLimit)
      ? util.getNumber(options.videoUploadSizeLimit, 0)
      : null;
    options.videoMultipleFile = !!options.videoMultipleFile;
    options.videoTagAttrs = options.videoTagAttrs || null;
    options.videoIframeAttrs = options.videoIframeAttrs || null;
    options.videoAccept =
      typeof options.videoAccept !== "string" ||
      options.videoAccept.trim() === "*"
        ? "video/*"
        : options.videoAccept.trim() || "video/*";
    /** Audio */
    options.audioWidth = !options.audioWidth
      ? ""
      : util.isNumber(options.audioWidth)
      ? options.audioWidth + "px"
      : options.audioWidth;
    options.audioHeight = !options.audioHeight
      ? ""
      : util.isNumber(options.audioHeight)
      ? options.audioHeight + "px"
      : options.audioHeight;
    options.audioFileInput = !!options.audioFileInput;
    options.audioUrlInput =
      options.audioUrlInput === undefined || !options.audioFileInput
        ? true
        : options.audioUrlInput;
    options.audioUploadHeader = options.audioUploadHeader || null;
    options.audioUploadUrl =
      typeof options.audioUploadUrl === "string"
        ? options.audioUploadUrl
        : null;
    options.audioUploadSizeLimit = /\d+/.test(options.audioUploadSizeLimit)
      ? util.getNumber(options.audioUploadSizeLimit, 0)
      : null;
    options.audioMultipleFile = !!options.audioMultipleFile;
    options.audioTagAttrs = options.audioTagAttrs || null;
    options.audioAccept =
      typeof options.audioAccept !== "string" ||
      options.audioAccept.trim() === "*"
        ? "audio/*"
        : options.audioAccept.trim() || "audio/*";
    /** Table */
    options.tableCellControllerPosition =
      typeof options.tableCellControllerPosition === "string"
        ? options.tableCellControllerPosition.toLowerCase()
        : "cell";
    /** Link */
    options.linkProtocol =
      typeof options.linkProtocol === "string" ? options.linkProtocol : null;
    options.linkRel = Array.isArray(options.linkRel) ? options.linkRel : [];
    options.linkRelDefault = options.linkRelDefault || {};
    /** Key actions */
    options.tabDisable = !!options.tabDisable;
    options.shortcutsDisable = Array.isArray(options.shortcutsDisable)
      ? options.shortcutsDisable
      : [];
    options.shortcutsHint =
      options.shortcutsHint === undefined ? true : !!options.shortcutsHint;
    /** Defining save button */
    options.callBackSave = !options.callBackSave ? null : options.callBackSave;
    /** Templates Array */
    options.templates = !options.templates ? null : options.templates;
    /** ETC */
    options.placeholder =
      typeof options.placeholder === "string" ? options.placeholder : null;
    options.mediaAutoSelect =
      options.mediaAutoSelect === undefined ? true : !!options.mediaAutoSelect;
    /** Buttons */
    options.toolbarItem = !!options.toolbarItem
      ? options.toolbarItem
      : [
          ["undo", "redo"],
          ["bold", "underline", "italic", "strike", "subscript", "superscript"],
          ["removeFormat"],
          ["outdent", "indent"],
          ["fullScreen", "showBlocks", "codeView"],
          ["preview", "print"],
        ];

    /** RTL - buttons */
    if (options.rtl) {
      options.toolbarItem = options.toolbarItem.reverse();
    }

    /** --- Define icons --- */
    // custom icons
    options.icons =
      !options.icons || typeof options.icons !== "object"
        ? defaultIcons
        : [defaultIcons, options.icons].reduce(function (_default, _new) {
            for (let key in _new) {
              if (util.hasOwn(_new, key)) {
                _default[key] = _new[key];
              }
            }
            return _default;
          }, {});
    // rtl icons
    options.icons = !options.rtl
      ? options.icons
      : [options.icons, options.icons.rtl].reduce(function (_default, _new) {
          for (let key in _new) {
            if (util.hasOwn(_new, key)) {
              _default[key] = _new[key];
            }
          }
          return _default;
        }, {});

    /** init options */
    options.editorStyles = util.setDefaultOptionStyle(
      options,
      options.defaultStyle
    );
  },

  setWhitelist: function (whitelist, blacklist) {
    if (typeof blacklist !== "string") {
      return whitelist;
    }
    blacklist = blacklist.split("|");
    whitelist = whitelist.split("|");
    for (let i = 0, len = blacklist.length, index; i < len; i++) {
      index = whitelist.indexOf(blacklist[i]);
      if (index > -1) {
        whitelist.splice(index, 1);
      }
    }
    return whitelist.join("|");
  },

  /**
   * @description KothingEditor's Default button list
   * @param {Object} options options
   * @private
   */
  createDefaultToolbarItems: function (options) {
    const icons = options.icons;
    const lang =
      util.typeOf(options.lang) === "string"
        ? this.getLang(options.lang)
        : util.typeOf(options.lang) === "object"
        ? this.getLang(options.lang.code)
        : this.getLang("en");
    const cmd = util.isOSX_IOS ? "⌘" : "CTRL";
    const addShift = util.isOSX_IOS ? "⇧" : "+SHIFT";
    const shortcutsDisable = !options.shortcutsHint
      ? ["bold", "strike", "underline", "italic", "undo", "indent", "save"]
      : options.shortcutsDisable;
    const indentKey = options.rtl ? ["[", "]"] : ["]", "["];

    return {
      /** default command */
      bold: [
        "_ke_command_bold",
        lang.toolbar.bold +
          " " +
          '<span class="ke-shortcut">' +
          (shortcutsDisable.indexOf("bold") > -1
            ? ""
            : cmd + '+<span class="ke-shortcut-key">B</span>') +
          "</span>",
        "bold",
        "",
        icons.bold,
      ],
      underline: [
        "_ke_command_underline",
        lang.toolbar.underline +
          " " +
          '<span class="ke-shortcut">' +
          (shortcutsDisable.indexOf("underline") > -1
            ? ""
            : cmd + '+<span class="ke-shortcut-key">U</span>') +
          "</span>",
        "underline",
        "",
        icons.underline,
      ],
      italic: [
        "_ke_command_italic",
        lang.toolbar.italic +
          " " +
          '<span class="ke-shortcut">' +
          (shortcutsDisable.indexOf("italic") > -1
            ? ""
            : cmd + '+<span class="ke-shortcut-key">I</span>') +
          "</span>",
        "italic",
        "",
        icons.italic,
      ],
      strike: [
        "_ke_command_strike",
        lang.toolbar.strike +
          " " +
          '<span class="ke-shortcut">' +
          (shortcutsDisable.indexOf("strike") > -1
            ? ""
            : cmd + addShift + '+<span class="ke-shortcut-key">S</span>') +
          "</span>",
        "strike",
        "",
        icons.strike,
      ],
      subscript: [
        "_ke_command_subscript",
        lang.toolbar.subscript,
        "SUB",
        "",
        icons.subscript,
      ],
      superscript: [
        "_ke_command_superscript",
        lang.toolbar.superscript,
        "SUP",
        "",
        icons.superscript,
      ],
      removeFormat: [
        "",
        lang.toolbar.removeFormat,
        "removeFormat",
        "",
        icons.erase,
      ],
      indent: [
        "_ke_command_indent",
        lang.toolbar.indent +
          " " +
          '<span class="ke-shortcut">' +
          (shortcutsDisable.indexOf("indent") > -1
            ? ""
            : cmd +
              '+<span class="ke-shortcut-key">' +
              indentKey[0] +
              "</span>") +
          "</span>",
        "indent",
        "",
        icons.outdent,
      ],
      outdent: [
        "_ke_command_outdent",
        lang.toolbar.outdent +
          " " +
          '<span class="ke-shortcut">' +
          (shortcutsDisable.indexOf("indent") > -1
            ? ""
            : cmd +
              '+<span class="ke-shortcut-key">' +
              indentKey[1] +
              "</span>") +
          "</span>",
        "outdent",
        "",
        icons.indent,
      ],
      fullScreen: [
        "ke-code-view-enabled ke-resizing-enabled _ke_command_fullScreen",
        lang.toolbar.fullScreen,
        "fullScreen",
        "",
        icons.expansion,
      ],
      showBlocks: [
        "_ke_command_showBlocks",
        lang.toolbar.showBlocks,
        "showBlocks",
        "",
        icons.show_blocks,
      ],
      codeView: [
        "ke-code-view-enabled ke-resizing-enabled _ke_command_codeView",
        lang.toolbar.codeView,
        "codeView",
        "",
        icons.code_view,
      ],
      undo: [
        "_ke_command_undo ke-resizing-enabled",
        lang.toolbar.undo +
          '<span class="ke-shortcut">' +
          " " +
          (shortcutsDisable.indexOf("undo") > -1
            ? ""
            : cmd + '+<span class="ke-shortcut-key">Z</span>') +
          "</span>",
        "undo",
        "",
        icons.undo,
      ],
      redo: [
        "_ke_command_redo ke-resizing-enabled",
        lang.toolbar.redo +
          '<span class="ke-shortcut">' +
          " " +
          (shortcutsDisable.indexOf("undo") > -1
            ? ""
            : cmd +
              '+<span class="ke-shortcut-key">Y</span> / ' +
              cmd +
              addShift +
              '+<span class="ke-shortcut-key">Z</span>') +
          "</span>",
        "redo",
        "",
        icons.redo,
      ],
      preview: [
        "ke-resizing-enabled",
        lang.toolbar.preview,
        "preview",
        "",
        icons.preview,
      ],
      print: [
        "ke-resizing-enabled",
        lang.toolbar.print,
        "print",
        "",
        icons.print,
      ],
      save: [
        "_ke_command_save ke-resizing-enabled",
        lang.toolbar.save +
          " " +
          '<span class="ke-shortcut">' +
          (shortcutsDisable.indexOf("save") > -1
            ? ""
            : cmd + '+<span class="ke-shortcut-key">S</span>') +
          "</span>",
        "save",
        "",
        icons.save,
      ],
      /** plugins - command */
      blockquote: [
        "",
        lang.toolbar.tag_blockquote,
        "blockquote",
        "command",
        icons.blockquote,
      ],
      /** plugins - submenu */
      font: [
        "ke-btn-select ke-btn-tool-font",
        lang.toolbar.font,
        "font",
        "submenu",
        `<span class="txt">${icons.font}</span> <span class="arrow-icon">${icons.arrow_down}</span>`,
      ],
      formatBlock: [
        "ke-btn-select ke-btn-tool-format",
        lang.toolbar.formats,
        "formatBlock",
        "submenu",
        `<span class="txt">${icons.format_block}</span> <span class="arrow-icon">${icons.arrow_down}</span>`,
      ],
      fontSize: [
        "ke-btn-select ke-btn-tool-size",
        lang.toolbar.fontSize,
        "fontSize",
        "submenu",
        `<span class="txt">${icons.font_size}</span> <span class="arrow-icon">${icons.arrow_down}</span>`,
      ],
      fontColor: [
        "",
        lang.toolbar.fontColor,
        "fontColor",
        "submenu",
        icons.font_color,
      ],
      hiliteColor: [
        "",
        lang.toolbar.hiliteColor,
        "hiliteColor",
        "submenu",
        icons.highlight_color,
      ],
      align: [
        "ke-btn-select ke-btn-align",
        lang.toolbar.align,
        "align",
        "submenu",
        `<span class="txt">${
          options.rtl ? icons.align_right : icons.align_left
        }</span> <span class="arrow-icon">${icons.arrow_down}</span>`,
      ],
      list: [
        "ke-btn-select ke-btn-tool-list",
        lang.toolbar.list,
        "list",
        "submenu",
        `<span class="txt">${icons.list_number}</span> <span class="arrow-icon">${icons.arrow_down}</span>`,
      ],
      horizontalRule: [
        "btn_line",
        lang.toolbar.horizontalRule,
        "horizontalRule",
        "submenu",
        icons.horizontal_rule,
      ],
      table: ["", lang.toolbar.table, "table", "submenu", icons.table],
      lineHeight: [
        "",
        lang.toolbar.lineHeight,
        "lineHeight",
        "submenu",
        icons.line_height,
      ],
      template: [
        "",
        lang.toolbar.template,
        "template",
        "submenu",
        icons.template,
      ],
      paragraphStyle: [
        "",
        lang.toolbar.paragraphStyle,
        "paragraphStyle",
        "submenu",
        icons.paragraph_style,
      ],
      textStyle: [
        "",
        lang.toolbar.textStyle,
        "textStyle",
        "submenu",
        icons.text_style,
      ],
      /** plugins - dialog */
      link: ["", lang.toolbar.link, "link", "dialog", icons.link],
      image: ["", lang.toolbar.image, "image", "dialog", icons.image],
      video: ["", lang.toolbar.video, "video", "dialog", icons.video],
      audio: ["", lang.toolbar.audio, "audio", "dialog", icons.audio],
      math: ["", lang.toolbar.math, "math", "dialog", icons.math],
      /** plugins - fileBrowser */
      imageGallery: [
        "",
        lang.toolbar.imageGallery,
        "imageGallery",
        "fileBrowser",
        icons.image_gallery,
      ],
    };
  },

  /**
   * @description Create a group div containing each module
   * @returns {Object}
   * @private
   */
  createModuleGroup: function () {
    const oDiv = util.createElement("DIV");
    oDiv.className = "ke-btn-module ke-btn-module-border";

    const oUl = util.createElement("UL");
    oUl.className = "ke-menu-list";
    oDiv.appendChild(oUl);

    return {
      div: oDiv,
      ul: oUl,
    };
  },

  /**
   * @description Create a button element
   * @param {string} buttonClass className in button
   * @param {string} title Title in button
   * @param {string} dataCommand The data-command property of the button
   * @param {string} dataDisplay The data-display property of the button ('dialog', 'submenu', 'command')
   * @param {string} innerHTML Html in button
   * @param {string} disabled Button disabled
   * @param {Object} defaultIcons Icons
   * @returns {Object}
   * @private
   */
  createButton: function (
    buttonClass,
    title,
    dataCommand,
    dataDisplay,
    innerHTML,
    disabled,
    defaultIcons
  ) {
    const oLi = util.createElement("LI");
    const oButton = util.createElement("BUTTON");

    oButton.setAttribute("type", "button");
    oButton.setAttribute(
      "class",
      "ke-btn" + (buttonClass ? " " + buttonClass : "") + " ke-tooltip"
    );
    oButton.setAttribute("data-command", dataCommand);
    oButton.setAttribute("data-display", dataDisplay);
    oButton.setAttribute("tabindex", "-1");

    if (!innerHTML) {
      innerHTML = '<span class="ke-icon-text">!</span>';
    }
    if (/^default\./i.test(innerHTML)) {
      innerHTML = defaultIcons[innerHTML.replace(/^default\./i, "")];
    }
    if (/^text\./i.test(innerHTML)) {
      innerHTML = innerHTML.replace(/^text\./i, "");
      oButton.className += " ke-btn-more-text";
    }

    innerHTML +=
      '<span class="ke-tooltip-inner"><span class="ke-tooltip-text">' +
      (title || dataCommand) +
      "</span></span>";

    if (disabled) {
      oButton.setAttribute("disabled", "true");
    }

    oButton.innerHTML = innerHTML;
    oLi.appendChild(oButton);

    return {
      li: oLi,
      button: oButton,
    };
  },

  /**
   * @description Create editor HTML
   * @param {Array} doc document object
   * @param {Array} toolbarItem option.toolbarItem
   * @param {Array|Object|null} _plugins Plugins
   * @param {Array} options options
   * @returns {Object} { element: (Element) Toolbar element, plugins: (Array|null) Plugins Array, pluginCallButtons: (Object), responsiveButtons: (Array) }
   * @private
   */
  createToolBar: function (toolbarItem, _plugins, options) {
    const separator_vertical = document.createElement("DIV");
    separator_vertical.className = "ke-toolbar-separator-vertical";

    const tool_bar = document.createElement("DIV");
    tool_bar.className = "ke-toolbar kothing-editor-common";

    const buttonTray = document.createElement("DIV");
    buttonTray.className = "ke-btn-tray";
    tool_bar.appendChild(buttonTray);

    /** create button list */
    toolbarItem = JSON.parse(JSON.stringify(toolbarItem));
    const icons = options.icons;
    const defaultToolbarItem = this.createDefaultToolbarItems(options);
    const pluginCallButtons = {};
    const responsiveButtons = [];
    const plugins = {};
    if (_plugins) {
      const pluginsValues = _plugins.length
        ? _plugins
        : Object.keys(_plugins).map(function (name) {
            return _plugins[name];
          });
      for (let i = 0, len = pluginsValues.length, p; i < len; i++) {
        p = pluginsValues[i].default || pluginsValues[i];
        plugins[p.name] = p;
      }
    }

    let module = null;
    let button = null;
    let moduleElement = null;
    let buttonElement = null;
    let pluginName = "";
    let vertical = false;
    const moreLayer = util.createElement("DIV");
    moreLayer.className = "ke-toolbar-more-layer";

    for (
      let i = 0, more, moreContainer, moreCommand, buttonGroup, align;
      i < toolbarItem.length;
      i++
    ) {
      more = false;
      align = "";
      buttonGroup = toolbarItem[i];
      moduleElement = this.createModuleGroup();

      // button object
      if (typeof buttonGroup === "object") {
        // buttons loop
        for (let j = 0, moreButton; j < buttonGroup.length; j++) {
          button = buttonGroup[j];
          moreButton = false;

          if (/^\%\d+/.test(button) && j === 0) {
            buttonGroup[0] = button.replace(/[^\d]/g, "");
            responsiveButtons.push(buttonGroup);
            toolbarItem.splice(i--, 1);
            continue;
          }

          if (util.typeOf(button) === "object") {
            if (typeof button.add === "function") {
              pluginName = button.name;
              module = defaultToolbarItem[pluginName];
              plugins[pluginName] = button;
            } else {
              pluginName = button.name;
              module = [
                button.buttonClass,
                button.title,
                button.name,
                button.dataDisplay,
                button.innerHTML,
                button.disabled,
              ];
            }
          } else {
            // align
            if (/^\-/.test(button)) {
              align = button.substr(1);
              moduleElement.div.style.float = align;
              continue;
            }

            // more button
            if (/^\:/.test(button)) {
              moreButton = true;
              const matched = button.match(/^\:([^\-]+)\-([^\-]+)\-([^\-]+)/);
              moreCommand = "__ke__" + matched[1].trim();
              const title = matched[2].trim();
              const innerHTML = matched[3].trim();
              module = ["ke-btn-more", title, moreCommand, "MORE", innerHTML];
            }
            // buttons
            else {
              module = defaultToolbarItem[button];
            }

            pluginName = button;
            if (!module) {
              const custom = plugins[pluginName];
              if (!custom)
                throw Error(
                  "[KothingEditor.create.toolbar.fail] The button name of a plugin that does not exist. [" +
                    pluginName +
                    "]"
                );
              module = [
                custom.buttonClass,
                custom.title,
                custom.name,
                custom.display,
                custom.innerHTML,
                custom.disabled,
              ];
            }
          }

          buttonElement = this.createButton(
            module[0],
            module[1],
            module[2],
            module[3],
            module[4],
            module[5],
            icons
          );
          (more ? moreContainer : moduleElement.ul).appendChild(
            buttonElement.li
          );

          if (plugins[pluginName]) {
            pluginCallButtons[pluginName] = buttonElement.button;
          }

          // more button
          if (moreButton) {
            more = true;
            moreContainer = util.createElement("DIV");
            moreContainer.className = "ke-more-layer " + moreCommand;
            moreContainer.innerHTML =
              '<div class="ke-more-form"><ul class="ke-menu-list"' +
              (align ? ' style="float: ' + align + ';"' : "") +
              "></ul></div>";
            moreLayer.appendChild(moreContainer);
            moreContainer = moreContainer.firstElementChild.firstElementChild;
          }
        }

        if (vertical) {
          const sv = separator_vertical.cloneNode(false);
          buttonTray.appendChild(sv);
        }

        buttonTray.appendChild(moduleElement.div);
        vertical = true;
      } else if (/^\/$/.test(buttonGroup)) {
        /** line break  */
        const enterDiv = document.createElement("DIV");
        enterDiv.className = "ke-btn-module-enter";
        buttonTray.appendChild(enterDiv);
        vertical = false;
      }
    }

    switch (buttonTray.children.length) {
      case 0:
        buttonTray.style.display = "none";
        break;
      case 1:
        util.removeClass(buttonTray.firstElementChild, "ke-btn-module-border");
        break;
      default:
        if (options.rtl) {
          const sv = separator_vertical.cloneNode(false);
          sv.style.float = buttonTray.lastElementChild.style.float;
          buttonTray.appendChild(sv);
        }
    }

    if (responsiveButtons.length > 0) {
      responsiveButtons.unshift(toolbarItem);
    }
    if (moreLayer.children.length > 0) {
      buttonTray.appendChild(moreLayer);
    }

    // menu tray
    const menuTray = document.createElement("DIV");
    menuTray.className = "ke-menu-tray";
    tool_bar.appendChild(menuTray);

    // cover
    const tool_cover = document.createElement("DIV");
    tool_cover.className = "ke-toolbar-cover";
    tool_bar.appendChild(tool_cover);

    return {
      element: tool_bar,
      plugins: plugins,
      pluginCallButtons: pluginCallButtons,
      responsiveButtons: responsiveButtons,
      menuTray: menuTray,
      buttonTray: buttonTray,
    };
  },
};
