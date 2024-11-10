// for better Try/Catch

// mark: for more reference
// 1. https://effect.website/
// 2. https://true-myth.js.org/

function wait(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function getUser(id: number) {
  await wait(1000);

  if (id === 2) {
    throw new Error('User not found');
  }

  return { id, name: 'John' };
}

function catchError<T>(asyncFn: Promise<T>): Promise<[undefined, T] | [Error]> {
  return asyncFn
    .then((data) => {
      return [undefined, data] as [undefined, T];
    })
    .catch((error) => {
      return [error] as [Error];
    });
}

function catchErrorType<T, E extends new (msg?: string) => Error>(
  asyncFn: Promise<T>,
  errorsToCatch?: E[]
): Promise<[undefined, T] | [InstanceType<E>]> {
  return asyncFn
    .then((data) => {
      return [undefined, data] as [undefined, T];
    })
    .catch((error) => {
      if (errorsToCatch) {
        for (const errorType of errorsToCatch) {
          if (error instanceof errorType) {
            return [error] as [InstanceType<E>];
          }
        }
      } else {
        return [error] as [InstanceType<E>];
      }

      throw error;
    });
}

const [error, data] = await catchError(getUser(1));

export {}; // Add this line to make the file a module
