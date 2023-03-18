import { ChangeEvent, useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import axios from "axios";
import './App.css'

function App() {
  const [count, setCount] = useState(0);

  async function sendRequest() {
    try {
      const { data } = await axios.post("http://localhost:3000/auth/sign-up", {
        "firstName": "matvey",
        "lastName": "morozov",
        "email": `gmail${count}@gmail.com`,
        "password": "1234567890"
      });
      console.log(data);
      console.log(data.token);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <button onClick={sendRequest}>Send Request</button>
      <div id='rg_embed_link_371096' className='rg_embed_link' data-song-id='371096'>Read <a href='https://genius.com/Bones-parkinglotwitness-lyrics'>“ParkingLotWitness” by BONES</a> on Genius</div> <script crossOrigin="" src='//genius.com/songs/371096/embed.js'></script>
    </div>
  )
}

export default App
