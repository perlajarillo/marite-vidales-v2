import styles from "./Series.module.css";
import intl from "../../locales/en.json";
import { Link } from "react-router";
import type { Series } from "../../types/series";

interface SeriesCardProps {
  series: Series;
  imageUrl: string;
}

const SeriesCard = (props: SeriesCardProps) => {
  const { series, imageUrl } = props;

  return (
    <div className={styles.seriesCard}>
      <div className={styles.seriesCoverContainer}>
        <img src={imageUrl} alt={series.name} className={styles.seriesCover} />
      </div>

      <div className={styles.seriesInformationContainer}>
        <h3 className={styles.seriesName}>{series.name}</h3>

        <p className={styles.seriesDescription}>{series.description}</p>

        <div className={styles.seriesActionBar}>
          <Link to={`/series-detail`} state={{ series }}>
            <button className={styles.seriesViewButton}>
              <span>{intl.viewSeries}</span>
              <span>→</span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SeriesCard;
