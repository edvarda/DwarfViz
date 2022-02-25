import Map from './Map';
import { StackedBarChart } from './StackedBarChart';

const Places = ({ mapImage, data, regions, setActiveData, activeData }) => {
  const mapSize = {
    width: 528,
    height: 528,
    bounds: [
      [0, 0],
      [527, 527],
    ],
  };
  return (
    <>
      <Map
        mapImage={mapImage}
        mapSize={mapSize}
        data={data.regionsGeoJSON}
        regions={regions}
        setActiveData={setActiveData}
        activeData={activeData}
      />
      <StackedBarChart
        data={data.regions.data}
        setActiveData={setActiveData}
        activeData={activeData}
      />
    </>
  );
};

export default Places;
