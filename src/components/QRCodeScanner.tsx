import React, { useState } from 'react';
import QrScanner from 'react-qr-scanner';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';
import { toast } from 'react-toastify';

interface QRCodeScannerProps {
    onScanSuccess: (userId: string) => Promise<void>; // Accepting the onScanSuccess prop
}

const QRCodeScanner: React.FC<QRCodeScannerProps> = ({ onScanSuccess }) => {
    const [isScanning, setIsScanning] = useState<boolean>(false);

    // Обработчик успешного сканирования QR-кода
    const handleScan = async (data: string | null) => {
        if (data) {
            setIsScanning(false);
            await onScanSuccess(data); // Call the onScanSuccess function with the scanned data

            // Save scanned data to Firestore
            try {
                await setDoc(doc(db, 'visits', `${data}_${Date.now()}`), {
                    userId: data,
                    timestamp: serverTimestamp(),
                });
                toast.success('Посещение зафиксировано!');
            } catch (error) {
                console.error('Ошибка при сохранении данных:', error);
                toast.error('Не удалось зафиксировать посещение.');
            }
        }
    };

    // Обработчик ошибок сканирования
    const handleError = (err: Error) => {
        console.error('Ошибка сканирования:', err);
        toast.error('Ошибка сканирования QR-кода.');
    };

    return (
        <div className="p-4 bg-gray-800 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-white mb-4">Сканер QR-кода</h2>
            <button
                onClick={() => setIsScanning(!isScanning)}
                className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                {isScanning ? 'Закрыть сканер' : 'Сканировать QR-код'}
            </button>
            {isScanning && (
                <QrScanner
                    onError={handleError}
                    onScan={handleScan}
                    style={{ width: '100%', height: 'auto' }}
                />
            )}
        </div>
    );
};

export default QRCodeScanner;
