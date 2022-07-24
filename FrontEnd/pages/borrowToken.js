import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Router, Vault } from "../constants/constants";
import { PawnMasterAbi } from "../constants/pawnMaster";
import { DummyTokenAbi} from "../constants/dummyToken";
import {Dummycollateral,PawnMaster} from "../constants/constants";


export const injected = new InjectedConnector();

export default function BorrowToken() {
  const [hasMetamask, setHasMetamask] = useState(false);
  const [duration, setDuration] = useState('');
  const [borrowableAmount, setBorrowableAmount] = useState('');
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


  async function BorrowToken() {
    if (active) {
      const signer = provider.getSigner();
      const pawnMasterInst = new ethers.Contract(PawnMaster, PawnMasterAbi, signer);
      try {
        await pawnMasterInst.borrowToken("1",duration);
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("Please install MetaMask");
    }
  }

  async function getBorrowAmount() {
    if (active) {
      const signer = provider.getSigner();
      const pawnMasterInst = new ethers.Contract(PawnMaster, PawnMasterAbi, signer);
      try {
        const borrowMax=await pawnMasterInst.getMaxBorrowAmount("1");
        console.log("borrowmax",borrowMax)
        let maxBorrowTowei=ethers.utils.formatEther(borrowMax)
        setBorrowableAmount(maxBorrowTowei);
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
        <h1>Borrow Token</h1>
        <div className="card">
          <div className="card-body">
            <form>
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
              <div className="mb-3">
                <label htmlFor="exampleInputEmail1" className="form-label">
                  Borrowable Amount
                </label>
                <input
                  className="form-control"
                  onChange={(event) => setDuration(event.target.value)}
                  type="text"
                  value={borrowableAmount}
                  disabled={true}
                />
              </div>
              {active ? (
                <button
                  type="button"
                  className="btn btn-success btn-space"
                  onClick={() => BorrowToken()}
                >
                  Borrow
                </button>
              ) : (
                ""
              )}
               {active ? (
                <button
                  type="button"
                  className="btn btn-success btn-space"
                  onClick={() =>getBorrowAmount()}
                >
                  Get Max Borrow
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