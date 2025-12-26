"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import PageLayout from "@/components/PageLayout";
import Sidebar from "@/components/Sidebar";
import styles from "./certification.module.scss";

type RequestStatus = "pending" | "approved" | "rejected";

type CertificationRequest = {
  id: string;
  certificacion_id: string;
  certificacion_name: string;
  user_id: string;
  user_email?: string;
  status: RequestStatus;
  created_at: string;
};

const CertificationRequestsPage: React.FC = () => {
  const [requests, setRequests] = useState<CertificationRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<CertificationRequest[]>([]);
  const [filter, setFilter] = useState<"all" | RequestStatus>("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("certificacion_submissions")
        .select(`
          id,
          certificacion_id,
          status,
          created_at,
          certificacion:certificacion_id(name),
          users:user_id(email)
        `)
        .order("created_at", { ascending: false }); // los nuevos primero

      if (error) throw error;

      const mapped = data?.map((r: any) => ({
        id: r.id,
        certificacion_id: r.certificacion_id,
        certificacion_name: r.certificacion?.name || "",
        user_id: r.user_id,
        user_email: r.users?.email || "",
        status: r.status,
        created_at: r.created_at,
      })) || [];

      setRequests(mapped);
      setFilteredRequests(mapped);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    let filtered = [...requests];

    if (filter !== "all") {
      filtered = filtered.filter(r => r.status === filter);
    }

    if (search.trim() !== "") {
      const s = search.toLowerCase();
      filtered = filtered.filter(
        r =>
          r.certificacion_name.toLowerCase().includes(s) ||
          r.user_email?.toLowerCase().includes(s)
      );
    }

    setFilteredRequests(filtered);
  }, [filter, search, requests]);

  const handleFilterChange = (value: "all" | RequestStatus) => setFilter(value);

  return (
    <PageLayout title="Certification Requests">
      <div className="flex min-h-screen">
        <Sidebar />
        <main className={styles.container}>
          {/* Mensaje arriba */}
          <div className={styles.topMessage}>
            <h2>أفضل زوجة في العالم كله</h2>
          </div>

          {/* Controles de búsqueda y filtro */}
          <div className={styles.controls}>
            <input
              type="text"
              placeholder="Search by certificate or user..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />

            <select value={filter} onChange={e => handleFilterChange(e.target.value as any)}>
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Certification</th>
                  <th>User</th>
                  <th>Status</th>
                  <th>Requested At</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map(r => (
                  <tr key={r.id}>
                    <td>{r.certificacion_name}</td>
                    <td>{r.user_email}</td>
                    <td>
                      <span className={`${styles.status} ${r.status}`}>
                        {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                      </span>
                    </td>
                    <td>{new Date(r.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </main>
      </div>
    </PageLayout>
  );
};

export default CertificationRequestsPage;
