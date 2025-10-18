
import Main from "@/components/main";
import { useRouter } from "next/router"

const Index = () => {
    // パスパラメーター
    const router = useRouter();

    // パスパラメーターからセッションIDを取得
    const {session_id} = router.query
    return (
        <Main paramSessionID = {session_id!=null? Number(session_id):null}>
        </Main>
    );
};

export default Index;