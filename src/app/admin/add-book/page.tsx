"use client";

import { useState } from "react";
import { booksService } from "@/services/booksService";
import PageLayout from "@/components/PageLayout";
import AuthGuard from "@/components/AuthGuard";
import Sidebar from "@/components/Sidebar";
import styles from "./addbook.module.scss";

const DIFFICULTY_OPTIONS = ["Easy", "Medium", "Hard"];
const CATEGORY_OPTIONS = [
  "Original",
  "Gramatica",
  "Vocabulario",
  "Romance",
  "Misterio",
  "Horror",
  "Filosofia",
  "Mangas",
];

export default function AddBookPage() {
  const [form, setForm] = useState({
    title: "",
    author: "",
    category: "Original",
    difficulty: "Easy",
    description: "",
    cover_url: "",
    file_url: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await booksService.add({ ...form, created_at: new Date().toISOString() });
      alert("📚 Book added successfully");

      setForm({
        title: "",
        author: "",
        category: "Original",
        difficulty: "Easy",
        description: "",
        cover_url: "",
        file_url: "",
      });
    } catch (err: any) {
      console.error("Error saving book:", err);
      alert(`❌ Error saving book: ${err.message}`);
    }
  };

  return (
    <AuthGuard>
      <PageLayout title="Add New Book">
        <div className="flex min-h-screen">
          <Sidebar />
          <main className={styles.container}>
            <div className={styles.banner}>
              إذا شعرتِ بالتعب، فتذكري أنكِ أجمل امرأة في العالم يا حبيبتي.
            </div>

            <h1 className={styles.title}>Add New Book</h1>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.grid}>
                <label className={`${styles.field} ${styles.full}`}>
                  <span>Title *</span>
                  <input name="title" value={form.title} onChange={handleChange} required />
                </label>

                <label className={styles.field}>
                  <span>Author</span>
                  <input name="author" value={form.author} onChange={handleChange} />
                </label>

                <label className={styles.field}>
                  <span>Category</span>
                  <select name="category" value={form.category} onChange={handleChange}>
                    {CATEGORY_OPTIONS.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </label>

                <label className={styles.field}>
                  <span>Difficulty</span>
                  <select name="difficulty" value={form.difficulty} onChange={handleChange}>
                    {DIFFICULTY_OPTIONS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </label>

                <label className={`${styles.field} ${styles.full}`}>
                  <span>Description</span>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={4}
                  />
                </label>

                <label className={styles.field}>
                  <span>Cover URL</span>
                  <input type="url" name="cover_url" value={form.cover_url} onChange={handleChange} placeholder="https://..." />
                </label>

                <label className={styles.field}>
                  <span>File (PDF) URL</span>
                  <input type="url" name="file_url" value={form.file_url} onChange={handleChange} placeholder="https://..." />
                </label>
              </div>

              <button type="submit" className={styles.button}>Save Book</button>
            </form>
          </main>
        </div>
      </PageLayout>
    </AuthGuard>
  );
}
