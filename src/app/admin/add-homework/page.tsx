"use client";
import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import PageLayout from "@/components/PageLayout";
import AuthGuard from "@/components/AuthGuard";
import Sidebar from "@/components/Sidebar";
import styles from "./add-homework.module.scss";

type HomeworkForm = {
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  title: string;
  description?: string;
  pdf_url?: string;
  type: "Redactar" | "Exponer" | "Comprender";
};

const AddHomeworkPage: React.FC = () => {
  const [form, setForm] = useState<HomeworkForm>({
    level: "A1",
    title: "",
    description: "",
    pdf_url: "",
    type: "Redactar",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const { data, error } = await supabase
        .from("tasks")
        .insert([form])
        .select()
        .single();

      if (error) throw error;

      setMessage("Homework creado con éxito ✅");
      setForm({
        level: "A1",
        title: "",
        description: "",
        pdf_url: "",
        type: "Redactar",
      });
    } catch (err) {
      console.error(err);
      setMessage("Error al crear el homework ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthGuard>
      <PageLayout title="Añadir Homework">
        <div className="flex min-h-screen">
          <Sidebar />
          <main className={styles.container}>
            <form className={styles.formWrapper} onSubmit={handleSubmit}>
              <div className={styles.adminMessage}>
                أنت أفضل شيء حدث لي على الإطلاق.
              </div>

              <h1 className={styles.title}>Add Homework</h1>

              <select name="level" value={form.level} onChange={handleChange}>
                {["A1","A2","B1","B2","C1","C2"].map((lvl) => (
                  <option key={lvl} value={lvl}>{lvl}</option>
                ))}
              </select>

              <input
                type="text"
                name="title"
                placeholder="Título"
                value={form.title}
                onChange={handleChange}
                required
              />

              <textarea
                name="description"
                placeholder="Descripción (opcional)"
                value={form.description}
                onChange={handleChange}
              />

              <input
                type="text"
                name="pdf_url"
                placeholder="URL del PDF (opcional)"
                value={form.pdf_url}
                onChange={handleChange}
              />

              <select name="type" value={form.type} onChange={handleChange}>
                {["Redactar","Exponer","Comprender"].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>

              <button type="submit" disabled={loading}>
                {loading ? "Creando..." : "Crear Homework"}
              </button>

              {message && <p style={{ marginTop: "1rem", textAlign: "center" }}>{message}</p>}
            </form>
          </main>
        </div>
      </PageLayout>
    </AuthGuard>
  );
};

export default AddHomeworkPage;
