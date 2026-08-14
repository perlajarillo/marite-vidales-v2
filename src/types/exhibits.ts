interface Gallery {
  address: string;
  gallery: string;
}

export interface Exhibit {
  dates: string;
  name: string;
  place: string;
  year: string;
}

interface ExhibitPicture {
  caption: string;
  url: string;
  order: number;
}

export interface Exhibits {
  galleries: Record<string, Gallery>;
  grantsAndAwards: Record<string, string>;
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
