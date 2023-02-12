This project displays how to connect a user to the Blockchain using social credentials.

1. Users will sign in with Web3Auth
1. Web3Auth provides access to a private key in a save session
1. The private key is used to generate, sign & submit a test transaction

The example project is deployed here:

- https://web3auth.example.vechain.energy

A blog article explaining snippets of it is available here:

- https://blog.vechain.energy/8bb646ae6a4a

# Scripts

* **`yarn start`** for running a development version
* **`yarn build`** to build the static version in `./dist`

# Installation

Install parcel and react (https://parceljs.org/recipes/react):

```shell
yarn add --dev parcel
yarn add react react-dom antd
yarn add @vechain/connex thor-devkit @vechain/ethers bent
yarn add @walletconnect/client @web3auth/modal
yarn add --dev @types/react @types/react-dom ts-standard typescript
```

Add shortcuts in `package.json`:

```json
  "scripts": {
    "build": "parcel build src/index.html",
    "start": "parcel serve src/index.html"
  }
```

Configure Web3Auth Client:

- https://dashboard.web3auth.io/home/web3auth
- Configure Client Id and network type in `constants.ts`
- Whitelist your Testdomain (http://localhost:1234 in local development mode)
