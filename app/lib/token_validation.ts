import {
  Contract,
  TransactionBuilder,
  nativeToScVal,
  xdr,
  Account,
} from "@stellar/stellar-sdk";
import { Server } from "@stellar/stellar-sdk/rpc";
import { Api } from "@stellar/stellar-sdk/rpc";
import { RPC_URL, NETWORK_PASSPHRASE } from "@/app/lib/contract";

/**
 * Validate a manually entered contract address as a SEP-41 token by simulating
 * the `symbol()` and `decimals()` invocations against the Soroban RPC. This
 * does not submit a transaction — it uses `server.simulateTransaction` which
 * is a read-only call.
 *
 * SEP-41 token contracts implement `symbol() -> String` and
 * `decimals() -> u32`. If either call fails, the address is not a token.
 */

export interface TokenValidationResult {
  /** true when the address is a SEP-41 token. */
  valid: boolean;
  /** Token symbol, e.g. "USDC". Present only when valid. */
  symbol?: string;
  /** Token decimals, e.g. 7. Present only when valid. */
  decimals?: number;
  /** Human-readable error when the address is not a token or the call failed. */
  error?: string;
}

/**
 * Build a simulation-only transaction that calls the given contract method
 * with no arguments (symbol/decimals are zero-arity reads).
 *
 * `simulateTransaction` does not require a funded account — it just needs a
 * valid Stellar address format as the source.
 */
async function simulateTokenCall(
  tokenAddress: string,
  method: string,
): Promise<string> {
  const server = new Server(RPC_URL);
  const contract = new Contract(tokenAddress);
  const operation = contract.call(method, nativeToScVal([]));

  // Dummy source — simulation does not check balance, only the address format.
  const dummySource = "GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
  const account = new Account(dummySource, "0");

  const tx = new TransactionBuilder(account, {
    fee: "100",
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(operation)
    .setTimeout(30)
    .build();

  const response = await server.simulateTransaction(tx);

  if (Api.isSimulationError(response)) {
    throw new Error(response.error);
  }

  if (!response.result) {
    throw new Error("Simulation returned no result");
  }

  return scValToNative(response.result.retval);
}

/** Convert an ScVal to its native JS string representation. */
function scValToNative(scVal: xdr.ScVal): string {
  switch (scVal.switch()) {
    case xdr.ScValType.scvString():
      return scVal.str().toString();
    case xdr.ScValType.scvU32():
      return scVal.u32().toString();
    case xdr.ScValType.scvI32():
      return scVal.i32().toString();
    // Some token contracts return a symbol as a fixed-length byte array.
    case xdr.ScValType.scvBytes():
      return Buffer.from(scVal.bytes()).toString("utf8");
    default:
      throw new Error(`Unexpected ScVal type: ${scVal.switch().name}`);
  }
}

/**
 * Validate a contract address as a SEP-41 token by simulating `symbol()` and
 * `decimals()` calls. Returns a structured result so the UI can show the
 * token info or an error.
 */
export async function validateTokenContract(
  tokenAddress: string,
): Promise<TokenValidationResult> {
  try {
    const symbolResult = await simulateTokenCall(tokenAddress, "symbol");
    const decimalsResult = await simulateTokenCall(tokenAddress, "decimals");
    const decimals = parseInt(decimalsResult, 10);

    if (!symbolResult || Number.isNaN(decimals)) {
      return {
        valid: false,
        error:
          "This contract does not implement the SEP-41 token interface (symbol/decimals not found).",
      };
    }

    return {
      valid: true,
      symbol: symbolResult,
      decimals,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      valid: false,
      error: `Could not validate this contract as a token: ${message}`,
    };
  }
}
