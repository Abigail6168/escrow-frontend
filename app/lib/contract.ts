import {
  Contract,
  TransactionBuilder,
  BASE_FEE,
  nativeToScVal,
  Address,
} from "@stellar/stellar-sdk";
import { Server } from "@stellar/stellar-sdk/rpc";

export const RPC_URL = process.env.NEXT_PUBLIC_SOROBAN_RPC_URL || "https://soroban-testnet.stellar.org";
import { NETWORK_PASSPHRASE, CONTRACT_ID } from "./network_config";
export { NETWORK_PASSPHRASE, CONTRACT_ID };

export const server = new Server(RPC_URL);

export function getContract() {
  return new Contract(CONTRACT_ID);
}

export async function buildTx(
  sourceAddress: string,
  operation: Parameters<TransactionBuilder["addOperation"]>[0]
) {
  const account = await server.getAccount(sourceAddress);
  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(operation)
    .setTimeout(30)
    .build();
  return await server.prepareTransaction(tx);
}

export function addressToScVal(address: string) {
  return Address.fromString(address).toScVal();
}

export function i128ToScVal(value: bigint) {
  return nativeToScVal(value, { type: "i128" });
}
