declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier; // Указываем точный тип
  }
}

// Убедитесь, что файл является модулем
export {};
