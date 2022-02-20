import logo from './data/logo.png';
import React from 'react';
import './App.css';
import Map from './Map.js';
import { useWorldData } from './WorldData';
import { StackedBarChart } from './StackedBarChart';
import { TreeMap } from './TreeMap';

function App() {
  const { state, isLoading, isError } = useWorldData();
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
        <div style={{ display: 'flex' }}>
          <Map mapImage={state.mapImageURL} data={state.regionsGeoJSON} />
          <StackedBarChart data={state.regions.data} />
          <TreeMap 
              writtenContents={state.writtenContents} 
              poeticForms={state.poeticForms} 
              musicalForms={state.musicalForms}
              danceForms={state.danceForms}
              width={400}
              height={600}>
          </TreeMap>
          {/* <div>
            {state.regions.data.map((region, i) => (
              <p key={i}>{`${region.name} – ${region.type} – ${region.evilness}`}</p>
            ))}
          </div> */}
        </div>
      )}
    </div>
  );
}

export default App;
