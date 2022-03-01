import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss';
import { Row, Col, Container } from 'react-bootstrap';
import React, { useState } from 'react';

import { Places, People, Society, Events } from './components';
import { useWorldData } from './hooks/useWorldData';

function App() {
  const [state, isLoading, isError] = useWorldData();
  const [activeView, setActiveView] = useState('Places');

  return (
    <div className='App'>
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
              <div>
                <Places mapImage={state.mapImageURL} data={state} regions={state.regions.data} />
              </div>
            </Col>
            <Col
              id='Society'
              className={`view ${activeView === 'Society' ? 'expanded' : ''}`}
              onClick={() => activeView !== 'Society' && setActiveView('Society')}
            >
              <h2>Society</h2>
              <div>
                <Society entityPopulation={state.entityPop} />
              </div>
            </Col>
            <Col
              id='People'
              className={`view ${activeView === 'People' ? 'expanded' : ''}`}
              onClick={() => activeView !== 'People' && setActiveView('People')}
            >
              <h2>People</h2>
              <div>
                <People data={state} />
              </div>
            </Col>
          </Row>

          <Row id='Events' className={'view'}>
            <Events data={state} />
          </Row>
        </Container>
      )}
    </div>
  );
}

export default App;
