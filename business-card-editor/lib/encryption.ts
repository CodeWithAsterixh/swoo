import CryptoJS from 'crypto-js';

// Secret key for encryption (should be kept secure in production)
const SECRET_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'swoocards-default-secret-key';

export function encryptData(data: any): string {
  try {
    const jsonString = JSON.stringify(data);
    const encrypted = CryptoJS.AES.encrypt(jsonString, SECRET_KEY).toString();
    return encrypted;
  } catch (err) {
    console.error('Encryption error:', err);
    return '';
  }
}

export function decryptData(encryptedData: string): any {
  try {
    const decrypted = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    const jsonString = decrypted.toString(CryptoJS.enc.Utf8);
    return JSON.parse(jsonString);
  } catch (err) {
    console.error('Decryption error:', err);
    return null;
  }
}
