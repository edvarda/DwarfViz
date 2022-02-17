import logo from './data/logo.png';
import React from 'react';
import './App.css';
import Map from './Map.js';
import { useWorldData } from './WorldData';
import { StackedBarChart } from './StackedBarChart';

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
          <Map mapImage={state.mapImageURL} />
          <StackedBarChart data={state.regions.data} />
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
