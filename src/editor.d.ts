import { KothingEditorOptions } from "./options";
import KothingEditor from "./lib/core";

declare namespace _default {
  export function create(
    targetElement: string | Element,
    options: KothingEditorOptions,
    init_options?: KothingEditorOptions
  ): KothingEditor;
  export function init(init_options: KothingEditorOptions): {
    create: typeof create;
  };
}

export default _default;
