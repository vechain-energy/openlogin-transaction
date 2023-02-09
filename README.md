- sign in with a social account
- build a transaction and sign int
- submit transaction to network

# Scripts

* **`yarn start`** for running a development version
* **`yarn build`** to build the static version in `./dist`

# Installation

Install parcel and react (https://parceljs.org/recipes/react):

```shell
yarn add --dev parcel
yarn add react react-dom @vechain/connex antd thor-devkit @toruslabs@openlogin@2 @vechain/ethers bent @vechain/connex
yarn add --dev @types/react @types/react-dom ts-standard typescript
```

Add shortcuts in `package.json`:

```json
  "scripts": {
    "build": "parcel build src/index.html",
    "start": "parcel serve src/index.html"
  }
```