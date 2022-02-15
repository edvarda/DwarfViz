import logo from './data/logo.png';
import mapImage from './data/helloWorldMap.png';
import Map from './Map.js';
import './App.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
const baseURL = 'http://192.168.0.10:20350/api';

function App() {
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const initialState = {
        regions: (await axios.get(`${baseURL}/regions`)).data,
      };
      setState(initialState);
      setLoading(false);
    };
    fetchData();
  }, []);
  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <p>Wololo</p>
      </header>
      {!loading && state ? (
        <div style={{ display: 'flex' }}>
          <Map mapImage={`${baseURL}/map_images/0/image.png`} />
          <div>
            {state.regions.data.map((region, i) => (
              <p key={i}>{`${region.name} – ${region.type} – ${region.evilness}`}</p>
            ))}
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}

export default App;
