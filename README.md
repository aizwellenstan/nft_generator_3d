# NftGenerator Using NFTPort
use ipfs, MetaMask, OpenSea to view

1. Create Contract
https://docs.nftport.xyz/docs/nftport/b3A6MjE0MDYzNzU-deploy-an-nft-contract

2. list all deployed contract
https://docs.nftport.xyz/docs/nftport/b3A6MjE0MDYzODE-list-all-your-deployed-contracts

3. get contract_address using the transaction_hash from 2.
https://docs.nftport.xyz/docs/nftport/b3A6MjE2NjM4OTk-retrieve-a-deployed-contract

4. copy contract address to .env

```
node utils/nftport/uploadFiles.js
node utils/nftport/genericMetas.js
node utils/nftport/uploadMetas.js
node utils/nftport/mint.js
```