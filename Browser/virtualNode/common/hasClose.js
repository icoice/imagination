export default str => /^[\s]?<[^<>]+>(\n|.)+<\/[^<>]+>[\s]?$/g.test(str);
