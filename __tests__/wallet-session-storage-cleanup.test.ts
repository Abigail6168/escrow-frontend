import { describe, it, expect } from "vitest";
import {
  WALLET_SESSION_STORAGE_KEYS,
  clearAllWalletSessionStorage,
} from "../app/lib/wallet_session_storage_cleanup";

describe("clearAllWalletSessionStorage", () => {
  it("removes every wallet key and leaves unrelated keys", () => {
    const data = new Map<string, string>();
    for (const k of WALLET_SESSION_STORAGE_KEYS) data.set(k, "GADDRESS");
    data.set("theme", "dark");
    clearAllWalletSessionStorage({ removeItem: (k: string) => void data.delete(k) });
    expect([...data.keys()]).toEqual(["theme"]);
  });
});
