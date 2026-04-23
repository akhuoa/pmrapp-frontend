/**
* Same as cloneNode(true) except that shadow roots are copied
* If you are using the transforms and you need to clone a node that potentially has a shadowRoot, use this so the shadowRoot is copied
* As of November, 2020, Elementary Math and Linebreaking transforms are the only transforms that have shadowRoots. 
* @param {Element} el 
* @param {Element} [clone] 
* @returns {Element} -- the clone (only useful if function is called with one arg)
*/
function cloneElementWithShadowRoot(el, clone) {
  if (clone === void 0) clone = el.cloneNode(true);
  if (el.shadowRoot) {
    let shadowRoot = clone.attachShadow({
      mode: "open"
    });
    shadowRoot.appendChild(_MathTransforms.getCSSStyleSheet());
    for (let i = 0; i < el.shadowRoot.childElementCount; i++) shadowRoot.appendChild(cloneElementWithShadowRoot(el.shadowRoot.children[i]));
  }
  for (let i = 0; i < el.childElementCount; i++) cloneElementWithShadowRoot(el.children[i], clone.children[i]);
  return clone;
}
/**
* Converts a CSS length unit to pixels and returns that as a number
* @param{Element} element
* @param {string} length 
* @returns {number}
*/
function convertToPx(element, length) {
  if (/px/.test(length)) return parseFloat(length);
  let img = document.createElement("img");
  let leafWrapper = document.createElementNS(MATHML_NS, "mtext");
  leafWrapper.appendChild(img);
  leafWrapper.style.overflow = "hidden";
  leafWrapper.style.visibility = "hidden";
  img.style.width = length;
  element.appendChild(leafWrapper);
  const result = leafWrapper.getBoundingClientRect().width;
  leafWrapper.remove();
  return result;
}

//#endregion
//#region mglyph/mglyph.js
/***
* Convert mglyph into img element.
* This conversion should be valid everwhere mglyph is legal.
***/
/**
* @param {HTMLElement} el 
*/

function collapseWhiteSpace$1(text) {
  return text.replace(/^[\s]+|[\s]+$/g, "").replace(/[\s]+/g, " ");
}
function newOperator(text, separator) {
  let operator = document.createElementNS(namespaceURI$1, "mo");
  operator.appendChild(document.createTextNode(text));
  operator.setAttribute(separator ? "separator" : "fence", "true");
  return operator;
}
function newMrow() {
  return document.createElementNS(namespaceURI$1, "mrow");
}
function getSeparatorList(text) {
  if (text === null) return [","];
  let separatorList = [];
  for (let i = 0; i < text.length; i++) if (!/\s/g.test(text.charAt(i))) {
    let c = text.charCodeAt(i);
    if (c >= 55296 && c < 56320 && i + 1 < text.length) {
      separatorList.push(text.substr(i, 2));
      i++;
    } else separatorList.push(text.charAt(i));
  }
  return separatorList;
}
function shouldCopyAttribute(attribute) {
  return attribute.namespaceURI || !["dir", "open", "close", "separators"].includes(attribute.localName);
}
/**
* 
* @param {HTMLElement} el
* @returns {boolean}
*/
function isSpaceLike(el) {
  if (el.tagName === "mtext" || el.tagName === "mspace" || el.tagName === "maligngroup" || el.tagName === "malignmark") return true;
  if (MRowLikeElements.includes(el.tagName)) {
    for (let i = 0; i < el.children.length; i++) if (!isSpaceLike(el.children[i])) return false;
    if (el.tagName === "maction" && el.hasAttribute("selection") && isSpaceLike(el.children[el.elAttribute("selection")])) return true;
    return true;
  }
  return false;
}
/**
* 
* @param {HTMLElement} el
* @returns {[HTMLElement|null]}
*/
function getEmbellishedOperator$1(el) {
  if (el.tagName === "mo") return el;
  if (EmbellishedOpsElements.includes(el.tagName)) return getEmbellishedOperator$1(el.firstChild);
  if (MRowLikeElements.includes(el.tagName)) {
    for (let i = 0; i < el.children.length; i++) if (!isSpaceLike(el.children[i])) return getEmbellishedOperator$1(el.children[i]);
    return null;
  }
  return null;
}
/**
* 
* @param {HTMLElement} child 
* @param {string} attrName 
*/
function setAccentValue(child, attrName) {
  const op = getEmbellishedOperator$1(child);
  if (op === null) return;
  let accentVal = op.getAttribute("accent");
  if (accentVal === null && child.tagName === "mo") accentVal = "true";
  if (accentVal !== null) child.parentElement.setAttribute(attrName, accentVal);
}
/**
* 
* @param {HTMLElement} el 
*/

//#endregion
//#region horiz-align/horiz-align.js
/***
* Handles the "numalign" and "denomalign" attributes on mfrac
* Handles the "align" attribute on munder, mover, and munderover
***/
/**
* @param {HTMLElement} child
* @returns {number}
*/
function getChildWidth(child) {
  return child.getBoundingClientRect().width;
}
/**
* Handles left/right alignment by creating an mspace of the appropriate width
*   on either the left or right side.
* For something like a fraction numerator, 'child' is the numerator and 'maxWidth'
*   is the denominator's width
* @param {HTMLElement} child
* @param {number} childWidth
* @param {string} align
* @param {number} maxWidth
* @returns {HTMLElement}
*/
function doAlignment(child, childWidth, align, maxWidth) {
  if (childWidth >= maxWidth || align === "center") return child;
  if (child.tagName !== "mrow") {
    const sibling = child.nextElementSibling;
    const mrow = document.createElementNS(MATHML_NS, "mrow");
    const parent = child.parentElement;
    mrow.appendChild(child);
    parent.insertBefore(mrow, sibling);
    child = mrow;
  }
  let mspace = document.createElementNS(MATHML_NS, "mspace");
  mspace.setAttribute("width", `${(maxWidth - childWidth).toPrecision(2)}px`);
  if (align === "left") child.appendChild(mspace);else if (align === "right") child.insertBefore(mspace, child.firstElementChild);
  return child;
}
/**
* @param {HTMLElement} el
* @param {number} iChild
* @param {number} iOther
* @param {string} attr
* @returns {HTMLElement}
*/
function alignChild(el, iChild, iOther, attr) {
  doAlignment(el.children[iChild], getChildWidth(el.children[iChild]), el.getAttribute(attr), getChildWidth(el.children[iOther]));
  return el;
}
/**
* @param {HTMLElement} mfrac 
*/

