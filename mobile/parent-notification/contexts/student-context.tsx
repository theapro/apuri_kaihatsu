import React from "react";
import { Student } from "@/constants/types";
import { useSession } from "@/contexts/auth-context";
import { useSQLiteContext } from "expo-sqlite";
import { useNetwork } from "./network-context";
import { useQuery } from "@tanstack/react-query";
import { fetchStudentsFromDB } from "@/utils/queries";

const StudentContext = React.createContext<{ students: Student[] | null }>({
  students: [],
});

export function useStudents() {
  const value = React.useContext(StudentContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useStudent must be wrapped in a <StudentProvider />");
    }
  }

  return value;
}

export function StudentProvider(props: React.PropsWithChildren) {
  const { signOut, refreshToken, session } = useSession();
  const { isOnline } = useNetwork();
  const [students, setStudents] = React.useState<Student[] | null>(null);
  const db = useSQLiteContext();
  const apiUrl = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";
  const { data: apiStudents } = useQuery({
    queryKey: ["students"],
    queryFn: async () => {
      const res = await fetch(`${apiUrl}/students`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session}`,
        },
      });
      if (res.status === 401) {
        refreshToken();
        return [];
      } else if (res.status === 403) {
        signOut();
        return [];
      }
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message);
      }
      return await res.json();
    },
    enabled: !!session && !!isOnline,
  });

  React.useEffect(() => {
    if (apiStudents && Array.isArray(apiStudents)) {
      const saveStudentsToDB = async () => {
        const statement = await db.prepareAsync(
          "INSERT OR REPLACE INTO student (id, student_number, family_name, given_name, phone_number, email) VALUES ($id, $student_number, $family_name, $given_name, $phone_number, $email)",
        );
        try {
          for (const student of apiStudents) {
            await statement.executeAsync({
              $id: student.id,
              $student_number: student.student_number,
              $family_name: student.family_name,
              $given_name: student.given_name,
              $phone_number: student.phone_number,
              $email: student.email,
            });
          }
        } catch (error) {
          console.error("Error:", error);
        } finally {
          await statement.finalizeAsync();
        }
        setStudents(apiStudents);
      };

      saveStudentsToDB();
    }
  }, [apiStudents]);

  React.useEffect(() => {
    if (!isOnline) {
      fetchStudentsFromDB(db).then(setStudents).catch(console.error);
    }
  }, [isOnline]);

  return (
    <StudentContext.Provider
      value={{
        students,
      }}
    >
      {props.children}
    </StudentContext.Provider>
  );
}
