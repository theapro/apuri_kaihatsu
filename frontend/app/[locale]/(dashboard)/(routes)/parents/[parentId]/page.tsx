"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Parent from "@/types/parent";
import Student from "@/types/student";
import { Link } from "@/navigation";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { FormatDateTime } from "@/lib/utils";
import TableApi from "@/components/TableApi";
import DisplayProperty from "@/components/DisplayProperty";
import NotFound from "@/components/NotFound";
import useApiQuery from "@/lib/useApiQuery";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { saveAs } from "file-saver"; // Import file-saver for CSV export

export default function ThisParent({
  params: { parentId },
}: {
  params: { parentId: string };
}) {
  const t = useTranslations("ThisParent");
  const tName = useTranslations("names");
  const { data: parentData, isError } = useApiQuery<{
    parent: Parent;
    students: Student[];
  }>(`parent/${parentId}`, ["parent", parentId]);

  const studentColumns: ColumnDef<Student>[] = [
    {
      accessorKey: "name",
      header: t("name"),
      cell: ({ row }) => (
        <div>{tName("name", { ...row?.original, parents: "" })}</div>
      ),
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
    {
      accessorKey: "student_number",
      header: t("Ststudent_number"),
      cell: ({ row }) => <div>{row.getValue("student_number")}</div>,
    },
  ];

  const dateValue = FormatDateTime(parentData?.parent.created_at ?? "");

  const handleExportPDF = () => {
    if (!parentData) return;

    const doc = new jsPDF();

    // Sahifa sozlamalari (cheklarni sozlash uchun)
    doc.setFont("helvetica", "normal");
    doc.setFontSize(16);

    // Hujjat sarlavhasi
    doc.text(t("ParentView"), 15, 15);

    // Ota-onaning ma'lumotlari
    doc.setFontSize(12);
    doc.text(`${t("parentGivenName")}: ${parentData.parent.given_name}`, 15, 25);
    doc.text(`${t("parentFamilyName")}: ${parentData.parent.family_name}`, 15, 35);
    doc.text(`${t("parentEmail")}: ${parentData.parent.email}`, 15, 45);
    doc.text(`${t("parentPhoneNumber")}: ${parentData.parent.phone_number}`, 15, 55);
    doc.text(`${t("parentCreationDate")}: ${dateValue}`, 15, 65);

    // Separator
    doc.line(10, 70, 200, 70);

    // Talabalar bo'limi
    doc.setFontSize(14);
    doc.text(t("students"), 15, 80);

    // Talabalar jadvali
    const studentRows = parentData.students.map((student) => [
      student.name,
      student.email,
      student.phone_number,
      student.student_number,
    ]);

    doc.autoTable({
      startY: 85,
      head: [[t("name"), t("Email"), t("Phone_number"), t("Ststudent_number")]],
      body: studentRows,
      styles: {
        cellPadding: 2,
        fontSize: 10,
        lineWidth: 0.5,
        lineColor: [0, 0, 0], // Chiziqlar rangi
      },
    });

    // PDF-ni saqlash
    doc.save("parent_data.pdf");
  };

  // Handle CSV Export
  const handleExportCSV = () => {
    if (!parentData) return;

    const headers = [
      t("parentGivenName"),
      t("parentFamilyName"),
      t("parentEmail"),
      t("parentPhoneNumber"),
      t("parentCreationDate"),
      t("name"),
      t("Email"),
      t("Phone_number"),
      t("Ststudent_number"),
    ];

    const studentRows = parentData.students.map((student) => [
      parentData.parent.given_name,
      parentData.parent.family_name,
      parentData.parent.email,
      parentData.parent.phone_number,
      dateValue,
      student.name,
      student.email,
      student.phone_number,
      student.student_number,
    ]);

    // Flatten the data for CSV export
    const csvContent = [
      headers.join(","), // Header row
      ...studentRows.map((row) => row.join(",")), // Student data rows
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "parent_data.csv");
  };

  if (isError) return <NotFound />;

  return (
    <div className="space-y-4">
      <div className="w-full flex justify-between">
        <h1 className="text-3xl w-2/4 font-bold">{t("ParentView")}</h1>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={handleExportPDF}>
            {("Export PDF")}
          </Button>
          <Button variant="secondary" onClick={handleExportCSV}>
            {("Export CSV")}
          </Button>
          <Link href={`/parents`}>
            <Button variant={"secondary"}>{t("back")}</Button>
          </Link>
          <Link href={`/parents/edit/${parentId}`}>
            <Button>{t("editParent")}</Button>
          </Link>
        </div>
      </div>
      <Card className="space-y-4">
        <CardHeader>
          <DisplayProperty
            property={t("parentGivenName")}
            value={parentData?.parent.given_name}
          />
          <DisplayProperty
            property={t("parentFamilyName")}
            value={parentData?.parent.family_name}
          />
          <DisplayProperty
            property={t("parentEmail")}
            value={parentData?.parent.email}
          />
          <DisplayProperty
            property={t("parentPhoneNumber")}
            value={parentData?.parent.phone_number}
          />
          <DisplayProperty
            property={t("parentCreationDate")}
            value={dateValue}
          />
        </CardHeader>
        <Separator />
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl w-2/4 font-bold">{t("students")}</h2>
            <Link href={`/parents/${parentId}/students`}>
              <Button>{t("editStudents")}</Button>
            </Link>
          </div>
          <div className="rounded-md border">
            <TableApi
              data={parentData?.students ?? null}
              columns={studentColumns}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
