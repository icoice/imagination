export default function(obj) {
  return typeof obj === 'object' && obj !== null && obj.hasOwnProperty('packetId') && obj.packetId.indexOf('_pack_id') >= 0;
}
