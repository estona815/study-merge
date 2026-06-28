import { AppStateStatus } from "react-native";

import { GameSession } from "./types/models";

export function shouldPauseGameForAppStateChange(
  nextState: AppStateStatus,
  currentGame?: GameSession,
): boolean {
  if (!currentGame || currentGame.paused) {
    return false;
  }

  return nextState === "inactive" || nextState === "background";
}
