import type { GroupedExhibitsByYear } from "../../types/exhibits";

interface GroupedExhibitsProps {
  data: GroupedExhibitsByYear;
  title?: string;
}
export const GroupedExhibits: React.FC<GroupedExhibitsProps> = ({
  data,
  title,
}) => {
  return (
    <div>
      <h6 className="text-center text-lg font-semibold text-gray-900 p-4">
        {title}
      </h6>
      {Object.entries(data)
        .sort((a, b) => Number(b[0]) - Number(a[0]))
        .map((entry) => {
          const year = entry[0];
          const exhibits = entry[1];
          return (
            <div className="flex gap-4 pt-4" key={year}>
              <h6>{year}</h6>
              <div className="flex flex-col gap-4">
                {exhibits.map((exhibit) => (
                  <p key={exhibit.key}>
                    <span className="italic">{exhibit.name}</span>
                    {`. ${exhibit.place}. ${exhibit.dates}.`}
                  </p>
                ))}
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default GroupedExhibits;
