import {
  Archive,
  FolderOpen,
  Camera,
  Fingerprint,
  User,
  Users,
  GitCommitVertical,
  NotebookPen,
  CircleHelp,
  FileText,
  Award,
  Trophy,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItemConfig {
  key: string;
  /** For case-required items, the caseId must be interpolated in. Returns null if no case is open. */
  href: (caseId: string | null) => string | null;
  icon: LucideIcon;
  /** True if this section only makes sense while a case is open. */
  requiresOpenCase: boolean;
}

/**
 * Order matches the sidebar order confirmed consistent across all reference
 * screenshots and UI_IMPLEMENTATION_GUIDE.md — do not reorder without a
 * corresponding update to the reference images.
 */
export const primaryNavItems: NavItemConfig[] = [
  { key: "sidebar.archive", href: () => "/archive", icon: Archive, requiresOpenCase: false },
  {
    key: "sidebar.caseFile",
    href: (caseId) => (caseId ? `/investigation/${caseId}/case-file` : null),
    icon: FolderOpen,
    requiresOpenCase: true,
  },
  {
    key: "sidebar.crimeScene",
    href: (caseId) => (caseId ? `/investigation/${caseId}/crime-scene` : null),
    icon: Camera,
    requiresOpenCase: true,
  },
  {
    key: "sidebar.evidenceLocker",
    href: (caseId) => (caseId ? `/investigation/${caseId}/evidence-locker` : null),
    icon: Fingerprint,
    requiresOpenCase: true,
  },
  {
    key: "sidebar.suspects",
    href: (caseId) => (caseId ? `/investigation/${caseId}/suspects` : null),
    icon: User,
    requiresOpenCase: true,
  },
  {
    key: "sidebar.witnesses",
    href: (caseId) => (caseId ? `/investigation/${caseId}/witnesses` : null),
    icon: Users,
    requiresOpenCase: true,
  },
  {
    key: "sidebar.timeline",
    href: (caseId) => (caseId ? `/investigation/${caseId}/timeline` : null),
    icon: GitCommitVertical,
    requiresOpenCase: true,
  },
  { key: "sidebar.notebook", href: () => "/notebook", icon: NotebookPen, requiresOpenCase: false },
  {
    key: "sidebar.questions",
    href: (caseId) => (caseId ? `/investigation/${caseId}/questions` : null),
    icon: CircleHelp,
    requiresOpenCase: true,
  },
  {
    key: "sidebar.finalReport",
    href: (caseId) => (caseId ? `/investigation/${caseId}/final-report` : null),
    icon: FileText,
    requiresOpenCase: true,
  },
];

export const secondaryNavItems: NavItemConfig[] = [
  { key: "sidebar.certificates", href: () => "/certificates", icon: Award, requiresOpenCase: false },
  { key: "sidebar.achievements", href: () => "/achievements", icon: Trophy, requiresOpenCase: false },
];

export const settingsNavItem: NavItemConfig = {
  key: "sidebar.settings",
  href: () => "/settings",
  icon: Settings,
  requiresOpenCase: false,
};
