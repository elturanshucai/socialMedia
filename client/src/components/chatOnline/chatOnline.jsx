import { useEffect, useState } from "react"
import "./chatOnline.css"
import axios from "axios"

export default function ChatOnline({ onlineUsers, currentId, setCurrentChat }) {
    const [friends, setFriends] = useState([])
    const [onlineFriends, setOnlineFriends] = useState([])

    const PF = process.env.REACT_APP_PUBLIC_FOLDER

    const handleClick = async (user) => {
        try {
            const res = await axios(process.env.REACT_APP_API + `conversations/find/${currentId}/${user._id}`)
            setCurrentChat(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        const getFriends = async () => {
            const res = await axios.get(process.env.REACT_APP_API + "users/friends/" + currentId)
            setFriends(res.data)
        }
        getFriends()
    }, [currentId])

    useEffect(() => {
        setOnlineFriends(friends.filter(f => onlineUsers.includes(f._id)))
    }, [friends, onlineUsers])
    return (
        <div className="chatOnline">
            {
                onlineFriends.map(friend => (
                    <div className="chatOnlineFriend" onClick={() => handleClick(friend)} key={friend._id}>
                        <div className="chatOnlineImgContainer">
                            <img src={friend?.profilePicture ? PF + friend?.profilePicture : PF + "noAvatar.png"} alt="" className="chatOnlineImg" />
                            <div className="chatOnlineBadge"></div>
                        </div>
                        <span className="chatOnlineName">{friend?.username}</span>
                    </div>
                ))
            }

        </div>
    )
}
