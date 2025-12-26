"use client";
import React, { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import Sidebar from "@/components/Sidebar";
import PageLayout from "@/components/PageLayout";
import AuthGuard from "@/components/AuthGuard";
import styles from "@/app/homeworks/homework.module.scss";

type Task = {
  id: number;
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  title: string;
  description?: string;
  pdf_url?: string;
  type: "Redactar" | "Exponer" | "Comprender";
  created_at: string;
  created_by: string | null;
};

const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState<"" | Task["level"]>("");

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("tasks").select("*");
      if (error) {
        console.error("Error fetching tasks:", error);
      } else {
        setTasks(data as Task[]);
      }
      setLoading(false);
    };
    fetchTasks();
  }, []);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesLevel = levelFilter ? task.level === levelFilter : true;
      const matchesSearch =
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.description?.toLowerCase().includes(search.toLowerCase());
      return matchesLevel && matchesSearch;
    });
  }, [tasks, search, levelFilter]);

  return (
    <AuthGuard>
      <PageLayout title="Lista de Tareas">
        <div className={styles.container}>
          <Sidebar />

          <main className={styles.main}>
            <h1 className={styles.title}>Lista de Tareas</h1>

            {/* Filtros */}
            <div className={styles.filters}>
              <input
                type="text"
                placeholder="Buscar por título o descripción..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value as Task["level"])}
              >
                <option value="">Todos los niveles</option>
                {["A1","A2","B1","B2","C1","C2"].map((lvl) => (
                  <option key={lvl} value={lvl}>{lvl}</option>
                ))}
              </select>
            </div>

            {/* Lista de tareas */}
            <div className={styles.tasksList}>
              {loading ? (
                <p>Cargando tareas...</p>
              ) : filteredTasks.length === 0 ? (
                <p className={styles.noTasks}>No se encontraron tareas.</p>
              ) : (
                filteredTasks.map((task) => (
                  <div key={task.id} className={styles.taskCard}>
                    <div className={styles.header}>
                      <h2>{task.title}</h2>
                      <span className={styles.levelBadge}>{task.level}</span>
                    </div>
                    <p className={styles.description}>{task.description}</p>
                    {task.pdf_url && (
                      <a
                        className={styles.pdfLink}
                        href={task.pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Ver PDF
                      </a>
                    )}
                    <div className={styles.type}>{task.type}</div>
                  </div>
                ))
              )}
            </div>
          </main>
        </div>
      </PageLayout>
    </AuthGuard>
  );
};

export default TasksPage;
