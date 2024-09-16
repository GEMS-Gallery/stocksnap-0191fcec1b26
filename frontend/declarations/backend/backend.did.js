export const idlFactory = ({ IDL }) => {
  const Holding = IDL.Record({
    'purchasePrice' : IDL.Float64,
    'quantity' : IDL.Float64,
  });
  return IDL.Service({
    'addHolding' : IDL.Func([IDL.Text, IDL.Float64, IDL.Float64], [], []),
    'getHoldings' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Text, Holding))],
        ['query'],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
