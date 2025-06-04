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

        // 3) 더미 응답 처리
        setTimeout(() => {
            let botReply = "";

            // ——— 경우 1: 간단 질문 (의도: "질병 정보", 질문: "PRS가뭐야?")
            if (
                selectedIntent === "질병 정보" &&
                text.replace(/\s/g, "") === "PRS가뭐야?"
            ) {
                botReply =
                    "PRS(Polygenic Risk Score)는 여러 유전자의 변이를 바탕으로 특정 질병에 걸릴 가능성을 예측하는 유전적 위험 점수입니다. 수천 개 이상의 유전자 정보를 통합해 개인의 질병 발생 위험을 수치화한 것으로, 심혈관질환, 암 등 다양한 질환의 예방과 조기 진단에 활용됩니다.";
            }
            // ——— 경우 2: 복잡 질문 (의도: "증상 분석", 질문: "내가 담배 피고 심방세동 발생확률이 75%인데 마라탕 먹어도돼?")
            else if (
                selectedIntent === "증상 분석" &&
                text.replace(/\s/g, "") ===
                "내가담배피고심방세동발생확률이75%인데마라탕먹어도돼?"
            ) {
                botReply =
                    "심방세동은 심장의 전기적 리듬 장애로, 심장마비나 뇌졸중의 위험을 증가시킬 수 있습니다. 따라서, 심방세동이 있는 경우 마라탕을 먹는 것은 권장되지 않습니다. 하지만, 마라탕을 먹는 것은 개인의 선택이며, 먹어도 될 수 있습니다. 다만, 심방세동이 있는 경우 의사와 상담하여 식생활과 음식 선택에 대한 조언을 받는 것이 좋습니다. 마라탕은 심혈관 질환의 위험을 증가시킬 수 있으므로 피하는 것이 좋습니다.";
            }
            // ——— 그 외: 에코(echo) 형태로 간단 응답
            else {
                botReply = `[${selectedIntent || "기타"}] ${text}`;
            }

            // 4) 봇 메시지 추가
            setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
        }, 500);
    };

    // Enter 키로 전송
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