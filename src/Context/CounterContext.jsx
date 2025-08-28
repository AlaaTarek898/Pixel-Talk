import { createContext, useState } from "react"

export const CounterContext = createContext()

export default function CounterContextProvider({ children }) {
  const x = 4;
  const [counter, setCounter] = useState(0)

  return (
    <CounterContext.Provider value={{ x, counter, setCounter }}>
      {children}
    </CounterContext.Provider>
  )
}
