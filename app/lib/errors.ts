export class WalletRejectedError extends Error {
  constructor() {
    super("You declined the transaction in your wallet.");
    this.name = "WalletRejectedError";
  }
}

// =============================================================================
// Per-wallet availability error (#687)
// =============================================================================

/** Metadata for each supported wallet. */
interface WalletInfo {
  label: string;
  installUrl: string;
}

const WALLET_INFO: Record<string, WalletInfo> = {
  freighter: {
    label: "Freighter",
    installUrl:
      "https://www.freighter.app/",
  },
  albedo: {
    label: "Albedo",
    installUrl: "https://albedo.link/",
  },
  xbull: {
    label: "xBull",
    installUrl: "https://xbull.app/",
  },
  hana: {
    label: "Hana",
    installUrl: "https://hanastellar.com/",
  },
};

/**
 * Thrown when the selected wallet extension is missing or locked.
 *
 * Carrying the `walletId` allows {@link formatTxError} to produce a
 * wallet-specific install link instead of always naming Freighter.
 */
export class WalletUnavailableError extends Error {
  readonly walletId: string;

  constructor(walletId: string) {
    const info = WALLET_INFO[walletId.toLowerCase()];
    const label = info?.label ?? walletId;
    super(
      `${label} isn't available. Make sure the extension is installed and unlocked.`
    );
    this.name = "WalletUnavailableError";
    this.walletId = walletId.toLowerCase();
  }
}

export function isWalletRejectedError(err: unknown): boolean {
  if (err instanceof WalletRejectedError) {
    return true;
  }

  if (!(err instanceof Error)) {
    return false;
  }

  const message = err.message.toLowerCase();
  return (
    message.includes("user declined") ||
    message.includes("user rejected") ||
    message.includes("request rejected") ||
    message.includes("denied by the user") ||
    message.includes("cancelled") ||
    message.includes("canceled")
  );
}

export function isWalletAvailabilityError(err: unknown): boolean {
  if (err instanceof WalletUnavailableError) {
    return true;
  }

  if (!(err instanceof Error)) {
    return false;
  }

  const message = err.message.toLowerCase();
  return (
    message.includes("freighter not found") ||
    message.includes("wallet not found") ||
    message.includes("wallet extension") ||
    message.includes("extension not installed") ||
    message.includes("no wallet") ||
    message.includes("wallet unavailable") ||
    message.includes("isn't available")
  );
}

/**
 * Formats a transaction error into a user-facing message.
 *
 * @param err   - The thrown error.
 * @param walletId - Optional wallet identifier (e.g. "freighter", "xbull",
 *   "albedo", "hana") used to produce a wallet-specific install link when
 *   `err` is a plain availability error that does not carry the wallet id
 *   itself. If `err` is a {@link WalletUnavailableError} its own `walletId`
 *   takes precedence.
 */
export function formatTxError(err: unknown, walletId?: string): string {
  if (isWalletRejectedError(err)) {
    return "You declined the transaction in your wallet.";
  }

  if (err instanceof WalletUnavailableError) {
    return buildWalletUnavailableMessage(err.walletId);
  }

  if (err instanceof Error) {
    const message = err.message.toLowerCase();

    if (isWalletAvailabilityError(err)) {
      return buildWalletUnavailableMessage(walletId);
    }

    if (message.includes("failed to fetch") || message.includes("network")) {
      return "Network error. Check your connection and try again.";
    }

    if (message.includes("unauthorized")) {
      return "You are not authorized to perform this action.";
    }

    if (message.includes("deadline")) {
      return "The auto-release deadline has not passed yet.";
    }

    if (message.includes("invalid amount") || message.includes("invalid_amount")) {
      return "Invalid release amount. Check the value and try again.";
    }

    if (message.includes("invalid status") || message.includes("invalid_status")) {
      return "This action is not available for the current milestone status.";
    }

    if (message.includes("contract") || message.includes("simulation")) {
      return "The contract rejected this transaction. Check the job state and try again.";
    }

    return err.message || "Something went wrong. Please try again.";
  }

  return "Something went wrong. Please try again.";
}

/** Builds the wallet-specific unavailability message with an install link. */
function buildWalletUnavailableMessage(walletId?: string): string {
  const key = (walletId ?? "").toLowerCase();
  const info = WALLET_INFO[key];

  if (info) {
    return `${info.label} isn't available. Make sure the extension is installed and unlocked. Install at ${info.installUrl}`;
  }

  // Unknown or no wallet id — fall back to a generic message.
  return "Wallet not available. Make sure the extension is installed and unlocked.";
}
