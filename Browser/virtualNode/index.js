import Packet from './Packet';
import Parser from './Parser';
import hasElem from './common/hasElem';
import each from './common/each';
import addEventList from './common/addEventList';

export default class VirtualNode {

  constructor(html) {
    const structure = new Parser(html);

    //private
    this._node_pack = new Packet(structure);
    this._components = {};
    this._node_events = {};
    this._node_origin = null;
    this._prop_types = {};
    this._render_times = 0;

    //public
    this.props = {};
    this.state = {};
    this.getPacket = () => this._node_pack;
    this.getRendered = () => this._node_origin;
    this.setRendered = rendered => this._node_origin = rendered;
    this.type = {
      Array: v => typeof v === 'Object' && v instanceof Array,
      Object: v => typeof v === 'Object' && v !== null && !isNaN(v),
      Number: v => typeof v === 'nummber',
      String: v => typeof v === 'string'
    }
  }

  //混合
  mixin(event, process) {
    const {_node_events} = this;

    if (typeof event === 'object') {
      each(event, (v, k) => {
        if (_node_events.hasOwnProperty(k)) {
          _node_events[k].push(v);
        } else {
          _node_events[k] = [v];
        }
      });
    } else if (typeof event === 'string' && typeof process === 'function') {
      if (_node_events.hasOwnProperty(event)) {
        _node_events[event].push(process)
      } else {
        _node_events[event] = [process];
      }
    }
  }

  //特殊数据 － 组件
  component(k, v) {
    this._components[k] = v;
  }

  propTypes(obj) {
    this._prop_types = obj;
  }

  //数据
  props(data) {
    this.props = data;
  }

  //重置数据
  setState(k, v) {
    if (typeof k === 'object' && k !== null) {
      this.state = k;
    }
    if (typeof k === 'string' && v) {
      this.state[k] = v;
    }
  }

  //新增内部事件方法
  setMethod(k, v) {
    const {_node_events} = this;

    if (!_node_events.hasOwnProperty(k)) {
      _node_events[k] = [];
    }
    _node_events[k].push(v);
  }

  //即将载入门柄
  willMount(cb) {
    addEventList(this._node_events, 'willMount', cb);
  }

  //即将卸载门柄
  willUnmount(cb) {
    addEventList(this._node_events, 'willUnmount', cb);
  }

  //即将更新
  shouldUpdate(cb) {
    addEventList(this._node_events, 'shouldUpdate', cb);
  }

  //卸载
  unmount(cb) {
    const {_node_origin, _node_events} = this;
    const {willUnmount} = _node_events;
    const {parentNode} = _node_origin;

    willUnmount.map(cb => cb.call(this));
    hasElem(parentNode) ? parentNode.removeChild(_node_origin) : null;
    this._render_times = 0;
  }

  //渲染
  render(parent) {
    const {_node_pack, _render_times, _node_events, state} = this;
    const {willMount, shouldUpdate} = _node_events;
    const rendered = this.getRendered();

    if (!rendered) {
      this.setRendered(_node_pack.output(state));
    }
    if (!parent || !hasElem(parent)) {
      return rendered;
    }
    if (_render_times > 0) {
      shouldUpdate.map(cb => cb.call(this));
    } else {
      willMount.map(cb => cb.call(this));
    }

    parent.innerHTML = this.getRendered();

    return parent.children[0]
  }

}
