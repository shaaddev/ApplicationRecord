export interface JobProps {
  id?: string;
  role: string;
  company_name: string;
  location: string;
  status: string;
  date_applied?: Date;
  link?: string;
  salary?: number;
  rate?: string;
  user_id?: string;
  created_at?: Date;
  updated_at?: Date;
}

export const mock_data: JobProps[] = [
  {
    id: "1",
    role: "Software Development Engineer",
    company_name: "Amazon",
    location: "NYC",
    status: "Applied",
    date_applied: new Date("2022-01-01"),
  },
  {
    id: "2",
    role: "Product Manager",
    company_name: "Google",
    location: "NYC",
    status: "Ghosted",
    date_applied: new Date("2022-01-01"),
  },
  {
    id: "3",
    role: "Data Scientist",
    company_name: "Meta",
    location: "Seattle",
    status: "Rejected",
    date_applied: new Date("2022-01-01"),
  },
];

export interface FeatureProps {
  icon: JSX.Element;
  title: string;
  desc: string;
}
import { ArrowDownWideNarrow, RefreshCcw, Grid2X2 } from "lucide-react";

export const features: FeatureProps[] = [
  {
    icon: <ArrowDownWideNarrow className="h-10 w-10 text-primary" />,
    title: "Smart Sorting & Filtering",
    desc: "Quickly find and organizes applications by role, company, status, or any other key details",
  },
  {
    icon: <RefreshCcw className="h-10 w-10 text-primary" />,
    title: "One-Tap Status Updates",
    desc: "Seamlessly update your application progress with just a tap to keep your job search organized",
  },
  {
    icon: <Grid2X2 className="h-10 w-10 text-primary" />,
    title: "Personalized Views & Modes",
    desc: "Switch between grid or list views, light or dark mode, to match your unique style",
  },
];
