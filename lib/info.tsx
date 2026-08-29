import { ArrowClockwiseIcon, FunnelIcon, SquaresFourIcon } from "@phosphor-icons/react/dist/ssr";

export interface FeatureProps {
  icon: React.JSX.Element;
  title: string;
  desc: string;
  image?: string;
  features?: string[];
}

export const features: FeatureProps[] = [
  {
    icon: <FunnelIcon className="size-10 text-primary" />,
    title: "Smart sorting and filtering",
    desc: "Find applications by role, company, status, or any other detail in a couple of clicks.",
    image: "/features/filter.jpeg",
    features: ["Position", "Company", "Status", "Date Applied"],
  },
  {
    icon: <ArrowClockwiseIcon className="size-10 text-primary" />,
    title: "One-tap status updates",
    desc: "Move an application from applied to offer without opening a form.",
    image: "/features/status.jpeg",
    features: [
      "Not Applied",
      "Applied",
      "Phone Screen",
      "Offer",
      "Hired",
      "Rejected",
      "Ghosted",
      "Blacklist",
    ],
  },
  {
    icon: <SquaresFourIcon className="size-10 text-primary" />,
    title: "Table or cards, light or dark",
    desc: "Switch between a dense table and cards, in whichever theme you prefer.",
    image: "/features/list.jpeg",
    features: ["Table", "Cards", "Light Mode", "Dark Mode"],
  },
];
