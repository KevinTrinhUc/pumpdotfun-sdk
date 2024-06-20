import { Keypair, Connection, PublicKey } from "@solana/web3.js";
import { PumpFunSDK, CreateTokenMetadata, BondingCurveAccount } from "../src";
import { AnchorProvider, Wallet } from "@coral-xyz/anchor";

// https://solscan.io/tx/5EgLmguHetaU2NtQTbqzYuoDbchJL6AfdwYXRqyt976gdffPvfDaoWqsaJ3v4ZSTjYqSXw14y2GvELxn9dTp1n7p
const data: { side: string; sol: number; amount: number }[] = [
  { side: "sell", sol: 1.536, amount: 17660000 },
];
const keypair = Keypair.fromSecretKey(
  Uint8Array.from(require("/Users/kien6034/.config/solana/id.json"))
);

const connection = new Connection(
  "https://solana-mainnet.g.alchemy.com/v2/8BxQFVgpFg_2eiuI6ZKUc6GT178eYFtI"
);
const wallet = new Wallet(keypair);
const provider: AnchorProvider = new AnchorProvider(connection, wallet);
const pumpFunSDK = new PumpFunSDK(provider);

// https://solscan.io/tx/W6DJTo5tGez6fThHKJ3QJZHCaNvWjSUJMh7R7UhVrALDjtsMEmarQNunazAP5xiNLJroegCBew4AB832cUszrqM

(async () => {
  const globalAccount = await pumpFunSDK.getGlobalAccount();
  const feeBasisPoints = globalAccount.feeBasisPoints;

  const accountInfo = await connection.getAccountInfo(
    new PublicKey("BpcpAQV1mVcfZxdGmRfEHheS6aU8MBcCweeRFakwths9"),
    { minContextSlot: 273011050 }
  );

  if (!accountInfo) {
    throw new Error("Account not found");
  }

  const curve = pumpFunSDK.program.coder.accounts.decode(
    "bondingCurve",
    accountInfo.data
  );
  console.log("curve: ", curve.virtualTokenReserves.toString());

  const bondingCurveAccount = new BondingCurveAccount(
    8n, // discriminator
    BigInt(curve.virtualTokenReserves.toString()), // virtualTokenReserves
    BigInt(curve.virtualSolReserves.toString()), // virtualSolReserves
    BigInt(curve.realTokenReserves.toString()), // realTokenReserves
    BigInt(curve.realSolReserves.toString()), // realSolReserves
    BigInt(curve.tokenTotalSupply.toString()), // tokenTotalSupply
    false // NOTE: fake the completion
  );

  // reverse the data array
  const reversedData = data.reverse();

  for (const tx of reversedData) {
    if (tx.side === "sell") {
      const sol = bondingCurveAccount.getSellPrice(
        BigInt(tx.amount) * 1_000_000n,
        feeBasisPoints
      );
      console.log(
        "side: sell, tx.amount: ",
        tx.amount,
        "sol: ",
        Number(sol) / 10 ** 9
      );
    } else {
      const price = bondingCurveAccount.getBuyPrice(
        BigInt(tx.sol * 1_000_000_000)
      );
      console.log("side: buy, tx.amount: ", tx.amount, "sol: ", tx.sol);
    }
  }
})();
