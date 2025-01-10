export const delay = (ms: number = 1000): Promise<void> => new Promise(res =>
  setTimeout(() => {
    return res(undefined)
  }, ms)
)