"use client";

import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Saved Reports" description="Exported diagnostic reports and PDF summaries" />
      <Card>
        <CardContent className="py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary-subtle flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-sm font-semibold text-heading mb-1">No saved reports yet</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            After completing analyses, you can export and save PDF reports here for future reference.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
