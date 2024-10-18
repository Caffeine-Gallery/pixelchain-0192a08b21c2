export const idlFactory = ({ IDL }) => {
  const Time = IDL.Int;
  const Image = IDL.Record({
    'id' : IDL.Text,
    'url' : IDL.Text,
    'contentType' : IDL.Text,
    'owner' : IDL.Principal,
    'createdAt' : Time,
  });
  const Result = IDL.Variant({ 'ok' : IDL.Text, 'err' : IDL.Text });
  return IDL.Service({
    'getImage' : IDL.Func([IDL.Text], [IDL.Opt(Image)], ['query']),
    'getImagesCount' : IDL.Func([], [IDL.Nat], ['query']),
    'listImages' : IDL.Func([], [IDL.Vec(Image)], ['query']),
    'uploadImage' : IDL.Func([IDL.Vec(IDL.Nat8), IDL.Text], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
