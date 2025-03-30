# EcoChain Carbon Credit Platform

A decentralized platform for carbon credit trading and governance.

## 🚀 Quick Start

1. Clone the repository:
```bash
git clone [repository-url]
cd ecochain-contracts
```

2. Install dependencies:
```bash
npm install
```

3. Start local Hardhat node:
```bash
npx hardhat node
```

4. In a new terminal, deploy contracts:
```bash
npx hardhat run scripts/deploy.js --network localhost
```

5. Import test account to MetaMask:
- Network Name: `Localhost`
- RPC URL: `http://127.0.0.1:8545`
- Chain ID: `31337`
- Currency Symbol: `ETH`
- Account Private Key: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`

## 📝 Contract Addresses (Local Hardhat Network)

All contracts are deployed and verified on the local network:

- CarbonGovToken: `0x5fbdb2315678afecb367f032d93f642f64180aa3`
- CarbonTimelock: `0xe7f1725e7734ce288f8367e1bb143e90bb3f0512`
- CarbonGovernance: `0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0`
- CarbonCreditNFT: `0xcf7ed3acca5a467e9e704c703e8d87f634fb0fc9`
- CarbonCreditMarketplace: `0xdc64a140aa3e981100a9beca4e685f962f0cf6c9`
- CarbonCreditVerifier: `0x5fc8d32690cc91d4c39d9d3abcbd16989f875707`
- CarbonProjectRegistry: `0x0165878a594ca255338adfa4d48449f69242eb8f`

## 🔧 Development Setup

### Prerequisites
- Node.js v18+
- npm v8+
- MetaMask browser extension

### Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### Frontend Development
The frontend can connect to contracts using ethers.js. Example connection:

```javascript
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const tokenContract = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, signer);
```

## 📚 Available Scripts

- `npx hardhat node` - Start local blockchain
- `npx hardhat run scripts/deploy.js --network localhost` - Deploy contracts
- `npx hardhat test` - Run tests
- `node scripts/server.js` - Start development server

## 🔍 Contract Functions

### CarbonGovToken
- `balanceOf(address)`: Get token balance
- `mint(address to, uint256 amount)`: Mint new tokens (owner only)
- `transfer(address to, uint256 amount)`: Transfer tokens

### CarbonCreditNFT
- `mint(address to, uint256 amount)`: Mint new NFTs
- `balanceOf(address owner)`: Get NFT balance
- `tokenURI(uint256 tokenId)`: Get token metadata

### CarbonCreditMarketplace
- `listToken(uint256 tokenId, uint256 price)`: List NFT for sale
- `buyToken(uint256 tokenId)`: Buy listed NFT
- `cancelListing(uint256 tokenId)`: Cancel listing

### CarbonGovernance
- `propose(...)`: Create proposal
- `castVote(uint256 proposalId, uint8 support)`: Vote on proposal
- `execute(...)`: Execute proposal

## 🔐 Security Notes

- All privileged functions are protected
- Timelock delay is set to 2 days
- NFT metadata uses IPFS
- SafeMath for calculations

## 🤝 Contributing

1. Create feature branch
2. Commit changes
3. Push to branch
4. Create Pull Request

## ⚠️ Important Notes

1. This is running on a local network. Don't send real ETH to these addresses.
2. The test account has 10,000 ETH for development.
3. Always restart the Hardhat node if you see "invalid block tag" errors.
4. Contract addresses will remain the same after each deployment on the local network.
