"use client";

import { useEffect, useRef, useState } from "react";
import type { SellStat } from "../../types/sellLanding";
import SellSection from "./SellSection";
import styles from "./SellStats.module.css";

const DURATION_MS = 1400;

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

type SellStatsProps = {
  stats: SellStat[];
};

// Цифры с анимацией счёта: запускается, когда блок появляется на экране
export default function SellStats({ stats }: SellStatsProps) {
  const listRef = useRef<HTMLUListElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const node = listRef.current;
    if (!node) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;

    const run = () => {
      if (reduceMotion) {
        frame = requestAnimationFrame(() => setProgress(1));
        return;
      }

      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - start) / DURATION_MS, 1);
        setProgress(easeOutCubic(t));
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          run();
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <SellSection ariaLabel="Умови в цифрах">
      <ul ref={listRef} className={styles.list}>
        {stats.map((stat) => {
          const shown = Math.round(stat.value * progress);
          const finalText = `${stat.prefix ?? ""}${stat.value}${stat.suffix ?? ""}`;

          return (
            <li key={stat.label} className={styles.card}>
              <span className={styles.bar} style={{ width: `${progress * 100}%` }} />

              <p className={styles.value} aria-hidden="true">
                {stat.prefix}
                {shown}
                {stat.suffix}
              </p>
              <span className={styles.srOnly}>{finalText}</span>

              <p className={styles.label}>{stat.label}</p>
              <p className={styles.description}>{stat.description}</p>
            </li>
          );
        })}
      </ul>
    </SellSection>
  );
}