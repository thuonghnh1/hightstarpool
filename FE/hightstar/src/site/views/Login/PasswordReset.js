import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link từ react-router-dom
import "../../css/PasswordReset.css";

const PasswordReset = () => {
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Logic xử lý khi nhấn Đặt Lại Mật Khẩu
        if (password !== confirmPassword) {
            alert('Mật khẩu không khớp!');
            return;
        }
        alert('Mật khẩu đã được đặt lại thành công!');
    };

    return (
        <div className="password-reset-container">
            <div className="form-container">
                <h2>Quên mật khẩu</h2>
                <form onSubmit={handleSubmit}>
                    <label>Email/SĐT</label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        placeholder="Email/SĐT" 
                        required 
                    />

                    <label>Mã Xác Minh</label>
                    <div className="verification-code">
                        <input 
                            type="text" 
                            value={verificationCode} 
                            onChange={(e) => setVerificationCode(e.target.value)} 
                            placeholder="Nhập mã xác minh" 
                            required 
                        />
                        <button type="button" className="send-button">Gửi</button>
                    </div>

                    <label>Mật khẩu</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        placeholder="Nhập mật khẩu mới" 
                        required 
                    />

                    <label>Nhập Lại Mật Khẩu</label>
                    <input 
                        type="password" 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                        placeholder="Nhập lại mật khẩu mới" 
                        required 
                    />

                    <button type="submit" className="reset-button">Đặt Lại Mật Khẩu</button>
                </form>
                {/* Thay đổi từ <a> thành <Link> để chuyển hướng đúng */}
                <Link to="/login" className="back-link">Quay lại trang đăng nhập</Link>
            </div>
        </div>
    );
};

export default PasswordReset;
