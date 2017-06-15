import fs from 'fs';
import archiver from 'archiver';
import { generatePrivateKey, generatePublicKey, createSignature, createAppId } from './common';


/**
 * Pack a Chrome Extensions
 * Please run to Nodejs environment
 */

export default class Crx {

  static status = {
    IS_CREATE_CRX: true,
    NOT_CREATE_CRX: false
  }

  //更新crx包
  static updateXML(appId, codeBase, version) {
    return new Buffer(`<?xml version='1.0' encoding='UTF-8'?>
     <gupdate xmlns='http://www.google.com/update2/response' protocol='2.0'>
       <app appid="${appId}">
         <updatecheck codebase="${codeBase}" version="${version}""/>
       </app>
     </gupdate>`);
  }

  constructor(options = {}) {
    this.options = options;
  }

  init(cb) {
    const {options} = this;
    const ignore = ['*.pem', '.git', '*.crx'];
    const rootDir = './';
    const keyFile = !options.keyFile ? `${rootDir}key.pem` : options.keyFile;

    generatePrivateKey(keyFile, key => {
      //包名
      this.packName = !options.name ? 'noname' : options.name;
      //私钥
      this.privateKey = key;
      //签名
      this.signature = null;
      //公钥
      this.publicKey = generatePublicKey(this.privateKey);
      //应用id
      this.appId = createAppId(this.publicKey);
      //文件忽略
      this.ignore = options.ignore ? ignore.concat(options.ignore) : ignore;
      //输出路径
      this.outputPath = options.outputPath ? options.outputPath : rootDir;
      //输入路径
      this.pattern = options.pattern ? options.pattern : rootDir;

      cb && cb();
    });
  }

  //获得打包内容
  getProcess(cb) {
    const {outputPath, pattern, ignore} = this;
    //定义一个zip文件
    const output = archiver('zip');

    //创建一个空的binary变量
    let processContent = Buffer.alloc(0);

    //合并二进制内容，事件
    output.on('data', buff => {
      processContent = Buffer.concat([
        processContent,
        buff
      ]);
    });

    //错误
    output.on('error', err => {
      throw err;
    });

    //完成事件
    output.on('finish', () => {
      //通过私钥获得签名
      this.signature = createSignature(processContent, this.privateKey);
      //签名转换二进制
      this.signature = new Buffer(this.signature, 'binary');

      cb && cb(processContent);
    });

    //执行
    output.glob(pattern, {
      cwd: outputPath,
      ignore,
      matchBase: '*'
    });

    output.finalize();
  }

  packStream() {}


  //生成crx包
  pack(cb, isWrite = Crx.status.IS_CREATE_CRX) {
    this.init(() => this.getProcess((zip) => {
      const {signature, publicKey, outputPath, packName} = this;

      //编码格式参照，https://developer.chrome.com/extensions/crx
      /**
        43 72 32 34   # "Cr24" -- the magic number
        02 00 00 00   # 2 -- the crx format version number
        A2 00 00 00   # 162 -- length of public key in bytes
        80 00 00 00   # 128 -- length of signature in bytes
        ...........   # the contents of the public key
        ...........   # the contents of the signature
        ...........   # the contents of the zip file
       **/

      //计算crx的内容总长度
      const sl = signature.length;
      const pl = publicKey.length;
      const zl = zip.length;

      //定义buffer的大小
      const buffer = Buffer.alloc(16 + sl + pl + zl);

      //写入13个x00
      buffer.write(`Cr24${new Array(13).join('\x00')}`, 'binary');

      buffer[4] = 2;
      buffer.writeUInt32LE(pl, 8);
      buffer.writeUInt32LE(sl, 12);

      publicKey.copy(buffer, 16);
      signature.copy(buffer, 16 + pl);
      zip.copy(buffer, 16 + pl + sl);

      if (isWrite) {
        fs.writeFile(`${outputPath}/${packName}.crx`, buffer);
      }

      cb && cb(buffer);
    }));
  }

  //支持webpack生成文件
  apply(compiler) {
    //All is done
    compiler.plugin('done', () => this.pack());
  }
}
