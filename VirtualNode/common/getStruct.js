import { CHILD_ID_PREFIX } from '../Packet/constant';

export default (struct, elements, texts) => {
  const nid = `${CHILD_ID_PREFIX}${struct.id}`;
  return elements[struct.id] || texts[struct.id] || elements[nid] || texts[nid];
}
