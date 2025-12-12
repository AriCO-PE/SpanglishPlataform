"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import PageLayout from "@/components/PageLayout";
import AuthGuard from "@/components/AuthGuard";
import { supabase } from "@/lib/supabase";
import styles from "../profile.module.scss";

interface UserProfile {
  first_name: string;
  last_name: string;
  email: string;
  aura?: number;
  courses_completed?: number;
  hours_studied?: number;
  member_since?: string;
  bio?: string;
  telegram?: string;
  instagram?: string;
  avatar_url?: string;
}

export default function UserProfilePage() {
  const params = useParams();
  const { id } = params; // ID del usuario
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching user:", error);
        setUser(null);
      } else {
        setUser(data);
      }
      setLoading(false);
    };

    fetchUser();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>User not found.</p>;

  return (
    <AuthGuard>
      <Sidebar />
      <PageLayout title={`${user.first_name} ${user.last_name}`}>
        <div className={styles.profileContainer}>
          {/* Profile Card */}
          <div className={styles.profileCard}>
            <div className={styles.profileHeader}>
              <div className={styles.profileAvatar}>
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt="Avatar" />
                ) : (
                  <div className={styles.placeholderAvatar}></div>
                )}
              </div>

              <div className={styles.profileInfo}>
                <h2>{user.first_name} {user.last_name}</h2>
                <p>{user.email}</p>
                <span>Member since {user.member_since}</span>
              </div>
            </div>

            <div className={styles.profileStats}>
              <div className={styles.stat}>
                <span className={styles.statValue}>{user.courses_completed}</span>
                <span className={styles.statLabel}>Retos Completados</span>
              </div>

              <div className={styles.stat}>
                <span className={styles.statValue}>{user.aura}</span>
                <span className={styles.statLabel}>Aura</span>
              </div>

              <div className={styles.stat}>
                <span className={styles.statValue}>{user.hours_studied}</span>
                <span className={styles.statLabel}>Horas Estudiadas</span>
              </div>
            </div>
          </div>

          {/* BIO */}
          <div className={styles.bioCard}>
            <h3>Bio</h3>
            <p>{user.bio || "This user has not written a bio yet."}</p>
          </div>

          {/* Social Cards */}
          <div className={styles.socialCards}>
            <div className={styles.socialCard + " " + styles.instagram}>
              <h4>Instagram</h4>
              <p>{user.instagram || "@no_user"}</p>
              {user.instagram && (
                <button onClick={() => window.open(`https://instagram.com/${user.instagram}`, "_blank")}>
                  Visit
                </button>
              )}
            </div>

            <div className={styles.socialCard + " " + styles.telegram}>
              <h4>Telegram</h4>
              <p>{user.telegram || "@no_user"}</p>
              {user.telegram && (
                <button onClick={() => window.open(`https://t.me/${user.telegram}`, "_blank")}>
                  Visit
                </button>
              )}
            </div>
          </div>
        </div>
      </PageLayout>
    </AuthGuard>
  );
}
