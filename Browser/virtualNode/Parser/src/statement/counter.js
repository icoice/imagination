import hasUndefined from '../../../common/hasUndefined'
import hasObject from '../../../common/hasObject'
import loop from '../../../common/loop'

const countTerneryRes = function(sentence, state) {
  const {key, expression} = sentence;
  let answers = state[key] ? expression[0] : expression[1];
  if (hasObject(answers)) {
    return counter(answers, state);
  }
  return answers;
}

const countVariableRes = function(sentence, state) {
  let {key, expression} = sentence.shift().sentence;
  let result = state[key];

  result && expression && expression.map((attrName, code) => {
    const key = counter(attrName, state);
    result = result[key];
  });

  if (!hasUndefined(result)) {
    loop(sentence, v => {
      const {key, expression} = v.sentence;
      result = result[key];
      result && expression && expression.map((attrName, code) => {
        result = result[counter(attrName, state)];
      });
    });
  }

  return result;
}

const counter = function(struct, state = {}) {
  const {type, sentence} = struct;

  switch (type) {
    case 'variable':
      return countVariableRes(sentence, state);
    case 'ternery':
      return countTerneryRes(sentence, state);
    default:
      return struct.replace(/'/g, '');
  }
}

export default counter;
