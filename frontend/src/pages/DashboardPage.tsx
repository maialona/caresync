import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useChatStore } from "../store/chatStore";
import { statsApi, type DashboardStats } from "../api/stats";
import { scheduleApi } from "../api/schedule";
import type { ComplianceSummary, VisitRecord } from "../types";
import {
  Home,
  Phone,
  FileEdit,
  Plus,
  ClipboardList,
  ArrowRight,
  TrendingUp,
  Calendar,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  type LucideIcon,
} from "lucide-react";

export default function DashboardPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const openChat = useChatStore((s) => s.setOpen);

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [complianceSummary, setComplianceSummary] = useState<ComplianceSummary | null>(null);

  useEffect(() => {
    statsApi.getDashboardStats()
      .then(setStats)
      .catch((err) => console.error("Failed to load dashboard stats", err))
      .finally(() => setLoadingStats(false));
    scheduleApi.getSummary().then(setComplianceSummary).catch(() => {});
  }, []);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "早安" : hour < 18 ? "午安" : "晚安";

  const messages = [
    "今天似乎是寫家電訪的好日子呢～",
    "今天家電訪寫好沒？還不寫爆？",
    "今天也辛苦了！以下是你的工作概況。",
    "現在就是瘋狂輸出的時刻！！",
    "衝啊～要偷懶前至少先把家電訪幹完！",
    "用AI寫家電訪就是爽～",
  ];

  const [displayedText, setDisplayedText] = useState("");
  const [msgIndex, setMsgIndex] = useState(() => Math.floor(Math.random() * messages.length));

  useEffect(() => {
    const text = messages[msgIndex];
    let i = 0;
    setDisplayedText("");

    const typeTimer = setInterval(() => {
      i++;
      setDisplayedText(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(typeTimer);
        setTimeout(() => {
          let next: number;
          do {
            next = Math.floor(Math.random() * messages.length);
          } while (next === msgIndex && messages.length > 1);
          setMsgIndex(next);
        }, 3000);
      }
    }, 80);

    return () => clearInterval(typeTimer);
  }, [msgIndex]);

  return (
    <div className="animate-fade-in space-y-6">
      {/* Hero greeting — clean & minimal */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">Dashboard</h1>
        <p className="mt-1 text-gray-500">
          <span className="font-medium text-gray-900">{greeting}，{user?.name || "使用者"}</span>
          <span className="text-gray-400"> — </span>
          {displayedText}
          <span className="inline-block w-[2px] h-[1em] bg-gray-300 align-middle ml-0.5 animate-pulse" />
        </p>
      </div>

      {/* Performance stats — single card with dividers like Emitly */}
      <div className="card p-0">
        <div className="grid grid-cols-2 divide-x divide-gray-100 lg:grid-cols-4">
          <StatCell
            label="本月家訪"
            value={stats?.home_visits_this_month ?? 0}
            isLoading={loadingStats}
            icon={Home}
          />
          <StatCell
            label="本月電訪"
            value={stats?.phone_visits_this_month ?? 0}
            isLoading={loadingStats}
            icon={Phone}
          />
          <StatCell
            label="待完成紀錄"
            value={stats?.pending_records ?? 0}
            isLoading={loadingStats}
            icon={FileEdit}
            highlight
          />
          <StatCell
            label="總紀錄數"
            value={stats?.total_records ?? 0}
            isLoading={loadingStats}
            icon={ClipboardList}
          />
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <QuickAction
          icon={Plus}
          title="新增紀錄"
          desc="建立家訪或電訪紀錄"
          onClick={() => navigate("/records/new")}
        />
        {complianceSummary && (complianceSummary.overdue > 0 || complianceSummary.due_soon > 0) && (
          <QuickAction
            icon={AlertTriangle}
            title={
              complianceSummary.overdue > 0
                ? `${complianceSummary.overdue} 個案逾期`
                : `${complianceSummary.due_soon} 個案即將到期`
            }
            desc={
              complianceSummary.overdue > 0 && complianceSummary.due_soon > 0
                ? `另有 ${complianceSummary.due_soon} 個案即將到期`
                : "點擊查看詳情"
            }
            alert
            onClick={() => navigate("/schedule?status_filter=overdue")}
          />
        )}
        <QuickAction
          icon={Sparkles}
          title="AI 助理"
          desc="查詢資料與統計分析"
          highlight
          onClick={() => openChat(true)}
        />
      </div>

      {/* Recent records */}
      <div className="card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-100">
              <Calendar className="h-4 w-4 text-gray-600" />
            </div>
            <h3 className="text-base font-bold text-gray-900">近期紀錄</h3>
          </div>
          <button
            onClick={() => navigate("/records")}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors"
          >
            查看全部
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="mt-4 space-y-2">
          {stats?.recent_records && stats.recent_records.length > 0 ? (
            stats.recent_records.map((record) => (
              <ActivityItem
                key={record.id}
                record={record}
                onClick={() => navigate(`/records/${record.id}/edit`)}
              />
            ))
          ) : (
            <div className="flex items-center justify-center rounded-xl border border-dashed border-gray-200 bg-surface-50 py-10 text-sm font-medium text-gray-400">
              {loadingStats ? "載入中..." : "目前尚無近期紀錄"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Sub-components ─── */

function StatCell({
  label,
  value,
  isLoading,
  highlight,
}: {
  label: string;
  value: number;
  isLoading?: boolean;
  icon: LucideIcon;
  highlight?: boolean;
}) {
  return (
    <div className="px-5 py-5 lg:px-6">
      <p className="text-sm text-gray-500">{label}</p>
      <div className="mt-2 flex items-baseline gap-3">
        {isLoading ? (
          <div className="h-8 w-16 animate-pulse rounded bg-gray-100" />
        ) : (
          <p className={`text-3xl font-bold tracking-tight ${highlight ? "text-amber-600" : "text-gray-900"}`}>
            {value.toLocaleString()}
          </p>
        )}
        {!isLoading && (
          <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-600">
            <TrendingUp className="h-3 w-3" />
            本月
          </span>
        )}
      </div>
    </div>
  );
}

function QuickAction({
  icon: Icon,
  title,
  desc,
  highlight,
  alert,
  onClick,
}: {
  icon: LucideIcon;
  title: string;
  desc: string;
  highlight?: boolean;
  alert?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`group relative flex w-full flex-col items-start gap-4 rounded-2xl border p-5 text-left transition-all duration-200 hover:-translate-y-0.5 cursor-pointer ${
        highlight
          ? "border-primary-700 bg-primary-700 text-white"
          : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-card-hover"
      }`}
    >
      <div className="relative">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105 ${
            highlight ? "bg-white/10 text-white" : alert ? "bg-orange-50 text-orange-500" : "bg-primary-50 text-primary-700"
          }`}
        >
          <Icon className="h-5 w-5" />
        </div>
        {alert && (
          <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-orange-500 ring-2 ring-white" />
        )}
      </div>
      <div>
        <div className="flex items-center gap-2">
          <p className={`text-sm font-semibold ${highlight ? "text-white" : alert ? "text-orange-600" : "text-gray-900"}`}>
            {title}
          </p>
          <ArrowRight className={`h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1 ${highlight ? "text-gray-400" : alert ? "text-orange-400" : "text-gray-400"}`} />
        </div>
        <p className={`mt-1 text-xs ${highlight ? "text-gray-400" : "text-gray-500"}`}>
          {desc}
        </p>
      </div>
    </button>
  );
}

function ActivityItem({
  record,
  onClick,
}: {
  record: VisitRecord;
  onClick: () => void;
}) {
  const Icon = record.visit_type === "home" ? Home : Phone;
  const isCompleted = record.status === "completed";

  return (
    <div
      onClick={onClick}
      className="group flex cursor-pointer items-center justify-between rounded-xl p-3 transition-all duration-200 hover:bg-surface-100"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-100 text-gray-600 group-hover:bg-white">
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 leading-none">
            <p className="truncate text-sm font-semibold text-gray-900">{record.case_name}</p>
            {record.org_name && (
              <span className="shrink-0 text-xs text-gray-400">{record.org_name}</span>
            )}
          </div>
          <p className="mt-1 truncate text-xs text-gray-400">
            {record.visit_date.slice(0, 10)}
          </p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        {isCompleted ? (
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
        ) : (
          <span className="badge-yellow">草稿</span>
        )}
        <ArrowRight className="h-4 w-4 text-gray-300 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-gray-500" />
      </div>
    </div>
  );
}
