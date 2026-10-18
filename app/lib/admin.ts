import { BACKEND_URL } from "@/app/lib/transactions";
import { AdminResponseSchema, validateResponse } from "@/app/lib/api_schemas";

/**
 * Query the contract to get the admin address.
 *
 * Uses the backend's query endpoint to call the `get_admin` contract method.
 * Validates the response with Zod so an unexpected backend shape is caught
 * explicitly rather than silently returning null.
 * Returns the admin address or null if the query fails.
 */
export async function fetchAdminAddress(
  contractId: string,
  options?: { signal?: AbortSignal },
): Promise<string | null> {
  const endpoint = "/api/jobs/query";
  try {
    const res = await fetch(`${BACKEND_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contractId,
        method: "get_admin",
        args: [],
      }),
      signal: options?.signal,
    });

    if (!res.ok) {
      console.error(`Admin query failed with status ${res.status}`);
      return null;
    }

    const rawData: unknown = await res.json();
    const data = validateResponse(AdminResponseSchema, rawData, endpoint);

    // Backend might return the address directly or wrapped in a success object
    if (typeof data === "string" && data.startsWith("G")) {
      return data;
    }

    if (
      typeof data === "object" &&
      data !== null &&
      "data" in data &&
      typeof data.data === "string" &&
      data.data.startsWith("G")
    ) {
      return data.data;
    }

    // Try result field as well
    if (
      typeof data === "object" &&
      data !== null &&
      "result" in data &&
      typeof data.result === "string" &&
      data.result.startsWith("G")
    ) {
      return data.result;
    }

    console.error("Admin address not found in response", data);
    return null;
  } catch (err) {
    console.error("Failed to fetch admin address", err);
    return null;
  }
}

/**
 * Check if the given address is the contract admin.
 */
export async function isAdmin(
  walletAddress: string | null,
  contractId: string,
  options?: { signal?: AbortSignal },
): Promise<boolean> {
  if (!walletAddress) return false;

  const adminAddress = await fetchAdminAddress(contractId, options);
  return adminAddress !== null && adminAddress === walletAddress;
}

/**
 * Query whether the configured escrow's job has been funded.
 *
 * The contract only allows whitelist changes before funding (it returns
 * `AlreadyFunded` afterwards), so the admin page uses this to disable the
 * whitelist actions. Returns null when the state cannot be determined.
 */
export async function fetchEscrowFunded(
  contractId: string,
  options?: { signal?: AbortSignal }
): Promise<boolean | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/jobs/query`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contractId, method: "get_job", args: [] }),
      signal: options?.signal,
    });
    if (!res.ok) return null;

    const data = await res.json();
    const job = data?.success ? data.data : (data?.result ?? data);
    return typeof job?.funded === "boolean" ? job.funded : null;
  } catch {
    return null;
  }
}
