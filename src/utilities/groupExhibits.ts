import type { Exhibit, GroupedExhibitsByYear } from "../types/exhibits";

export const groupExhibitByYear = (data: Record<string, Exhibit>) =>
  [...Object.entries(data)].reduce<GroupedExhibitsByYear>(
    (acc, [key, exhibit]) => {
      const year = exhibit.year;

      // Group initialization
      if (!acc[year]) {
        acc[year] = [];
      }

      // Grouping
      acc[year].push({ key, ...exhibit });

      return acc;
    },
    {},
  );
