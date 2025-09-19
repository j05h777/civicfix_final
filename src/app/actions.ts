'use server';

import {redirect} from 'next/navigation';
import fs from 'node:fs/promises';
import path from 'node:path';

type Report = {
  id: string;
  location: string;
  category: string;
  description: string;
  image?: string;
  submittedAt: string;
};

// In a real app, this would be a database.
const DB_PATH = path.resolve(process.cwd(), 'src/lib/reports.json');

async function readDb(): Promise<Report[]> {
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    if (!data) {
      return [];
    }
    return JSON.parse(data);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      // If the file doesn't exist, create it with an empty array.
      await writeDb([]);
      return [];
    }
    throw error;
  }
}

async function writeDb(reports: Report[]) {
  await fs.writeFile(DB_PATH, JSON.stringify(reports, null, 2));
}

async function getReports(): Promise<Report[]> {
  return await readDb();
}

async function addReport(reportData: Omit<Report, 'id' | 'submittedAt'>) {
  const reports = await readDb();
  const reportId = crypto.randomUUID().split('-')[0].toUpperCase();
  const newReport: Report = {
    ...reportData,
    id: reportId,
    submittedAt: new Date().toISOString(),
  };
  reports.unshift(newReport); // Add new reports to the beginning
  await writeDb(reports);
  return newReport;
}

export async function submitReport(formData: FormData) {
  const location = formData.get('location') as string;
  const category = formData.get('category') as string;
  const description = formData.get('description') as string;
  const imageFile = formData.get('image') as File | null;

  let image;
  if (imageFile && imageFile.size > 0) {
    const buffer = Buffer.from(await imageFile.arrayBuffer());
    image = `data:${imageFile.type};base64,${buffer.toString('base64')}`;
  }

  const report = await addReport({location, category, description, image});

  redirect(`/report/${report.id}`);
}

export async function getAdminReports() {
  const reports = await getReports();
  return reports;
}
