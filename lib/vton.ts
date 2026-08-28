export type VtonStatus =
  | "idle"
  | "connecting"
  | "active"
  | "stopped"
  | "error";

export interface VtonSession {
  status: VtonStatus;
  garmentId: number;
  mock: boolean;
}

export function createMockVtonSession(
  garmentId: number
): VtonSession {
  return {
    status: "active",
    garmentId,
    mock: true,
  };
}

export function stopVtonSession(): VtonSession {
  return {
    status: "stopped",
    garmentId: 0,
    mock: true,
  };
}