function getWidthOf(mathmlStr) {
  const math = document.createElementNS(MATHML_NS, "math");
  math.innerHTML = mathmlStr;
  document.body.appendChild(math);
  const width = math.getBoundingClientRect().width;
  document.body.lastElementChild.remove();
  return width;
}
/**
* 
* @param {string} notationAttrValue
* @returns {boolean} -- true if the transform should be used
*/
function useMencloseTransform(notationAttrValue) {
  if (getWidthOf("<mi>x</mi>") === getWidthOf("<menclose notation=\"box\"><mi>x</mi></menclose>")) return true;
  if (/arrow/.test(notationAttrValue)) {
    if (getWidthOf("<math display=\"block\"><mi>x</mi></math>") === getWidthOf("<math display=\"block\"><menclose notation=\"rightarrow\"><mi>x</mi></menclose></math>")) return true;
  }
  if (/phasorangle/.test(notationAttrValue)) {
    if (getWidthOf("<math display=\"block\"><mi>x</mi></math>") === getWidthOf("<math display=\"block\"><menclose notation=\"phasorangle\"><mi>x</mi></menclose></math>")) return true;
  }
  return false;
}
/**
* 
* @param {string[]} notationArray 
* @returns {string[]} notationArray
*/
function removeRedundantNotations(notationArray) {
  notationArray = Array.from(new Set(notationArray));
  if (notationArray.includes("box")) notationArray = notationArray.filter(notation => !BORDER_NOTATIONS.includes(notation));
  for (const [notation, values] of Object.entries(ARROW_INFO)) {
    const removeArray = values[3];
    if (removeArray !== [""] && notationArray.includes(notation)) notationArray = notationArray.filter(notation => !removeArray.includes(notation));
  }
  return notationArray;
}
/**
* 
* @param {HTMLElement} element 
* @returns {boolean}
*/
function isDirLTR(element) {
  let lookingForMathElement = true;
  do {
    if (element.hasAttribute("dir")) return element.getAttribute("dir") === "ltr";
    lookingForMathElement = element.tagName !== "math";
    element = element.parentElement;
  } while (lookingForMathElement);
  return true;
}
/**
* 
* @param {HTMLElement} el 
* @param {string[]} notationArray 
* @returns {number} -- amount of padding in pixels
*/
function padAmount(el, notationArray) {
  let padding = "0.467em";
  if (notationArray.includes("roundedbox") || notationArray.includes("circle")) padding = "0.601em";
  return convertToPx(el, padding);
}
/**
* 
* @param {HTMLElement} el  // menclose element
* @returns  
*/

//#endregion
//#region ms/ms.js
/***
* Handles lqoute and rquote attrs on ms
***/
/**
* 
* @param {string} text 
*/
function collapseWhiteSpace(text) {
  return text.replace(/^[\s]+|[\s]+$/g, "").replace(/[\s]+/g, " ");
}
/**
* @param {HTMLElement} ms
*/

function getMathAlphanumeric(ch, mathStyle) {
  if (!mathStyle || mathStyle == "mup") return ch;
  let code = ch.charCodeAt(0);
  let n;
  if (ch >= "0" && ch <= "9") {
    code += 120734;
    n = setsDigit.indexOf(mathStyle);
    return n != -1 ? String.fromCodePoint(code + n * 10) : ch;
  }
  if (/[A-Za-z]/.test(ch)) {
    let varsel = "";
    if (mathStyle == "mchan" || mathStyle == "mrhnd") {
      varsel = mathStyle == "mchan" ? "︀" : "︁";
      mathStyle = "mscr";
    }
    let chT = "";
    switch (mathStyle) {
      case "mit":
        if (ch == "h") return "ℎ";
        break;
      case "mfrak":
        chT = letterlikeFraktur[ch];
        break;
      case "mscr":
        chT = letterlikeScript[ch];
        break;
      case "Bbb":
        chT = letterlikeDoubleStruck[ch];
        break;
    }
    if (chT) return chT + varsel;
    n = setsEn.indexOf(mathStyle);
    if (n == -1) return ch;
    code -= 65;
    if (code > 26) code -= 6;
    return String.fromCodePoint(code + 52 * n + 119808) + varsel;
  }
  if (ch >= "Α" && ch <= "ϵ" || ch == "∂" || ch == "∇") {
    if (mathStyle == "mbf") {
      if (ch == "Ϝ") return "𝟊";
      if (ch == "ϝ") return "𝟋";
    }
    n = setsGr.indexOf(mathStyle);
    if (n == -1) return ch;
    let code0 = offsetsGr[ch];
    if (code0) code = code0;else {
      code -= 913;
      if (code > 25) code -= 6;
    }
    return String.fromCodePoint(code + 58 * n + 120488);
  }
  if (code < 1575) return ch == "ı" ? "𝚤" : ch == "ȷ" ? "𝚥" : ch;
  if (code > 1722) return ch;
  n = setsAr.indexOf(mathStyle);
  if (n == -1) return ch;
  if (code <= 1610) {
    code = abjad[code - 1575];
    if (code == -1) return ch;
  } else {
    code = dottedChars.indexOf(ch);
    if (code == -1) return ch;
    code += 28;
  }
  if (mathStyle == "misol") {
    if (code == 4) n = 1;
  } else if (1 << code & missingCharMask[n - 1]) return ch;
  return String.fromCodePoint(32 * n + code + 126464);
}
//#endregion
//#region mpadded/mpadded.js
/***
* Handles width/height/depth attributes with % values for mpadded
***/
/**
* @param {HTMLElement} mpadded
* @returns {{width:number, height: number: depth: number}}
*/
function getDimensions(mpadded) {
  const mrow = document.createElementNS(MATHML_NS, "mrow");
  mrow.appendChild(document.createElementNS(MATHML_NS, "mspace"));
  const cloneMpadded = cloneElementWithShadowRoot(mpadded);
  for (let i = 0; i < cloneMpadded.children.length; i++) mrow.appendChild(cloneMpadded.children[i]);
  cloneMpadded.appendChild(mrow);
  mpadded.parentElement.replaceChild(cloneMpadded, mpadded);
  const mspaceRect = mrow.firstElementChild.getBoundingClientRect();
  const mpaddedRect = mrow.getBoundingClientRect();
  cloneMpadded.parentElement.replaceChild(mpadded, cloneMpadded);
  return {
    width: mpaddedRect.width,
    height: mspaceRect.y - mpaddedRect.top,
    depth: mpaddedRect.bottom - mspaceRect.y
  };
}
/**
* @param {HTMLElement} el
* @param {string} attr
* @param {'width'|'height'|'depth'} dimension
* @param {{width:number, height: number: depth: number}} dimensions
* @returns {boolean}
*/
function replacePseudoAttr(el, attr, dimension, dimensions) {
  const attrValue = el.getAttribute(attr).toLowerCase();
  if (attrValue.includes(dimension)) {
    const floatVal = parseFloat(attrValue) * dimensions[dimension] / (attrValue.includes("%") ? 100 : 1);
    el.setAttribute(attr, floatVal.toFixed(1) + "px");
    return true;
  }
  return false;
}
/**
* @param {HTMLElement} el
* @param {attr} align
* @param {{width:number, height: number: depth: number}} dimensions
* @returns {boolean}       // true if handled
*/
function handleAttr(el, attr, dimensions) {
  if (!el.hasAttribute(attr)) return false;
  if (replacePseudoAttr(el, attr, "width", dimensions)) return true;
  if (replacePseudoAttr(el, attr, "height", dimensions)) return true;
  if (replacePseudoAttr(el, attr, "depth", dimensions)) return true;
  return false;
}
/**
* @param {HTMLElement} el 
*/

