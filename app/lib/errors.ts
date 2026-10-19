/**
 * Contract error codes as defined in the Soroban escrow contract's Error enum.
 * Mapped to user-facing messages that tell the user *what to do*, not just
 * what went wrong.
 */
export const ERROR_MESSAGES: Record<number, string> = {
  1:  "An unexpected contract error occurred. Please try again.",
  2:  "This action is not allowed in the current state.",
  3:  "This escrow has already been funded.",
  4:  "This escrow hasn't been funded yet. Fund the escrow before proceeding.",
  5:  "You are not authorized to perform this action.",
  6:  "Invalid milestone index.",
  7:  "This action is not available for the current milestone status.",
  8:  "Invalid release amount. Check the value and try again.",
  9:  "Milestone amounts are invalid.",
  10: "Invalid token address.",
  11: "The auto-release deadline has not passed yet. Please wait.",
  12: "Invalid deadline value.",
  13: "This escrow is paused. No actions can be taken until it is unpaused.",
  14: "This action requires the escrow to be unpaused.",
  15: "Invalid flag value.",
  16: "This escrow is locked and cannot be modified.",
  17: "Dispute already exists for this milestone.",
  18: "No dispute found for this milestone.",
  19: "Resolution vote already cast.",
  20: "Insufficient votes to resolve the dispute.",
  21: "Invalid evidence submission.",
  22: "Evidence submission window has closed.",
  23: "Voting window has not started yet.",
  24: "Voting window has closed.",
  25: "Invalid vote value.",
  26: "Arbitration panel is not set.",
  27: "Invalid panel configuration.",
  28: "Admin fee configuration is invalid.",
  29: "Admin fee exceeds the allowed maximum.",
  30: "Token is not whitelisted.",
  31: "Token is already whitelisted.",
  32: "Whitelist is full.",
  33: "Invalid token decimals.",
  34: "Token metadata unavailable.",
  35: "Multisig threshold not met.",
  36: "Duplicate signer in multisig.",
  37: "Invalid multisig configuration.",
};

export class WalletRejectedError extends Error {
  constructor() {
    super("You declined the transaction in your wallet.");
    this.name = "WalletRejectedError";
  }
}

/**
 * Detects whether an error was thrown by the wallet layer (user rejected the
 * signing prompt). Deliberately does NOT match backend error messages such as
 * "contract execution cancelled" — those are not wallet rejections.
 *
 * Only match phrases that wallet extensions (Freighter, Albedo, xBull, Hana)
 * actually emit when the user clicks "Reject" / "Cancel" in the extension UI.
 */
export function isWalletRejectedError(err: unknown): boolean {
  if (err instanceof WalletRejectedError) {
    return true;
  }

  if (!(err instanceof Error)) {
    return false;
  }

  const message = err.message.toLowerCase();

  // Only match explicit wallet-layer rejection phrases.
  // "cancelled" alone is intentionally excluded — backend messages can
  // contain that word ("contract execution cancelled", etc.).
  return (
    message.includes("user declined") ||
    message.includes("user rejected") ||
    message.includes("request rejected") ||
    message.includes("denied by the user") ||
    message.includes("user cancelled") ||
    message.includes("user canceled")
  );
}

export function isWalletAvailabilityError(err: unknown): boolean {
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
    message.includes("wallet unavailable")
  );
}

/**
 * Parses a contract error code from backend error messages of the form:
 *   "Contract execution reverted (error code N)"
 * Returns the numeric code, or null if none is found.
 */
export function parseContractErrorCode(message: string): number | null {
  const match = /error code\s+(\d+)/i.exec(message);
  if (!match) return null;
  const code = parseInt(match[1], 10);
  return Number.isFinite(code) ? code : null;
}

/**
 * Formats a transaction error into a user-friendly string.
 *
 * Resolution order:
 * 1. WalletRejectedError instance → wallet decline message
 * 2. Wallet availability error → install-wallet message
 * 3. Backend contract error code → specific ERROR_MESSAGES entry (or generic
 *    with code shown for unknown codes)
 * 4. Network / connectivity errors
 * 5. Raw error message as last resort
 */
export function formatTxError(err: unknown): string {
  if (isWalletRejectedError(err)) {
    return "You declined the transaction in your wallet.";
  }

  if (err instanceof Error) {
    if (isWalletAvailabilityError(err)) {
      return "Wallet not available. Install Freighter and connect your wallet.";
    }

    // Parse contract error code from backend message first — before any
    // substring matching that could misfire.
    const code = parseContractErrorCode(err.message);
    if (code !== null) {
      return (
        ERROR_MESSAGES[code] ??
        `The contract rejected this transaction (error code ${code}). Check the job state and try again.`
      );
    }

    const message = err.message.toLowerCase();

    if (message.includes("failed to fetch")) {
      return "Network error. Check your connection and try again.";
    }

    if (message.includes("unauthorized")) {
      return "You are not authorized to perform this action.";
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
