import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Link from "next/link";

export default function Navbar() {
  const [hasMetamask, setHasMetamask] = useState(false);
  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      setHasMetamask(true);
    }
  });

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
  return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            Pawn Master
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link href="/createVault">
                  <a className="nav-link active" aria-current="page" href="#">
                    Create Vault 
                  </a>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/borrowToken">
                  <a className="nav-link" href="#">
                    Borrow Token
                  </a>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/repay">
                  <a className="nav-link">Repay</a>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/invest">
                  <a className="nav-link">Invest</a>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/withdraw">
                  <a className="nav-link">WithDraw</a>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
  );
}
