export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'addHolding' : IDL.Func([IDL.Text, IDL.Float64], [], []),
    'getHoldings' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Float64))],
        ['query'],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
