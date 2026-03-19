export interface TradingBlotterRow {
  id: string;
  status: "FILL" | "REJ" | "WRK";
  product: string;
  ccy: string;
  side: "BUY" | "SELL";
  execAmount: string;
  execPrice: string;
  spotPrice: string;
  fwdPoints: string;
  valueDate: string;
  modifiedDate: string;
  modifiedBy: string;
  ubsRef: string;
  lifecycle: string;
}

export const tradingBlotterData: TradingBlotterRow[] = [
  {
    id: "blotter-0",
    status: "FILL",
    product: "Spot",
    ccy: "EURUSD",
    side: "BUY",
    execAmount: "10,000,000 EUR",
    execPrice: "0.00028",
    spotPrice: "656",
    fwdPoints: "",
    valueDate: "00:00:000",
    modifiedDate: "09-Sep-2024 09:22:34",
    modifiedBy: "weilands",
    ubsRef: "QOD123ABC123AA",
    lifecycle: "Pending",
  },
  {
    id: "blotter-1",
    status: "FILL",
    product: "Fwd",
    ccy: "CHFUSD",
    side: "SELL",
    execAmount: "500,000 EUR",
    execPrice: "0.00028",
    spotPrice: "2392",
    fwdPoints: "5.00",
    valueDate: "00:00:000",
    modifiedDate: "09-Sep-2024 09:22:34",
    modifiedBy: "laneganm",
    ubsRef: "QOD123ABC123AA",
    lifecycle: "Pending",
  },
  {
    id: "blotter-2",
    status: "REJ",
    product: "Fwd",
    ccy: "GBPUSD",
    side: "BUY",
    execAmount: "1,000,000 EUR",
    execPrice: "0.619606931",
    spotPrice: "656",
    fwdPoints: "",
    valueDate: "00:00:000",
    modifiedDate: "09-Sep-2024 09:22:34",
    modifiedBy: "staleyl",
    ubsRef: "QOD123ABC123AA",
    lifecycle: "Complete",
  },
  {
    id: "blotter-3",
    status: "FILL",
    product: "Spot",
    ccy: "CHFUSD",
    side: "BUY",
    execAmount: "1,000,000 EUR",
    execPrice: "0.619606931",
    spotPrice: "2392",
    fwdPoints: "0.00",
    valueDate: "00:00:000",
    modifiedDate: "09-Sep-2024 09:22:34",
    modifiedBy: "cornellc",
    ubsRef: "QOD123ABC123AA",
    lifecycle: "Complete",
  },
  {
    id: "blotter-4",
    status: "WRK",
    product: "Fwd",
    ccy: "AUDUSD",
    side: "SELL",
    execAmount: "500,000 EUR",
    execPrice: "0.6379985…",
    spotPrice: "656",
    fwdPoints: "0.00",
    valueDate: "00:00:000",
    modifiedDate: "09-Sep-2024 09:22:34",
    modifiedBy: "thompsonhs",
    ubsRef: "QOD123ABC123AA",
    lifecycle: "Complete",
  },
  {
    id: "blotter-5",
    status: "WRK",
    product: "Spot",
    ccy: "AUDUSD",
    side: "SELL",
    execAmount: "1,000,000 EUR",
    execPrice: "0.619606931",
    spotPrice: "2392",
    fwdPoints: "5.00",
    valueDate: "00:00:000",
    modifiedDate: "09-Sep-2024 09:22:34",
    modifiedBy: "twainm",
    ubsRef: "QOD123ABC123AA",
    lifecycle: "Pending",
  },
  {
    id: "blotter-6",
    status: "FILL",
    product: "Fwd",
    ccy: "GBPUSD",
    side: "BUY",
    execAmount: "500,000 EUR",
    execPrice: "0.6379985…",
    spotPrice: "656",
    fwdPoints: "0.00",
    valueDate: "00:00:000",
    modifiedDate: "09-Sep-2024 09:22:34",
    modifiedBy: "C21029-…",
    ubsRef: "QOD123ABC123AA",
    lifecycle: "Complete",
  },
];
