export function cryptoRandom(max) {
  if (max <= 0) {
    return 0;
  }

  const range = max + 1;
  const bytesNeeded = Math.ceil(Math.log2(range) / 8);

  let randomValue;
  let randomBytes = new Uint8Array(bytesNeeded);
  do {
    crypto.getRandomValues(randomBytes);
    randomValue = 0;
    for (let i = 0; i < bytesNeeded; i++) {
      randomValue = (randomValue << 8) + randomBytes[i];
    }
  } while (randomValue >= range * Math.floor(256 / range));

  if ((randomValue % range) <= 0){return 0;}
  return randomValue % range;
}