import { useAuth } from "../Login/AuthContext";
import intl from "../../locales/en.json";
import {
  saveGalleries,
  createGalleryItem,
  updateGalleryItem,
} from "../../services/exhibits";
import IndexedListEditor from "../Common/ListEditor/IndexedListEditor";
import { galleryFields } from "./galleryMetadata";
import type { Gallery } from "../../types/exhibits";
import useExhibits from "../../hooks/useExhibits";

const emptyGalleryItem: Gallery = {
  address: "",
  gallery: "",
  index: 0,
};

const Galleries = () => {
  const { user } = useAuth();
  const { galleries, loading, error, fetchData } = useExhibits();

  if (!user || loading) return null;
  console.log(galleries);
  return (
    <IndexedListEditor<Gallery>
      title={intl.Galleries}
      addLabel={intl.addGallery}
      editTitle={intl.editGallery}
      emptyItem={emptyGalleryItem}
      items={galleries}
      fields={galleryFields}
      messages={{
        added: intl.galleryAdded,
        updated: intl.galleryUpdated,
        deleted: intl.galleryDeleted,
        orderUpdated: intl.galleriesOrderUpdated,
        error: error?.message || intl.somethingWentWrong,
        deleteTitle: intl.deleteGalleryEntry,
        orderTitle: intl.changeGalleryOrder,
        deleteBody: intl.actionCanNotBeUndone,
        orderBody: intl.areYouSureToUpdateOrder,
        emptyMessage: intl.noGalleryAdded,
        allFieldsRequired: intl.allFieldsRequired,
        editLabel: intl.edit,
        deleteLabel: intl.delete,
        changeOrderLabel: intl.changeOrder,
      }}
      formatSummary={(item) => `${item.gallery}. ${item.address}`}
      createItem={createGalleryItem}
      updateItem={updateGalleryItem}
      saveOrder={saveGalleries}
      fetchData={fetchData}
      prependNewItem={true}
    />
  );
};

export default Galleries;
