import logo from './logo.png';
import './App.css';

function App() {
  console.log(logo);
  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <p>Wololo</p>
      </header>
    </div>
  );
}

export default App;
