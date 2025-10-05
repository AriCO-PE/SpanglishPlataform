"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { roleService, User, UserRole } from "@/services/roleService";
import AuthGuard from "@/components/AuthGuard";
import Sidebar from "@/components/Sidebar";
import PageLayout from "@/components/PageLayout";
import Toast from "@/components/Toast";
import styles from "./users.module.scss";

export default function AdminUsersPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>("student");
  const [toast, setToast] = useState<{
    isOpen: boolean;
    message: string;
    type: "success" | "error" | "warning" | "info";
  }>({ isOpen: false, message: "", type: "success" });

  useEffect(() => {
    checkPermissions();
  }, []);

  useEffect(() => {
    if (currentUser) {
      loadUsers();
    }
  }, [selectedRole, currentUser]);

  const checkPermissions = async () => {
    try {
      const user = await roleService.getCurrentUser();
      setCurrentUser(user);

      if (!user || user.role !== "admin") {
        router.push("/dashboard");
        return;
      }
    } catch (error) {
      console.error("Error checking permissions:", error);
      router.push("/dashboard");
    }
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      const usersData = await roleService.getUsersByRole(selectedRole);
      setUsers(usersData);
    } catch (err) {
      setError("Error al cargar los usuarios");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      await roleService.updateUserRole(userId, newRole);
      await loadUsers(); // Reload users
      setToast({
        isOpen: true,
        message: "Rol actualizado exitosamente",
        type: "success",
      });
    } catch (err) {
      setToast({
        isOpen: true,
        message: "Error al actualizar el rol",
        type: "error",
      });
      console.error(err);
    }
  };

  const getRoleBadgeClass = (role: UserRole) => {
    switch (role) {
      case "admin":
        return styles.adminBadge;
      case "teacher":
        return styles.teacherBadge;
      case "student":
        return styles.studentBadge;
      default:
        return styles.studentBadge;
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case "admin":
        return "👑";
      case "teacher":
        return "👨‍🏫";
      case "student":
        return "👨‍🎓";
      default:
        return "👤";
    }
  };

  const getDefaultAvatar = (firstName: string, lastName: string) => {
    return `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=3b82f6&color=fff&size=60`;
  };

  if (!currentUser || currentUser.role !== "admin") {
    return null;
  }

  return (
    <AuthGuard>
      <Sidebar />
      <PageLayout title="Administración de Usuarios">
        <div className={styles.container}>
          <div className={styles.header}>
            <div className={styles.headerInfo}>
              <h2 className={styles.title}>Gestión de Usuarios</h2>
              <p className={styles.subtitle}>
                Administra roles y permisos de usuarios
              </p>
            </div>

            <div className={styles.stats}>
              <div className={styles.statItem}>
                <span className={styles.statValue}>{users.length}</span>
                <span className={styles.statLabel}>
                  {selectedRole === "admin"
                    ? "Administradores"
                    : selectedRole === "teacher"
                    ? "Profesores"
                    : "Estudiantes"}
                </span>
              </div>
            </div>
          </div>

          {error && <div className={styles.errorAlert}>{error}</div>}

          {/* Role Filter */}
          <div className={styles.filterContainer}>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Filtrar por rol:</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                className={styles.filterSelect}
              >
                <option value="student">👨‍🎓 Estudiantes</option>
                <option value="teacher">👨‍🏫 Profesores</option>
                <option value="admin">👑 Administradores</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className={styles.loading}>
              <div className={styles.loadingSpinner}></div>
              <p>Cargando usuarios...</p>
            </div>
          ) : (
            <div className={styles.usersContainer}>
              <div className={styles.usersGrid}>
                {users.map((user) => (
                  <div key={user.id} className={styles.userCard}>
                    <div className={styles.userHeader}>
                      <img
                        src={
                          user.profile_image_url ||
                          getDefaultAvatar(user.first_name, user.last_name)
                        }
                        alt={`${user.first_name} ${user.last_name}`}
                        className={styles.avatar}
                      />
                      <div className={styles.userInfo}>
                        <h3 className={styles.userName}>
                          {user.first_name} {user.last_name}
                        </h3>
                        <p className={styles.userEmail}>{user.email}</p>
                        <div className={styles.userStats}>
                          <span className={styles.aura}>
                            ⭐ {user.aura} aura
                          </span>
                          <span className={styles.courses}>
                            📚 {user.courses_completed} cursos
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className={styles.userDetails}>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>
                          Especialidad:
                        </span>
                        <span className={styles.detailValue}>
                          {user.specialty || "No especificada"}
                        </span>
                      </div>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>
                          Horas estudiadas:
                        </span>
                        <span className={styles.detailValue}>
                          {user.hours_studied}h
                        </span>
                      </div>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>
                          Miembro desde:
                        </span>
                        <span className={styles.detailValue}>
                          {new Date(user.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className={styles.userActions}>
                      <div className={styles.currentRole}>
                        <span className={styles.roleLabel}>Rol actual:</span>
                        <span
                          className={`${styles.roleBadge} ${getRoleBadgeClass(
                            user.role
                          )}`}
                        >
                          {getRoleIcon(user.role)} {user.role}
                        </span>
                      </div>

                      {currentUser.id !== user.id && (
                        <div className={styles.roleActions}>
                          <label className={styles.actionLabel}>
                            Cambiar rol:
                          </label>
                          <select
                            value={user.role}
                            onChange={(e) =>
                              handleRoleChange(
                                user.id,
                                e.target.value as UserRole
                              )
                            }
                            className={styles.roleSelect}
                          >
                            <option value="student">👨‍🎓 Estudiante</option>
                            <option value="teacher">👨‍🏫 Profesor</option>
                            <option value="admin">👑 Administrador</option>
                          </select>
                        </div>
                      )}

                      {currentUser.id === user.id && (
                        <div className={styles.selfIndicator}>
                          <span className={styles.selfBadge}>👤 Tú</span>
                        </div>
                      )}
                    </div>

                    {user.bio && (
                      <div className={styles.userBio}>
                        <span className={styles.bioLabel}>Biografía:</span>
                        <p className={styles.bioText}>{user.bio}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {users.length === 0 && !loading && (
                <div className={styles.emptyState}>
                  <div className={styles.emptyIcon}>👥</div>
                  <h3>No hay usuarios con el rol seleccionado</h3>
                  <p>Intenta seleccionar un rol diferente</p>
                </div>
              )}
            </div>
          )}

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
