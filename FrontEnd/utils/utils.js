import { BigNumber, BigNumberish } from "ethers";
// import { BigNumber } from "bignumber.js";
export const ZERO = BigNumber.from(0);
export const ONE = BigNumber.from(1);
export const TWO = BigNumber.from(2);

export const E18 = BigNumber.from(10).pow(18);

export const MAX_FEE = BigNumber.from(10000);
let MIN_TICK = -887272;
let MAX_TICK = -MIN_TICK;
export const BASE_TEN = 10;

function sqrt(x) {
  let z = x.add(ONE).div(TWO);
  let y = x;
  while (z.sub(y).isNegative()) {
    y = z;
    z = x.div(z).add(z).div(TWO);
  }
  return y;
}

export function divRoundingUp(numba, denominator) {
  const res = numba.div(denominator);
  const remainder = numba.mod(denominator);
  if (remainder.eq(0)) return res;
  return res.add(1);
}

export function getBigNumber(amount, decimals = 18) {
  return BigNumber.from(amount).mul(BigNumber.from(BASE_TEN).pow(decimals));
}



