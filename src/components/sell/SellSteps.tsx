"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import type { SellStep } from "../../types/sellLanding";
import { useMediaQuery } from "../../lib/useMediaQuery";
import SellSection from "./SellSection";
import { IconCheck } from "./SellIcons";
import styles from "./SellSteps.module.css";

// С этой ширины шаги переключаются прокруткой
const SCROLL_MODE_QUERY = "(min-width: 901px)";

type SellStepsProps = {
  steps: SellStep[];
};

function clamp01(value: number): number {
  return Math.min(Math.max(value, 0), 1);
}

// Индекс следующей вкладки по клавише (стрелки, Home, End)
function nextIndexForKey(key: string, index: number, total: number): number | null {
  switch (key) {
    case "ArrowDown":
    case "ArrowRight":
      return (index + 1) % total;
    case "ArrowUp":
    case "ArrowLeft":
      return (index - 1 + total) % total;
    case "Home":
      return 0;
    case "End":
      return total - 1;
    default:
      return null;
  }
}

export default function SellSteps({ steps }: SellStepsProps) {
  const baseId = useId();
  const isScrollMode = useMediaQuery(SCROLL_MODE_QUERY, true);

  const trackRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const [active, setActive] = useState(0);
  const total = steps.length;

  // Шаг и полоски прогресса считаются из положения прокрутки внутри блока
  useEffect(() => {
    const track = trackRef.current;
    const sticky = stickyRef.current;
    if (!isScrollMode || !track || !sticky || total === 0) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      const scrollable = track.offsetHeight - sticky.offsetHeight;
      const passed = sticky.getBoundingClientRect().top - track.getBoundingClientRect().top;
      const progress = scrollable > 0 ? clamp01(passed / scrollable) : 0;

      const raw = progress * total;
      const index = Math.min(Math.floor(raw), total - 1);

      setActive(index);
      // Полоски обновляем напрямую через CSS-переменные — без перерисовки на каждый кадр
      tabsRef.current?.style.setProperty("--done", String(progress));
      panelRef.current?.style.setProperty("--step-progress", String(clamp01(raw - index)));
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [isScrollMode, total]);

  // Переход к шагу: в режиме прокрутки — прокручиваем страницу к нему
  function goTo(index: number) {
    const track = trackRef.current;
    const sticky = stickyRef.current;

    if (!isScrollMode || !track || !sticky) {
      setActive(index);
      return;
    }

    const scrollable = track.offsetHeight - sticky.offsetHeight;
    const stickyTop = parseFloat(getComputedStyle(sticky).top) || 0;
    const trackTop = track.getBoundingClientRect().top + window.scrollY;

    window.scrollTo({
      top: trackTop - stickyTop + scrollable * ((index + 0.1) / total),
    });
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const next = nextIndexForKey(event.key, index, total);
    if (next === null) return;

    event.preventDefault();
    goTo(next);
    tabRefs.current[next]?.focus();
  }

  const step = steps[active];
  if (!step) return null;

  const panelId = `${baseId}-panel`;
  const titleId = `${baseId}-title`;

  return (
    <SellSection id="how" ariaLabel="Як почати продавати">
      <div
        ref={trackRef}
        className={styles.track}
        style={{ "--steps": total } as CSSProperties}
      >
        <div ref={stickyRef} className={styles.sticky}>
          <div className={styles.heading}>
            <span className={styles.eyebrow}>Як почати</span>
            <h2 id={titleId} className={styles.title}>
              Чотири кроки до перших продажів
            </h2>
            <p className={styles.subtitle}>
              Від заявки до першого замовлення — зазвичай менше тижня.
            </p>
          </div>

          <div className={styles.layout}>
            <div
              ref={tabsRef}
              role="tablist"
              aria-labelledby={titleId}
              aria-orientation="vertical"
              className={styles.tabs}
            >
              {steps.map((item, index) => {
                const isActive = index === active;
                const isDone = index < active;

                return (
                  <button
                    key={item.title}
                    ref={(node) => {
                      tabRefs.current[index] = node;
                    }}
                    type="button"
                    role="tab"
                    id={`${baseId}-tab-${index}`}
                    aria-selected={isActive}
                    aria-controls={panelId}
                    tabIndex={isActive ? 0 : -1}
                    className={`${styles.tab} ${isActive ? styles.tabActive : ""} ${isDone ? styles.tabDone : ""}`}
                    onClick={() => goTo(index)}
                    onKeyDown={(event) => handleKeyDown(event, index)}
                  >
                    <span className={styles.tabNumber}>
                      {isDone ? <IconCheck size={20} /> : index + 1}
                    </span>
                    <span className={styles.tabText}>
                      <span className={styles.tabTitle}>{item.title}</span>
                      <span className={styles.tabDuration}>{item.duration}</span>
                    </span>
                  </button>
                );
              })}
            </div>

            <div
              ref={panelRef}
              role="tabpanel"
              id={panelId}
              aria-labelledby={`${baseId}-tab-${active}`}
              className={styles.panel}
            >
              {isScrollMode && (
                <span className={styles.progress} aria-hidden="true">
                  <span className={styles.progressFill} />
                </span>
              )}

              {/* key перезапускает анимацию появления при смене шага */}
              <div key={active} className={styles.panelBody}>
                <span className={styles.panelStep}>
                  Крок {active + 1} з {total} · {step.duration}
                </span>
                <h3 className={styles.panelTitle}>{step.title}</h3>
                <p className={styles.panelText}>{step.text}</p>

                <ul className={styles.points}>
                  {step.points.map((point) => (
                    <li key={point} className={styles.point}>
                      <span className={styles.pointIcon}>
                        <IconCheck size={16} />
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

              <span className={styles.bigNumber} aria-hidden="true">
                0{active + 1}
              </span>
            </div>
          </div>
        </div>
      </div>
    </SellSection>
  );
}