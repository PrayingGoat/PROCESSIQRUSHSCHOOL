const TOKEN_KEY = 'authToken';
const STUDENT_ID_KEY = 'currentStudentId';

type JwtPayload = {
  username?: string;
  sub?: string;
  role?: string;
  studentId?: string | null;
  exp?: number;
  iat?: number;
};

const decodeBase64Url = (value: string): string => {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
  return atob(padded);
};

export const getAuthToken = (): string | null => localStorage.getItem(TOKEN_KEY);

export const decodeJwtPayload = (token: string | null): JwtPayload | null => {
  if (!token) return null;
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    return JSON.parse(decodeBase64Url(parts[1])) as JwtPayload;
  } catch {
    return null;
  }
};

export const getAuthEmail = (): string | null => {
  const payload = decodeJwtPayload(getAuthToken());
  return payload?.username || null;
};

export const getAuthStudentId = (): string | null => {
  const payload = decodeJwtPayload(getAuthToken());
  return payload?.studentId || null;
};

export const getAuthUserId = (): string | null => {
  const payload = decodeJwtPayload(getAuthToken());
  return payload?.sub || null;
};

export const isAuthenticated = (): boolean => {
  const token = getAuthToken();
  if (!token) return false;
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) return true;
  const nowInSeconds = Math.floor(Date.now() / 1000);
  return payload.exp > nowInSeconds;
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const setCurrentStudentId = (studentId: string): void => {
  localStorage.setItem(STUDENT_ID_KEY, studentId);
};

export const getCurrentStudentId = (): string | null => localStorage.getItem(STUDENT_ID_KEY);

export const clearSession = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(STUDENT_ID_KEY);
};
