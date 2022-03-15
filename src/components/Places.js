import { useEffect } from 'react';
import ReactTooltip from 'react-tooltip';
import { Row, Col, Container } from 'react-bootstrap';
import Map from './Map';
import { Events } from './';
import SiteDetails from './SiteDetails.js';
import RegionDetails from './RegionDetails.js';
import { useDwarfViz } from '../hooks/useDwarfViz';
import HistoryControls from './HistoryControls.js';
import _ from 'lodash';

const Places = () => {
  const {
    data: { regions },
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
                  <Map />
                </Col>
                <Col className={'flex-column col-sm-4'}>
                  {selectedSite ? (
                    <>
                      <h1>{`${_.startCase(selectedSite.name)}`}</h1>
                      <RegionDetails region={getRegionFromSite(selectedSite)} />

                      <SiteDetails site={selectedSite} />
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
