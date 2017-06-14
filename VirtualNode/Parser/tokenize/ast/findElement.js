import arrayToString from '../../../common/arrayToString';
import arrayToJson from '../../../common/arrayToJson';
import { ELEMENT_NODE } from '../../constant';

// 找到层级最小的开始标签
function findMinimuStartTag(structure) {
  let start;
  let tagCode;

  structure.map((struct, code) => {
    if (struct.type !== 'element' || struct.hasEndTag) {
      return;
    }
    if (!start) {
      start = struct;
      tagCode = code;
      return;
    }

    const minScope = parseInt(`${start.point.start}${start.point.end}`);
    const scope = parseInt(`${struct.point.start}${struct.point.end}`);

    // 范围值越大，层级越小
    if (minScope < scope) {
      start = struct;
      tagCode = code;
    }
  });

  return {
    start,
    startCode: tagCode
  };
}

// 找到层级最小的结束标签, 条件是找到最小的开始标签
function findMinimuEndTag(structure, start) {
  let end;
  let tagCode;

  structure.map((struct, code) => {
    if (struct.type !== 'element' || !struct.hasEndTag) {
      return;
    }
    if (start.name !== struct.name) {
      return;
    }
    if (!end) {
      end = struct;
      tagCode = code;
      return;
    }

    const scope = parseInt(`${end.point.start}${end.point.end}`);
    const minScope = parseInt(`${struct.point.start}${struct.point.end}`);
    const startScope = parseInt(`${start.point.start}${start.point.end}`);

    // 范围值越大，层级越小
    if (minScope < scope && startScope < minScope) {
      end = struct;
      tagCode = code;
    }
  });

  return {
    end,
    endCode: tagCode
  };
}

// 找到完整的元素
const findElement = function(structure, elements) {
  const {start, startCode} = findMinimuStartTag(structure);

  let end;
  let endCode;

  if (start.hasSingleTag) {
    end = start;
    endCode = startCode;
  } else {
    const result = findMinimuEndTag(structure, start);
    end = result.end;
    endCode = result.endCode;
  }

  if (!end) {
    throw 'Can\'t not find end tag.';
  }

  const id = `TAG_${start.point.start}${end.point.end}`;

  elements[id] = {
    nodeName: start.name,
    nodeType: ELEMENT_NODE,
    single: start.hasSingleTag,
    attributes: arrayToJson(start.attributes),
    grammar: start.grammar,
    parseGrammer: start.parseGrammer,
    point: {
      start: start.point.start,
      end: end.point.end
    }
  }

  structure[startCode] = '';
  structure[endCode] = '';

  if (arrayToString(structure) !== '') {
    findElement(...arguments);
  }
};

export default function(structure) {
  const elements = {};
  const tags = [];

  structure.map(struct => {
    if (struct.type === 'element') {
      tags.push(struct);
    }
  });

  findElement(tags, elements);

  return elements;
}
