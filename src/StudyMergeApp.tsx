import React, { useEffect } from "react";
import { AppState } from "react-native";

import { shouldPauseGameForAppStateChange } from "./appLifecycle";
import { CategorySelectScreen } from "./screens/CategorySelectScreen";
import { GameScreen } from "./screens/GameScreen";
import { OnboardingScreen } from "./screens/OnboardingScreen";
import { ResultScreen } from "./screens/ResultScreen";
import { ReviewScreen } from "./screens/ReviewScreen";
import { StatsScreen } from "./screens/StatsScreen";
import { SubjectSelectScreen } from "./screens/SubjectSelectScreen";
import { UnitSelectScreen } from "./screens/UnitSelectScreen";
import { useAppStore } from "./store/useAppStore";
import { ScreenName } from "./types/models";

const screenByName: Record<ScreenName, React.ComponentType> = {
  onboarding: OnboardingScreen,
  category: CategorySelectScreen,
  subject: SubjectSelectScreen,
  unit: UnitSelectScreen,
  game: GameScreen,
  review: ReviewScreen,
  stats: StatsScreen,
  result: ResultScreen,
};

export function StudyMergeApp() {
  const activeScreen = useAppStore((state) => state.activeScreen);
  const pauseGame = useAppStore((state) => state.pauseGame);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextState) => {
      const { currentGame } = useAppStore.getState();
      if (!shouldPauseGameForAppStateChange(nextState, currentGame)) {
        return;
      }

      pauseGame();
    });

    return () => subscription.remove();
  }, [pauseGame]);

  const ActiveScreen = screenByName[activeScreen] ?? CategorySelectScreen;
  return <ActiveScreen />;
}
