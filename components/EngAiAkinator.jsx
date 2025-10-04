import React, { useRef } from 'react';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function EngAiAkinator() {

  const [genres, setGenres] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [rand_questions, setRandQuestions] = useState([]);
  const [ai_answer, setAiAnswer] = useState("質問をしてください");
  const session_id = useRef(null);
  const [user_question, setUserQuestion] = useState("");

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
      session_id.current = resp.data.session_id

      console.log("initialized new Quesiton!")
    }
    catch (ex) {
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

  /***
   * 質問をpostする関数
   */
  const registerQuestion = async (user_question) => {
    try {
      console.log("posting question...")
      const data = { session_id: session_id.current, user_question_content: user_question }
      const resp = await axios.post("http://127.0.0.1:8000/ask_ai", data);
      setAiAnswer(resp.data.ai_answer)
      console.log("posted question!")
    }
    catch (ex) {
      console.error("Error select random_questions:", ex);
    }
  }

  /***
   * 質問ボタンを押下時にYour Questionに値をはめる関数
   */
  const registerYourQuestion = async (user_question_content) => {
    setUserQuestion(user_question_content);
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
    <div className="h-screen w-screen bg-slate-900 text-gray-200 flex flex-col">
      {/* Header */}
      <header className="flex items-center p-4 bg-slate-800 text-xl font-bold">
        <div className="w-8 h-8 rounded-full bg-slate-600 mr-3"></div>
        EngAiAkinator
      </header>

      {/* Main layout */}
      <main className="flex flex-1 gap-4 p-8">
        {/* Left Section */}
        <div className="flex-[3] flex flex-col gap-4 bg-slate-800 rounded-2xl p-8">
          {/* Top 2/3 : Ask + Hint */}
          <div className="flex-[1] flex flex-col">
            {/* Ask Next Question */}
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-2 border-b border-blue-400">
                <h2 className="text-blue-400 font-bold  text-4xl">
                  Ask Next Question
                </h2>
                <button className="text-cyan-400 text-3xl" onClick={selectRandQuestions}>🔄</button>
              </div>
            </div>
            <div className="flex flex-1 gap-3 mt-2">
              {rand_questions.map((question, index) => {
                return (
                  <React.Fragment key={question.question_id}>
                    <button name={index} className='flex-1 h-full bg-slate-700 rounded-lg text-2xl' value={question.question_id} onClick={
                      () => {
                        registerQuestion(question.question_content)
                        registerYourQuestion(question.question_content)
                        selectRandQuestions()
                      }}>{question.question_content}</button>
                  </React.Fragment>
                )
              }
              )
              }
            </div>

          </div>
          <div className="flex-[1]  flex flex-col">
            {/* Your Question & AI Hint */}
            <div className="flex flex-col mb-2">
              {/*Your QuestionとAI Hintの並列 */}
              <div className="flex flex-[1] items-center gap-3">
                <h2 className="flex-1 text-green-400 font-bold text-4xl border-b border-green-400">Your Question</h2>
                <div className="flex-1 flex justify-between items-center border-b border-green-400">
                  <h2 className="text-green-400 font-bold text-4xl">AI Hint</h2>
                  <button className="text-cyan-400 text-3xl">🔄</button>
                </div>
              </div>
            </div>
            {/*箱 */}
            <div className="flex flex-1 gap-3 mt-2">
              <div className="flex-1 h-full bg-slate-700 rounded-lg text-2xl flex items-center justify-center ">
                {user_question}
              </div>
              <div className="flex-1 h-full bg-slate-700 rounded-lg text-2xl flex items-center justify-center ">
                {ai_answer}
              </div>
            </div>
          </div>
          {/* Bottom 1/3 : Features */}
          <div className="flex-[1] flex flex-col">
            <div className="flex justify-between items-center mb-2 border-b border-yellow-400">
              <h2 className="text-yellow-400 font-bold text-4xl">Features</h2>
              <button className="text-cyan-400 text-3xl">🔄</button>
            </div>
            <div className="flex-1 bg-slate-700 rounded-lg mt-2"></div>
          </div>
        </div>

        {/* Right Section (Past Q&A & Answer) */}
        <div className="flex-[1] flex flex-col gap-4 bg-slate-800 rounded-2xl p-8">
          {/* Past Q & A */}
          <div className="flex-[1] flex flex-col">
            <h2 className="text-purple-400 font-bold text-4xl mb-2  border-b border-purple-400">
              Past Q & A
            </h2>
            <div className="h-full bg-slate-700 rounded-lg mt-2"></div>
          </div>

          {/* Answer Section */}
          <div>
            <div className="flex border-b border-pink-500">
              <h2 className="text-pink-500 font-bold text-4xl">Answer</h2>
            </div>
            <form className="flex flex-col gap-2 mt-2">
              <div className="flex flex-col">
                <label>Genre</label>
                <select className="bg-slate-700 p-2 rounded-lg" name="pref" defaultValue="" required>
                  {/* <option>Select Genre</option> */}
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
              </div>
              <div className="flex flex-col">
                <label>Character</label>
                <select className="bg-slate-700 p-2 rounded-lg" name="pref" defaultValue="" required>
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
              <button
                type="submit"
                className="h-24 mt-5 bg-blue-500 text-white font-bold py-2 rounded-lg hover:bg-blue-600 text-xl mb-5"
              >
                Answer!
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
