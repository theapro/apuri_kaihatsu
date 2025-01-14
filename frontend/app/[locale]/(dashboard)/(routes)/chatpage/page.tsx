"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PaginationApi from "@/components/PaginationApi";
import TableApi from "@/components/TableApi";
import { Link } from "@/navigation";
import { File } from "lucide-react";
import useApiQuery from "@/lib/useApiQuery";
import useFileMutation from "@/lib/useFileMutation";
import { ColumnDef } from "@tanstack/react-table";

export default function Dashboard() {
  const t = useTranslations("dashboard");
  const tName = useTranslations("names");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"students" | "parents" | null>(null);
  const [activeChatUser, setActiveChatUser] = useState<any | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const { data: studentData } = useApiQuery(`student/list?page=${page}&name=${search}`, [
    "Students",
    page,
    search,
  ]);
  const { data: parentData } = useApiQuery(`parent/list?page=${page}&name=${search}`, [
    "Parents",
    page,
    search,
  ]);

  const { mutate: exportStudents } = useFileMutation(`student/export`, ["exportStudents"]);
  const { mutate: exportParents } = useFileMutation(`parent/export`, ["exportParents"]);

  const studentColumns: ColumnDef<any>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <Link href={`/students/${row.original.id}`}>
          {tName("name", { ...row?.original })}
        </Link>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <Link href={`/students/${row.original.id}`}>
          {row.getValue("email")}
        </Link>
      ),
    },
    {
      accessorKey: "student_number",
      header: "Student ID",
    },
    {
      header: "Action",
      cell: ({ row }) => (
        <Button onClick={() => setActiveChatUser(row.original)}>Send Message</Button>
      ),
    },
  ];

  const parentColumns: ColumnDef<any>[] = [
    {
      accessorKey: "name",
      header: "Parent Name",
      cell: ({ row }) => (
        <Link href={`/parents/${row.original.id}`}>
          {tName("name", { ...row?.original })}
        </Link>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <Link href={`/parents/${row.original.id}`}>
          {row.getValue("email")}
        </Link>
      ),
    },
    {
      accessorKey: "phone_number",
      header: "Phone Number",
    },
    {
      header: "Action",
      cell: ({ row }) => (
        <Button onClick={() => setActiveChatUser(row.original)}>Send Message</Button>
      ),
    },
  ];

  const renderList = () => {
    const data = activeTab === "students" ? studentData?.students : parentData?.parents;
    const pagination = activeTab === "students" ? studentData?.pagination : parentData?.pagination;
    const columns = activeTab === "students" ? studentColumns : parentColumns;

    return (
      <div className="space-y-4 mt-[-25px] ml-[-20px]">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold capitalize">{activeTab ?? ""}</h1>
        </div>
        <div className="flex items-center justify-between gap-4 mt-4">
          <Input
            placeholder="Search"
            onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="h-10 w-full max-w-sm"
          />
          <div className="flex items-center gap-4">
            <Button
              onClick={() =>
                activeTab === "students" ? exportStudents() : exportParents()
              }
              size="sm"
              variant="outline"
              className="h-10 gap-1 text-sm"
            >
              <File className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only">Export</span>
            </Button>
            <Button variant="outline" onClick={() => setActiveTab(null)} className="h-10">
              Back
            </Button>
          </div>
        </div>
        <Card className="shadow-md rounded-lg p-6 space-y-4">
          <TableApi
            data={data ?? null}
            columns={columns}
            className="table-auto border-separate border-spacing-0 w-full"
            rowClassName="bg-gray-50 border-b border-gray-200 hover:bg-gray-100 transition"
            headerClassName="text-left text-gray-600 font-medium text-sm bg-gray-100 border-b border-gray-200 px-4 py-2"
            cellClassName="text-gray-800 text-sm px-4 py-2"
          />
        </Card>
        <PaginationApi data={pagination ?? null} setPage={setPage} />
      </div>
    );
  };

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      setMessages((prevMessages) => [...prevMessages, newMessage]); // Push the new message to the bottom
      setNewMessage("");

      const messagePayload = {
        recipientId: activeChatUser?.id,
        message: newMessage,
      };

      try {
        // Check if activeChatUser exists
        if (!activeChatUser || !activeChatUser.id) {
          console.error("No active chat user selected");
          return;
        }

        const response = await fetch("/api/messages/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(messagePayload),
        });

        const data = await response.json();

        if (data.message === "Message sent successfully") {
          setMessages((prevMessages) => [...prevMessages, newMessage]); // Add to messages on success
          setNewMessage("");
        } else {
          console.error(data.error || "Failed to send message");
        }
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const renderChatWindow = () => {
    if (!activeChatUser) {
      return <div>No user selected yet</div>;
    }

    return (
      <div className="space-y-4 mt-[-25px] ml-[-20px]">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold capitalize">
            Chat with {activeChatUser?.name || "User not available"}
          </h1>
          <Button
            variant="outline"
            onClick={() => setActiveChatUser(null)}
            className="h-10"
          >
            Back
          </Button>
        </div>
        <div className="space-y-4 mt-4 h-[530px] overflow-y-auto border p-4 rounded-lg flex flex-col">
          {messages.map((message, index) => (
            <div key={index} className="border bg-muted/40 p-2 rounded-lg max-w-[500px] self-end break-words">
              {message}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 mt-4">
          <Input
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="h-10"
          />
          <Button
            onClick={handleSendMessage}
            className="h-10 gap-1 text-sm bg-white text-black"
            variant="outline"
          >
            Send
          </Button>
        </div>
      </div>
    );
  };

  return (
        <div className="w-full p-6">
          {!activeTab && !activeChatUser ? (
            <div className="space-y-4">
              <h1 className="ml-[-20px] mt-[-25px] w-2/4 text-3xl font-bold ">Chats</h1>
              <div className="flex justify-center  ml-[-20px] mt-10 gap-2">
                <Card
                  className="space-x-[-100px] p-5 text-center cursor-pointer hover:shadow-lg transition h-[70px] w-[580px] bg text-black bg-white"
                  onClick={() => setActiveTab("parents")}
                >
                  <h2 className="text-xl font-semibold">Parents</h2>
                </Card>
                <Card
                  className="p-5 text-center cursor-pointer hover:shadow-lg transition h-[70px] w-[580px] text-black bg-white"
                  onClick={() => setActiveTab("students")}
                >
                  <h2 className="text-xl font-semibold">Students</h2>
                </Card>
              </div>
            </div>
          ) : activeChatUser ? (
            renderChatWindow()
          ) : (
            renderList()
          )}
        </div>
  );
}
