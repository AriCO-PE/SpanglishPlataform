"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { newsService, News } from "@/services/newsService";
import styles from "./PageLayout.module.scss";

interface PageLayoutProps {
  title: string;
  children: React.ReactNode;
  showBackButton?: boolean;
}

const PageLayout = ({
  title,
  children,
  showBackButton = true,
}: PageLayoutProps) => {
  const router = useRouter();
  const [newsDropdownOpen, setNewsDropdownOpen] = useState(false);
  const [latestNews, setLatestNews] = useState<News[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/dashboard");
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      window.location.href = "/login";
    } catch (error) {
      console.error("Error logging out:", error);
      window.location.href = "/login";
    }
  };

  // Cargar noticias al abrir el dropdown
  const toggleNewsDropdown = async () => {
    if (!newsDropdownOpen) {
      const data = await newsService.getAll();
      setLatestNews(data);
    }
    setNewsDropdownOpen(!newsDropdownOpen);
  };

  // Cerrar dropdown al hacer click afuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setNewsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.pageLayout}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>{title}</h1>
        </div>

        <div className={styles.headerRight} ref={dropdownRef}>
          <button className={styles.notificationBtn} onClick={toggleNewsDropdown}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span className={styles.notificationDot}></span>
          </button>

          {newsDropdownOpen && (
            <div className={styles.newsDropdown}>
              {latestNews.length === 0 ? (
                <p style={{ padding: "0.5rem" }}>No hay noticias recientes</p>
              ) : (
                latestNews.map((news) => (
                  <div key={news.id} className={styles.newsItem}>
                    <h4>{news.title}</h4>
                    <p>{news.summary}</p>
                    <a href={`/news/${news.id}`}>Leer más →</a>
                  </div>
                ))
              )}
            </div>
          )}

          <button onClick={handleLogout} className={styles.logoutBtn}>
            Cerrar Sesión
          </button>
          <div className={styles.userProfile}>
            <div className={styles.avatar}>
             
            </div>
          </div>
        </div>
      </header>

      <main className={styles.content}>{children}</main>
    </div>
  );
};

export default PageLayout;
