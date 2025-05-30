import React, { useState, useEffect, useRef } from "react";
import "./ChatBot.css";

export default function ChatBot({ onClose }) {
    const [messages, setMessages] = useState([
        { sender: "bot", text: "궁금한 건강 정보를 저에게 물어보세요!" },
    ]);
    const [input, setInput] = useState("");
    const chatEndRef = useRef(null);

    // 새 메시지 생기면 스크롤 아래로
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = () => {
        const text = input.trim();
        if (!text) return;

        // 1) 유저 메시지 추가
        setMessages((prev) => [...prev, { sender: "user", text }]);
        setInput("");

        // 2) (TODO) 여기에 API 호출 로직을 넣고, 응답이 오면 bot 메시지로 추가하세요.
        //    예시라서 0.5초 뒤에 에코 형태로 응답 넣어줍니다.
        setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                { sender: "bot", text: `${text}` },
            ]);
        }, 500);
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") handleSend();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}>
                    ✕
                </button>

                <div className="chat-container">
                    {messages.map((m, i) => (
                        <div key={i} className={`chat-message ${m.sender}`}>
                            {m.text}
                        </div>
                    ))}
                    <div ref={chatEndRef} />
                </div>

                <div className="chat-input-area">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="메시지를 입력하세요…"
                    />
                    <button className="send-btn" onClick={handleSend}>
                        ↑
                    </button>
                </div>
            </div>
        </div>
    );
}
