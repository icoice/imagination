(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global['server-modules'] = factory());
}(this, (function () { 'use strict';

function __extends(d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var POWER_TYPES = [
    {
        name: 'master',
        amount: 1
    }
];
var DEF_SETTING = {
    id: 0,
    uid: 0,
    idCards: null,
    powerUse: null,
    powerTypes: null,
    cardCategory: null
};
var DEF_USER_CARD = {
    id: null,
    type: null
};

/**
 *  power level counter
 */
var PowerCore = (function () {
    function PowerCore(userCard, setting) {
        if (userCard === void 0) { userCard = DEF_USER_CARD; }
        if (setting === void 0) { setting = DEF_SETTING; }
        this.logger = [];
        this.setting = setting;
        this.userCard = userCard;
        this.doOverrideControl = function (message) { };
        this.init();
    }
    PowerCore.prototype.init = function () {
        var _this = this;
        var setting = this.setting;
        if (setting.powerTypes === null) {
            setting.powerTypes = { length: 0 };
            POWER_TYPES.map(function (power) {
                _this.newPower(power.name, power.amount);
            });
        }
        if (setting.idCards === null) {
            setting.idCards = { length: 0 };
            POWER_TYPES.map(function (power) {
                _this.newIdCard(power.name);
            });
        }
        if (setting.cardCategory === null) {
            setting.cardCategory = {};
            POWER_TYPES.map(function (power) {
                setting.cardCategory[power.name] = [];
            });
        }
    };
    PowerCore.prototype.getCard = function (no) {
        return this.setting.idCards[no];
    };
    PowerCore.prototype.getPowerAmount = function (powerName) {
        var cardCategory = this.setting.cardCategory;
        if (!(powerName in cardCategory)) {
            throw "Power " + powerName + " is not defined.";
        }
        return cardCategory[powerName].length;
    };
    PowerCore.prototype.getPowerSetting = function () {
        return this.setting;
    };
    PowerCore.prototype.getLog = function () {
        return this.logger;
    };
    PowerCore.prototype.onOverrideControl = function (callback) {
        if (callback === void 0) { callback = function (message) { }; }
        this.doOverrideControl = callback;
    };
    PowerCore.prototype.newCardCategory = function (powerName, cardId) {
        var _a = this.setting, cardCategory = _a.cardCategory, powerTypes = _a.powerTypes;
        var power = powerTypes[powerName];
        if (!(powerName in cardCategory)) {
            cardCategory[powerName] = [];
        }
        var category = cardCategory[powerName];
        if (category.indexOf(cardId) < 0 && category.length < power.amount) {
            category.push(cardId);
        }
    };
    PowerCore.prototype.newPower = function (name, amount, use) {
        if (use === void 0) { use = '*'; }
        if (!this.canUse('newIdCard'))
            return false;
        var _a = this, userCard = _a.userCard, setting = _a.setting;
        var powerUse = setting.powerUse, powerTypes = setting.powerTypes;
        if (name in powerTypes)
            return false;
        powerTypes[name] = {
            type: name,
            level: powerTypes.length++,
            amount
        };
        if (use === '*') {
            powerUse.map(function (list) {
                list.push(userCard.id);
            });
            return;
        }
        use.map && use.map(function (key) {
            if (!(key in powerUse)) {
                powerUse[key] = [];
            }
            powerUse[key].push(userCard.id);
        });
    };
    PowerCore.prototype.newIdCard = function (powerName) {
        if (!this.canUse('newIdCard')) {
            return DEF_USER_CARD;
        }
        var setting = this.setting;
        var idCards = setting.idCards;
        if (this.isCanNewCard(powerName)) {
            throw "Power " + powerName + " can't create new card.";
        }
        var card = {
            id: "power_" + setting.id++,
            type: powerName
        };
        this.newCardCategory(powerName, card.id);
        idCards[card.id] = card;
        idCards.length++;
        return card;
    };
    PowerCore.prototype.isCanNewCard = function (powerName) {
        var powerTypes = this.setting.powerTypes;
        var power = powerTypes[powerName];
        return this.getPowerAmount(powerName) >= power.amount;
    };
    PowerCore.prototype.canUse = function (key) {
        var _a = this, setting = _a.setting, userCard = _a.userCard;
        var powerUse = setting.powerUse;
        if (key in powerUse) {
            var use = powerUse[key];
            if (use.indexOf(userCard.id) < 0) {
                var message = "This's card can't not use " + key + " methods";
                this.logger.push(message);
                this.doOverrideControl(message);
                return false;
            }
            return true;
        }
        return false;
    };
    return PowerCore;
}());

var Power = (function (_super) {
    __extends(Power, _super);
    function Power(setting, idCard) {
        if (setting === void 0) { setting = null; }
        if (idCard === void 0) { idCard = DEF_USER_CARD; }
        _super.call(this, setting);
        if (!idCard) {
            throw "Use power function need a operator's id-card.";
        }
        this.userCard = idCard;
    }
    Power.prototype.swipingCard = function (idCard) {
        this.userCard = idCard;
    };
    Power.prototype.level = function (operator, card, powerName) {
        if (!this.canUse('level')) {
            return;
        }
        var _a = this, setting = _a.setting, userCard = _a.userCard;
        var powerTypes = setting.powerTypes;
        var cardPower = powerTypes[card.type];
        var userPower = powerTypes[userCard.type];
        var power = powerTypes[powerName];
        var level = cardPower.level;
        if (userPower.level > level && userPower.level > power.level) {
            if ((operator === 'UP' && level < power.level) || (operator === 'DOWN' && level > power.level)) {
                card.type = power.type;
            }
        }
    };
    return Power;
}(PowerCore));

var index = {
    power: Power
};

return index;

})));
//# sourceMappingURL=server-module.js.map
