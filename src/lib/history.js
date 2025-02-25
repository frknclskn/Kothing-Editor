/*
 * KothingEditor
 *
 * The WYSIWYG Rich Text Editor
 * Copyright Kothing.
 * MIT license.
 */

export default function (core, change) {
  const _window = core._window;
  const util = core.util;
  const delayTime = core.options.historyStackDelayTime;
  let editor = core.context.element;
  let undo = core.context.tool.undo;
  let redo = core.context.tool.redo;

  let pushDelay = null;
  let stackIndex = 0;
  let stack = [];

  function setContentsFromStack() {
    const item = stack[stackIndex];
    editor.wysiwyg.innerHTML = item.contents;

    core.setRange(
      util.getNodeFromPath(item.s.path, editor.wysiwyg),
      item.s.offset,
      util.getNodeFromPath(item.e.path, editor.wysiwyg),
      item.e.offset
    );
    core.focus();

    if (stackIndex === 0) {
      if (undo) {
        undo.setAttribute("disabled", true);
      }
      if (redo) {
        redo.removeAttribute("disabled");
      }
    } else if (stackIndex === stack.length - 1) {
      if (undo) {
        undo.removeAttribute("disabled");
      }
      if (redo) {
        redo.setAttribute("disabled", true);
      }
    } else {
      if (undo) {
        undo.removeAttribute("disabled");
      }
      if (redo) {
        redo.removeAttribute("disabled");
      }
    }

    core.controllersOff();
    core.checkComponents();
    core.setCharCount();
    core.resourcesStateChange();

    // onChange
    change();
  }

  function pushStack() {
    core.checkComponents();
    const current = core.getContents(true);
    if (
      !current ||
      (!!stack[stackIndex] && current === stack[stackIndex].contents)
    )
      return;

    stackIndex++;
    const range = core._variable.range;

    if (stack.length > stackIndex) {
      stack = stack.slice(0, stackIndex);
      if (redo) {
        redo.setAttribute("disabled", true);
      }
    }

    if (!range) {
      stack[stackIndex] = {
        contents: current,
        s: { path: [0, 0], offset: [0, 0] },
        e: { path: 0, offset: 0 },
      };
    } else {
      stack[stackIndex] = {
        contents: current,
        s: {
          path: util.getNodePath(range.startContainer, null, null),
          offset: range.startOffset,
        },
        e: {
          path: util.getNodePath(range.endContainer, null, null),
          offset: range.endOffset,
        },
      };
    }

    if (stackIndex === 1 && undo) {
      undo.removeAttribute("disabled");
    }

    core.setCharCount();
    // onChange
    change();
  }

  return {
    /**
     * @description History stack
     */
    stack: stack,

    /**
     * @description Saving the current status to the history object stack
     * If "delay" is true, it will be saved after (options.historyStackDelayTime || 400) miliseconds
     * If the function is called again with the "delay" argument true before it is saved, the delay time is renewal
     * You can specify the delay time by sending a number.
     * @param {Boolean|Number} delay If true, Add stack without delay time.
     */
    push: function (delay) {
      _window.setTimeout(core.resourcesStateChange.bind(core));
      const time =
        typeof delay === "number"
          ? delay > 0
            ? delay
            : 0
          : !delay
          ? 0
          : delayTime;

      if (!time || pushDelay) {
        _window.clearTimeout(pushDelay);
        if (!time) {
          pushStack();
          return;
        }
      }

      pushDelay = _window.setTimeout(function () {
        _window.clearTimeout(pushDelay);
        pushDelay = null;
        pushStack();
      }, time);
    },

    /**
     * @description Undo function
     */
    undo: function () {
      if (stackIndex > 0) {
        stackIndex--;
        setContentsFromStack();
      }
    },

    /**
     * @description Redo function
     */
    redo: function () {
      if (stack.length - 1 > stackIndex) {
        stackIndex++;
        setContentsFromStack();
      }
    },

    /**
     * @description Go to the history stack for that index.
     * If "index" is -1, go to the last stack
     * @param {Number} index Stack index
     */
    go: function (index) {
      stackIndex = index < 0 ? stack.length - 1 : index;
      setContentsFromStack();
    },

    /**
     * @description Reset the history object
     */
    reset: function (ignoreChangeEvent) {
      if (undo) {
        undo.setAttribute("disabled", true);
      }
      if (redo) {
        redo.setAttribute("disabled", true);
      }
      core._variable.isChanged = false;
      if (core.context.tool.save) {
        core.context.tool.save.setAttribute("disabled", true);
      }

      stack.splice(0);
      stackIndex = 0;

      // pushStack
      stack[stackIndex] = {
        contents: core.getContents(true),
        s: {
          path: [0, 0],
          offset: 0,
        },
        e: {
          path: [0, 0],
          offset: 0,
        },
      };

      if (!ignoreChangeEvent) {
        change();
      }
    },

    /**
     * @description Reset the disabled state of the buttons to fit the current stack.
     * @private
     */
    resetCachingButton: function () {
      editor = core.context.element;
      undo = core.context.tool.undo;
      redo = core.context.tool.redo;

      if (stackIndex === 0) {
        if (undo) {
          undo.setAttribute("disabled", true);
        }
        if (redo && stackIndex === stack.length - 1) {
          redo.setAttribute("disabled", true);
        }
        core._variable.isChanged = false;
        if (core.context.tool.save) {
          core.context.tool.save.setAttribute("disabled", true);
        }
      } else if (stackIndex === stack.length - 1) {
        if (redo) {
          redo.setAttribute("disabled", true);
        }
      }
    },

    /**
     * @description Remove all stacks and remove the timeout function.
     * @private
     */
    destroy: function () {
      if (pushDelay) {
        _window.clearTimeout(pushDelay);
      }
      stack = null;
    },
  };
}
