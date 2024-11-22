import React from 'react';
import '../../styles/Message.css'

const Message = ({message}) => {
    return (
        <div className={message ? "message own" : "message"}>
            <div className="messageTop">
                <img className="messageImg" src="" alt="" />
                <p className="messageText">This is message. This is message. This is message. This is message. This is message. This is message. This is message. This is message. This is message. This is message. This is message. This is message. This is message. This is message. This is message. This is message. </p>
            </div>
            <div className="messageBottom">1 hour ago</div>
        </div>
    )
}

export default Message;