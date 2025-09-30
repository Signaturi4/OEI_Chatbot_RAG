import React, { useState } from "react";
import styled from "styled-components";
import { colors, spacing } from "../../styles/theme";
import { Course } from "../../types";

// Updated CourseDetailCard with foldable design
interface CourseDetailCardProps {
  course: Course;
  isExpanded: boolean;
  onToggleExpanded: () => void;
}

const CardContainer = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.06);
  margin: ${spacing.sm};
  max-width: 500px;
  width: 100%;
  overflow: hidden;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
`;

const CardHeader = styled.div`
  padding: ${spacing.lg};
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  transition: background-color 0.2s ease;
  min-height: 80px; /* Fixed header height */
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
  flex: 1;
  align-items: center;
`;

const FoldedButton = styled.button`
  background: ${colors.primary};
  color: white;
  border: none;
  border-radius: 12px;
  padding: ${spacing.sm} ${spacing.md};
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #b8251a;
    transform: translateY(-1px);
  }

  &:active {
    transform: scale(0.98);
  }
`;

const CardContent = styled.div<{ isExpanded: boolean }>`
  max-height: ${(props) => (props.isExpanded ? "1000px" : "0")};
  overflow: hidden;
  transition: max-height 0.3s ease;
  flex: 1;
`;

const ExpandIcon = styled.div<{ isExpanded: boolean }>`
  transform: ${(props) =>
    props.isExpanded ? "rotate(0deg)" : "rotate(180deg)"};
  transition: transform 0.3s ease;
  cursor: pointer;
  padding: ${spacing.xs};
  border-radius: 4px;

  &:hover {
    background: rgba(185, 19, 23, 0.1);
  }

  svg {
    width: 20px;
    height: 20px;
    color: ${colors.primary};
  }
`;

const CourseTitle = styled.h1`
  color: ${colors.primary};
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  line-height: 1.3;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: #b8251a;
  }
`;

const CourseContent = styled.div`
  padding: ${spacing.lg};
`;

const TabContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const TabHeader = styled.div`
  display: flex;
  justify-content: center;
  border-bottom: 2px solid rgba(0, 0, 0, 0.06);
  margin-bottom: ${spacing.md};
`;

const TabButton = styled.button<{ active: boolean }>`
  background: none;
  border: none;
  padding: ${spacing.sm} ${spacing.lg};
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  color: ${(props) => (props.active ? colors.primary : colors.textLight)};
  border-bottom: 2px solid
    ${(props) => (props.active ? colors.primary : "transparent")};
  transition: all 0.2s ease;
  border-radius: 8px 8px 0 0;

  &:hover {
    color: ${colors.primary};
    background: rgba(185, 19, 23, 0.05);
  }
`;

const TabContent = styled.div<{ active: boolean }>`
  display: ${(props) => (props.active ? "block" : "none")};
  min-height: 200px;
`;

const DescriptionText = styled.p`
  color: #6f767e;
  font-size: 14px;
  line-height: 1.6;
  margin: 0 0 ${spacing.lg} 0;
`;

const DetailsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const DetailItem = styled.li`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${spacing.sm};
  font-size: 14px;
`;

const DetailName = styled.span`
  color: #6f767e;
  font-weight: 500;
`;

const DetailValue = styled.span`
  color: ${colors.primary};
  font-weight: 600;
`;

const ScheduleSection = styled.div`
  margin: ${spacing.md} 0;
`;

const ScheduleTitle = styled.div`
  color: #6f767e;
  font-size: 14px;
  margin-bottom: ${spacing.sm};
`;

const ScheduleDay = styled.div`
  color: ${colors.primary};
  font-weight: 600;
  font-size: 14px;
`;

const ParticipantsSection = styled.div`
  display: flex;
  justify-content: center;
  gap: ${spacing.xl};
  margin: ${spacing.lg} 0;
  padding: ${spacing.md};
  background: rgba(185, 19, 23, 0.05);
  border-radius: 12px;
`;

const ParticipantInfo = styled.div`
  text-align: center;
`;

const ParticipantLabel = styled.p`
  color: ${colors.primary};
  font-size: 14px;
  font-weight: 500;
  margin: 0 0 ${spacing.xs} 0;
`;

const ParticipantValue = styled.span`
  color: ${colors.primary};
  font-size: 16px;
  font-weight: 700;
`;

const WarningText = styled.p`
  color: ${colors.primary};
  font-size: 12px;
  margin: ${spacing.md} 0 0 0;
  text-align: center;
`;

const TUExplanation = styled.span`
  color: ${colors.primary};
  font-size: 12px;
  font-weight: 500;
  font-style: italic;
`;

const BookButton = styled.button`
  background: ${colors.primary};
  color: white;
  border: none;
  border-radius: 12px;
  padding: ${spacing.md};
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  width: 100%;
  transition: all 0.2s ease;
  margin-top: ${spacing.lg};

  &:hover {
    background: #b8251a;
    transform: translateY(-1px);
  }

  &:active {
    transform: scale(0.98);
  }
