import React, { useState, useEffect, useRef, type TouchEvent } from "react";
import styles from "./Carousel.module.css";
import intl from "../../../locales/en.json";

export interface CarouselImage {
  src: string;
  alt: string;
  title?: string;
  caption?: string | React.ReactNode;
}

interface CarouselProps {
  images: CarouselImage[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  initialIndex?: number;
  fitHeight?: boolean; // Optional prop to control height fitting
}

export const Carousel: React.FC<CarouselProps> = ({
  images,
  autoPlay = false,
  autoPlayInterval = 5000,
  initialIndex = 0,
  fitHeight = false,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(initialIndex);
  const [prevInitialIndex, setPrevInitialIndex] =
    useState<number>(initialIndex);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Minimum swipe distance (in px) to trigger slide change
  const minSwipeDistance = 50;

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1,
    );
  };

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  // Touch handlers for mobile swipe
  const onTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  if (initialIndex !== prevInitialIndex) {
    setCurrentIndex(initialIndex);
    setPrevInitialIndex(initialIndex);
  }

  // Auto-play timer
  useEffect(() => {
    if (autoPlay && images.length > 1) {
      timerRef.current = setInterval(handleNext, autoPlayInterval);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, autoPlay, autoPlayInterval, images.length]);

  if (!images || images.length === 0) return null;

  return (
    <div className={`${styles.carouselContainer} group`}>
      {/* Slides Track */}
      <div
        className={`${styles.carouselSlide}`}
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {images.map((image, index) => (
          <div key={index} className={styles.carouselContent}>
            <div
              className={`${styles.carouselImageContainer} ${fitHeight ? "h-fit" : ""}`}
            >
              <img
                src={image.src}
                alt={image.alt}
                className={styles.carouselImage}
                draggable={false}
              />

              {/* Image Overlay(Optional) */}
              {image.title && !image.caption && (
                <div className={styles.carouselImageTitleWrapper}>
                  {image.title && (
                    <h3 className={styles.carouselImageTitle}>{image.title}</h3>
                  )}
                </div>
              )}
            </div>
            {/* Image Caption (Optional) */}
            {image.caption && (
              <div className={styles.carouselImageCaption}>{image.caption}</div>
            )}
          </div>
        ))}
      </div>

      {/* Navigation Buttons (Hidden on small screens by default, visible on hover/desktop) */}
      <button
        onClick={handlePrev}
        aria-label={intl.previousSlide}
        className={`${styles.carouselNavButton} ${styles.carouselLeftButton} group-hover:opacity-100`}
      >
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <button
        onClick={handleNext}
        aria-label={intl.nextSlide}
        className={`${styles.carouselNavButton} ${styles.carouselRightButton} group-hover:opacity-100`}
      >
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Dots Indicator */}
      <div className={`${styles.carouselIndicators} `}>
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            aria-label={intl.goToSlide.replace(
              "{slideNumber}",
              (index + 1).toString(),
            )}
            className={`${styles.carouselDotIndicator} ${
              currentIndex === index
                ? styles.carouselDotIndicatorActive
                : styles.carouselDotIndicatorInactive
            }`}
          />
        ))}
      </div>
    </div>
  );
};
