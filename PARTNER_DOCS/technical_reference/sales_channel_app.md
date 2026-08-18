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

Online access tokens are linked to an individual user on a store and expire when the user logs out or after 24 hours. They automatically enforce that user's permissions -- if the user lacks access to a resource, the API returns a 403 Forbidden response. You **MUST** use online tokens after a store has been claimed or when integrating with an existing merchant store. This safeguards collaboration by ensuring only staff members with the appropriate permissions can take actions via the API -- for example, only users with product management access will be able to create or update products. For implementation details, see [the full documentation](https://shopify.dev/docs/apps/build/authentication-authorization/access-tokens/online-access-tokens).

## Generate an Admin API Offline Access Token

This generates an Admin API offline Access Token specific to the shop created above (`my-shoe-store-4ec2fe`) allowing access to the Shop's Admin API. You will also use this token to generate a Storefront API Access token.

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

This token does not expire, until revoked by the user (or via Admin API mutations).

```sh
curl --location 'https://$SHOP-DOMAIN.myshopify.com/admin/api/2025-04/storefront_access_tokens.json' \
--header 'X-Shopify-Access-Token: $ADMIN-API-ACCESS-TOKEN' \
--header 'Content-Type: application/json' \
--data '{"storefront_access_token":{"title":"My Storefront Token"}}'
```

**Note:** An Online access token cannot be used to generate a storefront access token. Pre claim, you should use a `client_credentials` granted token, if you are connecting an existing user or generating a new storefront token then you should perform an oauth redirect for an `offline access token`.

## Configuring Your Sales Channel

A sales channel is a Shopify app type that lets merchants manage which products are available on a given storefront. Your Sales Channel App will be converted into a sales channel during onboarding -- this is an irreversible process handled by Shopify on your behalf. Once converted, the app gains a publication that controls product visibility: only products explicitly published to your sales channel will be queryable via your Storefront API token. This also enables explicit sales attribution -- merchants can see the exact revenue generated through your custom storefront, separately from other channels like the Online Store or POS. For more on building sales channels, see the [Shopify sales channel documentation](https://shopify.dev/docs/apps/build/sales-channels/start-building).

When you are querying products using the Shopify Storefront token, only the products that are published to your sales channel will be returned in the API request. Creating and publishing a product to a sales channel is a three step process.

### Step 1: Fetch your Publication ID

First you must find the publication id for the shop. A publication ID is not per sales channel, but instead represents the relationship between the current shop and the sales channel, therefore it must be fetched for each shop. This value can be cached, you do not need to refetch it every time you create a product.

```sh
curl --location 'https://$SHOP-DOMAIN.myshopify.com/admin/api/2025-04/graphql.json' \
--header 'X-Shopify-Access-Token: $ADMIN-API-ACCESS-TOKEN' \
--header 'Content-Type: application/json' \
--data '{"query": "{ currentAppInstallation { publication { id } } }"}'
```

> **Note:** Your app will be converted to a sales channel during onboarding. If it has not yet been published as a sales channel you may get a null response for `currentAppInstallation.publication`. If this is the case you can skip step 3. Having all three steps in place ahead of the sales channel being turned on ensures that no products end up being created but not accessible via your storefront token.

### Step 2: Create your products

Once you have the publication ID you can proceed to create your products via the [GraphQL API](https://shopify.dev/docs/api/admin-graphql/latest/mutations/productCreate). Make sure you include the product's ID in the GraphQL response selection set.

### Step 3: Publish the new product(s)

For each product created by the API, you must then publish it to the sales channel.

```sh
curl --location 'https://$SHOP-DOMAIN.myshopify.com/admin/api/2025-04/graphql.json' \
--header 'X-Shopify-Access-Token: $ADMIN-API-ACCESS-TOKEN' \
--header 'Content-Type: application/json' \
--data '{
  "query": "mutation PublishablePublish($productId: ID!, $publicationId: ID!) { publishablePublish(id: $productId, input: { publicationId: $publicationId }) { publishable { publishedOnPublication(publicationId: $publicationId) } userErrors { field message } } }",
  "variables": {
    "productId": "$PRODUCT_ID",
    "publicationId": "$PUBLICATION_ID"
  }
}'
```

Now if you query products using your storefront token these new products will be available.

## Storefront API: Checkout Links

By default, newly created Shops on Shopify are password protected. In order to get working checkout preview links, when generating checkout links ([`createCart` mutation](https://shopify.dev/docs/api/storefront/latest/mutations/cartCreate)), append `?channel=online_store` query param to the `checkoutUrl` to bypass this password.

---

## In this guide

- [Introduction](../introduction.md)
- [Merchant Journey](../merchant_journey/overall_merchant_flow.md)
  - [Overall merchant flow](../merchant_journey/overall_merchant_flow.md)
  - [Overall content guidelines](../merchant_journey/overall_content_guidelines.md)
  - [Integrate with Shopify](../merchant_journey/integrate_with_shopify.md)
  - [Create a new store and claim](../merchant_journey/create_and_claim_store.md)
  - [Connect to an existing store](../merchant_journey/connect_existing_store.md)
  - [Partner sales channel](../merchant_journey/partner_sales_channel.md)
  - [Shopify onboarding steps](../merchant_journey/shopify_onboarding.md)
- [Technical Reference](../technical_reference/glossary.md)
  - [Glossary](../technical_reference/glossary.md)
  - [Understanding the Two-App Architecture](../technical_reference/two_app_architecture.md)
  - [Security Criteria](../technical_reference/security_criteria.md)
  - [Getting Started](../technical_reference/getting_started.md)
  - [Partner App: Managing Dev Stores](../technical_reference/partner_app.md)
  - [Your Sales Channel App: Accessing Store APIs](../technical_reference/sales_channel_app.md)
  - [Connect Existing Merchants](../technical_reference/connect_existing_merchants.md)
  - [Changelog](../technical_reference/changelog.md)
