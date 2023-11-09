const { Address, Signer, WalletTypes, zeroAddress } = require("locklift");

async function main() {
  // We first get our signer and create an instance if the everWalletconst signer: Signer = (await locklift.keystore.getSigner("0"))!;

  const everWallet = (
    await locklift.factory.accounts.addNewAccount({
      type: WalletTypes.EverWallet,
      value: locklift.utils.toNano(1000),
      publicKey: signer.publicKey,
      nonce: locklift.utils.getRandomNonce(),
    })
  ).account;
  console.log("ever wallet address :", everWallet.address.toString());

  // We deploy a simple token root and mint from that, we set the initialSupply to get d=rid of the wallet deployment.
  const { contract: tokenRoot } = await locklift.factory.deployContract({
    contract: "TokenRoot",
    publicKey: signer.publicKey,
    initParams: {
      deployer_: zeroAddress, // must be zero address, not zeroAddress if deploying fromm a contract
      randomNonce_: (Math.random() * 6400) | 0,
      rootOwner_: everWallet.address,
      name_: "Tip3OnboardingToken",
      symbol_: "TOT",
      decimals_: 6,
      walletCode_: locklift.factory.getContractArtifacts("TokenWallet").code,
    },
    constructorParams: {
      initialSupplyTo: everWallet.address,
      initialSupply: 100 * 10 ** 6,
      deployWalletValue: locklift.utils.toNano(2),
      mintDisabled: false,
      burnByRootDisabled: false,
      burnPaused: false,
      remainingGasTo: everWallet.address,
    },
    value: locklift.utils.toNano(6),
  });

  // fetching the wallet balance
  const tokenWalletAddr = (
    await tokenRoot.methods
      .walletOf({ answerId: 0, walletOwner: everWallet.address })
      .call({})
  ).value0;

  const tokenWallet = locklift.factory.getDeployedContract(
    "TokenWallet",
    tokenWalletAddr
  );

  console.log(
    Number((await tokenWallet.methods.balance({ answerId: 0 }).call()).value0) /
      10 ** 6
  ); // >> 100// minting for the token wallet
  await tokenRoot.methods
    .mint({
      amount: 50 * 10 ** 6,
      recipient: everWallet.address,
      remainingGasTo: everWallet.address,
      notify: false,
      payload: "",
      deployWalletValue: 0,
    })
    .send({ from: everWallet.address, amount: locklift.utils.toNano(3) });

  console.log(
    Number((await tokenWallet.methods.balance({ answerId: 0 }).call()).value0) /
      10 ** 6
  ); // >> 150
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });
