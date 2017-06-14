import Parser from '../Parser';
import Packet from '../Packet';
import VirtualNode from '../';
import tab from './tab';
import tabs from './tabs';

const isRemoveChild = 0;

let structure;
let node;
let child;
let child2;

test('parse html and change to structure', () => {
  structure = new Parser(tab);
});

test('structure change to html', () => {
  structure.string();
});

test('pack structure', () => {
  node = new Packet(structure);
});

test('packet add attribute', () => {
  node.attribute('_test', 123456);
  node.attribute('_test2', 123456);
});

test('packet get attribute', () => {
  expect(node.attribute('_test2')).toBe(123456);
});

test('packet remove attribute', () => {
  node.removeAttribute('_test');
});

test('packet get child', () => {
  child = node.firstChild();
  child2 = node.lastChild();
});

test('packet add child attribute', () => {
  child.attribute('test_child', 111111);
  child.attribute('test_child2', 222222);
});

test('packet remove child attribute', () => {
  child.removeAttribute('test_child2');
});

test('packet remove child', () => {
  if (isRemoveChild) {
    node.removeChild(child);
    node.removeChild(child2);
  }
});

test('packet add child', () => {
  const parser = new Parser(tabs);
  const n = new Packet(parser);

  n.attribute('test', 'add new child');
  node.firstChild(n);

  n.attribute('test2', 'add last child');
  node.lastChild(n);
})

test('result', () => {
  //console.log(node.lastChild());
  //console.log(child.output());
  //console.log(structure.string());
});
