const web3 = require("web3");
const inquirer = require("inquirer");

require("@nomiclabs/hardhat-ethers");

async function main() {

  const [deployer] = await ethers.getSigners();

  let WAVAX = "";
  let FACTORY = "";

  if (process.env.HARDHAT_NETWORK === "fuji") {
    WAVAX = "0xd00ae08403B9bbb9124bB305C09058E32C39A48c";
    FACTORY = "0xa7d1701752cE8693098370d47959cE2a59A605b7";
  } else if (process.env.HARDHAT_NETWORK === "mainnet") {
    WAVAX = "0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7";
  } else {
    console.error("No WAVAX and FACTORY for this network!");
    process.exit(1);
  }

  console.log("Deploying to:", process.env.HARDHAT_NETWORK);

  if (!deployer) {
    console.error("No deployer account!");
    process.exit(1);
  }

  const balanceRaw = (await deployer.getBalance()).toString();
  const balance = web3.utils.fromWei(balanceRaw);

  console.log("WAVAX: ", WAVAX)
  console.log("Factory: ", FACTORY)
  console.log("Deploying LydiaRouter contract with the account:", deployer.address);
  console.log("Account balance:", balance, "AVAX", "(" + balanceRaw + ")");

  async function deploy() {
    console.log("Deploying...");

    const Router = await ethers.getContractFactory("LydiaRouter");
    const router = await Router.deploy(FACTORY, WAVAX);
    console.log("Router address:", router.address);

    console.log("Done 🎉");
  }

  async function cancel() {
    console.log("Cancelled");
  }

  return inquirer
    .prompt([
      {
        "name": "confirm",
        "message": "Continue? (y/n)",
        "validate": (a) => {
          return a === "y" || a === "n";
        }
      }
    ])
    .then(answers => {
      if (answers.confirm === "y") {
        return deploy();
      }

      if (answers.confirm === "n") {
        return cancel();
      }
    });
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
