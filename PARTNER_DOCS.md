# Shopify Vibe Partner Program

## Introduction

The Shopify Vibe Partner Program enables AI-powered development platforms to integrate Shopify's commerce capabilities directly into their product experience. Through this program, vibe coding platforms can offer their users the ability to create fully functional Shopify stores, complete with products, storefronts, and checkout - all generated through AI-assisted development workflows.

This integration allows your platform's users to go from idea to live commerce in a seamless experience, with Shopify handling the underlying commerce infrastructure.

## Audience

This documentation is intended for the engineering and development teams responsible for implementing the Shopify integration within your platform.

Note: Before proceeding with the technical implementation, someone on your team should create a Shopify Partner account. Any member of your organization can sign up directly. Keep in mind that the email address used to create the Partner account will be set as the account owner email on all dev stores created through the Vibe Store APIs, and will remain the owner until a store is claimed by the end user.

## In This Guide

- Glossary
- Understanding the Two-App Architecture
- Getting Started
- Partner App: Managing Dev Stores
- Your Sales Channel App: Accessing Store APIs
- Connect Existing Merchants
- Changelog

## Glossary

**Vibe Partner** - An AI-powered development platform that has registered for the Shopify Vibe Partner Program. As a Vibe Partner, you integrate Shopify's commerce capabilities into your platform, enabling your users to create and manage Shopify stores through AI-assisted development workflows.

**Vibe Store APIs** - The set of REST APIs that allow you to programmatically create dev stores, transfer store ownership, and check transfer eligibility. These APIs are accessed using the Global Access Token generated from your Partner App.

**Partner App** - The app you create in your Shopify Partner Dashboard. It authenticates with the Partners API using a Client ID and Client Secret to generate a Global Access Token. Use it to create dev stores, generate claim URLs for store transfers, and manage the lifecycle of stores you create for your users.

**Your Sales Channel App** - The app that gets installed into each dev store you create. It provides API access to interact with individual stores, including generating Admin API access tokens (for backend operations) and Storefront API access tokens. Shopify provides a template to help you build this app. You build and host this app. Shopify provides a template with all the functionality you'll need out of the box.

**Dev Store** - A Shopify development store created programmatically through the Vibe Store APIs. Dev stores are fully functional stores with products, storefronts, and checkout capabilities. They are initially owned by the partner's account and can later be transferred to end users via a Claim Store URL.

## Understanding the Two-App Architecture

Throughout this guide, you will work with two separate apps, each serving a distinct purpose. The **Partner App** is used to manage the lifecycle of dev stores — creating them, generating claim URLs, and transferring ownership. **Your Sales Channel App** is installed into each dev store and provides the API access tokens needed to interact with individual stores, including Admin API tokens for backend operations and Storefront API tokens for frontend operations. Your Sales Channel App needs to go through Shopify's App Review process.

# Getting Started

Before you can begin the technical integration, you must complete the following steps:

### 1. Create a Shopify Partner Account

