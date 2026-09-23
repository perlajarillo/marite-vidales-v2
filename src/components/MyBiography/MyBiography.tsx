import { useAuth } from "../Login/AuthContext";
import Unauthorized from "../Unauthorized/Unauthorized";
import SetBiography from "./SetBiography.tsx";
import SetEducation from "./SetEducation.tsx";

const MyBiography = () => {
  const { user } = useAuth();
  if (!user) {
    return <Unauthorized />;
  }
  return (
    <div className="pt-8 md:pt-0">
      <SetBiography />
      <SetEducation />
    </div>
  );
};

export default MyBiography;
