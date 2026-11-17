# Technical reference

Use this page for implementation details and the [merchant journey](merchant_journey/overall_merchant_flow.md#the-flow-at-a-glance) for the experience you need to build. Follow the [content guidelines](merchant_journey/overall_content_guidelines.md#principles) for merchant-facing copy and [agent responses](merchant_journey/overall_content_guidelines.md#talking-about-shopify---principles-for-your-agent).

- [Get access](#get-access)
- [Apps and access tokens](#apps-and-access-tokens)
- [Create and claim a new store](#create-and-claim-a-new-store)
- [Connect an existing store](#connect-an-existing-store)
- [Access store APIs](#access-store-apis)
- [Security and compliance](#security-and-compliance)

## Get access

1. Create a [Shopify Partner account](https://www.shopify.com/partners) if your organization does not have one. The account owner's email is the owner email for stores you create until a merchant claims them.
2. Contact Shopify with your Partner account email, organization name, and platform name to request Vibe Store API access.
3. Once access is enabled, open **App Distribution → Visit Dev Dashboard → Start from Dev Dashboard** to create your Partner App. Record its Client ID and Client Secret from **Your App → Settings**.
4. Share the Partner App's Client ID with your Shopify representative so they can grant it Vibe Store API permissions.
5. Build and host your Sales Channel App using [this template's setup instructions](../README.md#partner-specific-setup). Shopify converts the app into a sales channel during onboarding; this conversion is irreversible.

You can integrate the Vibe Store APIs and build the Sales Channel App in parallel. Automatic installation on new stores is available only after the Sales Channel App passes Shopify's app review. Until then, omit `autoinstall_client_id` when creating stores and install the app manually with the Shopify CLI for end-to-end testing.

## Apps and access tokens

The integration uses two separate apps. Do not mix their credentials.

| App | Purpose | Credentials and tokens |
| --- | --- | --- |
| **Partner App** | Calls the Vibe Store APIs to create development stores, check transfer eligibility, and generate claim URLs. | Its Client ID and Client Secret generate a global access token. |
| **Sales Channel App** | Is installed in each store and provides store-specific API access, product publishing, and a surface in Shopify admin. | Its own Client ID and Client Secret generate Admin API tokens and support creating Storefront API tokens. |

A **development store** is a store created through the Vibe Store APIs. Your organization owns it until the merchant claims it. Use "your store," not "development store," in merchant-facing copy.

| Token | Use | Lifetime and restrictions |
| --- | --- | --- |
| **Global access token** | Partner App requests to the Vibe Store APIs. | Approximately 60 minutes. Keep server-side. |
| **Offline Admin API token** | Server-to-server access before a store is claimed; also required to create Storefront API tokens. | The pre-claim `client_credentials` token lasts 24 hours. Other offline token flows have their own [expiry and refresh rules](https://shopify.dev/docs/apps/build/authentication-authorization/access-tokens/offline-access-tokens). Keep server-side. |
| **Online Admin API token** | Required for user-directed Admin API operations after claim and for existing stores. | User-specific; expires on logout or after 24 hours. Enforces the user's permissions, returning `403 Forbidden` for disallowed resources. Keep server-side. See [online access tokens](https://shopify.dev/docs/apps/build/authentication-authorization/access-tokens/online-access-tokens). |
| **Public Storefront API token** | Frontend product queries and buyer carts. | Safe to expose in client-side code. Does not expire until revoked. Only returns products published to your channel. |

## Create and claim a new store

**Merchant experience:** [Propose Shopify before the click](merchant_journey/integrate_with_shopify.md#communicate-what-shopify-is-and-what-the-merchant-agrees-to), then [ask whether the merchant needs a new store](merchant_journey/create_and_claim_store.md#create-a-new-store-question).

### Authenticate the Partner App

Send `POST https://api.shopify.com/auth/access_token` with `Content-Type: application/json`:

```json
{
  "client_id": "<PARTNER_APP_CLIENT_ID>",
  "client_secret": "<PARTNER_APP_CLIENT_SECRET>",
  "grant_type": "client_credentials"
}
```

The response's `access_token` is your global access token. Use `Authorization: Bearer <GLOBAL_ACCESS_TOKEN>` and `Content-Type: application/json` for the create and transfer requests below.

### Create the store

Send `POST https://partners.shopify.com/api/dev_stores` with these JSON body parameters:

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `store_name` | String | Yes | Name for the new store. Suffix it with a short hash to avoid name collisions, for example `my-shoe-store-4ec2fe`. |
| `country_code` | String | No, but **strongly recommended** | The merchant's country code, for example `CA` or `US`. Provide it for improved merchant onboarding. The API normalizes the value to uppercase. |
| `autoinstall_client_id` | String | No | Your Sales Channel App's Client ID. Include it only after app review; otherwise omit it and install the app manually with the Shopify CLI. |

Example request body:

```json
{
  "store_name": "my-shoe-store-4ec2fe",
  "country_code": "CA",
  "autoinstall_client_id": "<SALES_CHANNEL_APP_CLIENT_ID>"
}
```

A successful response includes:

```json
{
  "success": true,
  "shop_id": 12345678,
  "shop_permanent_domain": "my-shoe-store-4ec2fe.myshopify.com"
}
```

Save `shop_permanent_domain` as the store's fixed domain for token requests and transfer operations. Use the Sales Channel App to [populate products and build the storefront](#access-store-apis). [Show the store before the claim action](merchant_journey/create_and_claim_store.md#show-the-store-before-the-claim-action).

### Check transfer eligibility and generate a claim URL

Check eligibility with `GET https://partners.shopify.com/api/dev_store_transfer_status?shop_permanent_domain=<SHOP_PERMANENT_DOMAIN>` and the global access token in the `Authorization` header. The response includes `transferable` and `status`:

| Status | Meaning |
| --- | --- |
| `ready` | The store is transferable. |
| `pending` | Setup is still in progress; the store is not ready for transfer. |
| `not_transferable` | The store cannot be transferred, for example because it has already been claimed. |

When ready, send `POST https://partners.shopify.com/api/dev_store_transfers`:

```json
{
  "shop_permanent_domain": "my-shoe-store-4ec2fe.myshopify.com",
  "email_address": "<MERCHANT_EMAIL>",
  "first_name": "<MERCHANT_FIRST_NAME>",
  "last_name": "<MERCHANT_LAST_NAME>",
  "storefront_redirect_url": "https://public-facing-storefront.example.com/"
}
```

`storefront_redirect_url` is optional but should be a stable URL for your externally hosted storefront. The response includes `success` and `claim_store_url`. Send the merchant to that URL to sign in or create a Shopify account and take ownership. Shopify also emails the invitation to the merchant.

Follow the [claim experience](merchant_journey/create_and_claim_store.md#claim-store) and [Shopify onboarding handoff](merchant_journey/shopify_onboarding.md#first-landing-in-admin). After claim, use online tokens for user-directed Admin API operations. Claiming is not the same as being ready to sell: the merchant still needs a plan, payments, and store settings. Do not hardcode trial or pricing terms; follow the [agent content guidance](merchant_journey/overall_content_guidelines.md#defer-when-unsure).

## Connect an existing store

**Merchant experience:** [Send merchants to Shopify's store picker](merchant_journey/connect_existing_store.md#send-merchants-to-shopifys-store-picker), [state the installation permission requirement](merchant_journey/connect_existing_store.md#name-the-permission-requirement-upfront), and [skip claim](merchant_journey/connect_existing_store.md#skip-the-claim-step). Do not ask for a store name or URL. The existing-store flow is still under development; the journey document describes the target experience.

1. Set `afterAuthRedirectUrl` in [`app/config.ts`](../app/config.ts) to your platform's post-authentication callback. Register the Sales Channel App's `https://{YOUR_APP_HOST}/auth/platform/callback` URL in [`shopify.app.toml`](../shopify.app.toml). These are different callbacks: Shopify returns to the Sales Channel App, which forwards the parameters to your platform.
2. Redirect the merchant to Shopify's store picker. Shopify handles sign-in if needed, then lets the merchant select a store before continuing to authorization:

   ```text
   https://admin.shopify.com/?no_redirect=true&redirect={ENCODED_AUTHORIZE_PATH}
   ```

   Set `redirect` to the percent-encoded relative path `/oauth/authorize` with these query parameters:

   | Parameter | Value |
   | --- | --- |
   | `client_id` | Your **Sales Channel App's** Client ID, not the Partner App's. |
   | `redirect_uri` | `https://{YOUR_APP_HOST}/auth/platform/callback`; must exactly match a registered redirect URL. |
   | `state` | A request-specific value containing a cryptographically random nonce and `projectUrl`, the permanent URL back to the project. |
   | `response_type` | `code`. |
   | `grant_options[]` | `per-user`, to request an online access token. See [requesting online access](https://shopify.dev/docs/apps/build/authentication-authorization/authenticate-standalone-apps#optional-request-an-online-access-token). |

   Build both query strings with `URLSearchParams` so nested values are encoded correctly. This server-side example generates a URL without any store-specific input:

   ```javascript
   import { randomBytes } from "node:crypto";

   const state = JSON.stringify({
     nonce: randomBytes(32).toString("hex"),
     projectUrl: "https://platform.example.com/projects/PROJECT_ID",
   });
   // Save the full state server-side against the initiating user's session
   // before redirecting, so the platform callback can verify it.

   const authorizeParams = new URLSearchParams({
     client_id: "SALES_CHANNEL_APP_CLIENT_ID",
     redirect_uri: "https://YOUR_APP_HOST/auth/platform/callback",
     state,
     response_type: "code",
     "grant_options[]": "per-user",
   });
   const pickerParams = new URLSearchParams({
     no_redirect: "true",
     redirect: `/oauth/authorize?${authorizeParams}`,
   });
   const storePickerUrl = `https://admin.shopify.com/?${pickerParams}`;
   ```

   Replace the example Client ID, app host, and project URL with your configuration. Pass raw values to `URLSearchParams`, not pre-encoded strings: it encodes the authorization parameters once and the complete authorization path again for the picker's `redirect` parameter. Keep `no_redirect=true` on the outer URL.
3. After authentication, the template redirects to your configured platform callback with these parameters:

   ```text
   https://{YOUR_CALLBACK_URL}?code={ACCESS_CODE}&hmac={HMAC}&shop={SHOPIFY_PERMANENT_DOMAIN}&state={STATE}&timestamp={RESPONSE_TIME}
   ```

   [Verify the HMAC](https://shopify.dev/docs/apps/build/authentication-authorization/access-tokens/authorization-code-grant#step-1-verify-the-installation-request), validate the returned state against the saved value for the initiating user's session, and reject expired or reused state before exchanging the code. Bind the connection to the verified callback's `shop` domain; no merchant-entered store name or URL is needed.
4. Send `POST https://{SHOPIFY_PERMANENT_DOMAIN}/admin/oauth/access_token` with `Content-Type: application/json`:

   ```json
   {
     "client_id": "<SALES_CHANNEL_APP_CLIENT_ID>",
     "client_secret": "<SALES_CHANNEL_APP_CLIENT_SECRET>",
     "code": "<ACCESS_CODE>"
   }
   ```

   The response contains an online `access_token`. Use it for user-directed Admin GraphQL API requests on behalf of that user. Do not use the Partner App credentials for this exchange.

## Access store APIs

**Merchant experience:** The [partner sales channel](merchant_journey/partner_sales_channel.md#general-guidelines) should show project links, published-product counts, and help links.

### Generate an offline Admin API token before claim

Once the Sales Channel App is installed, send `POST https://{SHOP_PERMANENT_DOMAIN}/admin/oauth/access_token` with `Content-Type: application/json`:

```json
{
  "client_id": "<SALES_CHANNEL_APP_CLIENT_ID>",
  "client_secret": "<SALES_CHANNEL_APP_CLIENT_SECRET>",
  "grant_type": "client_credentials"
}
```

The returned token lasts 24 hours and can be revoked, for example by uninstalling the app. Use it for pre-claim Admin API operations and Storefront token creation.

### Generate a public Storefront API token

Send `POST https://{SHOP_PERMANENT_DOMAIN}/admin/api/{API_VERSION}/storefront_access_tokens.json` with `X-Shopify-Access-Token: <OFFLINE_ADMIN_API_TOKEN>` and `Content-Type: application/json`:

```json
{
  "storefront_access_token": { "title": "My Storefront Token" }
}
```

Use a supported API version in place of `{API_VERSION}`. The returned public token lets the storefront render products and manage carts. An online Admin API token cannot create a Storefront token. Before claim, use the `client_credentials` token above; for an existing or claimed store, obtain an offline token through the [authorization code grant](https://shopify.dev/docs/apps/build/authentication-authorization/access-tokens/authorization-code-grant) when you need to create a Storefront token. This does not replace the online-token requirement for user-directed Admin API actions.

### Publish products to your sales channel

Only products published to your sales channel are returned by its Storefront API token. Use the [Admin GraphQL API](https://shopify.dev/docs/api/admin-graphql) at `https://{SHOP_PERMANENT_DOMAIN}/admin/api/{API_VERSION}/graphql.json`, with `X-Shopify-Access-Token: <ADMIN_API_TOKEN>` and `Content-Type: application/json`.

1. Fetch the publication ID for each store. It represents the relationship between that store and your sales channel, so do not share it across stores. You can cache it per store.

   ```graphql
   query ChannelPublication {
     currentAppInstallation {
       publication { id }
     }
   }
   ```

   If the app has not yet been converted into a sales channel, `publication` can be `null`. Skip publishing in that development state, but implement the full flow before conversion.
2. Create products with [`productCreate`](https://shopify.dev/docs/api/admin-graphql/latest/mutations/productCreate), including each product's ID in the response selection set.
3. Publish each product with [`publishablePublish`](https://shopify.dev/docs/api/admin-graphql/latest/mutations/publishablePublish), passing the product ID and the store's publication ID:

   ```graphql
   mutation PublishProduct($productId: ID!, $publicationId: ID!) {
     publishablePublish(id: $productId, input: { publicationId: $publicationId }) {
       publishable { publishedOnPublication(publicationId: $publicationId) }
       userErrors { field message }
     }
   }
   ```

The channel also provides sales attribution, so merchants can distinguish revenue from your storefront from other channels.

### Preview checkout

New stores are password-protected by default. For checkout preview links returned by [`cartCreate`](https://shopify.dev/docs/api/storefront/latest/mutations/cartCreate), append the `channel=online_store` query parameter to `checkoutUrl` to bypass the storefront password.

## Security and compliance

### Security criteria

- Configure each store domain immutably at the environment level, outside the LLM's decision-making process.
- Do not let LLM prompts override the configured domain.
- Do not let user inputs change which store receives Admin API tokens.
- Keep app secrets, global access tokens, and Admin API tokens server-side. Only public Storefront API tokens belong in client-side code.

### Mandatory compliance webhooks

Public apps must respond to data privacy requests before passing app review. This template registers `customers/data_request`, `customers/redact`, and `shop/redact` in [`shopify.app.toml`](../shopify.app.toml). The [compliance handler](../app/routes/webhooks/app/compliance.ts) verifies requests and returns `200` without further action because the template does not store personal data. If you add personal data storage, implement the required export and deletion behavior. See [privacy law compliance](https://shopify.dev/docs/apps/build/compliance/privacy-law-compliance).

---

## In this guide

- [Introduction](introduction.md)
- [Merchant Journey](merchant_journey/overall_merchant_flow.md)
  - [Merchant flow](merchant_journey/overall_merchant_flow.md)
  - [Content guidelines](merchant_journey/overall_content_guidelines.md)
  - [Integrate with Shopify](merchant_journey/integrate_with_shopify.md)
  - [Create a new store and claim](merchant_journey/create_and_claim_store.md)
  - [Connect to an existing store](merchant_journey/connect_existing_store.md)
  - [Partner sales channel](merchant_journey/partner_sales_channel.md)
  - [Shopify onboarding steps](merchant_journey/shopify_onboarding.md)
- [Technical Reference](technical_reference.md)
