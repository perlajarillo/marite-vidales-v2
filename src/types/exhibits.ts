export interface Gallery {
  address: string;
  gallery: string;
  index: number;
}

export interface GrantAward {
  grantAward: string;
  index: number;
}

export interface Exhibit {
  dates: string;
  name: string;
  place: string;
  year: string;
  index: number;
}

export interface ExhibitPicture {
  caption: string;
  url: string;
  order: number;
}

export interface Exhibits {
  galleries: Record<string, Gallery>;
  grantsAndAwards: Record<string, GrantAward>;
  juried: Record<string, Exhibit>;
  selected: Record<string, Exhibit>;
  solo: Record<string, Exhibit>;
  carousel: Record<string, ExhibitPicture>;
}

export type GroupedExhibitsByYear = Record<
  string,
  ({
    key: string;
  } & Exhibit)[]
>;
