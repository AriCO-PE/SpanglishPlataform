"use client";

import React from "react";
import Sidebar from "@/components/Sidebar";
import PageLayout from "@/components/PageLayout";
import styles from "./music.module.scss";

const playlists = [
  {
    id: "1",
    title: "Salsa Hits",
    genre: "Salsa",
    description: "Enjoy the best salsa tracks",
    cover_url: "https://i.pinimg.com/736x/e2/cd/74/e2cd74dcffa7bff1700cef7277a59109.jpg",
    link: "https://music.yandex.com/artist/327486?utm_source=web&utm_medium=copy_link",
  },
  {
    id: "2",
    title: "Bachata Vibes",
    genre: "Bachata",
    description: "Smooth bachata songs for dancing",
    cover_url: "https://i.pinimg.com/736x/65/04/8d/65048d0b4b9bf4adc2d5a83621a0e95d.jpg",
    link: "https://music.yandex.com/album/2526000?utm_source=web&utm_medium=copy_link",
  },
  {
    id: "3",
    title: "Reggaeton Party",
    genre: "Reggaeton",
    description: "Top reggaeton hits",
    cover_url: "https://i.pinimg.com/736x/57/82/71/578271d9395de0ef287586c02fcfaf3f.jpg",
    link: "https://music.yandex.com/playlists/2882b7f7-3b53-bf17-058c-94ba9d144c2b?utm_source=web&utm_medium=copy_link",
  },
  {
    id: "4",
    title: "Trap Latino",
    genre: "Trap",
    description: "Latest latin trap tracks",
    cover_url: "https://i.pinimg.com/736x/75/90/94/7590946934547eb4d8b42c31eddf8549.jpg",
    link: "https://music.yandex.com/playlists/ar.190a359b-e6c9-482b-bfc3-0a995e33b803?utm_source=web&utm_medium=copy_link",
  },
  {
    id: "5",
    title: "Cumbia Classics",
    genre: "Cumbia",
    description: "Classic cumbia for all occasions",
    cover_url: "https://i.pinimg.com/736x/2c/16/14/2c16140e0d1ddb15bb51b45628e35929.jpg",
    link: "https://music.yandex.com/playlists/ar.7f7e73e7-b379-4516-9c14-a9831bd52096?utm_source=web&utm_medium=copy_link",
  },
   {
    id: "6",
    title: "Merengue",
    genre: "Merengue",
    description: "For dance with ur friends and have fun",
    cover_url: "https://i.pinimg.com/736x/a5/e8/96/a5e8960d44f6b22a18f4c109c7be6a0f.jpg",
    link: "https://music.yandex.com/playlists/ar.3ca68619-d285-4206-b8a6-60b2e6468893?utm_source=web&utm_medium=copy_link",
  },
  {
    id: "7",
    title: "Bolero",
    genre: "Romantic Bolero",
    description: "Romantic bolero songs to relax",
    cover_url: "https://i.pinimg.com/736x/03/46/86/0346866d6471cb9472a0cd9b7d93ba60.jpg",
    link: "https://music.yandex.com/playlists/ar.436fc2fa-16ca-4578-a6dd-1a42bcab3b02?utm_source=web&utm_medium=copy_link",
  },
  {
    id: "8",
    title: "Latin Pop",
    genre: "ALL U NEED",
    description: "The best latin pop songs",
    cover_url: "https://i.pinimg.com/736x/49/b7/7c/49b77c1bf322285bc01ad318807246a8.jpg",
    link: "https://music.yandex.com/playlists/e18ba11a-1e26-35b9-148e-440c04d827de?utm_source=web&utm_medium=copy_link",
  },
  // Puedes agregar más playlists latinas
];

export default function Music() {
  return (
    <PageLayout title="Music">
      <Sidebar />
      <div className={styles.container}>
        <h2 className={styles.header}>Explore Latin Music Playlists</h2>
        <div className={styles.grid}>
          {playlists.map((pl) => (
            <div
              key={pl.id}
              className={styles.card}
              onClick={() => window.open(pl.link, "_blank")}
            >
              {pl.cover_url ? (
                <img src={pl.cover_url} alt={pl.title} className={styles.coverImage} />
              ) : (
                <div className={styles.placeholder}>No Cover</div>
              )}
              <div className={styles.cardContent}>
                <h3 className={styles.title}>{pl.title}</h3>
                <p className={styles.genre}>Genre: {pl.genre}</p>
                {pl.description && <p className={styles.description}>{pl.description}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
