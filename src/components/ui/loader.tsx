import { useEffect, useMemo, useState } from "react"

export const TextLoader = ({ text = 'loading', interval = 300, indicator = '.', maxLength = 4 }: { text?: string; interval?: number; indicator?: string; maxLength?: number; }) => {
  const [output, setOutput] = useState(text)

  const dict = useMemo(() => {
    return Array.from({ length: maxLength }).reduce((d: Record<string, string>, _, i) => {
      d[i + 1] = indicator.repeat(i + 1)
  
      return d
    }, {})
  }, [maxLength, indicator])

  useEffect(() => {
    const id = setInterval(() => {
      const diff = maxLength - output.split(text)[1].length

      setOutput(`${diff === 0 ? text : `${output}${dict[diff - (diff - 1)]}`}`)
    }, interval)
  
    return () => {
      clearInterval(id)
    }
  }, [output])

  return output
}