export interface HealthResponseDto {
  status: "ok" | "degraded" | "error";
  timestamp: string;
  uptime: number;
}
