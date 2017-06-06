import { CHILD_ID_PREFIX } from './constant'
import hasPacket from '../common/hasPacket'
import hasString from '../common/hasString'
import hasUndefined from '../common/hasUndefined'
import each from '../common/each'

export default (type, child, parts) => {
  const {tree, elements, texts} = parts;

  let isExist;

  if (hasPacket(child)) {
    child = child.structure;
  }

  if (hasString(child)) {
    child = new Parser(child);
  }

  tree.children.map((struct, code) => {
    if (struct.id === child.parts.tree.id) {
      isExist = code;
    }
  });

  if (!hasUndefined(isExist)) {
    tree.children.splice(isExist, 1);
  }

  each(child.parts.elements, (struct, id) => {
    elements[`${CHILD_ID_PREFIX}${id}`] = struct;
  });

  each(child.parts.texts, (struct, id) => {
    texts[`${CHILD_ID_PREFIX}${id}`] = struct;
  });

  if (type === 'first') {
    tree.children.unshift(child.parts.tree);
  } else if (type === 'last') {
    tree.children.push(child.parts.tree);
  }
}
