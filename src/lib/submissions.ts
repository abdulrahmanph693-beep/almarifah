export type SubmissionStatus = "pending" | "approved" | "published" | "rejected";
export type SubmissionKind = "essay" | "poem";

export type Submission = {
  id: string;
  author_id: string;
  title: string;
  subtitle: string;
  kind: SubmissionKind;
  category: string;
  excerpt: string;
  body: string;
  cover_image: string;
  status: SubmissionStatus;
  review_note: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export const statusLabel: Record<SubmissionStatus, string> = {
  pending: "Pending review",
  approved: "Approved",
  published: "Published",
  rejected: "Needs changes",
};

export const statusClass: Record<SubmissionStatus, string> = {
  pending: "border-border text-muted-foreground",
  approved: "border-accent text-accent",
  published: "border-accent bg-accent text-accent-foreground",
  rejected: "border-destructive text-destructive",
};

export const submissionCategories = [
  "Philosophy",
  "Literature",
  "Culture",
  "History",
  "Modern Essays",
  "Language",
];
