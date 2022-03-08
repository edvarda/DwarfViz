import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss';
import { Row, Col, Container } from 'react-bootstrap';
import React from 'react';

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
  const { isLoading, isError, activeView, setActiveView, selectEntity } = useDwarfViz();

  return (
    <>
      {isError && <div>Error fetching data</div>}
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <Container fluid>
          <Row>
            <Col
              id='Places'
              className={`view ${activeView === 'Places' ? 'expanded' : ''}`}
              onClick={() => activeView !== 'Places' && setActiveView('Places')}
            >
              <h2>Places</h2>
              <div className={'view-content'}>
                <Places />
              </div>
            </Col>
            <Col
              id='Society'
              className={`view ${activeView === 'Society' ? 'expanded' : ''}`}
              onClick={() => activeView !== 'Society' && setActiveView('Society')}
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
              className={`view ${activeView === 'People' ? 'expanded' : ''}`}
              onClick={() => activeView !== 'People' && setActiveView('People')}
            >
              <h2>People</h2>
              <div className={'view-content'}>
                <People />
              </div>
            </Col>
          </Row>

          <Row id='Events' className={'view expanded'}>
            <Events />
          </Row>
        </Container>
      )}
    </>
  );
};

export default App;
