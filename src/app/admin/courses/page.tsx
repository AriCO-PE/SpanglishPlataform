"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Sidebar from "@/components/Sidebar";
import PageLayout from "@/components/PageLayout";
import AuthGuard from "@/components/AuthGuard";
import styles from "./courses.module.scss";

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  aura: number;
  hours_studied: number;
  courses_completed: number;
}

interface Challenge {
  id: string;
  title: string;
  points: number;
  hours: number;
}

interface ChallengeSubmission {
  id: string;
  challenge_id: string;
  user_id: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  users: User;
  challenges: Challenge;
}

export default function AdminChallengesPage() {
  const [submissions, setSubmissions] = useState<ChallengeSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  // NEW UI STATE
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("challenge_submissions")
      .select(`
        *,
        users(id, first_name, last_name, email, aura, hours_studied, courses_completed),
        challenges(id, title, points, hours)
      `)
      .order("created_at", { ascending: false });

    if (!error && data) setSubmissions(data as ChallengeSubmission[]);
    setLoading(false);
  };

  const handleApprove = async (submissionId: string) => {
    const submission = submissions.find((s) => s.id === submissionId);
    if (!submission) return;

    await supabase.from("challenge_submissions").update({ status: "approved" }).eq("id", submissionId);

    await supabase
      .from("users")
      .update({
        aura: (submission.users?.aura || 0) + (submission.challenges?.points || 0),
        hours_studied: (submission.users?.hours_studied || 0) + (submission.challenges?.hours || 0),
        courses_completed: (submission.users?.courses_completed || 0) + 1,
      })
      .eq("id", submission.user_id);

    fetchSubmissions();
  };

  const handleReject = async (submissionId: string) => {
    await supabase.from("challenge_submissions").update({ status: "rejected" }).eq("id", submissionId);
    fetchSubmissions();
  };

  // ---------- FILTER + SEARCH ----------
  const filteredSubmissions = submissions.filter((s) => {
    const matchesStatus = statusFilter === "all" || s.status === statusFilter;

    const term = search.toLowerCase();
    const matchesSearch =
      s.users?.first_name?.toLowerCase().includes(term) ||
      s.users?.last_name?.toLowerCase().includes(term) ||
      s.users?.email?.toLowerCase().includes(term) ||
      s.challenges?.title?.toLowerCase().includes(term);

    return matchesStatus && matchesSearch;
  });

  if (loading) return <p>Loading challenge submissions...</p>;

  return (
    <AuthGuard>
      <Sidebar />
      <PageLayout title="Challenge Administration">
        <div className={styles.container}>

          {/* MOTIVATIONAL BANNER */}
          <div className={styles.banner}>
            <span>بإمكانكِ فعلها يا حبيبتي! استمري في المحاولة!</span>
          </div>

          {/* FILTER BAR */}
          <div className={styles.controls}>
            <input
              type="text"
              placeholder="Search by student or challenge..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <div className={styles.filterGroup}>
              <button
                className={statusFilter === "all" ? styles.active : ""}
                onClick={() => setStatusFilter("all")}
              >
                All
              </button>
              <button
                className={statusFilter === "pending" ? styles.active : ""}
                onClick={() => setStatusFilter("pending")}
              >
                Pending
              </button>
              <button
                className={statusFilter === "approved" ? styles.active : ""}
                onClick={() => setStatusFilter("approved")}
              >
                Approved
              </button>
              <button
                className={statusFilter === "rejected" ? styles.active : ""}
                onClick={() => setStatusFilter("rejected")}
              >
                Rejected
              </button>
            </div>
          </div>

          {filteredSubmissions.length === 0 && (
            <p>No challenge submissions found.</p>
          )}

          {filteredSubmissions.map((submission) => (
            <div key={submission.id} className={styles.submissionCard}>
              <h3>{submission.challenges.title}</h3>

              <p>
                <strong>Student:</strong> {submission.users.first_name} {submission.users.last_name} ({submission.users.email})
              </p>

              <p>
                <strong>Hours:</strong> {submission.challenges.hours} &nbsp;|&nbsp;
                <strong>Points:</strong> {submission.challenges.points} aura
              </p>

              <p>
                <strong>Status:</strong>{" "}
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
                  <button className={styles.approveButton} onClick={() => handleApprove(submission.id)}>
                    Approve
                  </button>
                  <button className={styles.rejectButton} onClick={() => handleReject(submission.id)}>
                    Reject
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
