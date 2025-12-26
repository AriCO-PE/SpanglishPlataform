"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AuthGuard from "@/components/AuthGuard";
import PageLayout from "@/components/PageLayout";
import Sidebar from "@/components/Sidebar";
import styles from "./certifications.module.scss";

type DiplomaStatus = "pending" | "approved" | "rejected" | null;

type Certification = {
  id: string;
  name: string;        // Nivel o nombre del diploma
  description: string;
  cost: number;
  created_at: string;
};

type Submission = {
  certificacion_id: string;
  status: DiplomaStatus;
};

const CertificationsPage: React.FC = () => {
  const [certs, setCerts] = useState<Certification[]>([]);
  const [submissions, setSubmissions] = useState<Record<string, DiplomaStatus>>({});
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error("No user logged in");

      // 1️⃣ Traer todas las certificaciones
      const { data: certData, error: certError } = await supabase
        .from("certificacion")
        .select("*")
        .order("cost", { ascending: true });

      if (certError) throw certError;
      setCerts(certData || []);

      // 2️⃣ Traer las solicitudes del usuario
      const { data: subData, error: subError } = await supabase
        .from("certificacion_submissions")
        .select("certificacion_id, status")
        .eq("user_id", user.id);

      if (subError) throw subError;

      const statusMap: Record<string, DiplomaStatus> = {};
      subData?.forEach((s: Submission) => {
        statusMap[s.certificacion_id] = s.status;
      });
      setSubmissions(statusMap);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async (cert: Certification) => {
    setLoading(true);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error("No user logged in");

      const { error } = await supabase.from("certificacion_submissions").insert({
        user_id: user.id,
        certificacion_id: cert.id,
      });

      if (error) throw error;

      setSubmissions((prev) => ({ ...prev, [cert.id]: "pending" }));
    } catch (err) {
      console.error(err);
      alert("Error requesting the certification");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleDetails = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <AuthGuard>
      <PageLayout title="Certifications">
        <div className="flex min-h-screen">
          <Sidebar />
          <main className={styles.container}>
            <div className={styles.instructions}>
              <h1>Challenge Yourself and Unlock Your DELE Certification!</h1>
              <p>
                Your dedication and hours of study are converted into <strong>Aura</strong>. 
                Exchange your Aura to request official DELE certifications and show your progress. 
                Once approved, Aura will be deducted — choose wisely and aim high!
              </p>
            </div>

            <div className={styles.certGrid}>
              {certs.map((cert) => renderCertCard(cert))}
            </div>
          </main>
        </div>
      </PageLayout>
    </AuthGuard>
  );

  function renderCertCard(cert: Certification) {
    const status = submissions[cert.id] || null;
    const isExpanded = expanded[cert.id] || false;

    return (
      <div key={cert.id} className={styles.certCard}>
        <h2>{cert.name}</h2>
        <p><strong>Aura required:</strong> {cert.cost}</p>

        {isExpanded && <p className={styles.description}>{cert.description}</p>}

        <div className={styles.buttons}>
          <button onClick={() => toggleDetails(cert.id)}>
            {isExpanded ? "Hide Details" : "Details"}
          </button>

          {status === "approved" ? (
            <button className={styles.approved} disabled>
              ✅ Approved
            </button>
          ) : status === "pending" ? (
            <button className={styles.pending} disabled>
              ⏳ Verifying
            </button>
          ) : (
            <button
              className={styles.request}
              disabled={loading}
              onClick={() => handleRequest(cert)}
            >
              Request
            </button>
          )}
        </div>
      </div>
    );
  }
};

export default CertificationsPage;
