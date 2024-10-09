interface Message {
  id: number;
  title: string;
  content: string;
  priority: "high" | "medium" | "low";
  group_name: string | null;
  edited_at: string;
  images: string[] | null;
  sent_time: string;
  viewed_at: string | null;
  read_status: 0 | 1;
}

interface DatabaseMessage {
  id: number;
  student_number: string;
  student_id: number;
  title: string;
  content: string;
  priority: "high" | "medium" | "low";
  group_name: string;
  edited_at: string;
  images: string;
  sent_time: string;
  read_status: 0 | 1;
  read_time: string;
  sent_status: 0 | 1;
}

interface Student {
  id: number;
  family_name: string;
  given_name: string;
  student_number: string;
  email: string;
  phone_number: string;
}

interface MessageResponse {
  id: number;
  title: string;
  content: string;
  priority: "high" | "medium" | "low";
  viewed_at: string;
  group_name: string;
  image: string[];
  sent_time: Date | number;
}

interface MessageRequestBody {
  student_id: number;
  last_post_id: number;
}

interface Session {
  access_token: string;
  refresh_token: string;
  user: {
    email: string;
    phone_number: string;
    given_name: string;
    family_name: string;
  };
  school_name?: string;
}

interface User {
  id: number;
  given_name: string;
  family_name: string;
  phone_number: string;
  email: string;
}

export {
  Message,
  Student,
  MessageResponse,
  MessageRequestBody,
  Session,
  User,
  DatabaseMessage,
};
