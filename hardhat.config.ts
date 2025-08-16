require('@nomicfoundation/hardhat-ethers');
require('@nomicfoundation/hardhat-verify');
require('dotenv').config();

module.exports = {
  solidity: '0.8.24',
  defaultNetwork: 'sepolia', // Fixed: should be a string, not an object
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
      chainId: 11155111,
      accounts: [process.env.AGENT_PRIVATE_KEY],
    },
    flowTestnet: {
      url: 'https://testnet.evm.nodes.onflow.org',
      chainId: 545,
      accounts: [process.env.AGENT_PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: {
      sepolia: process.env.ETHERSCAN_API_KEY,
      flowTestnet: 'abc', // Flow doesn't require API key for verification
    },
    customChains: [
      {
        network: 'flowTestnet',
        chainId: 545,
        urls: {
          apiURL: 'https://evm-testnet.flowscan.io/api',
          browserURL: 'https://evm-testnet.flowscan.io',
        },
      },
    ],
  },
};
