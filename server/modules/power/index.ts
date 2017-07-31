import PowerCore from './core'
import {IdCardStruct, PowerTypeStruct, PowerSettingStruct} from './interface'
import {DEF_USER_CARD, DEF_SETTING} from './constants'

export default class Power extends PowerCore {
  static IdCardStruct;
  static PowerTypeStruct;
  static PowerSettingStruct;

  constructor(setting:PowerSettingStruct = DEF_SETTING, userCard:IdCardStruct = DEF_USER_CARD) {
    super(userCard, setting);
  }

  swipingCard(userCard: IdCardStruct) {
    this.userCard = userCard;
  }

  level(operator: string, card: IdCardStruct, powerName: string) {
    if (!this.canUse('level'))  return;

    const {setting, userCard} = this;
    const {powerTypes} = setting;
    const cardPower: PowerTypeStruct = powerTypes[card.type];
    const userPower: PowerTypeStruct = powerTypes[userCard.type];
    const power: PowerTypeStruct = powerTypes[powerName];
    const {level} = cardPower;

    if (userCard.id === card.id) {
      this.record({
        code: '004',
        msg: `User ${userCard.id}$ can't operate self power.`
      });
      return;
    }

    if (userPower.level < level && userPower.level < power.level) {
        if (operator === 'UP' && level > power.level) {
            card.type = power.type;
            return;
        } else if(operator === 'DOWN' && level < power.level) {
            card.type = power.type;
            return;
        }
        this.record({
          code: '003',
          msg: `User ${userCard.id}$ power overflow :  ${cardPower.type} ${operator.toLowerCase()} to  ${power.type}.`
        });
        return;
    }

    this.record({
      code: '002',
      msg: `User ${userCard.id}$ not enough power to operate level.`
    });
  }
}
