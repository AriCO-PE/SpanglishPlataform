"use client";

import React from "react";
import Sidebar from "@/components/Sidebar";
import PageLayout from "@/components/PageLayout";
import styles from "./videos.module.scss";

const videos = [
  {
    id: "1",
    title: "Salsa Dance Tutorial",
    genre: "Salsa",
    description: "Learn salsa moves step by step",
    cover_url: "https://i.pinimg.com/736x/e2/cd/74/e2cd74dcffa7bff1700cef7277a59109.jpg",
    link: "https://www.youtube.com/watch?v=example1",
  },
  {
    id: "2",
    title: "Bachata Steps",
    genre: "Bachata",
    description: "Smooth bachata dance for beginners",
    cover_url: "https://i.pinimg.com/736x/65/04/8d/65048d0b4b9bf4adc2d5a83621a0e95d.jpg",
    link: "https://www.youtube.com/watch?v=example2",
  },
  {
    id: "3",
    title: "Reggaeton Dance Party",
    genre: "Reggaeton",
    description: "Fun reggaeton choreography for all",
    cover_url: "https://i.pinimg.com/736x/57/82/71/578271d9395de0ef287586c02fcfaf3f.jpg",
    link: "https://www.youtube.com/watch?v=example3",
  },
  {
    id: "4",
    title: "Trap Latino Moves",
    genre: "Trap",
    description: "Get into latin trap dance",
    cover_url: "https://i.pinimg.com/736x/75/90/94/7590946934547eb4d8b42c31eddf8549.jpg",
    link: "https://www.youtube.com/watch?v=example4",
  },
  // Puedes agregar más videos aquí
];

export default function VideosPage() {
  return (
    <PageLayout title="Videos">
      <Sidebar />
      <div className={styles.container}>
        <h2 className={styles.header}>Explore Latin Dance Videos</h2>
        <div className={styles.grid}>
          {videos.map((video) => (
            <div
              key={video.id}
              className={styles.card}
              onClick={() => window.open(video.link, "_blank")}
            >
              {video.cover_url ? (
                <img src={video.cover_url} alt={video.title} className={styles.coverImage} />
              ) : (
                <div className={styles.placeholder}>No Cover</div>
              )}
              <div className={styles.cardContent}>
                <h3 className={styles.title}>{video.title}</h3>
                <p className={styles.genre}>Genre: {video.genre}</p>
                {video.description && <p className={styles.description}>{video.description}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
