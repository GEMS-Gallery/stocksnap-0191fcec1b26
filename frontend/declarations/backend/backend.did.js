export const idlFactory = ({ IDL }) => {
  const Holding = IDL.Record({
    'currentPrice' : IDL.Float64,
    'purchasePrice' : IDL.Float64,
    'name' : IDL.Text,
    'sector' : IDL.Text,
    'quantity' : IDL.Float64,
    'assetType' : IDL.Text,
    'symbol' : IDL.Text,
  });
  return IDL.Service({
    'addHolding' : IDL.Func(
        [
          IDL.Text,
          IDL.Text,
          IDL.Float64,
          IDL.Float64,
          IDL.Float64,
          IDL.Text,
          IDL.Text,
        ],
        [],
        [],
      ),
    'getAllocations' : IDL.Func(
        [],
        [
          IDL.Record({
            'cash' : IDL.Float64,
            'crypto' : IDL.Float64,
            'fixedIncome' : IDL.Float64,
            'equity' : IDL.Float64,
          }),
        ],
        ['query'],
      ),
    'getHoldings' : IDL.Func([], [IDL.Vec(Holding)], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
