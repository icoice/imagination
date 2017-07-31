import {POWER_TYPES, DEF_USER_CARD} from './constants'
import {PowerSettingStruct, PowerTypeStruct, IdCardStruct} from './interface'

/**
 *  power level counter
 */
export default class PowerCore {
  private doOverrideControl: (message: any) => any;
  protected setting: PowerSettingStruct;
  protected userCard: IdCardStruct;
  protected logger = [];

  constructor(userCard: IdCardStruct,  setting: PowerSettingStruct) {
    if (!userCard) {
      throw `Use power function need a operator's id-card.`;
    }
    this.setting = setting;
    this.userCard = userCard;
    this.doOverrideControl = () => {};
    this.init();
  }

  protected record (message: any) {
    this.logger.push(message);
    this.doOverrideControl(message);
  }

  init() {
    const {setting} = this;

    if (setting.cardCategory === null) {
      setting.cardCategory = {};
      POWER_TYPES.map(power => {
        setting.cardCategory[power.name] = [];
      });
    }

    if (setting.powerTypes === null) {
      setting.powerTypes = { length: 0 };
      POWER_TYPES.map(power => {
        this.newPower(power.name, power.amount);
      });
    }

    if (setting.idCards === null) {
      setting.idCards = {length: 0};
      POWER_TYPES.map(power => {
        this.newIdCard(power.name);
      });
    }
  }

  getCard(no: number) {
      return this.setting.idCards[no];
  }

  getPowerAmount(powerName: string) {
    const {cardCategory} = this.setting;

    if (!(powerName in cardCategory)) {
      throw `Power ${powerName} is not defined.`;
    }
    return cardCategory[powerName].length;
  }

  getPowerSetting() {
    return this.setting;
  }

  getLog() {
    return this.logger;
  }

  onOverrideControl(callback = () => {}) {
    this.doOverrideControl = callback;
  }

  addCardCategory(powerName: string,  cardId: string) {
    if (!this.canUse('addCardCategory'))  return false;

    const {cardCategory, powerTypes} = this.setting;
    const category = cardCategory[powerName];
    const power = powerTypes[powerName];

    if (category.indexOf(cardId) < 0  && power.amount > this.getPowerAmount(powerName)) {
      category.push(cardId);
    }

    return true;
  }

  newCardCategory(powerName: string) {
    if (!this.canUse('newCardCategory'))  return false;

    const {cardCategory} = this.setting;

    if (!(powerName in cardCategory)) {
      cardCategory[powerName] = [];
    }

    return true;
  }

  newPower(name: string, amount: number) {
    if (!this.canUse('newIdCard'))  return false;

    const {setting} = this;
    const {powerTypes} = setting;

    if (name in powerTypes)  return false

    powerTypes[name] = {
      type: name,
      level: powerTypes.length++,
      amount
    }

    this.newCardCategory(name);

    return true;
  }

  newIdCard(powerName: string, use:any = []) {
    if (!this.canUse('newIdCard'))   return DEF_USER_CARD;

    const {setting} = this;
    const {idCards} = setting;

    if (this.isCanNewCard(powerName)) {
      throw `Power ${powerName} can't create new card.`;
    }

    const card:IdCardStruct = {
      id: `power_${setting.id++}`,
      type: powerName,
      use
    }

    this.addCardCategory(powerName, card.id);

    idCards[card.id] = card;
    idCards.length++;

    return card;
  }

  isCanNewCard(powerName: string) {
    const {powerTypes} = this.setting;
    const power: PowerTypeStruct = powerTypes[powerName];
    return this.getPowerAmount(powerName) >= power.amount;
  }

  canUse(key: string) {
    const {userCard} = this;

    if  (userCard.type === 'master' && userCard.id === 'power_0') {
        return true;
    }

    if  (userCard.use.indexOf(key) >= 0) {
        return true;
    }

    this.record({
      code: '001',
      msg: `User ${userCard.id}$ no power to operate on ${key}.`
    });

    return false;
  }
}
