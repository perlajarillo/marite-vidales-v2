import type { ReactNode } from "react";
import styles from "./Biography.module.css";

interface BiographySectionListProps<T> {
  title: string;
  items: Record<string, T> | undefined;
  emptyMessage: string;
  containerClassName?: string;
  renderItem: (item: T, key: string) => ReactNode;
}

const BiographySectionList = <T,>({
  title,
  items,
  emptyMessage,
  containerClassName = styles.educationContainer,
  renderItem,
}: BiographySectionListProps<T>) => {
  const hasItems = Boolean(items && Object.keys(items).length > 0);

  return (
    <section className={containerClassName}>
      <h6 className={styles.sectionTitle}>{title}</h6>
      {hasItems ? (
        Object.entries(items ?? {}).map(([key, value]) => (
          <div key={key}>{renderItem(value, key)}</div>
        ))
      ) : (
        <p className={styles.sectionItem}>{emptyMessage}</p>
      )}
    </section>
  );
};

export default BiographySectionList;
