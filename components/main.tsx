import { use, useEffect, useState } from "react"
import Sidebar from "./sidebar";
import EngAiAkinator from "./EngAiAkinator";
import { BeatLoader, RingLoader } from "react-spinners";
import axios from 'axios';
import { Question } from "@/types/question";


type MainProps = {
    paramSessionID: number | null
}

export default function Main({ paramSessionID }: MainProps) {

    // 現在のセッションID
    const [currentSessionID, setCurrentSessionID] = useState<number | null>(null)
    const [questions, SetQuestions] = useState<Question[]>([]);
    const [displayLoading, setDisplayLoading] = useState<boolean>(true);
    let initialize_flag = true;
    // const [delayLoading, setDelayLoading] = useState<boolean>(true);

    /***
     * 【初期化処理】
     * DBに新規お題やセッションIDを追加
     */
    const initializeQuestion = async () => {
        try {
            console.log("initializing new Question...")
            const resp = await axios.post("http://127.0.0.1:8000/new_question");
            setCurrentSessionID(resp.data.session_id)
            console.log("initialized new Quesiton!")
        }
        catch (ex) {
            console.error("Error initialize new Question:", ex)
        }
    }

    /***
     * サイドバーに表示するための情報を取得
     */
    const selectAllSessionInfo = async () => {
        try {
            console.log("Fetching session_info ...");
            const resp = await axios.get("http://127.0.0.1:8000/get_all_session_info")
            SetQuestions(resp.data)
            console.log("session_info Fetched!");
        }
        catch (ex) {
            console.error("Error session_info:", ex);
        }
    }


    const wait = async (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    useEffect(() => {
        console.log(paramSessionID)
        if (paramSessionID != null) {
            setCurrentSessionID(paramSessionID)
            selectAllSessionInfo()
        }
        else {
            if (initialize_flag) {
                initializeQuestion().then(selectAllSessionInfo)
                initialize_flag = false;
            }
        }
        setDisplayLoading(false)
    }, [paramSessionID])

    return (
        <>
            {displayLoading ? (
                <div className="flex absolute w-full h-full items-center justify-center bg-black/50 z10">
                    <BeatLoader
                        loading={true}
                        color="#89e0f0"
                        size={30}>
                    </BeatLoader>
                </div>
            ) : (
                <></>
            )}
            <div className="flex h-screen">
                <Sidebar
                    currentQuestionID={currentSessionID}
                    setCurrentSessionID={setCurrentSessionID}
                    questions={questions}
                >
                </Sidebar>
                {currentSessionID != null ? (
                    <EngAiAkinator
                        current_session_id={currentSessionID}
                    />) :
                    <></>
                }
            </div>
        </>
    )
}