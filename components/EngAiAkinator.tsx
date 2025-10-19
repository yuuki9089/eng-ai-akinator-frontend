import React, { ChangeEvent, useRef } from 'react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { ChatHistory } from '@/types/chatHistory';

type EngAiAkinatorProps = {
  current_session_id: number;
}

export default function EngAiAkinator({
  current_session_id
}: EngAiAkinatorProps) {

  const [genres, setGenres] = useState<{ genre_code: number, genre_name: string }[]>([]);
  const [characters, setCharacters] = useState<{
    id: number,
    character_name: string,
    genre_code: number,
    question_times: number
  }[]>([]);
  const [rand_questions, setRandQuestions] = useState<{ question_id: number, question_content: string }[]>([]);
  const [ai_answer, setAiAnswer] = useState("質問をしてください");
  const [user_question, setUserQuestion] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [chat_history, setChatHistory] = useState<string>("会話履歴がありません。");

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
  const registerQuestion = async (user_question: string) => {
    try {
      console.log("posting question...")
      const data = { session_id: current_session_id, user_question_content: user_question }
      const resp = await axios.post("http://127.0.0.1:8000/ask_ai", data);
      setAiAnswer(resp.data.ai_answer)
      console.log("posted question!")
    }
    catch (ex) {
      console.error("Error select random_questions:", ex);
    }
  }

  /**
   * 会話履歴マスタから過去の会話履歴の一覧を取得するAPI
   */
  const getChatHistory = async () => {
    try {
      console.log("Fetching chat_history...");
      console.log(current_session_id)
      const resp = await axios.get(`http://127.0.0.1:8000/past_q_and_a/${current_session_id}`);
      console.log(resp.data)
      const result = changeArr2StrChatHistory(resp.data)
      setChatHistory(result ? result : "会話履歴がありません。");
      console.log("chat_history Fetched...");
    }
    catch (ex) {
      console.error("Error select characters:", ex);
    }
  }

  /***
   * chatHistoryの配列を文字列に変換する関数
   */
  const changeArr2StrChatHistory = (chats: ChatHistory[]) => {
    let chatString: string = "";
    chats.forEach(chat => {
      chatString += "【" + chat.role + "】" + chat.message.replace(/\s+/g, "") + "\n"
      if (chat.role === "assistant")
        chatString += "\n";
    });
    console.log(chatString)
    return chatString;
  }

  /***
   * chatHistory内の改行を除去する関数
   */

  /***
   * 質問ボタンを押下時にYour Questionに値をはめる関数
   */
  const registerYourQuestion = async (user_question_content: string) => {
    setUserQuestion(user_question_content);
  }

  const handleGenreChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const genre = Number(e.target.value);
    setSelectedGenre(genre);
  }


  /***
   * 回答ボタンを押下時に選択肢をpostする関数
   */

  const tryAnswer = async (formData: FormData) => {
    // e.preventDefault(); // ページリロードを阻止する処理
    // const form = e.target
    // const formData = new FormData(form) // formの要素を取得
    try {
      console.log("posting answer...");
      const data = {
        "session_id": current_session_id,
        "user_answer_character_id": formData.get("pref_character")
      };
      console.log("フォームのJSONデータ:", data);
      const resp = await axios.post("http://127.0.0.1:8000/answer_theme", data);
      if (resp.data.ans_result)
        alert("...正解！")
      else
        alert("残念...！\n再チャレンジしてね！")
      setSelectedGenre(null); // 内部のジャンルのプルダウンもリセット
      console.log("posted answer!")
    }
    catch (ex) {
      console.error("Error posting answer:", ex);
    }
  }


  // コンストラクタ
  useEffect(() => {
    selectGenres();
    selectCharacters();
    selectRandQuestions();
    // getChatHistory();
  }, []
  );

  useEffect(() => {
    getChatHistory()
  }, [current_session_id])

  return (
    <div className="h-screen w-screen bg-slate-900 text-gray-200 flex flex-col">
      {/* Header */}
      <header className="flex items-center p-4 bg-slate-800 text-xl font-bold">
        <div className="w-8 h-8 rounded-full bg-slate-600 mr-3"></div>
        EngAiAkinator
      </header>

      {/* Main layout */}
      <main className="flex h-full flex-1 gap-4 p-4">
        {/* Left Section */}
        <div className="flex-[3] flex flex-col gap-4 bg-slate-800 rounded-2xl p-6">
          {/* Top 2/3 : Ask + Hint */}
          <div className="flex flex-col">
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
                    <button className='flex-1 h-20 bg-slate-700 rounded-lg text-2xl' value={question.question_id} onClick={
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
              <div className="flex-1 h-60 bg-slate-700 rounded-lg text-2xl flex items-center justify-center ">
                {user_question}
              </div>
              <div
                style={{ whiteSpace: 'pre-line', overflowY: "auto", border: "1px", }}
                className="flex-1 h-60 bg-slate-700 rounded-lg text-2xl flex items-center justify-center ">
                <div className={`flex-col ${ai_answer==="質問をしてください"?"":"h-full"}`} >
                  <ReactMarkdown>
                    {ai_answer.replace(/\s+/g, "")}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-[1]  flex flex-col">
            {/* Your Question & AI Hint */}
            <div className="flex flex-col mb-2">
              {/*Your QuestionとAI Hintの並列 */}
              <div className="flex flex-[1] items-center gap-3">
                <h2 className="flex-1 text-yellow-400 font-bold text-4xl border-b border-yellow-400">Past Q＆A</h2>
                <div className="flex-1 flex justify-between items-center border-b border-yellow-400">
                  <h2 className="text-yellow-400 font-bold text-4xl">Features</h2>
                  <button className="text-cyan-400 text-3xl">🔄</button>
                </div>
              </div>
            </div>
            {/*箱 */}
            <div className="flex flex-1 h-full gap-3 mt-2">
              <div
                style={{ whiteSpace: 'pre-line', overflowY: "auto", border: "1px", }}
                className="flex-1 h-60 bg-slate-700 rounded-lg text-2xl flex items-center justify-center ">
                <div className={`flex-col ${chat_history==="会話履歴がありません。"?"":"h-full"}`}>
                  {
                    chat_history === "会話履歴がありません。"
                      ?
                      (<>{chat_history}</>)
                      : (
                        <ReactMarkdown>
                          {chat_history}
                        </ReactMarkdown>
                      )}
                </div>
              </div>
              <div className="flex-1 h-full bg-slate-700 rounded-lg text-2xl flex items-center justify-center ">
                <ReactMarkdown>
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section (Past Q&A & Answer) */}
        <div className="flex-[1] flex flex-col gap-4 bg-slate-800 rounded-2xl p-8">
          {/* Past Q & A */}
          <div className="flex-[1] flex flex-col">
            <h2 className="text-purple-400 font-bold text-4xl mb-2  border-b border-purple-400">
              Past Answer
            </h2>
            <textarea
              className="h-full bg-slate-700 rounded-lg mt-2"
              defaultValue="あああああああああああああああああああああああああああああ
                あああああああああああああああああああああああああああああああああ
                あああああああああああああああああああああああああああああああああ
                あああああああああああああああああああああああああああああああああ
                あああああああああああああああああああああああああああああああああ
                あああああああああああああああああああああああああああああああああ
                あああああああああああああああああああああああああああああああああ
                あああああああああああああああああああああああああああああああああ
                あああああああああああああああああああああああああああああああああ
                あああああああああああああああああああああああああああああああああ
                あああああああああああああああああああああああああああああああああ
                あああああああああああああああああああああああああああああああああ
                あああああああああああああああああああああああああああああああああ
                あああああああああああああああああああああああああああああああああ
                あああああああああああああああああああああああああああああああああ
                あああああああああああああああああああああああああああああああああ
                あああああああああああああああああああああああああああああああああ
                あああああああああああああああああああああああああああああああああ
                あああああああああああああああああああああああああああああああああ
                あああああああああああああああああああああああああああああああああ
                あああああああああああああああああああああああああああああああああ
                あああああああああああああああああああああああああああああああああ
                あああああああああああああああああああああああああああああああああ
                あああああああああああああああああああああああああああああああああ
                あああああああああああああああああああああああああああああああああ
                ">

            </textarea>
          </div>

          {/* Answer Section */}
          <div>
            <div className="flex border-b border-pink-500">
              <h2 className="text-pink-500 font-bold text-4xl">Answer</h2>
            </div>
            <form className="flex flex-col gap-2 mt-2" action={tryAnswer}>
              <div className="flex flex-col">
                <label>Genre</label>
                <select className="bg-slate-700 p-2 rounded-lg" name="pref_janre" defaultValue="" required onChange={handleGenreChange}>
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
                <select id="character" className="bg-slate-700 p-2 rounded-lg" name="pref_character" defaultValue="" required>
                  <option value="" disabled hidden>
                    キャラクタ名を選択してください
                  </option>
                  {characters
                    .filter(character => {
                      if (selectedGenre == null) return true // ジャンルが選択されていなかったらジャンルに関係なく全キャラを表示
                      return character.genre_code === selectedGenre
                    })
                    .map((character) => {
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
                className="h-24 mt-5 bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-500 text-xl mb-5"
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
