import { TEXT_NODE } from '../../constant';

// 找到文本
export default function(structure) {
  const texts = {};

  structure.map(struct => {
    if (struct.type === 'text') {
      texts[struct.id] = {
        text: struct.symbol,
        nodeType: TEXT_NODE,
        point: {
          start: struct.point.start,
          end: struct.point.end
        },
        grammar: struct.grammar,
        parseGrammer: struct.parseGrammer,
        length: struct.symbol.length
      };
    }
  });

  return texts;
}
