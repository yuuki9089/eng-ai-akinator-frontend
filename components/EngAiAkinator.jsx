import React from "react";

export default function EngAiAkinator() {
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
                <button className="text-cyan-400 text-3xl">🔄</button>
              </div>
            </div>
            <div className="flex flex-1 gap-3 mt-2">
              <div className="flex-1 h-full bg-slate-700 rounded-lg"></div>
              <div className="flex-1 h-full bg-slate-700 rounded-lg"></div>
              <div className="flex-1 h-full bg-slate-700 rounded-lg"></div>
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
              <div className="flex-1 h-full bg-slate-700 rounded-lg "></div>
              <div className="flex-1 h-full bg-slate-700 rounded-lg"></div>
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
                <select className="bg-slate-700 p-2 rounded-lg">
                  <option>Select Genre</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label>Character</label>
                <select className="bg-slate-700 p-2 rounded-lg">
                  <option>Select Character</option>
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
