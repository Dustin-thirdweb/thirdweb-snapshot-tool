import { ConnectWallet } from "@thirdweb-dev/react";
import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import NetworkSelector from "../components/Alchemy";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <NetworkSelector />
      </main>
    </div>
  );
};

export default Home;
