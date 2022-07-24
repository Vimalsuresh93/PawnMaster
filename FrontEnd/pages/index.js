import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Router, Vault } from "../constants/constants";
import { PawnMasterAbi } from "../constants/pawnMaster";
import { DummyTokenAbi} from "../constants/dummyToken";
import {Dummycollateral,PawnMaster} from "../constants/constants";
import {
  getBigNumber,
} from "../utils/tick";

export const injected = new InjectedConnector();

export default function CreateVault() {
  const [hasMetamask, setHasMetamask] = useState(false);
  const [inAmount, setInAmount] = useState('');
  const [unwrapVault, setUnWrapVault] = useState(false);
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
     
      const tokenAInst = new ethers.Contract(Dummycollateral, DummyTokenAbi, signer);
      try {
        await tokenAInst.approve(PawnMaster, getBigNumber(inAmount));
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("Please install MetaMask");
    }
  }


  async function CreateVault() {
    if (active) {
      const signer = provider.getSigner();
      const pawnMasterInst = new ethers.Contract(PawnMaster, PawnMasterAbi, signer);
      try {
        await pawnMasterInst.createVault(Dummycollateral,getBigNumber(inAmount));
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
        <h1>Create Vault</h1>
        <div className="card">
          <div className="card-body">
            <form>
              <div className="mb-3">
                <label htmlFor="exampleInputEmail1" className="form-label">
                  Collateral Amount
                </label>
                <input
                  className="form-control"
                  onChange={(event) => setInAmount(event.target.value)}
                  type="text"
                  value={inAmount}
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
                  onClick={() => CreateVault()}
                >
                  Create Vault
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