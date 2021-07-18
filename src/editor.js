/*
 * KothingEditor
 *
 * The WYSIWYG Rich Text Editor
 * Copyright Kothing.
 * MIT license.
 */

import core from "./lib/core";
import util from "./lib/util";
import constructor from "./lib/constructor";
import context from "./lib/context";

export default {
  /**
   * @description Returns the create function with preset options.
   * If the options overlap, the options of the 'create' function take precedence.
   * @param {Json} options Initialization options
   * @returns {Object}
   */
  init: function (init_options) {
    return {
      create: function (targetElement, options) {
        return this.create(targetElement, options, init_options);
      }.bind(this),
    };
  },

  /**
   * @description Create the KothingEditor
   * @param {String|Element} targetElement textarea Id or textarea element
   * @param {JSON|Object} options user options
   * @returns {Object}
   */
  create: function (targetElement, options, init_options) {
    if (util.typeOf(options) !== "object") {
      options = {};
    }
    if (init_options) {
      options = [init_options, options].reduce(function (init, option) {
        for (const key in option) {
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
      typeof targetElement === "string"
        ? document.getElementById(targetElement)
        : targetElement;

    if (!element) {
      if (typeof targetElement === "string") {
        throw Error(
          `[KothingEditor.create.fail] The element for that id was not found (ID: "${targetElement}")`
        );
      }
      throw Error(
        "[KothingEditor.create.fail] KothingEditor requires html element or element id"
      );
    }

    const constrct = constructor.init(element, options);

    if (
      constrct.constructed.top.id &&
      document.getElementById(constrct.constructed.top.id)
    ) {
      throw Error(
        `[KothingEditor.create.fail] The ID of the KothingEditor you are trying to create already exists (ID:"${constrct.constructed.top.id}")`
      );
    }

    return core(
      context(element, constrct.constructed, constrct.options),
      options,
      constrct.plugins,
      constrct.pluginCallButtons,
      constrct.responsiveButtons
    );
  },
};
