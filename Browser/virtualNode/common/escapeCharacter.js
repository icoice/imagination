export default (str, match = ['$', '{', '}', '-', '[', ']', '.', '?', ':', ')', '(']) => {
  match.map(character => {
    str = str.replace(new RegExp('\\' + character, 'g'), '\\' + character);
  });
  return str;
}
