
"use client"

import * as React from "react"

export function useHydrated() {
  const [hydrated, setHydrated] = React.useState(false)

  React.useEffect(() => {
    setHydrated(true)
  }, [])

  return hydrated
}
