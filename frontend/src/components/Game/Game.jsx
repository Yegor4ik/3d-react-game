import { Canvas } from '@react-three/fiber'
import classes from './Game.module.css';
import Player from './Player/Player';
import Plane from './Plane/Plane';
import { OrbitControls, Stars } from '@react-three/drei'
import RoomForm from './RoomForm/RoomForm';
import { useEffect, useState } from 'react';

const playerMovement = {
  up: false,
  down: false,
  left: false,
  right: false
};


function Game(props) {
  const socket = props.socket;
  const [room, setRoom] = useState({players: []});

  useEffect(()=> {
    socket.on('server_tick', (room) => {
      setRoom(room);
    })
  }, [socket])

  useEffect(() => {
    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);
    window.addEventListener('visibilitychange',()=> {
      playerMovement.up = false;
      playerMovement.down = false;
      playerMovement.left = false;
      playerMovement.right = false;
    });
    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    }
  }, []);

  const downHandler = (event) => {
    switch(event.keyCode) {
      case 87: playerMovement.up = true; break;
      case 68: playerMovement.right = true; break;
      case 65: playerMovement.left = true; break;
      case 83: playerMovement.down = true; break;
      default: return;
    }
    socket.emit('player_move', playerMovement);
  }

  const upHandler = (event) => {
    switch(event.keyCode) {
      case 87: playerMovement.up = false; break;
      case 68: playerMovement.right = false; break;
      case 65: playerMovement.left = false; break;
      case 83: playerMovement.down = false; break;
      default: return;
    }
    socket.emit('player_move', playerMovement);
  }

  return (
    <div className={classes.canvasContainer}>
        <RoomForm socket={socket}/>
        <Canvas flat linear>
            <color attach="background" args={['#000']} />
            <OrbitControls/>
            <Stars/>
            <ambientLight intensity={0.2}/>
            <pointLight position={[10, 10, 10]} />
            { room.players.map(p => <Player position={p.position} />) }
            <Plane/>
        </Canvas>
    </div>
  );
}

export default Game;
