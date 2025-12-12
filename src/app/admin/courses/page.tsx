"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Sidebar from "@/components/Sidebar";
import PageLayout from "@/components/PageLayout";
import AuthGuard from "@/components/AuthGuard";
import styles from "./courses.module.scss";

interface ChallengeSubmission {
  id: string;
  challenge_id: string;
  user_id: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  users: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    aura: number;
    hours_studied: number;
    courses_completed: number;
  };
  challenges: {
    id: string;
    title: string;
    points: number;
    hours: number;
  };
}


export default function AdminChallengesPage() {
  const [submissions, setSubmissions] = useState<ChallengeSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("challenge_submissions")
      .select(`
        *,
        users(id, first_name, last_name, email),
        challenges(id, title, points, hours)
      `)
      .order("created_at", { ascending: false });

    if (error) console.error("Error fetching submissions:", error);
    else setSubmissions(data);

    setLoading(false);
  };

  const handleApprove = async (submissionId: string) => {
    const submission = submissions.find((s) => s.id === submissionId);
    if (!submission) return;

    // Actualizar el submission a approved
    const { error } = await supabase
      .from("challenge_submissions")
      .update({ status: "approved" })
      .eq("id", submissionId);

    if (error) return alert("Error al aprobar la solicitud");

    // Actualizar los datos del usuario: aura, hours_studied, courses_completed
    await supabase
      .from("users")
      .update({
        aura: submission.users?.aura + submission.challenges?.points,
        hours_studied:
          submission.users?.hours_studied + submission.challenges?.hours,
        courses_completed: submission.users?.courses_completed + 1,
      })
      .eq("id", submission.user_id);

    alert("Reto aprobado correctamente");
    fetchSubmissions();
  };

  const handleReject = async (submissionId: string) => {
    const { error } = await supabase
      .from("challenge_submissions")
      .update({ status: "rejected" })
      .eq("id", submissionId);

    if (error) return alert("Error al rechazar la solicitud");
    alert("Reto rechazado");
    fetchSubmissions();
  };

  if (loading) return <p>Cargando solicitudes de retos...</p>;

  return (
    <AuthGuard>
      <Sidebar />
      <PageLayout title="Administración de Retos">
        <div className={styles.container}>
          {submissions.length === 0 && (
            <p>No hay solicitudes de retos pendientes.</p>
          )}

          {submissions.map((submission) => (
            <div key={submission.id} className={styles.submissionCard}>
              <h3>{submission.challenges.title}</h3>
              <p>
                <strong>Alumno:</strong> {submission.users.first_name}{" "}
                {submission.users.last_name} ({submission.users.email})
              </p>
              <p>
                <strong>Horas:</strong> {submission.challenges.hours} |{" "}
                <strong>Puntos:</strong> {submission.challenges.points} aura
              </p>
              <p>
                <strong>Estado:</strong>{" "}
                <span
                  className={
                    submission.status === "approved"
                      ? styles.approved
                      : submission.status === "rejected"
                      ? styles.rejected
                      : styles.pending
                  }
                >
                  {submission.status}
                </span>
              </p>

              {submission.status === "pending" && (
                <div className={styles.actions}>
                  <button
                    className={styles.approveButton}
                    onClick={() => handleApprove(submission.id)}
                  >
                    Aprobar
                  </button>
                  <button
                    className={styles.rejectButton}
                    onClick={() => handleReject(submission.id)}
                  >
                    Rechazar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </PageLayout>
    </AuthGuard>
  );
}
