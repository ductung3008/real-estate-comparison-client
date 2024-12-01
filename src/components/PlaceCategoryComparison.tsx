import { PlaceCategories } from '@/types/place.type';
import { Project } from '@/types/project.type';
import { TableCell, TableRow } from '@/components/ui/table';

const PlaceCategoryComparison = ({
  projects,
  category,
  categoryName,
}: {
  projects: Project[];
  category: PlaceCategories;
  categoryName: string;
}) => {
  return (
    <TableRow>
      <TableCell className="align-top">{categoryName}</TableCell>
      {projects.map((project, index) => {
        const filteredPlaces = project?.places?.filter((place) =>
          category === PlaceCategories.OTHER
            ? place?.category !== PlaceCategories.SCHOOL && place?.category !== PlaceCategories.HOSPITAL
            : place?.category === category,
        );

        return (
          <TableCell key={index} className="align-top">
            <span className="mb-1 inline font-medium">
              {(filteredPlaces?.length || 0) !== 0 ? `${filteredPlaces?.length} ${categoryName}` : '- -'}
            </span>
            {filteredPlaces?.length > 0 && (
              <ul className="list-inside list-disc pl-4">
                {filteredPlaces?.slice(0, 10).map((place) => (
                  <li key={place.id} className="font-medium">
                    {place.name}
                  </li>
                ))}
                {filteredPlaces?.length > 10 && <li>...</li>}
              </ul>
            )}
          </TableCell>
        );
      })}
    </TableRow>
  );
};

export default PlaceCategoryComparison;
