import L, { icon } from 'leaflet';
import 'leaflet-routing-machine/dist/leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';

import MapPin from '@/assets/images/mapPins';
import { Place, place_categories, PlaceCategories } from '@/types/place.type';
import { Project } from '@/types/project.type';

const projectIcon = icon({
  iconUrl: MapPin.Building,
  iconSize: [48, 48],
  iconAnchor: [24, 48],
  popupAnchor: [0, -48],
});

const Map: React.FC<{ project: Project; category?: PlaceCategories }> = ({ project, category }) => {
  if (!project?.latitude || !project?.longitude) {
    return <p className="text-center text-gray-500">Location data is unavailable</p>;
  }

  const places = (category && project.places?.filter((place) => place.category === category)) || project.places;

  return (
    <div className="h-full min-h-full overflow-hidden rounded-lg border-2 border-blue-500 shadow-md">
      <MapContainer
        center={[project.latitude, project.longitude]}
        zoom={14}
        style={{ height: '100%', width: '100%' }}
        className="rounded-lg"
      >
        <MapContent project={project} category={category} places={places} />
      </MapContainer>
    </div>
  );
};

const MapContent: React.FC<{ project: Project; category?: PlaceCategories; places: Place[] }> = ({
  project,
  category,
  places,
}) => {
  const map = useMap();
  const routeControlRef = useRef<L.Routing.Control | null>(null);

  const clearMap = () => {
    routeControlRef.current?.remove();
    routeControlRef.current = null;
  };

  const createRouteAndMarker = (startPoint: [number, number], endPoint: [number, number], placeName: string) => {
    clearMap();

    routeControlRef.current = L.Routing.control({
      waypoints: [L.latLng(startPoint[0], startPoint[1]), L.latLng(endPoint[0], endPoint[1])],
      routeWhileDragging: false,
      plan: L.Routing.plan([L.latLng(startPoint[0], startPoint[1]), L.latLng(endPoint[0], endPoint[1])], {
        createMarker: function (_, wp) {
          return L.marker(wp.latLng, {
            icon: icon({
              iconUrl: MapPin.Pin,
              iconSize: [32, 32],
              iconAnchor: [16, 32],
              popupAnchor: [0, -32],
            }),
          }).bindPopup(placeName);
        },
      }),
      lineOptions: {
        styles: [{ color: '#007bff', opacity: 0.8, weight: 6 }],
        extendToWaypoints: false,
        missingRouteTolerance: 100,
      },
      router: L.Routing.osrmv1({
        language: 'vi',
      }),
    }).addTo(map);
  };

  useEffect(() => {
    map.setView([project.latitude, project.longitude], 14);
    clearMap();
  }, [category, map, project.latitude, project.longitude]);

  return (
    <>
      <Marker position={[project.latitude, project.longitude]} icon={projectIcon}>
        <Popup>
          <div className="text-sm font-medium">
            <p className="!m-0 text-lg font-bold text-blue-500">{project.name}</p>
            <p className="!m-0 text-sm text-gray-500">{project.address || 'Không tồn tại.'}</p>
          </div>
        </Popup>
      </Marker>

      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {places?.map((place, index) => {
        const placeIcon = icon({
          iconUrl: place_categories.find((c) => c.value === place.category)?.mapPin,
          iconSize: [32, 32],
          iconAnchor: [16, 32],
          popupAnchor: [0, -32],
        });
        return (
          <Marker
            key={index}
            position={[place.latitude, place.longitude]}
            eventHandlers={{
              click: () =>
                createRouteAndMarker(
                  [project.latitude, project.longitude],
                  [place.latitude, place.longitude],
                  place.name,
                ),
            }}
            icon={placeIcon}
          >
            <Popup>
              <div className="text-sm">
                <p className="font-medium">{place.name}</p>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
};

export default Map;
