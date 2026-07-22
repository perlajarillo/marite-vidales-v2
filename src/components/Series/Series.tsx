import SeriesCard from "./SeriesCard";
import useSeries from "../../hooks/useSeries";
import SeriesSkeleton from "./SeriesSkeleton";
import intl from "../../locales/en.json";
import styles from "./Series.module.css";

const Series = () => {
  const { data, loading } = useSeries();
  if (loading) return <SeriesSkeleton />;
  if (!data && !loading) return <p>{intl.noSeriesDataAvailable}</p>;
  const hasSeries = Boolean(data && Object.keys(data).length > 0);
  const didNotFoundUrl = new URL("/404.png", import.meta.url).href;

  return (
    <div className={styles.seriesGrid}>
      {hasSeries && data ? (
        Object.entries(data ?? {})
          .sort(([_, aSeries], [__, bSeries]) => aSeries.order - bSeries.order)
          .map(([key, series]) => (
            <SeriesCard
              key={key}
              series={series}
              imageUrl={
                series.images_details.length > 0
                  ? series.images_details[series.cover].url
                  : didNotFoundUrl
              }
            />
          ))
      ) : (
        <p>{intl.noSeriesDataAvailable}</p>
      )}
    </div>
  );
};
export default Series;