If your organization does not already have a Shopify Partner account, create one at [https://www.shopify.com/partners](https://www.shopify.com/partners).

### 2. Contact Shopify to Register for Vibe Store API Access

Once your Partner account is created, contact Shopify with the following information:

- The email address associated with your Partner account
- Your organization name
- Your platform name

Shopify will then review your application and grant your account access to the Vibe Store APIs.

### 3. Create Your Partner App

After Shopify has enabled API access for your account, create an app in your Partner Dashboard:

- Navigate to App Distribution in the left menu and click Visit Dev Dashboard
- Select Start from Dev Dashboard to create a new app
- Record your app's Client ID and Client Secret (found in Dev Dashboard > Your App > Settings)

### 4. Share Your Client ID with Shopify

Provide your app's Client ID to your Shopify representative. This allows Shopify to grant your app permission to call the Vibe Store APIs programmatically.

Important: Your Sales Channel App will only be auto-installed on new dev stores after it has passed Shopify's app review. During development, these are two parallel workstreams: you can begin integrating with the Vibe Store API while building your Sales Channel App separately using the Shopify CLI. To test end-to-end, use the Shopify CLI to manually install your Sales Channel App on any dev stores you create.

# Partner App: Managing Dev Stores

The Partner App manages the lifecycle of dev stores you create for your platform's users. Using the global access token generated from this app's credentials, you can create, transfer, and check the status of dev stores programmatically. All operations in this section use the Partner App's Client ID and Client Secret.

This is the app you create in your Partner Dashboard. It authenticates with the Partners API and allows you to:

- Create dev stores programmatically
- Generate claim URLs for store transfers
- Manage the lifecycle of stores you create for your users

You will need to share this app's Client ID with Shopify so we can grant it permission to call the Vibe Store APIs.

## Generate a Global Access Token

Use the Client ID and Client Secret from the App you created in your Partner Dashboard to generate this Global API token:

```sh
curl --location 'https://api.shopify.com/auth/access_token' \
--header 'Content-Type: application/json' \
--data '{
  "client_id": "$PARTNER-APP-CLIENT-ID",
  "client_secret": "$PARTNER-APP-CLIENT-SECRET",
  "grant_type": "client_credentials"
}'
```

You'll use the access token in this response to create shops and transfer ownership. This token has a ~60 minute TTL.

## Create a Dev Store

```sh
curl --location 'https://partners.shopify.com/api/dev_stores' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer $GLOBAL-ACCESS-TOKEN' \
--data '{
    "store_name": "$YOUR-STORE-NAME",
    "autoinstall_client_id": "$PARTNER-SHOP-APP-CLIENT-ID"
}'
```

It's strongly recommended to suffix a short hash to the store name to avoid name conflicts, e.g. my-shoe-store-4ec2fe

Note: The autoinstall_client_id parameter automatically installs your Sales Channel App on each new dev store, but this only works after your app has passed Shopify's app review. During development, you will need to omit this parameter and install your Sales Channel App on dev stores manually using the Shopify CLI.

### Example Response

```json
{
  "success": true,
  "shop_id": 12345678,
  "shop_permanent_domain": "my-shoe-store-4ec2fe.myshopify.com"
}
```

You'll use shop_permanent_domain later when requesting a Claim Store URL later in the flow.

## Transfer a Dev Store

Once the user is ready to make their store real and start selling, you can generate a Claim Store URL for them to create (or sign in) to their own Shopify Account and start their 3-day free Shopify trial.

A key (but optional) part of this is the storefront_redirect_url which should be a stable URL that points to the public-facing storefront that's served externally.

```sh
curl --location 'https://partners.shopify.com/api/dev_store_transfers' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer $GLOBAL-ACCESS-TOKEN' \
--data-raw '{
    "shop_permanent_domain": "$SHOP-PERMANENT-DOMAIN",
    "email_address": "$VIBE-CODING-MERCHANT-EMAIL",
    "first_name": "$VIBE-CODING-MERCHANT-FIRST-NAME",
    "last_name": "$VIBE-CODING-MERCHANT-LAST-NAME",
    "storefront_redirect_url": "https://public-facing-storefront.example.com/"
}'
```

## Check Store Transferability

Before initiating a transfer, you can check whether a dev store is eligible for transfer. This is useful for verifying that a store hasn't already been transferred or already claimed by the user.

```sh
curl --location 'https://partners.shopify.com/api/dev_store_transfer_status?shop_permanent_domain=$SHOP-PERMANENT-DOMAIN' \
--header 'Authorization: $GLOBAL-ACCESS-TOKEN
```

The response will indicate whether the store is transferable and, if not, the reason why.

# Your Sales Channel App: Accessing Store APIs

While the Partner App handles store creation and lifecycle, your Sales Channel App is installed into the created stores and provides API access to interact with those individual stores. Once this app passes Shopify's app review, it will be automatically installed on each dev store your organization creates. You will use this app to generate access tokens for interacting with Shopify's APIs on behalf of each store. This app allows you to:

- Generate Admin API access tokens for interacting with the shop backend
- Generate Storefront API access tokens for frontend operations
- Enable your LLM to interact with Shopify's APIs on behalf of the shop

Shopify provides a template to help you build this app quickly. It is a fork of the [Shopify App Template for React Router](https://github.com/Shopify/shopify-app-template-react-router) with added functionality for generating online access tokens. We'll discuss these tokens in the following sections.

## Understanding Access Tokens

Your Sales Channel App provides two types of access tokens, each suited for different use cases.

### Offline Access Tokens

Offline access tokens are designed for server-to-server operations where no user interaction is involved. These tokens are not tied to a specific user session, so they persist until the app is uninstalled. In the Vibe platform flow, offline tokens are ideal for LLM-driven interactions with a store before it has been claimed, since no authenticated user exists yet. Offline access tokens are also required to generate Storefront API access tokens. For implementation details and token refresh patterns, see [the full documentation](https://shopify.dev/docs/apps/build/authentication-authorization/access-tokens/offline-access-tokens).

### Online Access Tokens

Online access tokens are linked to an individual user on a store and expire when the user logs out or after 24 hours. They automatically enforce that user's permissions — if the user lacks access to a resource, the API returns a 403 Forbidden response. You MUST use online tokens after a store has been claimed or when integrating with an existing merchant store. This safeguards collaboration by ensuring only staff members with the appropriate permissions can take actions via the API — for example, only users with product management access will be able to create or update products. For implementation details, see [the full documentation](https://shopify.dev/docs/apps/build/authentication-authorization/access-tokens/online-access-tokens).

## Generate an Admin API Offline Access Token

This generates an Admin API offline Access Token specific to the shop created above (my-shoe-store-4ec2fe) allowing access to the Shop's Admin API. You will also use this token to generate a Storefront API Access token.

This token has a 24 hour TTL, or until revoked by the user (e.g. if they uninstall your App in their Admin UI after claiming ownership).

```sh
curl --location 'https://$SHOP-DOMAIN.myshopify.com/admin/oauth/access_token' \
--header 'Content-Type: application/json' \
--data '{
  "client_id": "$SALES-CHANNEL-APP-CLIENT-ID",
  "client_secret": "$SALES-CHANNEL-APP-CLIENT-SECRET",
  "grant_type": "client_credentials"
}'
```

## Generate a Storefront API Access Token

The Storefront API Access Token is a public token used on the storefront frontend to render products and manage buyer's carts. Unlike other API tokens, it is safe to expose in client-side code and does not need to be kept secret.

This token does not expire, until revoked by the user (or, via Admin API mutations).

```sh
curl --location 'https://$SHOP-DOMAIN.myshopify.com/admin/api/2025-04/storefront_access_tokens.json' \
--header 'X-Shopify-Access-Token: $ADMIN-API-ACCESS-TOKEN' \
--header 'Content-Type: application/json' \
--data '{"storefront_access_token":{"title":"My Storefront Token"}}'
```

## Configuring Your Sales Channel

A sales channel is a Shopify app type that lets merchants manage which products are available on a given storefront. Your Sales Channel App will be converted into a sales channel during onboarding — this is an irreversible process handled by Shopify on your behalf. Once converted, the app gains a publication that controls product visibility: only products explicitly published to your sales channel will be queryable via your Storefront API token. This also enables explicit sales attribution — merchants can see the exact revenue generated through your custom storefront, separately from other channels like the Online Store or POS. For more on building sales channels, see the [Shopify sales channel documentation](https://shopify.dev/docs/apps/build/sales-channels/start-building).

When you are querying products using the Shopify Storefront token, only the products that are published to your sales channel will be returned in the API request. Creating and publishing a product to a sales channel is a three step process.

### Step 1 Fetch your Publication ID

First you must find the publication id for the shop. A publication ID is not per sales channel, but instead represents the relationship between the current shop and the sales channel, therefore it must be fetched for each shop. This value can be cached, you do not need to refetch it every time you create a product.

```sh
curl --location 'https://$SHOP-DOMAIN.myshopify.com/admin/api/2025-04/graphql.json' \
--header 'X-Shopify-Access-Token: $ADMIN-API-ACCESS-TOKEN' \
--header 'Content-Type: application/json' \
--data '{"query": "{ currentAppInstallation { publication { id } } }"}'
```

Note: Your app will be converted to a sales channel during onboarding, if it has not yet been published as a sales channel you may get a null response for currentAppInstallation.publication, if this is the case you can skip step 3. Having all three steps in place ahead of the sales channel being turned on ensures that no products end up being created but not accessible via your storefront token.

### Step 2 Create your products

Once you have the publication ID you can proceed to create your products via our GraphQL API (documentation and example) make sure you include the product's ID in the GraphQL response selection set.

### Step 3 Publish the new product(s)

For each product created by the API, you must then publish it to the sales channel.

```sh
curl --location 'https://$SHOP-DOMAIN.myshopify.com/admin/api/2025-04/graphql.json' \
--header 'X-Shopify-Access-Token: $ADMIN-API-ACCESS-TOKEN' \
--header 'Content-Type: application/json' \
--data '{"query": "mutation PublishablePublish($productId: ID!, $publicationId: ID!) { publishablePublish(id: $productId, input: { publicationId: $publicationId }) { publishable { publishedOnPublication(publicationId: $publicationId) } userErrors { field message } } }", "variables": { "productId": "$PRODUCT_ID", "publicationId": "$PUBLICATION_ID" }}'
```

Now if you query products using your storefront token these new products will be available.

### Storefront API: Checkout Links

By default, newly created Shops on Shopify are password protected. In order to get working checkout preview links, when generating checkout links ([createCart mutation](https://shopify.dev/docs/api/storefront/latest/mutations/cartCreate)), append `?channel=online_store` query param to the checkoutUrl to bypass this password.

# Connect Existing Merchants

In order to enable connection to an existing store you must set a post authentication callback URL in the app config, example: https://shopify.{partner}.dev/callback. In order to kick off this flow, you must first obtain the merchant's shopify admin domain (as an example https://admin.shopify.com/store/my-cool-sneaker-shop). You will then trigger a redirect as follows:

```
https://admin.shopify.com/store/{SHOP_NAME}/oauth/authorize?client_id={CLIENT_ID}&grant_type[]=per_user&state={STATE_PARAM}&redirect_uri=https://{YOUR_APP_HOST}/auth/platform/callback
```

```typescript
interface Parameters {
  CLIENT_ID: string; // Your Sales Channel App client ID
  STATE: {
    // This parameter is required, you may add anything else you need
    // but at the minimum we require a permanent url back to the project
    projectUrl: string;
  };
}
```

After the merchant has authenticated they will be directed back to the redirect uri you provided in the config.ts.

### Response

```
https://{YOUR_CALLBACK_URL}?code={ACCESS_CODE}&hmac={HMAC}&shop={SHOPIFY_PERMANENT_DOMAIN}&state={STATE}&timestamp={RESPONSE_TIME}
```

At this point you should validate the request authenticity by checking the HMAC against the other parameters. There is an example [in our dev docs here](https://shopify.dev/docs/apps/build/authentication-authorization/access-tokens/authorization-code-grant#step-1-verify-the-installation-request). The returned state parameter will be the same as the one you used to initiate the request, with this state you should be able to tie the callback back to the original request. You can now exchange the ACCESS_CODE for an ACCESS_TOKEN.

```sh
curl --location 'https://{SHOPIFY_PERMANENT_DOMAIN}/admin/oauth/access_token' \
--header 'Content-Type: application/json' \
--data '{
  "client_id":"$SALES-CHANNEL-APP-CLIENT-ID",
  "client_secret":"$SALES-CHANNEL-APP-CLIENT-SECRET",
  "code":"$CODE-FROM-REDIRECT-URL"
}'
```

_You must use your Sales Channel App client ID and client secret_

The access token returned from this exchange is an **Online Access Token**. Use it for all requests to the Shopify Admin GraphQL API. For details on the different token types, see the Understanding Access Tokens section above.

# Changelog

- Add instructions for connecting existing shopify accounts and publishing products to a sales channel
- Note about Storefront API Checkout links
- Admin API token has 24 hour TTL
- Added docs storefront_redirect_url to Claim Store call
