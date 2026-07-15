import styles from "./Series.module.css";
import intl from "../../locales/en.json";

const SeriesCard = ({
  name = intl.untitled,
  description = intl.noDescriptionAvailable,
  imageUrl = "/404.png",
}) => {
  return (
    <div className={styles.seriesCard}>
      <div className={styles.seriesCoverContainer}>
        <img src={imageUrl} alt={name} className={styles.seriesCover} />
      </div>

      <div className={styles.seriesInformationContainer}>
        <h3 className={styles.seriesName}>{name}</h3>

        <p className={styles.seriesDescription}>{description}</p>

        <div className={styles.seriesActionBar}>
          <button className={styles.seriesViewButton}>
            <span>{intl.viewSeries}</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeriesCard;
