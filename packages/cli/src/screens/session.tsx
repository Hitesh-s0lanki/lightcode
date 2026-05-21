import { useParams } from "../providers/router";
import { SessionShell } from "../components/session-shell";

export function Session() {
  const { id } = useParams<{ id: string }>();

  return (
    <SessionShell
      onSubmit={() => {}}
      inputDisabled={false}
      loading={false}
    />
  );
}
