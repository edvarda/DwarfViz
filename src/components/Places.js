import Map from './Map';
import { StackedBarChart } from './StackedBarChart';

const Places = ({ mapImage, data, regions }) => {
  return (
    <>
      <Map
        mapImage={mapImage}
        mapSize={{
          width: 528,
          height: 528,
          bounds: [
            [0, 0],
            [527, 527],
          ],
        }}
        data={data.regionsGeoJSON}
        regions={regions}
      />
      <StackedBarChart data={data.regions.data} />
    </>
  );
};

export default Places;
