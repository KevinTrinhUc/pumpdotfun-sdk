import { Keypair, Connection, PublicKey } from "@solana/web3.js";
import { PumpFunSDK, CreateTokenMetadata, BondingCurveAccount } from "../src";
import { AnchorProvider, Wallet } from "@coral-xyz/anchor";

// Take data before this hash: 6mUDThYGDNxnBrgfap9hjnr9v8fjTCvYxfr1cy2S4enedNJfbADAfMkSMXtKBGrMCDcjUn9XVb2eQMNhDa2nk6Y
const data: { side: string; sol: number; amount: number }[] = [
  { side: "sell", sol: 0.5081, amount: 1930000 },
  { side: "sell", sol: 0.252, amount: 965270 },
  { side: "sell", sol: 0.2807, amount: 1080000 },
  { side: "buy", sol: 0.4901, amount: 1880000 },
  { side: "sell", sol: 0.2621, amount: 1000000 },
];
const keypair = Keypair.fromSecretKey(
  Uint8Array.from(require("/Users/kien6034/.config/solana/id.json"))
);

//solscan.io/tx/6mUDThYGDNxnBrgfap9hjnr9v8fjTCvYxfr1cy2S4enedNJfbADAfMkSMXtKBGrMCDcjUn9XVb2eQMNhDa2nk6Y
(async () => {
  const bondingCurveAccount = new BondingCurveAccount(
    8n, // discriminator
    BigInt("335389530110382"), // virtualTokenReserves
    BigInt("95977951952"), // virtualSolReserves
    BigInt("55489530110382"), // realTokenReserves
    BigInt("65977951952"), // realSolReserves
    BigInt("100000000"), // Mock: tokenTotalSupply
    false // NOTE: fake the completion
  );

  // reverse the data array
  for (const tx of data) {
    if (tx.side === "sell") {
      const sol = bondingCurveAccount.getSellPrice(
        BigInt(tx.amount) * 1_000_000n,
        100n
      );
      console.log(
        "side: sell, tx.amount: ",
        tx.amount,
        "sol: ",
        Number(sol) / 10 ** 9
      );
    } else {
      const amountOut = bondingCurveAccount.getBuyPrice(
        BigInt(tx.sol * 1_000_000_000)
      );
      console.log(
        "side: buy, tx.amount: ",
        amountOut / 1_000_000n,
        "sol: ",
        tx.sol
      );
    }
  }
})();
