import { use, useEffect, useState } from "react"
import Sidebar from "./sidebar";
import EngAiAkinator from "./EngAiAkinator";
import { BeatLoader, RingLoader } from "react-spinners";
import axios from 'axios';


type MainProps = {
    paramSessionID: number | null
}

export default function Main({ paramSessionID }: MainProps) {

    // 現在のセッションID
    const [currentSessionID, setCurrentSessionID] = useState<number | null>(null)
    const [questions, SetQuestions] = useState([]);
    const [displayLoading, setDisplayLoading] = useState<boolean>(true);
    const [delayLoading, setDelayLoading] = useState<boolean>(true);

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
        finally {
            await wait(500); // 5秒待つ
            setDisplayLoading(false)
        }
    }

    const wait = async (ms:number) => new Promise(resolve => setTimeout(resolve, ms));

    useEffect(() => {
        if (paramSessionID != null)
            setCurrentSessionID(paramSessionID)
        else {
            initializeQuestion()
        }
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
                    currentQuestionID={88}
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