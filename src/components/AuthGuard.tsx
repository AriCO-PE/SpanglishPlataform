"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import styles from "./AuthGuard.module.scss";
interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

interface UserProfile {
  id: number;
  username: string;
  role: "student" | "teacher" | "admin";
}

function parseJwt(token: string): UserProfile | null {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requireAuth = true,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session && requireAuth) {
          setIsAuthenticated(false);
          setIsLoading(false);
          setTimeout(() => {
            router.push(
              "/login?redirect=" + encodeURIComponent(window.location.pathname)
            );
          }, 1000);
          return;
        }

        setIsAuthenticated(!!session);
        setIsLoading(false);
      } catch (error) {
        console.error("Auth check error:", error);
        setIsAuthenticated(false);
        setIsLoading(false);
      }
    };

    checkAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [requireAuth, router]);

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingContent}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return (
      <div className={styles.restrictedContainer}>
        <div className={styles.restrictedCard}>
          <h2 className={styles.restrictedTitle}>Acceso Restringido</h2>
          <p className={styles.restrictedMessage}>
            Necesitas iniciar sesión para acceder a esta página.
          </p>
          <div className={styles.redirectingContent}>
            <div className={styles.spinner}></div>
            <p className={styles.loadingText}>Redirigiendo al login...</p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
