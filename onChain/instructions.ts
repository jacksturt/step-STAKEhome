import { Stake, IDL } from "./types";
import { Program, AnchorProvider, BN } from "@project-serum/anchor";
import {
  PublicKey,
  Transaction,
  VersionedTransaction,
  Connection,
  TransactionSignature,
  TransactionConfirmationStrategy,
} from "@solana/web3.js";
import {
  STAKING_PROGRAM_ID,
  STEP_TOKEN_ADDRESS,
  STEP_TOKEN_VAULT_ADDRESS,
  XSTEP_TOKEN_ADDRESS,
} from "../utils/globals";
import { SendTransactionOptions } from "@solana/wallet-adapter-base";
import {
  getAssociatedTokenAddressSync,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

export const emitPrice = async (connection: Connection): Promise<number> => {
  let ratio = 1.24;
  const signatures = await connection.getSignaturesForAddress(
    new PublicKey(STAKING_PROGRAM_ID)
  );
  for (const signature of signatures) {
    const parsedTransactionData = await connection.getParsedTransaction(
      signature.signature,
      {
        commitment: "confirmed",
      }
    );
    const maybeTransactionType = parsedTransactionData?.meta?.logMessages?.[5];
    if (maybeTransactionType === "Program log: Instruction: EmitPrice") {
      const base64ProgramData =
        parsedTransactionData?.meta?.logMessages?.[6].split(
          "Program data: "
        )[1];
      if (base64ProgramData === undefined) continue;
      const decodedData = Buffer.from(base64ProgramData, "base64");

      // Decode the u64 field (step_per_xstep_e9) from bytes
      const u64Value = decodedData.readBigUInt64LE(0);

      // Decode the string field (step_per_xstep) from bytes
      const stringLength = decodedData.readUInt32LE(8); // Assuming string length is encoded as a 32-bit integer
      const stringValue = decodedData
        .slice(12, 12 + stringLength)
        .toString("utf-8")
        .replace(/[^\x20-\x7E]/g, "");

      ratio = parseFloat(stringValue);
      break;
    }
  }
  return ratio;
};

export const stake = async (
  provider: AnchorProvider,
  publicKey: PublicKey,
  amount: BN,
  sendTransaction: (
    transaction: Transaction | VersionedTransaction,
    connection: Connection,
    options?: SendTransactionOptions | undefined
  ) => Promise<TransactionSignature>
): Promise<TransactionConfirmationStrategy> => {
  const program = new Program<Stake>(
    IDL as unknown as Stake,
    STAKING_PROGRAM_ID,
    provider
  );
  const fromTokenAccount = getAssociatedTokenAddressSync(
    new PublicKey(STEP_TOKEN_ADDRESS),
    publicKey
  );
  const toTokenAccount = getAssociatedTokenAddressSync(
    new PublicKey(XSTEP_TOKEN_ADDRESS),
    publicKey
  );
  const stepPK = new PublicKey(STEP_TOKEN_ADDRESS);
  const accounts = {
    tokenMint: stepPK,
    xTokenMint: new PublicKey(XSTEP_TOKEN_ADDRESS),
    tokenFrom: fromTokenAccount,
    tokenFromAuthority: publicKey,
    tokenVault: new PublicKey(STEP_TOKEN_VAULT_ADDRESS),
    xTokenTo: toTokenAccount,
    tokenProgram: TOKEN_PROGRAM_ID,
  };
  const [programId, nonce] = PublicKey.findProgramAddressSync(
    [stepPK.toBuffer()],
    new PublicKey(STAKING_PROGRAM_ID)
  );
  console.log("hashed", nonce);
  const ix = await program.methods
    .stake(nonce, amount)
    .accounts(accounts)
    .instruction();

  const { blockhash, lastValidBlockHeight } =
    await provider.connection.getLatestBlockhash();
  const txInfo = {
    /** The transaction fee payer */
    feePayer: publicKey,
    /** A recent blockhash */
    blockhash: blockhash,
    /** the last block chain can advance to before tx is exportd expired */
    lastValidBlockHeight: lastValidBlockHeight,
  };
  const tx = new Transaction(txInfo).add(ix);
  const signature = await sendTransaction(tx, provider.connection);
  return { signature, blockhash, lastValidBlockHeight };
};

export const unstake = async (
  provider: AnchorProvider,
  publicKey: PublicKey,
  amount: BN,
  sendTransaction: (
    transaction: Transaction | VersionedTransaction,
    connection: Connection,
    options?: SendTransactionOptions | undefined
  ) => Promise<TransactionSignature>
): Promise<TransactionConfirmationStrategy> => {
  const program = new Program<Stake>(
    IDL as unknown as Stake,
    STAKING_PROGRAM_ID,
    provider
  );
  const toTokenAccount = getAssociatedTokenAddressSync(
    new PublicKey(STEP_TOKEN_ADDRESS),
    publicKey
  );
  const fromTokenAccount = getAssociatedTokenAddressSync(
    new PublicKey(XSTEP_TOKEN_ADDRESS),
    publicKey
  );
  const stepPK = new PublicKey(STEP_TOKEN_ADDRESS);
  const accounts = {
    tokenMint: stepPK,
    xTokenMint: new PublicKey(XSTEP_TOKEN_ADDRESS),
    xTokenFrom: fromTokenAccount,
    xTokenFromAuthority: publicKey,
    tokenVault: new PublicKey(STEP_TOKEN_VAULT_ADDRESS),
    tokenTo: toTokenAccount,
    tokenProgram: TOKEN_PROGRAM_ID,
  };
  const [programId, nonce] = PublicKey.findProgramAddressSync(
    [stepPK.toBuffer()],
    new PublicKey(STAKING_PROGRAM_ID)
  );
  console.log("hashed", nonce);
  const ix = await program.methods
    .unstake(nonce, amount)
    .accounts(accounts)
    .instruction();

  const { blockhash, lastValidBlockHeight } =
    await provider.connection.getLatestBlockhash();
  const txInfo = {
    /** The transaction fee payer */
    feePayer: publicKey,
    /** A recent blockhash */
    blockhash: blockhash,
    /** the last block chain can advance to before tx is exportd expired */
    lastValidBlockHeight: lastValidBlockHeight,
  };
  const tx = new Transaction(txInfo).add(ix);
  const signature = await sendTransaction(tx, provider.connection);
  return { signature, blockhash, lastValidBlockHeight };
};
