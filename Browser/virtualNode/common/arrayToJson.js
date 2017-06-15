export default function(arr) {
  const json = {};

  arr.map(expression => {
    expression = expression.split('=');
    json[expression[0]] = expression[1].replace(/"/g, '');
  });

  return json;
}
