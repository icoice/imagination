const variableRule = /^[\w\$]+[\w\d_\[\]\.']*$/
const readVariableRule = /^[\w\$]+[\w\d_]*\[.+\]$/
const terneryRule = /^.+\?.+:.+$/


export default {

  // 0级、变量
  variableOperator(str) {
    if (!variableRule.test(str)) {
      return null;
    }
    const struct = {
      type: 'variable',
      sentence: []
    }

    str = str.replace(/\s+/g, '');

    const variables = str.split('.').map(v => {
      const variable = {
        key: v,
        expression: null
      }
      // 读取对象属性，包含其表达式（布尔运算、三元运算、四则运算、函数调用以及混合使用）
      if (readVariableRule.test(v)) {
        variable.expression = v.match(readVariableRule);
      }
      return variable;
    });

    return variables;
  },

  // 0级、函数

  // 1级、四则

  // 1级、布尔

  // 2级、三元
  terneryOperator(str) {
    if (!terneryRule.test(str)) {
      return null;
    }

    str = str.replace(/[\s\(\)]+/g, '');

    const struct = {
      type: 'ternery',
      sentence: {}
    };
    const question = str.indexOf('?');
    const condition = str.substr(0, question);
    const answers = str.substr(question + 1, str.length);

    let answersStruct = [];
    let start = 0;

    // 多层嵌套
    if (answers.includes('?') && answers.indexOf('?') < answers.indexOf(':')) {
      while (answers.includes('?', start) || answers.includes(':', start)) {
        start = answers.indexOf(':', start);
        const part = answers.substr(0, start);
        // 选项必须是合法的表达式
        if (terneryRule.test(part) && part.lastIndexOf(':') > part.lastIndexOf('?')) {
          break;
        } else {
          start += 1;
        }
      }
    // 单层嵌套
    } else {
      start = answers.indexOf(':');
    }

    const trueAnswer = answers.substr(0, start);
    const falseAnswer = answers.substr(start + 1, answers.length);

    // 真选项
    answersStruct.push(terneryRule.test(trueAnswer) ?
      this.terneryOperator(trueAnswer) : trueAnswer);

    // 假选项
    answersStruct.push(terneryRule.test(falseAnswer) ?
      this.terneryOperator(falseAnswer) : falseAnswer);

    struct.sentence[condition] = answersStruct;

    return struct;
  }
}
