import type { GroupedExhibitsByYear } from "../../types/exhibits";
import styles from "./Exhibits.module.css";

interface GroupedExhibitsProps {
  data: GroupedExhibitsByYear;
  title?: string;
}
export const GroupedExhibits: React.FC<GroupedExhibitsProps> = ({
  data,
  title,
}) => {
  return (
    <div className={styles.groupedExhibitsContainer}>
      <h6 className={styles.exhibitTitle}>{title}</h6>
      {Object.entries(data)
        .sort((a, b) => Number(b[0]) - Number(a[0]))
        .map((entry) => {
          const year = entry[0];
          const exhibits = entry[1];
          return (
            <div className={styles.groupedExhibitsList} key={year}>
              <h6>{year}</h6>
              <div className={styles.groupedExhibitGrid}>
                {exhibits.map((exhibit) => (
                  <p key={exhibit.key}>
                    <span className="italic">{exhibit.name}</span>
                    {`. ${exhibit.place}. ${exhibit.dates}.`}
                  </p>
                ))}
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default GroupedExhibits;
