import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Router, Vault } from "../constants/constants";
import { PawnMasterAbi } from "../constants/pawnMaster";
import { DummyTokenAbi} from "../constants/dummyToken";
import {  StableTokenAbi } from "../constants/stableToken";
import {Dummycollateral,PawnMaster,StableCoin} from "../constants/constants";


export const injected = new InjectedConnector();

export default function CreateVault() {
  const [hasMetamask, setHasMetamask] = useState(false);
  const [inAmount, setInAmount] = useState('');
  const [duration, setDuration] = useState('');
  const [tokenAddress, setTokenAddress] = useState("");
  const [amountOutMinimum, setAmountOutMinimum] = useState("0");

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      setHasMetamask(true);
    }
  }, []);

  const {
    active,
    activate,
    chainId,
    account,
    library: provider,
  } = useWeb3React();

  async function connect() {
    if (typeof window.ethereum !== "undefined") {
      try {
        await activate(injected);
        setHasMetamask(true);
      } catch (e) {
        console.log(e);
      }
    }
  }

 


  async function Withdraw() {
    if (active) {
      const signer = provider.getSigner();
      const pawnMasterInst = new ethers.Contract(PawnMaster, PawnMasterAbi, signer);
      try {
        await pawnMasterInst.withdraw("1");
        // const a=await pawnMasterInst.investors("1");
        // console.log(a.investmentAmount.toString())

      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("Please install MetaMask");
    }
  }

  

  return (
    <div>
      {hasMetamask ? (
        active ? (
          "Connected!"
        ) : (
          <button
            className="btn btn-danger float-end"
            onClick={() => connect()}
          >
            Connect
          </button>
        )
      ) : (
        "Please install metamask"
      )}
      <div className="container">
        <h1>Invest</h1>
        <div className="card">
          <div className="card-body">
            <form>
              {active ? (
                <button
                  type="button"
                  className="btn btn-primary "
                  onClick={() => Withdraw()}
                >
                  WithDraw Deposit
                </button>
              ) : (
                ""
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
)};