import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss';
import { Row, Col, Container } from 'react-bootstrap';
import React from 'react';
import ReactTooltip from 'react-tooltip';

import { Places, People, Society, Events } from './components';
import { useDwarfViz, WorldDataProvider } from './hooks/useDwarfViz';

function App() {
  return (
    <div className='App'>
      <WorldDataProvider>
        <Viz />
      </WorldDataProvider>
    </div>
  );
}

const Viz = () => {
  const {
    isLoading,
    isError,
    isDataLoaded,
    placesView,
    peopleView,
    societyView,
    selectEntity,
    setActiveView,
  } = useDwarfViz();

  return (
    <>
      {isError && <div>Error fetching data</div>}
      {!isDataLoaded ? (
        <div>Loading data...</div>
      ) : (
        <Container fluid>
          <ReactTooltip html={true} className={'dwarfviz-tooltip'} />
          <Row>
            <Col
              id='Places'
              className={`view ${placesView.isActive && `expanded`}`}
              onClick={() => setActiveView('placesView')}
            >
              <h2>Places</h2>
              <div className={'view-content'}>
                <Places />
              </div>
            </Col>
            <Col
              id='Society'
              className={`view ${societyView.isActive && `expanded`}`}
              onClick={() => setActiveView('societyView')}
            >
              <h2
                onClick={() => {
                  selectEntity(23);
                }}
              >
                Society
              </h2>
              <div className={'view-content'}>
                <Society />
              </div>
            </Col>
            <Col
              id='People'
              className={`view ${peopleView.isActive && `expanded`}`}
              onClick={() => setActiveView('peopleView')}
            >
              <h2>People</h2>
              <div className={'view-content'}>
                <People />
              </div>
            </Col>
          </Row>

          <Row id='Events' className={'view expanded'}>
            {!isLoading && <Events />}
          </Row>
        </Container>
      )}
    </>
  );
};

export default App;
