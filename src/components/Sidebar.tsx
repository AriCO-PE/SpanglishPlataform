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
    { name: "Dashboard",  href: "/dashboard",  },
    { name: "Material",  href: "/courses" },
    { name: "Ranking",href: "/ranking" },
    { name: "Challenges",  href: "/grades" },
  ];

  const adminItems = [
    { name: "Gestión de Cursos",  href: "/admin/courses" },
    { name: "Gestión de Usuarios", href: "/admin/users" },
  ];

  const sidebarItems = [
    { name: "Profile",  href: "/profile" },
    { name: "Tools",  href: "/tools" },
    {
      name: "Telegram",
      
      href: "https://t.me/SpanglishAcademyru",
      target: "_blank",
    },
  ];

  return (
    <div className={styles.sidebar}>
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
