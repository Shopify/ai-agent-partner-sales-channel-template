import { authenticate } from "app/shopify.server";

export class PartnerProjectLinks {
  protected admin: Awaited<ReturnType<typeof authenticate.admin>>["admin"];
  protected session: Awaited<ReturnType<typeof authenticate.admin>>["session"];

  constructor({
    admin,
    session,
  }: Awaited<ReturnType<typeof authenticate.admin>>) {
    this.admin = admin;
    this.session = session;
  }

  static async fromRequest(request: Readonly<Request>) {
    const admin = await authenticate.admin(request);
    return new this(admin);
  }

  /** A URL that a merchant can use to preview their vibe coded storefront */
  async getProjectFrontendUrl() {
    return (
      (await this.getProjectUrlFromRedirectTheme()) ??
      `https://project.example.com`
    );
  }

  /** A URL the merchant can use to reach the vibe code agent to modify their storefront */
  async getProjectManagementUrl() {
    return "https://example.app";
  }

  private async getProjectUrlFromRedirectTheme() {
    const redirectThemeIdResponse = await this.admin.graphql(`#graphql
      query RedirectThemeIdMetafield {
        shop { metafield(namespace: "vibe_partner", key: "redirect_theme_id") { value } }
      }
    `);

    const redirectThemeData = await redirectThemeIdResponse.json();
    const themeId = redirectThemeData.data?.shop?.metafield?.value as
      | string
      | undefined;
    let redirectUrl: string | null = null;

    if (themeId) {
      try {
        const themeSettingsResponse = await this.admin.graphql(
          `#graphql
            query Theme($id: ID!) {
              theme(id: $id) {
                id
                name
                role
                files(filenames: ["config/settings_data.json"]) {
                  edges { node { filename body { ... on OnlineStoreThemeFileBodyText { content } } } }
                }
              }
            }
          `,
          { variables: { id: themeId } },
        );

        const themeData = await themeSettingsResponse.json();
        const settingsFile = themeData.data?.theme?.files?.edges?.[0]?.node
          ?.body?.content as string | undefined;

        if (settingsFile) {
          const settings = JSON.parse(
            settingsFile.slice(settingsFile.indexOf("{")),
          );
          const hostname = settings.current?.storefront_hostname as
            | string
            | undefined;
          if (hostname) redirectUrl = `https://${hostname}`;
        }
      } catch (error) {
        console.error("Error fetching theme settings:", error);
      }
    }

    return redirectUrl;
  }
}
