"use client";
import { useTranslations } from "next-intl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/card";
import { EllipsisVertical, File } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import PaginationApi from "@/components/PaginationApi";
import { Input } from "@/components/ui/input";
import { Link, usePathname, useRouter } from "@/navigation";
import { Button } from "@/components/ui/button";
import ParentApi from "@/types/parentApi";
import Parent from "@/types/parent";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import TableApi from "@/components/TableApi";
import { useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import useApiQuery from "@/lib/useApiQuery";
import useApiMutation from "@/lib/useApiMutation";
import useFileMutation from "@/lib/useFileMutation";

export default function Info() {
  const t = useTranslations("parents");
  const tName = useTranslations("names");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState<string>("unsorted"); // Default sort option is "unsorted"
  
  const { data } = useApiQuery<ParentApi>(
    `parent/list?page=${page}&name=${search}`,
    ["parents", page, search]
  );

  const pathName = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [parentId, setParentId] = useState<number | null>(null);
  
  const { mutate } = useApiMutation<{ message: string }>(
    `parent/${parentId}`,
    "DELETE",
    ["deleteParent"],
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["parents"] });
        toast({
          title: t("parentDeleted"),
          description: data?.message,
        });
      },
    }
  );

  const { mutate: exportParents } = useFileMutation<{ message: string }>(
    `parent/export`,
    ["exportParents"]
  );

  const parentColumns: ColumnDef<Parent>[] = [
    {
      accessorKey: "given_name", // Updated to 'given_name'
      header: ("Name"),
      cell: ({ row }) => (
        <Link href={`/parents/${row.original.id}`}>
          {tName("name", { ...row?.original })}
        </Link>
      ),
    },
    {
      accessorKey: "email",
      header: t("Email"),
      cell: ({ row }) => (
        <Link href={`/parents/${row.original.id}`}>
          {row.getValue("email")}
        </Link>
      ),
    },
    {
      accessorKey: "phone_number",
      header: t("Phone_number"),
      cell: ({ row }) => (
        <Link href={`/parents/${row.original.id}`}>
          {row.getValue("phone_number")}
        </Link>
      ),
    },
    {
      header: t("action"),
      cell: ({ row }) => (
        <Dialog key={row.original.id}>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger>
              <EllipsisVertical />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() => {
                  router.push(`${pathName}/${row.original.id}`);
                }}
              >
                {t("view")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  router.push(`${pathName}/edit/${row.original.id}`)
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
              <DialogTitle>{tName("name", { ...row?.original })}</DialogTitle>
              <DialogDescription>{row.original.email}</DialogDescription>
            </DialogHeader>
            <div className="flex">{t("doYouDeleteParent")}</div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant={"secondary"}>{t("close")}</Button>
              </DialogClose>
              <Button
                onClick={() => {
                  setParentId(row.original.id);
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

  const [sortedParents, setSortedParents] = useState<Parent[]>([]);

  useEffect(() => {
    if (data?.parents?.length) {
      let sorted = [...data.parents];

      if (sortOption === "name") {
        sorted.sort((a, b) => {
          const givenNameA = a.given_name?.trim() || ""; // Use given_name
          const givenNameB = b.given_name?.trim() || ""; // Use given_name

          // Handle empty names properly
          if (givenNameA === "" && givenNameB === "") return 0;
          if (givenNameA === "") return 1;
          if (givenNameB === "") return -1;

          return givenNameA.localeCompare(givenNameB);
        });
      } else if (sortOption === "email") { 
        sorted.sort((a, b) => {
          const emailA = a.email?.trim() || ""; // Sort by email
          const emailB = b.email?.trim() || ""; // Sort by email

          // Handle empty emails properly
          if (emailA === "" && emailB === "") return 0;
          if (emailA === "") return 1;
          if (emailB === "") return -1;

          return emailA.localeCompare(emailB);
        });
      }

      setSortedParents(sorted);
    } else {
      setSortedParents([]);
    }
  }, [data, sortOption]);

  return (
    <div className="w-full">
      <div className="space-y-4">
        <div className="w-full flex justify-between">
          <h1 className="text-3xl w-2/4 font-bold">{t("parents")}</h1>
        </div>

        <div className="flex justify-between items-center w-full space-x-4">
          <div className="flex items-center">
            <Input
              placeholder={t("filter")}
              onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="max-w-sm h-10"
            />
          </div>

          <div className="flex items-center space-x-2">
            <select
              onChange={(e) => setSortOption(e.target.value)}
              value={sortOption}
              className="h-10 text-sm border rounded-md px-3"
            >
              <option value="unsorted">{("Unsorted")}</option>
              <option value="name">{("Sort by name")}</option>
              <option value="email">{("Sort by email")}</option> {/* Sort by email */}
            </select>
            <Button
              onClick={() => exportParents()}
              size="sm"
              variant="outline"
              className="h-10 gap-1 text-sm"
            >
              <File className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only">Export</span>
            </Button>
            <Link href={`${pathName}/create`}>
              <Button className="h-10">{t("createparent")}</Button>
            </Link>
          </div>
        </div>

        <Card x-chunk="dashboard-05-chunk-3">
          <TableApi data={sortedParents} columns={parentColumns} />
        </Card>
        <div>
          <PaginationApi data={data?.pagination ?? null} setPage={setPage} />
        </div>
      </div>
    </div>
  );
}
