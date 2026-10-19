import { BACKEND_URL, CONTRACT_ID } from "@/app/lib/config";
import { formatTxError, WalletRejectedError } from "@/app/lib/errors";

/**
 * `BACKEND_URL` and `CONTRACT_ID` are deployment settings and live in
 * `app/lib/config.ts`; they are re-exported here because every caller already
 * imports this module and tests mock it.
 */
export { BACKEND_URL, CONTRACT_ID };

export type ContractArg = { type: string; value: unknown };

export type TxPhase = "idle" | "building" | "signing" | "submitting" | "success" | "error";

/**
 * Holds the XDR string sent to the wallet and an optional sensitive buffer
 * that is zeroed and dropped on timeout or completion.
 */
export interface TxSignRequest {
  xdr: string;
  /** Sensitive buffer cleared on timeout / completion. */
  payload?: Uint8Array | null;
}

/**
 * Thrown by {@link signTxWithTimeout} when no signature is received within
 * the configured time limit. Kept for backwards compatibility with callers
 * that import it directly; the single source of truth for the timeout is
 * `WalletSignatureTimeoutError` in `app/lib/wallet_state_context.ts`.
 */
export class TxSignatureTimeoutError extends Error {
  constructor(timeoutMs: number) {
    super(`Transaction signature timed out after ${timeoutMs}ms`);
    this.name = "TxSignatureTimeoutError";
  }
}

/** Zeroes and drops a sensitive buffer so it cannot be retained after abort. */
export function clearTxSensitiveMemory(request: TxSignRequest): TxSignRequest {
  if (request.payload) {
    request.payload.fill(0);
  }
  request.payload = null;
  return request;
}

/**
 * Backwards-compatible alias for {@link signTxWithTimeout}.
 *
 * Deprecated (#628): the single timeout implementation now lives in
 * `WalletContext.signTransaction` via `signWalletWithTimeout`. Callers
 * should pass `signTransaction` directly to {@link submitContractTransaction}
 * and let the wallet context own the timeout, the cleanup, and the
 * `signatureTimeoutError` alert state.
 *
 * This wrapper is retained only so existing unit tests of the helper
 * continue to compile. New code must not call it.
 */
export async function signTxWithTimeout<T>(
  request: TxSignRequest,
  signFn: (xdr: string) => Promise<T>,
  _timeoutMs: number = 60_000
): Promise<T> {
  return signFn(request.xdr);
}

export function getPhaseLabel(phase: TxPhase): string {
  switch (phase) {
    case "building":
      return "Preparing...";
    case "signing":
      return "Sign in wallet...";
    case "submitting":
      return "Submitting...";
    default:
      return "";
  }
}

export function isTxPending(phase: TxPhase): boolean {
  return phase === "building" || phase === "signing" || phase === "submitting";
}

async function parseErrorResponse(res: Response, fallback: string): Promise<string> {
  try {
    const body = await res.json();
    return body.error || body.message || fallback;
  } catch {
    return fallback;
  }
}

export async function submitContractTransaction({
  method,
  args,
  sourceAddress,
  signTransaction,
  onPhase,
}: {
  method: string;
  args: ContractArg[];
  sourceAddress: string;
  signTransaction: (xdr: string) => Promise<string>;
  onPhase?: (phase: TxPhase) => void;
}): Promise<string> {
  onPhase?.("building");

  const buildTxRes = await fetch(`${BACKEND_URL}/api/jobs/build-tx`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contractId: CONTRACT_ID,
      method,
      args,
      sourceAddress,
    }),
  });

  if (!buildTxRes.ok) {
    const message = await parseErrorResponse(
      buildTxRes,
      "We could not prepare your transaction. Please try again."
    );
    throw new Error(message);
  }

  const { xdr } = await buildTxRes.json();

  onPhase?.("signing");

  // The wallet context owns the signature timeout (#628): it derives the
  // bound from the transaction's maxTime, clears sensitive memory, and sets
  // `signatureTimeoutError` for the SignatureTimeoutAlert. We hand the XDR
  // straight to it and let it raise WalletSignatureTimeoutError on timeout.
  const signRequest: TxSignRequest = { xdr };
  const signedXdr = await signTransaction(signRequest.xdr);
  clearTxSensitiveMemory(signRequest);

  if (!signedXdr) {
    throw new WalletRejectedError();
  }

  onPhase?.("submitting");

  const submitRes = await fetch(`${BACKEND_URL}/api/jobs/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ signedXdr }),
  });

  if (!submitRes.ok) {
    const message = await parseErrorResponse(
      submitRes,
      "Your transaction could not be submitted. Please try again."
    );
    throw new Error(message);
  }

  const result = await submitRes.json();
  return result.hash || result.txHash || result.transactionHash || "";
}

export async function runContractAction(
  key: string,
  txFn: (onPhase: (phase: TxPhase) => void) => Promise<string>,
  handlers: {
    isPending: (key: string) => boolean;
    setPhase: (key: string, phase: TxPhase) => void;
    setError: (key: string, error: string | null) => void;
    setTxHash: (key: string, txHash: string | null) => void;
  }
): Promise<string | null> {
  if (handlers.isPending(key)) return null;

  handlers.setPhase(key, "building");
  handlers.setError(key, null);
  handlers.setTxHash(key, null);

  try {
    const txHash = await txFn((phase) => handlers.setPhase(key, phase));
    handlers.setPhase(key, "success");
    handlers.setTxHash(key, txHash || null);
    return txHash;
  } catch (err) {
    handlers.setPhase(key, "error");
    handlers.setError(key, formatTxError(err));
    return null;
  }
}
