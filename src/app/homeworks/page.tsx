"use client";
import React, { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import Sidebar from "@/components/Sidebar";
import PageLayout from "@/components/PageLayout";
import AuthGuard from "@/components/AuthGuard";

type Task = {
  id: number;
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  title: string;
  description?: string;
  pdf_url?: string;
  type: "Redactar" | "Exponer" | "Comprender";
  created_at: string;
  created_by: string;
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
        <div className="flex min-h-screen bg-white text-black">
          <Sidebar />

          <main className="flex-1 p-8">
            <h1 className="text-3xl font-bold mb-6">Lista de Tareas</h1>

            {/* Filtros */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <input
                type="text"
                placeholder="Buscar por título o descripción..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border border-black p-2 rounded flex-1"
              />

              <select
                value={levelFilter}
                onChange={(e) =>
                  setLevelFilter(e.target.value as Task["level"])
                }
                className="border border-black p-2 rounded"
              >
                <option value="">Todos los niveles</option>
                {["A1","A2","B1","B2","C1","C2"].map((lvl) => (
                  <option key={lvl} value={lvl}>{lvl}</option>
                ))}
              </select>
            </div>

            {/* Lista de tareas */}
            {loading ? (
              <p>Cargando tareas...</p>
            ) : (
              <div className="grid gap-6">
                {filteredTasks.length > 0 ? (
                  filteredTasks.map((task) => (
                    <div
                      key={task.id}
                      className="border border-black p-4 rounded shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h2 className="text-xl font-semibold">{task.title}</h2>
                        <span className="text-sm font-medium">{task.level}</span>
                      </div>
                      <p className="mb-2">{task.description}</p>
                      {task.pdf_url && (
                        <a
                          href={task.pdf_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          Ver PDF
                        </a>
                      )}
                      <div className="mt-2 text-sm italic text-gray-600">{task.type}</div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center">No se encontraron tareas.</p>
                )}
              </div>
            )}
          </main>
        </div>
      </PageLayout>
    </AuthGuard>
  );
};

export default TasksPage;
