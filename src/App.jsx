import { useState, useEffect, useRef } from 'react';
import client from 'socket.io-client';

const socket = client.io('https://server-q3qs.onrender.com');

function App() {
  const [count, setCount] = useState(0);
  const [allUsers, setAllUsers] = useState({});
  const [width, setWidth] = useState(30);

  const trackRef = useRef(null);

  const enemiesCounts = Object.values(allUsers);
  const pxPerTile = width / 30;

  useEffect(() => {
    socket.on('update-count', (serverAllUsers) => {
      console.log('update-count', socket.id, serverAllUsers);
      const currentUserCount = serverAllUsers[socket.id];
      setCount(currentUserCount);
      delete serverAllUsers[socket.id];
      setAllUsers(serverAllUsers);
    });

    socket.on('winner', (winnerId) => {
      if (winnerId === socket.id) {
        alert('You win! Good job!');
        return;
      }
      alert('You lose! Game over!');
    });

    return () => {
      socket.off('update-count');
      socket.off('winner');
    };
  }, []);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(([entry]) => {
      setWidth(entry.contentRect.width);
    });
    if(trackRef.current) resizeObserver.observe(trackRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  const handleButtonClick = () => {
    socket.emit('increase-count');
  }

  return (
    <div className="flex flex-col gap-4">
      <div style={{ width: '90vw' , maxWidth: 900 }} ref={trackRef}>
        <div
          style={{
            width: '100px',
            height: '100px',
            position: 'relative',
            left: `${count / 30 * 100}%`,
            marginBottom: '10px',
            backgroundColor: 'pink',
            transition: `left ${pxPerTile * 3}ms linear`,
          }}
        />
        {enemiesCounts.map((count, index) => (
          <div
            style={{
              width: '100px',
              height: '100px',
              position: 'relative',
              left: `${count / 30 * 100}%`,
              marginBottom: '10px',
              backgroundColor: 'pink',
              transition: `left ${pxPerTile * 3}ms linear`,
            }}
            key={index}
          />
        ))}
      </div>
      <div className="card">
        <button onClick={handleButtonClick}>
          Click to increase count
        </button>
      </div>
    </div>
  )
}

export default App;
