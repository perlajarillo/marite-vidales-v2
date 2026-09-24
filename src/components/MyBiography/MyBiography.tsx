import { useAuth } from "../Login/AuthContext";
import Unauthorized from "../Unauthorized/Unauthorized";
import SummaryAndPicture from "./SummaryAndPicture.tsx";
import Education from "./Education.tsx";

const MyBiography = () => {
  const { user } = useAuth();
  if (!user) {
    return <Unauthorized />;
  }
  return (
    <div className="pt-8 md:pt-0">
      <SummaryAndPicture />
      <Education />
    </div>
  );
};

export default MyBiography;
