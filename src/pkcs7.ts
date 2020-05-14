export const encode = (buf: Buffer): Buffer => {
  const BLOCK_SIZE = 32;
  const len = buf.length;
  const amountToPad = BLOCK_SIZE - (len % BLOCK_SIZE);
  const result = Buffer.alloc(amountToPad);
  result.fill(amountToPad);
  return Buffer.concat([buf, result]);
};

export const decode = (buf: Buffer): Buffer => {
  let pad = buf[buf.length - 1];
  if (pad < 1 || pad > 32) {
    pad = 0;
  }
  return buf.slice(0, buf.length - pad);
};
