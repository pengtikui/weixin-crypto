import { createHash, createDecipheriv, createCipheriv, pseudoRandomBytes } from 'crypto';
import * as pkcs7 from './pkcs7';

const ALGORITHM = 'aes-256-cbc';

export interface IOptions {
  appid: string;
  token: string;
  encodingAESKey: string;
}

export interface IGetSignatureParams {
  timestamp: string;
  nonce: string;
  msg_encrypt: string;
}

export class WXBizMsgCrypt {
  appid: string;
  token: string;
  encodingAESKey: string;
  aesKey: Buffer;
  iv: Buffer;

  constructor(options: IOptions) {
    this.appid = options.appid;
    this.token = options.token;
    this.encodingAESKey = options.encodingAESKey;

    this.aesKey = Buffer.from(`${this.encodingAESKey}=`, 'base64');
    this.iv = this.aesKey.slice(0, 16);
  }

  /**
   * 获取消息体签名
   */
  getSignature({ timestamp, nonce, msg_encrypt }: IGetSignatureParams): string {
    const hash = createHash('sha1');
    hash.update([this.token, timestamp, nonce, msg_encrypt].sort().join(''));
    return hash.digest('hex');
  }

  /**
   * 解密
   */
  decrypt(msg_encrypt: string) {
    const decipher = createDecipheriv(ALGORITHM, this.aesKey, this.iv);
    decipher.setAutoPadding(false);

    const msgEncryptBuf = Buffer.from(msg_encrypt, 'base64');

    let decryptedBuf = Buffer.concat([decipher.update(msgEncryptBuf), decipher.final()]);
    decryptedBuf = pkcs7.decode(decryptedBuf);

    const content = decryptedBuf.slice(16);
    const length = content.slice(0, 4).readInt32BE(0);

    const message = content.slice(4, length + 4).toString();

    return message;
  }

  /**
   * 加密
   */
  encrypt(text: string) {
    const random = pseudoRandomBytes(16);
    const msg = Buffer.from(text);
    const msgLength = Buffer.alloc(4);
    msgLength.writeUInt32BE(msg.length, 0);
    const appid = Buffer.from(this.appid);

    const msgBuf = Buffer.concat([random, msgLength, msg, appid]);
    const encodedMsgBuf = pkcs7.encode(msgBuf);

    const cipher = createCipheriv(ALGORITHM, this.aesKey, this.iv);
    cipher.setAutoPadding(false);

    const ciphered = Buffer.concat([cipher.update(encodedMsgBuf), cipher.final()]);

    return ciphered.toString('base64');
  }
}
