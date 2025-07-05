import { type ClassValue } from "clsx";
export declare function cn(...inputs: ClassValue[]): string;
export declare function formatDistance(meters: number): string;
export declare function formatOperatingHours(
  hours:
    | Record<
        string,
        {
          open: string;
          close: string;
        }
      >
    | undefined,
): string;
export declare function getStatusColor(status: string): string;
//# sourceMappingURL=utils.d.ts.map
