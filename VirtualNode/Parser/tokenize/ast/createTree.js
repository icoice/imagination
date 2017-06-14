import each from '../../../common/each';
import clearArrayRepeat from '../../../common/clearArrayRepeat';
import { ELEMENT_NODE, TEXT_NODE } from '../../constant';

function fetchStruct(id, type, children, point) {
  const struct = {
    id,
    type,
    point
  }

  if (children) {
    struct.children = children;
  }

  return struct;
}

function hasInner(x, y) {
  return x.point.start < y.point.start && x.point.end > y.point.end;
}

// 处理元素的上下文，并返回根元素
function context(elements, texts) {
  let root;
  let rootId;

  // 区分所有元素的层级关系
  each(elements, (x, xid) => {
    if (!root) {
      root = x;
      rootId = xid;
    }

    if (x.nodeType !== ELEMENT_NODE) {
      return;
    }

    x.children = !x.children ? [] : x.children;

    each(elements, (y, yid) => {
      if (xid === yid) {
        return;
      }
      if (hasInner(x, y)) {
        x.children.push(yid);
      }
      //root contain all children
      if (!root) {
        root = x;
        rootId = xid;
      } else if (root.children.length < x.children.length) {
        root = x;
        rootId = xid;
      }
    });
  });

  // 文本节点归属
  each(texts, (x, xid) => {
    each(elements, y => {
      if (hasInner(y, x)) {
        y.children.push(xid);
      }
    });
  });

  // 限制子元素为第一层
  each(elements, x => {
    each(elements, y => {
      if (hasInner(x, y) && x.nodeType === ELEMENT_NODE) {
        x.children = clearArrayRepeat(x.children, y.children);
      }
    });
  });

  return {
    root,
    rootId
  };
}

function fold(struct, elements, texts) {
  const tmp = [];
  let nid;

  // 升序排列
  struct.children.sort((xid, yid) => {
    const x = elements[xid] || texts[yid];
    const y = elements[xid] || texts[yid];
    return x.point.start - y.point.start;
  });

  while (nid = struct.children.shift()) {
    const t = elements[nid] || texts[nid] || struct;
    const {nodeType, children, point} = t;
    const n = fetchStruct(nid, nodeType, children ? [].concat(children) : children, point);
    if (nodeType === ELEMENT_NODE) {
      fold(...[n, elements, texts]);
      tmp.push(n);
    } else if (nodeType === TEXT_NODE) {
      tmp.push(n);
    }
  }

  struct.children = tmp;
  struct.children.sort((a, b) => a.point.start - b.point.start);
  return struct;
}

export default function(elements, texts) {
  const {root, rootId} = context(elements, texts);
  const {nodeType, children, point} = root;
  let struct = fetchStruct(rootId, nodeType, children, point);
  struct = fold(struct, elements, texts);
  return struct;
}
