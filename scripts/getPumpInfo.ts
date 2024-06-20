import { Keypair, Connection } from "@solana/web3.js";
import { PumpFunSDK, CreateTokenMetadata } from "../src";
import { AnchorProvider, Wallet } from "@coral-xyz/anchor";

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

  const bondingCurveInfo = await pumpFunSDK.program.account.bondingCurve.fetch(
    "BpcpAQV1mVcfZxdGmRfEHheS6aU8MBcCweeRFakwths9"
  );

  console.log("=========== Global Info ===============\n");
  console.log(
    `Initial Real Token Reserves: ${global.initialRealTokenReserves.toString()}`
  );
  console.log(
    `Initial Virtual SOL Reserves: ${global.initialVirtualSolReserves.toString()}`
  );
  console.log(
    `Initial Virtual Token Reserves: ${global.initialVirtualTokenReserves.toString()}`
  );
  console.log(`Token Total Supply: ${global.tokenTotalSupply.toString()}`);
  console.log("fee basis point: ", global.feeBasisPoints.toString());

  console.log("\n =========== Bonding Curve Info ===============\n");
  console.log(
    "Real SOL reserves: ",
    bondingCurveInfo.realSolReserves.toString()
  );
  console.log(
    "Virtual SOL reserves: ",
    bondingCurveInfo.virtualSolReserves.toString()
  );
  console.log(
    "Real token reserves: ",
    bondingCurveInfo.realTokenReserves.toString()
  );
  console.log(
    "Virtual token reserves: ",
    bondingCurveInfo.virtualTokenReserves.toString()
  );
  console.log(
    "Token total supply: ",
    bondingCurveInfo.tokenTotalSupply.toString()
  );
})();
