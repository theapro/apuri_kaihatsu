"use client";

import { useTranslations } from "next-intl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EllipsisVertical, File } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import Student from "@/types/student";
import StudentApi from "@/types/studentApi";
import PaginationApi from "@/components/PaginationApi";
import { Input } from "@/components/ui/input";
import { Link, usePathname, useRouter } from "@/navigation";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import TableApi from "@/components/TableApi";
import { useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import useApiQuery from "@/lib/useApiQuery";
import useApiMutation from "@/lib/useApiMutation";
import useFileMutation from "@/lib/useFileMutation";

export default function Students() {
  const t = useTranslations("students");
  const tName = useTranslations("names");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState<string>("unsorted"); // Default sort option is "unsorted"
  const router = useRouter();
  const pathname = usePathname();
  const { data: studentData } = useApiQuery<StudentApi>(
    `student/list?page=${page}&name=${search}`,
    ["students", page, search]
  );
  const queryClient = useQueryClient();
  const [studentId, setStudentId] = useState<number | null>(null);
  const { mutate } = useApiMutation<{ message: string }>(
    `student/${studentId}`,
    "DELETE",
    ["deleteStudent"],
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["students"] });
        toast({
          title: t("studentDeleted"),
          description: data.message,
        });
      },
    }
  );
  const { mutate: exportStudents } = useFileMutation<{ message: string }>(
    `student/export`,
    ["exportStudents"]
  );

  const columns: ColumnDef<Student>[] = [
    {
      accessorKey: "given_name", // Change name to given_name
      header: ("Name"), // Updated label for given_name
      cell: ({ row }) => (
        <Link href={`students/${row.original.id}`}>
          {tName("name", { ...row?.original })} {/* Removed parents field */}
        </Link>
      ),
    },
    {
      accessorKey: "email",
      header: t("email"),
      cell: ({ row }) => (
        <Link href={`students/${row.original.id}`}>
          {row.getValue("email")}
        </Link>
      ),
    },
    {
      accessorKey: "student_number",
      header: t("studentId"),
      cell: ({ row }) => (
        <Link href={`students/${row.original.id}`}>
          {row.getValue("student_number")}
        </Link>
      ),
    },
    {
      accessorKey: "phone_number",
      header: t("phoneNumber"),
      cell: ({ row }) => (
        <Link href={`students/${row.original.id}`}>
          {row.getValue("phone_number")}
        </Link>
      ),
    },

    {
      header: t("action"),
      cell: ({ row }) => (
        <Dialog>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger>
              <EllipsisVertical />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() => router.push(`${pathname}/${row.original.id}`)}
              >
                {t("view")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  router.push(`${pathname}/edit/${row.original.id}`)
                }
              >
                {t("edit")}
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <DialogTrigger className="w-full">{t("delete")}</DialogTrigger>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {tName("name", { ...row?.original })} {/* Removed parents field */}
              </DialogTitle>
              <DialogDescription>{row.original.email}</DialogDescription>
            </DialogHeader>
            <div>{t("DouYouDeleteStudent")}</div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant={"secondary"}>{t("cancel")}</Button>
              </DialogClose>
              <Button
                onClick={() => {
                  setStudentId(row.original.id);
                  mutate();
                }}
              >
                {t("confirm")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ),
    },
  ];

  const [sortedStudents, setSortedStudents] = useState<Student[]>([]);

  useEffect(() => {
    if (studentData?.students?.length) {
      let sorted = [...studentData.students];

      if (sortOption === "name") {
        sorted.sort((a, b) => {
          const nameA = a.given_name?.trim() || ""; // Use given_name
          const nameB = b.given_name?.trim() || ""; // Use given_name

          // Handle empty names properly
          if (nameA === "" && nameB === "") return 0;
          if (nameA === "") return 1;
          if (nameB === "") return -1;

          return nameA.localeCompare(nameB);
        });
      } else if (sortOption === "id") {
        sorted.sort((a, b) => (a.id || 0) - (b.id || 0));
      }

      setSortedStudents(sorted);
    } else {
      setSortedStudents([]);
    }
  }, [studentData, sortOption]);

  return (
    <div className="space-y-4">
      <div className="w-full flex justify-between">
        <h1 className="text-3xl w-2/4 font-bold">{t("students")}</h1>
      </div>

      <div className="flex justify-between items-center space-x-4 ">
        <Input
          placeholder={t("filter")}
          onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="max-w-xs h-10"
        />
        <div className="flex space-x-2">
          <select
            onChange={(e) => setSortOption(e.target.value)}
            value={sortOption}
            className="h-10 text-sm border rounded-md px-3"
          >
            <option value="unsorted">{("Unsorted")}</option>
            <option value="name">{("Sort by name")}</option>
            <option value="id">{("Sort by ID")}</option>
          </select>
          <Button
            onClick={() => exportStudents()}
            size="sm"
            variant="outline"
            className="h-10 gap-1 text-sm"
          >
            <File className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only">Export</span>
          </Button>
          <Link href={`${pathname}/create`}>
            <Button className="h-10">{t("createstudent")}</Button>
          </Link>
        </div>
      </div>

      <div className="space-y-2 align-left">
        <Card x-chunk="dashboard-05-chunk-3">
          <TableApi data={sortedStudents} columns={columns} />
        </Card>
        <div>
          <PaginationApi
            data={studentData?.pagination ?? null}
            setPage={setPage}
          />
        </div>
      </div>
    </div>
  );
}
