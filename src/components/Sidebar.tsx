"use client";
import React, { Suspense, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { roleService, User } from "@/services/roleService";
import styles from "./Sidebar.module.scss";

// 🔹 Definir tipo para los items del sidebar
interface SidebarItem {
  name: string;
  href: string;
  icon?: React.ReactNode | string;
  badge?: string | number;
  target?: string;
}

const SidebarContent = () => {
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false); // 👈 estado para toggle

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await roleService.getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error("Error loading user:", error);
      }
    };
    loadUser();
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen); // 👈 función toggle

  // 🔹 Menú principal
  const menuItems: SidebarItem[] = [
    { name: "Dashboard", href: "/dashboard", icon: "🏠" },
    { name: "Material", href: "/courses", icon: "📚" },
    { name: "Ranking", href: "/ranking", icon: "🏆" },
    { name: "Challenges", href: "/grades", icon: "🎯" },
  ];

  // 🔹 Menú de administración (solo para admins)
  const adminItems: SidebarItem[] = [
    { name: "Request management", href: "/admin/courses", icon: "📘" },
    { name: "User Management", href: "/admin/users", icon: "👥" },
    { name: "Add book", href: "/admin/add-book", icon: "📚" },
  ];

  // 🔹 Otros items del sidebar
  const sidebarItems: SidebarItem[] = [
    { name: "Profile", href: "/profile", icon: "👤" },
    { name: "Tools", href: "/tools", icon: "🛠️" },
    { name: "Telegram", href: "https://t.me/SpanglishAcademyru", icon: "💬", target: "_blank" },
  ];

  return (
    <>
      {/* Botón hamburguesa */}
      <button
        className={styles.sidebarToggle}
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        ☰
      </button>

      {/* Sidebar */}
      <div className={`${styles.sidebar} ${sidebarOpen ? styles.open : ""}`}>
        <div className={styles.header}>
          <Link href="/" className={styles.logo}>
            <Image
              src="/span.jpeg"
              alt="After Life Academy"
              width={40}
              height={40}
              className={styles.logoImage}
            />
            <span className={styles.logoText}>SPANGLISH ACADEMY</span>
          </Link>
        </div>

        {/* Menú principal */}
        <nav className={styles.nav}>
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              target={item.target}
              className={`${styles.navItem} ${pathname === item.href ? styles.active : ""}`}
              prefetch={true}
            >
              {item.icon && <span className={styles.icon}>{item.icon}</span>}
              <span className={styles.text}>{item.name}</span>
              {item.badge && <span className={styles.badge}>{item.badge}</span>}
            </Link>
          ))}
        </nav>

        <div className={styles.divider}></div>

        {/* Sección de Administración - Solo para admins */}
        {currentUser?.role === "admin" && (
          <>
            <div className={styles.sectionTitle}>
              <span className={styles.sectionIcon}>👑</span>
              <span className={styles.sectionText}>Administración</span>
            </div>
            <nav className={styles.nav}>
              {adminItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  target={item.target}
                  className={`${styles.navItem} ${styles.adminItem} ${
                    pathname === item.href ? styles.active : ""
                  }`}
                  prefetch={true}
                >
                  {item.icon && <span className={styles.icon}>{item.icon}</span>}
                  <span className={styles.text}>{item.name}</span>
                </Link>
              ))}
            </nav>
            <div className={styles.divider}></div>
          </>
        )}

        {/* Otros items del sidebar */}
        <nav className={styles.nav}>
          {sidebarItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              target={item.target}
              className={`${styles.navItem} ${
                pathname === item.href ? styles.active : ""
              }`}
              prefetch={true}
            >
              {item.icon && <span className={styles.icon}>{item.icon}</span>}
              <span className={styles.text}>{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
};

const Sidebar = () => {
  return (
    <Suspense fallback={<div className={styles.sidebar}>Loading...</div>}>
      <SidebarContent />
    </Suspense>
  );
};

export default Sidebar;
