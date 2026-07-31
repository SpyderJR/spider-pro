export interface MfiInput {
  high: number;
  low: number;
  close: number;
  volume: number;
}

/** Money Flow Index — volume-weighted RSI, using typical price × volume as "money flow". */
export function mfi(candles: MfiInput[], period = 14): (number | null)[] {
  const typicalPrices = candles.map((c) => (c.high + c.low + c.close) / 3);
  const rawMoneyFlow = typicalPrices.map((tp, i) => tp * candles[i]!.volume);

  return candles.map((_, i) => {
    if (i < period) return null;

    let positiveFlow = 0;
    let negativeFlow = 0;
    for (let j = i - period + 1; j <= i; j++) {
      if (typicalPrices[j]! > typicalPrices[j - 1]!) positiveFlow += rawMoneyFlow[j]!;
      else if (typicalPrices[j]! < typicalPrices[j - 1]!) negativeFlow += rawMoneyFlow[j]!;
    }

    if (negativeFlow === 0) return 100;
    const moneyRatio = positiveFlow / negativeFlow;
    return 100 - 100 / (1 + moneyRatio);
  });
}
