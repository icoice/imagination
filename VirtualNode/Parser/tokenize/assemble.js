import struct from './struct';
import arrayToString from '../../common/arrayToString';
import loop from '../../common/loop';

// 字符结构体
export default function(str) {
  // 标签的界定符
  const structure = [];
  const tagLeftDelimiter = '\u{003C}';
  const tagRightDelimiter = '\u{003E}';

  let meetDelimiter = false;
  let collectText = [];
  let collectTags = [];

  loop(str, (letter, code) => {
    let debris;
    // Tag的左定界符
    if (letter === tagLeftDelimiter) {
      // 结束前面的text采集
      if (collectText.length > 0) {
        debris = arrayToString(collectText);
        collectText = [];
      }
      collectTags.push(letter);
      meetDelimiter = true;
    // Tag的右定界符
    } else if (letter === tagRightDelimiter && meetDelimiter) {
      meetDelimiter = false;
      collectTags.push(letter);
      debris = arrayToString(collectTags);
      collectTags = [];
    // Tag内的字符集
    } else if (meetDelimiter) {
      collectTags.push(letter);
    } else if (!meetDelimiter) {
      collectText.push(letter);
    }
    if (debris) {
      structure.push(struct(code, debris));
    }
  });

  return structure.sort((x, y) => y.point.start - x.point.start);
}
