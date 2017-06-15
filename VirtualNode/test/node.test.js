import VirtualNode from '../index';
import getStruct from '../common/getStruct';
import tab from './tab';
import tabs from './tabs';
import tabView from './tabView';

const vnode = new VirtualNode(tab);

const state = {
  title: 'TAB_COMPONENTS',
  theme: 'tm-im-tab',
  isShow: false,
  isSelect: 'man',
  empty: 'is-empty',
  sex: {
    man: '0',
    male: '1',
    desc: {
      man: 0,
      desc: {
        male: 1
      }
    }
  },
  views: {
    tab1: 'test',
    tab2: {
      content: 'test2',
      test3: {
        content: 'test3'
      }
    }
  },
  tabs: [
    {
      name: 'tab-1',
      subName: 'belong-tab'
    },
    {
      name: 'tab-2',
      subName: 'belong-tab'
    }
  ]
}

const propTypes = {
  title: vnode.type.String,
  tabs: vnode.type.Array
}

test('vnode build', () => {
  vnode.mixin({
    willMount(vn) {},
    willUnmount(vn) {},
    shouldUpdate(vn) {}
  });
  vnode.propTypes(propTypes);
  vnode.setState(state);
  vnode.component('tabs', tabs);
  vnode.component('tab-view', tabView);
  vnode.willMount(vn => {
  });
  vnode.willUnmount(vn => {
  });
  vnode.shouldUpdate(vn => {
  });
  console.log(vnode.render(document.body).outerHTML);
})
