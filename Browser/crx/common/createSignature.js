import crypto from 'crypto';

//生成签名
export default (content, key) => {
  return crypto.createSign('sha1').update(content).sign(key);
}
;
