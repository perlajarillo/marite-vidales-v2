import type { ReactNode } from "react";
import styles from "./Exhibits.module.css";
import type { Gallery } from "../../types/exhibits";

interface ExhibitsListProps<T> {
  title: string;
  items: Gallery[] | string[] | undefined;
  emptyMessage: string;
  containerClassName?: string;
  renderItem: (item: T, key: string) => ReactNode;
}

const ExhibitsList = <T,>({
  title,
  items,
  emptyMessage,
  renderItem,
}: ExhibitsListProps<T>) => {
  const hasItems = Boolean(items && Object.keys(items).length > 0);

  return (
    <section>
      <h6 className={styles.exhibitTitle}>{title}</h6>
      {hasItems ? (
        Object.entries(items ?? {}).map(([key, value]) => (
          <div key={key} className={styles.exhibitsList}>
            {renderItem(value, key)}
          </div>
        ))
      ) : (
        <p className={styles.exhibitItem}>{emptyMessage}</p>
      )}
    </section>
  );
};

export default ExhibitsList;
