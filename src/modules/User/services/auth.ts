interface Response {
  token: string;
  user: {
    name: string;
    email: string;
  };
}

export function signIn(): Promise<Response> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        token: 'asdf',
        user: {
          name: 'Samuel',
          email: 'sam@gmail.com',
        },
      });
    }, 1000);
  });
}
