import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Lobby } from './pages/Lobby';
import { Room } from './pages/Room';
import { Game } from './pages/Game';
import { Character } from './pages/Character';
import { CharacterCheck } from './common/components/CharacterCheck';
import { ErrorBoundary } from './common/components/ErrorBoundary';
import { NotFoundErrorPage } from './common/components/NotFoundErrorPage';
import { RoomCheck } from './common/components/RoomCheck';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
          <Routes>
            <Route path="/" element={<Character />} />
            <Route path="/lobby" element={<CharacterCheck><Lobby /></CharacterCheck>} />
            <Route path="/room/:roomCode" element={
              <CharacterCheck>
                <RoomCheck
                  key="room-check-room"
                  render={room => <Room initialRoom={room} />}
                />
              </CharacterCheck>
              }
            />
            <Route path="/game/:roomCode" element={
              <CharacterCheck>
                <RoomCheck
                  key="room-check-game"
                  render={room => <Game initialRoom={room} />}
                />
              </CharacterCheck>
              }
            />
            <Route path="/*" element={<NotFoundErrorPage />} />
          </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
