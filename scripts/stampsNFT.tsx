const hre = require('hardhat');

async function main() {
  const petRecordSystem = await hre.ethers.getContractFactory('StampNFT');
  const systemDeploy = await petRecordSystem.deploy('StampNFT', 'Stamp');
  await systemDeploy.waitForDeployment();
  console.log(`StampNFT deployed to:`, await systemDeploy.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
