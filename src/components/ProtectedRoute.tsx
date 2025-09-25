import { useAuthCheck } from "../hooks/useAuth";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useCallback } from "react";

interface Props {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: Props) => {
  const router = useRouter();
  const { data: authData, isLoading } = useAuthCheck();
  const authenticated = authData?.authenticated;

  const redirectToLogin = useCallback(() => {
    if (authenticated === false && router.pathname !== "/login") {
      router.push("/login");
    }
  }, [authenticated, router]);

  useEffect(() => {
    redirectToLogin();
  }, [redirectToLogin]);

  if (isLoading || authenticated === undefined) return <div>Loading...</div>;

  return <>{children}</>;
};

export default ProtectedRoute;
