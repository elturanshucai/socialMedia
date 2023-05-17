import axios from "axios"
import { useEffect } from "react"

export default function CloseFriend({ friend }) {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER
    return (
        <li className="sidebarFriend">
            <img
                src={friend?.profilePicture ? PF + friend?.profilePicture : PF + "noAvatar.png"}
                alt=""
                className="sidebarFriendImg"
            />
            <span className="sidebarFriendName">{friend?.username}</span>
        </li>
    )
}
