import { ELEMENT_NODE, TEXT_NODE } from '../Parser/constant';
import jsonToArray from './jsonToArray';
import getStruct from './getStruct';

const tpl = (n, attr, html) => `<${n.nodeName}${attr}>${html}</${n.nodeName}>`;
const singleTpl = (n, attr) => `<${n.nodeName}${attr}/>`

const outputHTML = function(struct, elements, texts) {
  const n = getStruct(struct, elements, texts);
  const attributes = jsonToArray(n.attributes);
  const children = struct.children;

  if (n.nodeType === ELEMENT_NODE) {
    const attr = attributes.length > 0 ? ` ${attributes.join(' ')}` : '';

    if(n.single){
      return singleTpl(n, attr)
    }else{
     const html = (children.map(child => outputHTML(child, elements, texts))).join('');
     return tpl(n, attr, html);
    }
  } else if (n.nodeType === TEXT_NODE) {
    return n.text;
  }
}

export default outputHTML;
