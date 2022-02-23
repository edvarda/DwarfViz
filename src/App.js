import logo from './data/logo.png';
import React, { useState } from 'react';
import './App.css';
import Map from './Map.js';
import { useWorldData } from './WorldData';
import { StackedBarChart } from './StackedBarChart';
import { TreeMap } from './TreeMap';
import { CivPopulation } from './CivPopulation/CivPopulation.js';

function App() {
  const { state, isLoading, isError } = useWorldData();
  const { activeData, setActiveData } = useState({});
  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <p>Wololo</p>
      </header>
      {isError && <div>Error fetching data</div>}
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <div style={{ display: 'flex' }}>
            <Map
              mapImage={state.mapImageURL}
              data={state.regionsGeoJSON}
              setActiveData={setActiveData}
              activeData={activeData}
            />
            <StackedBarChart
              data={state.regions.data}
              setActiveData={setActiveData}
              activeData={activeData}
            />
          </div>
          <div style={{ display: 'flex' }}>
            <TreeMap
              writtenContents={state.writtenContents}
              poeticForms={state.poeticForms}
              musicalForms={state.musicalForms}
              danceForms={state.danceForms}
              width={400}
              height={600}
            ></TreeMap>
          </div>
          <div>
            <CivPopulation entityPopulation={state.entityPop} width={450} height={250} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
