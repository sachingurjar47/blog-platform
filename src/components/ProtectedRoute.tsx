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

  console.log("ProtectedRoute - authenticated:", authenticated, "pathname:", router.pathname);

  useEffect(() => {
    // Only redirect if we're not already on the login page to prevent infinite loops
    if (authenticated === false && router.pathname !== "/login") {
      console.log("Redirecting to login page");
      router.push("/login");
    }
  }, [authenticated, router]);

  if (isLoading || authenticated === undefined) return <div>Loading...</div>;

  return <>{children}</>;
};

export default ProtectedRoute;
