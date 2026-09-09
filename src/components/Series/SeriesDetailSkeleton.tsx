import styles from "./Series.module.css";

const SeriesDetailSkeleton = () => {
  return (
    <div className={styles.seriesDetailContainer} aria-busy="true" aria-label="Loading series">
      <div className={styles.seriesDetailHeader}>
        <div className={styles.seriesDetailSkeletonTitle} />
      </div>

      <div className={styles.seriesDetailContent}>
        <div className={styles.seriesDetailSkeletonDescription} aria-hidden="true">
          <div />
          <div />
        </div>

        <div className={styles.seriesDetailGallery} aria-hidden="true">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className={styles.seriesDetailSkeletonPainting}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SeriesDetailSkeleton;