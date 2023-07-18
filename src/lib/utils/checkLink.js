export const checkLink = (s) => {
  const regex = /^(http|https):\/\/.+/;
  if (!regex.test(s)) {
    return `https://${s}`;
  }
  return s;
};
