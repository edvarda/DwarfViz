import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss';
import { Row, Col, Container } from 'react-bootstrap';
import React from 'react';
import ReactTooltip from 'react-tooltip';

import { Places, People, Society } from './components';
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
    getActiveView,
  } = useDwarfViz();

  return (
    <>
      {isError && <div>Error fetching data</div>}
      {!isDataLoaded ? (
        <div>Loading data...</div>
      ) : (
        <Container fluid>
          <ReactTooltip html={true} className={'dwarfviz-tooltip'} />
          <Row id='header'>DwarfViz</Row>
          <ul className='view-container'>
            <li className={`view places ${getActiveView() === placesView && `expanded`}`}>
              <Places />
            </li>
            <li className={`view society ${getActiveView() === societyView && `expanded`}`}>
              <Society />
            </li>
            <li className={`view people ${getActiveView() === peopleView && `expanded`}`}>
              <People />
            </li>
          </ul>
        </Container>
      )}
    </>
  );
};

export default App;
