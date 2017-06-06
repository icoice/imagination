import createTree from './createTree';
import findElement from './findElement';
import findText from './findText';

export default structure => {
  const elements = findElement(structure);
  const texts = findText(structure);
  const tree = createTree(elements, texts);

  return {
    elements,
    texts,
    tree
  }
}
