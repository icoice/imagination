import crypto from 'crypto';

//生成appid
export const createAppId = function(content) {
  return crypto.createHmac('sha256', 'aby').update(content).digest('hex').slice(0, 32).replace(/./g, num => (parseInt(num, 16) + 10).toString(26));
};
