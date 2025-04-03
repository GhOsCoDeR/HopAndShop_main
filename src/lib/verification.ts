export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function storeVerificationCode(email: string, code: string): void {
  // Store the code with a 5-minute expiration
  const expirationTime = Date.now() + 5 * 60 * 1000; // 5 minutes
  sessionStorage.setItem(`verification_${email}`, JSON.stringify({
    code,
    expirationTime
  }));
}

export function verifyCode(email: string, code: string): boolean {
  const storedData = sessionStorage.getItem(`verification_${email}`);
  if (!storedData) return false;

  const { code: storedCode, expirationTime } = JSON.parse(storedData);
  
  // Check if code has expired
  if (Date.now() > expirationTime) {
    sessionStorage.removeItem(`verification_${email}`);
    return false;
  }

  return code === storedCode;
} 