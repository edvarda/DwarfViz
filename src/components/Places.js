import { useEffect } from 'react';
import ReactTooltip from 'react-tooltip';
import { Row, Col, Container } from 'react-bootstrap';
import Map from './Map';
import { Events } from './';
import SiteDetails from './SiteDetails.js';
import RegionDetails from './RegionDetails.js';
import { useDwarfViz } from '../hooks/useDwarfViz';
import HistoryControls from './HistoryControls.js';

const Places = () => {
  const {
    data: { mapImageURL, regions, regionsGeoJSON },
    placesView: { selectedItem: selectedSite, isActive: isViewActive },
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
      <div className='view-title'>
        <h2>Places</h2>
      </div>
      <div className={'view-content'}>
        {isViewActive && (
          <Container fluid>
            <Row>
              <Row>
                <Col>
                  <HistoryControls view={VIEWS.PLACES} />
                </Col>
              </Row>
              <Row>
                <Col className={'view-element col-sm-7'}>
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
                <Col className={'flex-column col-sm-4'}>
                  {selectedSite ? (
                    <>
                      <div className='view-element'>
                        <RegionDetails region={getRegionFromSite(selectedSite)} />
                      </div>
                      <div className='view-element'>
                        <SiteDetails site={selectedSite} />
                      </div>
                    </>
                  ) : (
                    <div className={'view-element noSelection'}>Select a site from the map</div>
                  )}
                </Col>
              </Row>
              <Row>{selectedSite && <Events />}</Row>
            </Row>
          </Container>
        )}
      </div>
    </>
  );
};

export default Places;
