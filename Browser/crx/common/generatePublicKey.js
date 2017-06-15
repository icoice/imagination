import RSA from 'node-rsa';

//产生公钥
export default privateKey => {
  return (new RSA(privateKey)).exportKey('pkcs8-public-der');
};
