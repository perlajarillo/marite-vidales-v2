import React, { useState, useEffect, useRef, type TouchEvent } from "react";

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
}

export const Carousel: React.FC<CarouselProps> = ({
  images,
  autoPlay = false,
  autoPlayInterval = 5000,
  initialIndex = 0,
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
    <div className="relative w-full max-w-4xl mx-auto overflow-hidden group">
      {/* Slides Track */}
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {images.map((image, index) => (
          <div key={index} className="w-full shrink-0 relative">
            {/* Aspect Ratio Container (16:9 on desktop, adjust as needed) */}
            <div className="flex flex-direction-column items-center justify-center h-64 sm:h-96 md:h-105 w-full text-center">
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-contain select-none p-0"
                draggable={false}
              />

              {/* Image Overlay(Optional) */}
              {image.title && !image.caption && (
                <div className="absolute bottom-0 inset-x-0 bg-linear-to-t from-black/80 via-black/40 to-transparent p-4 sm:p-6 text-white">
                  {image.title && (
                    <h3 className="text-lg sm:text-xl font-bold mb-1">
                      {image.title}
                    </h3>
                  )}
                </div>
              )}
            </div>
            {/* Image Caption (Optional) */}
            {image.caption && (
              <div className="text-[0.625rem] text-gray-700 pt-3 pb-4 text-center">
                {image.caption}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Navigation Buttons (Hidden on small screens by default, visible on hover/desktop) */}
      <button
        onClick={handlePrev}
        aria-label="Previous Slide"
        className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 sm:p-3 rounded-full shadow-md backdrop-blur-sm transition-all opacity-80 sm:opacity-0 group-hover:opacity-100 focus:opacity-100"
      >
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
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
        aria-label="Next Slide"
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 sm:p-3 rounded-full shadow-md backdrop-blur-sm transition-all opacity-80 sm:opacity-0 group-hover:opacity-100 focus:opacity-100"
      >
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 flex  space-x-2 z-10">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`transition-all duration-300 rounded-full ${
              currentIndex === index
                ? "w-6 sm:w-8 h-2 bg-gray-500"
                : "w-2 h-2 bg-gray-400 hover:bg-gray-400/80"
            }`}
          />
        ))}
      </div>
    </div>
  );
};
