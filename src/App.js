import logo from './data/logo.png';
import mapImage from './data/helloWorldMap.png';
import Map from './Map.js';
import './App.css';

function App() {
  console.log(logo);
  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <p>Wololo</p>
      </header>
      <div style={{ display: 'flex' }}>
        <Map imagePath={mapImage} />
      </div>
    </div>
  );
}

export default App;