`;

const formatDate = (dateString: string): string => {
  if (!dateString) return "TBD";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
};

const formatSchedule = (course: Course): string => {
  if (course.course_weekdays && course.course_weekdays.length > 0) {
    const weekday = course.course_weekdays[0];
    const day = weekday.week_day;
    const startTime = weekday.start_time
      ? new Date(weekday.start_time).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      : "";
    const endTime = weekday.finish_time
      ? new Date(weekday.finish_time).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      : "";

    // Only return schedule if we have valid day and times
    if (day && startTime && endTime) {
      return `${day} (${startTime}-${endTime})`;
    }
  }
  return "";
};

const CourseDetailCard: React.FC<CourseDetailCardProps> = ({
  course,
  isExpanded,
  onToggleExpanded,
}) => {
  const [activeTab, setActiveTab] = useState<"description" | "details">(
    "details"
  );

  const handleBookClick = () => {
    if (course.checkout_url) {
      window.open(course.checkout_url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <CardContainer>
      <CardHeader>
        <HeaderContent>
          <HeaderLeft>
            <CourseTitle onClick={onToggleExpanded}>{course.title}</CourseTitle>
            {!isExpanded && (
              <FoldedButton onClick={handleBookClick}>
                BOOK {course.currency_symbol} {course.price}
              </FoldedButton>
            )}
          </HeaderLeft>
          <ExpandIcon isExpanded={isExpanded} onClick={onToggleExpanded}>
            <svg
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </ExpandIcon>
        </HeaderContent>
      </CardHeader>

      <CardContent isExpanded={isExpanded}>
        <CourseContent>
          <TabContainer>
            <TabHeader>
              <TabButton
                active={activeTab === "description"}
                onClick={() => setActiveTab("description")}
              >
                Description
              </TabButton>
              <TabButton
                active={activeTab === "details"}
                onClick={() => setActiveTab("details")}
              >
                Course details
              </TabButton>
            </TabHeader>

            <TabContent active={activeTab === "description"}>
              <DescriptionText>
                {course.description ||
                  "Course description will be available soon. This course is designed to provide comprehensive language learning experience."}
              </DescriptionText>
            </TabContent>

            <TabContent active={activeTab === "details"}>
              <DetailsList>
                <DetailItem>
                  <DetailName>Course ID:</DetailName>
                  <DetailValue>{course.course_id}</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailName>Level:</DetailName>
                  <DetailValue>{course.level || "N/A"}</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailName>Course format:</DetailName>
                  <DetailValue>{course.format || "N/A"}</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailName>Booking location:</DetailName>
                  <DetailValue>{course.location_city || "N/A"}</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailName>Course category:</DetailName>
                  <DetailValue>{course.category || "N/A"}</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailName>Target group:</DetailName>
                  <DetailValue>{course.target_group || "N/A"}</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailName>Course start:</DetailName>
                  <DetailValue>{formatDate(course.start_date)}</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailName>Course end:</DetailName>
                  <DetailValue>{formatDate(course.end_date)}</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailName>Frequency:</DetailName>
                  <DetailValue>{course.frequency || "N/A"}</DetailValue>
                </DetailItem>

                {formatSchedule(course) && (
                  <ScheduleSection>
                    <ScheduleTitle>Schedule:</ScheduleTitle>
                    <ScheduleDay>{formatSchedule(course)}</ScheduleDay>
                  </ScheduleSection>
                )}

                <DetailItem>
                  <DetailName>Duration TU*:</DetailName>
                  <DetailValue>{course.lesson_duration || "N/A"}</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailName>Number of TU*:</DetailName>
                  <DetailValue>{course.lesson_count || "N/A"}</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailName>Course book:</DetailName>
                  <DetailValue>
                    {course.books_included
                      ? "Included"
                      : "Not included in price"}
                  </DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailName>Exam fees:</DetailName>
                  <DetailValue>{course.exam_fees || "N/A"}</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailName></DetailName>
                  <DetailValue>
                    <TUExplanation>*TU – Teaching Unit</TUExplanation>
                  </DetailValue>
                </DetailItem>
              </DetailsList>

              <ParticipantsSection>
                <ParticipantInfo>
                  <ParticipantLabel>Participants min:</ParticipantLabel>
                  <ParticipantValue>
                    {course.min_participants || "N/A"}
                  </ParticipantValue>
                </ParticipantInfo>
                <ParticipantInfo>
                  <ParticipantLabel>Participants max:</ParticipantLabel>
                  <ParticipantValue>
                    {course.max_participants || "N/A"}
                  </ParticipantValue>
                </ParticipantInfo>
              </ParticipantsSection>

              <WarningText>
                Course will only take place if minimum participants are reached.
              </WarningText>
            </TabContent>
          </TabContainer>

          <BookButton onClick={handleBookClick}>
            BOOK {course.currency_symbol} {course.price}
          </BookButton>
        </CourseContent>
      </CardContent>
    </CardContainer>
  );
};

export default CourseDetailCard;
