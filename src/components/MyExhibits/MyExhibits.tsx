import { useAuth } from "../Login/AuthContext";
import Unauthorized from "../Unauthorized/Unauthorized";
import Galleries from "./Galleries";

const MyExhibits = () => {
  const { user } = useAuth();
  if (!user) {
    return <Unauthorized />;
  }
  return (
    <div>
      <Galleries />
    </div>
  );
};

export default MyExhibits;
