"use client";

import { Card, Avatar, Tag } from "antd";
import { UserOutlined } from "@ant-design/icons";

export default function RecentJoinedUsers({ users }) {
  return (
    <Card
      title="Recent Joined Users"
      className="h-full border-0 shadow-xl"
      extra={
        <span className="text-sm text-emerald-600">{users.length} users</span>
      }
    >
      <div className="space-y-4">
        {users.slice(0, 6).map((user) => (
          <div
            key={user._id}
            className="flex items-center gap-4 rounded-xl p-3 transition-colors hover:bg-slate-50"
          >
            <Avatar
              src={user.profileAvatar || undefined}
              icon={!user.profileAvatar ? <UserOutlined /> : undefined}
              size={48}
            />
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-slate-800">
                {user.name}
              </p>
              <p className="truncate text-sm text-slate-500">{user.email}</p>
            </div>
            <Tag color="blue">User</Tag>
          </div>
        ))}
      </div>
    </Card>
  );
}
