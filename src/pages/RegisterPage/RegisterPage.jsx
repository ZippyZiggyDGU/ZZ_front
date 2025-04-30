
import { useState } from "react";
import "./RegisterPage.css";

function RegisterPage() {
    const [gender, setGender] = useState(null);

    return (
        <div className="register-page">
            {/* 상단 주황 영역 */}
            <section className="register-top">
                <h1 className="register-title">회원가입</h1>
                <p className="register-subtitle">
                    웹사이트에 가입하고, 심혈관 질환을 간편하게 분석하세요!
                </p>

                <div className="form-row">
                    <input type="email" placeholder="이메일 주소를 입력하세요." />
                    <button className="check-button">중복 확인</button>
                </div>

                <input type="password" placeholder="비밀번호를 입력하세요." />
                <input type="password" placeholder="비밀번호를 다시 입력하세요." />
            </section>

            {/* 하단 정보 입력 영역 */}
            <div className="register-bottom">
                {/* 왼쪽: 설명 */}
                <div className="info-text">
                    <h2 className="section-title">개인 정보 입력</h2>
                    <p className="section-sub">
                        계정을 생성하기 위해 당신의 개인 정보를 입력하세요
                    </p>
                </div>

                {/* 오른쪽: 입력 폼 */}
                <div className="info-form">
                    <label>이름</label>
                    <input type="text" placeholder="이름을 입력하세요" />

                    <label>생년월일</label>
                    <input type="text" placeholder="예) 19650101" />

                    <label className="gender-label">성별</label>
                    <div className="gender-buttons">
                        <button
                            className={`gender-btn ${gender === '남성' ? 'selected' : ''}`}
                            onClick={() => setGender('남성')}
                        >
                            남성
                        </button>
                        <button
                            className={`gender-btn ${gender === '여성' ? 'selected' : ''}`}
                            onClick={() => setGender('여성')}
                        >
                            여성
                        </button>
                    </div>

                    <button className="submit-btn">회원가입</button>
                </div>

            </div>
        </div>
    );
}

export default RegisterPage;
