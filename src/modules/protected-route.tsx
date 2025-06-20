// src/components/ProtectedRoute.tsx
import { Navigate } from "react-router";
import { useUserStore } from "@/stores/user-store";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = useUserStore().activeUser?.token;

  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
};
