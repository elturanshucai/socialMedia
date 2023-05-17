import { useEffect, useRef } from "react"
import "./register.css"
import axios from "axios"
import {useNavigate} from "react-router-dom"

export default function Register() {
    const username = useRef()
    const email = useRef()
    const password = useRef()
    const passwordAgain = useRef()
    const navigate = useNavigate()

    const handleSubmit = async(e) => {
        e.preventDefault()
        if(passwordAgain.current.value !== password.current.value){
            passwordAgain.current.setCustomValidity("Password don't match!")
        }
        else{
            const user = {
                username:username.current.value,
                email:email.current.value,
                password:password.current.value,
            }
            try {
                await axios.post("http://localhost:5000/api/auth/register", user)
                navigate("/login")
            } catch (error) {
                console.log(error);
            }
        }
    }
    return (
        <div className="login">
            <div className="loginWrapper">
                <div className="loginLeft">
                    <h3 className="loginLogo">Eltusocial</h3>
                    <span className="loginDesc">Eltusocial ilə dostlarında mesajlaş, əylən !</span>
                </div>
                <div className="loginRight">
                    <form className="registerBox" onSubmit={handleSubmit}>
                        <input placeholder="Username" type="text" required className="loginInput" ref={username} />
                        <input placeholder="Email" type="email" required className="loginInput" ref={email} />
                        <input placeholder="Password" type="password" minLength="6" required className="loginInput" ref={password} />
                        <input placeholder="Password Again" type="password" required className="loginInput" ref={passwordAgain} />
                        <button className="loginButton" type="submit">Sign Up</button>
                        <button className="loginRegisterButton" onClick={()=>navigate("/login")}>Log into Account</button>
                    </form>
                </div>
            </div>
        </div>
    )
}