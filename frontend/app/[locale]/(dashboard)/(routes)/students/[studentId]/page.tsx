"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Student from "@/types/student";
import Parent from "@/types/parent";
import { Link } from "@/navigation";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import Group from "@/types/group";
import TableApi from "@/components/TableApi";
import DisplayProperty from "@/components/DisplayProperty";
import NotFound from "@/components/NotFound";
import useApiQuery from "@/lib/useApiQuery";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { saveAs } from "file-saver"; // Import file-saver for CSV export

export default function ThisStudent({
  params: { studentId },
}: {
  params: { studentId: string };
}) {
  const t = useTranslations("ThisStudent");
  const tName = useTranslations("names");
  const { data: studentData, isError } = useApiQuery<{
    student: Student;
    parents: Parent[];
    groups: Group[];
  }>(`student/${studentId}`, ["student", studentId]);

  if (isError) return <NotFound />;

  const parentColumns: ColumnDef<Parent>[] = [
    {
      accessorKey: "name",
      header: t("parentName"),
      cell: ({ row }) => <div>{tName("name", { ...row?.original })}</div>,
    },
    {
      accessorKey: "email",
      header: t("Email"),
      cell: ({ row }) => <div>{row.getValue("email")}</div>,
    },
    {
      accessorKey: "phone_number",
      header: t("Phone_number"),
      cell: ({ row }) => <div>{row.getValue("phone_number")}</div>,
    },
  ];

  const groupColumns: ColumnDef<Group>[] = [
    {
      accessorKey: "name",
      header: t("groupName"),
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
  ];

  // PDF eksport funksiyasi
  const handleExportPDF = () => {
    if (!studentData) return;

    const doc = new jsPDF();
    doc.setFont("helvetica", "normal");
    doc.setFontSize(16);
    doc.text(("Student Info"), 15, 15);


    doc.setFontSize(12);
    doc.text(`${t("givenName")}: ${studentData.student.given_name}`, 15, 25);
    doc.text(`${t("familyName")}: ${studentData.student.family_name}`, 15, 35);
    doc.text(`${t("studentNumber")}: ${studentData.student.student_number}`, 15, 45);
    doc.text(`${t("email")}: ${studentData.student.email}`, 15, 55);
    doc.text(`${t("phone")}: ${studentData.student.phone_number}`, 15, 65);

   
    doc.line(10, 70, 200, 70);

   
    doc.setFontSize(14);
    doc.text(t("parents"), 15, 80);
    const parentRows = studentData.parents.map((parent) => [
      parent.name, parent.email, parent.phone_number,
    ]);
    doc.autoTable({
      startY: 85,
      head: [[t("parentName"), t("Email"), t("Phone_number")]],
      body: parentRows,
      styles: { cellPadding: 2, fontSize: 10 },
    });


    doc.line(10, doc.autoTable.previous.finalY + 10, 200, doc.autoTable.previous.finalY + 10);

 
    doc.setFontSize(14);
    doc.text(t("groups"), 15, doc.autoTable.previous.finalY + 15);
    const groupRows = studentData.groups.map((group) => [group.name]);
    doc.autoTable({
      startY: doc.autoTable.previous.finalY + 20,
      head: [[t("groupName")]],
      body: groupRows,
      styles: { cellPadding: 2, fontSize: 10 },
    });

   
    doc.save("student_data.pdf");
  };


  const handleExportCSV = () => {
    if (!studentData) return;

    const headers = [
      t("givenName"),
      t("familyName"),
      t("studentNumber"),
      t("email"),
      t("phone"),
      t("parentName"),
      t("parentEmail"),
      t("parentPhone"),
      t("groupName"),
    ];

    const rows = studentData.parents.map((parent) => [
      studentData.student.given_name,
      studentData.student.family_name,
      studentData.student.student_number,
      studentData.student.email,
      studentData.student.phone_number,
      parent.name,
      parent.email,
      parent.phone_number,
      studentData.groups.map((group) => group.name).join(", "), 
    ]);

    // CSV kontentini tayyorlash
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "student_data.csv");
  };

  return (
    <div className="space-y-4">
      <div className="w-full flex justify-between">
        <h1 className="text-3xl w-2/4 font-bold">{t("posts")}</h1>
        <div className="space-x-2 flex items-center">
          {/* Export tugmalari */}
          <Button variant={"secondary"} onClick={handleExportPDF}>
            {("Export PDF")}
          </Button>
          <Button variant={"secondary"} onClick={handleExportCSV}>
            {("Export CSV")}
          </Button>
          <Link href={`/students/`}>
            <Button variant={"secondary"}>{t("back")}</Button>
          </Link>
        </div>
      </div>
      <Card className="space-y-4">
        <CardHeader>
          <DisplayProperty
            property={t("givenName")}
            value={studentData?.student.given_name}
          />
          <DisplayProperty
            property={t("familyName")}
            value={studentData?.student.family_name}
          />
          <DisplayProperty
            property={t("studentNumber")}
            value={studentData?.student.student_number}
          />
          <DisplayProperty
            property={t("email")}
            value={studentData?.student.email}
          />
          <DisplayProperty
            property={t("phone")}
            value={studentData?.student.phone_number}
          />
        </CardHeader>
        <Separator />
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <h2 className="text-2xl w-2/4 font-bold">{t("parents")}</h2>
            <Link href={`/students/${studentId}/parents`}>
              <Button>{t("editParents")}</Button>
            </Link>
          </div>
          <div className="rounded-md border">
            <TableApi
              data={studentData?.parents ?? null}
              columns={parentColumns}
            />
          </div>
          <Separator />
          {/* Guruhlar bo'limi uchun bo'sh joy qo'shish */}
          <h2 className="text-2xl w-2/4 font-bold mt-6">{t("groups")}</h2>
          <div className="rounded-md border">
            <TableApi
              data={studentData?.groups ?? null}
              columns={groupColumns}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
