import "./post.css"
import { MoreVert } from "@material-ui/icons"
import { useContext, useEffect, useState } from "react"
import axios from "axios"
import { format } from "timeago.js"
import { Link } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"

export default function Post({ post }) {
    const [user, setUser] = useState({})
    const [like, setLike] = useState(post.likes.length)
    const [isLiked, setIsLiked] = useState(false)
    const PF = process.env.REACT_APP_PUBLIC_FOLDER
    const { user: currentUser } = useContext(AuthContext)

    useEffect(() => {
        setIsLiked(post.likes.includes(currentUser._id))
    }, [currentUser._id, post.likes])

    const likeHandler = () => {
        try {
            axios.put(`${process.env.REACT_APP_API}posts/${post._id}/like`, { userId: currentUser._id })
        } catch (error) {
            console.log(error);
        }
        setLike(isLiked ? like - 1 : like + 1)
        setIsLiked(!isLiked)
    }

    useEffect(() => {
        const fetchUser = async () => {
            const res = await axios.get(`${process.env.REACT_APP_API}users?userId=${post?.userId}`)
            setUser(res.data)
        }
        fetchUser()
    }, [post.userId])
    return (
        <div className="post">
            <div className="postWrapper">
                <div className="postTop">
                    <div className="postTopLeft">
                        <Link to={`profile/${user.username}`}>
                            <img
                                src={user.profilePicture ? user.profilePicture : PF + "noAvatar.png"}
                                alt="" className="postProfileImg"
                            />
                        </Link>
                        <span className="postUsername">{user.username}</span>
                        <span className="postDate">{format(post.createdAt)}</span>
                    </div>
                    <div className="postTopRight">
                        <MoreVert />
                    </div>
                </div>
                <div className="postCenter">
                    <span className="postText">{post?.desc}</span>
                    <img src={PF + post.img} alt="" className="postImg" />
                </div>
                <div className="postBottom">
                    <div className="postBottomLeft">
                        <img src={`${PF}post/like.png`} alt="" className="likeIcon" onClick={likeHandler} />
                        <img src={`${PF}post/heart.png`} alt="" className="likeIcon" onClick={likeHandler} />
                        <span className="postLikeCounter">{like} people liked it</span>
                    </div>
                    <div className="postBottomRight">
                        <span className="postCommentText">{post?.comment} comments</span>
                    </div>
                </div>
            </div>
        </div>
    )
}