import Power from '../modules/power';

test('power setting', () => {
  // 由于没有权限记录数据，初始化默认所有权限。
  const opt = new Power();

  opt.onOverrideControl(message => {
      console.error(message);
  });

  // 优先创建权限类型大于下一次权限类型。
  // 创建主管权限， 份额3名, 可控制的权限，默认全部。
  opt.newPower('superviser', 3);

  // 创建管理权限，份额10名，拥有升降比自身等级低但不大于等于自身等级的身份卡。
  opt.newPower('setward', 10);

  opt.newPower('employ', 100);

  // 销售经理身份卡  － 主管权限
  const saleManager = opt.newIdCard('superviser');

  // 会计部经理身份卡  －管理权限
  const accountantManager = opt.newIdCard('setward', ['level', 'newIdCard', 'addCardCategory']);

  // 晋升会计部经理为主管权限
  opt.level('UP', accountantManager, 'superviser');

  // 下降销售经理为管理权限
  opt.level('DOWN', saleManager, 'setward');

  // 当前用户操作设置为销售经理
  opt.swipingCard(saleManager);

  // 销售经理晋升会计部经理为主管权限
  opt.level('UP', accountantManager, 'superviser');

  opt.swipingCard(accountantManager);

  // 一般会社员 －员工权限
  const employ = opt.newIdCard('employ');

  opt.level('UP', saleManager, 'employ');
  opt.level('UP', saleManager, 'setward');
  opt.level('UP', saleManager, 'superviser');
  opt.level('DOWN', saleManager, 'setward');
  opt.level('DOWN', saleManager, 'superviser');
  opt.level('DOWN', saleManager, 'employ');
  opt.level('UP', saleManager, 'employ');
  opt.level('UP', saleManager, 'setward');
  opt.level('UP', accountantManager, 'setward');
  opt.level('UP', employ, 'employ');

  console.log(opt.getPowerSetting());
  console.log(opt.getLog());
});
