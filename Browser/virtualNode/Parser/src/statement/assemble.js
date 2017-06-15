const variableRule = /^[\w\$]+[\w\d_\[\]\.']*$/
const readVariableRule = /\[.+\]/g
const terneryRule = /^.+\?.+:.+$/
const stringRule = /^'.+'$/

const assemble = {
  // 0级、字符
  stringOperator(str) {
    return stringRule.test(str) ? str.replace(/'/g, '') : null;
  },
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

    struct.sentence = str.split('.').map(v => {
      const variable = {
        type: 'variable',
        sentence: {
          key: v.replace(readVariableRule, ''),
          expression: null
        }
      }

      if (readVariableRule.test(v)) {
        const {sentence} = variable;
        const expression = v.match(readVariableRule);
        sentence.expression = expression.map(exp => {
          const statement = exp.replace(/[\[\]]+/g, '');
          if (stringRule.test(statement)) {
            return statement;
          } else {
            return parseStatement(statement);
          }
        });
      }

      return variable;
    });

    return struct;
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

    struct.sentence = {
      key: condition,
      expression: answersStruct
    }

    return struct;
  }
}

const parseStatement = sentence => {
  let struct = assemble.stringOperator(sentence);
  struct = !struct ? assemble.variableOperator(sentence) : struct;
  struct = !struct ? assemble.terneryOperator(sentence) : struct;
  return struct;
}

export default parseStatement;
