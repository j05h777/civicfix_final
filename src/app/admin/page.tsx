import { getAdminReports } from "@/app/actions";
import {
  AlertCircle,
  ArrowLeft,
  FileText,
  Home,
  Image as ImageIcon,
  MapPin,
  Paintbrush2,
  Shield,
  Tag,
  Trash2,
  TriangleAlert,
  Lightbulb,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { format, formatDistanceToNow } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const categoryDetails: {
  [key: string]: { label: string; icon: React.ElementType; color: string };
} = {
  road_damage: {
    label: "Road Damage",
    icon: TriangleAlert,
    color: "bg-red-500",
  },
  vandalism: {
    label: "Vandalism",
    icon: Paintbrush2,
    color: "bg-orange-500",
  },
  public_safety: {
    label: "Public Safety",
    icon: Shield,
    color: "bg-blue-500",
  },
  garbage: { label: "Garbage & Waste", icon: Trash2, color: "bg-green-500" },
  lighting: {
    label: "Street Lighting",
    icon: Lightbulb,
    color: "bg-yellow-500",
  },
  other: { label: "Other", icon: AlertCircle, color: "bg-gray-500" },
};

export default async function AdminDashboard() {
  const reports = await getAdminReports();

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Button size="icon" variant="outline" className="sm:hidden" asChild>
            <Link href="/">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back to Home</span>
            </Link>
          </Button>
          <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
            Admin Dashboard
          </h1>
          <Badge variant="outline" className="ml-auto sm:ml-0">
            {reports.length} Reports
          </Badge>
          <div className="hidden items-center gap-2 md:ml-auto md:flex">
            <Button variant="outline" size="sm" asChild>
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Home
              </Link>
            </Button>
          </div>
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Community Reports</CardTitle>
              <CardDescription>
                A list of all issues reported by the community.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Location
                    </TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="hidden sm:table-cell">
                      Submitted
                    </TableHead>
                    <TableHead>
                      <span className="sr-only">Image</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.length > 0 ? (
                    reports.map((report) => {
                      const details =
                        categoryDetails[report.category] || categoryDetails.other;
                      const Icon = details.icon;
                      return (
                        <TableRow key={report.id}>
                          <TableCell className="font-mono text-xs">
                            {report.id}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">
                                {details.label}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span>{report.location}</span>
                            </div>
                          </TableCell>
                          <TableCell className="max-w-[250px] truncate">
                            <div className="flex items-start gap-2">
                              <FileText className="h-4 w-4 mt-1 text-muted-foreground" />
                              <p className="truncate">{report.description}</p>
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  {formatDistanceToNow(
                                    new Date(report.submittedAt),
                                    { addSuffix: true }
                                  )}
                                </TooltipTrigger>
                                <TooltipContent>
                                  {format(
                                    new Date(report.submittedAt),
                                    "PPP p"
                                  )}
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </TableCell>
                          <TableCell>
                            {report.image ? (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    aria-label="View image"
                                    size="icon"
                                    variant="outline"
                                  >
                                    <ImageIcon className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-3xl">
                                  <DialogHeader>
                                    <DialogTitle>
                                      Image for Report #{report.id}
                                    </DialogTitle>
                                  </DialogHeader>
                                  <div className="relative mt-4 aspect-video w-full rounded-md overflow-hidden">
                                    <Image
                                      src={report.image}
                                      alt={`Report ${report.id}`}
                                      fill
                                      className="object-contain"
                                    />
                                  </div>
                                </DialogContent>
                              </Dialog>
                            ) : (
                              <div className="w-10 h-10 flex items-center justify-center">
                                <ImageIcon className="h-4 w-4 text-muted-foreground/50" />
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="h-24 text-center"
                      >
                        No reports have been submitted yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}

// Add TooltipProvider and Tooltip components to avoid build errors
// since they are not directly exported from the ui/tooltip file
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
