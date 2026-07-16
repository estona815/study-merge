import { Button, TDSMobileProvider, TextField } from "@toss/tds-mobile";
import { createRoot } from "react-dom/client";
import { type ReactNode, useEffect, useMemo, useState } from "react";

import mascotSource from "../../../assets/daesin/mascot.png";
import * as flowModule from "./flow.mjs";
import "./styles.css";

type Screen =
  | "adult"
  | "gate"
  | "hunger"
  | "options"
  | "timer"
  | "swap"
  | "plan"
  | "complete";
type ChoiceId = "delay" | "swap" | "plan";
type IconName =
  | "arrow-left"
  | "calendar"
  | "check"
  | "chevron-right"
  | "clock"
  | "heart"
  | "moon"
  | "music"
  | "sparkle";

interface CravingOption {
  id: ChoiceId;
  icon: IconName;
  accent: "pink" | "lilac" | "ice";
  title: string;
  detail: string;
}

interface DetailChoice {
  id: string;
  icon?: IconName;
  title?: string;
  label?: string;
}

interface FlowModule {
  QUICK_FOODS: string[];
  CRAVING_OPTIONS: CravingOption[];
  RESET_ACTIONS: DetailChoice[];
  PLAN_TIMES: DetailChoice[];
  normalizeFood(value: string): string;
  canStartCravingGate(input: { adultConfirmed: boolean; food: string }): boolean;
  nextScreenForOption(optionId: string): "timer" | "swap" | "plan" | "options";
  isValidDetailSelection(optionId: string, value: string): boolean;
  formatCountdown(value: number): string;
}

const {
  CRAVING_OPTIONS,
  PLAN_TIMES,
  QUICK_FOODS,
  RESET_ACTIONS,
  canStartCravingGate,
  formatCountdown,
  isValidDetailSelection,
  nextScreenForOption,
} = flowModule as unknown as FlowModule;

function Icon({ name, size = 24 }: { name: IconName; size?: number }) {
  const common = {
    "aria-hidden": true,
    className: "svg-icon",
    fill: "none",
    focusable: "false" as const,
    height: size,
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 1.8,
    viewBox: "0 0 24 24",
    width: size,
  };

  if (name === "arrow-left") {
    return <svg {...common}><path d="m15 18-6-6 6-6" /><path d="M9 12h10" /></svg>;
  }
  if (name === "chevron-right") {
    return <svg {...common}><path d="m9 18 6-6-6-6" /></svg>;
  }
  if (name === "check") {
    return <svg {...common}><path d="m5 12.5 4.2 4.2L19 7" /></svg>;
  }
  if (name === "clock") {
    return <svg {...common}><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></svg>;
  }
  if (name === "calendar") {
    return <svg {...common}><rect x="4" y="5.5" width="16" height="14" rx="2.5" /><path d="M8 3.5v4M16 3.5v4M4 10h16M8 14h2M14 14h2" /></svg>;
  }
  if (name === "heart") {
    return <svg {...common}><path d="M12 20s-7.5-4.4-7.5-10.1A4.2 4.2 0 0 1 12 7.2a4.2 4.2 0 0 1 7.5 2.7C19.5 15.6 12 20 12 20Z" fill="currentColor" stroke="none" /></svg>;
  }
  if (name === "moon") {
    return <svg {...common}><path d="M19 15.2A8 8 0 0 1 8.8 5a8.1 8.1 0 1 0 10.2 10.2Z" /></svg>;
  }
  if (name === "music") {
    return <svg {...common}><path d="M9 18V6l10-2v11" /><circle cx="6.5" cy="18" r="2.5" /><circle cx="16.5" cy="15" r="2.5" /></svg>;
  }
  return <svg {...common}><path d="M12 3.5 13.7 9l5.3 1.8-5.3 1.8L12 18l-1.7-5.4L5 10.8 10.3 9 12 3.5Z" /><path d="m18.5 3 .6 1.9L21 5.5l-1.9.6-.6 1.9-.6-1.9-1.9-.6 1.9-.6.6-1.9Z" /></svg>;
}

