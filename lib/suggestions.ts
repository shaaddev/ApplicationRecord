import type { Application } from "@/lib/applications";

/** Starter values shown before a user has any history of their own. */
export const ROLE_SUGGESTIONS = [
  "Software Engineer",
  "Senior Software Engineer",
  "Staff Software Engineer",
  "Frontend Engineer",
  "Backend Engineer",
  "Full Stack Engineer",
  "Mobile Engineer",
  "iOS Engineer",
  "Android Engineer",
  "DevOps Engineer",
  "Site Reliability Engineer",
  "Platform Engineer",
  "Security Engineer",
  "QA Engineer",
  "Data Engineer",
  "Data Scientist",
  "Data Analyst",
  "Machine Learning Engineer",
  "AI Engineer",
  "Engineering Manager",
  "Product Manager",
  "Project Manager",
  "Product Designer",
  "UX Designer",
  "UI Designer",
  "Technical Writer",
  "Solutions Engineer",
  "Sales Engineer",
  "Customer Success Manager",
  "Business Analyst",
  "Software Engineering Intern",
  "Junior Software Engineer",
] as const;

export const LOCATION_SUGGESTIONS = [
  "Remote",
  "Hybrid",
  "Remote (US)",
  "New York, NY",
  "San Francisco, CA",
  "San Jose, CA",
  "Los Angeles, CA",
  "San Diego, CA",
  "Seattle, WA",
  "Austin, TX",
  "Dallas, TX",
  "Houston, TX",
  "Chicago, IL",
  "Boston, MA",
  "Denver, CO",
  "Atlanta, GA",
  "Miami, FL",
  "Washington, DC",
  "Philadelphia, PA",
  "Phoenix, AZ",
  "Portland, OR",
  "Salt Lake City, UT",
  "Raleigh, NC",
  "Charlotte, NC",
  "Minneapolis, MN",
  "Detroit, MI",
  "Toronto, ON",
  "Vancouver, BC",
  "London, UK",
  "Berlin, Germany",
  "Amsterdam, Netherlands",
  "Dublin, Ireland",
  "Bangalore, India",
  "Singapore",
  "Sydney, Australia",
] as const;

export type Suggestions = {
  roles: string[];
  companies: string[];
  locations: string[];
};

export const DEFAULT_SUGGESTIONS: Suggestions = {
  roles: [...ROLE_SUGGESTIONS],
  companies: [],
  locations: [...LOCATION_SUGGESTIONS],
};

/**
 * Dedupes case-insensitively and keeps the first spelling seen, so values
 * the user already typed win over the starter list.
 */
function unique(values: readonly string[]) {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of values) {
    const value = raw.trim();
    if (!value) continue;
    const key = value.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(value);
  }
  return out;
}

/**
 * Builds the suggestion lists for the application form. `applications` is
 * expected newest first, so the user's most recent entries sort to the top,
 * followed by the starter values.
 */
export function buildSuggestions(applications: readonly Application[]): Suggestions {
  return {
    roles: unique([...applications.map((a) => a.role), ...ROLE_SUGGESTIONS]),
    companies: unique(applications.map((a) => a.company_name)),
    locations: unique([...applications.map((a) => a.location), ...LOCATION_SUGGESTIONS]),
  };
}
