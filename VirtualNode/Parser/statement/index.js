import assemble from './assemble'

export default (sentence) => {

  // 分析整条表达式的语法
  let struct = assemble.variableOperator(sentence);

  if (!struct) {
    struct = assemble.terneryOperator(sentence);
  }

  return struct;
}
