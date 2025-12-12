"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import PageLayout from "@/components/PageLayout";
import AuthGuard from "@/components/AuthGuard";

import { roleService } from "@/services/roleService";
import { supabase } from "@/lib/supabase";
import styles from "./profile.module.scss";

interface UserProfile {
  first_name?: string;
  last_name?: string;
  email?: string;
  birthday?: string;
  aura?: number | string;
  ranking?: number | string;
  courses_completed?: number;
  hours_studied?: number;
  member_since?: string;
  telegram?: string;
  instagram?: string;
  bio?: string;
  avatar_url?: string;
}

export default function Profile() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isEditingBio, setIsEditingBio] = useState(false);
  const [isEditingSocial, setIsEditingSocial] = useState(false);

  // ---------------------------
  // LOAD CURRENT USER PROFILE
  // ---------------------------
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
          setError("Debes iniciar sesión para ver tu perfil.");
          setLoading(false);
          return;
        }

        const profileData = await roleService.getCurrentUser();
        if (!profileData) return;

        // Traer todos los usuarios para calcular ranking
        const { data: usersData } = await supabase
          .from("users")
          .select("id, aura")
          .order("aura", { ascending: false });

        const userIndex = usersData?.findIndex(u => u.id === session.user.id);
        const userRank = userIndex !== undefined && userIndex !== -1 ? userIndex + 1 : null;

        setUser({
          first_name: profileData.first_name,
          last_name: profileData.last_name,
          email: profileData.email,
          aura: profileData.aura,
          ranking: userRank,
          courses_completed: profileData.courses_completed,
          hours_studied: profileData.hours_studied,
          member_since: profileData.created_at?.split("T")[0],
          telegram: profileData.telegram,
          instagram: profileData.instagram,
          bio: profileData.bio,
          avatar_url: profileData.avatar_url,
        });

        setError(null);
      } catch (err) {
        console.error("Error loading profile:", err);
        setError("Error al cargar el perfil. Por favor, inicia sesión nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  // ---------------------------
  // SAVE PROFILE CHANGES
  // ---------------------------
  const handleSaveBio = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return alert("Debes iniciar sesión.");

      await supabase
        .from("users")
        .update({ bio: user.bio, updated_at: new Date().toISOString() })
        .eq("id", session.user.id);

      setIsEditingBio(false);
      alert("Bio actualizada correctamente.");
    } catch (err) {
      console.error("Error saving bio:", err);
      alert("Error al guardar la bio.");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSocial = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return alert("Debes iniciar sesión.");

      await supabase
        .from("users")
        .update({
          instagram: user.instagram,
          telegram: user.telegram,
          updated_at: new Date().toISOString(),
        })
        .eq("id", session.user.id);

      setIsEditingSocial(false);
      alert("Redes sociales actualizadas correctamente.");
    } catch (err) {
      console.error("Error saving social:", err);
      alert("Error al guardar las redes sociales.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AuthGuard>
      <Sidebar />
      <PageLayout title="Profile">
        <div className={styles.profileContainer}>
          {/* LOADING */}
          {loading && (
            <div className={styles.loadingState}>
              <div className={styles.loadingSpinner}></div>
              <p>Cargando perfil...</p>
            </div>
          )}

          {/* ERROR */}
          {error && (
            <div className={styles.errorState}>
              <p>{error}</p>
              <button onClick={() => (window.location.href = "/login")}>
                Ir a Iniciar Sesión
              </button>
            </div>
          )}

          {/* CONTENT */}
          {user && !loading && !error && (
            <>
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
                    <span className={styles.statValue}>{user.ranking}</span>
                    <span className={styles.statLabel}>Ranking</span>
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

              {/* ---------------------- */}
              {/* BIO */}
              {/* ---------------------- */}
              <div className={styles.bioCard}>
                <h3>Bio</h3>
                {isEditingBio ? (
                  <textarea
                    value={user.bio}
                    onChange={(e) => setUser({ ...user, bio: e.target.value })}
                    rows={4}
                  />
                ) : (
                  <p>{user.bio || "Aún no has escrito una biografía."}</p>
                )}
                <br />
                <button
                  className={styles.editSaveButton}
                  onClick={isEditingBio ? handleSaveBio : () => setIsEditingBio(true)}
                >
                  {isEditingBio ? "Guardar Bio" : "Editar Bio"}
                </button>
              </div>

              {/* ---------------------- */}
              {/* REDES SOCIALES */}
              {/* ---------------------- */}
              <div className={styles.socialCards}>
                {/* INSTAGRAM */}
                <div className={styles.socialCard + " " + styles.instagram}>
                  <h4>Instagram</h4>
                  {isEditingSocial ? (
                    <input
                      type="text"
                      value={user.instagram}
                      onChange={(e) => setUser({ ...user, instagram: e.target.value })}
                    />
                  ) : (
                    <p>{user.instagram || "@sin_usuario"}</p>
                  )}
                  {user.instagram && !isEditingSocial && (
                    <button
                      onClick={() =>
                        window.open(`https://instagram.com/${user.instagram}`, "_blank")
                      }
                    >
                      Visitar
                    </button>
                  )}
                </div>

                {/* TELEGRAM */}
                <div className={styles.socialCard + " " + styles.telegram}>
                  <h4>Telegram</h4>
                  {isEditingSocial ? (
                    <input
                      type="text"
                      value={user.telegram}
                      onChange={(e) => setUser({ ...user, telegram: e.target.value })}
                    />
                  ) : (
                    <p>{user.telegram || "@sin_usuario"}</p>
                  )}
                  {user.telegram && !isEditingSocial && (
                    <button
                      onClick={() => window.open(`https://t.me/${user.telegram}`, "_blank")}
                    >
                      Visitar
                    </button>
                  )}
                </div>
              </div>

              <div className={styles.editSaveButtonContainer}>
                <button
                  className={styles.editSaveButton}
                  onClick={isEditingSocial ? handleSaveSocial : () => setIsEditingSocial(true)}
                >
                  {isEditingSocial ? "Guardar Redes" : "Editar Redes"}
                </button>
              </div>
            </>
          )}
        </div>
      </PageLayout>
    </AuthGuard>
  );
}
