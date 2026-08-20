import { useMemo, useState } from "react";
import { useLocation } from "react-router";
import type { ImageDetail } from "../../types/series";
import styles from "./Series.module.css";
import intl from "../../locales/en.json";
import Modal from "../Common/Dialog/Modal";
import { Carousel } from "../Common/Carousel/Carousel";

const SeriesDetail = () => {
  const location = useLocation();
  const series = location.state?.series;
  // Track loaded images by title
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  const [showAllPaintings, setShowAllPaintings] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialIndex, setInitialIndex] = useState(0);
  const handleImageLoad = (title: string) => {
    setLoadedImages((prev) => ({ ...prev, [title]: true }));
  };
  const topPaintings = useMemo(() => {
    return series
      ? series.images_details
          .filter((image: ImageDetail) => image.isTopTen)
          .sort(
            (a: ImageDetail, b: ImageDetail) =>
              (a.order as number) - (b.order as number),
          )
      : [];
  }, [series]);

  const noTopPaintings = useMemo(() => {
    return series
      ? series.images_details.filter((image: ImageDetail) => !image.isTopTen)
      : [];
  }, [series]);

  const toggleViewMore = () => {
    setShowAllPaintings(!showAllPaintings);
  };

  const paintingsToDisplay = useMemo(() => {
    if (showAllPaintings) {
      return [...topPaintings, ...noTopPaintings];
    }
    return topPaintings;
  }, [showAllPaintings, topPaintings, noTopPaintings]);

  const carouselImages = useMemo(() => {
    return paintingsToDisplay.map((painting: ImageDetail) => {
      const { title, year, technique, measures, url, collectionType } =
        painting;
      const measuresArray = (measures || "").split("x");
      const widthIn = (measuresArray[0] || "").split('"');
      const heightIn = (measuresArray[1] || "").split('"');
      const measuresIn = `${widthIn[0]}x${heightIn[0]} in`;
      const widthCm = Number(widthIn[0]) * 2.54;
      const heightCm = Number(heightIn[0]) * 2.54;
      const measuresCm = `${widthCm}x${heightCm} cm`;
      const collectionTypeString = collectionType ? ` ${collectionType}.` : "";
      const yearString = `, ${year}. `;
      const workDetails = `${technique}, ${measuresIn}. (${measuresCm}). ${collectionTypeString}`;

      return {
        src: url,
        alt: title,
        title: title,
        caption: (
          <p>
            {intl.siteTitle} <span className="italic">{title}</span>
            {yearString} {workDetails}
          </p>
        ),
      };
    });
  }, [paintingsToDisplay]);

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
        <div
          className={`${styles.seriesDetailGallery} ${paintingsToDisplay.length % 3 !== 0 ? styles.seriesDetailGalleryCenterLastChild : ""}`}
        >
          {paintingsToDisplay.map((painting: ImageDetail, index: number) => {
            const isLoaded = loadedImages[painting.title];
            return (
              <div
                key={`${painting.title}-${index}`}
                className={`${styles.seriesDetailPaintingContainer} group`}
                onClick={() => {
                  setIsModalOpen(true);
                  setInitialIndex(index);
                }}
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
        {topPaintings.length > 0 &&
          topPaintings.length < series.images_details.length && (
            <button
              className={styles.seriesDetailViewMore}
              onClick={toggleViewMore}
            >
              <span>{showAllPaintings ? intl.viewLess : intl.viewMore}</span>
            </button>
          )}
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={series?.name}
      >
        <Carousel images={carouselImages} initialIndex={initialIndex} />
      </Modal>
    </div>
  );
};

export default SeriesDetail;
