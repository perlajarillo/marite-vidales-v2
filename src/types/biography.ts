interface EducationItem {
  country: string;
  degree: string;
  field: string;
  index: number;
  institution: string;
  year: string;
}

interface ExperienceItem {
  country: string;
  dates: string;
  index: number;
  institution: string;
  position: string;
}

export interface Biography {
  education: Record<string, EducationItem>;
  experience: Record<string, ExperienceItem>;
  pictureUrl: string;
  summary: string;
}