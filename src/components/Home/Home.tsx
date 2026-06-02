import React from "react";
import styles from "./Home.module.css";
import intl from "../../locales/en.json";

const Home: React.FC = () => {
  return (
    <div className={styles.homeContainer}>
      <div className={styles.openingLine}>
        <p className={styles.homeArtSummary}>{intl.openingLine}</p>
      </div>
      <div className={styles.homeCollage}></div>
    </div>
  );
};

export default Home;
