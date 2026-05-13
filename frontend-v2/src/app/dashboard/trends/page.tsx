"use client";

import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, TrendingUp } from "lucide-react";

export default function TrendsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Community Trends" description="Population health patterns and regional insights" />
      <Card>
        <CardContent className="py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary-subtle flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-sm font-semibold text-heading mb-1">Community Trends</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Regional health trends and community-level analytics are being compiled. This feature will be available soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
