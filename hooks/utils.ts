import QuickCrypto from 'react-native-quick-crypto';

export function hexToRgba(hex: string, opacity: number) {
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

export function uuidv4() {
  return QuickCrypto.randomUUID();
}

export const isEmoji = str => {
  const emojiRegex =
    /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g;
  return str.match(emojiRegex)
    ? str.match(emojiRegex)[0].length === str.length
    : false;
};
