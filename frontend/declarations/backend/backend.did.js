export const idlFactory = ({ IDL }) => {
  const Activity = IDL.Record({
    'fee' : IDL.Float64,
    'activityType' : IDL.Text,
    'shares' : IDL.Float64,
    'date' : IDL.Int,
    'account' : IDL.Text,
    'price' : IDL.Float64,
    'symbol' : IDL.Text,
  });
  return IDL.Service({
    'addActivity' : IDL.Func(
        [
          IDL.Text,
          IDL.Text,
          IDL.Text,
          IDL.Text,
          IDL.Float64,
          IDL.Float64,
          IDL.Float64,
        ],
        [],
        [],
      ),
    'getActivities' : IDL.Func([], [IDL.Vec(Activity)], ['query']),
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
    'getBaseCurrency' : IDL.Func([], [IDL.Text], ['query']),
    'importActivities' : IDL.Func([IDL.Vec(Activity)], [], []),
    'setBaseCurrency' : IDL.Func([IDL.Text], [], []),
  });
};
export const init = ({ IDL }) => { return []; };
