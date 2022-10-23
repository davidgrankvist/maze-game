import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Lobby } from './pages/Lobby';
import { Room } from './pages/Room';
import { Game } from './pages/Game';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Lobby />} />
        <Route path="/room/:roomCode" element={<Room />} />
        <Route path="/game/:roomCode" element={<Game />} />
        <Route path="/*" element={"Not found"} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
