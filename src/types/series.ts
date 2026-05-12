export interface ImageDetail {
  checked: boolean;
  file: string;
  url: string;
  title: string;
  measures: string;
  technique: string;
  year: string;
  isTopTen?: boolean;
  order?: string | number;
  collectionType?: string;
  [key: string]: any;
}

export interface Series {
  name: string;
  description: string;
  shortDescription: string;
  images_details?: ImageDetail[];
  cover: number;
  order: number;
  isInTopSeries?: boolean;
}