/**
* 
* @param {HTMLElement} mtable 
*/
function makeTableSquare(mtable) {
  return mtable;
}
/**
* 
* @param {HTMLElement} mtable 
*/
function handleLabeledRows(mtable) {
  if (mtable.getElementsByTagName("mlabeledtr").length === 0) return mtable;
  const side = mtable.getAttribute("side") || "right";
  let emptyColumnEntry = document.createElementNS(namespaceURI, "mtd");
  emptyColumnEntry.setAttribute("intent", ":no-equation-label");
  for (let i = 0; i < mtable.children.length; i++) {
    let row = mtable.children[i];
    if (row.tagName === "mlabeledtr") {
      let label = row.firstElementChild;
      addIntent(label);
      let newRow = document.createElementNS(namespaceURI, "mtr");
      for (const attr of row.attributes) newRow.setAttribute(attr.name, attr.value);
      let mtd = row.children[side == "left" ? 0 : 1];
      newRow.appendChild(mtd);
      while (row.children.length > 0) newRow.appendChild(row.firstChild);
      if (side === "right") newRow.appendChild(label);
      row.replaceWith(newRow);
    } else {
      const newColEntry = emptyColumnEntry.cloneNode();
      if (side === "right") row.appendChild(newColEntry);else row.insertBefore(newColEntry, row.firstElementChild);
    }
  }
  return mtable;
}
/**
* 
* @param {HTMLElement} mtd 
*/
function addIntent(mtd) {
  if (!mtd.hasAttribute("intent")) {
    mtd.setAttribute("intent", ":equation-label");
    return;
  }
  let intentValue = mtd.getAttribute("intent");
  let iOpenParen = intentValue.indexOf("(");
  let head = iOpenParen == -1 ? intentValue : intentValue.substring(0, iOpenParen);
  if (head.includes(":equation-label")) return;
  intentValue = head + ":equation-label" + intentValue.substring(head.length);
  mtd.setAttribute("intent", intentValue);
}
/**
* 
* @param {HTMLElement} mtable 
*/

