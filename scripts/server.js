const express = require('express');
const path = require('path');
const ethers = require('ethers');
const config = require('./config');

const app = express();
const port = 3002;

// Create provider instance
const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');

// Serve static files
app.use(express.static(path.join(__dirname)));

// API endpoint for network status
app.get('/api/network', async (req, res) => {
    try {
        const network = await provider.getNetwork();
        res.json({ 
            status: 'connected',
            chainId: network.chainId,
            name: network.name
        });
    } catch (error) {
        res.status(500).json({ 
            status: 'error',
            message: error.message
        });
    }
});

// API endpoint for contract addresses
app.get('/api/contracts', (req, res) => {
    res.json({
        token: '0xa513E6E4b8f2a923D98304ec87F64353C4D5C853',
        timelock: '0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6',
        governor: '0x8A791620dd6260079BF849Dc5567aDC3F2FdC318',
        nft: '0x610178dA211FEF7D417bC0e6FeD39F05609AD788',
        marketplace: '0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e',
        verifier: '0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0',
        registry: '0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82'
    });
});

// Add CORS headers
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.listen(port, () => {
    console.log('=== Carbon Governance Interface Server ===');
    console.log(`Server running at http://localhost:${port}/`);
    console.log('Make sure:');
    console.log('1. Hardhat node is running (npx hardhat node)');
    console.log('2. MetaMask is connected to Localhost:8545');
    console.log('3. You are using Account #0 from Hardhat');
}); 