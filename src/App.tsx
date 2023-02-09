import { useEffect, useState } from 'react'
import { Button, Row, Col } from 'antd'
import OpenLogin from '@toruslabs/openlogin'
import Connex from "@vechain/connex";
import { Transaction, secp256k1 } from "thor-devkit";
import { ethers } from "@vechain/ethers"
import bent from "bent"

import { WEB3AUTH_CLIENT_ID, WEB3AUTH_NEWORK } from './constants'

const openLogin = new OpenLogin({
  clientId: WEB3AUTH_CLIENT_ID,
  network: WEB3AUTH_NEWORK,
  uxMode: 'redirect',
  replaceUrlOnRedirect: true,
  whiteLabel: {}
})

const connex = new Connex({
  node: "https://testnet.veblocks.net",
  network: "test"
});

const DELEGATE_URL = "https://sponsor-testnet.vechain.energy/by/90";

export function App(): React.ReactElement {
  const [privateKey, setPrivateKey] = useState<string>('')
  const [txId, setTxId] = useState<string>('')

  useEffect(() => {
    openLogin.init()
      .then(() => setPrivateKey(openLogin.privKey))
  }, [])

  const handleSignIn = async (): Promise<void> => {
    // @ts-ignore
    await openLogin.login()
  }

  const handleTransaction = async (): Promise<void> => {
    const clause = connex.thor.account("0x8384738c995d49c5b692560ae688fc8b51af1059")
      .method({ "inputs": [], "name": "increment", "outputs": [], "stateMutability": "nonpayable", "type": "function" })
      .asClause()

    const txid = await signTransactionWithPrivateKey([clause], new ethers.Wallet(privateKey));
    await setTxId(txid);
  }

  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        {privateKey === '' && <Button onClick={handleSignIn}>sign in</Button>}
        {privateKey !== '' && <Button onClick={handleTransaction}>send transaction</Button>}
      </Col>
      <Col span={24}>
        <code>
          Private Key: {privateKey}
        </code>
      </Col>
      {txId !== '' && (
        <Col span={24}>
          <a href={`https://explore-testnet.vechain.org/transactions/${txId}`} target="_blank" rel="noopener noreferrer">{txId}</a>
        </Col>
      )}
    </Row>
  )
}


async function signTransactionWithPrivateKey(clauses, wallet): Promise<string> {
  const post = bent("POST", "json");
  const transaction = new Transaction({
    chainTag: Number.parseInt(connex.thor.genesis.id.slice(-2), 16),
    blockRef: connex.thor.status.head.id.slice(0, 18),
    expiration: 32,
    clauses,
    gas: 30000,
    gasPriceCoef: 128,
    dependsOn: null,
    nonce: +new Date(),
    reserved: {
      features: 1 // this enables the fee delegation feature
    }
  });

  // build hex encoded version of the transaction for signing request
  const rawTransaction = `0x${transaction.encode().toString("hex")}`;

  // request to send for sponsorship/fee delegation
  const sponsorRequest = {
    origin: wallet.address,
    raw: rawTransaction
  };

  // request sponsorship
  const { signature, error } = await post(DELEGATE_URL, sponsorRequest);

  // sponsorship was rejected
  if (error) {
    throw new Error(error);
  }

  // sign transaction with the known private key
  const signingHash = transaction.signingHash();
  const originSignature = secp256k1.sign(
    signingHash,
    Buffer.from(wallet.privateKey.slice(2), "hex")
  );

  // build combined signature from both parties
  const sponsorSignature = Buffer.from(signature.substr(2), "hex");
  transaction.signature = Buffer.concat([originSignature, sponsorSignature]);

  // post transaction to node
  const signedTransaction = `0x${transaction.encode().toString("hex")}`;
  const { id } = await post("https://testnet.veblocks.net/transactions", {
    raw: signedTransaction
  });

  return id;
}
