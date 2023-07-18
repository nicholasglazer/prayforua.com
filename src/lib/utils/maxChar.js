export const getMaxCharacters = (max, text, bool) => {
  if (bool) {
    return text;
  } else {
    return text.substring(0, max);
  }
};
