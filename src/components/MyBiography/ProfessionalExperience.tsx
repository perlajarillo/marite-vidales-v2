import { useAuth } from "../Login/AuthContext";
import useBiography from "../../hooks/useBiography";
import intl from "../../locales/en.json";
import {
  createExperienceItem,
  saveBiographyExperience,
  updateExperienceItem,
} from "../../services/biography";
import type { ExperienceItem } from "../../types/biography";
import OrderedBiographyEditor from "../Common/ListEditor/ListEditor";
import { experienceFields } from "./experienceMetadata";

const emptyExperienceItem: ExperienceItem = {
  position: "",
  institution: "",
  country: "",
  dates: "",
  index: 0,
};

const ProfessionalExperience = () => {
  const { user } = useAuth();
  const { experience, loading, fetchData } = useBiography();

  if (!user || loading) return null;

  return (
    <OrderedBiographyEditor<ExperienceItem>
      title={intl.experience}
      addLabel={intl.addExperience}
      editTitle={intl.editExperience}
      emptyItem={emptyExperienceItem}
      items={experience}
      fields={experienceFields}
      messages={{
        added: intl.experienceAdded,
        updated: intl.experienceUpdated,
        deleted: intl.experienceDeleted,
        orderUpdated: intl.experienceOrderUpdated,
        error: intl.somethingWentWrong,
        deleteTitle: intl.deleteExperienceEntry,
        orderTitle: intl.changeExperienceOrder,
        deleteBody: intl.actionCanNotBeUndone,
        orderBody: intl.areYouSureToUpdateOrder,
        emptyMessage: intl.noProfessionalExperienceAdded,
        allFieldsRequired: intl.allFieldsRequired,
        editLabel: intl.edit,
        deleteLabel: intl.delete,
        changeOrderLabel: intl.changeOrder,
      }}
      formatSummary={(item) =>
        `${item.position}. ${item.institution}. ${item.country}. ${item.dates}`
      }
      createItem={createExperienceItem}
      updateItem={updateExperienceItem}
      saveOrder={saveBiographyExperience}
      fetchData={fetchData}
    />
  );
};

export default ProfessionalExperience;
