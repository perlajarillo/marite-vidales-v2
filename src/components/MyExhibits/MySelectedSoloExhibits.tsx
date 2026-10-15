import { useAuth } from "../Login/AuthContext";
import intl from "../../locales/en.json";
import {
  updateSoloExhibitItem,
  saveSoloExhibits,
  createSoloExhibitItem,
} from "../../services/exhibits";
import IndexedListEditor from "../Common/ListEditor/IndexedListEditor";
import { exhibitFields } from "./exhibitMetadata";
import useExhibits from "../../hooks/useExhibits";
import type { Exhibit } from "../../types/exhibits";

const emptyExhibitItem = { dates: "", name: "", place: "", year: "", index: 0 };

const MySelectedSoloExhibits = () => {
  const { user } = useAuth();
  const { solo, loading, error, fetchData } = useExhibits();

  if (!user || loading) return null;

  return (
    <IndexedListEditor<Exhibit>
      title={intl.SelectedSoloExhibitions}
      addLabel={intl.addSoloExhibit}
      editTitle={intl.editSoloExhibit}
      emptyItem={emptyExhibitItem}
      items={solo}
      fields={exhibitFields}
      messages={{
        added: intl.exhibitAdded,
        updated: intl.exhibitUpdated,
        deleted: intl.exhibitDeleted,
        error: error?.message || intl.somethingWentWrong,
        deleteTitle: intl.deleteExhibitEntry,
        deleteBody: intl.actionCanNotBeUndone,
        emptyMessage: intl.noExhibitsAdded,
        allFieldsRequired: intl.allFieldsRequired,
        editLabel: intl.edit,
        deleteLabel: intl.delete,
        orderUpdated: intl.exhibitOrderUpdated,
        orderTitle: intl.changeExhibitOrder,
        orderBody: intl.areYouSureToUpdateOrder,
        changeOrderLabel: intl.changeOrder,
      }}
      formatSummary={(item) => (
        <p>
          <span className="font-semibold">{item.year}. </span>
          <span className="italic">{item.name}</span>
          {`. ${item.place}. ${item.dates}.`}
        </p>
      )}
      createItem={createSoloExhibitItem}
      updateItem={updateSoloExhibitItem}
      fetchData={fetchData}
      prependNewItem={true}
      saveOrder={saveSoloExhibits}
    />
  );
};

export default MySelectedSoloExhibits;
