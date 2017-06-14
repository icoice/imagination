import hasObject from '../common/hasObject';
import hasClose from '../common/hasClose';
import outputHtml from '../common/outputHtml';
import tokenize from './tokenize';

let struct_id = 0;

/**
 * 解构程序
 * 用于解析出html的结构体
 */
export default class Parser {

  constructor(context) {
    // 是否为封闭标签
    if (!hasObject(context) && !hasClose(context)) {
      throw '[virtualDom Parser] it\'s not a close tag.';
    }
    this.structId = `_struct_id_${struct_id++}`;
    this.parts = hasClose(context) ? tokenize(context) : context;
  }

  string(state = {}) {
    const {tree, elements, texts} = this.parts;
    return outputHtml(tree, elements, texts, state);
  }
}
