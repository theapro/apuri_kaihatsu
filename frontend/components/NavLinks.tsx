import React from "react";
import { IoChatboxOutline } from "react-icons/io5";
import {
  Home,
  LineChart,
  Users,
  BookCheck,
  GraduationCap,
  Contact,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";
import { onlyAdminPathNameRegex } from "@/middleware";
import NavLink from "./NavLink";
import { useTranslations } from "next-intl";
import { User } from "next-auth";

const navLinks = [
  {
    id: 1,
    href: "/dashboard",
    icon: Home,
    nameKey: "Dashboard",
  },
  {
    id: 2,
    href: "/forms",
    icon: BookCheck,
    nameKey: "Forms",
    badge: 0,
  },
  {
    id: 3,
    href: "/permissions",
    icon: Users,
    nameKey: "Permissions",
  },
  {
    id: 4,
    href: "/messages",
    icon: MessageCircle,
    nameKey: "Messages",
  },
  {
    id: 5,
    href: "/students",
    icon: GraduationCap,
    nameKey: "Students",
  },
  {
    id: 6,
    href: "/groups",
    icon: Users,
    nameKey: "Groups",
  },
  {
    id: 7,
    href: "/parents",
    icon: Contact,
    nameKey: "Parents",
  },
  {
    id: 8,
    href: "/admins",
    icon: ShieldCheck,
    nameKey: "Admins",
  },
  {
    id: 9,
    href: "/chatpage",
    icon: IoChatboxOutline,
    nameKey: "Chats",
  },
  /* {
    id: 9,
    href: "#",
    icon: LineChart,
    nameKey: "analytics",
  },*/
];
const NavLinks = ({ user }: { user: User }) => {
  const t = useTranslations("nav");

  return (
    <>
      {navLinks.map((link) => {
        const isAdminPath = onlyAdminPathNameRegex.test(link.href);
        if (isAdminPath && user?.role !== "admin") {
          return null;
        }
        return (
          <NavLink
            key={link.id}
            href={link.href}
            Icon={link.icon}
            name={(link.nameKey)}
            badge={link?.badge}
          />
        );
      })}
    </>
  );
};

export default NavLinks;
