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
    title: "Spanish A1",
    genre: "Spanish Learning",
    description: "Start your Spanish journey with beginner-friendly episodes",
    cover_url: "https://i.pinimg.com/736x/2f/61/31/2f613117de5788d08bbaa5cff1bd2dab.jpg",
    link: "https://www.youtube.com/watch?v=dei43uUm2U4&list=PLFJ3s0TdpDoyQcmXlyDKSeLQRGibPes6o",

},

  
  
  {
    id: "3",
    title: "Spanish A2",
    genre: "Spanish Learning",
    description: "Improve your Spanish skills with engaging content",
    cover_url: "https://i.pinimg.com/736x/f3/80/9b/f3809b1fb10eddcdab741f7eebdd2d08.jpg",
    link: "https://www.youtube.com/watch?v=j8FTGGT_gbI&list=PLOfKr-QFX3fAkPdiI3xZVoh1fzXU2EVtB",
  },
  
  
  {
    id: "4",
    title: "Spanish B1",
    genre: "Spanish Learning",
    description: "Take your Spanish to the next level with intermediate lessons",
    cover_url: "https://i.pinimg.com/1200x/6d/7f/72/6d7f72dc3b314ea337807512a793dabe.jpg",
    link: "https://www.youtube.com/watch?v=DlmhBfiEtkE&list=PLOfKr-QFX3fDL4Fj6aR6B0XgHU8VNrSqd",
  },
 

  
  {
    id: "5",
    title: "Spanish B2",
    genre: "Spanish Learning",
    description: "Advance your Spanish with challenging topics and discussions",
    cover_url: "https://i.pinimg.com/736x/f7/f0/90/f7f0908cfdccd328a246cd578b7efec8.jpg",
    link: "https://www.youtube.com/watch?v=hC-zjqsDYcE&list=PLQGxDRfENoxKLudehx1KMcdzBm_QEHKyM",
  },


 {
    id: "6",
    title: "Spanish C1",
    genre: "Spanish Learning",
    description: "Master advanced Spanish with in-depth discussions and analyses",
    cover_url: "https://i.pinimg.com/736x/a1/e1/2a/a1e12a446abe05cbcbbb8e6753f61602.jpg",
    link: "https://www.youtube.com/watch?v=AAb2A3J9H6k",
  },


   {
    id: "6",
    title: "Spanish C2",
    genre: "Spanish Learning",
    description: "Master advanced Spanish with in-depth discussions and analyses",
    cover_url: "https://i.pinimg.com/736x/de/45/f4/de45f4640e8791f38b38b629c26ef788.jpg",
    link: "https://www.youtube.com/watch?v=RbjAvAfGYjc&list=PLgvdQwYpumW3L4L1EeqxakBKLswdBJqLh",
  },

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
