import "./messenger.css"
import Topbar from "../../components/topbar/Topbar"
import Conversation from "../../components/conversations/Conversation"
import Message from "../../components/message/Message"
import ChatOnline from "../../components/chatOnline/chatOnline"
import { Send } from "@material-ui/icons"
import { useContext, useEffect, useRef, useState } from "react"
import { AuthContext } from "../../context/AuthContext"
import axios from "axios"
import { io } from "socket.io-client"

export default function Messenger() {
    const [conversation, setConversation] = useState([])
    const [currentChat, setCurrentChat] = useState(null)
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState("")
    const [arrivalMessage, setArrivalMessage] = useState(null)
    const [onlineUsers, setOnlineUsers] = useState([])
    const [friendName, setFriendName] = useState("")
    const socket = useRef()
    const { user } = useContext(AuthContext)
    const scrollRef = useRef()


    const sendMessage = async (e) => {
        e.preventDefault()
        if (newMessage.trim().length > 0) {
            const message = {
                sender: user._id,
                text: newMessage,
                conversationId: currentChat._id
            }

            const receiverId = currentChat.members.find(m => m !== user._id)

            socket.current.emit("sendMessage", ({
                userId: user._id,
                receiverId,
                text: newMessage
            }))
            try {
                const res = await axios.post(process.env.REACT_APP_API + "messages", message)
                setMessages([...messages, res.data])
                setNewMessage("")
            } catch (error) {
                console.log(error)
            }
        }
    }

    useEffect(() => {
        const getConversations = async () => {
            try {
                const res = await axios.get(process.env.REACT_APP_API + "conversations/" + user._id)
                setConversation(res.data)
            } catch (error) {
                console.log(error)
            }
        }
        getConversations()
    }, [user._id])

    useEffect(() => {
        const getMessages = async () => {
            try {
                const res = await axios.get(process.env.REACT_APP_API + "messages/" + currentChat?._id)
                setMessages(res.data)
            } catch (error) {
                console.log(error)
            }
        }
        getMessages()
    }, [currentChat])

    useEffect(() => {
        scrollRef.current?.scrollIntoView()
    }, [messages])

    useEffect(() => {
        socket.current?.emit("addUser", user._id)
        socket.current?.on("getUsers", users => {   
            setOnlineUsers(user.followings.filter(f => users.some(u => u.userId === f)))
        })
    }, [user])

    useEffect(() => {
        socket.current = io("ws://localhost:8900")
        socket.current.on("getMessage", data => {
            setArrivalMessage({
                sender: data.userId,
                text: data.text,
                createdAt: Date.now()
            })
        })
    }, [])

    useEffect(() => {
        arrivalMessage && currentChat?.members.includes(arrivalMessage.sender) &&
            setMessages(prev => [...prev, arrivalMessage])
    }, [arrivalMessage, currentChat])

    return (
        <>
            <Topbar />
            <div className="messenger">
                <div className="chatMenu">
                    <div className="chatMenuWrapper">
                        <input placeholder="Search for friends" type="text" className="chatMenuInput" />
                        {conversation.map(c => (
                            <div onClick={() => setCurrentChat(c)} key={c._id}>
                                <Conversation conversation={c} currentUser={user} currentChat={currentChat} setFriendName={setFriendName} />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="chatBox">
                    <div className="chatBoxWrapper">
                        {
                            currentChat ?
                                <>
                                    <div className="chatBoxTop">
                                        <div className="chatBoxFriendName">{friendName}</div>
                                        {
                                            messages.map(m => (
                                                <div ref={scrollRef} key={m._id}>
                                                    <Message message={m} own={m.sender === user._id} />
                                                </div>
                                            ))
                                        }
                                    </div>
                                    <div className="chatBoxBottom">
                                        <textarea
                                            placeholder="Write something.." className="chatMessageInput"
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            value={newMessage}
                                        ></textarea>
                                        <button className="chatSubmitButton" onClick={sendMessage}><Send /></button>
                                    </div>
                                </> :
                                <span className="noConversationText">Open a conversation to start a chat.</span>
                        }

                    </div>
                </div>
                <div className="chatOnline">
                    <div className="chatOnlineWrapper">
                        <ChatOnline
                            onlineUsers={onlineUsers}
                            currentId={user._id}
                            setCurrentChat={setCurrentChat}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}
