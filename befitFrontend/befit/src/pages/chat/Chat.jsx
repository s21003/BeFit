import React, {useEffect, useState} from "react";
import '../../styles/Chat.css'

import NavBar from "../../components/NavBar";
import Conversation from "./Conversation";
import Message from "./Message";
import {jwtDecode} from "jwt-decode";

var stompClient = null;

const Chat = () => {
    const token = localStorage.getItem("token");
    const decodedToken = jwtDecode(token);
    const userEmail = decodedToken.sub;
    const [receiverEmails, setReceiverEmails] = useState([]);

    const [userData, setUserData] = React.useState({
        userEmail: "",
        userName:"",
        userSurname:"",
    });
    const [receiversData, setReceiversData] = React.useState({
        receiverEmail: "",
        receiverName:"",
        receiverSurname:"",
    });

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("token");

            if (token) {
                console.log("User Email from token:", userEmail, "   ", token);

                try {
                    const response = await fetch(`http://localhost:8080/user/${userEmail}`, {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const data = await response.json();

                    const tmp = {
                        userName: data.name,
                        userSurname: data.surname,
                        userEmail: data.email,
                    }

                    setUserData(tmp);
                } catch (error) {
                    console.error("Fetching user failed: ", error);
                }
            } else {
                console.error("No token found, please login again.");
                navigate('/login');
            }
        };
        fetchUser();
    }, []);


    return(
        <>
            <NavBar/>
            <div className="chat">
                <div className="chatMenu">
                    <div className="chatMenuWrapper">
                        <input placeholder="Search for friends" className="chatMenuInput"/>
                        <Conversation/>
                        <Conversation/>
                        <Conversation/>
                    </div>
                </div>
                <div className="chatBox">
                    <div className="chatBoxWrapper">
                        <div className="chatBoxTop">
                            <Message />
                            <Message message={true}/>
                        </div>
                        <div className="chatBoxBottom">
                            <textarea className="chatMessageInput" placeholder="Write someting..."></textarea>
                            <button className="chatSubmitButton">Send</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
};

export default Chat;
