"use client";

import React from "react";
import Sidebar from "@/components/Sidebar";
import PageLayout from "@/components/PageLayout";
import styles from "./podcasts.module.scss";

const podcasts = [
  {
    id: "1",
    title: "The SPANISH PODCAST",
    genre: "Basic Spanish",
    description: "Learn Spanish with simple and fun episodes",
    cover_url: "https://i.pinimg.com/736x/b8/01/67/b80167951a4eda381c6dd42300694af3.jpg",
    link: "https://www.youtube.com/watch?v=6NLoldPimHE",
  },
  {
    id: "2",
    title: "Salsa Talk",
    genre: "Music & Culture",
    description: "Interviews and stories about salsa music",
    cover_url: "https://i.pinimg.com/736x/5f/8a/61/5f8a6172f3e28d73a3f6c44f8e4e2f50.jpg",
    link: "https://podcasts.yandex.com/podcast/salsatalk",
  },
  {
    id: "3",
    title: "Tech en Español",
    genre: "Technology",
    description: "Latest tech news and reviews in Spanish",
    cover_url: "https://i.pinimg.com/736x/4b/29/7e/4b297e98d08c5f0f9d6a0f7b5e6a0d5e.jpg",
    link: "https://podcasts.yandex.com/podcast/techenespanol",
  },
  {
    id: "4",
    title: "Cultura Pop Latina",
    genre: "Pop Culture",
    description: "Discussions on movies, music, and trends",
    cover_url: "https://i.pinimg.com/736x/7a/6b/23/7a6b23d8f0b89f04b9c0a3f8a1e2b1f4.jpg",
    link: "https://podcasts.yandex.com/podcast/culturapoplatina",
  },
  // Puedes agregar más podcasts aquí
];

export default function PodcastsPage() {
  return (
    <PageLayout title="Podcasts">
      <Sidebar />
      <div className={styles.container}>
        <h2 className={styles.header}>Explore Latin Podcasts</h2>
        <div className={styles.grid}>
          {podcasts.map((pod) => (
            <div
              key={pod.id}
              className={styles.card}
              onClick={() => window.open(pod.link, "_blank")}
            >
              {pod.cover_url ? (
                <img src={pod.cover_url} alt={pod.title} className={styles.coverImage} />
              ) : (
                <div className={styles.placeholder}>No Cover</div>
              )}
              <div className={styles.cardContent}>
                <h3 className={styles.title}>{pod.title}</h3>
                <p className={styles.genre}>Genre: {pod.genre}</p>
                {pod.description && <p className={styles.description}>{pod.description}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
