# weixin-crypto

[![npm](https://img.shields.io/npm/v/weixin-crypto?style=flat-square)](https://www.npmjs.com/package/weixin-crypto)
[![issues](https://img.shields.io/github/issues/pengtikui/weixin-crypto?style=flat-square)](https://github.com/pengtikui/weixin-crypto/issues)
[![pulls](https://img.shields.io/github/issues-pr/pengtikui/weixin-crypto?style=flat-square)](https://github.com/pengtikui/weixin-crypto/pulls)
[![license](https://img.shields.io/github/license/pengtikui/weixin-crypto?style=flat-square)](https://github.com/pengtikui/weixin-crypto/blob/master/LICENSE)

微信公众平台消息加解密库，可用于微信公众号、微信小程序、微信开放平台等。

具体请参考[消息加解密说明](https://developers.weixin.qq.com/doc/oplatform/Third-party_Platforms/Message_Encryption/Message_encryption_and_decryption.html)

## 特性

* 零依赖
* 支持 TypeScript
* 不限制 XML 或 JSON

## 使用

#### 安装：

```shell
# npm
npm install weixin-crypto
# yarn
yarn add weixin-crypto
```

#### 初始化：

```javascript
import WeixinCrypto from 'weixin-crypto';

const wxCrypto = new WeixinCrypto({
  appid: '公众平台的 appid',
  token: '接收消息的校验 token',
  encodingAESKey: '接收消息的 EncodingAESKey',
});
```

#### 校验消息体签名：

```javascript
// 判断 URL 上的 msg_signature 和计算出的是否一致，伪代码
const timestamp = 'URL 上的 timestamp 参数';
const nonce = 'URL 上的 nonce 参数';
const msg_signature = 'URL 上的 msg_signature 参数';
const msg_encrypt = '请求体中的密文消息';

if (wxCrypto.getSignature({ timestamp, nonce, msg_encrypt }) === msg_signature) {
  // 消息体签名校验通过
}
```

`msg_encrypt` 为请求体中的密文消息，如果为 XML 格式，需要先自行解析出来，`weixin-crypto` 不会帮你解析 XML 内容。

#### 解密消息：

```javascript
const msg_encrypt = '请求体中的密文消息';

// 解密后的内容
const decrypted = wxCrypto.decrypt(msg_encrypt);
```

解密前需要自行校验消息体签名，解密过程不包含签名校验流程；如果请求体为 XML 格式，解密后的内容为 XML 字符串，需要自行解析 XML 内容。

#### 加密消息：

```javascript
const content = '要加密的内容';

// 解密后的内容
const encrypted = wxCrypto.encrypt(content);
```

如果要加密 XML 格式的内容，需要先自行拼接成 XML 字符串再进行加密。

## License

MIT License (c) 2020-preset [pengtikui](https://github.com/pengtikui)
