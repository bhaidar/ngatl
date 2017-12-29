export const getMockUser = function () {
  return {
    id : '123',
    authenticationToken : getTestToken(),
    password : '123456',
    email : 'test@ngatl.com',
    acceptNewsletter : true,
    firstName : 'Test',
    lastName : 'User',
    gender : 'M',
    creationOrigin : 'web',
    iat : 1486886400000, // 2/12/2017
    exp : 2686032000000 // 2/12/2055
  };
};

export const getMockUserWithCustom = function (
  customData: any,
  ignoreDefaults?: boolean,
  /*exclude default mock data*/
) {
  const updatedUser = {};
  if ( !ignoreDefaults ) {
    const mock = getMockUser();
    for ( const key in mock ) {
      updatedUser[key] = mock[key]; // take defaults
    }
  }
  // modify based on incoming
  for ( const key in customData ) {
    updatedUser[key] = customData[key]; // update propterites
  }
  return updatedUser;
};

export const getTestToken = function () {
  return `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NlcHROZXdzbGV0dGVyIjp0cnVlLCJhZ2UiOiIwMDIiLCJhdXRoZW50aWNhdGlvblRva2VuIjpudWxsLCJjb3VudHJ5SWQiOm51bGwsImNyZWF0ZWRBdCI6bnVsbCwiY3JlYXRpb25PcmlnaW4iOiJ3ZWIiLCJjdWx0dXJlIjpudWxsLCJlbWFpbCI6InRlc3QrNWZlMGQwODktMGZhYi04MmU5LWM3ZDk2Y2IxZDZjZUB1Z3JvdXBtZWRpYS5jb20iLCJmaXJzdE5hbWUiOiJNYXJ0aW4iLCJnZW5kZXIiOiJNIiwiaWQiOjIsImxhc3ROYW1lIjoiUG9pcmllciIsInBhc3N3b3JkIjoiMTIzNDU2IiwicmVnaW9uQ29kZSI6bnVsbCwicmVzZXRQYXNzd29yZFRpbWUiOm51bGwsInJvbGVzIjpudWxsLCJ1cGRhdGVkQXQiOm51bGwsInVzZXJuYW1lIjpudWxsfQ.r8ud9FZcjhR12DdXv7encLcGm9tla68Zow9m02cJLZ4`;
};
