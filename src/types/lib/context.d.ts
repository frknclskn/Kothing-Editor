import { KothingEditorOptions } from "./../options.d";
import { Plugin } from "../plugins/Plugin";

declare interface EditorElement {
  originElement: Element;
  topArea: Element;
  relative: Element;
  toolbar: Element;
  resizingBar: Element;
  navigation: Element;
  charWrapper: Element;
  charCounter: Element;
  editorArea: Element;
  wysiwygFrame: Element;
  wysiwyg: Element;
  code: Element;
  placeholder: Element;
  loading: Element;
  lineBreaker: Element;
  resizeBackground: Element;
}

export interface Context {
  element: EditorElement;
  tool: Record<string, Element>;
  options: KothingEditorOptions;
  option: KothingEditorOptions;
  [key: string]: any;
}

type Constructor = {
  constructed: Record<string, Element | null>;
  options: KothingEditorOptions;
  plugins: Plugin[];
  pluginCallButtons: Record<string, Element>;
  icons: Record<string, string>;
};

declare function $context(
  element: Element,
  cons: Constructor,
  options: KothingEditorOptions
): Context;

export default $context;
