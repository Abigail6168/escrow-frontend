import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  isLedgerLoading,
  startLedgerOperation,
  endLedgerOperation,
  resetLedgerOperations,
  connectLedgerDevice,
  openLedgerApp,
  getLedgerAddress,
} from "@/app/lib/ledger_usb_bridge";

describe("Ledger operation tracking", () => {
  beforeEach(() => {
    resetLedgerOperations();
  });

  afterEach(() => {
    resetLedgerOperations();
  });

  it("is initially not loading", () => {
    expect(isLedgerLoading()).toBe(false);
  });

  it("tracks when an operation starts and ends", () => {
    startLedgerOperation();
    expect(isLedgerLoading()).toBe(true);

    endLedgerOperation();
    expect(isLedgerLoading()).toBe(false);
  });

  it("handles overlapping/concurrent operations correctly with a reference counter", () => {
    startLedgerOperation(); // op 1
    expect(isLedgerLoading()).toBe(true);

    startLedgerOperation(); // op 2
    expect(isLedgerLoading()).toBe(true);

    endLedgerOperation(); // op 1 ends
    expect(isLedgerLoading()).toBe(true); // Still loading because of op 2

    endLedgerOperation(); // op 2 ends
    expect(isLedgerLoading()).toBe(false);
  });

  it("resolves dummy connect/openApp/getAddress operations", async () => {
    await expect(connectLedgerDevice(1)).resolves.toBeUndefined();
    await expect(openLedgerApp(1)).resolves.toBeUndefined();
    await expect(getLedgerAddress(1)).resolves.toBe("G...");
  });
});
