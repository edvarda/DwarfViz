import { useEffect } from 'react';
import ReactTooltip from 'react-tooltip';
import { Card, Row, Col } from 'react-bootstrap';
import Map from './Map';
import SiteDetails from './SiteDetails.js';
import RegionDetails from './RegionDetails.js';
import { useDwarfViz } from '../hooks/useDwarfViz';
import useTooltip from '../hooks/useTooltip';
import HistoryControls from './HistoryControls.js';

const Places = () => {
  const {
    data: { mapImageURL, regions, regionsGeoJSON },
    placesView: { selectedItem: selectedSite },
    VIEWS,
  } = useDwarfViz();

  useEffect(() => {
    ReactTooltip.rebuild();
  });

  const getRegionFromSite = (site) => {
    return regions.find((r) => r.coords.find((p) => p.x === site.coord.x && p.y === site.coord.y));
  };

  return (
    <>
      <Row>
        <Row>
          <Col>
            <HistoryControls view={VIEWS.PLACES} />
          </Col>
        </Row>
        <Row>
          <Col>
            <Map
              mapImage={mapImageURL}
              mapSize={{
                width: 528,
                height: 528,
                bounds: [
                  [0, 0],
                  [527, 527],
                ],
              }}
              data={regionsGeoJSON}
              regions={regions}
            />
          </Col>
          <Col className={'d-flex flex-column'}>
            {selectedSite && (
              <>
                <RegionDetails region={getRegionFromSite(selectedSite)} />
                <SiteDetails site={selectedSite} />
              </>
            )}
          </Col>
        </Row>
      </Row>
    </>
  );
};

export default Places;
