import { getToken, getUser, clearAuthData } from "../utils/storage";

export default function useAuth() {
  const token = getToken();
  const user = getUser();
  const isAuthenticated = !!token && !!user;

  return {
    user,
    token,
    isAuthenticated,
    isSuperAdmin: user?.role === "superadmin",
    isBranchAdmin: user?.role === "branchadmin",
    isCompanyAdmin: user?.role === "companyadmin",
    isStudent: user?.role === "student",
    logout: clearAuthData,
  };
}
