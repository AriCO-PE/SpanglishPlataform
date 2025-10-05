"use client";
import React, { Suspense, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { roleService, User } from "@/services/roleService";
import styles from "./Sidebar.module.scss";

const SidebarContent = () => {
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

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

  const menuItems = [
    { name: "Inicio", icon: "📋", href: "/dashboard", badge: "NUEVO" },
    { name: "Cursos", icon: "📖", href: "/courses" },
    { name: "Clasificación", icon: "🏆", href: "/ranking" },
    { name: "Notas", icon: "📊", href: "/grades" },
  ];

  const adminItems = [
    { name: "Gestión de Cursos", icon: "📚", href: "/admin/courses" },
    { name: "Gestión de Usuarios", icon: "👥", href: "/admin/users" },
  ];

  const sidebarItems = [
    { name: "Perfil", icon: "👤", href: "/profile" },
    { name: "Herramientas", icon: "🔧", href: "/tools" },
    {
      name: "Discord",
      icon: "🎮",
      href: "https://discord.gg/b8xxX6sy",
      target: "_blank",
    },
  ];

  return (
    <div className={styles.sidebar}>
      <div className={styles.header}>
        <Link href="/" className={styles.logo}>
          <Image
            src="/af.png"
            alt="After Life Academy"
            width={40}
            height={40}
            className={styles.logoImage}
          />
          <span className={styles.logoText}>AFTER LIFE ACADEMY</span>
        </Link>
      </div>

      <nav className={styles.nav}>
        {menuItems.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className={`${styles.navItem} ${
              pathname === item.href ? styles.active : ""
            }`}
            prefetch={true}
          >
            <span className={styles.icon}>{item.icon}</span>
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
                className={`${styles.navItem} ${styles.adminItem} ${
                  pathname === item.href ? styles.active : ""
                }`}
                prefetch={true}
              >
                <span className={styles.icon}>{item.icon}</span>
                <span className={styles.text}>{item.name}</span>
              </Link>
            ))}
          </nav>
          <div className={styles.divider}></div>
        </>
      )}

      <nav className={styles.nav}>
        {sidebarItems.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className={`${styles.navItem} ${
              pathname === item.href ? styles.active : ""
            }`}
            prefetch={true}
          >
            <span className={styles.icon}>{item.icon}</span>
            <span className={styles.text}>{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className={styles.footer}>
        <div className={styles.referralSection}>
          <span className={styles.referralIcon}>🎁</span>
          <span className={styles.referralText}>Referir a un amigo</span>
        </div>
      </div>
    </div>
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
