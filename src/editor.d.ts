import { KothingEditorOptions } from "./options";
import KothingEditor from "./lib/core";

declare namespace _default {
  export function create(
    idOrElement: string | Element,
    options: KothingEditorOptions,
    _init_options?: KothingEditorOptions
  ): KothingEditor;
  export function init(init_options: KothingEditorOptions): {
    create: typeof create;
  };
}

export default _default;
