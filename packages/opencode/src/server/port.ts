export const DEFAULT_PORT = 4096
export const AUTO_PORT_ATTEMPTS = 20

export function autoPortCandidates() {
  return Array.from({ length: AUTO_PORT_ATTEMPTS }, (_, index) => DEFAULT_PORT + index)
}

export function firstAvailable<T>(start: (port: number) => T | undefined) {
  for (const port of autoPortCandidates()) {
    const result = start(port)
    if (result) return result
  }
}

export function firstAvailablePromise<T>(start: (port: number) => Promise<T>) {
  return autoPortCandidates().reduce<Promise<T | undefined>>(
    async (previous, port) => (await previous) ?? start(port).catch(() => undefined),
    Promise.resolve(undefined),
  )
}

export * as ServerPort from "./port"
