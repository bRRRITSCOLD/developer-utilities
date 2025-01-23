import { random } from "lodash"

export const delay = (ms: number = 1000): Promise<void> => new Promise(res =>
  setTimeout(() => {
    return res(undefined)
  }, ms)
)

export const randomDelayTest = async () => {
  await delay(random(1000, 3000))
}