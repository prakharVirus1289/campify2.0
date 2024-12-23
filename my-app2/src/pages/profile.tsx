import Layout from "../layout/layout";
import { SessionContext } from "../context/userSessions";
import { useContext } from "react";
import Logout from "../components/logout";

export default function Profile() {
    const {user} = useContext(SessionContext);

    return (
        <Layout>
            <div>
                <div className="absolute top-[7vh] left-[10vw] w-[30vw] h-[40vh] flex flex-col items-center justify-center border-[1px] border-solid border-black">
                    <img src={user?.image} alt="profile" className="w-[50px] h-[50px] rounded-full" />
                    <h1>{user?.first_name} {user?.last_name}</h1>
                    <h1>{user?.email}</h1>
                </div>
            </div>
            <div className="absolute top-[50vh] left-[10vw] w-[30vw] h-[40vh] flex flex-col items-center justify-center border-[1px] border-solid border-black">
                <h1>Subjects</h1>
            </div>
            <div className="absolute top-[7vh] left-[45vw] w-[30vw] h-[40vh] flex flex-col items-center justify-center border-[1px] border-solid border-black">
                <h1>Messages</h1>
            </div>
            <div className="absolute top-[80vh] right-[5vw]">
                <Logout/>
            </div>
        </Layout>
    );
}