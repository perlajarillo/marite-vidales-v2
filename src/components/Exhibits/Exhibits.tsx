import useExhibits from "../../hooks/useExhibits";
import intl from "../../locales/en.json";
import { groupExhibitByYear } from "../../utilities/groupExhibits";
import { Carousel } from "../Common/Carousel/Carousel";
import GroupedExhibits from "./GroupedExhibits";
import styles from "./Exhibits.module.css";
import ExhibitsList from "./ExhibitsList";
import ExhibitsSkeleton from "./ExhibitsSkeleton";
import type { Gallery } from "../../types/exhibits";

const Exhibits = () => {
  const { data, loading } = useExhibits();
  const carouselData = data?.carousel ? Object.values(data.carousel) : [];
  const carouselImages = carouselData.map((picture) => ({
    src: picture.url,
    alt: picture.caption,
    caption: picture.caption,
  }));
  const galleries = data?.galleries ? Object.values(data.galleries) : [];
  const soloExhibitions = data?.solo ?? {};
  const juriedExhibitions = data?.juried ?? {};
  const selectedGroupExhibitions = data?.selected ?? {};
  const topGrantsAndAwards = data?.grantsAndAwards
    ? Object.values(data.grantsAndAwards).slice(0).reverse()
    : [];

  return (
    <div className={styles.exhibitsContainer}>
      {loading ? (
        <ExhibitsSkeleton />
      ) : (
        data &&
        carouselImages && (
          <div className={styles.exhibitsContent}>
            <div className={styles.carouselContainer}>
              <Carousel
                images={carouselImages}
                autoPlay={true}
                fitHeight={true}
              />
            </div>
            {/* Render exhibit data here */}
            <div className={styles.exhibits}>
              <ExhibitsList
                title={intl.Galleries}
                items={galleries}
                emptyMessage={intl.noEducationAdded}
                renderItem={(gallery: Gallery) => (
                  <p
                    key={gallery.gallery}
                  >{`${gallery.gallery}. ${gallery.address}`}</p>
                )}
              />
              <ExhibitsList
                title={intl.GrantsAndAwards}
                items={topGrantsAndAwards}
                emptyMessage={intl.noEducationAdded}
                renderItem={(grant: string) => <p key={grant}>{grant}</p>}
              />

              <GroupedExhibits
                data={groupExhibitByYear(soloExhibitions)}
                title={intl.SelectedSoloExhibitions}
              />

              <GroupedExhibits
                data={groupExhibitByYear(juriedExhibitions)}
                title={intl.SelectedJuriedExhibitions}
              />
              <GroupedExhibits
                data={groupExhibitByYear(selectedGroupExhibitions)}
                title={intl.SelectedGroupExhibitions}
              />
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default Exhibits;
