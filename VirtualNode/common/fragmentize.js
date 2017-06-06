export default str => {
  const matchPlaceholder = /\{[^\{\}]{0,}\}/ig;
  const matchExpression = /[\w_]+\="[^\=""]{0,}"/ig;
  const placeholders = str.match(matchPlaceholder);
  const debris = str.match(matchExpression);
  const tagName = str.replace(matchExpression, '').replace(matchPlaceholder, '').replace(/[<>\/\s]+/g, '')

  return {
    tagName,
    attributes: debris ? debris : [],
    grammar: placeholders ? placeholders : []
  }
}
