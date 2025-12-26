"use client";

import React from "react";
import Sidebar from "@/components/Sidebar";
import PageLayout from "@/components/PageLayout";
import styles from "./videos.module.scss";

const videos = [
  {
    id: "1",
    title: "Que dificil es hablar el español",
    genre: "entretenimiento",
    description: "A humorous take on the challenges of speaking Spanish",
    cover_url: "https://i.pinimg.com/1200x/e9/9c/8e/e99c8e3361503338220ec202bdd01eee.jpg",
    link: "https://www.youtube.com/watch?v=eyGFz-zIjHE",
  },
  {
    id: "2",
    title: "Gramatica española",
    genre: "educational",
    description: "Smooth bachata dance for beginners",
    cover_url: "https://i.pinimg.com/736x/b2/d7/ff/b2d7ff826824674543015ba87410a893.jpg",
    link: "https://www.youtube.com/watch?v=Nn9Jiaz83dg&list=PL_JdwZWnDhAVEttBLQcJ5IrSucqhLOTuF",
  },
  {
    id: "3",
    title: "Vocabulario",
    genre: "educational",
    description: "Learn essential Spanish vocabulary through engaging videos",
    cover_url: "https://i.pinimg.com/736x/e1/c3/17/e1c3174a51a5039602563e6ed5e12ca5.jpg",
    link: "https://www.youtube.com/watch?v=9pcYNtntbLM&list=PLYmkYcRpIeHOfWHzpasPksNeaiVlMbtV5",
  },
  {
    id: "4",
    title: "Los acentos en español",
    genre: "educational",
    description: "Understand the importance of accents in Spanish pronunciation",
    cover_url: "https://i.pinimg.com/1200x/8a/11/1c/8a111c9ab0ac945b433c56fa7206e87c.jpg",
    link: "https://www.youtube.com/watch?v=Gh_tOhtLBTc&list=PLlpPf-YgbU7Gssxi9f72cZktgOb4Vpdoy",
  },
  
  {
    id: "5",
    title: "España vs Latinoamérica",
    genre: "educational",
    description: "Understand the differences between Spanish spoken in Spain and Latin America",
    cover_url: "https://images3.memedroid.com/images/UPLOADED640/619298c817bbc.jpeg",
    link: "https://www.youtube.com/watch?v=JB_HcCIemyQ",
  },

  {
    id: "6",
    title: "Spanish class",
    genre: "entretenimiento",
    description: "Ana de armas and more actors try to learn spanish",
    cover_url: "https://i.pinimg.com/736x/d4/94/6c/d4946c87decf888b1d97cdcd7b0de3a2.jpg",
    link: "https://www.youtube.com/watch?v=C25VhUJn038",
  },
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
