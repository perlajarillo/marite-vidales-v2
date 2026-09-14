import styles from "./Unauthorized.module.css";
import { useNavigate } from "react-router";
import intl from "../../locales/en.json";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.unauthorizedContainer}>
      <div className={styles.unauthorizedContent}>
        <svg
          className={styles.squiggleSvg}
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
        >
          <defs>
            <filter id="squiggly-0">
              <feTurbulence
                id="turbulence"
                baseFrequency="0.02"
                numOctaves="3"
                result="noise"
                seed="0"
              />
              <feDisplacementMap
                id="displacement"
                in="SourceGraphic"
                in2="noise"
                scale="2"
              />
            </filter>
            <filter id="squiggly-1">
              <feTurbulence
                id="turbulence"
                baseFrequency="0.02"
                numOctaves="3"
                result="noise"
                seed="1"
              />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" />
            </filter>
            <filter id="squiggly-2">
              <feTurbulence
                id="turbulence"
                baseFrequency="0.02"
                numOctaves="3"
                result="noise"
                seed="2"
              />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
            </filter>
            <filter id="squiggly-3">
              <feTurbulence
                id="turbulence"
                baseFrequency="0.02"
                numOctaves="3"
                result="noise"
                seed="3"
              />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" />
            </filter>
            <filter id="squiggly-4">
              <feTurbulence
                id="turbulence"
                baseFrequency="0.02"
                numOctaves="3"
                result="noise"
                seed="4"
              />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="1" />
            </filter>
          </defs>
        </svg>

        <div className={styles.keyStage}>
          <div className={styles.keyStageInner}>
            <div className={styles.keyHead}>
              <div className={styles.keyHeadRing} />

              <div className={styles.eyeLeft}>
                <div className={styles.eyeHighlight} />
                <div className={styles.eyeHighlightDelay} />
              </div>

              <div className={styles.eyeRight}>
                <div className={styles.eyeHighlight} />
                <div className={styles.eyeHighlightDelay} />
              </div>

              <div className={styles.mouth} />
            </div>

            <div className={styles.keyBody}>
              <div className={styles.keyBodyShadow} />

              <div className={styles.keyToothOne} />
              <div className={styles.keyToothTwo} />
              <div className={styles.keyToothThree} />

              <div className={styles.keyArmLeft} />
              <div className={styles.keyArmRight} />

              <div className={styles.keyBottomTip} />
            </div>
          </div>
        </div>

        <h2 className={styles.title}>Access denied</h2>
        <p className={styles.subtitle}>{intl.onlyAdminCanAccess}</p>
        <button
          className={styles.goToHomeButton}
          onClick={() => navigate("/", { replace: true })}
        >
          {intl.goToHome}
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;
