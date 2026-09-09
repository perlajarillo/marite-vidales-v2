import styles from "./Exhibits.module.css";

const ExhibitsSkeleton = () => {
  return (
    <div className={styles.skeletonRoot}>
      <div className={`${styles.skeletonCarousel} animate-pulse`} />

      {[0, 1, 2, 3].map((section) => (
        <div key={section} className={styles.skeletonSection}>
          <div className={`${styles.skeletonTitle} animate-pulse`} />

          <div className={styles.skeletonTextGroup}>
            <div className={`${styles.skeletonLine} animate-pulse`} />
            <div className={`${styles.skeletonLine} animate-pulse`} />
            <div className={`${styles.skeletonLineShort} animate-pulse`} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExhibitsSkeleton;
