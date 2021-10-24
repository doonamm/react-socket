import './chat.scss';
import {to_decrypt, to_encrypt} from '../aes';
import {process} from '../store/action/index';
import React, {useState, useEffect, useRef} from 'react';
import {useDispatch} from 'react-redux';

function Chat({username, roomname, socket}){
    const [text, setText] = useState('');
    const [message, setMessage] = useState([]);

    const dispatch = useDispatch();

    const dispatchProcess = (encrypt, msg, cypher)=>{
        dispatch(process(encrypt, msg, cypher));
    };

    useEffect(()=>{
        socket.on('message', (data)=>{
            const ans = to_decrypt(data.text, data.username);
            dispatchProcess(false, ans, data.text);
            console.log(ans);
            let temp = message;
            temp.push({
                // ...data,
                userId: data.userId,
                username: data.username,
                text: ans,
            });
            setMessage([...temp]);
        });
    }, [socket]);

    const sendData = ()=>{
        if(text !== ''){
            const ans = to_encrypt(text);
            socket.emit('chat', ans);
            setText('')
        }
    }

    const messagesEndRef = useRef(null);

    const scrollToBottom = ()=>{
        messagesEndRef.current.scrollIntoView({behavior: 'smooth'});
    }

    useEffect(scrollToBottom, [message]);

    console.log(message, 'mess');

    return(
        <div className="chat">
            <div className="user-name">
                <h2>
                    {username} <span style={{fontSize: '0.7rem'}}>in {roomname}</span>
                </h2>
            </div>
            <div className="chat-message">
                {
                    message.map(o=>{
                        return(
                            <div className={o.username === username? 'message message-right' : 'message'}>
                                <p>{o.text}</p>
                                <span>{o.username}</span>
                            </div>
                        );
                    })
                }
            </div>
            <div ref={messagesEndRef}></div>
            <div className="send">
                <input
                    placeholder="enter your message"
                    value={text}
                    onChange={(e)=>setText(e.currentTarget.value)}
                    onKeyPress={(e)=>{
                        if(e.key === 'Enter'){
                            sendData();
                        }
                    }}
                />
                <button onClick={sendData}>Send</button>
            </div>
        </div>
    )
}

export default Chat;