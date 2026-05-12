interface Gallery {
  address: string;
  gallery: string;
}

interface Exhibit {
  dates: string;
  name: string;
  place: string;
  year: string;
}

export interface Exhibits {
  galleries: Record<string, Gallery>;
  grantsAndAwards: Record<string, string>;
  juried: Record<string, Exhibit>;
  selected: Record<string, Exhibit>;
  solo: Record<string, Exhibit>;
}