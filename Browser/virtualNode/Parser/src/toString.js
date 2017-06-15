import { ELEMENT_NODE, TEXT_NODE } from '../constant';
import escapeCharacter from '../../common/escapeCharacter';
import hasUndefined from '../../common/hasUndefined';
import jsonToArray from '../../common/jsonToArray';
import getStruct from '../../common/getStruct';
import counter from './statement/counter';
import each from '../../common/each';

const singleTag = (n, attr) => `<${n.nodeName}${attr}/>`;
const tag = (n, attr, html) => `<${n.nodeName}${attr}>${html}</${n.nodeName}>`;

const processGrammer = function(n, state) {
  if (!n.grammerResult) {
    n.grammerResult = [];
  }
  const {grammar, parseGrammar} = n;
  parseGrammar.map(struct => {
    n.grammerResult.push(counter(struct, state));
  });
  return function(str) {
    if (str === '' || !str) return str;
    grammar.map((expression, code) => {
      const reg = new RegExp(escapeCharacter(expression), 'g');
      const res = n.grammerResult[code];
      str = str.replace(reg, hasUndefined(res) ? '' : res);
    });
    return str;
  }
}

const _toString = function(struct, structure, state) {
  const n = getStruct(struct, structure);
  const attributes = jsonToArray(n.attributes);
  const readGrammer = processGrammer(n, state);
  const {children} = struct;
  const {nodeType, single} = n;
  let {text} = n;

  if (nodeType === ELEMENT_NODE) {
    // 元素节点
    let attr = attributes.length > 0 ? ` ${attributes.join(' ')}` : '';
    attr = readGrammer(attr);
    if (single) {
      return singleTag(n, attr);
    } else {
      return tag(n, attr, children.map(child => {
        return _toString(child, structure, state);
      }).join(''));
    }
  } else if (nodeType === TEXT_NODE) {
    // 文本节点
    return readGrammer(text);
  }
}

export default _toString;
