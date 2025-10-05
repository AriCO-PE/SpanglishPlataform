"use client";

import React, { useState, useEffect } from "react";
import { roleService, User } from "@/services/roleService";
import styles from "./CourseMembers.module.scss";
import Toast from "./Toast";

interface CourseMembersProps {
  courseId: string;
  currentUser: User;
}

const CourseMembers: React.FC<CourseMembersProps> = ({
  courseId,
  currentUser,
}) => {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [courseMembers, setCourseMembers] = useState<User[]>([]);
  const [courseInstructors, setCourseInstructors] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState<{
    isOpen: boolean;
    message: string;
    type: "success" | "error" | "warning" | "info";
  }>({ isOpen: false, message: "", type: "success" });

  const canManageMembers = () => {
    return currentUser.role === "admin" || currentUser.role === "teacher";
  };

  useEffect(() => {
    loadData();
  }, [courseId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [users, members, instructors] = await Promise.all([
        roleService.getAllUsers(),
        roleService.getCourseMembers(courseId),
        roleService.getCourseInstructors(courseId),
      ]);

      setAllUsers(users);
      setCourseMembers(members);
      setCourseInstructors(instructors);
    } catch (error) {
      console.error("Error loading data:", error);
      setToast({
        isOpen: true,
        message: "Error al cargar los datos",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMembershipChange = async (
    userId: string,
    isEnrolled: boolean
  ) => {
    if (!canManageMembers()) return;

    try {
      if (isEnrolled) {
        await roleService.removeUserFromCourse(userId, courseId);
        setToast({
          isOpen: true,
          message: "Usuario removido del curso exitosamente",
          type: "success",
        });
      } else {
        await roleService.addUserToCourse(userId, courseId, currentUser.id);
        setToast({
          isOpen: true,
          message: "Usuario agregado al curso exitosamente",
          type: "success",
        });
      }

      // Recargar datos
      await loadData();
    } catch (error: any) {
      setToast({
        isOpen: true,
        message: error.message || "Error al actualizar la membresía",
        type: "error",
      });
    }
  };

  const isUserEnrolled = (userId: string) => {
    return courseMembers.some((member) => member.id === userId);
  };

  const isUserInstructor = (userId: string) => {
    return courseInstructors.some((instructor) => instructor.id === userId);
  };

  const isCheckboxDisabled = (user: User) => {
    // Deshabilitar para instructores y administradores
    return user.role === "admin" || isUserInstructor(user.id);
  };

  const filteredUsers = allUsers.filter((user) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.first_name.toLowerCase().includes(searchLower) ||
      user.last_name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      (user.specialty && user.specialty.toLowerCase().includes(searchLower))
    );
  });

  const getDefaultAvatar = (firstName: string, lastName: string) => {
    return `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=3b82f6&color=fff&size=40`;
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingSpinner}></div>
        <p>Cargando miembros...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerInfo}>
          <h3 className={styles.title}>👥 Gestión de Miembros</h3>
          <p className={styles.subtitle}>
            Administra quién tiene acceso a este curso
          </p>
        </div>

        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{courseMembers.length}</span>
            <span className={styles.statLabel}>Estudiantes</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{courseInstructors.length}</span>
            <span className={styles.statLabel}>Instructores</span>
          </div>
        </div>
      </div>

      <div className={styles.searchContainer}>
        <div className={styles.searchBox}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Buscar por nombre, email o especialidad..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      <div className={styles.membersContainer}>
        <div className={styles.membersHeader}>
          <div className={styles.headerCell}>Usuario</div>
          <div className={styles.headerCell}>Email</div>
          <div className={styles.headerCell}>Rol</div>
          <div className={styles.headerCell}>Especialidad</div>
          <div className={styles.headerCell}>Estado</div>
        </div>

        <div className={styles.membersList}>
          {filteredUsers.map((user) => {
            const isEnrolled = isUserEnrolled(user.id);
            const isInstructor = isUserInstructor(user.id);
            const isDisabled = isCheckboxDisabled(user);

            return (
              <div key={user.id} className={styles.memberRow}>
                <div className={styles.memberCell}>
                  <div className={styles.memberInfo}>
                    {canManageMembers() && (
                      <input
                        type="checkbox"
                        checked={isEnrolled || isInstructor}
                        disabled={isDisabled}
                        onChange={() =>
                          handleMembershipChange(user.id, isEnrolled)
                        }
                        className={styles.checkbox}
                      />
                    )}
                    <img
                      src={
                        user.profile_image_url ||
                        getDefaultAvatar(user.first_name, user.last_name)
                      }
                      alt={`${user.first_name} ${user.last_name}`}
                      className={styles.avatar}
                    />
                    <div className={styles.nameContainer}>
                      <span className={styles.fullName}>
                        {user.first_name} {user.last_name}
                      </span>
                      <span className={styles.aura}>⭐ {user.aura} aura</span>
                    </div>
                  </div>
                </div>

                <div className={styles.memberCell}>
                  <span className={styles.email}>{user.email}</span>
                </div>

                <div className={styles.memberCell}>
                  <span className={`${styles.roleBadge} ${styles[user.role]}`}>
                    {user.role === "admin"
                      ? "👑 Admin"
                      : user.role === "teacher"
                      ? "👨‍🏫 Profesor"
                      : "👨‍🎓 Estudiante"}
                  </span>
                </div>

                <div className={styles.memberCell}>
                  <span className={styles.specialty}>
                    {user.specialty || "No especificada"}
                  </span>
                </div>

                <div className={styles.memberCell}>
                  <div className={styles.statusContainer}>
                    {isInstructor && (
                      <span
                        className={`${styles.statusBadge} ${styles.instructor}`}
                      >
                        🎓 Instructor
                      </span>
                    )}
                    {isEnrolled && !isInstructor && (
                      <span
                        className={`${styles.statusBadge} ${styles.enrolled}`}
                      >
                        ✅ Inscrito
                      </span>
                    )}
                    {!isEnrolled &&
                      !isInstructor &&
                      user.role === "student" && (
                        <span
                          className={`${styles.statusBadge} ${styles.notEnrolled}`}
                        >
                          ⭕ No inscrito
                        </span>
                      )}
                    {user.role === "admin" && (
                      <span className={`${styles.statusBadge} ${styles.admin}`}>
                        👑 Acceso total
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredUsers.length === 0 && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🔍</div>
            <h3>No se encontraron usuarios</h3>
            <p>Intenta ajustar los términos de búsqueda</p>
          </div>
        )}
      </div>

      <Toast
        isOpen={toast.isOpen}
        message={toast.message}
        type={toast.type}
        onClose={() =>
          setToast({ isOpen: false, message: "", type: "success" })
        }
      />
    </div>
  );
};

export default CourseMembers;
