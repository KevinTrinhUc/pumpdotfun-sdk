import { Keypair, Connection, PublicKey } from "@solana/web3.js";
import { PumpFunSDK, CreateTokenMetadata } from "../src";
import { AnchorProvider, Wallet, BorshCoder } from "@coral-xyz/anchor";

// https://solscan.io/tx/4NyKZBhaaQnVbAmuCdcWynVcRoGs2g46xhfCDh7AYYyJfrtpqJLqmXwUGgi4pkosiebcthjVYugQJW4KBk97LqhT

const keypair = Keypair.fromSecretKey(
  Uint8Array.from(require("/Users/kien6034/.config/solana/id.json"))
);

const connection = new Connection("https://api.mainnet-beta.solana.com");
const wallet = new Wallet(keypair);
const provider: AnchorProvider = new AnchorProvider(connection, wallet);
const pumpFunSDK = new PumpFunSDK(provider);

(async () => {
  const global = await pumpFunSDK.program.account.global.fetch(
    "4wTV1YmiEkRvAtNtsSGPtUrqRYQMe5SKy2uB4Jjaxnjf"
  );

  const accountInfo = await connection.getAccountInfo(
    new PublicKey("BpcpAQV1mVcfZxdGmRfEHheS6aU8MBcCweeRFakwths9"),
    { minContextSlot: 272997547 }
  );

  if (!accountInfo) {
    throw new Error("Account not found");
  }

  const curve = pumpFunSDK.program.coder.accounts.decode(
    "bondingCurve",
    accountInfo.data
  );

  console.log("Real SOL reserves: ", curve.realSolReserves.toString());
  console.log("Virtual SOL reserves: ", curve.virtualSolReserves.toString());
  console.log("Real token reserves: ", curve.realTokenReserves.toString());
  console.log(
    "Virtual token reserves: ",
    curve.virtualTokenReserves.toString()
  );
  console.log("Token total supply: ", curve.tokenTotalSupply.toString());
})();
