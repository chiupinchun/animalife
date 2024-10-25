import React from "react"

export const prevent = <Arg = unknown>(
  fn?: (...args: Arg[]) => void,
  args: Arg[] = []
) => {
  const preventFn: React.ReactEventHandler<HTMLElement> = (e) => {
    e.preventDefault()
    fn?.(...args)
  }

  return preventFn
}

export const stop = <Arg = unknown>(
  fn?: (...args: Arg[]) => void,
  args: Arg[] = []
) => {
  const preventFn: React.ReactEventHandler<HTMLElement> = (e) => {
    e.stopPropagation()
    fn?.(...args)
  }

  return preventFn
}
