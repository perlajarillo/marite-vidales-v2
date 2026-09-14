import { useAuth } from "../../Login/AuthContext";
import UnderConstruction from "../UnderConstruction/UnderConstruction";
import Unauthorized from "../Unauthorized/Unauthorized";

const MyExhibits = () => {
  const { user } = useAuth();
  if (!user) {
    return <Unauthorized />;
  }
  return (
    <div>
      <UnderConstruction />
    </div>
  );
};

export default MyExhibits;
