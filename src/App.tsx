import React, { useCallback, useRef, useState } from "react";
import CountdownDisplay from "./components/CountdownDisplay";
import UpgradeProgress from "./components/UpgradeProgress";
import {
  maintenanceConfig,
  projectDetails,
  statusMessage,
  systemBannerConfig,
  updateLogs,
} from "./data";
import { logStatusStyles } from "./theme";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Info,
  Mail,
  Menu,
  Terminal,
  Wrench,
  X,
} from "lucide-react";
import confetti from "canvas-confetti";

const BRAND_COLORS = ["#4285f4", "#ea4335", "#fbbc05", "#34a853", "#8ab4f8"];

export default function App() {
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [showBanner, setShowBanner] = useState(systemBannerConfig.show);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const celebrationFired = useRef(false);

  const handleProgress = useCallback((value: number, completed: boolean) => {
    setProgress(value);
    setIsComplete(completed);

    // Fire the celebration exactly once, no matter how many timers report in.
    if (completed && !celebrationFired.current) {
      celebrationFired.current = true;
      fireCelebration();
    }
    if (!completed) {
      celebrationFired.current = false;
    }
  }, []);

  // Trigger the celebratory confetti shower
  const fireCelebration = useCallback(() => {
    confetti({
      particleCount: 90,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.8 },
      colors: BRAND_COLORS,
    });
    confetti({
      particleCount: 90,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.8 },
      colors: BRAND_COLORS,
    });

    setTimeout(() => {
      confetti({
        particleCount: 60,
        angle: 90,
        spread: 80,
        origin: { x: 0.5, y: 0.6 },
        colors: ["#4285f4", "#34a853", "#ea4335"],
      });
    }, 250);
  }, []);

  const bannerIcon =
    systemBannerConfig.type === "info" ? (
      <Info className="h-4 w-4 shrink-0 text-g-blue" />
    ) : systemBannerConfig.type === "success" ? (
      <CheckCircle2 className="h-4 w-4 shrink-0 text-g-green" />
    ) : (
      <AlertTriangle className="h-4 w-4 shrink-0 text-[#a06700]" />
    );

  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden bg-white font-sans text-ink-800">
      {/* ------------------------------------------------------------------ */}
      {/* Header                                                               */}
      {/* ------------------------------------------------------------------ */}
      <header className="z-40 shrink-0 border-b border-line bg-white/90 backdrop-blur-md">
        <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:h-16 sm:px-6 [@media(max-height:560px)]:h-12">
          {/* Wordmark */}
          <a href="#overview" className="flex min-w-0 items-center gap-2 sm:gap-2.5">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-surface-alt text-ink-600 sm:h-7 sm:w-7 sm:rounded-xl">
              <Wrench className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </span>
            <span className="truncate text-sm font-medium tracking-tight text-ink-900 sm:text-base">
              {projectDetails.appName}
            </span>
            <span className="hidden text-xs text-ink-400 sm:inline">
              {projectDetails.version}
            </span>
          </a>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsLogOpen(true)}
              className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-xs font-medium text-ink-800 transition-colors hover:border-ink-200 hover:bg-surface-alt sm:px-4 sm:py-2 sm:text-sm"
            >
              <Terminal className="h-3.5 w-3.5 text-ink-400" />
              <span className="hidden sm:inline">Status log</span>
              <span className="sm:hidden">Log</span>
            </button>

            <button
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-ink-600 transition-colors hover:bg-surface-alt sm:h-10 sm:w-10"
              aria-label="Toggle navigation menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </nav>

        {/* Mobile nav panel */}
        {isMenuOpen && (
          <div className="border-t border-line bg-white px-4 py-3 sm:px-6">
            <div className="mx-auto flex max-w-6xl flex-col gap-0.5">
              <a
                href="#overview"
                onClick={() => setIsMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-sm text-ink-700 transition-colors hover:bg-surface-alt"
              >
                Overview
              </a>
              <a
                href="#support"
                onClick={() => setIsMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-sm text-ink-700 transition-colors hover:bg-surface-alt"
              >
                Support
              </a>
              <a
                href={`mailto:${projectDetails.supportEmail}`}
                onClick={() => setIsMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-sm text-ink-700 transition-colors hover:bg-surface-alt"
              >
                {projectDetails.supportEmail}
              </a>
            </div>
          </div>
        )}
      </header>

      {/* ------------------------------------------------------------------ */}
      {/* Service banner                                                       */}
      {/* ------------------------------------------------------------------ */}
      {showBanner && (
        <div className="z-30 shrink-0 border-b border-[#f9d58a] bg-surface-yellow">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2 sm:px-6 sm:py-2.5 [@media(max-height:620px)]:py-1.5">
            <div className="flex items-start gap-2.5 sm:gap-3">
              {bannerIcon}
              <p className="text-xs leading-relaxed text-ink-800 sm:text-sm">
                <span className="font-semibold">Heads up.</span>{" "}
                <span className="hidden sm:inline">{systemBannerConfig.message}</span>
                <span className="sm:hidden">
                  Database optimisation is running at 85% completion.
                </span>
              </p>
            </div>
            {systemBannerConfig.allowDismiss && (
              <button
                onClick={() => setShowBanner(false)}
                className="shrink-0 rounded-full p-1 text-ink-400 transition-colors hover:bg-black/5 hover:text-ink-800"
                aria-label="Dismiss notice"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Main — everything fits in the viewport                              */}
      {/* ------------------------------------------------------------------ */}
      <main
        id="overview"
        className="mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col overflow-hidden px-4 py-3 sm:px-6 sm:py-5 lg:py-6 [@media(max-height:620px)]:py-2"
      >
        <div className="grid min-h-0 flex-1 grid-cols-1 grid-rows-[auto_minmax(0,1fr)_auto] gap-3 [@media(max-height:640px)]:gap-2 [@media(max-height:560px)]:grid-cols-2 [@media(max-height:560px)]:grid-rows-[minmax(0,1fr)] md:grid-cols-2 md:grid-rows-[minmax(0,1fr)_auto] md:gap-4 lg:grid-cols-12 lg:gap-5">
          {/* ---------------- Hero copy ---------------- */}
          <div className="flex min-h-0 shrink-0 flex-col justify-center overflow-hidden md:col-span-1 md:row-start-1 lg:col-span-7 lg:row-start-1">
            {/* Status pill */}
            <div className="inline-flex w-fit items-center gap-2 self-start rounded-full border border-line bg-surface-alt px-2.5 py-1 [@media(max-height:640px)]:hidden">
              <span className="relative flex h-1.5 w-1.5">
                {isComplete ? (
                  <span className="h-1.5 w-1.5 rounded-full bg-g-green" />
                ) : (
                  <>
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-g-blue opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-g-blue" />
                  </>
                )}
              </span>
              <span className="text-[10px] font-medium text-ink-800 sm:text-xs">
                {isComplete ? "System online" : projectDetails.alertText}
              </span>
            </div>

            <h1 className="mt-2.5 shrink-0 font-medium leading-[1.08] tracking-tight text-ink-900 text-[clamp(1.5rem,4.6dvh,3.75rem)] sm:mt-4 [@media(max-height:640px)]:mt-0 md:text-[clamp(2rem,4.6dvh,3.25rem)] lg:text-[clamp(2.5rem,5dvh,3.75rem)] xl:text-[clamp(3rem,5.2dvh,3.75rem)]">
              {isComplete ? statusMessage.completeTitle : statusMessage.title}
            </h1>

            <p className="mt-2 line-clamp-2 max-w-xl shrink-0 text-[13px] leading-relaxed text-ink-600 sm:mt-3 sm:line-clamp-none sm:text-base [@media(max-height:680px)]:hidden">
              {isComplete ? statusMessage.completeBody : statusMessage.body}
            </p>

            <p className="mt-1.5 hidden max-w-xl text-sm leading-relaxed text-ink-400 sm:mt-2 lg:block [@media(max-height:820px)]:hidden">
              {maintenanceConfig.systemDescription}
            </p>

            {/* Actions */}
            <div className="mt-3.5 flex flex-wrap items-center gap-2 sm:mt-5 sm:gap-3 [@media(max-height:640px)]:mt-2 [@media(max-height:640px)]:flex-nowrap [@media(max-height:420px)]:mt-1.5">
              <a
                href="https://cp.pceastandrews.org"
                className="inline-flex items-center gap-1.5 rounded-full bg-g-blue px-4 py-2 text-[13px] font-medium text-white transition-all hover:bg-[#1a73e8] hover:shadow-float sm:px-6 sm:py-2.5 sm:text-sm [@media(max-height:420px)]:py-1.5"
              >
                STANDS Home
                <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </a>
              <a
                href={`mailto:${projectDetails.supportEmail}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-[13px] font-medium text-ink-800 transition-colors hover:border-ink-200 hover:bg-surface-alt sm:px-6 sm:py-2.5 sm:text-sm [@media(max-height:640px)_and_(max-width:767px)]:hidden"
              >
                <Mail className="h-3.5 w-3.5 text-ink-400" />
                <span className="hidden sm:inline">{projectDetails.supportEmail}</span>
                <span className="sm:hidden">Email us</span>
              </a>
            </div>

            {/* Meta row — hidden on mobile (duplicated in the footer bar) */}
            <dl className="mt-4 hidden max-w-lg grid-cols-2 gap-x-5 gap-y-3 border-t border-line pt-3.5 sm:mt-5 sm:grid sm:pt-4 lg:flex [@media(max-height:760px)]:hidden">
              <div className="min-w-0">
                <dt className="text-[10px] uppercase tracking-wider text-ink-400 sm:text-xs">
                  Expected back online
                </dt>
                <dd className="mt-0.5 truncate text-xs font-medium text-ink-900 sm:text-sm">
                  {maintenanceConfig.targetLabel}
                </dd>
              </div>
              <div className="min-w-0">
                <dt className="text-[10px] uppercase tracking-wider text-ink-400 sm:text-xs">
                  Upgrade progress
                </dt>
                <dd className="tabular mt-0.5 text-xs font-medium text-ink-900 sm:text-sm">
                  {progress.toFixed(1)}% complete
                </dd>
              </div>
            </dl>
          </div>

          {/* ---------------- Countdown card ---------------- */}
          <div className="flex min-h-0 flex-col md:col-span-1 md:row-start-1 lg:col-span-5 lg:row-span-2 lg:row-start-1">
            <CountdownDisplay
              onProgress={handleProgress}
              onCelebrate={fireCelebration}
              className="min-h-0 flex-1"
            />
          </div>

          {/* ---------------- Progress stepper ---------------- */}
          <div className="md:col-span-2 md:row-start-2 lg:col-span-7 lg:row-start-2 [@media(max-height:560px)]:hidden">
            <UpgradeProgress progress={progress} isCompleted={isComplete} />
          </div>
        </div>
      </main>

      {/* ------------------------------------------------------------------ */}
      {/* Compact footer bar                                                   */}
      {/* ------------------------------------------------------------------ */}
      <footer id="support" className="z-20 shrink-0 border-t border-line bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-2.5 text-[11px] text-ink-400 sm:px-6 sm:text-xs [@media(max-height:620px)]:py-1.5">
          <div className="flex items-center gap-2">
            <span className="font-medium text-ink-600">
              {projectDetails.website}
            </span>
            <span className="text-ink-200">|</span>
            <span>{projectDetails.version}</span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={`mailto:${projectDetails.supportEmail}`}
              className="font-medium text-g-blue transition-colors hover:text-[#1a73e8]"
            >
              {projectDetails.supportEmail}
            </a>
            <span className="text-ink-200">|</span>
            <span>Back online {maintenanceConfig.targetLabel}</span>
          </div>
        </div>
      </footer>

      {/* ------------------------------------------------------------------ */}
      {/* Status log modal                                                     */}
      {/* ------------------------------------------------------------------ */}
      {isLogOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-ink-900/40 p-0 backdrop-blur-sm sm:items-center sm:p-6"
          onClick={() => setIsLogOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="System status log"
        >
          <div
            className="flex max-h-[85vh] w-full max-w-xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-modal sm:rounded-3xl"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-line px-5 py-4 sm:px-6 sm:py-5">
              <div>
                <h2 className="text-base font-medium text-ink-900 sm:text-lg">
                  System log
                </h2>
                <p className="mt-0.5 text-xs text-ink-400">
                  Live feed of the maintenance pipeline
                </p>
              </div>
              <button
                onClick={() => setIsLogOpen(false)}
                className="rounded-full p-2 text-ink-400 transition-colors hover:bg-surface-alt hover:text-ink-800"
                aria-label="Close log"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 space-y-2.5 overflow-y-auto px-5 py-4 scrollbar-thin sm:space-y-3 sm:px-6 sm:py-5">
              {updateLogs.map((log) => {
                const status = logStatusStyles[log.status] ?? logStatusStyles.QUEUED;
                return (
                  <div
                    key={log.id}
                    className="rounded-2xl border border-line p-3.5 transition-colors hover:bg-surface-alt sm:p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`h-2 w-2 shrink-0 rounded-full ${status.dot}`}
                          />
                          <h3 className="text-sm font-medium text-ink-900">
                            {log.component}
                          </h3>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${status.chip}`}
                          >
                            {status.label}
                          </span>
                        </div>
                        <p className="mt-1.5 text-xs leading-relaxed text-ink-600 sm:text-sm">
                          {log.description}
                        </p>
                      </div>
                      <time className="shrink-0 font-mono text-[11px] text-ink-400 sm:text-xs">
                        {log.timestamp}
                      </time>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-line px-5 py-3 sm:px-6 sm:py-4">
              <span className="text-xs text-ink-400">
                Updated {new Date().toLocaleTimeString()}
              </span>
              <button
                onClick={() => setIsLogOpen(false)}
                className="rounded-full bg-ink-900 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-ink-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
