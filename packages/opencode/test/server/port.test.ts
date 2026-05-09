import { describe, expect, test } from "bun:test"
import { ServerPort } from "../../src/server/port"

describe("server port selection", () => {
  test("uses deterministic auto port candidates", () => {
    expect(ServerPort.autoPortCandidates().slice(0, 3)).toEqual([4096, 4097, 4098])
    expect(ServerPort.autoPortCandidates()).toHaveLength(20)
  })

  test("returns first available candidate", () => {
    expect(ServerPort.firstAvailable((port) => (port === 4098 ? port : undefined))).toBe(4098)
  })

  test("returns undefined when no candidate is available", async () => {
    await expect(ServerPort.firstAvailablePromise(async () => Promise.reject(new Error("busy")))).resolves.toBeUndefined()
  })
})
