import './App.css'
import NavBar from './components/NavBar';
import Map from './components/Map';
import Info from './components/Info';

function App() {
  return (
    <div className="app-container">
        <Info />
        <NavBar />
        <Map />
    </div>
  );
}

export default App;
