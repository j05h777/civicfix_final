import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ReportConfirmationPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg text-center shadow-lg animate-in fade-in-50 zoom-in-95">
        <CardHeader>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="mt-4 text-3xl font-bold text-primary">
            Report Submitted!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 px-8 pb-8">
          <p className="text-muted-foreground">
            Thank you for helping improve our community. Your report has been
            received and is now in our queue.
          </p>
          <div className="rounded-lg bg-secondary p-4">
            <p className="text-sm text-muted-foreground">
              Your tracking ID is:
            </p>
            <p className="text-3xl font-bold font-mono tracking-widest text-primary">
              {params.id}
            </p>
          </div>
          <p className="text-xs text-muted-foreground pt-2">
            You can use this ID to track the status of your report in the future
            (tracking feature coming soon).
          </p>
          <Button asChild className="mt-6 w-full max-w-xs">
            <Link href="/">Submit Another Report</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
