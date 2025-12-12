"use client";

import React, { useEffect, useState, useCallback } from "react";
import Sidebar from "@/components/Sidebar";
import PageLayout from "@/components/PageLayout";
import AuthGuard from "@/components/AuthGuard";
import { supabase } from "@/lib/supabase";
import styles from "./books.module.scss";

interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  difficulty: string;
  description?: string;
  cover_url?: string;
  file_url?: string;
}

const categories = [
  "Original",
  "Gramatica",
  "Vocabulario",
  "Romance",
  "Misterio",
  "Horror",
  "Filosofia",
  "Mangas",
];

const difficulties = ["Easy", "Medium", "Hard"];

export default function Books() {
  const [books, setBooks] = useState<Book[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    let query = supabase.from("books").select("*");

    if (search) {
      query = query.ilike("title", `%${search}%`).or(`author.ilike.%${search}%`);
    }

    if (categoryFilter) {
      query = query.eq("category", categoryFilter);
    }

    if (difficultyFilter) {
      query = query.eq("difficulty", difficultyFilter);
    }

    const { data, error } = await query.order("title");

    if (error) {
      console.error("Error fetching books:", error);
      setBooks([]);
    } else {
      setBooks(data || []);
    }

    setLoading(false);
  }, [search, categoryFilter, difficultyFilter]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  // ================================
  // CONFIG DEL LIBRO DESTACADO
  // ================================
  const featuredBookId = "bae5814a-5fe0-4ca7-b1ea-c94575ba154e";

  const featured = books.find((b) => b.id === featuredBookId);
  const others = books.filter((b) => b.id !== featuredBookId);

  return (
    <AuthGuard>
      <Sidebar />
      <PageLayout title="Books">
        <div className={styles.container}>
          <h2 className={styles.header}>Explore Books</h2>

          {/* ======================= */}
          {/*          FILTERS         */}
          {/* ======================= */}
          <div className={styles.filters}>
            <input
              type="text"
              placeholder="Search by title or author..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
            >
              <option value="">All Levels</option>
              {difficulties.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>
          </div>

          {/* ======================= */}
          {/*    FEATURED BOOK TOP    */}
          {/* ======================= */}

          {featured && (
            <div className={styles.featuredSection}>
              <div className={styles.featuredCard}>
                <img
                  src={featured.cover_url}
                  alt={featured.title}
                  className={styles.featuredImage}
                  onError={(e) => (e.currentTarget.src = "/placeholder.png")}
                />

                <div className={styles.featuredContent}>
                  <h2>{featured.title}</h2>
                  <p>{featured.description}</p>

                  {featured.file_url && (
                    <a
                      href={featured.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.featuredBtn}
                    >
                      Leer ahora
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ======================= */}
          {/*      BOOKS GRID         */}
          {/* ======================= */}

          {loading ? (
            <p>Loading books...</p>
          ) : others.length === 0 ? (
            <p>No books found.</p>
          ) : (
            <div className={styles.grid}>
              {others.map((book) => (
                <div key={book.id} className={styles.card}>
                  {/* Imagen */}
                  {book.cover_url ? (
                    <img
                      src={book.cover_url}
                      alt={book.title}
                      className={styles.coverImage}
                      onError={(e) =>
                        (e.currentTarget.src = "/placeholder.png")
                      }
                    />
                  ) : (
                    <div className={styles.placeholder}>No Cover</div>
                  )}

                  {/* Información */}
                  <div className={styles.cardContent}>
                    <h3 className={styles.title}>{book.title}</h3>
                    <p className={styles.author}>Author: {book.author}</p>
                    <p className={styles.category}>Category: {book.category}</p>
                    <p className={styles.level}>Level: {book.difficulty}</p>

                    {book.description && (
                      <p className={styles.description}>
                        {book.description}
                      </p>
                    )}
                  </div>

                  {/* Botón */}
                  {book.file_url && (
                    <a
                      href={book.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.readBtn}
                    >
                      Read
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </PageLayout>
    </AuthGuard>
  );
}
