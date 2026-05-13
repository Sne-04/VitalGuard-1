"use client";

import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";
import { UserProfile } from "@clerk/nextjs";

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Profile" description="Manage your account and personal information" />
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <UserProfile
            appearance={{
              elements: {
                rootBox: "w-full",
                cardBox: "shadow-none border-none w-full",
                navbar: "hidden",
              },
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