function Mascot({ className = "", decorative = false, size = 96 }: { className?: string; decorative?: boolean; size?: number }) {
  return (
    <img
      alt={decorative ? "" : "하트 모양 버튼이 있는 대신 캐릭터"}
      aria-hidden={decorative || undefined}
      className={`mascot ${className}`}
      height={size}
      src={mascotSource}
      width={size}
    />
  );
}

function ScreenFrame({ children, className = "", footer }: { children: ReactNode; className?: string; footer?: ReactNode }) {
  return (
    <main className={`screen ${className}`}>
      <div className="screen-scroll">
        <div className="screen-content">{children}</div>
      </div>
      {footer ? <div className="action-dock">{footer}</div> : null}
    </main>
  );
}

function ScreenHeader({ label, onBack }: { label: string; onBack: () => void }) {
  return (
    <header className="screen-header">
      <button aria-label="이전 화면" className="icon-button" onClick={onBack} type="button">
        <Icon name="arrow-left" />
      </button>
      <span className="step-label">{label}</span>
      <Mascot className="header-mascot" decorative size={52} />
    </header>
  );
}

function PrimaryAction({ children, disabled = false, onClick }: { children: ReactNode; disabled?: boolean; onClick: () => void }) {
  return (
    <div className="primary-action">
      <Button color="primary" disabled={disabled} display="block" onClick={onClick} size="xlarge">
        {children}
      </Button>
    </div>
  );
}

function SelectedStatus() {
  return <span className="selected-status"><Icon name="check" size={15} />선택됨</span>;
}

function DetailOptionButton({ item, onSelect, selected }: { item: DetailChoice; onSelect: () => void; selected: boolean }) {
  return (
    <button
      aria-pressed={selected}
      className={`detail-option${selected ? " selected" : ""}`}
      onClick={onSelect}
      type="button"
    >
      <span className="detail-icon"><Icon name={item.icon ?? "clock"} size={22} /></span>
      <span className="detail-copy">{item.title ?? item.label}</span>
      {selected ? <SelectedStatus /> : <Icon name="chevron-right" size={20} />}
    </button>
  );
}

function MobileSurface({ children }: { children: ReactNode }) {
  return <div className="mobile-prototype">{children}</div>;
}

function hungerLabel(value: number) {
  if (value <= 3) return "가볍게 느껴져요";
  if (value <= 7) return "중간쯤이에요";
  return "많이 느껴져요";
}

const previewScreen = (() => {
  const isLocalPreview = ["localhost", "127.0.0.1"].includes(globalThis.location?.hostname ?? "");
  if (!isLocalPreview) return null;

  const candidate = new URLSearchParams(globalThis.location.search).get("preview");
  const screens: Screen[] = ["adult", "gate", "hunger", "options", "timer", "swap", "plan", "complete"];
  return screens.includes(candidate as Screen) ? candidate as Screen : null;
})();

