/*
 * KothingEditor
 *
 * The WYSIWYG Rich Text Editor
 * Copyright Kothing.
 * MIT license.
 */

import core from "./lib/core";
import util from "./lib/util";
import $constructor from "./lib/constructor";
import $context from "./lib/context";

export default {
  /**
   * @description Returns the create function with preset options.
   * If the options overlap, the options of the 'create' function take precedence.
   * @param {Json} options Initialization options
   * @returns {Object}
   */
  init: function (init_options) {
    return {
      create: function (idOrElement, options) {
        return this.create(idOrElement, options, init_options);
      }.bind(this),
    };
  },

  /**
   * @description Create the KothingEditor
   * @param {String|Element} idOrElement textarea Id or textarea element
   * @param {JSON|Object} options user options
   * @returns {Object}
   */
  create: function (idOrElement, options, _init_options) {
    util._propertiesInit();

    if (typeof options !== "object") {
      options = {};
    }
    if (_init_options) {
      options = [_init_options, options].reduce(function (init, option) {
        for (let key in option) {
          if (!util.hasOwn(option, key)) {
            continue;
          }
          if (key === "plugins" && option[key] && init[key]) {
            let i = init[key],
              o = option[key];
            i = i.length
              ? i
              : Object.keys(i).map(function (name) {
                  return i[name];
                });
            o = o.length
              ? o
              : Object.keys(o).map(function (name) {
                  return o[name];
                });
            init[key] = o
              .filter(function (val) {
                return i.indexOf(val) === -1;
              })
              .concat(i);
          } else {
            init[key] = option[key];
          }
        }
        return init;
      }, {});
    }

    const element =
      typeof idOrElement === "string"
        ? document.getElementById(idOrElement)
        : idOrElement;

    if (!element) {
      if (typeof idOrElement === "string") {
        throw Error(
          `[KothingEditor.create.fail] The element for that id was not found (ID:"${idOrElement}")`
        );
      }
      throw Error(
        "[KothingEditor.create.fail] KothingEditor requires textarea's element or id value"
      );
    }

    const cons = $constructor.init(element, options);

    if (
      cons.constructed.top.id &&
      document.getElementById(cons.constructed.top.id)
    ) {
      throw Error(
        `[KothingEditor.create.fail] The ID of the KothingEditor you are trying to create already exists (ID:"${cons.constructed.top.id}")`
      );
    }

    return core(
      $context(element, cons.constructed, cons.options),
      cons.pluginCallButtons,
      cons.plugins,
      cons.options.lang,
      options,
      cons._responsiveButtons
    );
  },
};
