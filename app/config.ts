export interface PartnerConfig {
  name: string;
  logo: string;
  supportUrl: string;
  docsUrl: string;
  termsOfServiceUrl: string;
  publicApiKey: string;
  afterAuthRedirectUrl: string;
  isStagingEnv?: boolean;
}

export type PartnerConfigSerializable = Omit<
  PartnerConfig,
  "afterAuthRedirectUrl" | "isStagingEnv"
>;

/**
 *
 * Strips out server only properties on the partner config
 */
export function getSerializableConfig({
  afterAuthRedirectUrl: _afterAuthRedirectUrl,
  isStagingEnv: _isStagingEnv,
  ...config
}: PartnerConfig) {
  return config;
}

export const config = {
  /** Your company name as it will appear in copy around the site */
  name: "EZ Vibes",
  logo: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none"><rect width="200" height="200" rx="40" fill="#6366F1"/><path d="M60 70L90 100L60 130" stroke="white" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/><circle cx="130" cy="100" r="8" fill="white"/><circle cx="155" cy="100" r="8" fill="white"/></svg>',
  supportUrl: "https://support.example.app",
  /** If you have specific partnership docs, enter them here. Otherwise your general documentation. */
  docsUrl: "https://docs.example.app",
  publicApiKey: process.env.SHOPIFY_API_KEY!,
  afterAuthRedirectUrl: "#",
  termsOfServiceUrl: "https://example.app/terms",
  isStagingEnv: false,
} satisfies PartnerConfig;
