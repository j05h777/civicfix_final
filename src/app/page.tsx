import { ReportForm } from "@/components/civicfix/ReportForm";
import { Vote } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center bg-background py-8 px-4 sm:py-12">
      <div className="w-full max-w-2xl space-y-8">
        <header className="text-center">
          <div className="mx-auto inline-flex items-center justify-center rounded-lg bg-primary p-3 mb-4 shadow-md">
            <Vote className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-primary font-headline sm:text-5xl">
            CivicFix
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Spotted an issue in your community? Report it here and help make our
            city a better place.
          </p>
        </header>

        <ReportForm />

        <footer className="pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} CivicFix. A community initiative.</p>
        </footer>
      </div>
    </main>
  );
}
