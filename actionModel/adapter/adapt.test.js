import Adapter from './index.js';

// 伪造接口，无具体业务逻辑
const api1 = {
  getUsrInfo: req => {
    console.log('request-data: ', req);
    return {
      uid: 1,
      token: 'E0011253412DDDDXCCDSXCD'
    };
  }
};

// 伪造接口，无具体业务逻辑
const api2 = {
   getOrders: req => {
     console.log('request-data: ', req);
     return {
      uid: 2,
      orders: [
        {
          oid: 1,
          uid: 1,
          desc: '',
          items: [],
        }
      ]
    }
   }
};

test('Adapter', () => {
  Adapter.accross('onExecuteBefore',  next => {
    if (true) {
      return next();
    }
  });
  Adapter.accross('onExecuteAfter', next => {
    if (true) {
      return next();
    }
  });

  const a1 = new Adapter(api1);
  const a2 = new Adapter(api2, {inPromise: false});

  // 组合桥接接口
  a1.combination('getUsrInfoAndOrders', function ({uid}, callback) {
    this.getUsrInfo(uid).then(token => {
      a2.getOrders({uid, token}, data => callback(data));
    }).catch(e => console.log(e));
  });

  // 接口别名
  a2.setAlias({
    'getOrders': 'GO'
  });

  // API的常规使用接口
  a1.getUsrInfo({
    uid: 1
  }).then(data => {
    console.log(data);
  }).catch(() => {

  });

  const res = a2.GO({
    oid: 1
  });

  console.log(res);
});
