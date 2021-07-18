/*
 * KothingEditor
 *
 * The WYSIWYG Rich Text Editor
 * Copyright Kothing.
 * MIT license.
 */

export default {
  name: "table",
  display: "submenu",

  init: function () {
    const contextTable = this.context.table;
    const tablePlugin = this.plugins.table;

    tablePlugin.removeEvents.call(this);

    if (tablePlugin.selectedTable) {
      const selectedCells = tablePlugin.selectedTable.querySelectorAll(
        ".ke-table-selected-cell"
      );
      for (let i = 0, len = selectedCells.length; i < len; i++) {
        this.util.removeClass(selectedCells[i], "ke-table-selected-cell");
      }
    }

    tablePlugin.toggleEditor.call(this, true);

    contextTable.element = null;
    contextTable.tdElement = null;
    contextTable.trElement = null;
    contextTable.trElements = null;
    contextTable.tableXY = [];
    contextTable.maxWidth = true;
    contextTable.fixedColumn = false;
    contextTable.physical_cellCnt = 0;
    contextTable.logical_cellCnt = 0;
    contextTable.rowCnt = 0;
    contextTable.rowIndex = 0;
    contextTable.physical_cellIndex = 0;
    contextTable.logical_cellIndex = 0;
    contextTable.current_colSpan = 0;
    contextTable.current_rowSpan = 0;

    tablePlugin.shift = false;
    tablePlugin.selectedCells = null;
    tablePlugin.selectedTable = null;
    tablePlugin.ref = null;

    tablePlugin.fixedCell = null;
    tablePlugin.selectedCell = null;
    tablePlugin.fixedCellName = null;
  },

  add: function (core, targetElement) {
    const context = core.context;
    let contextTable = (context.table = {
      element: null,
      tdElement: null,
      trElement: null,
      trElements: null,
      tableXY: [],
      maxWidth: true,
      fixedColumn: false,
      rtl: core.options.rtl,
      cellControllerTop: core.options.tableCellControllerPosition === "top",
      resizeText: null,
      headerButton: null,
      mergeButton: null,
      splitButton: null,
      splitMenu: null,
      maxText: core.lang.controller.maxSize,
      minText: core.lang.controller.minSize,
      physical_cellCnt: 0,
      logical_cellCnt: 0,
      rowCnt: 0,
      rowIndex: 0,
      physical_cellIndex: 0,
      logical_cellIndex: 0,
      current_colSpan: 0,
      current_rowSpan: 0,
      icons: {
        expansion: core.icons.expansion,
        reduction: core.icons.reduction,
      },
    });

    /** set submenu */
    let listDiv = this.setSubmenu(core);
    let tablePicker = listDiv.querySelector(".ke-controller-table-picker");

    contextTable.tableHighlight = listDiv.querySelector(
      ".ke-table-size-highlighted"
    );
    contextTable.tableUnHighlight = listDiv.querySelector(
      ".ke-table-size-unhighlighted"
    );
    contextTable.tableDisplay = listDiv.querySelector(".ke-table-size-display");
    if (core.options.rtl) {
      contextTable.tableHighlight.style.left = 10 * 18 - 13 + "px";
    }

    /** set table controller */
    let tableController = this.setController_table(core);
    contextTable.tableController = tableController;
    contextTable.resizeButton =
      tableController.querySelector("._ke_table_resize");
    contextTable.resizeText = tableController.querySelector(
      "._ke_table_resize > span > span"
    );
    contextTable.columnFixedButton = tableController.querySelector(
      "._ke_table_fixed_column"
    );
    contextTable.headerButton =
      tableController.querySelector("._ke_table_header");

    /** set resizing */
    let resizeDiv = this.setController_tableEditor(
      core,
      contextTable.cellControllerTop
    );
    contextTable.resizeDiv = resizeDiv;
    contextTable.splitMenu = resizeDiv.querySelector(".ke-btn-group-sub");
    contextTable.mergeButton = resizeDiv.querySelector(
      "._ke_table_merge_button"
    );
    contextTable.splitButton = resizeDiv.querySelector(
      "._ke_table_split_button"
    );
    contextTable.insertRowAboveButton = resizeDiv.querySelector(
      "._ke_table_insert_row_a"
    );
    contextTable.insertRowBelowButton = resizeDiv.querySelector(
      "._ke_table_insert_row_b"
    );

    /** add event listeners */
    tablePicker.addEventListener(
      "mousemove",
      this.onMouseMove_tablePicker.bind(core, contextTable)
    );
    tablePicker.addEventListener("click", this.appendTable.bind(core));
    resizeDiv.addEventListener(
      "click",
      this.onClick_tableController.bind(core)
    );
    tableController.addEventListener(
      "click",
      this.onClick_tableController.bind(core)
    );

    /** append target button menu */
    core.initMenuTarget(this.name, targetElement, listDiv);

    /** append controller */
    context.element.relative.appendChild(resizeDiv);
    context.element.relative.appendChild(tableController);

    /** empty memory */
    listDiv = null;
    tablePicker = null;
    resizeDiv = null;
    tableController = null;
    contextTable = null;
  },

  setSubmenu: function (core) {
    const listDiv = core.util.createElement("DIV");
    listDiv.className = "ke-submenu ke-selector-table";
    listDiv.innerHTML =
      "" +
      '<div class="ke-table-size">' +
      '<div class="ke-table-size-picker ke-controller-table-picker"></div>' +
      '<div class="ke-table-size-highlighted"></div>' +
      '<div class="ke-table-size-unhighlighted"></div>' +
      "</div>" +
      '<div class="ke-table-size-display">1 x 1</div>';

    return listDiv;
  },

  setController_table: function (core) {
    const lang = core.lang;
    const icons = core.icons;
    const tableResize = core.util.createElement("DIV");

    tableResize.className = "ke-controller ke-controller-table";
    tableResize.innerHTML =
      "" +
      "<div>" +
      '<div class="ke-btn-group">' +
      '<button type="button" data-command="resize" class="ke-btn ke-tooltip _ke_table_resize">' +
      icons.expansion +
      '<span class="ke-tooltip-inner"><span class="ke-tooltip-text">' +
      lang.controller.maxSize +
      "</span></span>" +
      "</button>" +
      '<button type="button" data-command="layout" class="ke-btn ke-tooltip _ke_table_fixed_column">' +
      icons.fixed_column_width +
      '<span class="ke-tooltip-inner"><span class="ke-tooltip-text">' +
      lang.controller.fixedColumnWidth +
      "</span></span>" +
      "</button>" +
      '<button type="button" data-command="header" class="ke-btn ke-tooltip _ke_table_header">' +
      icons.table_header +
      '<span class="ke-tooltip-inner"><span class="ke-tooltip-text">' +
      lang.controller.tableHeader +
      "</span></span>" +
      "</button>" +
      '<button type="button" data-command="remove" class="ke-btn ke-tooltip">' +
      icons.delete +
      '<span class="ke-tooltip-inner"><span class="ke-tooltip-text">' +
      lang.controller.remove +
      "</span></span>" +
      "</button>" +
      "</div>" +
      "</div>";

    return tableResize;
  },

  setController_tableEditor: function (core, cellControllerTop) {
    const lang = core.lang;
    const icons = core.icons;
    const tableResize = core.util.createElement("DIV");

    tableResize.className = "ke-controller ke-controller-table-cell";
    tableResize.innerHTML =
      (cellControllerTop ? "" : '<div class="ke-arrow ke-arrow-up"></div>') +
      '<div class="ke-btn-group">' +
      '<button type="button" data-command="insert" data-value="row" data-option="up" class="ke-btn ke-tooltip _ke_table_insert_row_a">' +
      icons.insert_row_above +
      '<span class="ke-tooltip-inner"><span class="ke-tooltip-text">' +
      lang.controller.insertRowAbove +
      "</span></span>" +
      "</button>" +
      '<button type="button" data-command="insert" data-value="row" data-option="down" class="ke-btn ke-tooltip _ke_table_insert_row_b">' +
      icons.insert_row_below +
      '<span class="ke-tooltip-inner"><span class="ke-tooltip-text">' +
      lang.controller.insertRowBelow +
      "</span></span>" +
      "</button>" +
      '<button type="button" data-command="delete" data-value="row" class="ke-btn ke-tooltip">' +
      icons.delete_row +
      '<span class="ke-tooltip-inner"><span class="ke-tooltip-text">' +
      lang.controller.deleteRow +
      "</span></span>" +
      "</button>" +
      '<button type="button" data-command="merge" class="_ke_table_merge_button ke-btn ke-tooltip" disabled>' +
      icons.merge_cell +
      '<span class="ke-tooltip-inner"><span class="ke-tooltip-text">' +
      lang.controller.mergeCells +
      "</span></span>" +
      "</button>" +
      "</div>" +
      '<div class="ke-btn-group" style="padding-top: 0;">' +
      '<button type="button" data-command="insert" data-value="cell" data-option="left" class="ke-btn ke-tooltip">' +
      icons.insert_column_left +
      '<span class="ke-tooltip-inner"><span class="ke-tooltip-text">' +
      lang.controller.insertColumnBefore +
      "</span></span>" +
      "</button>" +
      '<button type="button" data-command="insert" data-value="cell" data-option="right" class="ke-btn ke-tooltip">' +
      icons.insert_column_right +
      '<span class="ke-tooltip-inner"><span class="ke-tooltip-text">' +
      lang.controller.insertColumnAfter +
      "</span></span>" +
      "</button>" +
      '<button type="button" data-command="delete" data-value="cell" class="ke-btn ke-tooltip">' +
      icons.delete_column +
      '<span class="ke-tooltip-inner"><span class="ke-tooltip-text">' +
      lang.controller.deleteColumn +
      "</span></span>" +
      "</button>" +
      '<button type="button" data-command="onsplit" class="_ke_table_split_button ke-btn ke-tooltip">' +
      icons.split_cell +
      '<span class="ke-tooltip-inner"><span class="ke-tooltip-text">' +
      lang.controller.splitCells +
      "</span></span>" +
      "</button>" +
      '<div class="ke-btn-group-sub kothing-editor-common ke-list-layer ke-table-split">' +
      '<div class="ke-list-inner">' +
      '<ul class="ke-list-basic">' +
      '<li class="ke-btn-list" data-command="split" data-value="vertical" style="line-height:32px;" title="' +
      lang.controller.VerticalSplit +
      '">' +
      lang.controller.VerticalSplit +
      "</li>" +
      '<li class="ke-btn-list" data-command="split" data-value="horizontal" style="line-height:32px;" title="' +
      lang.controller.HorizontalSplit +
      '">' +
      lang.controller.HorizontalSplit +
      "</li>" +
      "</ul>" +
      "</div>" +
      "</div>" +
      "</div>";

    return tableResize;
  },

  appendTable: function () {
    const oTable = this.util.createElement("TABLE");
    const createCells = this.plugins.table.createCells;

    const x = this.context.table.tableXY[0];
    let y = this.context.table.tableXY[1];
    let tableHTML = "<tbody>";
    while (y > 0) {
      tableHTML += "<tr>" + createCells.call(this, "td", x) + "</tr>";
      --y;
    }
    tableHTML += "</tbody>";
    oTable.innerHTML = tableHTML;

    const changed = this.insertComponent(oTable, false, true, false);

    if (changed) {
      const firstTd = oTable.querySelector("td div");
      this.setRange(firstTd, 0, firstTd, 0);
      this.plugins.table.reset_table_picker.call(this);
    }
  },

  createCells: function (nodeName, cnt, returnElement) {
    nodeName = nodeName.toLowerCase();

    if (!returnElement) {
      let cellsHTML = "";
      while (cnt > 0) {
        cellsHTML += "<" + nodeName + "><div><br></div></" + nodeName + ">";
        cnt--;
      }
      return cellsHTML;
    } else {
      const cell = this.util.createElement(nodeName);
      cell.innerHTML = "<div><br></div>";
      return cell;
    }
  },

  onMouseMove_tablePicker: function (contextTable, e) {
    e.stopPropagation();

    let x = this._window.Math.ceil(e.offsetX / 18);
    let y = this._window.Math.ceil(e.offsetY / 18);
    x = x < 1 ? 1 : x;
    y = y < 1 ? 1 : y;

    if (contextTable.rtl) {
      contextTable.tableHighlight.style.left = x * 18 - 13 + "px";
      x = 11 - x;
    }

    contextTable.tableHighlight.style.width = x + "em";
    contextTable.tableHighlight.style.height = y + "em";

    // let x_u = x < 5 ? 5 : (x > 9 ? 10 : x + 1);
    // let y_u = y < 5 ? 5 : (y > 9 ? 10 : y + 1);
    // contextTable.tableUnHighlight.style.width = x_u + 'em';
    // contextTable.tableUnHighlight.style.height = y_u + 'em';

    this.util.changeTxt(contextTable.tableDisplay, x + " x " + y);
    contextTable.tableXY = [x, y];
  },

  reset_table_picker: function () {
    if (!this.context.table.tableHighlight) {
      return;
    }

    const highlight = this.context.table.tableHighlight.style;
    const unHighlight = this.context.table.tableUnHighlight.style;

    highlight.width = "1em";
    highlight.height = "1em";
    unHighlight.width = "10em";
    unHighlight.height = "10em";

    this.util.changeTxt(this.context.table.tableDisplay, "1 x 1");
    this.submenuOff();
  },

  /** table edit controller */
  call_controller_tableEdit: function (tdElement) {
    const tablePlugin = this.plugins.table;
    const contextTable = this.context.table;

    if (!this.getSelection().isCollapsed && !tablePlugin.selectedCell) {
      this.controllersOff();
      this.util.removeClass(tdElement, "ke-table-selected-cell");
      return;
    }

    const tableElement =
      contextTable.element ||
      this.plugins.table.selectedTable ||
      this.util.getParentElement(tdElement, "TABLE");
    contextTable.maxWidth =
      this.util.hasClass(tableElement, "ke-table-size-100") ||
      tableElement.style.width === "100%" ||
      (!tableElement.style.width &&
        !this.util.hasClass(tableElement, "ke-table-size-auto"));
    contextTable.fixedColumn =
      this.util.hasClass(tableElement, "ke-table-layout-fixed") ||
      tableElement.style.tableLayout === "fixed";
    tablePlugin.setTableStyle.call(
      this,
      contextTable.maxWidth ? "width|column" : "width"
    );

    tablePlugin.setPositionControllerTop.call(this, tableElement);
    tablePlugin.setPositionControllerDiv.call(
      this,
      tdElement,
      tablePlugin.shift
    );

    if (!tablePlugin.shift) {
      this.controllersOn(
        contextTable.resizeDiv,
        contextTable.tableController,
        tablePlugin.init.bind(this),
        tdElement,
        "table"
      );
    }
  },

  setPositionControllerTop: function (tableElement) {
    this.setControllerPosition(
      this.context.table.tableController,
      tableElement,
      "top",
      { left: 0, top: 0 }
    );
  },

  setPositionControllerDiv: function (tdElement, reset) {
    const contextTable = this.context.table;
    const resizeDiv = contextTable.resizeDiv;

    this.plugins.table.setCellInfo.call(this, tdElement, reset);

    if (contextTable.cellControllerTop) {
      this.setControllerPosition(resizeDiv, contextTable.element, "top", {
        left: contextTable.tableController.offsetWidth,
        top: 0,
      });
    } else {
      this.setControllerPosition(resizeDiv, tdElement, "bottom", {
        left: 0,
        top: 0,
      });
    }
  },

  setCellInfo: function (tdElement, reset) {
    const contextTable = this.context.table;
    const table = (contextTable.element =
      this.plugins.table.selectedTable ||
      this.util.getParentElement(tdElement, "TABLE"));

    if (/THEAD/i.test(table.firstElementChild.nodeName)) {
      this.util.addClass(contextTable.headerButton, "active");
    } else {
      this.util.removeClass(contextTable.headerButton, "active");
    }

    if (reset || contextTable.physical_cellCnt === 0) {
      if (contextTable.tdElement !== tdElement) {
        contextTable.tdElement = tdElement;
        contextTable.trElement = tdElement.parentNode;
      }

      const rows = (contextTable.trElements = table.rows);
      const cellIndex = tdElement.cellIndex;

      let cellCnt = 0;
      for (
        let i = 0, cells = rows[0].cells, len = rows[0].cells.length;
        i < len;
        i++
      ) {
        cellCnt += cells[i].colSpan;
      }

      // row cnt, row index
      const rowIndex = (contextTable.rowIndex =
        contextTable.trElement.rowIndex);
      contextTable.rowCnt = rows.length;

      // cell cnt, physical cell index
      contextTable.physical_cellCnt = contextTable.trElement.cells.length;
      contextTable.logical_cellCnt = cellCnt;
      contextTable.physical_cellIndex = cellIndex;

      // span
      contextTable.current_colSpan = contextTable.tdElement.colSpan - 1;
      contextTable.current_rowSpan -
        contextTable.trElement.cells[cellIndex].rowSpan -
        1;

      // find logcal cell index
      let rowSpanArr = [];
      let spanIndex = [];
      for (let i = 0, cells, colSpan; i <= rowIndex; i++) {
        cells = rows[i].cells;
        colSpan = 0;
        for (
          let c = 0, cLen = cells.length, cell, cs, rs, logcalIndex;
          c < cLen;
          c++
        ) {
          cell = cells[c];
          cs = cell.colSpan - 1;
          rs = cell.rowSpan - 1;
          logcalIndex = c + colSpan;

          if (spanIndex.length > 0) {
            for (let r = 0, arr; r < spanIndex.length; r++) {
              arr = spanIndex[r];
              if (arr.row > i) {
                continue;
              }
              if (logcalIndex >= arr.index) {
                colSpan += arr.cs;
                logcalIndex += arr.cs;
                arr.rs -= 1;
                arr.row = i + 1;
                if (arr.rs < 1) {
                  spanIndex.splice(r, 1);
                  r--;
                }
              } else if (c === cLen - 1) {
                arr.rs -= 1;
                arr.row = i + 1;
                if (arr.rs < 1) {
                  spanIndex.splice(r, 1);
                  r--;
                }
              }
            }
          }

          // logcal cell index
          if (i === rowIndex && c === cellIndex) {
            contextTable.logical_cellIndex = logcalIndex;
            break;
          }

          if (rs > 0) {
            rowSpanArr.push({
              index: logcalIndex,
              cs: cs + 1,
              rs: rs,
              row: -1,
            });
          }

          colSpan += cs;
        }

        spanIndex = spanIndex.concat(rowSpanArr).sort(function (a, b) {
          return a.index - b.index;
        });
        rowSpanArr = [];
      }

      rowSpanArr = null;
      spanIndex = null;
    }
  },

  editTable: function (type, option) {
    const tablePlugin = this.plugins.table;
    const contextTable = this.context.table;
    const table = contextTable.element;
    const isRow = type === "row";

    if (isRow) {
      const tableAttr = contextTable.trElement.parentNode;
      if (/^THEAD$/i.test(tableAttr.nodeName)) {
        if (option === "up") {
          return;
        } else if (
          !tableAttr.nextElementSibling ||
          !/^TBODY$/i.test(tableAttr.nextElementSibling.nodeName)
        ) {
          table.innerHTML +=
            "<tbody><tr>" +
            tablePlugin.createCells.call(
              this,
              "td",
              contextTable.logical_cellCnt,
              false
            ) +
            "</tr></tbody>";
          return;
        }
      }
    }

    // multi
    if (tablePlugin.ref) {
      const positionCell = contextTable.tdElement;
      const selectedCells = tablePlugin.selectedCells;
      // multi - row
      if (isRow) {
        // remove row
        if (!option) {
          let row = selectedCells[0].parentNode;
          const removeCells = [selectedCells[0]];

          for (let i = 1, len = selectedCells.length, cell; i < len; i++) {
            cell = selectedCells[i];
            if (row !== cell.parentNode) {
              removeCells.push(cell);
              row = cell.parentNode;
            }
          }

          for (let i = 0, len = removeCells.length; i < len; i++) {
            tablePlugin.setCellInfo.call(this, removeCells[i], true);
            tablePlugin.editRow.call(this, option);
          }
        } else {
          // edit row
          tablePlugin.setCellInfo.call(
            this,
            option === "up"
              ? selectedCells[0]
              : selectedCells[selectedCells.length - 1],
            true
          );
          tablePlugin.editRow.call(this, option, positionCell);
        }
      } else {
        // multi - cell
        const firstRow = selectedCells[0].parentNode;
        // remove cell
        if (!option) {
          const removeCells = [selectedCells[0]];

          for (let i = 1, len = selectedCells.length, cell; i < len; i++) {
            cell = selectedCells[i];
            if (firstRow === cell.parentNode) {
              removeCells.push(cell);
            } else {
              break;
            }
          }

          for (let i = 0, len = removeCells.length; i < len; i++) {
            tablePlugin.setCellInfo.call(this, removeCells[i], true);
            tablePlugin.editCell.call(this, option);
          }
        } else {
          // edit cell
          let rightCell = null;

          for (let i = 0, len = selectedCells.length - 1; i < len; i++) {
            if (firstRow !== selectedCells[i + 1].parentNode) {
              rightCell = selectedCells[i];
              break;
            }
          }

          tablePlugin.setCellInfo.call(
            this,
            option === "left"
              ? selectedCells[0]
              : rightCell || selectedCells[0],
            true
          );
          tablePlugin.editCell.call(this, option, positionCell);
        }
      }

      if (!option) {
        tablePlugin.init.call(this);
      }
    } else {
      // one
      tablePlugin[isRow ? "editRow" : "editCell"].call(this, option);
    }

    // after remove
    if (!option) {
      const children = table.children;
      for (let i = 0; i < children.length; i++) {
        if (children[i].children.length === 0) {
          this.util.removeItem(children[i]);
          i--;
        }
      }

      if (table.children.length === 0) {
        this.util.removeItem(table);
      }
    }
  },

  editRow: function (option, positionResetElement) {
    const contextTable = this.context.table;
    const remove = !option;

    const up = option === "up";
    const originRowIndex = contextTable.rowIndex;
    const rowIndex =
      remove || up
        ? originRowIndex
        : originRowIndex + contextTable.current_rowSpan + 1;
    const sign = remove ? -1 : 1;

    const rows = contextTable.trElements;
    let cellCnt = contextTable.logical_cellCnt;

    for (
      let i = 0, len = originRowIndex + (remove ? -1 : 0), cell;
      i <= len;
      i++
    ) {
      cell = rows[i].cells;
      if (cell.length === 0) {
        return;
      }

      for (let c = 0, cLen = cell.length, rs, cs; c < cLen; c++) {
        rs = cell[c].rowSpan;
        cs = cell[c].colSpan;
        if (rs < 2 && cs < 2) {
          continue;
        }

        if (rs + i > rowIndex && rowIndex > i) {
          cell[c].rowSpan = rs + sign;
          cellCnt -= cs;
        }
      }
    }

    if (remove) {
      const next = rows[originRowIndex + 1];
      if (next) {
        const spanCells = [];
        let cells = rows[originRowIndex].cells;
        let colSpan = 0;

        for (let i = 0, len = cells.length, cell, logcalIndex; i < len; i++) {
          cell = cells[i];
          logcalIndex = i + colSpan;
          colSpan += cell.colSpan - 1;

          if (cell.rowSpan > 1) {
            cell.rowSpan -= 1;
            spanCells.push({ cell: cell.cloneNode(false), index: logcalIndex });
          }
        }

        if (spanCells.length > 0) {
          let spanCell = spanCells.shift();
          cells = next.cells;
          colSpan = 0;

          for (let i = 0, len = cells.length, cell, logcalIndex; i < len; i++) {
            cell = cells[i];
            logcalIndex = i + colSpan;
            colSpan += cell.colSpan - 1;

            if (logcalIndex >= spanCell.index) {
              i--, colSpan--;
              colSpan += spanCell.cell.colSpan - 1;
              next.insertBefore(spanCell.cell, cell);
              spanCell = spanCells.shift();
              if (!spanCell) {
                break;
              }
            }
          }

          if (spanCell) {
            next.appendChild(spanCell.cell);
            for (let i = 0, len = spanCells.length; i < len; i++) {
              next.appendChild(spanCells[i].cell);
            }
          }
        }
      }

      contextTable.element.deleteRow(rowIndex);
    } else {
      const newRow = contextTable.element.insertRow(rowIndex);
      newRow.innerHTML = this.plugins.table.createCells.call(
        this,
        "td",
        cellCnt,
        false
      );
    }

    if (!remove) {
      this.plugins.table.setPositionControllerDiv.call(
        this,
        positionResetElement || contextTable.tdElement,
        true
      );
    } else {
      this.controllersOff();
    }
  },

  editCell: function (option, positionResetElement) {
    const contextTable = this.context.table;
    const util = this.util;
    const remove = !option;

    const left = option === "left";
    const colSpan = contextTable.current_colSpan;
    const cellIndex =
      remove || left
        ? contextTable.logical_cellIndex
        : contextTable.logical_cellIndex + colSpan + 1;

    const rows = contextTable.trElements;
    let rowSpanArr = [];
    let spanIndex = [];
    let passCell = 0;
    const removeCell = [];
    const removeSpanArr = [];

    for (
      let i = 0,
        len = contextTable.rowCnt,
        row,
        insertIndex,
        cells,
        newCell,
        applySpan,
        cellColSpan;
      i < len;
      i++
    ) {
      row = rows[i];
      insertIndex = cellIndex;
      applySpan = false;
      cells = row.cells;
      cellColSpan = 0;

      for (
        let c = 0, cell, cLen = cells.length, rs, cs, removeIndex;
        c < cLen;
        c++
      ) {
        cell = cells[c];
        if (!cell) {
          break;
        }

        rs = cell.rowSpan - 1;
        cs = cell.colSpan - 1;

        if (!remove) {
          if (c >= insertIndex) {
            break;
          }
          if (cs > 0) {
            if (passCell < 1 && cs + c >= insertIndex) {
              cell.colSpan += 1;
              insertIndex = null;
              passCell = rs + 1;
              break;
            }

            insertIndex -= cs;
          }

          if (!applySpan) {
            for (let r = 0, arr; r < spanIndex.length; r++) {
              arr = spanIndex[r];
              insertIndex -= arr.cs;
              arr.rs -= 1;
              if (arr.rs < 1) {
                spanIndex.splice(r, 1);
                r--;
              }
            }
            applySpan = true;
          }
        } else {
          removeIndex = c + cellColSpan;

          if (spanIndex.length > 0) {
            const lastCell = !cells[c + 1];
            for (let r = 0, arr; r < spanIndex.length; r++) {
              arr = spanIndex[r];
              if (arr.row > i) {
                continue;
              }

              if (removeIndex >= arr.index) {
                cellColSpan += arr.cs;
                removeIndex = c + cellColSpan;
                arr.rs -= 1;
                arr.row = i + 1;
                if (arr.rs < 1) {
                  spanIndex.splice(r, 1);
                  r--;
                }
              } else if (lastCell) {
                arr.rs -= 1;
                arr.row = i + 1;
                if (arr.rs < 1) {
                  spanIndex.splice(r, 1);
                  r--;
                }
              }
            }
          }

          if (rs > 0) {
            rowSpanArr.push({
              rs: rs,
              cs: cs + 1,
              index: removeIndex,
              row: -1,
            });
          }

          if (
            removeIndex >= insertIndex &&
            removeIndex + cs <= insertIndex + colSpan
          ) {
            removeCell.push(cell);
          } else if (
            removeIndex <= insertIndex + colSpan &&
            removeIndex + cs >= insertIndex
          ) {
            cell.colSpan -= util.getOverlapRangeAtIndex(
              cellIndex,
              cellIndex + colSpan,
              removeIndex,
              removeIndex + cs
            );
          } else if (
            rs > 0 &&
            (removeIndex < insertIndex ||
              removeIndex + cs > insertIndex + colSpan)
          ) {
            removeSpanArr.push({
              cell: cell,
              i: i,
              rs: i + rs,
            });
          }

          cellColSpan += cs;
        }
      }

      spanIndex = spanIndex.concat(rowSpanArr).sort(function (a, b) {
        return a.index - b.index;
      });
      rowSpanArr = [];

      if (!remove) {
        if (passCell > 0) {
          passCell -= 1;
          continue;
        }

        if (insertIndex !== null && cells.length > 0) {
          newCell = this.plugins.table.createCells.call(
            this,
            cells[0].nodeName,
            0,
            true
          );
          newCell = row.insertBefore(newCell, cells[insertIndex]);
        }
      }
    }

    if (remove) {
      let removeFirst, removeEnd;
      for (let r = 0, rLen = removeCell.length, row; r < rLen; r++) {
        row = removeCell[r].parentNode;
        util.removeItem(removeCell[r]);
        if (row.cells.length === 0) {
          if (!removeFirst) {
            removeFirst = util.getArrayIndex(rows, row);
          }
          removeEnd = util.getArrayIndex(rows, row);
          util.removeItem(row);
        }
      }

      for (let c = 0, cLen = removeSpanArr.length, rowSpanCell; c < cLen; c++) {
        rowSpanCell = removeSpanArr[c];
        rowSpanCell.cell.rowSpan = util.getOverlapRangeAtIndex(
          removeFirst,
          removeEnd,
          rowSpanCell.i,
          rowSpanCell.rs
        );
      }

      this.controllersOff();
    } else {
      this.plugins.table.setPositionControllerDiv.call(
        this,
        positionResetElement || contextTable.tdElement,
        true
      );
    }
  },

  closeSplitMenu: null,
  openSplitMenu: function () {
    this.util.addClass(this.context.table.splitButton, "on");
    this.context.table.splitMenu.style.display = "inline-table";

    this.plugins.table.closeSplitMenu = function () {
      this.util.removeClass(this.context.table.splitButton, "on");
      this.context.table.splitMenu.style.display = "none";
      this.removeDocEvent("click", this.plugins.table.closeSplitMenu);
      this.plugins.table.closeSplitMenu = null;
    }.bind(this);

    this.addDocEvent("click", this.plugins.table.closeSplitMenu);
  },

  splitCells: function (direction) {
    const util = this.util;
    const vertical = direction === "vertical";
    const contextTable = this.context.table;
    const currentCell = contextTable.tdElement;
    const rows = contextTable.trElements;
    const currentRow = contextTable.trElement;
    const index = contextTable.logical_cellIndex;
    const rowIndex = contextTable.rowIndex;
    const newCell = this.plugins.table.createCells.call(
      this,
      currentCell.nodeName,
      0,
      true
    );

    // vertical
    if (vertical) {
      const currentColSpan = currentCell.colSpan;
      newCell.rowSpan = currentCell.rowSpan;

      // colspan > 1
      if (currentColSpan > 1) {
        newCell.colSpan = this._window.Math.floor(currentColSpan / 2);
        currentCell.colSpan = currentColSpan - newCell.colSpan;
        currentRow.insertBefore(newCell, currentCell.nextElementSibling);
      } else {
        // colspan - 1
        let rowSpanArr = [];
        let spanIndex = [];

        for (
          let i = 0, len = contextTable.rowCnt, cells, colSpan;
          i < len;
          i++
        ) {
          cells = rows[i].cells;
          colSpan = 0;
          for (
            let c = 0, cLen = cells.length, cell, cs, rs, logcalIndex;
            c < cLen;
            c++
          ) {
            cell = cells[c];
            cs = cell.colSpan - 1;
            rs = cell.rowSpan - 1;
            logcalIndex = c + colSpan;

            if (spanIndex.length > 0) {
              for (let r = 0, arr; r < spanIndex.length; r++) {
                arr = spanIndex[r];
                if (arr.row > i) {
                  continue;
                }
                if (logcalIndex >= arr.index) {
                  colSpan += arr.cs;
                  logcalIndex += arr.cs;
                  arr.rs -= 1;
                  arr.row = i + 1;
                  if (arr.rs < 1) {
                    spanIndex.splice(r, 1);
                    r--;
                  }
                } else if (c === cLen - 1) {
                  arr.rs -= 1;
                  arr.row = i + 1;
                  if (arr.rs < 1) {
                    spanIndex.splice(r, 1);
                    r--;
                  }
                }
              }
            }

            if (logcalIndex <= index && rs > 0) {
              rowSpanArr.push({
                index: logcalIndex,
                cs: cs + 1,
                rs: rs,
                row: -1,
              });
            }

            if (
              cell !== currentCell &&
              logcalIndex <= index &&
              logcalIndex + cs >= index + currentColSpan - 1
            ) {
              cell.colSpan += 1;
              break;
            }

            if (logcalIndex > index) {
              break;
            }

            colSpan += cs;
          }

          spanIndex = spanIndex.concat(rowSpanArr).sort(function (a, b) {
            return a.index - b.index;
          });
          rowSpanArr = [];
        }

        currentRow.insertBefore(newCell, currentCell.nextElementSibling);
      }
    } else {
      // horizontal
      const currentRowSpan = currentCell.rowSpan;
      newCell.colSpan = currentCell.colSpan;

      // rowspan > 1
      if (currentRowSpan > 1) {
        newCell.rowSpan = this._window.Math.floor(currentRowSpan / 2);
        const newRowSpan = currentRowSpan - newCell.rowSpan;

        const rowSpanArr = [];
        const nextRowIndex = util.getArrayIndex(rows, currentRow) + newRowSpan;

        for (let i = 0, cells, colSpan; i < nextRowIndex; i++) {
          cells = rows[i].cells;
          colSpan = 0;
          for (
            let c = 0, cLen = cells.length, cell, cs, logcalIndex;
            c < cLen;
            c++
          ) {
            logcalIndex = c + colSpan;
            if (logcalIndex >= index) {
              break;
            }

            cell = cells[c];
            cs = cell.rowSpan - 1;
            if (cs > 0 && cs + i >= nextRowIndex && logcalIndex < index) {
              rowSpanArr.push({
                index: logcalIndex,
                cs: cell.colSpan,
              });
            }
            colSpan += cell.colSpan - 1;
          }
        }

        const nextRow = rows[nextRowIndex];
        const nextCells = nextRow.cells;
        let rs = rowSpanArr.shift();

        for (
          let c = 0,
            cLen = nextCells.length,
            colSpan = 0,
            cell,
            cs,
            logcalIndex,
            insertIndex;
          c < cLen;
          c++
        ) {
          logcalIndex = c + colSpan;
          cell = nextCells[c];
          cs = cell.colSpan - 1;
          insertIndex = logcalIndex + cs + 1;

          if (rs && insertIndex >= rs.index) {
            colSpan += rs.cs;
            insertIndex += rs.cs;
            rs = rowSpanArr.shift();
          }

          if (insertIndex >= index || c === cLen - 1) {
            nextRow.insertBefore(newCell, cell.nextElementSibling);
            break;
          }

          colSpan += cs;
        }

        currentCell.rowSpan = newRowSpan;
      } else {
        // rowspan - 1
        newCell.rowSpan = currentCell.rowSpan;
        const newRow = util.createElement("TR");
        newRow.appendChild(newCell);

        for (let i = 0, cells; i < rowIndex; i++) {
          cells = rows[i].cells;
          if (cells.length === 0) {
            return;
          }

          for (let c = 0, cLen = cells.length; c < cLen; c++) {
            if (i + cells[c].rowSpan - 1 >= rowIndex) {
              cells[c].rowSpan += 1;
            }
          }
        }

        const physicalIndex = contextTable.physical_cellIndex;
        const cells = currentRow.cells;

        for (let c = 0, cLen = cells.length; c < cLen; c++) {
          if (c === physicalIndex) {
            continue;
          }
          cells[c].rowSpan += 1;
        }

        currentRow.parentNode.insertBefore(
          newRow,
          currentRow.nextElementSibling
        );
      }
    }

    this.focusEdge(currentCell);
    this.plugins.table.setPositionControllerDiv.call(this, currentCell, true);
  },

  mergeCells: function () {
    const tablePlugin = this.plugins.table;
    const contextTable = this.context.table;
    const util = this.util;

    const ref = tablePlugin.ref;
    const selectedCells = tablePlugin.selectedCells;
    const mergeCell = selectedCells[0];

    let emptyRowFirst = null;
    let emptyRowLast = null;
    const cs = ref.ce - ref.cs + 1;
    let rs = ref.re - ref.rs + 1;
    let mergeHTML = "";
    let row = null;

    for (let i = 1, len = selectedCells.length, cell, ch; i < len; i++) {
      cell = selectedCells[i];
      if (row !== cell.parentNode) {
        row = cell.parentNode;
      }

      ch = cell.children;
      for (let c = 0, cLen = ch.length; c < cLen; c++) {
        if (
          util.isFormatElement(ch[c]) &&
          util.onlyZeroWidthSpace(ch[c].textContent)
        ) {
          util.removeItem(ch[c]);
        }
      }

      mergeHTML += cell.innerHTML;
      util.removeItem(cell);

      if (row.cells.length === 0) {
        if (!emptyRowFirst) {
          emptyRowFirst = row;
        } else {
          emptyRowLast = row;
        }
        rs -= 1;
      }
    }

    if (emptyRowFirst) {
      const rows = contextTable.trElements;
      const rowIndexFirst = util.getArrayIndex(rows, emptyRowFirst);
      const rowIndexLast = util.getArrayIndex(
        rows,
        emptyRowLast || emptyRowFirst
      );
      const removeRows = [];

      for (let i = 0, cells; i <= rowIndexLast; i++) {
        cells = rows[i].cells;
        if (cells.length === 0) {
          removeRows.push(rows[i]);
          continue;
        }

        for (let c = 0, cLen = cells.length, cell, rs; c < cLen; c++) {
          cell = cells[c];
          rs = cell.rowSpan - 1;
          if (rs > 0 && i + rs >= rowIndexFirst) {
            cell.rowSpan -= util.getOverlapRangeAtIndex(
              rowIndexFirst,
              rowIndexLast,
              i,
              i + rs
            );
          }
        }
      }

      for (let i = 0, len = removeRows.length; i < len; i++) {
        util.removeItem(removeRows[i]);
      }
    }

    mergeCell.innerHTML += mergeHTML;
    mergeCell.colSpan = cs;
    mergeCell.rowSpan = rs;

    this.controllersOff();
    tablePlugin.setActiveButton.call(this, true, false);
    tablePlugin.call_controller_tableEdit.call(this, mergeCell);

    util.addClass(mergeCell, "ke-table-selected-cell");
    this.focusEdge(mergeCell);
  },

  toggleHeader: function () {
    const util = this.util;
    const headerButton = this.context.table.headerButton;
    const active = util.hasClass(headerButton, "active");
    const table = this.context.table.element;

    if (!active) {
      const header = util.createElement("THEAD");
      header.innerHTML =
        "<tr>" +
        this.plugins.table.createCells.call(
          this,
          "th",
          this.context.table.logical_cellCnt,
          false
        ) +
        "</tr>";
      table.insertBefore(header, table.firstElementChild);
    } else {
      util.removeItem(table.querySelector("thead"));
    }

    util.toggleClass(headerButton, "active");

    if (/TH/i.test(this.context.table.tdElement.nodeName)) {
      this.controllersOff();
    } else {
      this.plugins.table.setPositionControllerDiv.call(
        this,
        this.context.table.tdElement,
        false
      );
    }
  },

  setTableStyle: function (styles) {
    const contextTable = this.context.table;
    const tableElement = contextTable.element;
    let icon, span, sizeIcon, text;

    if (styles.indexOf("width") > -1) {
      icon = contextTable.resizeButton.firstElementChild;
      span = contextTable.resizeText;

      if (!contextTable.maxWidth) {
        sizeIcon = contextTable.icons.expansion;
        text = contextTable.maxText;
        contextTable.columnFixedButton.style.display = "none";
        this.util.removeClass(tableElement, "ke-table-size-100");
        this.util.addClass(tableElement, "ke-table-size-auto");
      } else {
        sizeIcon = contextTable.icons.reduction;
        text = contextTable.minText;
        contextTable.columnFixedButton.style.display = "block";
        this.util.removeClass(tableElement, "ke-table-size-auto");
        this.util.addClass(tableElement, "ke-table-size-100");
      }

      this.util.changeElement(icon, sizeIcon);
      this.util.changeTxt(span, text);
    }

    if (styles.indexOf("column") > -1) {
      if (!contextTable.fixedColumn) {
        this.util.removeClass(tableElement, "ke-table-layout-fixed");
        this.util.addClass(tableElement, "ke-table-layout-auto");
        this.util.removeClass(contextTable.columnFixedButton, "active");
      } else {
        this.util.removeClass(tableElement, "ke-table-layout-auto");
        this.util.addClass(tableElement, "ke-table-layout-fixed");
        this.util.addClass(contextTable.columnFixedButton, "active");
      }
    }
  },

  setActiveButton: function (fixedCell, selectedCell) {
    const contextTable = this.context.table;

    if (/^TH$/i.test(fixedCell.nodeName)) {
      contextTable.insertRowAboveButton.setAttribute("disabled", true);
      contextTable.insertRowBelowButton.setAttribute("disabled", true);
    } else {
      contextTable.insertRowAboveButton.removeAttribute("disabled");
      contextTable.insertRowBelowButton.removeAttribute("disabled");
    }

    if (!selectedCell || fixedCell === selectedCell) {
      contextTable.splitButton.removeAttribute("disabled");
      contextTable.mergeButton.setAttribute("disabled", true);
    } else {
      contextTable.splitButton.setAttribute("disabled", true);
      contextTable.mergeButton.removeAttribute("disabled");
    }
  },

  // multi select
  bindOnSelect: null,
  bindOffSelect: null,
  bindOffShift: null,
  selectedCells: null,
  shift: false,
  fixedCell: null,
  fixedCellName: null,
  selectedCell: null,
  selectedTable: null,
  ref: null,

  toggleEditor: function (enabled) {
    this.context.element.wysiwyg.setAttribute("contenteditable", enabled);
    if (enabled) {
      this.util.removeClass(this.context.element.wysiwyg, "ke-disabled");
    } else {
      this.util.addClass(this.context.element.wysiwyg, "ke-disabled");
    }
  },

  offCellMultiSelect: function (e) {
    e.stopPropagation();
    const tablePlugin = this.plugins.table;

    if (!tablePlugin.shift) {
      tablePlugin.removeEvents.call(this);
      tablePlugin.toggleEditor.call(this, true);
    } else if (tablePlugin.initBind) {
      this._wd.removeEventListener("touchmove", tablePlugin.initBind);
      tablePlugin.initBind = null;
    }

    if (!tablePlugin.fixedCell || !tablePlugin.selectedTable) {
      return;
    }

    tablePlugin.setActiveButton.call(
      this,
      tablePlugin.fixedCell,
      tablePlugin.selectedCell
    );
    tablePlugin.call_controller_tableEdit.call(
      this,
      tablePlugin.selectedCell || tablePlugin.fixedCell
    );

    tablePlugin.selectedCells = tablePlugin.selectedTable.querySelectorAll(
      ".ke-table-selected-cell"
    );
    if (tablePlugin.selectedCell && tablePlugin.fixedCell) {
      this.focusEdge(tablePlugin.selectedCell);
    }

    if (!tablePlugin.shift) {
      tablePlugin.fixedCell = null;
      tablePlugin.selectedCell = null;
      tablePlugin.fixedCellName = null;
    }
  },

  onCellMultiSelect: function (e) {
    this.antiBlur = true;
    const tablePlugin = this.plugins.table;
    const target = this.util.getParentElement(e.target, this.util.isCell);

    if (tablePlugin.shift) {
      if (target === tablePlugin.fixedCell) {
        tablePlugin.toggleEditor.call(this, true);
      } else {
        tablePlugin.toggleEditor.call(this, false);
      }
    } else if (!tablePlugin.ref) {
      if (target === tablePlugin.fixedCell) {
        return;
      } else {
        tablePlugin.toggleEditor.call(this, false);
      }
    }

    if (
      !target ||
      target === tablePlugin.selectedCell ||
      tablePlugin.fixedCellName !== target.nodeName ||
      tablePlugin.selectedTable !== this.util.getParentElement(target, "TABLE")
    ) {
      return;
    }

    tablePlugin.selectedCell = target;
    tablePlugin.setMultiCells.call(this, tablePlugin.fixedCell, target);
  },

  setMultiCells: function (startCell, endCell) {
    const tablePlugin = this.plugins.table;
    const rows = tablePlugin.selectedTable.rows;
    const util = this.util;

    const selectedCells = tablePlugin.selectedTable.querySelectorAll(
      ".ke-table-selected-cell"
    );
    for (let i = 0, len = selectedCells.length; i < len; i++) {
      util.removeClass(selectedCells[i], "ke-table-selected-cell");
    }

    if (startCell === endCell) {
      util.addClass(startCell, "ke-table-selected-cell");
      if (!tablePlugin.shift) {
        return;
      }
    }

    let findSelectedCell = true;
    let spanIndex = [];
    let rowSpanArr = [];
    const ref = (tablePlugin.ref = {
      _i: 0,
      cs: null,
      ce: null,
      rs: null,
      re: null,
    });

    for (let i = 0, len = rows.length, cells, colSpan; i < len; i++) {
      cells = rows[i].cells;
      colSpan = 0;

      for (
        let c = 0, cLen = cells.length, cell, logcalIndex, cs, rs;
        c < cLen;
        c++
      ) {
        cell = cells[c];
        cs = cell.colSpan - 1;
        rs = cell.rowSpan - 1;
        logcalIndex = c + colSpan;

        if (spanIndex.length > 0) {
          for (let r = 0, arr; r < spanIndex.length; r++) {
            arr = spanIndex[r];
            if (arr.row > i) {
              continue;
            }
            if (logcalIndex >= arr.index) {
              colSpan += arr.cs;
              logcalIndex += arr.cs;
              arr.rs -= 1;
              arr.row = i + 1;
              if (arr.rs < 1) {
                spanIndex.splice(r, 1);
                r--;
              }
            } else if (c === cLen - 1) {
              arr.rs -= 1;
              arr.row = i + 1;
              if (arr.rs < 1) {
                spanIndex.splice(r, 1);
                r--;
              }
            }
          }
        }

        if (findSelectedCell) {
          if (cell === startCell || cell === endCell) {
            ref.cs =
              ref.cs !== null && ref.cs < logcalIndex ? ref.cs : logcalIndex;
            ref.ce =
              ref.ce !== null && ref.ce > logcalIndex + cs
                ? ref.ce
                : logcalIndex + cs;
            ref.rs = ref.rs !== null && ref.rs < i ? ref.rs : i;
            ref.re = ref.re !== null && ref.re > i + rs ? ref.re : i + rs;
            ref._i += 1;
          }

          if (ref._i === 2) {
            findSelectedCell = false;
            spanIndex = [];
            rowSpanArr = [];
            i = -1;
            break;
          }
        } else if (
          util.getOverlapRangeAtIndex(
            ref.cs,
            ref.ce,
            logcalIndex,
            logcalIndex + cs
          ) &&
          util.getOverlapRangeAtIndex(ref.rs, ref.re, i, i + rs)
        ) {
          const newCs = ref.cs < logcalIndex ? ref.cs : logcalIndex;
          const newCe = ref.ce > logcalIndex + cs ? ref.ce : logcalIndex + cs;
          const newRs = ref.rs < i ? ref.rs : i;
          const newRe = ref.re > i + rs ? ref.re : i + rs;

          if (
            ref.cs !== newCs ||
            ref.ce !== newCe ||
            ref.rs !== newRs ||
            ref.re !== newRe
          ) {
            ref.cs = newCs;
            ref.ce = newCe;
            ref.rs = newRs;
            ref.re = newRe;
            i = -1;

            spanIndex = [];
            rowSpanArr = [];
            break;
          }

          util.addClass(cell, "ke-table-selected-cell");
        }

        if (rs > 0) {
          rowSpanArr.push({
            index: logcalIndex,
            cs: cs + 1,
            rs: rs,
            row: -1,
          });
        }

        colSpan += cell.colSpan - 1;
      }

      spanIndex = spanIndex.concat(rowSpanArr).sort(function (a, b) {
        return a.index - b.index;
      });
      rowSpanArr = [];
    }
  },

  removeEvents: function () {
    const tablePlugin = this.plugins.table;

    if (tablePlugin.initBind) {
      this._wd.removeEventListener("touchmove", tablePlugin.initBind);
      tablePlugin.initBind = null;
    }

    if (tablePlugin.bindOnSelect) {
      this._wd.removeEventListener("mousedown", tablePlugin.bindOnSelect);
      this._wd.removeEventListener("mousemove", tablePlugin.bindOnSelect);
      tablePlugin.bindOnSelect = null;
    }

    if (tablePlugin.bindOffSelect) {
      this._wd.removeEventListener("mouseup", tablePlugin.bindOffSelect);
      tablePlugin.bindOffSelect = null;
    }

    if (tablePlugin.bindOffShift) {
      this._wd.removeEventListener("keyup", tablePlugin.bindOffShift);
      tablePlugin.bindOffShift = null;
    }
  },

  initBind: null,
  onTableCellMultiSelect: function (tdElement, shift) {
    const tablePlugin = this.plugins.table;

    tablePlugin.removeEvents.call(this);
    this.controllersOff();

    tablePlugin.shift = shift;
    tablePlugin.fixedCell = tdElement;
    tablePlugin.fixedCellName = tdElement.nodeName;
    tablePlugin.selectedTable = this.util.getParentElement(tdElement, "TABLE");

    const selectedCells = tablePlugin.selectedTable.querySelectorAll(
      ".ke-table-selected-cell"
    );
    for (let i = 0, len = selectedCells.length; i < len; i++) {
      this.util.removeClass(selectedCells[i], "ke-table-selected-cell");
    }

    this.util.addClass(tdElement, "ke-table-selected-cell");

    tablePlugin.bindOnSelect = tablePlugin.onCellMultiSelect.bind(this);
    tablePlugin.bindOffSelect = tablePlugin.offCellMultiSelect.bind(this);

    if (!shift) {
      this._wd.addEventListener("mousemove", tablePlugin.bindOnSelect, false);
    } else {
      tablePlugin.bindOffShift = function () {
        this.controllersOn(
          this.context.table.resizeDiv,
          this.context.table.tableController,
          this.plugins.table.init.bind(this),
          tdElement,
          "table"
        );
        if (!tablePlugin.ref) {
          this.controllersOff();
        }
      }.bind(this);

      this._wd.addEventListener("keyup", tablePlugin.bindOffShift, false);
      this._wd.addEventListener("mousedown", tablePlugin.bindOnSelect, false);
    }

    this._wd.addEventListener("mouseup", tablePlugin.bindOffSelect, false);
    tablePlugin.initBind = tablePlugin.init.bind(this);
    this._wd.addEventListener("touchmove", tablePlugin.initBind, false);
  },

  onClick_tableController: function (e) {
    e.stopPropagation();
    const target = e.target.getAttribute("data-command")
      ? e.target
      : e.target.parentNode;

    if (target.getAttribute("disabled")) {
      return;
    }

    const command = target.getAttribute("data-command");
    const value = target.getAttribute("data-value");
    const option = target.getAttribute("data-option");
    const tablePlugin = this.plugins.table;

    if (typeof tablePlugin.closeSplitMenu === "function") {
      tablePlugin.closeSplitMenu();
      if (command === "onsplit") {
        return;
      }
    }

    if (!command) {
      return;
    }

    e.preventDefault();
    const contextTable = this.context.table;

    switch (command) {
      case "insert":
      case "delete":
        tablePlugin.editTable.call(this, value, option);
        break;
      case "header":
        tablePlugin.toggleHeader.call(this);
        break;
      case "onsplit":
        tablePlugin.openSplitMenu.call(this);
        break;
      case "split":
        tablePlugin.splitCells.call(this, value);
        break;
      case "merge":
        tablePlugin.mergeCells.call(this);
        break;
      case "resize":
        contextTable.maxWidth = !contextTable.maxWidth;
        tablePlugin.setTableStyle.call(this, "width");
        tablePlugin.setPositionControllerTop.call(this, contextTable.element);
        tablePlugin.setPositionControllerDiv.call(
          this,
          contextTable.tdElement,
          tablePlugin.shift
        );
        break;
      case "layout":
        contextTable.fixedColumn = !contextTable.fixedColumn;
        tablePlugin.setTableStyle.call(this, "column");
        tablePlugin.setPositionControllerTop.call(this, contextTable.element);
        tablePlugin.setPositionControllerDiv.call(
          this,
          contextTable.tdElement,
          tablePlugin.shift
        );
        break;
      case "remove":
        const emptyDiv = contextTable.element.parentNode;
        this.util.removeItem(contextTable.element);
        this.controllersOff();

        if (emptyDiv !== this.context.element.wysiwyg) {
          this.util.removeItemAllParents(
            emptyDiv,
            function (current) {
              return current.childNodes.length === 0;
            },
            null
          );
        }
        this.focus();
    }

    // history stack
    this.history.push(false);
  },
};
