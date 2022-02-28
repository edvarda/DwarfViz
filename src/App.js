import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss';
import { Row, Col, Container } from 'react-bootstrap';
import React, { useState } from 'react';

import { Places, People, Society, Events } from './components';
import { useWorldData } from './hooks/useWorldData';

function App() {
  const [state, isLoading, isError] = useWorldData();
  const [activeView, setActiveView] = useState(null);

  return (
    <div className='App'>
      {isError && <div>Error fetching data</div>}
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <Container fluid>
          <Row>
            <Col id='Places' className={`view ${activeView === 'Places' ? 'expanded' : ''}`}>
              <h2 onClick={() => setActiveView('Places')}>Places</h2>

              <Places mapImage={state.mapImageURL} data={state} regions={state.regions.data} />
            </Col>
            <Col id='Society' className={`view ${activeView === 'Society' ? 'expanded' : ''}`}>
              <h2 onClick={() => setActiveView('Society')}>Society</h2>
              <Society entityPopulation={state.entityPop} />
            </Col>
            <Col id='People' className={`view ${activeView === 'People' ? 'expanded' : ''}`}>
              <h2 onClick={() => setActiveView('People')}>People</h2>
              <People data={state} />
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
