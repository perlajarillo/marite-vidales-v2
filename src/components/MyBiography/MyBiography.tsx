import { useAuth } from "../Login/AuthContext";
import Unauthorized from "../Unauthorized/Unauthorized";
import SummaryAndPicture from "./SummaryAndPicture.tsx";
import Education from "./Education.tsx";
import ProfessionalExperience from "./ProfessionalExperience.tsx";

const MyBiography = () => {
  const { user } = useAuth();
  if (!user) {
    return <Unauthorized />;
  }
  return (
    <div className="pt-8 md:pt-0 flex flex-col gap-5">
      <SummaryAndPicture />
      <Education />
      <ProfessionalExperience />
    </div>
  );
};

export default MyBiography;
