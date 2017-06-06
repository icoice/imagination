import assemble from './assemble';
import ast from './ast';

//创建树结构体
export default str => {
  const symbols = assemble(str);

  //抽象语法树
  return ast(symbols);
}
