export default function(arr1, arr2) {
  if (arr1.length <= 0 || arr2.length <= 0) {
    return arr1;
  }

  const reg = new RegExp('[\\|]?(' + arr2.join('|') + ')+', 'g');

  let str = arr1.join('|').replace(reg, '');

  str = str.replace(/^\|?/, '');

  return str.length > 0 ? str.split('|') : [];
}
