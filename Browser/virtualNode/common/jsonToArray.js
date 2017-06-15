import each from './each';

export default function(json) {
  const arr = [];

  each(json, (v, k) => arr.push(`${k}="${v}"`));

  return arr;
}
