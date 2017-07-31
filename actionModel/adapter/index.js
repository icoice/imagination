const accrossItem = {
  onExecuteBefore: execute => execute(),
  onExecuteAfter: execute => execute()
};

/**
 *  Adapater接受一个对象参数，并为该对象提供以下服务：
 * ====================================
 *  1、 别名声明
 *  2、 Promise的支持以及不支持
 *  3、多个实例的公共拦截器
 *  4、并合多个接口，并生产一个新的业务接口
 */

export default class Adapter {

  constructor (target, setting = {inPromise: Promise ? true : false}) {
    this.alias = {};
    this.inPromise = setting.inPromise ? true : false;
    this.register(target);
  }

  register (target) {
    const {inPromise} = this;

    for (const name in target) {
      const caller = target && typeof target[name] === 'function' ? target[name] : function() {};

      if(!target.hasOwnProperty(name)) {
        continue;
      }

      this[name] = (function(){
        return accrossItem.onExecuteBefore(() => {
          if (!inPromise) {
            const res =  caller.apply(this, arguments);
            return accrossItem.onExecuteAfter(() => res);
          } else {
            return new Promise((reslove, reject) => {
              const res = caller.apply(this, arguments);
              res instanceof Promise ? res.then(data => {
                accrossItem.onExecuteAfter(() => reslove(data));
              }).catch(e => reject(e)) : (
                accrossItem.onExecuteAfter(() => reslove(res)));
            });
          }
        });
      }).bind(this);
    }
  }

  combination(name, cb) {
    const {alias} = this;
    if (!this.hasOwnProperty(name)) {
      this[name] = cb.bind(this);
      if (alias.hasOwnProperty(name)) {
        this[alias[name]] = cb.bind(this);
      }
    }
  }

  setAlias(list) {
    this.alias = list;
    for (const itemName in list) {
      const aliasName = list[itemName];
      if (this.hasOwnProperty(itemName)) {
        this[aliasName] = this[itemName];
      }
    }
  }

  static accross(name, cb) {
    accrossItem[name] = cb;
  }

}
