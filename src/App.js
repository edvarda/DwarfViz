import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss';
import { Row, Col, Container } from 'react-bootstrap';
import React from 'react';
import ReactTooltip from 'react-tooltip';

import { Places, People, Society } from './components';
import WorldInfo from './components/WorldInfo.js';
import { useDwarfViz, WorldDataProvider } from './hooks/useDwarfViz';
import { MembersButton } from './MembersButton';

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

  function demo() {
    window.location.href='https://streamable.com/v8fm61';
  }
  function members() {
    // Dont know how to make this show up
    window.location.href=('/members.html');
  }

  return (
    <>
      {isError && <div>Error fetching data</div>}
      {!isDataLoaded ? (
        <div>Loading data...</div>
      ) : (
        <Container fluid>
          <div>
            <MembersButton onClick={members}>Members</MembersButton>
            <MembersButton onClick={demo}>Demo</MembersButton>
          </div>
          <ReactTooltip html={true} className={'dwarfviz-tooltip'} />
          <Row className={'align-items-center'}>
            <Col id='header' className={'col-sm-6'}>
              DwarfViz
            </Col>
            <Col className={'col-sm-4'}>
              <WorldInfo />
            </Col>
          </Row>
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
