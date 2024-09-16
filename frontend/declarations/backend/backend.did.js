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
  const Transaction = IDL.Record({
    'fee' : IDL.Float64,
    'currentPrice' : IDL.Float64,
    'shares' : IDL.Float64,
    'transactionType' : IDL.Text,
    'date' : IDL.Int,
    'name' : IDL.Text,
    'sector' : IDL.Text,
    'assetType' : IDL.Text,
    'price' : IDL.Float64,
    'symbol' : IDL.Text,
  });
  return IDL.Service({
    'addTransaction' : IDL.Func(
        [
          IDL.Text,
          IDL.Text,
          IDL.Text,
          IDL.Text,
          IDL.Float64,
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
    'getTransactions' : IDL.Func([], [IDL.Vec(Transaction)], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
