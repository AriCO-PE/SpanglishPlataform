"use client";

import Sidebar from "@/components/Sidebar";
import React, { useEffect, useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import { roleService, User } from "@/services/roleService";
import { newsService, News } from "@/services/newsService";

import styles from "./dashboard.module.scss";
import PageLayout from "@/components/PageLayout";

export default function Dashboard() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "courses" | "users">(
    "overview"
  );
  const [news, setNews] = useState<News[]>([]);

  // Cargar usuario
  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await roleService.getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error("Error loading user:", error);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  // Cargar noticias
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await newsService.getAll();
        setNews(data);
      } catch (err) {
        console.error("Error fetching news:", err);
      }
    };
    fetchNews();
  }, []);

  if (loading) {
    return (
      <AuthGuard>
        <Sidebar />
        <PageLayout title="Cargando...">
          <div className={styles.loadingContainer}>
            <div className={styles.loadingText}>Cargando...</div>
          </div>
        </PageLayout>
      </AuthGuard>
    );
  }

  if (!currentUser) {
    return (
      <AuthGuard>
        <Sidebar />
        <PageLayout title="Error">
          <div className={styles.errorContainer}>
            <div className={styles.errorText}>Error al cargar usuario</div>
          </div>
        </PageLayout>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <Sidebar />
      <PageLayout title="Dashboard">
        <main className={styles.content}>
          {/* Saludo */}
          <div className={styles.greeting}>
            <h2>¡Bienvenido de vuelta, {currentUser.first_name}!</h2>
            <p>
              {currentUser.role === "admin" &&
                "Panel de administración - Gestiona usuarios y cursos"}
              {currentUser.role === "teacher" &&
                "Panel de profesor - Gestiona tus cursos y estudiantes"}
              {currentUser.role === "student" &&
                "Continúa tu camino de aprendizaje donde lo dejaste"}
            </p>
            <div className={styles.roleBadgeContainer}>
              <span
                className={`${styles.roleBadge} ${
                  currentUser.role === "admin"
                    ? styles.adminBadge
                    : currentUser.role === "teacher"
                    ? styles.teacherBadge
                    : styles.studentBadge
                }`}
              >
                {currentUser.role === "admin"
                  ? "Administrador"
                  : currentUser.role === "teacher"
                  ? "Profesor"
                  : "Estudiante"}
              </span>
            </div>
          </div>

          {/* Tabs para admin y teachers */}
          {["admin", "teacher"].includes(currentUser.role) && (
            <div className={styles.tabsContainer}>
              <div className={styles.tabsHeader}>
                <nav className={styles.tabsNav}>
                  <button
                    onClick={() => setActiveTab("overview")}
                    className={`${styles.tab} ${
                      activeTab === "overview" ? styles.active : ""
                    }`}
                  >
                    Resumen
                  </button>
                  <button
                    onClick={() => setActiveTab("courses")}
                    className={`${styles.tab} ${
                      activeTab === "courses" ? styles.active : ""
                    }`}
                  >
                    Cursos
                  </button>
                  {currentUser.role === "admin" && (
                    <button
                      onClick={() => setActiveTab("users")}
                      className={`${styles.tab} ${
                        activeTab === "users" ? styles.active : ""
                      }`}
                    >
                      Usuarios
                    </button>
                  )}
                </nav>
              </div>
            </div>
          )}

          {/* Contenido según pestaña */}
          {activeTab === "courses" &&
            ["admin", "teacher"].includes(currentUser.role) && (
              <div className={styles.redirectCard}>
                <h3>Gestión de Cursos</h3>
                <p>Administra todos los cursos de la plataforma</p>
                <a href="/admin/courses" className={styles.redirectButton}>
                  Ir a Gestión de Cursos →
                </a>
              </div>
            )}

          {activeTab === "users" && currentUser.role === "admin" && (
            <div className={styles.redirectCard}>
              <h3>Gestión de Usuarios</h3>
              <p>Administra roles y permisos de usuarios</p>
              <a href="/admin/users" className={styles.redirectButton}>
                Ir a Gestión de Usuarios →
              </a>
            </div>
          )}

          {activeTab === "overview" && (
            <>
              {/* Estadísticas */}
              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <div className={styles.statIcon}>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                    </svg>
                  </div>
                  <div className={styles.statInfo}>
                    <h3>{currentUser.aura}</h3>
                    <p>Aura Total</p>
                  </div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statIcon}>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M12 2v20m8-18H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
                    </svg>
                  </div>
                  <div className={styles.statInfo}>
                    <h3>{currentUser.courses_completed}</h3>
                    <p>Retos Cumplidos</p>
                  </div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statIcon}>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12,6 12,12 16,14" />
                    </svg>
                  </div>
                  <div className={styles.statInfo}>
                    <h3>{currentUser.hours_studied}h</h3>
                    <p>Tiempo Estudiado</p>
                  </div>
                </div>
              </div>

              {/* Noticias dinámicas */}
              <div className={styles.newsSection}>
                <h3 className={styles.newsTitle}>Noticias Recientes</h3>
                <div className={styles.newsGrid}>
                  {news.map((item) => (
                    <div key={item.id} className={styles.newsCard}>
                      <h4>{item.title}</h4>
                      <span className={styles.newsDate}>
                        {new Date(item.published_at).toLocaleDateString()}
                      </span>
                      <p>{item.summary}</p>
                      <a
                        href={item.url || `/news/${item.id}`}
                        className={styles.newsButton}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Leer más →
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </main>
      </PageLayout>
    </AuthGuard>
  );
}
