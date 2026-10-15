import { useAuth } from "../Login/AuthContext";
import Unauthorized from "../Unauthorized/Unauthorized";
import Galleries from "./Galleries";
import MyGrantsAndAwards from "./MyGrantsAndAwards";
import MySelectedGroupExhibits from "./MySelectedGroupExhibits";
import MySelectedJuriedExhibits from "./MySelectedJuriedExhibits";
import MySelectedSoloExhibits from "./MySelectedSoloExhibits";

const MyExhibits = () => {
  const { user } = useAuth();
  if (!user) {
    return <Unauthorized />;
  }
  return (
    <div className="mt-8 md:pt-0 flex flex-col gap-5">
      <Galleries />
      <MyGrantsAndAwards />
      <MySelectedSoloExhibits />
      <MySelectedJuriedExhibits />
      <MySelectedGroupExhibits />
    </div>
  );
};

export default MyExhibits;
