import logo from './logo.svg';
import './App.css';
import React from 'react';
import axios from 'axios';
import { useEffect, useState } from 'react';

function App() {

  const [genres, setGenres] = useState([]);
  
  /**
   * APIからジャンルを取得する関数
   */
  const selectGenres = async () => {
    try {
      console.log("Fetching genres...");
      const resp = await axios.get("http://127.0.0.1:8000/genres");
      setGenres(resp.data);
      console.log("genres Fetched...");
    }
    catch (ex) {
      console.error("Error select genres:",ex);
    }
  }

// コンストラクタ
useEffect(() => {
  selectGenres();
},[]
);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>

        <ui>
          <button className='question-button'>質問1</button>
          <button className='question-button'>質問2</button>
          <button className='question-button'>質問3</button>
        </ui>

        <div >
          {/* ジャンル名 */}
          <select className='answer' name="pref" defaultValue="" required>
            <option value="" disabled hidden>
              ジャンル名を選択してください
            </option>

          {genres.map((genre) => {
            return (
              <React.Fragment key={genre.genre_code}>
                <option value={genre.genre_code}>{genre.genre_name}</option>
              </React.Fragment>
            )
          }
          )
          }

          </select>

          {/* キャラクタ名 */}
          <select className='answer' name="pref" defaultValue="" required>
            <option value="" disabled hidden>
              キャラクタ名を選択してください
            </option>
            <option value="キャラクタ1">キャラクタ1</option>
            <option value="キャラクタ2">キャラクタ2</option>
            <option value="キャラクタ3">キャラクタ3</option>
          </select>
        </div>

        <div>
          <button className='answer-button'>回答する</button>
        </div>
      </header>
    </div>
  );
}

export default App;
