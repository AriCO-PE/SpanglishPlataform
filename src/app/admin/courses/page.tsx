"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  roleService,
  User,
  Course,
  WithdrawalRequest,
} from "@/services/roleService";
import AuthGuard from "@/components/AuthGuard";
import Sidebar from "@/components/Sidebar";
import PageLayout from "@/components/PageLayout";
import ConfirmModal from "@/components/ConfirmModal";
import Toast from "@/components/Toast";
import styles from "./courses.module.scss";

export default function AdminCoursesPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [withdrawalRequests, setWithdrawalRequests] = useState<
    WithdrawalRequest[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"courses" | "requests">("courses");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    level: "beginner" as const,
    max_students: 50,
  });

  // Estados para modales
  const [confirmDelete, setConfirmDelete] = useState<{
    isOpen: boolean;
    courseId: string;
    courseTitle: string;
  }>({ isOpen: false, courseId: "", courseTitle: "" });

  const [toast, setToast] = useState<{
    isOpen: boolean;
    message: string;
    type: "success" | "error" | "warning" | "info";
  }>({ isOpen: false, message: "", type: "success" });

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    try {
      const user = await roleService.getCurrentUser();
      setCurrentUser(user);

      if (!user || user.role !== "admin") {
        router.push("/dashboard");
        return;
      }

      await loadData();
    } catch (error) {
      console.error("Error checking permissions:", error);
      router.push("/dashboard");
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [coursesData, requestsData] = await Promise.all([
        roleService.getCourses(),
        roleService.getWithdrawalRequests(),
      ]);

      setCourses(coursesData);
      setWithdrawalRequests(requestsData);
    } catch (err) {
      setError("Error al cargar los datos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      await roleService.createCourse({
        ...newCourse,
        creator_id: currentUser.id,
      });

      setNewCourse({
        title: "",
        description: "",
        level: "beginner",
        max_students: 50,
      });
      setShowCreateForm(false);
      await loadData();
      setToast({
        isOpen: true,
        message: "Curso creado exitosamente",
        type: "success",
      });
    } catch (err) {
      setToast({
        isOpen: true,
        message: "Error al crear el curso",
        type: "error",
      });
      console.error(err);
    }
  };

  const handleDeleteCourse = (courseId: string, courseTitle: string) => {
    setConfirmDelete({
      isOpen: true,
      courseId,
      courseTitle,
    });
  };

  const confirmDeleteCourse = async () => {
    try {
      await roleService.deleteCourse(confirmDelete.courseId);
      await loadData();
      setConfirmDelete({ isOpen: false, courseId: "", courseTitle: "" });
      setToast({
        isOpen: true,
        message: "Curso eliminado exitosamente",
        type: "success",
      });
    } catch (err) {
      setToast({
        isOpen: true,
        message: "Error al eliminar el curso",
        type: "error",
      });
    }
  };

  const handleWithdrawalRequest = async (
    requestId: string,
    approved: boolean
  ) => {
    try {
      await roleService.processWithdrawalRequest(
        requestId,
        approved,
        currentUser!.id
      );
      await loadData();
      setToast({
        isOpen: true,
        message: `Solicitud ${
          approved ? "aprobada" : "rechazada"
        } exitosamente`,
        type: "success",
      });
    } catch (err) {
      setToast({
        isOpen: true,
        message: "Error al procesar la solicitud",
        type: "error",
      });
      console.error(err);
    }
  };

  if (loading) {
    return (
      <AuthGuard>
        <Sidebar />
        <PageLayout title="Cargando...">
          <div className={styles.loading}>Cargando...</div>
        </PageLayout>
      </AuthGuard>
    );
  }

  if (!currentUser || currentUser.role !== "admin") {
    return null;
  }

  return (
    <AuthGuard>
      <Sidebar />
      <PageLayout title="Administración de Cursos">
        <div className={styles.container}>
          <div className={styles.header}>
            <h2 className={styles.title}>Gestión de Cursos</h2>
            <button
              onClick={() => setShowCreateForm(true)}
              className={styles.createButton}
            >
              Crear Curso
            </button>
          </div>

          {error && <div className={styles.errorAlert}>{error}</div>}

          {/* Tabs */}
          <div className={styles.tabsContainer}>
            <div className={styles.tabsHeader}>
              <nav className={styles.tabsNav}>
                <button
                  onClick={() => setActiveTab("courses")}
                  className={`${styles.tab} ${
                    activeTab === "courses" ? styles.active : ""
                  }`}
                >
                  📚 Cursos ({courses.length})
                </button>
                <button
                  onClick={() => setActiveTab("requests")}
                  className={`${styles.tab} ${
                    activeTab === "requests" ? styles.active : ""
                  }`}
                >
                  📋 Solicitudes de Retiro (
                  {
                    withdrawalRequests.filter((r) => r.status === "pending")
                      .length
                  }
                  )
                </button>
              </nav>
            </div>
          </div>

          {/* Courses Tab */}
          {activeTab === "courses" && (
            <div className={styles.coursesGrid}>
              {courses.map((course) => (
                <div key={course.id} className={styles.courseCard}>
                  <h3 className={styles.courseTitle}>{course.title}</h3>
                  <p className={styles.courseDescription}>
                    {course.description}
                  </p>

                  <div className={styles.courseDetails}>
                    <div className={styles.courseDetail}>
                      <span className={styles.label}>Nivel:</span>
                      <span className={styles.value}>{course.level}</span>
                    </div>
                    <div className={styles.courseDetail}>
                      <span className={styles.label}>Duración:</span>
                      <span className={styles.value}>
                        {course.duration_weeks} semanas
                      </span>
                    </div>
                    <div className={styles.courseDetail}>
                      <span className={styles.label}>Estudiantes:</span>
                      <span className={styles.value}>
                        {course.current_students}/{course.max_students}
                      </span>
                    </div>
                  </div>

                  <div className={styles.courseActions}>
                    <button
                      onClick={() => router.push(`/courses/${course.id}`)}
                      className={`${styles.actionButton} ${styles.primary}`}
                    >
                      📚 Ver Curso
                    </button>
                    <button
                      onClick={() =>
                        handleDeleteCourse(course.id, course.title)
                      }
                      className={`${styles.actionButton} ${styles.danger}`}
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Requests Tab */}
          {activeTab === "requests" && (
            <div className={styles.requestsGrid}>
              {withdrawalRequests
                .filter((r) => r.status === "pending")
                .map((request) => (
                  <div key={request.id} className={styles.requestCard}>
                    <div className={styles.requestHeader}>
                      <div className={styles.requestInfo}>
                        <h4>Solicitud de Retiro</h4>
                        <p className={styles.requestDetail}>
                          <strong>Estudiante:</strong>{" "}
                          {(request as any).users?.first_name}{" "}
                          {(request as any).users?.last_name}
                        </p>
                        <p className={styles.requestDetail}>
                          <strong>Curso:</strong>{" "}
                          {(request as any).courses?.title}
                        </p>
                        <p
                          className={`${styles.requestDetail} ${styles.reason}`}
                        >
                          <strong>Razón:</strong>{" "}
                          {request.reason || "No especificada"}
                        </p>
                        <p className={`${styles.requestDetail} ${styles.date}`}>
                          Solicitado el:{" "}
                          {new Date(request.requested_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className={styles.requestActions}>
                        <button
                          onClick={() =>
                            handleWithdrawalRequest(request.id, true)
                          }
                          className={`${styles.actionButton} ${styles.success}`}
                        >
                          Aprobar
                        </button>
                        <button
                          onClick={() =>
                            handleWithdrawalRequest(request.id, false)
                          }
                          className={`${styles.actionButton} ${styles.error}`}
                        >
                          Rechazar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

              {withdrawalRequests.filter((r) => r.status === "pending")
                .length === 0 && (
                <div className={styles.emptyState}>
                  No hay solicitudes de retiro pendientes.
                </div>
              )}
            </div>
          )}

          {courses.length === 0 && activeTab === "courses" && (
            <div className={styles.emptyState}>No hay cursos disponibles.</div>
          )}

          {/* Create Course Modal */}
          {showCreateForm && (
            <div className={styles.modalOverlay}>
              <div className={styles.modalContent}>
                <h3 className={styles.modalTitle}>Crear Nuevo Curso</h3>

                <form
                  onSubmit={handleCreateCourse}
                  className={styles.modalForm}
                >
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Título del Curso</label>
                    <input
                      type="text"
                      value={newCourse.title}
                      onChange={(e) =>
                        setNewCourse({ ...newCourse, title: e.target.value })
                      }
                      className={styles.formInput}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Descripción</label>
                    <textarea
                      value={newCourse.description}
                      onChange={(e) =>
                        setNewCourse({
                          ...newCourse,
                          description: e.target.value,
                        })
                      }
                      className={styles.formTextarea}
                      rows={3}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Nivel</label>
                    <select
                      value={newCourse.level}
                      onChange={(e) =>
                        setNewCourse({
                          ...newCourse,
                          level: e.target.value as any,
                        })
                      }
                      className={styles.formSelect}
                    >
                      <option value="beginner">Principiante</option>
                      <option value="intermediate">Intermedio</option>
                      <option value="advanced">Avanzado</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                      Máximo de Estudiantes
                    </label>
                    <input
                      type="number"
                      value={newCourse.max_students}
                      onChange={(e) =>
                        setNewCourse({
                          ...newCourse,
                          max_students: parseInt(e.target.value),
                        })
                      }
                      className={styles.formInput}
                      min="1"
                      max="200"
                    />
                  </div>

                  <div className={styles.modalActions}>
                    <button
                      type="button"
                      onClick={() => setShowCreateForm(false)}
                      className={styles.cancelButton}
                    >
                      Cancelar
                    </button>
                    <button type="submit" className={styles.submitButton}>
                      Crear Curso
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Modal de Confirmación de Eliminación */}
          <ConfirmModal
            isOpen={confirmDelete.isOpen}
            title="Eliminar Curso"
            message={`¿Estás seguro de que quieres eliminar el curso "${confirmDelete.courseTitle}"? Esta acción no se puede deshacer y se eliminará todo el contenido del curso.`}
            confirmText="Sí, eliminar"
            cancelText="Cancelar"
            type="danger"
            onConfirm={confirmDeleteCourse}
            onCancel={() =>
              setConfirmDelete({ isOpen: false, courseId: "", courseTitle: "" })
            }
          />

          {/* Toast de Notificaciones */}
          <Toast
            isOpen={toast.isOpen}
            message={toast.message}
            type={toast.type}
            onClose={() =>
              setToast({ isOpen: false, message: "", type: "success" })
            }
          />
        </div>
      </PageLayout>
    </AuthGuard>
  );
}
