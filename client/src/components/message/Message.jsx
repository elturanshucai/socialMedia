import "./message.css"
import { format } from "timeago.js"

export default function Message({ message, own }) {
    return (
        <div className={own ? "message own" : "message"}>
            <div className="messageTop">
                <img src="https://www.tagesspiegel.de/sport/images/themen-der-woche-sport-bilder-des-tages-sport-leo-messi-of-fc-barcelona-barca-celebrates-after-scoring-a-goal-durin/alternates/BASE_1_1_W1000/themen-der-woche---sport-bilder-des-tages---sport-leo-messi-of-fc-barcelona-barca-celebrates-after-scoring-a-goal-durin.jpeg" alt="" className="messageImg" />
                <p className="messageText">{message?.text}</p>
            </div>
            <div className="messageBottom">{format(message?.createdAt)}</div>
        </div>
    )
}
