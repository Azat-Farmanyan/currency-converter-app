export interface Currency {
  symbol: string;
  name: string;
  symbol_native: string;
  decimal_digits: number;
  rounding: number;
  code: string;
  name_plural: string;
  type: string;
  [key: string]: any;
}

export interface CurrencyListItem {
  [currency: string]: Currency;
}

export interface CurrencyList {
  data: CurrencyListItem;
}

export interface ExchangeRate {
  [currency: string]: number;
}

export interface ExchangeRateData {
  data: ExchangeRate;
}
