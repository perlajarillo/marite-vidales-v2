import { useMemo, useState } from "react";
import { useLocation } from "react-router";
import type { ImageDetail } from "../../types/series";
import styles from "./Series.module.css";

const SeriesDetail = () => {
  const location = useLocation();
  const series = location.state?.series;
  // Track loaded images by title
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  const handleImageLoad = (title: string) => {
    setLoadedImages((prev) => ({ ...prev, [title]: true }));
  };
  const topTenPaintings = useMemo(() => {
    return series
      ? series.images_details
          .filter((image: ImageDetail) => image.isTopTen)
          .sort(
            (a: ImageDetail, b: ImageDetail) =>
              (a.order as number) - (b.order as number),
          )
      : [];
  }, [series]);
  console.log("loadedImages", loadedImages);
  return (
    <div className={styles.seriesDetailContainer}>
      <div className={styles.seriesDetailHeader}>
        <h1 className={styles.seriesDetailTitle}>{series?.name}</h1>
      </div>

      <div className={styles.seriesDetailContent}>
        <p className={styles.seriesDetailDescription}>{series?.description}</p>
        {/* 
          grid-cols-1: Mobile stack
          sm:grid-cols-2: 2 columns on tablets
          lg:grid-cols-3: 3 columns on desktops
        */}
        <div className={styles.seriesDetailGallery}>
          {topTenPaintings.map((painting: ImageDetail) => {
            const isLoaded = loadedImages[painting.title];
            return (
              <div
                key={painting.title}
                className={`${styles.seriesDetailPaintingContainer} group`}
              >
                {/* Skeleton Placeholder */}
                {!isLoaded && (
                  <div className={styles.seriesDetailPaintingSkeleton} />
                )}
                <img
                  src={painting.url}
                  alt={painting.alt}
                  className={`${styles.seriesDetailPaintingImage} group-hover:scale-[1.02] ${
                    isLoaded ? "opacity-100" : "opacity-0"
                  }`}
                  loading="lazy"
                  onLoad={() => handleImageLoad(painting.title)}
                />

                <div
                  className={`${styles.seriesDetailPaintingOverlay} group-hover:opacity-100`}
                >
                  <span className={styles.seriesDetailPaintingTitle}>
                    {painting.title}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SeriesDetail;
