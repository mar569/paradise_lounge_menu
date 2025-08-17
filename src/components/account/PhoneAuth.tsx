// PhoneAuth.tsx
import React, { useState } from 'react';
import { RecaptchaVerifier, signInWithPhoneNumber, type ConfirmationResult } from 'firebase/auth';
import { auth } from '../../services/firebase';
import RecaptchaComponent from './RecaptchaComponent';

interface PhoneAuthProps {
    onSuccess: (userId: string) => void;
    onError: (errorMessage: string) => void;
}

const PhoneAuth: React.FC<PhoneAuthProps> = ({ onSuccess, onError }) => {
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [verificationCode, setVerificationCode] = useState<string>('');
    const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
    const [message, setMessage] = useState<string>('');
    const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const handleSendCode = async () => {
        setLoading(true);
        try {
            if (recaptchaVerifier) {
                const confirmation = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
                setConfirmationResult(confirmation);
                setMessage('Код подтверждения отправлен на ваш номер телефона.');
            } else {
                setMessage('Ошибка: reCAPTCHA не инициализирована.');
            }
        } catch (error) {
            if (error instanceof Error) {
                setMessage(`Ошибка при отправке кода: ${error.message}`);
                onError(error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!confirmationResult || !verificationCode) {
            setMessage('Введите код подтверждения');
            return;
        }

        try {
            const userCredential = await confirmationResult.confirm(verificationCode);
            const userId = userCredential.user.uid;
            setMessage('Авторизация прошла успешно!');
            onSuccess(userId);
        } catch (error) {
            if (error instanceof Error) {
                if (error.message.includes('invalid-verification-code')) {
                    setMessage('Неверный код подтверждения. Пожалуйста, проверьте и попробуйте снова.');
                } else if (error.message.includes('too-many-requests')) {
                    setMessage('Слишком много запросов. Пожалуйста, попробуйте позже.');
                } else {
                    setMessage(`Ошибка при подтверждении кода: ${error.message}`);
                }
                onError(error.message);
            }
        }
    };

    return (
        <div>
            <h2>Вход по номеру телефона</h2>
            <input
                type="tel"
                placeholder="Номер телефона"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <RecaptchaComponent onVerifierReady={setRecaptchaVerifier} />
            <button onClick={handleSendCode} disabled={loading}>
                {loading ? 'Отправка...' : 'Получить код'}
            </button>

            <input
                type="text"
                placeholder="Код подтверждения"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
            />
            <button onClick={handleVerifyCode}>Подтвердить код</button>

            {message && <p>{message}</p>}
        </div>
    );
};

export default PhoneAuth;
