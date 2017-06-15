import fs from 'fs';
import RSA from 'node-rsa';

//产生私钥
export const generatePrivateKey = function(keyFile, cb) {
  let key;

  fs.stat(keyFile, (err, stats) => {
    //读取之前已产生的key
    if (err && err.code === 'EEXIST' && stats.isFile()) {
      key = fs.readFileSync(keyFile);
    }

    if (key === '' || !key) {
      try {
        //新建一个2048bit（长度）的RAS值，2048bit前的RSA值已证明被破解。
        key = new RSA({
          b: 2048
        });
        key = key.exportKey('pkcs1-private-pem');

        fs.writeFileSync(keyFile, key);
      } catch (e) {
        console.error(e);
      }
    }

    cb(key);
  });
};
