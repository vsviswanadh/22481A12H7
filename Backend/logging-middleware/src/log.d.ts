declare const validStacks: readonly ["backend", "frontend"];
declare const validLevels: readonly ["debug", "info", "warn", "error", "fatal"];
declare const validPackages: {
    readonly backend: readonly ["cache", "controller", "cron_job", "db", "domain", "handler", "repository", "route", "service"];
    readonly frontend: readonly ["api", "component", "hook", "page", "state", "style"];
    readonly common: readonly ["auth", "config", "middleware", "utils"];
};
type Stack = typeof validStacks[number];
type Level = typeof validLevels[number];
type Package = typeof validPackages.backend[number] | typeof validPackages.frontend[number] | typeof validPackages.common[number];
export declare function Log(stack: Stack, level: Level, pkg: Package, message: string): Promise<void>;
export {};
//# sourceMappingURL=log.d.ts.map