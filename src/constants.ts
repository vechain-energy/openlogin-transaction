import type { Options } from '@vechain/connex'

// get your client id from https://dashboard.web3auth.io/home/web3auth
export const WEB3AUTH_CLIENT_ID = 'BNzXNuZuTXY7mUlPRqDcE3RFUFgKSQXGQEu2TvJoatWNr4c_BburI3pH_x3n_9cvD7TVIwn4qsZv5CFIKAgk4r0'
export const WEB3AUTH_NEWORK = 'testnet'

// get your delegation service from https://vechain.energy or https://testnet.vechain.energy
export const DELEGATE_URL = 'https://sponsor-testnet.vechain.energy/by/90'

// configure your local or a public node: https://learn.vechain.energy/know-how/datasheets/nodes
export const CONNEX_NODE = {
  node: "https://testnet.veblocks.net",
  network: "test"
} satisfies Options