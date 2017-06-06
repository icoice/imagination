import createStructId from '../common/createStructId'
import encodeNode from '../common/encodeNode'
import hasPacket from '../common/hasPacket'
import hasString from '../common/hasString'
import Parser from '../Parser'
import { ELEMENT_NODE } from '../Parser/constant'
import { PACK_ID_PREFIX } from './constant'
import addChild from './addChild'

let packet_id = 0;

export default class Packet {

  constructor(structure) {
    const {tree, elements} = this.parts = structure.parts;
    this.packetId = `_pack_id_${packet_id++}`;
    this.structure = structure;
    this.root = elements[tree.id];
  }

  //获得、设置属性
  attribute(k, v) {
    const {root} = this;

    if (k && v) {
      root.attributes[k] = v;
    } else if (k && !v) {
      return root.attributes[k];
    }
  }

  //移除属性
  removeAttribute(k) {
    delete this.root.attributes[k];
  }

  //获得子节点
  children(i) {
    const {root, parts} = this;
    const {elements, texts, tree} = parts;
    const {children} = tree;
    const nodeChildren = [];

    children.map(struct => {
      if (struct.type === ELEMENT_NODE) {
        nodeChildren.push(struct);
      }
    });

    return new Packet(new Parser({
      tree: nodeChildren[i],
      elements,
      texts
    }));
  }

  //第一个子节点
  firstChild(child) {
    if (!child) {
      return this.children(0);
    }

    addChild('first', child, this.parts);
  }

  //最后一个子节点
  lastChild(child) {
    const {parts} = this;
    const {children} = parts.tree;
    const nodeChildren = [];

    children.map(struct => {
      if (struct.type === ELEMENT_NODE) {
        nodeChildren.push(struct);
      }
    });

    if (!child) {
      return this.children(nodeChildren.length - 1);
    }

    addChild('last', child, parts);
  }

  //移除子节点
  removeChild(packet) {
    const {root, parts} = this;
    const {elements, texts, tree} = parts;

    if (!hasPacket(packet)) {
      return;
    }

    const {point} = packet.parts.tree;
    const rid = createStructId(point);
    const rootCode = root.children.indexOf(rid);

    let treeCode = null;

    tree.children.map((struct, i) => {
      if (struct.id === rid) {
        treeCode = i;
      }
    });

    root.children.splice(rootCode, 1);
    tree.children.splice(treeCode, 1);
  }

  //移除首个子节点
  removeFristChild() {
    this.removeChild(this.fristChild());
  }

  //移除最尾的子节点
  removeLastChild() {
    this.removeChild(this.lastChild());
  }

  //输出内容
  output() {
    const {structure} = this;
    return encodeNode(structure.string());
  }
}
