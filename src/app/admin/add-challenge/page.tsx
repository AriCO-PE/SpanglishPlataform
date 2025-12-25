"use client";

import { useState } from "react";
import styles from "./addchallenge.module.scss";

export default function AddChallengePage() {
  return (
    <div className={styles.page}>
      
      <div className={styles.messageBanner}>
        أنتِ أجمل امرأة في العالم، نقية ووفية. أنا محظوظٌ جدًا برؤيتكِ. إذا رغبتِ في الراحة، فخذي وقتكِ يا حبيبتي.
      </div>

      <div className={styles.card}>
        <h1 className={styles.title}>Add Challenge</h1>

        <form className={styles.form}>
          <div className={styles.field}>
            <label>Title</label>
            <input type="text" placeholder="Challenge title" />
          </div>

          <div className={styles.field}>
            <label>Summary</label>
            <textarea placeholder="Short summary..." />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Points</label>
              <input type="number" placeholder="0" />
            </div>

            <div className={styles.field}>
              <label>Hours</label>
              <input type="number" placeholder="0" />
            </div>
          </div>

          <div className={styles.field}>
            <label>Description (optional)</label>
            <textarea placeholder="Description..." />
          </div>

          <button className={styles.button}>Save Challenge</button>
        </form>
      </div>
    </div>
  );
}
