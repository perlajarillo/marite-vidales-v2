import { useAuth } from "../Login/AuthContext";
import Unauthorized from "../Unauthorized/Unauthorized";
import SetBiography from "./SetBiography.tsx";

const MyBiography = () => {
  const { user } = useAuth();
  if (!user) {
    return <Unauthorized />;
  }
  return (
    <div className="pt-8 md:pt-0">
      <SetBiography />
    </div>
  );
};

export default MyBiography;
