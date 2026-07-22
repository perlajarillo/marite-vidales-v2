import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router";
import type { ImageDetail } from "../../types/series";
import styles from "./Series.module.css";

const getResponsivePaintings = (
  paintings: ImageDetail[],
  viewportWidth: number,
) => {
  const columns = viewportWidth < 640 ? 1 : viewportWidth < 1024 ? 2 : 3;

  if (columns === 1 || paintings.length <= columns) {
    return paintings;
  }

  const buckets = Array.from({ length: columns }, () => [] as ImageDetail[]);

  paintings.forEach((painting, index) => {
    buckets[index % columns].push(painting);
  });
  return buckets.flat();
};

const SeriesDetail = () => {
  const location = useLocation();
  const series = location.state?.series;
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

  const [viewportWidth, setViewportWidth] = useState(() =>
    typeof window === "undefined" ? 1280 : window.innerWidth,
  );

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const displayedPaintings = useMemo(
    () => getResponsivePaintings(topTenPaintings, viewportWidth),
    [topTenPaintings, viewportWidth],
  );

  return (
    <div className={styles.seriesDetailContainer}>
      <div className={styles.seriesDetailHeader}>
        <h1 className={styles.seriesDetailTitle}>{series?.name}</h1>
      </div>

      <div className={styles.seriesDetailContent}>
        <p className={styles.seriesDetailDescription}>{series?.description}</p>
        {/* 
          columns-1: Mobile stack
          sm:columns-2: 2 columns on tablets
          lg:columns-3: 3 columns on desktops
          gap-6: space between columns
        */}
        <div className={styles.seriesDetailGallery}>
          {displayedPaintings.map((painting: ImageDetail) => (
            <div
              key={painting.title}
              className={`${styles.seriesDetailPaintingContainer} group`}
            >
              <img
                src={painting.url}
                alt={painting.alt}
                className={`${styles.seriesDetailPaintingImage} group-hover:scale-[1.02]`}
                loading="lazy"
              />

              <div
                className={`${styles.seriesDetailPaintingOverlay} group-hover:opacity-100`}
              >
                <span className={styles.seriesDetailPaintingTitle}>
                  {painting.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SeriesDetail;
