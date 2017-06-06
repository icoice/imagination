import createStructId from '../../common/createStructId';
import hasTag from '../../common/hasTag';
import hasEndTag from '../../common/hasEndTag';
import hasSingleTag from '../../common/hasSingleTag';
import fragmentize from '../../common/fragmentize';

// 创建结构体
export default function(code, str) {
  const struct = {
    // 字符集
    symbol: str,
    // 节点类型
    type: hasTag(str) ? 'element' : 'text',
    // 占位点
    point: {
      start: code + 1 - str.length,
      end: code
    }
  };
  const {point} = struct;

  // 结构体Id
  struct.id = createStructId(point);

  // 字符碎片
  const debris = fragmentize(str);

  struct.grammar = debris.grammar;
  struct.parseGrammer = {}

  struct.grammar.map(statement => {
    let defVal = null

    statement = statement.replace(/[\\$\\{\\}]+/g, '');

    let key = statement

    //三元运算符
    if (/[\w\d\s]+\?[\w\d\s]+:[\w\d\s]+/.test(statement)) {
      key = statement.replace(/\s/g, '').split('?');
      defVal = key[1].split(':');
      defVal[0] = {
        key: defVal[0],
        value: defVal[0]
      }
      defVal[1] = {
        key: defVal[1],
        value: defVal[1]
      }
      key = key[0];
    }

    //对象
    if (/\w[\w\d\s$_]\.[\w\s\d\._$]+/g.test(statement)) {
      key = statement.split('.');
      defVal = {
        chain: key.slice(1, key.length),
        value: null
      }
      key = key.shift()
    }

    if (/^[\w\$_]{1}[\w\d]*$/.test(key)) {
      struct.parseGrammer[key] = defVal
    }
  });

  console.log(struct.parseGrammer)

  if (struct.type !== 'element') {
    return struct;
  }

  //是否为单标记
  struct.hasSingleTag = hasSingleTag(str);
  //是否为结束标记
  struct.hasEndTag = hasEndTag(str);

  struct.name = debris.tagName;

  // 非结束标签
  if (!struct.hasEndTag) {
    struct.attributes = debris.attributes;
  }

  return struct;
}
