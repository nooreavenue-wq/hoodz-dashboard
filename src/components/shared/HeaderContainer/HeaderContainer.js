"use client";

import { Button, Skeleton } from "antd";
import { Bell, AlignJustify } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Layout } from "antd";
import { useGetProfileQuery } from "@/redux/api/profileApi";
import { useGetMyNotificationQuery } from "@/redux/api/notificationApi";

const { Header } = Layout;

export default function HeaderContainer({ collapsed, setCollapsed }) {
  const pathname = usePathname();
  const navbarTitle = pathname.replace(/^\/admin(?:\/vendor)?\/?/, "");

  const { data, isLoading } = useGetProfileQuery();
  const profile = data?.data;

  // Unread count for bell badge
  const { data: notifRes } = useGetMyNotificationQuery({
    page: 1,
    limit: 1000,
  });
  const unreadCount = notifRes?.data?.filter((n) => !n.read)?.length || 0;

  const title =
    navbarTitle.length > 1
      ? navbarTitle.replaceAll("/", " ").replaceAll("-", " ")
      : "Dashboard";

  return (
    <Header
      style={{
        backgroundColor: "#FFFFFF",
        height: "80px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        paddingInline: 0,
        paddingRight: "40px",
      }}
    >
      {/* Left — collapse + page title */}
      <div className="flex items-center gap-x-2">
        <Button
          type="text"
          icon={<AlignJustify strokeWidth={3} size={25} />}
          onClick={() => setCollapsed(!collapsed)}
        />
        <h1 className="-mt-3 font-dmSans text-xl font-semibold capitalize">
          {title}
        </h1>
      </div>

      {/* Right — notification + profile */}
      <div className="flex items-center gap-x-5">
        {/* Notification */}
        <Link
          href="/admin/notification"
          className="relative flex !leading-none"
        >
          {unreadCount > 0 && (
            <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
          <Bell className="text-slate-800" size={22} />
        </Link>

        {/* User profile */}
        {isLoading ? (
          <div className="flex items-center gap-x-3">
            <Skeleton.Avatar active size={48} />
            <div className="hidden space-y-1.5 sm:block">
              <Skeleton.Input active size="small" style={{ width: 100 }} />
              <Skeleton.Input active size="small" style={{ width: 70 }} />
            </div>
          </div>
        ) : (
          <Link
            href="/admin/profile"
            className="group flex items-center gap-x-3 text-black transition hover:opacity-90"
          >
            <div className="relative">
              <Image
                src={
                  profile?.profileAvatar ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    profile?.name || "U",
                  )}&size=96&background=1B70A6&color=fff`
                }
                alt={profile?.name || "User"}
                width={48}
                height={48}
                className="aspect-square rounded-full border-2 border-emerald-500 object-cover p-0.5 group-hover:border-[#1B70A6]"
                unoptimized
              />
              {/* Online status dot */}
              <span className="absolute bottom-0.5 right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
            </div>

            <div className="hidden leading-tight sm:block">
              <h4 className="text-base font-semibold text-slate-900 group-hover:text-[#1B70A6]">
                {profile?.name || "User"}
              </h4>
              <p className="text-xs capitalize text-slate-500">
                {profile?.role || "—"}
                {profile?.id ? ` · ${profile.id}` : ""}
              </p>
            </div>
          </Link>
        )}
      </div>
    </Header>
  );
}
