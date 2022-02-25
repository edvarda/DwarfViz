import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Row, Col, Container } from 'react-bootstrap';
import React, { useState } from 'react';

import logo from './data/logo.png';

import { Places, People, Plot } from './components';
import { useWorldData } from './hooks/useWorldData';

function App() {
  const { state, isLoading, isError } = useWorldData();
  const { activeData, setActiveData } = useState({});

  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <p>DwarfViz</p>
      </header>
      {isError && <div>Error fetching data</div>}
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <Container fluid>
          <Row>
            <Col>
              <Places
                mapImage={state.mapImageURL}
                data={state}
                regions={state.regions.data}
                setActiveData={setActiveData}
                activeData={activeData}
              />
            </Col>
            <Col>
              <People entityPopulation={state.entityPop} />
            </Col>
            <Col>
              <Plot data={state} />
            </Col>
          </Row>
        </Container>
      )}
    </div>
  );
}

export default App;
