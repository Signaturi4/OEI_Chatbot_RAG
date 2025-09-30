import React, { useState, useEffect } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import CourseDetailCard from "./CourseDetailCard";
import styled from "styled-components";
import { spacing } from "../../styles/theme";
import { Course } from "../../types";
import ArrowIcon from "../ui/ArrowIcon";

interface CourseCarouselProps {
  courses: Course[];
  onScrollToBottom: () => void;
}

const MAX_WIDTH = 600; // Match the input bar width

const CarouselContainer = styled.div`
  margin-top: ${spacing.md};
  width: 100%;
  max-width: ${MAX_WIDTH}px;
  margin-left: auto;
  margin-right: auto;

  .carousel-slide {
    padding: 0 ${spacing.sm};
    display: flex;
    justify-content: center;
  }

  .carousel .control-arrow {
    background: rgba(185, 19, 23, 0.8);
    border-radius: 50%;
    width: 40px;
    height: 40px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    color: white;
    font-size: 0;

    &:before {
      display: none;
    }

    &:hover {
      background: rgba(185, 19, 23, 1);
    }
  }

  .carousel .control-dots {
    margin-top: ${spacing.md};
  }

  .carousel .control-dots .dot {
    background: rgba(185, 19, 23, 0.3);
    border-radius: 50%;
    width: 12px;
    height: 12px;
    margin: 0 4px;
  }

  .carousel .control-dots .dot.selected {
    background: rgba(185, 19, 23, 1);
  }
`;

const CourseCarousel: React.FC<CourseCarouselProps> = ({
  courses,
  onScrollToBottom,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Auto-scroll to bottom when cards are unfolded
  useEffect(() => {
    if (isExpanded) {
      // Small delay to ensure the content has expanded
      const timeoutId = setTimeout(() => {
        onScrollToBottom();
      }, 150); // Reduced delay for quicker response

      return () => clearTimeout(timeoutId);
    }
  }, [isExpanded, onScrollToBottom]);

  if (!courses || courses.length === 0) {
    return null;
  }

  return (
    <CarouselContainer>
      <Carousel
        showThumbs={false}
        showStatus={false}
        infiniteLoop={true}
        emulateTouch={true}
        showArrows={courses.length > 1}
        showIndicators={courses.length > 1}
        className="course-carousel"
        renderArrowPrev={(onClickHandler, hasPrev, label) =>
          hasPrev && (
            <button
              type="button"
              className="control-arrow control-prev"
              onClick={onClickHandler}
              aria-label={label}
            >
              <ArrowIcon direction="left" />
            </button>
          )
        }
        renderArrowNext={(onClickHandler, hasNext, label) =>
          hasNext && (
            <button
              type="button"
              className="control-arrow control-next"
              onClick={onClickHandler}
              aria-label={label}
            >
              <ArrowIcon direction="right" />
            </button>
          )
        }
      >
        {courses.map((course) => (
          <div key={course.course_id} className="carousel-slide">
            <CourseDetailCard
              course={course}
              isExpanded={isExpanded}
              onToggleExpanded={() => setIsExpanded(!isExpanded)}
            />
          </div>
        ))}
      </Carousel>
    </CarouselContainer>
  );
};

export default CourseCarousel;
