import hasObject from '../common/hasObject';
import hasClose from '../common/hasClose';
import tokenize from './src/tokenize';
import _toString from './src/toString';

/**
 * 解构程序
 * 用于解析出html的结构体
 */
let struct_id = 0;

export default class Parser {

  constructor(context) {
    if (!hasObject(context) && !hasClose(context)) {
      throw '[virtualDom Parser] it\'s not a close tag.';
    }

    this.structId = `_struct_id_${struct_id++}`;
    this.parts = hasClose(context) ? tokenize(context) : context;
    console.log(this.parts);
  }

  string(state = {}) {
    const {tree, elements, texts} = this.parts;

    return _toString(
      tree,
      {
        elements,
        texts
      },
      state);
  }
}