/**
* Look first in the shadowRoot for the 'id'; if not found, check the whole document
* @param {string} id 
* @returns {Element | null}
*/
function getElementByIdEverywhere(id) {
  const found = shadowRoot.get().getElementById(id);
  if (found) return found;
  return document.getElementById(id);
}
/**
* Creates a new MathML element
* @param {string} tagName 
* @returns {Element}
*/
function newElement(tagName) {
  return document.createElementNS(MATHML_NS, tagName);
}
/**
* Copies the attributes from 'source' to 'target'
* 'target' is unchanged.
* @param {Element} target
* @param {Element} source 
* @returns {Element}       // target
*/
function copyAttributes(target, source) {
  const attrs = source.attributes;
  for (let i = 0; i < attrs.length; i++) target.setAttribute(attrs[i].name, attrs[i].value);
  return target;
}
/**
* Looks at 'element' and its ancestors to see if the value is set on an attr; if so, it is returned.
* @param {Element} element 
* @param {string} attrName 
* @param {string} defaultVal
* @returns {string} 
*/
function getMathMLAttrValueAsString(element, attrName, defaultVal) {
  let lookingForMathElement = true;
  do {
    if (element.hasAttribute(attrName)) return element.getAttribute(attrName);
    lookingForMathElement = element.tagName !== "math";
    element = element.parentElement;
  } while (lookingForMathElement);
  return defaultVal;
}
/**
* @returns {Element}
*/
function createLineBreakMTable() {
  const mtable = newElement("mtable");
  mtable.setAttribute(MTABLE_HAS_LINEBREAKS, "true");
  mtable.setAttribute("displaystyle", "true");
  return mtable;
}
/**
* 
* @param {Element} mtd 
* @returns {boolean}
*/
function isInLineBreakTable(mtd) {
  return mtd.tagName === "mtd" && mtd.parentElement.tagName === "mtr" && mtd.parentElement.parentElement.tagName === "mtable" && mtd.parentElement.parentElement.hasAttribute(MTABLE_HAS_LINEBREAKS);
}
/**
* 
* @param {Element} child 
* @returns {Element}
*/
function createNewTableRowWithChild(child) {
  const mtr = newElement("mtr");
  const mtd = newElement("mtd");
  mtd.appendChild(child);
  mtr.appendChild(mtd);
  return mtr;
}
/**
* 
* @param {Element} mo
* @param {'first' | 'middle' | 'last'}  firstMiddleOrLast
* @returns {Object}
*/
function computeIndentAttrObject(mo, firstMiddleOrLast) {
  const attrObject = {};
  let linebreakstyle = getMathMLAttrValueAsString(mo, "linebreakstyle", "before");
  if (linebreakstyle === "infixLineBreakStyle") linebreakstyle = getMathMLAttrValueAsString(mo, "infixLineBreakStyle", "before");
  attrObject.linebreakstyle = linebreakstyle;
  attrObject.indentAlign = getMathMLAttrValueAsString(mo, "indentalign", "auto");
  attrObject.indentShift = getMathMLAttrValueAsString(mo, "indentshift", "0px");
  if (firstMiddleOrLast == "first") {
    attrObject.indentAlign = getMathMLAttrValueAsString(mo, "indentalignfirst", attrObject.indentAlign);
    attrObject.indentShift = getMathMLAttrValueAsString(mo, "indentshiftfirst", attrObject.indentShift);
  } else if (firstMiddleOrLast === "last") {
    attrObject.indentAlign = getMathMLAttrValueAsString(mo, "indentalignlast", attrObject.indentAlign);
    attrObject.indentShift = getMathMLAttrValueAsString(mo, "indentshiftlast", attrObject.indentShift);
  }
  attrObject.indentShift = convertToPx(mo, attrObject.indentShift);
  attrObject.target = getMathMLAttrValueAsString(mo, "indenttarget", "");
  attrObject.firstMiddleOrLast = firstMiddleOrLast;
  return attrObject;
}
/**
* Stores the attrs used for indenting on the 'mtd' so they can be found easily later
* @param {Element} mtd
* @param {Element} mo
*/
function storeLineBreakAttrsOnMtd(mtd, mo) {
  /** @type {'first' | 'middle' | 'last'} */
  let firstMiddleOrLast = "middle";
  if (mtd.parentElement === mtd.parentElement.parentElement.firstElementChild) firstMiddleOrLast = "first";else if (mtd.parentElement === mtd.parentElement.parentElement.lastElementChild) firstMiddleOrLast = "last";
  mtd.setAttribute(INDENT_ATTRS, JSON.stringify(computeIndentAttrObject(mo, firstMiddleOrLast)));
}
/**
* Either create a new (linebreak) mtable with the new table row or if it already exists, add the row
* It exists if we stopped at a <mtd> and it is an mtable inserted for linebreaking purposes
* @param {Element} parent              // 'mtd' if stopped in existing table, otherwise some non-mrow element
* @param {Element} upToBreak           // the first part of the split line
* @param {Element} afterBreak          // the remainder of the current line
* @returns {Element}                   // the last row added to the table (one or two rows are created)
*/
function addNewLineBreakRow(parent, upToBreak, afterBreak) {
  const mtr = createNewTableRowWithChild(upToBreak);
  if (isInLineBreakTable(parent)) {
    copyAttributes(mtr.firstElementChild, parent);
    while (parent.attributes.length > 0) parent.removeAttributeNode(parent.attributes[0]);
    parent.parentElement.parentElement.insertBefore(mtr, parent.parentElement);
    return parent.parentElement;
  } else {
    const mtable = createLineBreakMTable();
    mtable.setAttribute("style", "width: 100%");
    mtable.appendChild(mtr);
    afterBreak.replaceWith(mtable);
    mtable.appendChild(createNewTableRowWithChild(afterBreak));
    return mtable.lastElementChild;
  }
}
/**
* Splits the line at the 'mo' -- at beginning/end of line depending on 'linebreakstyle'
* @param {Element} mo      // operator to split
* @returns {Element}       // the last row added to the table 
*/
function splitLine(mo) {
  let linebreakstyle = getMathMLAttrValueAsString(mo, "linebreakstyle", "before");
  if (linebreakstyle === "infixLineBreakStyle") linebreakstyle = getMathMLAttrValueAsString(mo, "infixLineBreakStyle", "before");
  let upToBreak = null;
  let breakElement = mo;
  if (mo.previousElementSibling !== null && mo.nextElementSibling !== null) mo.setAttribute("form", "infix");
  let parent = breakElement.parentElement;
  for (; parent.tagName === "mrow"; parent = parent.parentElement) {
    let newMRow = newElement("mrow");
    while (parent.firstElementChild) {
      const child = parent.firstElementChild;
      if (child === breakElement) {
        if (linebreakstyle === "after") {
          newMRow.appendChild(child);
          linebreakstyle = "before";
          break;
        } else if (linebreakstyle === "duplicate") {
          linebreakstyle = "before";
          newMRow.appendChild(child.cloneNode(true));
        }
        break;
      }
      newMRow.appendChild(child);
    }
    breakElement = parent;
    if (upToBreak) newMRow.appendChild(upToBreak);
    upToBreak = newMRow.children.length === 1 ? newMRow.firstElementChild : newMRow;
  }
  if (breakElement.tagName === "mrow" && breakElement.children.length === 1) {
    const newBreakElement = breakElement.firstElementChild;
    breakElement.replaceWith(newBreakElement);
    breakElement = newBreakElement;
  }
  return addNewLineBreakRow(parent, upToBreak, breakElement);
}
/**
* 
* @param {Element} mo 
* @returns {Element}
*/
function computeLineBreakRoot(mo) {
  let mrow = mo;
  let parent = mo.parentElement;
  while (parent.tagName === "mrow" || parent.tagName === "mstyle" || parent.tagName === "mpadded") {
    mrow = parent;
    parent = parent.parentElement;
  }
  return mrow;
}
/**
* Finds all the forced linebreaks, splits the lines, and stores the indent info on the 'mtd'
* @param {Element} math 
*/
function splitIntoLinesAtForcedBreaks(math, maxLineWidth) {
  const forcedBreakElements = math.querySelectorAll("mo[linebreak=\"newline\"]");
  if (forcedBreakElements.length === 0) return;
  /** @type {Element} */
  let lastRow = null;
  forcedBreakElements.forEach(mo => {
    lastRow = splitLine(mo);
  });
  const tableChildren = lastRow.parentElement.children;
  storeLineBreakAttrsOnMtd(tableChildren[0].firstElementChild, tableChildren[0].firstElementChild);
  for (let i = 0; i < forcedBreakElements.length; i++) storeLineBreakAttrsOnMtd(tableChildren[i + 1].firstElementChild, forcedBreakElements[i]);
}
/**
* Returns true if first line of math
* @param {Element} mtr
* returns {boolean}
*/
function isFirstRow(mtr) {
  return mtr === mtr.parentElement.firstElementChild;
}
/**
* Find the leftMostChild not counting an mspace
* @param {Element} element 
*/
function leftMostChild(element) {
  while (element.children.length > 0) element = element.firstElementChild;
  return element.tagName == "mspace" ? element.nextElementSibling : element;
}
function isMatchLessThanHalfWay(xStart, indent, maxWidth) {
  return indent - xStart <= .5 * maxWidth;
}
/**
* Return the operators that match 'char'. For the match, "+"/"-" match each other 
* @param {Element[]} operators 
* @param {string} char 
* @returns {Element[]}
*/
function filterOnCharMatch(operators, char) {
  if (char === "-") char = "+";
  return operators.filter(function (operator) {
    let opChar = operator.textContent.trim();
    if (opChar === "-") opChar = "+";
    return char === opChar;
  });
}
/**
* Look through all the previous lines and find a good indent 
* Potential breakpoints are those 'mo's at the same depth as the 'mo' that starts the current line
* Preference is given to an 'mo' with the same char (i.e, if we have a '+', find another '+' at the same depth).
* Of those 'mo' that match, the one with the minimum amount of indent is chosen so that more fits on that line.
* @param {Element} mtd
* @returns {number}
*/
function computeAutoShiftAmount(mtd) {
  if (isFirstRow(mtd.parentElement)) return 0;
  const mo = leftMostChild(mtd);
  if (!mo.hasAttribute(ELEMENT_DEPTH)) console.log(`Linebreaking error: depth not set on ${mo.tagName} with content '${mo.textContent.trim()}'`);
  const moDepth = mo.getAttribute(ELEMENT_DEPTH);
  const moChar = mo.textContent.trim();
  let minIndentAmount = 1e21;
  let operatorMatched = false;
  const xStart = mtd.getBoundingClientRect().left;
  const maxWidth = parseFloat(mtd.parentElement.parentElement.getAttribute(MTABLE_LINEBREAKS_ATTR));
  let previousLine = mtd.parentElement.previousElementSibling;
  while (previousLine) {
    const previousLineOperators = getAllBreakPoints(previousLine.firstElementChild).filter(operator => moDepth === operator.getAttribute(ELEMENT_DEPTH));
    previousLineOperators.length === 0 || previousLineOperators[0].textContent.trim();
    const previousLineMatches = filterOnCharMatch(previousLineOperators, moChar);
    let indent = previousLineMatches.length === 0 ? minIndentAmount : previousLineMatches[0].getBoundingClientRect().left;
    if (isMatchLessThanHalfWay(xStart, indent, maxWidth)) {
      if (indent < minIndentAmount || !operatorMatched) {
        operatorMatched = true;
        minIndentAmount = indent;
      }
    }
    indent = previousLineOperators.length === 0 ? minIndentAmount : previousLineOperators[0].getBoundingClientRect().left;
    if (!operatorMatched && isMatchLessThanHalfWay(xStart, indent, maxWidth)) minIndentAmount = Math.min(indent, minIndentAmount);
    previousLine = previousLine.previousElementSibling;
  }
  if (minIndentAmount == 1e21) return convertToPx(mo, FALLBACK_INDENT_AMOUNT);
  return minIndentAmount - xStart;
}
/**
* Adds shift amounts to the mtd
* The amount is finalized in a pass after linebreaking.
* It is not done now because center/right alignment positioning would mess up linebreaking
* @param {Element} mtd
* @param {string} alignment    // should be one of 'left'|'center'|'right'
* @param {number} shiftAmount 
*/
function setupLineShifts(mtd, alignment, shiftAmount) {
  mtd.setAttribute("style", `text-align: ${alignment};`);
  const mspace = newElement("mspace");
  mspace.setAttribute("width", shiftAmount.toString() + "px");
  mtd.setAttribute(INDENT_AMOUNT, shiftAmount.toString());
  if (mtd.children.length !== 1 || mtd.firstElementChild.tagName !== "mrow") {
    console.log(`unexpected element '${mtd.firstElementChild.tagName}' encountered while trying to indent line`);
    return;
  }
  const mrow = mtd.firstElementChild;
  if (alignment === "right") mrow.appendChild(mrow);else mrow.insertBefore(mspace, mrow.firstElementChild);
}
/**
* Return the amount of indent that should happen if we break on 'mo'
* @param {Element} mo          // mo or mtd
* @param {number} xLineStart 
* @param {Object} indentAttrs 
* @returns {number}
*/
function computeIndentAmount(mo, xLineStart, indentAttrs) {
  let indentShiftAsPx = parseFloat(indentAttrs.indentShift);
  let indentAlign = indentAttrs.indentAlign;
  if (indentAlign === "id") {
    const elementWithID = getElementByIdEverywhere(indentAttrs.target);
    if (elementWithID) return elementWithID.getBoundingClientRect().left - xLineStart + indentShiftAsPx;
    indentAlign = "auto";
  }
  if (indentAlign == "auto") {
    if (indentAttrs.firstMiddleOrLast !== "first") {
      while (mo.tagName !== "mtd" && !mo.parentElement.parentElement.hasAttribute(MTABLE_HAS_LINEBREAKS)) mo = mo.parentElement;
      indentShiftAsPx += computeAutoShiftAmount(mo);
    }
  }
  return indentShiftAsPx;
}
/**
* Indent the line
* @param {Element} mtd 
*/
function indentLine(mtd) {
  if (mtd.hasAttribute(INDENT_AMOUNT)) return;
  const indentAttrs = JSON.parse(mtd.getAttribute(INDENT_ATTRS));
  const xLineStart = mtd.getBoundingClientRect().left;
  let indentShiftAsPx = computeIndentAmount(mtd, xLineStart, indentAttrs);
  let indentAlign = indentAttrs.indentAlign;
  if (indentAlign === "id") {
    if (getElementByIdEverywhere(indentAttrs.target) && !mtd.querySelector("#" + indentAttrs.target)) {
      setupLineShifts(mtd, "left", indentShiftAsPx);
      return;
    }
    indentAlign = "auto";
  }
  if (indentAlign == "auto") indentAlign = "left";
  setupLineShifts(mtd, indentAlign, indentShiftAsPx);
}
/**
* Returns the outermost embellishment of an 'mo'
* @param {Element} mo 
* @returns {Element}
*/
function expandToEmbellishedElement(mo) {
  let el = mo;
  let parent = mo.parentElement;
  do {
    if (parent.firstElementChild !== mo || !EMBELLISHED_ELEMENT_NAMES.includes(parent.tagName)) {
      if (el !== mo) {
        if (!mo.hasAttribute(ELEMENT_DEPTH)) console.log(`Linebreaking error: depth not set on ${mo.tagName} with content '${mo.textContent.trim()}'`);
        el.setAttribute(ELEMENT_DEPTH, mo.getAttribute(ELEMENT_DEPTH));
      }
      return el;
    }
    el = parent;
    parent = parent.parentElement;
  } while (parent);
  console.log(`In linebreaking in expandToEmbellishedElement: unexpected loop termination. mo = '${mo.tagName}'`);
  return mo;
}
/**
* Return all the potential break points inside 'element' (math or mtd)
* @param {Element} element 
* @returns {Element[]}
*/
function getAllBreakPoints(element) {
  return Array.from(element.querySelectorAll("mo:not([linebreak=\"nobreak\"])")).filter(mo => {
    do mo = mo.parentElement; while (mo.tagName === "mrow" || mo.tagName === "mstyle" || mo.tagName === "mpadded");
    return mo.tagName === "math" || isInLineBreakTable(mo);
  }).map(mo => expandToEmbellishedElement(mo));
}
/**
* 
* @param {string} ch 
* @returns number
*/
function operatorPrecedence(ch) {
  const precedence = PrecedenceTable[ch];
  if (precedence === void 0) return 40;
  return precedence;
}
/**
* 
* @param {Element} el 
* @returns {Element}
*/
function getEmbellishedOperator(el) {
  if (el.tagName === "mo") return el;
  let firstChild = el;
  while (EMBELLISHED_ELEMENT_NAMES.includes(firstChild.tagName)) {
    firstChild = firstChild.firstElementChild;
    if (!firstChild) return el;
  }
  return firstChild.tagName === "mo" ? firstChild : el;
}
/**
* 
* @param {[any]} stack
* @returns {any}
*/
function top(stack) {
  return stack[stack.length - 1];
}
/**
* 
* @param {[] | Element} elementStackEntry 
* @returns {boolean}
*/
function isOperand(elementStackEntry) {
  return Array.isArray(elementStackEntry);
}
/**
* 
* @param {string} mo
* @returns {boolean}
*/
function isPrefix(mo) {
  return OpenList.includes(mo);
}
/**
* The "reduce" step of parsing.
* @param {[number]} opStack
* @param {[Element | [Element]]} elementStack
* @param {number} childPrecedence
* @returns {[[number], [Element | [Element]]}

*/
function parseReduce(opStack, elementStack, childPrecedence) {
  let stackPrecedence = top(opStack);
  let previousStackPrecedence = stackPrecedence + 1;
  while (childPrecedence < stackPrecedence) {
    let iPopTo = elementStack.length - 1;
    while (Array.isArray(elementStack[iPopTo])) iPopTo--;
    iPopTo--;
    opStack.pop();
    while (Array.isArray(elementStack[iPopTo])) iPopTo--;
    const elementsPopped = elementStack.splice(iPopTo + 1);
    if (stackPrecedence === previousStackPrecedence && Array.isArray(top(elementsPopped))) {
      const lastElement = elementsPopped.pop();
      elementStack.push(elementsPopped.concat(lastElement));
    } else elementStack.push(elementsPopped);
    previousStackPrecedence = stackPrecedence;
    stackPrecedence = top(opStack);
  }
  return [opStack, elementStack];
}
function addInvisibleFunctionApply(opStack, elementStack) {
  const childPrecedence = operatorPrecedence(InvisibleFunctionApply);
  [opStack, elementStack] = parseReduce(opStack, elementStack, childPrecedence);
  opStack.push(childPrecedence);
  elementStack.push(InvisibleFunctionApplyMo);
}
/**
* @param {Element} treeRoot 
* @param {[number]} opStack
* @param {[Element | [Element]]} elementStack
* @returns {[[number], [Element | [Element]]}
*/
function buildParseTree(treeRoot, opStack, elementStack) {
  for (let i = 0; i < treeRoot.children.length; i++) {
    const child = getEmbellishedOperator(treeRoot.children[i]);
    if (child.tagName === "mo") {
      const childCh = child.textContent.trim();
      if (isOperand(top(elementStack)) && isPrefix(childCh)) addInvisibleFunctionApply(opStack, elementStack);
      if (isPrefix(childCh)) {
        opStack.push(0);
        elementStack.push(child);
      } else if (CloseList.includes(childCh)) {
        [opStack, elementStack] = parseReduce(opStack, elementStack, 0);
        elementStack.push(child);
        if (top(opStack) !== 0) console.log(`In linebreaking, parsing error with close char -- top of op stack is ${top(opStack)}`);
        opStack.pop();
        const elementsPopped = elementStack.splice(elementStack.length - 3);
        elementStack.push(elementsPopped);
      } else {
        const childPrecedence = operatorPrecedence(childCh);
        [opStack, elementStack] = parseReduce(opStack, elementStack, childPrecedence);
        opStack.push(childPrecedence);
        elementStack.push(child);
      }
    } else if (child.tagName === "mrow" || child.tagName === "mpadded" || child.tagName === "mstyle") [opStack, elementStack] = buildParseTree(child, opStack, elementStack);else {
      if (isOperand(top(elementStack))) addInvisibleFunctionApply(opStack, elementStack);
      elementStack.push([child]);
    }
  }
  return [opStack, elementStack];
}
/**
* Store nesting depth info for each 'mo' as an attr. Depth is based on depth in tree of arrays
* @param {[Element | [Element]]} elementStack
* @param {number} depth
*/
function setDepthAttr(elementStack, depth) {
  elementStack.forEach(child => {
    if (Array.isArray(child)) setDepthAttr(child, depth + 1);else if (child.tagName === "mo") child.setAttribute(ELEMENT_DEPTH, depth.toString());
  });
}
/**
* Tries to determine if there is good mrow structure. If so returns true.
* @param {Element} mrow
* @returns {boolean}
*/
function isMRowWellStructured(mrow) {
  if (mrow.childElementCount <= 3) return true;
  if (mrow.childElementCount % 2 === 0) return false;
  const precedence = operatorPrecedence(mrow.children[1].textContent.trim());
  for (let i = 0; i < mrow.childElementCount - 1; i += 2) if (mrow.children[i].tagName === "mo" || mrow.children[i + 1].tagName !== "mo" || operatorPrecedence(mrow.children[i + 1].textContent.trim()) !== precedence) return false;
  return true;
}
/**
* Tries to determine if there is good mrow structure. If so returns true.
* @param {Element} treeRoot
* @returns {boolean}
*/
function isWellStructured(treeRoot) {
  const mrows = Array.from(treeRoot.querySelectorAll("mrow"));
  if (treeRoot.tagName === "mrow" || treeRoot.tagName === "math") mrows.push(treeRoot);
  switch (mrows.length) {
    case 0:
      return true;
    case 1:
      return isMRowWellStructured(mrows[0]);
    case 2:
      return isMRowWellStructured(mrows[0]) && isMRowWellStructured(mrows[1]);
    default:
      return isMRowWellStructured(mrows[0]) && isMRowWellStructured(mrows[Math.floor(mrows.length / 2)]) && isMRowWellStructured(mrows[mrows.length - 1]);
  }
}
/**
* Store nesting depth info for each 'mo' as an attr. Depth is based on depth in tree
* @param {Element} el
* @param {number} depth
*/
function setDepthAttrBasedOnOriginalTree(el, depth) {
  const embellishedOp = getEmbellishedOperator(el);
  if (embellishedOp.tagName === "mo") {
    embellishedOp.setAttribute(ELEMENT_DEPTH, depth.toString());
    return;
  }
  if (el.tagName === "mrow" || el.tagName === "mstyle" || el.tagName === "mpadded" || el.tagName === "math") for (let i = 0; i < el.childElementCount; i++) setDepthAttrBasedOnOriginalTree(el.children[i], depth + (el.tagName === "mrow" ? 1 : 0));
}
/**
* Store nesting depth info for each 'mo' as an attr
* @param {Element} linebreakRoot 
*/
function addDepthInfo(linebreakRoot) {
  /** @type {Element[]} */
  let linebreakRoots = [];
  const linebreakElements = Array.from(linebreakRoot.querySelectorAll("mo[linebreak=\"newline\"]"));
  linebreakElements.push(linebreakRoot);
  linebreakElements.forEach(mo => {
    const linebreakRoot = computeLineBreakRoot(mo);
    if (!linebreakRoots.includes(linebreakRoot)) {
      linebreakRoots.push(linebreakRoot);
      if (isWellStructured(linebreakRoot)) setDepthAttrBasedOnOriginalTree(linebreakRoot, 0);else {
        let [opStack, elementStack] = buildParseTree(linebreakRoot, [-1], [null]);
        if (elementStack.length != 2) [opStack, elementStack] = parseReduce(opStack, elementStack, -1);
        setDepthAttr(elementStack[1], 0);
      }
    }
  });
}
/********* linebreaking penalty computation *******/
/**
* Used in penalty computation; 0 <= x <= max
* @param {number} x 
* @param {number} xMax
* @returns {number}
*/
function computeLineFillPenalty(x, xMax) {
  const penalty = (LINE_FILL_TARGET * xMax - x) / xMax;
  return penalty * penalty;
}
/**
* Used in penalty computation
* @param {Element} mo
* @returns {number}
*/
function computeDepthPenalty(mo) {
  const depthTable = [.05, .090909, .173554, .248685, .316987, .379079, .435526, .486842, .533493, .575902, .614457, .649506, .681369, .710336, .736669, .760608];
  if (!mo.hasAttribute(ELEMENT_DEPTH)) console.log(`Linebreaking error: depth not set on ${mo.tagName} with content '${mo.textContent.trim()}'`);
  let depth = parseInt(mo.getAttribute(ELEMENT_DEPTH));
  return depth >= depthTable.length ? 1 - 3.482066 / depth : depthTable[depth];
}
/**
* Computes a penalty based on % line filled, depth in the syntax tree, and whether the user indicated a break here is good/bad
* @param {Element} mo 
* @param {number } x 
* @param {number} xMax 
* @returns {number}
*/
function computePenalty(mo, x, xMax) {
  const penalty = DEPTH_PENALTY_TO_FILL_PENALTY_RATIO * computeDepthPenalty(mo) + computeLineFillPenalty(x, xMax);
  const linebreakAttrVal = getMathMLAttrValueAsString(mo, "linebreak", "auto");
  if (linebreakAttrVal === "goodbreak") return penalty / GOOD_PENALTY_SCALE_FACTOR;else if (linebreakAttrVal === "badbreak") return BAD_PENALTY_SCALE_FACTOR * penalty;else return penalty;
}
/**
* Handles substitution of char if InvisibleTimes ('linebreakmultchar' mo attr)
* The array is modified and the node replaced in the DOM
* @param {Element[]} potentialBreaks
* @param {number} index                           // index of char in  
* @returns {Element}                              // the mo @index or it's replacement
*/
function substituteCharIfNeeded(potentialBreaks, index) {
  const mo = potentialBreaks[index];
  if (mo.textContent.trim() === "⁢") {
    const replaceChar = getMathMLAttrValueAsString(mo, "linebreakmultchar", "⁢");
    if (replaceChar !== "⁢") {
      const replacementMO = newElement("mo");
      replacementMO.textContent = replaceChar;
      copyAttributes(replacementMO, mo);
      mo.replaceWith(replacementMO);
      potentialBreaks[index] = replacementMO;
      return replacementMO;
    }
  }
  return mo;
}
/**
* The entry point to linebreaking
* @param {Element} element             // <math> or <mtd> (if previously split due to manual linebreak)
* @param {number} maxLineWidth
*/
function linebreakLine(element, maxLineWidth) {
  if (parseFloat(element.getAttribute(FULL_WIDTH)) <= maxLineWidth) return;
  const potentialBreaks = getAllBreakPoints(element);
  let lineBreakMO;
  /** @type {Element} */
  let lastRow = element.tagName === "mtd" ? element.parentElement : element.parentNode;
  let nLines = 0;
  let iOperator = 1;
  while (iOperator < potentialBreaks.length) {
    let iLine = iOperator;
    const firstMTD = element.tagName === "mtd" ? lastRow.firstElementChild : lastRow.lastElementChild;
    const indentAttrs = JSON.parse(firstMTD.getAttribute(INDENT_ATTRS));
    const leftSide = indentAttrs.linebreakstyle === "before" ? potentialBreaks[iOperator - 1].getBoundingClientRect().left : firstMTD.firstElementChild.getBoundingClientRect().left;
    const lineBreakWidth = maxLineWidth - computeIndentAmount(potentialBreaks[iOperator - 1], firstMTD.getBoundingClientRect().left, indentAttrs);
    let minPenalty = 1e5;
    let iMinPenalty = -1;
    while (iLine < potentialBreaks.length) {
      const xRelativePosition = potentialBreaks[iLine].getBoundingClientRect().right - leftSide;
      if (xRelativePosition > lineBreakWidth) break;
      const penalty = computePenalty(potentialBreaks[iLine], xRelativePosition, lineBreakWidth);
      if (penalty <= minPenalty) {
        minPenalty = penalty;
        iMinPenalty = iLine;
      }
      iLine++;
    }
    if (iMinPenalty === -1) {
      console.log(`Linebreaking error: no breakpoint found on line ${nLines + 1}`);
      iMinPenalty = iOperator;
    }
    nLines++;
    iOperator = iMinPenalty + 1;
    if (iOperator < potentialBreaks.length) {
      lineBreakMO = substituteCharIfNeeded(potentialBreaks, iMinPenalty);
      lastRow = splitLine(potentialBreaks[iMinPenalty]);
      lastRow.parentElement.setAttribute(MTABLE_LINEBREAKS_ATTR, maxLineWidth.toString());
      storeLineBreakAttrsOnMtd(lastRow.firstElementChild, lineBreakMO);
      const previousRow = lastRow.previousElementSibling;
      if (!previousRow.firstElementChild.hasAttribute(INDENT_ATTRS)) previousRow.firstElementChild.setAttribute(INDENT_ATTRS, element.getAttribute(INDENT_ATTRS));
      indentLine(previousRow.firstElementChild);
    } else if (nLines === 1) return;
  }
  if (nLines > 0) indentLine(lastRow.firstElementChild);
}
/**
* Linebreak/indent display math
* There is no good target in core, so the following hack is used if linebreaking is needed:
* 1. The custom element 'math-with-linebreaks' is created as the parent of 'math' if it isn't already there.
* 2. A clone is made and added into the shadow DOM (avoids duplicate 'id' problems)
* 3. A marked <mtable> is created at the appropriate point (typically a child of <math>) and each line of the math is a row in the table
* 
* On resize, we throw out the old shadow and start from fresh with a clone of the <math> element. 
* 
* Since most math doesn't need to be linebroken, we start with a quick check to see if there are forced linebreaks or if it is wide.
* @param {HTMLElement} math 
*/

/**
* The main starting point
* @param {Element} customElement        // <math> (likely inside a shadow DOM)
* @param {number} maxLineWidth
*/
function lineBreakDisplayMath(customElement, maxLineWidth) {
  maxLineWidth = Math.min(maxLineWidth, parseFloat(customElement.getAttribute(FULL_WIDTH)));
  const math = customElement.shadowRoot.lastElementChild;
  if (math.childElementCount > 1) {
    const mrow = newElement("mrow");
    while (math.firstElementChild) mrow.appendChild(math.firstElementChild);
    math.appendChild(mrow);
  }
  shadowRoot.set(customElement.shadowRoot);
  splitIntoLinesAtForcedBreaks(math, maxLineWidth);
  let linebreakGroups = Array.from(math.querySelectorAll(`mtable[${MTABLE_HAS_LINEBREAKS}]`));
  if (linebreakGroups.length > 0) linebreakGroups.forEach(table => {
    table.setAttribute(MTABLE_LINEBREAKS_ATTR, maxLineWidth.toString());
    Array.from(table.children).forEach(line => {
      const mtd = line.firstElementChild;
      indentLine(mtd);
      if (mtd.firstElementChild.getBoundingClientRect().right - mtd.getBoundingClientRect().left > maxLineWidth) linebreakLine(mtd, maxLineWidth);
    });
  });else if (parseInt(customElement.getAttribute(FULL_WIDTH)) >= maxLineWidth) {
    math.setAttribute(INDENT_ATTRS, JSON.stringify(computeIndentAttrObject(math, "first")));
    linebreakLine(math, maxLineWidth);
  }
}
/**
* 
* @param {Element} customElement 
* @param {Element} math 
*/
function setShadowRootContents(customElement, math) {
  /** @type {HTMLElement} */
  const mathClone = cloneElementWithShadowRoot(math);
  customElement.shadowRoot.appendChild(mathClone);
  let fullWidth = mathClone.lastElementChild.getBoundingClientRect().right - mathClone.firstElementChild.getBoundingClientRect().left;
  if (mathClone.hasAttribute("maxwidth")) fullWidth = Math.min(fullWidth, convertToPx(mathClone, mathClone.getAttribute("maxwidth")));
  customElement.setAttribute(FULL_WIDTH, fullWidth.toString());
  lineBreakDisplayMath(customElement, fullWidth);
  customElement.setAttribute(LINE_BREAK_WIDTH, (2 * fullWidth).toString());
}
function addCustomElement(math) {
  const computedStyle = getComputedStyle(math).getPropertyValue("display");
  const displayValue = math.hasAttribute("display") ? math.getAttribute("display") : "inline";
  if (computedStyle === "inline" || displayValue === "inline") return null;
  if (math.tagName.toLowerCase() === SHADOW_ELEMENT_NAME) return math;else if (math.parentElement.tagName.toLowerCase() === SHADOW_ELEMENT_NAME) return math;else {
    const mathParent = math.parentElement;
    const nextSibling = math.nextElementSibling;
    const shadowHost = document.createElement(SHADOW_ELEMENT_NAME);
    shadowHost.appendChild(math);
    mathParent.insertBefore(shadowHost, nextSibling);
    addDepthInfo(math);
    setShadowRootContents(shadowHost, math);
    return null;
  }
}
{
  let UAStyle = document.createElement("style");
  UAStyle.innerHTML = `
           math-with-linebreaks {
                display: block;
            }
    `;
  document.head.insertBefore(UAStyle, document.head.firstElementChild);
}

//#endregion
//#region href/href.js
/***
* Make href work on all MathML elements by adding click, mouseover,
* and mouseout events
***/
/**
* @param {MathMLElement} el 
*/

//#endregion
export { _MathTransforms };