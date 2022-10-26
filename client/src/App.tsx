import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Lobby } from './pages/Lobby';
import { Room } from './pages/Room';
import { Game } from './pages/Game';
import { Character } from './pages/Character';
import { CharacterCheck } from './common/components/CharacterCheck';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Character />} />
        <Route path="/lobby" element={<CharacterCheck><Lobby /></CharacterCheck>} />
        <Route path="/room/:roomCode" element={<CharacterCheck><Room /></CharacterCheck>} />
        <Route path="/game/:roomCode" element={<CharacterCheck><Game /></CharacterCheck>} />
        <Route path="/*" element={"Not found"} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
