import { SQLiteDatabase } from "expo-sqlite";
import { Message, Student } from "@/constants/types";

export const fetchMessagesFromDB = async (
  database: SQLiteDatabase,
  studentID: string,
  offset: number = 0,
): Promise<Message[]> => {
  const query =
    "SELECT * FROM message WHERE student_number = ? ORDER BY sent_time DESC LIMIT 10 OFFSET ?";
  const result = await database.getAllAsync(query, [studentID, offset]);
  return result.map((row: any) => ({
    id: row.id,
    title: row.title,
    content: row.content,
    priority: row.priority,
    group_name: row.group_name,
    edited_at: row.edited_at,
    images: JSON.parse(row.images),
    sent_time: row.sent_time,
    viewed_at: row.read_time,
    read_status: row.read_status,
  }));
};

export const saveMessagesToDB = async (
  database: SQLiteDatabase,
  messages: Message[],
  activeStudent: string,
  activeStudentID: number,
) => {
  const statement = await database.prepareAsync(
    "INSERT OR REPLACE INTO message (id, student_number, student_id, title, content, priority, group_name, edited_at, images, sent_time, read_status, read_time, sent_status) VALUES ($id, $student_number, $student_id, $title, $content, $priority, $group_name, $edited_at, $images, $sent_time, $read_status, $read_time, $sent_status)",
  );
  try {
    for (const item of messages) {
      await statement.executeAsync({
        $id: item.id,
        $student_number: activeStudent,
        $student_id: activeStudentID,
        $title: item.title,
        $content: item.content,
        $priority: item.priority,
        $group_name: item.group_name,
        $edited_at: item.edited_at,
        $images: JSON.stringify(item.images),
        $sent_time: item.sent_time,
        $read_status: item.viewed_at ? 1 : 0,
        $read_time: item.viewed_at,
        $sent_status: item.viewed_at ? 1 : 0,
      });
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await statement.finalizeAsync();
  }
};

export const fetchStudentsFromDB = async (
  database: SQLiteDatabase,
): Promise<Student[]> => {
  const result = await database.getAllAsync("SELECT * FROM student");
  return result.map((row: any) => ({
    id: row.id,
    student_number: row.student_number,
    family_name: row.family_name,
    given_name: row.given_name,
    phone_number: row.phone_number,
    email: row.email,
  }));
};

export const fetchReadButNotSentMessages = async (
  database: SQLiteDatabase,
  studentID: string,
): Promise<number[]> => {
  const query =
    "SELECT id FROM message WHERE student_number = ? AND read_status = 1 AND sent_status = 0";
  const result = await database.getAllAsync(query, [studentID]);
  return result.map((row: any) => row.id);
};
