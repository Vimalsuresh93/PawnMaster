import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Router, Vault } from "../constants/constants";
import { PawnMasterAbi } from "../constants/pawnMaster";
import { DummyTokenAbi} from "../constants/dummyToken";
import {  StableTokenAbi } from "../constants/stableToken";
import {Dummycollateral,PawnMaster,StableCoin} from "../constants/constants";
import {
  getBigNumber
} from "../utils/utils";

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

  async function approveToken0() {
    if (active) {
      const signer = provider.getSigner();
      const accountAddress = await signer.getAddress();
     
      const tokenAInst = new ethers.Contract(StableCoin, StableTokenAbi, signer);
      try {
        await tokenAInst.approve(PawnMaster, getBigNumber(inAmount));
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("Please install MetaMask");
    }
  }


  async function Invest() {
    if (active) {
      const signer = provider.getSigner();
      const pawnMasterInst = new ethers.Contract(PawnMaster, PawnMasterAbi, signer);
      try {
        await pawnMasterInst.invest(getBigNumber(inAmount),duration);
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
              <div className="mb-3">
                <label htmlFor="exampleInputEmail1" className="form-label">
                  Deposit Amount
                </label>
                <input
                  className="form-control"
                  onChange={(event) => setInAmount(event.target.value)}
                  type="text"
                  value={inAmount}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="exampleInputEmail1" className="form-label">
                   Duration
                </label>
                <input
                  className="form-control"
                  onChange={(event) => setDuration(event.target.value)}
                  type="text"
                  value={duration}
                />
              </div>
              {active ? (
                <button
                  type="button"
                  className="btn btn-success btn-space"
                  onClick={() => approveToken0()}
                >
                  Approve
                </button>
              ) : (
                ""
              )}
              {active ? (
                <button
                  type="button"
                  className="btn btn-primary "
                  onClick={() => Invest()}
                >
                  Invest
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