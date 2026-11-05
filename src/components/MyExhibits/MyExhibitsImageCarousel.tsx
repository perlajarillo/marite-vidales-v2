import useExhibits from "../../hooks/useExhibits";
import { Carousel } from "../Common/Carousel/Carousel";
import styles from "../Exhibits/Exhibits.module.css";
import ImagesEditor from "../Common/ListEditor/ImagesEditor";
import type { ExhibitPicture } from "../../types/exhibits";
import { carouselFields } from "./carouselMetadata";
import {
  updateCarouselItem,
  saveCarouselExhibits,
  createCarouselExhibitItem,
  createCarouselExhibitItems,
} from "../../services/exhibits";
import intl from "../../locales/en.json";
import myExhibitsStyle from "./MyExhibits.module.css";

const MyExhibitsImageCarousel = () => {
  const { carousel, fetchData } = useExhibits();
  const carouselData = carousel ? Object.values(carousel) : [];
  const images = carouselData
    .map((picture) => ({
      src: picture.url,
      alt: picture.caption,
      caption: picture.caption,
      order: picture.order,
    }))
    .sort((a, b) => a.order - b.order);

  const refetchData = () => {
    fetchData();
  };

  return (
    <section className={myExhibitsStyle.exhibitsSection}>
      <div className={styles.carouselContainer}>
        <Carousel images={images} autoPlay={true} fitHeight={true} />
      </div>
      <ImagesEditor<ExhibitPicture>
        title={intl.carouselImageManager}
        addLabel={intl.addImage}
        editTitle={intl.editImage}
        emptyItem={{
          url: "",
          caption: "",
          order: 0,
        }}
        items={carousel}
        fields={carouselFields}
        messages={{
          added: intl.imageAdded,
          updated: intl.imageUpdated,
          deleted: intl.imageDeleted,
          error: intl.errorWhileProcessing,
          deleteTitle: intl.deleteImage,
          deleteBody: intl.deleteImageConfirmation,
          emptyMessage: intl.noImageAddedYet,
          allFieldsRequired: intl.allFieldsRequired,
          editLabel: intl.edit,
          deleteLabel: intl.delete,
          orderUpdated: intl.imageOrderUpdated,
          orderTitle: intl.orderImage,
          orderBody: intl.orderImageConfirmation,
          changeOrderLabel: intl.changeOrder,
        }}
        formatSummary={(item) => (
          <div className={myExhibitsStyle.carouselSummaryContainer}>
            <img
              src={item.url}
              alt={item.caption}
              className={myExhibitsStyle.carouselImage}
            />
            <span className={myExhibitsStyle.carouselImageCaption}>
              {item.caption}
            </span>
          </div>
        )}
        createItem={createCarouselExhibitItem}
        updateItem={updateCarouselItem}
        fetchData={refetchData}
        saveOrder={saveCarouselExhibits}
        createItemsInBulk={createCarouselExhibitItems}
      />
    </section>
  );
};

export default MyExhibitsImageCarousel;
