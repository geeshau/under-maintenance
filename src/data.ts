// ---------------------------------------------------------------------------
// Content model for the maintenance landing page.
// All copy is driven from here so the layout stays purely presentational.
// ---------------------------------------------------------------------------

export type AccentColor = "blue" | "red" | "yellow" | "green";

export interface ProjectDetails {
  appName: string;
  version: string;
  status: "Offline" | "Maintenance" | "Upgrading" | "Live";
  alertText: string;
  supportEmail: string;
  website: string;
}

export interface MaintenanceConfig {
  /** ISO 8601 — the moment the maintenance window opened. */
  startDate: string;
  /** ISO 8601 — the moment the system is expected to be back online. */
  targetDate: string;
  systemTitle: string;
  systemSubtitle: string;
  systemDescription: string;
  /** Human readable form of the target date, e.g. "10 July 2026 · 00:00 UTC". */
  targetLabel: string;
}

export interface UpdateLog {
  id: string;
  timestamp: string;
  component: string;
  status: "COMPLETED" | "IN_PROGRESS" | "IN-PROGRESS" | "QUEUED";
  description: string;
  accent: AccentColor;
}

export interface SystemBannerConfig {
  show: boolean;
  message: string;
  type: "warning" | "info" | "critical" | "success";
  allowDismiss: boolean;
}

export interface StatusMessage {
  title: string;
  body: string;
  /** Headline shown once the maintenance window has closed. */
  completeTitle: string;
  /** Supporting copy shown once the maintenance window has closed. */
  completeBody: string;
  accent: AccentColor;
}

/** A single stage of the maintenance pipeline. */
export interface UpgradeStage {
  id: string;
  /** Short label used in the compact stepper. */
  label: string;
  /** Full description used in the detailed checklist. */
  fullLabel: string;
  /** Percentage at which this stage is considered complete. */
  threshold: number;
  accent: AccentColor;
}

export const projectDetails: ProjectDetails = {
  appName: "System Maintenance",
  version: "v1.0.0",
  status: "Maintenance",
  alertText: "Scheduled Maintenance In Progress",
  supportEmail: "ict.team@pceastandrews.org",
  website: "accounts.pceastandrews.org",
};

export const systemBannerConfig: SystemBannerConfig = {
  show: true,
  message:
    "Database optimisation is running at 85% completion. System requests are paused until the upgrade finishes.",
  type: "warning",
  allowDismiss: true,
};

export const maintenanceConfig: MaintenanceConfig = {
  startDate: "2026-10-25T00:00:00Z",
  targetDate: "2026-11-12T00:00:00Z",
  systemTitle: "Scheduled Maintenance",
  systemSubtitle: "Upgrading our systems to better serve you",
  systemDescription:
    "We are optimising our database architecture and deploying new security policies across the eRequisition platform.",
  targetLabel: "10 July 2026 · 00:00 UTC",
};

export const statusMessage: StatusMessage = {
  title: "We'll be back shortly",
  body: "We're upgrading the system to deliver faster approvals, stronger security, and a smoother request experience.",
  completeTitle: "We're back online",
  completeBody: "The system is fully upgraded and back to normal. Thanks for your patience while we worked.",
  accent: "blue",
};

export const upgradeStages: UpgradeStage[] = [
  {
    id: "database",
    label: "Database",
    fullLabel: "Database migration",
    threshold: 25,
    accent: "blue",
  },
  {
    id: "security",
    label: "Security",
    fullLabel: "Security policies",
    threshold: 55,
    accent: "green",
  },
  {
    id: "application",
    label: "Application",
    fullLabel: "Application rollout",
    threshold: 80,
    accent: "yellow",
  },
  {
    id: "verification",
    label: "Verification",
    fullLabel: "Verification & handover",
    threshold: 100,
    accent: "red",
  },
];

export const updateLogs: UpdateLog[] = [
  {
    id: "LOG-001",
    timestamp: "27/06/2026",
    component: "Database migration",
    status: "IN-PROGRESS",
    description: "Reindexing the core requisition tables and validating query plans.",
    accent: "blue",
  },
  {
    id: "LOG-002",
    timestamp: "28/06/2026",
    component: "Security",
    status: "QUEUED",
    description: "Deploying updated access policies and centralised audit logging.",
    accent: "green",
  },
  {
    id: "LOG-003",
    timestamp: "29/06/2026",
    component: "Application",
    status: "QUEUED",
    description: "Shipping the streamlined approval workflow and refreshed interface.",
    accent: "yellow",
  },
  {
    id: "LOG-004",
    timestamp: "10/07/2026",
    component: "Verification",
    status: "QUEUED",
    description: "End-to-end validation, load testing, and traffic handover.",
    accent: "red",
  },
];
