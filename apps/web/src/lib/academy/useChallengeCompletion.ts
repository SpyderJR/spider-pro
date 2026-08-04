import { useEffect, useState } from "react";
import { ACADEMY_CHALLENGES, subscribeToChallengeSources } from "./challenges";

export function useChallengeCompletion(challengeId: string): boolean {
  const challenge = ACADEMY_CHALLENGES[challengeId];
  const [met, setMet] = useState(() => challenge?.isMet() ?? false);

  useEffect(() => {
    if (!challenge) return;
    setMet(challenge.isMet());
    return subscribeToChallengeSources(() => setMet(challenge.isMet()));
  }, [challenge]);

  return met;
}
