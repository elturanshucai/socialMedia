import { useEffect, useState } from "react"
import "./conversation.css"
import axios from "axios"

export default function Conversation({ conversation, currentUser, currentChat, setFriendName }) {
  const [user, setUser] = useState(null)
  const PF = process.env.REACT_APP_PUBLIC_FOLDER

  const handleClick = () => {
    setFriendName(user?.username)
  }

  useEffect(() => {
    const friendId = conversation.members.find(m => m !== currentUser._id)
    const getUser = async () => {
      try {
        const res = await axios.get(process.env.REACT_APP_API + "users?userId=" + friendId)
        setUser(res.data)
      } catch (error) {
        console.log(error)
      }
    }
    getUser()
  }, [currentUser, conversation])
  return (
    <div className={currentChat?._id === conversation?._id ? "conversation activeConversation" : "conversation"}
      onClick={handleClick}
    >
      <img
        src={user?.profilePicture ? PF + user?.profilePicture : PF + "noAvatar.png"}
        alt=""
        className="conversationImg" />
      <span className="conversationName">{user?.username}</span>
    </div>
  )
}