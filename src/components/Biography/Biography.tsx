import intl from "../../locales/en.json";
import styles from "./Biography.module.css";
import BiographySectionList from "./BiographySectionList";
import BiographySkeleton from "./BiographySkeleton";
import useBiography from "../../hooks/useBiography";

const BiographyPage: React.FC = () => {
  const { data, error, hasData, loading, summary } = useBiography();

  if (loading) return <BiographySkeleton />;
  if (error) return <p>{intl.failedToLoadBiography}</p>;
  if (!hasData) return <p>{intl.noDataAvailable}</p>;

  return (
    <div className={styles.biographyContainer}>
      <section className={styles.summaryContainer}>
        <div className={styles.photoContainer}>
          <img
            src={data?.pictureUrl}
            alt="Marite Vidales"
            className={styles.photo}
            loading="lazy"
          />
        </div>
        <p className={styles.summaryText}>{summary}</p>
      </section>
      <BiographySectionList
        title={intl.education}
        items={data?.education}
        emptyMessage={intl.noEducationAdded}
        renderItem={(edu) => (
          <p className={styles.sectionItem}>
            {edu.field}. {edu.degree}. {edu.institution}. {edu.country}.{" "}
            {edu.year}
          </p>
        )}
      />
      <BiographySectionList
        title={intl.professionalExperience}
        items={data?.experience}
        emptyMessage={intl.noProfessionalExperienceAdded}
        containerClassName={styles.experienceContainer}
        renderItem={(exp) => (
          <p className={styles.sectionItem}>
            {exp.position}. {exp.institution}. {exp.country}. {exp.dates}
          </p>
        )}
      />
    </div>
  );
};

export default BiographyPage;
