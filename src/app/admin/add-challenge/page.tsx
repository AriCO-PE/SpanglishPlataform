"use client";

import { useState } from "react";
import { challengesService } from "@/services/challengesService";
import styles from "./addchallenge.module.scss";

export default function AddChallengePage() {
  const [form, setForm] = useState({
    title: "",
    summary: "",
    points: "",
    hours: "",
    description: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await challengesService.create({
        title: form.title,
        summary: form.summary,
        points: Number(form.points),
        hours: Number(form.hours),
        description: form.description ||  undefined,
      });

      alert("🎉 Challenge added successfully!");

      setForm({
        title: "",
        summary: "",
        points: "",
        hours: "",
        description: "",
      });
    } catch (err) {
      console.error(err);
      alert("❌ Error saving challenge");
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.messageBanner}>
        أنتِ أجمل امرأة في العالم، نقية ووفية. أنا محظوظٌ جدًا برؤيتكِ. إذا رغبتِ في الراحة، فخذي وقتكِ يا حبيبتي.
      </div>

      <div className={styles.card}>
        <h1 className={styles.title}>Add Challenge</h1>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label>Title</label>
            <input
              name="title"
              type="text"
              placeholder="Challenge title"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.field}>
            <label>Summary</label>
            <textarea
              name="summary"
              placeholder="Short summary..."
              value={form.summary}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Points</label>
              <input
                name="points"
                type="number"
                placeholder="0"
                value={form.points}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.field}>
              <label>Hours</label>
              <input
                name="hours"
                type="number"
                placeholder="0"
                value={form.hours}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className={styles.field}>
            <label>Description (optional)</label>
            <textarea
              name="description"
              placeholder="Description..."
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <button className={styles.button}>Save Challenge</button>
        </form>
      </div>
    </div>
  );
}
