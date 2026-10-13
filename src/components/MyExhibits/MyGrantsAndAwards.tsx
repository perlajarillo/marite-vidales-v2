import { useAuth } from "../Login/AuthContext";
import intl from "../../locales/en.json";
import {
  saveGrantAwards,
  updateGrantAwardItem,
  createGrantAwardItem,
} from "../../services/exhibits";
import IndexedListEditor from "../Common/ListEditor/IndexedListEditor";
import { grantsAndAwardsFields } from "./grantsAndAwardsMetadata";
import useExhibits from "../../hooks/useExhibits";
import type { GrantAward } from "../../types/exhibits";

const emptyGrantAwardItem = { grantAward: "", index: 0 };

const MyGrantsAndAwards = () => {
  const { user } = useAuth();
  const { grantsAndAwards, loading, error, fetchData } = useExhibits();

  if (!user || loading) return null;
  console.log(grantsAndAwards);

  return (
    <IndexedListEditor<GrantAward>
      title={intl.GrantsAndAwards}
      addLabel={intl.addGrantOrAward}
      editTitle={intl.editGrantOrAward}
      emptyItem={emptyGrantAwardItem}
      items={grantsAndAwards}
      fields={grantsAndAwardsFields}
      messages={{
        added: intl.galleryAdded,
        updated: intl.galleryUpdated,
        deleted: intl.galleryDeleted,
        error: error?.message || intl.somethingWentWrong,
        deleteTitle: intl.deleteGrantAwardEntry,
        deleteBody: intl.actionCanNotBeUndone,
        emptyMessage: intl.noGrantAwardAdded,
        allFieldsRequired: intl.allFieldsRequired,
        editLabel: intl.edit,
        deleteLabel: intl.delete,
        orderUpdated: intl.grantAwardOrderUpdated,
        orderTitle: intl.changeGrantAwardOrder,
        orderBody: intl.areYouSureToUpdateOrder,
        changeOrderLabel: intl.changeOrder,
      }}
      formatSummary={(item) => item.grantAward}
      createItem={createGrantAwardItem}
      updateItem={updateGrantAwardItem}
      fetchData={fetchData}
      prependNewItem={true}
      saveOrder={saveGrantAwards}
    />
  );
};

export default MyGrantsAndAwards;