function App() {
  const [screen, setScreen] = useState<Screen>(previewScreen ?? "adult");
  const [adultConfirmed, setAdultConfirmed] = useState(previewScreen !== null && previewScreen !== "adult");
  const [food, setFood] = useState(previewScreen && previewScreen !== "adult" ? "치킨" : "");
  const [hunger, setHunger] = useState(5);
  const [choice, setChoice] = useState<ChoiceId | null>(previewScreen === "timer" || previewScreen === "complete" ? "delay" : null);
  const [seconds, setSeconds] = useState(5 * 60);
  const [swapAction, setSwapAction] = useState("");
  const [planTime, setPlanTime] = useState("");
  const [completionDetail, setCompletionDetail] = useState(previewScreen === "complete" ? "5분을 기다린 뒤 다시 골랐어요." : "");

  const normalizedFood = useMemo(() => flowModule.normalizeFood(food), [food]);
  const selectedOption = CRAVING_OPTIONS.find((option) => option.id === choice) ?? null;

  useEffect(() => {
    if (screen !== "timer") return;
    const timer = window.setInterval(() => setSeconds((value) => Math.max(0, value - 1)), 1_000);
    return () => window.clearInterval(timer);
  }, [screen]);

  useEffect(() => {
    if (screen === "timer" && seconds === 0) {
      setCompletionDetail("5분을 기다린 뒤 다시 골랐어요.");
      setScreen("complete");
    }
  }, [screen, seconds]);

  const startGate = () => {
    if (canStartCravingGate({ adultConfirmed, food })) setScreen("hunger");
  };

  const selectOption = (optionId: ChoiceId) => {
    setChoice(optionId);
    setCompletionDetail("");
    if (optionId === "delay") setSeconds(5 * 60);
    setScreen(nextScreenForOption(optionId));
  };

  const resetFlow = () => {
    setFood("");
    setHunger(5);
    setChoice(null);
    setSeconds(5 * 60);
    setSwapAction("");
    setPlanTime("");
    setCompletionDetail("");
    setScreen("gate");
  };

  if (screen === "adult") {
    return (
      <MobileSurface>
        <ScreenFrame
          className="hero-screen"
          footer={<PrimaryAction disabled={!adultConfirmed} onClick={() => setScreen("gate")}>만 19세 이상이며 시작할게요</PrimaryAction>}
        >
          <div className="hero-copy">
            <div className="brand-lockup"><h1>대신</h1><span className="brand-moon"><Icon name="moon" size={31} /></span></div>
            <p>배달앱보다 5분 먼저 열어요</p>
          </div>
          <div className="hero-visual">
            <span className="hero-halo" aria-hidden="true" />
            <Mascot className="hero-mascot" size={210} />
          </div>
          <p className="hero-prompt">먹지 말라고 혼내지 않아요.<br />지금의 선택을 잠깐 같이 살펴봐요.</p>
          <label className={`age-card${adultConfirmed ? " selected" : ""}`}>
            <input
              aria-describedby="adult-disclaimer"
              checked={adultConfirmed}
              onChange={(event) => setAdultConfirmed(event.target.checked)}
              type="checkbox"
            />
            <span>만 19세 이상이에요</span>
            {adultConfirmed ? <SelectedStatus /> : null}
          </label>
          <p className="disclaimer" id="adult-disclaimer">대신은 의료·치료 서비스가 아닙니다. 중요한 결정은 스스로 내리고, 필요한 경우 전문가의 도움을 받아주세요.</p>
        </ScreenFrame>
      </MobileSurface>
    );
  }

  if (screen === "gate") {
    return (
      <MobileSurface>
        <ScreenFrame footer={<PrimaryAction disabled={!canStartCravingGate({ adultConfirmed, food })} onClick={startGate}>다음</PrimaryAction>}>
          <ScreenHeader label="1 / 3" onBack={() => setScreen("adult")} />
          <section className="title-block title-with-mascot">
            <div><span className="eyebrow">지금 이 순간</span><h1>뭐가 먹고<br />싶으세요?</h1></div>
            <Mascot decorative size={82} />
          </section>
          <p className="body-copy">한 단어만 적어도 괜찮아요. 입력한 내용은 이 흐름 안에서만 사용돼요.</p>
          <div className="night-field">
            <TextField
              label="먹고 싶은 음식"
              labelOption="sustain"
              onChange={(event) => setFood(event.target.value)}
              placeholder="예: 치킨, 떡볶이, 라면"
              value={food}
              variant="box"
            />
          </div>
          <div aria-label="빠른 음식 선택" className="food-list">
            {QUICK_FOODS.map((item) => {
              const selected = normalizedFood === item;
              return (
                <button
                  aria-pressed={selected}
                  className={`food-card${selected ? " selected" : ""}`}
                  key={item}
                  onClick={() => setFood(item)}
                  type="button"
                >
                  <span>{item}</span>
                  {selected ? <SelectedStatus /> : <Icon name="chevron-right" size={20} />}
                </button>
              );
            })}
          </div>
        </ScreenFrame>
      </MobileSurface>
    );
  }

  if (screen === "hunger") {
    return (
      <MobileSurface>
        <ScreenFrame footer={<PrimaryAction onClick={() => setScreen("options")}>선택지 보기</PrimaryAction>}>
          <ScreenHeader label="2 / 3" onBack={() => setScreen("gate")} />
          <section className="title-block title-with-mascot">
            <div><span className="eyebrow">몸의 신호 확인</span><h1>배고픔은<br />어느 쪽에 가까워요?</h1></div>
            <Mascot decorative size={82} />
          </section>
          <p className="body-copy"><strong>{normalizedFood}</strong>이 떠오른 지금 느낌을 숫자로 가볍게 골라보세요.</p>
          <section className="range-card">
            <div className="range-value"><output htmlFor="hunger-range">{hunger}</output><span>/ 10</span></div>
            <input
              aria-label="현재 배고픔 정도"
              aria-valuetext={`${hunger}, ${hungerLabel(hunger)}`}
              id="hunger-range"
              max="10"
              min="0"
              onChange={(event) => setHunger(Number(event.target.value))}
              step="1"
              type="range"
              value={hunger}
            />
            <div className="range-labels"><span>가볍게 느껴져요</span><span>많이 느껴져요</span></div>
            <div className="range-selected"><Icon name="check" size={17} /><strong>{hunger}단계 선택됨</strong><span>{hungerLabel(hunger)}</span></div>
          </section>
          <div className="reassurance"><Icon name="heart" size={20} /><span>숫자에는 정답이 없어요. 지금 느끼는 만큼이면 충분해요.</span></div>
        </ScreenFrame>
      </MobileSurface>
    );
  }

  if (screen === "options") {
    return (
      <MobileSurface>
        <ScreenFrame className="options-screen">
          <ScreenHeader label="3 / 3" onBack={() => setScreen("hunger")} />
          <section className="title-block centered-title"><span className="eyebrow">나에게 맞는 다음 행동</span><h1>지금 가능한<br />세 가지 선택이에요</h1><p>순서는 상관없고, 어느 선택이든 괜찮아요.</p></section>
          <div className="option-cards">
            {CRAVING_OPTIONS.map((option) => (
              <button
                aria-label={`${option.title}. ${option.detail}`}
                className={`action-card accent-${option.accent}`}
                key={option.id}
                onClick={() => selectOption(option.id)}
                type="button"
              >
                <span className="action-icon"><Icon name={option.icon} size={34} /></span>
                <strong>{option.title}</strong>
                <small>{option.detail}</small>
              </button>
            ))}
          </div>
          <div className="mascot-bubble"><div><strong>천천히 골라봐요.</strong><span>내가 고른 선택이 오늘의 답이에요.</span></div><Mascot decorative size={92} /></div>
        </ScreenFrame>
      </MobileSurface>
    );
  }

  if (screen === "timer") {
    return (
      <MobileSurface>
        <ScreenFrame
          className="timer-screen"
          footer={<PrimaryAction onClick={() => { setCompletionDetail("원하는 순간에 선택을 마쳤어요."); setScreen("complete"); }}>지금 선택 마치기</PrimaryAction>}
        >
          <ScreenHeader label="5분 보류" onBack={() => setScreen("options")} />
          <section className="title-block centered-title"><span className="eyebrow">잠깐의 여유</span><h1>5분만,<br />나를 위해 쉬어가요</h1><p>타이머가 끝나도 무엇을 할지는 내가 다시 골라요.</p></section>
          <div className="timer-orb">
            <span className="timer-dot" aria-hidden="true" />
            <Mascot decorative size={86} />
            <time aria-label={`남은 시간 ${Math.floor(seconds / 60)}분 ${seconds % 60}초`}>{formatCountdown(seconds)}</time>
          </div>
          <div className="timer-tip"><Icon name="moon" size={21} /><span>화면을 잠시 내려놓아도 타이머는 계속 흘러가요.</span></div>
        </ScreenFrame>
      </MobileSurface>
    );
  }

  if (screen === "swap") {
    return (
      <MobileSurface>
        <ScreenFrame
          footer={<PrimaryAction disabled={!isValidDetailSelection("swap", swapAction)} onClick={() => {
            const selected = RESET_ACTIONS.find((item) => item.id === swapAction);
            if (!selected || !isValidDetailSelection("swap", swapAction)) return;
            setCompletionDetail(selected.title ?? "다른 행동을 골랐어요.");
            setScreen("complete");
          }}>이 행동으로 정할게요</PrimaryAction>}
        >
          <ScreenHeader label="다른 행동" onBack={() => setScreen("options")} />
          <section className="title-block title-with-mascot"><div><span className="eyebrow">짧은 기분 전환</span><h1>5분 동안<br />뭘 해볼까요?</h1></div><Mascot decorative size={82} /></section>
          <p className="body-copy">주문 화면에서 잠깐 나와, 지금 할 수 있는 행동 하나만 골라요.</p>
          <div className="detail-list">
            {RESET_ACTIONS.map((item) => <DetailOptionButton item={item} key={item.id} onSelect={() => setSwapAction(item.id)} selected={swapAction === item.id} />)}
          </div>
          <div className="reassurance"><Icon name="sparkle" size={20} /><span>끝까지 해야 하는 약속이 아니에요. 마음이 바뀌어도 괜찮아요.</span></div>
        </ScreenFrame>
      </MobileSurface>
    );
  }

  if (screen === "plan") {
    return (
      <MobileSurface>
        <ScreenFrame
          footer={<PrimaryAction disabled={!isValidDetailSelection("plan", planTime)} onClick={() => {
            const selected = PLAN_TIMES.find((item) => item.id === planTime);
            if (!selected || !isValidDetailSelection("plan", planTime)) return;
            setCompletionDetail(selected.label ?? "다시 볼 시간을 정했어요.");
            setScreen("complete");
          }}>이 시간으로 정할게요</PrimaryAction>}
        >
          <ScreenHeader label="다시 볼 시간" onBack={() => setScreen("options")} />
          <section className="title-block title-with-mascot"><div><span className="eyebrow">내가 정하는 다음 순간</span><h1>언제 다시<br />결정해 볼까요?</h1></div><Mascot decorative size={82} /></section>
          <p className="body-copy">지금 바로 결론 내리지 않아도 괜찮아요. 다시 볼 시간을 직접 정해요.</p>
          <div className="detail-list">
            {PLAN_TIMES.map((item) => <DetailOptionButton item={item} key={item.id} onSelect={() => setPlanTime(item.id)} selected={planTime === item.id} />)}
          </div>
          <div className="reassurance"><Icon name="calendar" size={20} /><span>알림을 보내거나 일정을 만들지 않아요. 선택한 시간만 이 화면에 남겨요.</span></div>
        </ScreenFrame>
      </MobileSurface>
    );
  }

  return (
    <MobileSurface>
      <ScreenFrame className="complete-screen" footer={<PrimaryAction onClick={resetFlow}>처음으로</PrimaryAction>}>
        <div className="completion-heading"><Icon name="sparkle" size={20} /><h1>잘 골랐어요</h1><Icon name="sparkle" size={20} /></div>
        <div className="success-aura"><Mascot size={190} /></div>
        <div className="completion-copy"><h2>나를 위해 직접 선택했어요.</h2><p>먹었는지보다, 잠깐 멈추고 고른 순간을 기억해요.</p></div>
        <dl className="choice-summary">
          <div><dt>떠올린 음식</dt><dd>{normalizedFood}</dd></div>
          <div><dt>나의 선택</dt><dd>{selectedOption?.title ?? "직접 고른 선택"}</dd></div>
          {completionDetail ? <div><dt>정한 내용</dt><dd>{completionDetail}</dd></div> : null}
        </dl>
        <p className="completion-note"><Icon name="heart" size={18} />다음에도 배달앱보다 먼저 대신을 열어보세요.</p>
      </ScreenFrame>
    </MobileSurface>
  );
}

const userAgent = globalThis.navigator?.userAgent ?? "";

createRoot(document.getElementById("root")!).render(
  <TDSMobileProvider
    userAgent={{
      fontA11y: undefined,
      fontScale: undefined,
      isAndroid: /Android/i.test(userAgent),
      isIOS: /iPhone|iPad|iPod/i.test(userAgent),
    }}
  >
    <App />
  </TDSMobileProvider>,
);
