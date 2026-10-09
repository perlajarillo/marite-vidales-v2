import { useAuth } from "../Login/AuthContext";
import useBiography from "../../hooks/useBiography";
import intl from "../../locales/en.json";
import {
  createEducationItem,
  saveBiographyEducation,
  updateEducationItem,
} from "../../services/biography";
import type { EducationItem } from "../../types/biography";
import OrderedBiographyEditor from "../Common/ListEditor/ListEditor";
import { educationFields } from "./educationMetadata";

const emptyEducationItem: EducationItem = {
  field: "",
  degree: "",
  institution: "",
  country: "",
  year: "",
  id: "",
  index: 0,
};

const Education = () => {
  const { user } = useAuth();
  const { education, loading, fetchData } = useBiography();

  if (!user || loading) return null;

  return (
    <OrderedBiographyEditor<EducationItem>
      title={intl.education}
      addLabel={intl.addEducation}
      editTitle={intl.editEducation}
      emptyItem={emptyEducationItem}
      items={education}
      fields={educationFields}
      messages={{
        added: intl.educationAdded,
        updated: intl.educationUpdated,
        deleted: intl.educationDeleted,
        orderUpdated: intl.educationOrderUpdated,
        error: intl.somethingWentWrong,
        deleteTitle: intl.deleteEducationEntry,
        orderTitle: intl.changeEducationOrder,
        deleteBody: intl.actionCanNotBeUndone,
        orderBody: intl.areYouSureToUpdateOrder,
        emptyMessage: intl.noEducationAdded,
        allFieldsRequired: intl.allFieldsRequired,
        editLabel: intl.edit,
        deleteLabel: intl.delete,
        changeOrderLabel: intl.changeOrder,
      }}
      formatSummary={(item) =>
        `${item.field}. ${item.degree}. ${item.institution}. ${item.country}. ${item.year}`
      }
      createItem={createEducationItem}
      updateItem={updateEducationItem}
      saveOrder={saveBiographyEducation}
      fetchData={fetchData}
    />
  );
};

export default Education;
