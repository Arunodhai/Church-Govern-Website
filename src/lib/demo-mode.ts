export type AppEnvironment = "development" | "staging" | "production";

export function resolveAppEnvironment(
  appEnv: string | null | undefined = process.env.APP_ENV,
  vercelEnv: string | null | undefined = process.env.VERCEL_ENV,
  nodeEnv: string | null | undefined = process.env.NODE_ENV,
): AppEnvironment {
  if (appEnv === "development" || appEnv === "staging" || appEnv === "production") return appEnv;
  if (vercelEnv === "preview") return "staging";
  if (nodeEnv === "development" || nodeEnv === "test") return "development";
  return "production";
}

export function isMockContentMode(
  nodeEnv: string | null | undefined = process.env.NODE_ENV,
  flag: string | null | undefined = process.env.USE_MOCK_CONTENT,
  appEnv: string | null | undefined = process.env.APP_ENV,
  vercelEnv: string | null | undefined = process.env.VERCEL_ENV,
) {
  return resolveAppEnvironment(appEnv, vercelEnv, nodeEnv) !== "production" && flag !== "false";
}

export function isMockOperationsMode(
  nodeEnv: string | null | undefined = process.env.NODE_ENV,
  flag: string | null | undefined = process.env.USE_MOCK_OPERATIONS,
  appEnv: string | null | undefined = process.env.APP_ENV,
  vercelEnv: string | null | undefined = process.env.VERCEL_ENV,
) {
  const environment = resolveAppEnvironment(appEnv, vercelEnv, nodeEnv);
  if (environment === "production") return false;
  if (flag != null) return flag === "true";
  return environment === "development";
}

export function isSanityContentDemoMode(
  nodeEnv: string | null | undefined = process.env.NODE_ENV,
  flag: string | null | undefined = process.env.SANITY_CONTENT_DEMO_MODE,
  appEnv: string | null | undefined = process.env.APP_ENV,
  vercelEnv: string | null | undefined = process.env.VERCEL_ENV,
) {
  return resolveAppEnvironment(appEnv, vercelEnv, nodeEnv) !== "production" && flag === "true";
}

export function isMockEngagementMode(
  nodeEnv: string | null | undefined = process.env.NODE_ENV,
  contentFlag: string | null | undefined = process.env.USE_MOCK_CONTENT,
  operationsFlag: string | null | undefined = process.env.USE_MOCK_OPERATIONS,
  appEnv: string | null | undefined = process.env.APP_ENV,
  vercelEnv: string | null | undefined = process.env.VERCEL_ENV,
) {
  return isMockContentMode(nodeEnv, contentFlag, appEnv, vercelEnv)
    && isMockOperationsMode(nodeEnv, operationsFlag, appEnv, vercelEnv);
}

/** @deprecated Use isMockContentMode or isMockOperationsMode explicitly. */
export const isDevelopmentDemoMode = isMockContentMode;
