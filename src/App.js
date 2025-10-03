import logo from './logo.svg';
import './App.css';
import React from 'react';
import axios from 'axios';
import { useEffect, useState } from 'react';

function App() {

  const [genres, setGenres] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [rand_questions, setRandQuestions] = useState([]);
  const [ai_answer, setAiAnswer] = useState("質問をしてください");

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
      console.error("Error select genres:", ex);
    }
  }

  /**
   * APIからキャラクタを取得する関数
   */
  const selectCharacters = async () => {
    try {
      console.log("Fetching characters...");
      const resp = await axios.get("http://127.0.0.1:8000/characters");
      setCharacters(resp.data);
      console.log("characters Fetched...");
    }
    catch (ex) {
      console.error("Error select characters:", ex);
    }
  }

  /***
   * 【初期化処理】
   * DBに新規お題やセッションIDを追加
   */
  const initializeQuestion = async () => {
    try {
      console.log("initializing new Question...")
      const resp = await axios.post("http://127.0.0.1:8000/new_question");
      console.log("initialized new Quesiton!")
    }
    catch(ex){
      console.error("Error initialize new Question:", ex)
    }
  }

  /***
   * 3つの質問を更新する関数
   */
  const selectRandQuestions = async () => {
    try {
      console.log("Fetching random_questions...");
      const resp = await axios.get("http://127.0.0.1:8000/random_questions");
      setRandQuestions(resp.data);
      console.log("random_questions Fetched...");
    }
    catch (ex) {
      console.error("Error select random_questions:", ex);
    }
  }

  // コンストラクタ
  useEffect(() => {
    initializeQuestion();
    selectGenres();
    selectCharacters();
    selectRandQuestions();
  }, []
  );

  return (
    <div className="App">
      <header className="App-header">

        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <div>
          <input
            type="text"
            readOnly
            className='ai-answer'
            value={ai_answer}>
          </input>
        </div>
        <div className='quesitons'>
          <ui>
            {rand_questions.map((question) => {
              return (
                <React.Fragment key={question.question_id}>
                  <button className='question-button' value={question.question_id}>{question.question_content}</button>
                </React.Fragment>
              )
            }
            )
            }
          </ui>
          <ui>
            <button className='update-button' onClick={selectRandQuestions}>更新</button>
          </ui>
        </div>

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
            {characters.map((character) => {
              return (
                <React.Fragment key={character.id}>
                  <option value={character.id}>{character.character_name}</option>
                </React.Fragment>
              )
            }
            )
            }
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
