import createStructId from '../../../common/createStructId';
import hasTag from '../../../common/hasTag';
import hasEndTag from '../../../common/hasEndTag';
import hasSingleTag from '../../../common/hasSingleTag';
import statement from '../statement';

const fragmentize = function(str) {
  const expression = /[\w_]+\="[^\=""]{0,}"/ig;
  const placeholder = /\{[^\{\}]{0,}\}/ig;
  const placeholders = str.match(placeholder);
  const debris = str.match(expression);

  let tagName = str.replace(expression, '');
  tagName = tagName.replace(placeholder, '');
  tagName = tagName.replace(/[<>\/\s\{\}\$]+/g, '');

  return {
    tagName,
    attributes: debris ? debris : [],
    grammar: placeholders ? placeholders : []
  }
}

const format = (code, str) => ({
  symbol: str, // 字符集
  type: hasTag(str) ? 'element' : 'text', // 节点类型
  point: { // 占位点
    start: code + 1 - str.length, // 起点
    end: code // 结点
  }
})

export default function(code, str) { // 创建结构体
  const struct = format(code, str);
  const debris = fragmentize(str); // 字符碎片
  const {point} = struct;

  struct.id = createStructId(point); // 结构体Id
  struct.grammar = debris.grammar; // 语句
  struct.parseGrammar = [];
  struct.grammar.map(sentence => {
    struct.parseGrammar.push(statement(sentence.replace(/[\{\}\$]+/g, '')));
  });

  if (struct.type !== 'element') {
    return struct;
  }

  struct.hasSingleTag = hasSingleTag(str); // 是否为单标记
  struct.hasEndTag = hasEndTag(str); // 是否为结束标记
  struct.name = debris.tagName; // 标签名称

  if (!struct.hasEndTag) {
    struct.attributes = debris.attributes; // 添加属性
  }

  return struct;
}
