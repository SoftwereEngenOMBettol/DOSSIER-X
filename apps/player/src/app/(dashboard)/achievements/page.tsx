"use client";

import * as React from "react";
import { Search, Sparkles, Clock, BookOpen, ShieldCheck, Crown, Trophy, Target, TrendingUp, Lock, type LucideIcon } from "lucide-react";
import { useLocale } from "@dossier-x/i18n";
import { listCertificates, listAllNotes } from "@dossier-x/storage";
import { computeAllAchievements, type AchievementCategory, type AchievementProgress } from "@dossier-x/achievements";
import { DashboardHeader } from "../../../components/DashboardHeader";

const ICONS: Record<string, LucideIcon> = {
  first_case_solved: Search,
  perfect_investigation: Sparkles,
  speed_investigator: Clock,
  note_taker: BookOpen,
  case_master: ShieldCheck,
  legendary_detective: Crown,
};

const CATEGORIES: Array<AchievementCategory | "All"> = ["All", "Investigation", "Collection", "Skill", "Special"];

function AchievementCard({
  achievement,
  isSelected,
  onSelect,
}: {
  achievement: AchievementProgress;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const Icon = ICONS[achievement.id] ?? Trophy;
  const pct = Math.round((achievement.current / achievement.target) * 100);

  return (
    <button
      onClick={onSelect}
      className={`flex flex-col items-start gap-2 rounded-card border p-4 text-start transition-colors ${
        isSelected ? "border-gold bg-gold/5" : "border-border bg-bg-secondary hover:border-gold/40"
      }`}
    >
      <div className="flex w-full items-start justify-between">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-full ${
            achievement.unlocked ? "bg-gold/15 text-gold" : "bg-card text-text-secondary"
          }`}
        >
          {achievement.unlocked ? <Icon size={20} /> : <Lock size={18} />}
        </div>
        {achievement.unlocked && <span className="rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-semibold text-success">DONE</span>}
      </div>
      <p className="font-semibold text-text-primary">{achievement.title}</p>
      <p className="text-xs text-text-secondary">{achievement.description}</p>
      <div className="mt-1 flex w-full items-center justify-between text-xs">
        <span className="font-medium text-gold">{achievement.xp} XP</span>
        <span className="text-text-secondary">
          {achievement.current}/{achievement.target}
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-card">
        <div className={`h-full rounded-full ${achievement.unlocked ? "bg-success" : "bg-gold"}`} style={{ width: `${pct}%` }} />
      </div>
    </button>
  );
}

export default function AchievementsPage() {
  const { t } = useLocale();
  const [achievements, setAchievements] = React.useState<AchievementProgress[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [category, setCategory] = React.useState<AchievementCategory | "All">("All");
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  React.useEffect(() => {
    void (async () => {
      setIsLoading(true);
      try {
        const [certificates, notes] = await Promise.all([listCertificates(), listAllNotes()]);
        const computed = computeAllAchievements({ certificates, notes });
        setAchievements(computed);
        setSelectedId((prev) => prev ?? computed.find((a) => a.unlocked)?.id ?? computed[0]?.id ?? null);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalPoints = achievements.filter((a) => a.unlocked).reduce((sum, a) => sum + a.xp, 0);
  const nextReward = achievements.filter((a) => !a.unlocked).sort((a, b) => b.current / b.target - a.current / a.target)[0];
  const overallProgress = achievements.length > 0 ? Math.round((unlockedCount / achievements.length) * 100) : 0;

  const visible = category === "All" ? achievements : achievements.filter((a) => a.category === category);
  const selected = achievements.find((a) => a.id === selectedId) ?? null;
  const SelectedIcon = selected ? (ICONS[selected.id] ?? Trophy) : Trophy;

  return (
    <>
      <DashboardHeader title={t("sidebar.achievements")} subtitle="Your progress, your reputation." />

      <div className="px-8 py-6">
        {!isLoading && (
          <>
            <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-card border border-border bg-bg-secondary p-4">
                <p className="flex items-center gap-1.5 text-xs text-text-secondary">
                  <Trophy size={13} /> TOTAL ACHIEVEMENTS
                </p>
                <p className="mt-1 text-xl font-bold text-text-primary">
                  {unlockedCount} / {achievements.length}
                </p>
              </div>
              <div className="rounded-card border border-border bg-bg-secondary p-4">
                <p className="flex items-center gap-1.5 text-xs text-text-secondary">
                  <Sparkles size={13} /> ACHIEVEMENT POINTS
                </p>
                <p className="mt-1 text-xl font-bold text-text-primary">{totalPoints.toLocaleString()}</p>
              </div>
              <div className="rounded-card border border-border bg-bg-secondary p-4">
                <p className="flex items-center gap-1.5 text-xs text-text-secondary">
                  <Target size={13} /> NEXT REWARD
                </p>
                <p className="mt-1 text-xl font-bold text-text-primary">{nextReward ? `${nextReward.xp} XP` : "\u2014"}</p>
              </div>
              <div className="rounded-card border border-border bg-bg-secondary p-4">
                <p className="flex items-center gap-1.5 text-xs text-text-secondary">
                  <TrendingUp size={13} /> PROGRESS
                </p>
                <p className="mt-1 text-xl font-bold text-text-primary">{overallProgress}%</p>
              </div>
            </div>

            <div className="mb-6 flex gap-2 overflow-x-auto">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors ${
                    category === c ? "bg-gold text-bg-primary" : "bg-bg-secondary text-text-secondary hover:text-text-primary"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_300px]">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {visible.map((a) => (
                  <AchievementCard key={a.id} achievement={a} isSelected={a.id === selectedId} onSelect={() => setSelectedId(a.id)} />
                ))}
              </div>

              {selected && (
                <div className="h-fit rounded-card border border-border bg-paper p-6 text-center text-bg-primary">
                  <div
                    className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${
                      selected.unlocked ? "bg-gold/20 text-gold" : "bg-black/10 text-archive-brown"
                    }`}
                  >
                    {selected.unlocked ? <SelectedIcon size={28} /> : <Lock size={24} />}
                  </div>
                  <p className="mt-4 text-lg font-bold">{selected.title}</p>
                  <p className="mt-1 text-sm text-archive-brown">{selected.description}</p>
                  <div className="my-4 border-t border-archive-brown/20" />
                  <div className="flex justify-between text-xs">
                    <span className="text-archive-brown">REWARD</span>
                    <span className="font-semibold">{selected.xp} XP</span>
                  </div>
                  <div className="mt-2 flex justify-between text-xs">
                    <span className="text-archive-brown">{selected.unlocked ? "STATUS" : "PROGRESS"}</span>
                    <span className="font-semibold">
                      {selected.unlocked ? "Completed" : `${selected.current} / ${selected.target}`}
                    </span>
                  </div>
                  {selected.unlocked && (
                    <div className="mt-4 inline-block rounded border-2 border-success px-3 py-1 text-xs font-bold uppercase tracking-widest text-success">
                      Completed
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
