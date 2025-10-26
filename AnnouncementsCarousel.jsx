import React, { useState, useEffect, useRef } from 'react';
import './AnnouncementsCarousel.css';

const AnnouncementsCarousel = ({ 
  announcements = [], 
  autoPlay = true, 
  interval = 4000,
  showArrows = true,
  showDots = true,
  className = ''
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);
  const carouselRef = useRef(null);

  // Auto-play functionality
  useEffect(() => {
    if (autoPlay && !isPaused && announcements.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === announcements.length - 1 ? 0 : prevIndex + 1
        );
      }, interval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoPlay, isPaused, announcements.length, interval]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (carouselRef.current && carouselRef.current.contains(document.activeElement)) {
        switch (e.key) {
          case 'ArrowLeft':
            e.preventDefault();
            goToPrevious();
            break;
          case 'ArrowRight':
            e.preventDefault();
            goToNext();
            break;
          case ' ':
            e.preventDefault();
            setIsPaused(!isPaused);
            break;
          default:
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isPaused]);

  const goToNext = () => {
    setCurrentIndex(currentIndex === announcements.length - 1 ? 0 : currentIndex + 1);
  };

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? announcements.length - 1 : currentIndex - 1);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  // Touch/swipe support
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrevious();
    }
  };

  if (!announcements || announcements.length === 0) {
    return null;
  }

  const currentAnnouncement = announcements[currentIndex];

  return (
    <div 
      className={`announcements-carousel ${className}`}
      ref={carouselRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      tabIndex={0}
      role="region"
      aria-label="Announcements carousel"
    >
      {/* Main Content */}
      <div className="carousel-content">
        <div className="carousel-slide">
          {/* Background Image */}
          {currentAnnouncement.image && (
            <div 
              className="slide-background"
              style={{ backgroundImage: `url(${currentAnnouncement.image})` }}
            />
          )}
          
          {/* Content Overlay */}
          <div className="slide-overlay">
            <div className="slide-content">
              <div className="content-inner">
                {/* Badge */}
                {currentAnnouncement.badge && (
                  <div className="slide-badge">
                    {currentAnnouncement.badge}
                  </div>
                )}
                
                {/* Title */}
                <h2 className="slide-title">
                  {currentAnnouncement.title}
                </h2>
                
                {/* Description */}
                <p className="slide-description">
                  {currentAnnouncement.description}
                </p>
                
                {/* Features */}
                {currentAnnouncement.features && (
                  <div className="slide-features">
                    {currentAnnouncement.features.map((feature, index) => (
                      <div key={index} className="feature-item">
                        <i className={`fas ${feature.icon}`}></i>
                        <span>{feature.text}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Action Button */}
                {currentAnnouncement.link && (
                  <a 
                    href={currentAnnouncement.link}
                    className="slide-button"
                    target={currentAnnouncement.external ? "_blank" : "_self"}
                    rel={currentAnnouncement.external ? "noopener noreferrer" : ""}
                  >
                    {currentAnnouncement.buttonText || "Learn More"}
                    <i className="fas fa-arrow-right"></i>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {showArrows && announcements.length > 1 && (
        <>
          <button 
            className="carousel-arrow carousel-arrow--prev"
            onClick={goToPrevious}
            aria-label="Previous announcement"
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          <button 
            className="carousel-arrow carousel-arrow--next"
            onClick={goToNext}
            aria-label="Next announcement"
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </>
      )}

      {/* Dot Indicators */}
      {showDots && announcements.length > 1 && (
        <div className="carousel-dots">
          {announcements.map((_, index) => (
            <button
              key={index}
              className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to announcement ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Play/Pause Button */}
      {autoPlay && announcements.length > 1 && (
        <button 
          className="carousel-play-pause"
          onClick={() => setIsPaused(!isPaused)}
          aria-label={isPaused ? "Resume auto-play" : "Pause auto-play"}
        >
          <i className={`fas ${isPaused ? 'fa-play' : 'fa-pause'}`}></i>
        </button>
      )}
    </div>
  );
};

export default AnnouncementsCarousel;

