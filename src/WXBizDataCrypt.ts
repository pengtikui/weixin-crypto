import { createDecipheriv } from 'crypto';

export interface IOptions {
  appid: string;
  sessionKey: string;
}

export interface IDecryptParams {
  encryptedData: string;
  iv: string;
}

export class WXBizDataCrypt {
  private appid: string;
  private sessionKey: string;

  constructor(options: IOptions) {
    this.appid = options.appid;
    this.sessionKey = options.sessionKey;
  }

  decrypt(params: IDecryptParams) {
    const sessionKey = Buffer.from(this.sessionKey, 'base64');
    const encryptedData = Buffer.from(params.encryptedData, 'base64');
    const iv = Buffer.from(params.iv, 'base64');

    let decoded;

    try {
      const decipher = createDecipheriv('aes-128-cbc', sessionKey, iv);
      decipher.setAutoPadding(true);

      let rawDecoded = decipher.update(encryptedData, 'binary', 'utf8');
      rawDecoded += decipher.final('utf8');
      decoded = JSON.parse(rawDecoded);
    } catch (error) {
      throw new Error('Illegal Buffer');
    }

    if (decoded.watermark.appid !== this.appid) {
      throw new Error('Illegal Buffer');
    }

    return decoded;
  }
}
