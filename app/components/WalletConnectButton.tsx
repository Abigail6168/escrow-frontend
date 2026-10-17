"use client";

import { useEffect, useState } from "react";
import { useWallet, type SupportedWalletId } from "@/app/context/WalletContext";
import WalletSelectorModal from "@/app/components/WalletSelectorModal";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 rounded";

/**
 * "Connect Wallet" button that opens WalletSelectorModal. Picking a wallet in
 * the modal sets the selected provider, then calls `connect()` once the
 * context has picked up the new provider id.
 */
export default function WalletConnectButton() {
  const { address, connect, isConnecting, selectedWalletId, setSelectedWalletId } =
    useWallet();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState<SupportedWalletId | null>(null);

  useEffect(() => {
    if (pending && pending === selectedWalletId) {
      setPending(null);
      setOpen(false);
      void connect();
    }
  }, [pending, selectedWalletId, connect]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        disabled={isConnecting}
        className={`bg-accent hover:bg-accent-hover disabled:opacity-50 text-text-primary text-sm font-medium px-4 py-2 rounded-lg transition ${focusRing}`}
      >
        {isConnecting ? "Connecting..." : "Connect Wallet"}
      </button>
      <WalletSelectorModal
        isOpen={open}
        onClose={() => setOpen(false)}
        activeAddress={address}
        selectedWalletId={selectedWalletId}
        isLoading={isConnecting}
        onConnect={(id) => {
          setSelectedWalletId(id);
          setPending(id);
        }}
      />
    </>
  );
}
