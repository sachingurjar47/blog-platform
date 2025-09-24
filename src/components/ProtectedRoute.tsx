import { useAuthCheck } from "../hooks/useAuth";
import { useRouter } from "next/router";
import { ReactNode, useEffect } from "react";

interface Props {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: Props) => {
  const router = useRouter();
  const { data: authData, isLoading } = useAuthCheck();
  const authenticated = authData?.authenticated;

  useEffect(() => {
    if (authenticated === false) router.push("/login");
  }, [authenticated]);

  if (isLoading || authenticated === undefined) return <div>Loading...</div>;

  return <>{children}</>;
};

export default ProtectedRoute;
