import styles from "./Biography.module.css";

const BiographySkeleton: React.FC = () => {
  return (
    <div className={styles.biographySkeletonContainer}>
      <section className={styles.summarySkeletonSection}>
        <div className={styles.photoContainer}>
          <div className={styles.photoSkeleton} />
        </div>
        <div className={styles.summarySkeletonTextGroup}>
          <div className={styles.skeletonLine} />
          <div className={styles.skeletonLine} />
          <div className={styles.skeletonLineShort} />
          <div className={styles.skeletonLineExtraShort} />
        </div>
      </section>

      <section className={styles.sectionSkeletonContainer}>
        <div className={styles.sectionSkeletonTitle} />
        <div className={styles.summarySkeletonTextGroup}>
          <div className={styles.skeletonLine} />
          <div className={styles.skeletonLineShort} />
        </div>
      </section>

      <section className={styles.sectionSkeletonContainerAlt}>
        <div className={styles.sectionSkeletonTitleWide} />
        <div className={styles.summarySkeletonTextGroup}>
          <div className={styles.skeletonLine} />
          <div className={styles.skeletonLineShort} />
        </div>
      </section>
    </div>
  );
};

export default BiographySkeleton;
