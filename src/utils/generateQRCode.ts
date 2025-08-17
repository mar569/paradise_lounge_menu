// utils/generateQRCode.ts
import * as QRCode from 'qrcode'; // Изменяем импорт

export const generateQRCode = async (uid: string): Promise<string> => {
  try {
    const qrCodeUrl = await QRCode.toDataURL(uid);
    return qrCodeUrl;
  } catch (error) {
    console.error('Ошибка генерации QR-кода:', error);
    throw new Error('Не удалось сгенерировать QR-код');
  }
};
