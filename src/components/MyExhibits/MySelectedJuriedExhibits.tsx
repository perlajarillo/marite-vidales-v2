import { useAuth } from "../Login/AuthContext";
import intl from "../../locales/en.json";
import {
  updateJuriedExhibitItem,
  saveJuriedExhibits,
  createJuriedExhibitItem,
} from "../../services/exhibits";
import IndexedListEditor from "../Common/ListEditor/IndexedListEditor";
import { exhibitFields } from "./exhibitMetadata";
import useExhibits from "../../hooks/useExhibits";
import type { Exhibit } from "../../types/exhibits";

const emptyExhibitItem = { dates: "", name: "", place: "", year: "", index: 0 };

const MySelectedJuriedExhibits = () => {
  const { user } = useAuth();
  const { juried, loading, error, fetchData } = useExhibits();

  if (!user || loading) return null;
  console.log(juried);

  return (
    <IndexedListEditor<Exhibit>
      title={intl.SelectedJuriedExhibitions}
      addLabel={intl.addJuriedExhibit}
      editTitle={intl.editJuriedExhibit}
      emptyItem={emptyExhibitItem}
      items={juried}
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
      createItem={createJuriedExhibitItem}
      updateItem={updateJuriedExhibitItem}
      fetchData={fetchData}
      prependNewItem={true}
      saveOrder={saveJuriedExhibits}
    />
  );
};

export default MySelectedJuriedExhibits;
