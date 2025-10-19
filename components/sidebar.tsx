import { useState } from "react";
import { Question } from "@/types/question";
import Link from "next/link";

type SidebarProps = {
  currentQuestionID: number | null
  setCurrentSessionID: React.Dispatch<React.SetStateAction<number | null>>;
  questions: Question[];
  // 正解フラグとsession_idを取得
  // 正解していたら解答をchat名。それ以外は「？？？」
};

export default function Sidebar({
  currentQuestionID,
  setCurrentSessionID,
  questions
}: SidebarProps) {
  // サイドバーの初期表示(close)
  const [sidebarIsOpen, setSidebarIsOpen] = useState<boolean>(true);

  return (
    <>
      {/* サイドバー */}
      <div
        className={`${sidebarIsOpen ? "w-64" : "w-12"
          } bg-gray-800 transition-all duration-300 flex flex-col`}
      >
        <button
          className="p-2 bg-slate-800 hover:bg-gray-600"
          onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
        >
          {sidebarIsOpen ? "←" : "→"}
        </button>

        {sidebarIsOpen && (
          <div className="flex-1 overflow-y-auto">
            <Link href={`/`}>
              <div className="w-full p-2 bg-blue-600 hover:bg-blue-500 text-center">
                ＋ 新しいチャット
              </div>
            </Link>
            <div>
              {questions.map((question) => (
                <Link href={`/c/${question.session_id}`} key={question.session_id}>
                  <div
                    onClick={() => setCurrentSessionID(question.session_id)}
                    className={`p-2 cursor-pointer ${question.session_id === currentQuestionID
                      ? "bg-gray-600"
                      : "hover:bg-gray-700"
                      }`}
                  >
                    {question.character_name}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}