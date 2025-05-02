import jwt_decode from 'jwt-decode';

export const getUser = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    return jwt_decode(token);
  } catch {
    return null;
  }
};

export const isAdmin = () => {
  const user = getUser();
  return user?.isAdmin;
};
