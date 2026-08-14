import useExhibits from "../../hooks/useExhibits";
import intl from "../../locales/en.json";
import { groupExhibitByYear } from "../../utilities/groupExhibits";
import { Carousel } from "../Common/Carousel/Carousel";
import GroupedExhibits from "./GroupedExhibits";

const Exhibits = () => {
  const { data, loading } = useExhibits();
  // const hasExhibits = Boolean(data && Object.keys(data).length > 0);
  const carouselData = data?.carousel ? Object.values(data.carousel) : [];
  const carouselImages = carouselData.map((picture) => ({
    src: picture.url,
    alt: picture.caption,
    caption: picture.caption,
  }));
  const galleries = data?.galleries ? Object.values(data.galleries) : [];
  const soloExhibitions = data?.solo ?? {};
  const juriedExhibitions = data?.juried ?? {};
  const selectedGroupExhibitions = data?.selected ?? {};
  const topGrantsAndAwards = data?.grantsAndAwards
    ? Object.values(data.grantsAndAwards).slice(0).reverse()
    : [];

  return (
    <div className="text-[0.75rem]">
      {loading && <p>Loading exhibits...</p>}
      {data && (
        <div className="flex flex-col text-center pt-4">
          <div className="w-full max-w-md mx-auto pt-0">
            <Carousel
              images={carouselImages}
              autoPlay={true}
              fitHeight={true}
            />
          </div>
          {/* Render exhibit data here */}
          <div className="flex flex-col p-4 gap-2 text-justify divide-y divide-gray-200 dark:divide-gray-700">
            <h6 className="text-center text-lg font-semibold text-gray-900">
              {intl.Galleries}
            </h6>
            {galleries.map((gallery) => (
              <div
                key={gallery.gallery}
              >{`${gallery.gallery}. ${gallery.address}`}</div>
            ))}
            <h6 className="text-center text-lg font-semibold text-gray-900">
              {intl.GrantsAndAwards}
            </h6>
            {topGrantsAndAwards.map((grant) => (
              <div key={grant}>{grant}</div>
            ))}
            <GroupedExhibits
              data={groupExhibitByYear(soloExhibitions)}
              title={intl.SelectedSoloExhibitions}
            />

            <GroupedExhibits
              data={groupExhibitByYear(juriedExhibitions)}
              title={intl.SelectedJuriedExhibitions}
            />
            <GroupedExhibits
              data={groupExhibitByYear(selectedGroupExhibitions)}
              title={intl.SelectedGroupExhibitions}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Exhibits;
