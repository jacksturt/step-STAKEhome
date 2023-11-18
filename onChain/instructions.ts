import { Stake, IDL } from "./types";
import * as anchor from "@project-serum/anchor";
import { Program, Provider, AnchorProvider, BN } from "@project-serum/anchor";
import {
  PublicKey,
  ComputeBudgetProgram,
  Transaction,
  Keypair,
  SYSVAR_RENT_PUBKEY,
  SystemProgram,
  sendAndConfirmTransaction,
  sendAndConfirmRawTransaction,
  VersionedTransaction,
  Connection,
  NonceAccount,
  LAMPORTS_PER_SOL,
  NONCE_ACCOUNT_LENGTH,
  TransactionSignature,
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
import tweetnacl from "tweetnacl";

export const emitPrice = async (
  provider: AnchorProvider,
  publicKey: PublicKey,
  sendTransaction: (
    transaction: Transaction | VersionedTransaction,
    connection: Connection,
    options?: SendTransactionOptions | undefined
  ) => Promise<TransactionSignature>
): Promise<number> => {
  let ratio = 1.24;
  const signatures = await provider.connection.getSignaturesForAddress(
    new PublicKey(STAKING_PROGRAM_ID)
  );
  for (const signature of signatures) {
    const parsedTransactionData =
      await provider.connection.getParsedTransaction(signature.signature, {
        commitment: "confirmed",
      });
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
) => {
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
  const bufferInfo: Uint8Array = new Uint8Array([
    ...new Uint8Array(stepPK.toBuffer()),
    ...new Uint8Array(new PublicKey(STAKING_PROGRAM_ID).toBuffer()),
  ]);
  //   const hashed = tweetnacl.hash(bufferInfo);
  const nonceAccount = NonceAccount.fromAccountData(bufferInfo);
  const nonce = nonceAccount.nonce;
  console.log("hashed", nonce);
  //   const ix = await program.methods
  //     .stake(nonce, amount)
  //     .accounts(accounts)
  //     .instruction();

  //   const { blockhash, lastValidBlockHeight } =
  //     await provider.connection.getLatestBlockhash();
  //   const txInfo = {
  //     /** The transaction fee payer */
  //     feePayer: publicKey,
  //     /** A recent blockhash */
  //     blockhash: blockhash,
  //     /** the last block chain can advance to before tx is exportd expired */
  //     lastValidBlockHeight: lastValidBlockHeight,
  //   };
  //   const tx = new Transaction(txInfo).add(ix);
  //   const res = await sendTransaction(tx, provider.connection);
  //   const t = await provider.connection.getTransaction(res, {
  //     commitment: "confirmed",
  //   });
  //   console.log(tx, res, t);
};

const createNonceAccount = async (
  publicKey: PublicKey,
  connection: Connection,

  sendTransaction: (
    transaction: Transaction | VersionedTransaction,
    connection: Connection,
    options?: SendTransactionOptions | undefined
  ) => Promise<TransactionSignature>
) => {
  const nonceKeypair = Keypair.generate();
  const tx = new Transaction();

  // the fee payer can be any account
  tx.feePayer = publicKey;

  // to create the nonce account, you can use fetch the recent blockhash
  // or use a nonce from a different, pre-existing nonce account
  tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

  tx.add(
    // create system account with the minimum amount needed for rent exemption.
    // NONCE_ACCOUNT_LENGTH is the space a nonce account takes
    SystemProgram.createAccount({
      fromPubkey: publicKey,
      newAccountPubkey: nonceKeypair.publicKey,
      lamports: 0.0015 * LAMPORTS_PER_SOL,
      space: NONCE_ACCOUNT_LENGTH,
      programId: SystemProgram.programId,
    }),
    // initialise nonce with the created nonceKeypair's pubkey as the noncePubkey
    // also specify the authority of the nonce account
    SystemProgram.nonceInitialize({
      noncePubkey: nonceKeypair.publicKey,
      authorizedPubkey: publicKey,
    })
  );

  // sign the transaction with both the nonce keypair and the authority keypair
  tx.partialSign(nonceKeypair);

  // send the transaction
  const sig = await sendTransaction(tx, connection);
  console.log("Nonce initiated: ", sig);

  const accountInfo = await connection.getAccountInfo(nonceKeypair.publicKey);
  const nonceAccount = NonceAccount.fromAccountData(accountInfo!.data);
};
