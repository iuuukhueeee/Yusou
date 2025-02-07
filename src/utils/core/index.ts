import crypto from "crypto";

export const generate_otp = () => {
  const array = new Uint16Array(1);
  crypto.getRandomValues(array);

  return array[0].toString();
};
