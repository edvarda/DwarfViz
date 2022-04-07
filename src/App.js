import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss';
import { Row, Col, Container } from 'react-bootstrap';
import React from 'react';
import ReactTooltip from 'react-tooltip';

import { Places, People, Society } from './components';
import WorldInfo from './components/WorldInfo.js';
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
          <Row className={'pt-4 about-section'}>
            <h2>We made this:</h2>
            <Col className={'col-sm-4 px-3'}>
              <h3>Edvard</h3>
              <p>Edvard is a boy. He likes frogs. Sometimes he eats frogs too.</p>
              <p>edvarda@kth.se</p>
            </Col>
            <Col className={'col-sm-4 px-3'}>
              <h3>Pere
                <a class="social" href="https://github.com/PereGinebra" target="_blank" rel="noreferrer" title="Open GitHub profile"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-github" viewBox="0 0 16 16"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path></svg></a>
                <a class="social" href="https://www.linkedin.com/in/pere-ginebra/" target="_blank" rel="noreferrer" title="Open LinkedIn profile"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-linkedin" viewBox="0 0 16 16"><path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"></path></svg></a>
              </h3>
              <p>I'm a Computer Science student from Barcelona about to finish his Bachelor's. I'm interested in all things CS, but more specifically AI, Data Science, ML and Algorithmics. This being said, I believe that Information Visualization is important no matter what field you work on, especially if you have to deal with lots of hard to digest data.</p>
              <p>My contributions to this project have been mostly small front-end tasks like building the stacked bar-chart, element details cards and other back-end tasks like finding related elements like people and sites/entities. Through these tasks I have learned JavaScript, D3 and React as well as many information visualization practices, all of which were new technologies/practices to me.</p>
            </Col>
            <Col className={'col-sm-4 px-3'}>
              <h3>Love
                <a class="social" href="https://github.com/Wessl" target="_blank" rel="noreferrer" title="Open GitHub profile"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-github" viewBox="0 0 16 16"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path></svg></a>
                <a class="social" href="https://www.linkedin.com/in/love-wessman/" target="_blank" rel="noreferrer" title="Open LinkedIn profile"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-linkedin" viewBox="0 0 16 16"><path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"></path></svg></a>
              </h3>
              <p>I am currently working towards a MSc in Computer Science at KTH. Some of my hobbies are game development, reading, running and kayaking. I've been interested in the field of visualization for a while now, so to finally get to do a deep dive in the field with other passionate students has been a real treat!</p>
              <p>In this project, the parts I worked most on was on the events view, with the brushable timeline of events, and pageified list of events. I also worked on implementing various minor parts, for example with the details panels, the top skills in the people view. Overall this project has been a great introduction for me to the field of information visualization, something I knew next to nothing about before, as well as a primer in web development in general, since I had to learn things like React and D3 from scratch. </p>
              </Col>
          </Row>
          <Row className={'mb-2 about-section'}>
            <h2>
              Confused? Watch this <a href='https://streamable.com/v8fm61'>demo</a>
            </h2>
          </Row>
        </Container>
      )}
    </>
  );
};

export default App;
