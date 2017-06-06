import hasNode from './hasNode'

let node = null;

export default function(html) {
  if (document && !hasNode()) {
    node = node !== null ? node : document.createElement('div');
    node.innerHTML = html;
    return node.children[0];
  } else {
    return html;
  }
}
