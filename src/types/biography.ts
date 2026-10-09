export interface EducationItem {
  country: string;
  degree: string;
  field: string;
  index: number;
  institution: string;
  year: string;
  id: string;
}

export interface ExperienceItem {
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

export interface EducationRow {
  i: number;
  key: string;
}

export interface RecordKey {
  recordKey: string;
}
export type EducationForm = EducationItem & RecordKey;
export type ExperienceForm = ExperienceItem & RecordKey;
