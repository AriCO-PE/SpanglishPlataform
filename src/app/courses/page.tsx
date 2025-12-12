"use client";

import React from "react";
import Sidebar from "@/components/Sidebar";
import PageLayout from "@/components/PageLayout";
import styles from "./courses.module.scss";
import { useRouter } from "next/navigation";

interface Category {
  id: number;
  title: string;
  description: string;
  icon: string;
  link: string; // Internal route
  soon?: boolean; // Nuevo: indica si estará disponible pronto
}

export default function Resources() {
  const router = useRouter();

  const categories: Category[] = [
    {
      id: 1,
      title: "Books",
      description: "Explore Spanish books for all levels",
      icon: "📚",
      link: "/books", // Internal page
    },
    {
      id: 2,
      title: "Music",
      description: "Listen to Spanish playlists",
      icon: "🎵",
      link: "/music", // Internal page
    },
    {
      id: 3,
      title: "Podcasts",
      description: "Learn Spanish by listening to podcasts",
      icon: "🎙️",
      link: "",
      soon: true, // Coming soon
    },
    {
      id: 4,
      title: "Videos",
      description: "Watch educational Spanish videos",
      icon: "📺",
      link: "",
      soon: true, // Coming soon
    },
  ];

  return (
    <PageLayout title="Learning Resources">
      <Sidebar />
      <div className={styles.container}>
        <h2 className={styles.header}>Select a Category</h2>
        <div className={styles.grid}>
          {categories.map((category) => (
            <div
              key={category.id}
              className={styles.card}
              onClick={() => router.push(category.link)}
            >
              <div className={styles.icon}>{category.icon}</div>
              <h3 className={styles.title}>
                {category.title}
                {category.soon && <span className={styles.soonBadge}> Soon 🚧</span>}
              </h3>
              <p className={styles.description}>{category.description}</p>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}

