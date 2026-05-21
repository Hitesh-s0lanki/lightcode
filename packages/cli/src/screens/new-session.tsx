import { useEffect } from "react";
import { useNavigate, useLocationState } from "../providers/router";
import { SessionShell } from "../components/session-shell";
import { UserMessage, BotMessage } from "../components/messages";

export function NewSession() {
  const navigate = useNavigate();
  const state = useLocationState<{ message?: string }>();

  useEffect(() => {
    if (!state?.message) {
      navigate("/", {});
    }
  }, [state, navigate]);

  if (!state?.message) return null;

  return (
    <SessionShell onSubmit={() => {}} inputDisabled loading>
      <UserMessage message={state.message} />
      <BotMessage content="" loading />
    </SessionShell>
  );
}
