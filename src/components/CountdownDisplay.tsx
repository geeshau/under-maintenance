import React, { useCallback, useEffect, useRef, useState } from "react";
import { AlertCircle, CheckCircle2, Clock, Sparkles } from "lucide-react";
import { maintenanceConfig, projectDetails } from "../data";

interface CountdownDisplayProps {
  onTimeUp?: () => void;
  /** Notifies the parent of the live progress (0–100) and completion state. */
  onProgress?: (progress: number, isCompleted: boolean) => void;
  /** Fires the celebration burst. Owned by the parent so only one burst plays. */
  onCelebrate?: () => void;
  /** Extra classes so the parent can control sizing within a flex layout. */
  className?: string;
}

interface TimeUnit {
  label: string;
  value: string;
}

export default function CountdownDisplay({
  onTimeUp,
  onProgress,
  onCelebrate,
  className = "",
}: CountdownDisplayProps) {
  const targetTime = new Date(maintenanceConfig.targetDate);
  const startTime = new Date(maintenanceConfig.startDate);

  const [timeLeft, setTimeLeft] = useState({
    progress: 100,
    differenceMs: 0,
  });

  const totalDurationMs = targetTime.getTime() - startTime.getTime();
  const [isCompleted, setIsCompleted] = useState(false);
  const completionReported = useRef(false);

  const fireCelebration = useCallback(() => {
    onCelebrate?.();
  }, [onCelebrate]);

  // Recalculate remaining time
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = targetTime.getTime() - now.getTime();

      if (difference <= 0) {
        setTimeLeft({ progress: 0, differenceMs: 0 });
        setIsCompleted(true);

        if (!completionReported.current) {
          completionReported.current = true;
          fireCelebration();
        }

        onProgress?.(100, true);
        onTimeUp?.();
        return;
      }

      setIsCompleted(false);
      completionReported.current = false;

      // Percentage of the maintenance window already elapsed
      const elapsed =
        totalDurationMs > 0
          ? Math.max(0, Math.min(100, ((totalDurationMs - difference) / totalDurationMs) * 100))
          : 0;

      setTimeLeft({ progress: elapsed, differenceMs: difference });
      onProgress?.(elapsed, false);
    };

    calculateTimeLeft(); // Run immediately
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onTimeUp, onProgress]);

  // Helper to pad numbers with leading zeros
  const padZero = (num: number): string => Math.max(0, Math.floor(num)).toString().padStart(2, "0");

  const accent = isCompleted ? "text-g-green" : "text-g-blue";
  const accentSoft = isCompleted ? "bg-surface-green" : "bg-surface-blue";

  // Compute display units: prefer days/weeks/months when > 24 hours remain
  const getTimeUnits = (ms: number): TimeUnit[] => {
    if (ms <= 0) {
      return [
        { label: "Hours", value: "00" },
        { label: "Minutes", value: "00" },
        { label: "Seconds", value: "00" },
      ];
    }

    const totalSeconds = Math.floor(ms / 1000);
    const seconds = totalSeconds % 60;
    const totalMinutes = Math.floor(totalSeconds / 60);
    const minutes = totalMinutes % 60;
    const totalHours = Math.floor(totalMinutes / 60);
    const hours = totalHours % 24;
    const totalDays = Math.floor(totalHours / 24);

    if (totalDays >= 365) {
      const months = Math.floor(totalDays / 30.44);
      const remainingDays = Math.floor(totalDays % 30.44);
      if (remainingDays === 0) {
        return [
          { label: months === 1 ? "Month" : "Months", value: padZero(months) },
        ];
      }
      return [
        { label: months === 1 ? "Month" : "Months", value: padZero(months) },
        { label: remainingDays === 1 ? "Day" : "Days", value: padZero(remainingDays) },
      ];
    }

    if (totalDays >= 7) {
      const weeks = Math.floor(totalDays / 7);
      const remainingDays = totalDays % 7;
      if (remainingDays === 0) {
        return [
          { label: weeks === 1 ? "Week" : "Weeks", value: padZero(weeks) },
        ];
      }
      return [
        { label: weeks === 1 ? "Week" : "Weeks", value: padZero(weeks) },
        { label: remainingDays === 1 ? "Day" : "Days", value: padZero(remainingDays) },
      ];
    }

    if (totalDays >= 1) {
      if (hours === 0) {
        return [
          { label: totalDays === 1 ? "Day" : "Days", value: padZero(totalDays) },
        ];
      }
      return [
        { label: totalDays === 1 ? "Day" : "Days", value: padZero(totalDays) },
        { label: "Hours", value: padZero(hours) },
        { label: "Minutes", value: padZero(minutes) },
      ];
    }

    // Less than 24 hours — show hours/minutes/seconds
    return [
      { label: "Hours", value: padZero(totalHours) },
      { label: "Minutes", value: padZero(minutes) },
      { label: "Seconds", value: padZero(seconds) },
    ];
  };

  const timeUnits = getTimeUnits(timeLeft.differenceMs);

  return (
    <div
      className={`relative flex h-full min-h-0 flex-col overflow-hidden rounded-3xl border border-line bg-white shadow-card ${className}`}
    >
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-line px-3.5 py-[clamp(0.375rem,1.4dvh,1rem)] sm:px-6 [@media(max-height:700px)]:py-1.5">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3 [@media(max-height:640px)]:hidden">
          <div
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg sm:h-9 sm:w-9 sm:rounded-xl ${accentSoft} ${accent}`}
          >
            {isCompleted ? (
              <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            ) : (
              <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            )}
          </div>
          <div className="min-w-0 leading-tight">
            <p className={`truncate text-[11px] font-medium sm:text-sm ${accent}`}>
              {isCompleted ? "System online" : maintenanceConfig.systemTitle}
            </p>
            <p className="hidden truncate text-xs text-ink-600 sm:block">
              {projectDetails.version}
            </p>
          </div>
        </div>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium sm:px-3 sm:py-1 sm:text-xs ${
            isCompleted ? "bg-surface-green text-g-green" : "bg-surface-blue text-g-blue"
          } [@media(max-height:640px)]:ml-auto`}
        >
          {isCompleted ? "Completed" : "In progress"}
        </span>
      </div>

      {/* Body */}
      <div className="flex min-h-0 flex-1 flex-col justify-center px-3.5 py-[clamp(0.375rem,1.6dvh,1.5rem)] sm:px-6 [@media(max-height:700px)]:px-3.5">
        {/* Countdown digits */}
        <div className={`grid gap-2 sm:gap-3 md:gap-4 ${
          timeUnits.length === 1
            ? "grid-cols-1"
            : timeUnits.length === 2
              ? "grid-cols-2"
              : "grid-cols-3"
        }`}>
          {timeUnits.map((unit) => (
            <div
              key={unit.label}
              className="rounded-2xl border border-line bg-surface-alt px-2 py-[clamp(0.25rem,1.6dvh,1.75rem)] text-center transition-colors duration-500 sm:px-3 [@media(max-height:700px)]:py-2"
            >
              <div
                className={`tabular font-medium tracking-tight text-[clamp(1.25rem,4.4dvh,3rem)] ${
                  isCompleted ? "text-g-green" : "text-ink-900"
                }`}
              >
                {unit.value}
              </div>
              <div className="mt-0.5 text-[9px] font-medium uppercase tracking-widest text-ink-400 sm:mt-1.5 sm:text-[10px] lg:text-[11px] [@media(max-height:640px)]:hidden">
                {unit.label}
              </div>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="mt-[clamp(0.5rem,2.2dvh,1.75rem)]">
          <div className="mb-2 flex items-center justify-between sm:mb-2.5 [@media(max-height:640px)]:mb-1">
            <span className="text-[11px] font-medium text-ink-600 sm:text-xs">
              {isCompleted ? "Upgrade complete" : "Upgrade progress"}
            </span>
            <span className={`tabular text-[11px] font-semibold sm:text-xs ${accent}`}>
              {(isCompleted ? 100 : timeLeft.progress).toFixed(2)}%
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-line-soft">
            <div
              className={`h-full rounded-full transition-all duration-1000 ease-out ${
                isCompleted ? "bg-g-green" : "bg-g-blue"
              }`}
              style={{ width: `${isCompleted ? 100 : timeLeft.progress}%` }}
            />
          </div>
        </div>

        {/* Completion notice */}
        {isCompleted && (
          <div className="mt-[clamp(0.5rem,2.4dvh,1.5rem)] flex items-center justify-between gap-3 rounded-2xl border border-g-green/25 bg-surface-green px-3 py-2.5 sm:px-4 sm:py-3">
            <div className="flex min-w-0 items-center gap-2.5">
              <AlertCircle className="h-4 w-4 shrink-0 text-g-green" />
              <span className="truncate text-[11px] font-medium text-ink-800 sm:text-xs">
                All systems migrated and fully validated.
              </span>
            </div>
            <button
              onClick={fireCelebration}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-g-green px-2.5 py-1.5 text-[11px] font-medium text-white transition-colors hover:bg-g-green/90 sm:px-3 sm:text-xs"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Celebrate</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
