import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";


task("deploycontracts").setAction(async function (taskArguments: TaskArguments, hre) {
  console.log("Deploying PawnMaster ");
  const pawnMasterContract = await hre.ethers.getContractFactory("PawnMaster");
  const pawnMaster = await pawnMasterContract.deploy("50","20");
  await pawnMaster.deployed();
  console.log('pawnMaster deployed at',pawnMaster.address)

});


task("deployTokens").setAction(async function (taskArguments: TaskArguments, hre) {
  const tokenContract = await hre.ethers.getContractFactory("DummyCollateral");
  const token = await tokenContract.deploy("Coll","CL");
  await token.deployed();
  console.log('token deployed at',token.address)
});

task("mintTokens").setAction(async function (taskArguments: TaskArguments, hre) {
  const recepient='0xdd52d715316DE155D2b7278Ca632c5f8C0321eD0'
  const tokenAddress='0x997bAaDAa2963f0218A8Dd0E97f26D8a62aBbf1b'
  const tokenAmount=await hre.ethers.utils.parseEther("100000")
  const tokenContract = await hre.ethers.getContractFactory("DummyCollateral");
  const token = await tokenContract.attach(tokenAddress);
  await token.mint(recepient,tokenAmount);
  console.log("token minted")
});

task("balance").setAction(async function (taskArguments: TaskArguments, hre) {
  const recepient='0x007cD08Daf9eBa5A8bb95fA8B42751D2a6224b6E'
  const tokenAddress='0x5172A1CDdf051A244d93AFE75084f22beE6D248c'
  const tokenContract = await hre.ethers.getContractFactory("StableToken");
  const token = await tokenContract.attach(tokenAddress);
  const balance=await token.balanceOf(recepient);
  console.log('token balance',balance.toString())
});

task("mintStables").setAction(async function (taskArguments: TaskArguments, hre) {
  console.log("Minting Stables ");
  const pawnMasterContract = await hre.ethers.getContractFactory("PawnMaster");
  const pawnMaster = await pawnMasterContract.attach("0x007cD08Daf9eBa5A8bb95fA8B42751D2a6224b6E");
  const tokenAmount=await hre.ethers.utils.parseEther("100000")
  let receipient="0xdd52d715316DE155D2b7278Ca632c5f8C0321eD0"
  const a=await pawnMaster.mintStables(tokenAmount,receipient);
  console.log('stable coin deployed at',a)
});
task("setPrice").setAction(async function (taskArguments: TaskArguments, hre) {
  console.log("setting Price ");
  const pawnMasterContract = await hre.ethers.getContractFactory("PawnMaster");
  const pawnMaster = await pawnMasterContract.attach("0x007cD08Daf9eBa5A8bb95fA8B42751D2a6224b6E");
  const token="0x997bAaDAa2963f0218A8Dd0E97f26D8a62aBbf1b"
  let receipient="0xdd52d715316DE155D2b7278Ca632c5f8C0321eD0"
  const a=await pawnMaster.setPrice("0x997bAaDAa2963f0218A8Dd0E97f26D8a62aBbf1b","1");
});


