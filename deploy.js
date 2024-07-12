const { error } = require("console");
const { ethers } = require("ethers");
const fs = require("fs");
require("dotenv").config();

async function main() {
  console.log("rpc url is", process.env.RPC_URL);
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8");
  const binary = fs.readFileSync(
    "./SimpleStorage_sol_SimpleStorage.bin",
    "utf8"
  );

  const contractFacttory = new ethers.ContractFactory(abi, binary, wallet);
  console.log("deploying....");
  const contract = await contractFacttory.deploy();
  await contract.deployTransaction.wait(1);
  console.log(`contract address = ${contract.address}`);

  const currentFavNum = await contract.retrieve();
  console.log(`current fav num: ${currentFavNum.toString()}`);
  const transactionResponse = await contract.store("7");
  const transactionReceipt = await transactionResponse.wait(1);
  const updatedFav = await contract.retrieve();
  console.log(`updated fav num: ${updatedFav}`);
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
