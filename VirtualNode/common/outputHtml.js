import { ELEMENT_NODE, TEXT_NODE } from '../Parser/constant';
import jsonToArray from './jsonToArray';
import getStruct from './getStruct';

const singleTpl = (n, attr) => `<${n.nodeName}${attr}/>`
const tpl = (n, attr, html) => `<${n.nodeName}${attr}>${html}</${n.nodeName}>`
const outputHTML = function(struct, elements, texts, state) {
  const n = getStruct(struct, elements, texts);
  const {children} = struct;
  const {text} = n;
  const attributes = jsonToArray(n.attributes);

  // 元素节点
  if (n.nodeType === ELEMENT_NODE) {
    const attr = attributes.length > 0 ? ` ${attributes.join(' ')}` : ''
    if (n.single) {
      return singleTpl(n, attr);
    } else {
      const html = (children.map(child => outputHTML(
        child,
        elements,
        texts,
        state))).join('');

      return tpl(n, attr, html);
    }
  // 文本节点
  } else if (n.nodeType === TEXT_NODE) {
    return text;
  }
}

export default outputHTML;
