"use client";

import { useTranslations } from "next-intl";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/navigation";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Chart.js konfiguratsiyasi
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type CardData = {
  id: number;
  title: string;
  description: string;
  href: string;
};

type StatsCardData = CardData & {
  count: number;
  growthRate?: string;
  lastUpdated?: string;
  status?: string;
  chartData?: number[];  // Grafik uchun yangi xususiyat
};

const cardData: CardData[] = [
  {
    id: 6,
    title: "Forms",
    description: "click here to view forms",
    href: "/forms/list",
  },
  {
    id: 1,
    title: "Messages",
    description: "click here to view messages",
    href: "/messages",
  },
  {
    id: 2,
    title: "Students",
    description: "click here to view students",
    href: "/students",
  },
  {
    id: 4,
    title: "Groups",
    description: "click here to view groups",
    href: "/groups",
  },
  {
    id: 3,
    title: "Parents",
    description: "click here to view parents",
    href: "/parents",
  },
  {
    id: 5,
    title: "Admins",
    description: "click here to view admins",
    href: "/admins",
  },
];

const statsData: StatsCardData[] = [
  {
    id: 6,
    title: "Forms",
    description: "Here is the statistics",
    href: "/forms/list",
    count: 20,
    growthRate: "+911%",
    lastUpdated: "2024-12-13",
    status: "Completed",
    chartData: [5, 10, 15, 20],  // Grafik uchun ma'lumot
  },
  {
    id: 1,
    title: "Messages",
    description: "Here is the statistics",
    href: "/messages",
    count: 1289,
    growthRate: "+111%",
    lastUpdated: "2024-12-13",
    status: "Completed",
    chartData: [40, 50, 60, 70],  // Grafik uchun ma'lumot
  },
  {
    id: 2,
    title: "Students",
    description: "Here is the statistics",
    href: "/students",
    count: 300,
    growthRate: "+911%",
    lastUpdated: "2024-12-13",
    status: "Completed",
    chartData: [100, 120, 150, 180],  // Grafik uchun ma'lumot
  },
  {
    id: 4,
    title: "Groups",
    description: "Here is the statistics",
    href: "/groups",
    count: 15,
    growthRate: "+81%",
    lastUpdated: "2024-12-13",
    status: "Completed",
    chartData: [10, 15, 20, 25],  // Grafik uchun ma'lumot
  },
  {
    id: 3,
    title: "Parents",
    description: "Here is the statistics",
    href: "/parents",
    count: 200,
    growthRate: "+122%",
    lastUpdated: "2024-12-13",
    status: "Completed",
    chartData: [50, 80, 100, 120],  // Grafik uchun ma'lumot
  },
  {
    id: 5,
    title: "Admins",
    description: "Here is the statistics",
    href: "/admins",
    count: 5,
    growthRate: "+14%",
    lastUpdated: "2024-12-13",
    status: "Completed",
    chartData: [1, 2, 3, 5],  // Grafik uchun ma'lumot
  },
];

export default function DashboardPage() {
  const t = useTranslations("dashboard");

  return (
    <div className="space-y-4 ">
      <div className="flex flex-row">
        <h1 className="text-3xl w-2/4 font-bold">{t("Dashboard")}</h1>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 2xl:grid-cols-6 ">
        {cardData.map((data, index) => (
          <Link key={index} href={data.href} passHref>
            <Card className="w-full h-full hover:border-white/70 duration-300">
              <CardHeader className="p-3">
                <CardTitle className="text-3xl font-medium break-words">
                  {t(data.title)}
                </CardTitle>
              </CardHeader>
              <CardFooter className="px-3">
                <p className="text-xs text-muted-foreground">{t(data.description)}</p>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
      
      {/* Statistic cards with chart */}
  
    </div>
  );
}
