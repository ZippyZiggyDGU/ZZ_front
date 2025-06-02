// src/components/ChatBot/ChatBot.jsx

import React, { useState, useEffect, useRef } from "react";
import "./ChatBot.css";

export default function ChatBot({ onClose }) {
    // 1) 채팅 메시지 상태
    const [messages, setMessages] = useState([
        { sender: "bot", text: "궁금한 건강 정보를 저에게 물어보세요!" },
    ]);

    // 2) 인풋 상태
    const [input, setInput] = useState("");

    // 3) 의도(intent) 상태: 기본값은 빈 문자열(아무 버튼도 선택되지 않은 상태)
    const [selectedIntent, setSelectedIntent] = useState("");

    // 4) 스크롤을 아래로 내리기 위한 ref
    const chatEndRef = useRef(null);

    // 의도 버튼 목록
    const intentOptions = [
        "질병 정보",
        "생활 습관",
        "증상 분석",
        "유전체 정보",
        "PRS 문의",
        "기타",
    ];

    // 새 메시지가 추가될 때마다 스크롤을 하단으로
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // 전송 버튼 또는 Enter 키 처리
    const handleSend = () => {
        const text = input.trim();
        if (!text) return;

        // 1) 유저 메시지 추가
        setMessages((prev) => [
            ...prev,
            { sender: "user", text, intent: selectedIntent },
        ]);

        // 2) 인풋 초기화
        setInput("");

        // 3) TODO: 실제 API 호출 (selectedIntent와 text를 서버로 보내서 답변 받기)
        // 지금은 예시로 0.5초 뒤에 bot이 그대로 에코 형태로 응답한다고 가정
        setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                {
                    sender: "bot",
                    text: `(${selectedIntent || "기타"}) 분류에 대한 답변: "${text}"`,
                },
            ]);
        }, 500);
    };

    // Enter 키로도 전송
    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSend();
        }
    };

    // 모달 바깥 클릭 시 닫기
    const handleOverlayClick = () => {
        onClose();
    };

    // 모달 내부 클릭은 전달 막기
    const handleContentClick = (e) => {
        e.stopPropagation();
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-content" onClick={handleContentClick}>
                {/* 닫기 버튼 */}
                <button className="close-btn" onClick={onClose}>
                    ✕
                </button>

                {/* 1) 의도 버튼 영역 */}
                <div className="intent-buttons">
                    {intentOptions.map((intent) => (
                        <button
                            key={intent}
                            className={`intent-button ${selectedIntent === intent ? "selected" : ""
                                }`}
                            onClick={() => setSelectedIntent(intent)}
                        >
                            {intent}
                        </button>
                    ))}
                </div>

                {/* 2) 채팅 메시지 출력 영역 */}
                <div className="chat-container">
                    {messages.map((m, idx) => (
                        <div key={idx} className={`chat-message ${m.sender}`}>
                            {m.text}
                        </div>
                    ))}
                    <div ref={chatEndRef} />
                </div>

                {/* 3) 입력 영역 */}
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