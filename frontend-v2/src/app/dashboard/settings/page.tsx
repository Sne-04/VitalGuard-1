"use client";

import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Settings as SettingsIcon } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Platform configuration and preferences" />
      <Card>
        <CardContent className="py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary-subtle flex items-center justify-center mx-auto mb-4">
            <SettingsIcon className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-sm font-semibold text-heading mb-1">Settings</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Application settings and configuration options will be available here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
