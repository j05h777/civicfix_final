"use server";

import { redirect } from "next/navigation";

export async function submitReport(formData: FormData) {
  // In a real app, you would validate form data with Zod,
  // process the image upload to a storage service,
  // and save the report details to a database.

  // Simulate network/database latency
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Generate a unique (but simple) report ID
  const reportId = crypto.randomUUID().split("-")[0].toUpperCase();

  // Redirect to the confirmation page
  redirect(`/report/${reportId}`);
}
