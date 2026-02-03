import { parseGid } from "app/utils/apiUtils";
import { authenticate } from "app/shopify.server";

export interface PublicationInfo {
  id: string;
}

export class ProductsPublishing {
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
  /**
   * Get the publication ID for this sales channel app installation.
   * the publication ID is different for each shop so must be fetched.
   */
  async getChannelPublication(): Promise<PublicationInfo | null> {
    const response = await this.admin
      .graphql(
        `#graphql
        query GetPublication {
           currentAppInstallation {
              publication {
                id
              }
            }
        }
      `,
      )
      .then((res) => res.json());

    const { data } = response;

    const publication = data?.currentAppInstallation.publication;

    if (publication) {
      return publication;
    }

    return null;
  }

  /**
   * Get count of products published to the channel
   * Note: Shopify doesn't provide totalCount on connections, so we have to fetch edges
   * and use pageInfo to estimate or fetch all products in batches
   */
  async getPublishedProductsCount(): Promise<{
    /** The plain ID parsed from the GID returned by graphql */
    publicationId: string | null;
    count: number;
    hasMore: boolean;
  } | null> {
    const publication = await this.getChannelPublication();

    if (!publication) {
      return null;
    }

    // Shopify GraphQL connections don't have totalCount
    // We need to fetch products with the admin API page limit and count them
    // to display a real count we would need to paginate over the entire collection
    const response = await this.admin
        .graphql(
          `#graphql
        query GetPublishedProducts($publicationId: ID!) {
          publication(id: $publicationId) {
            # 250 because it is the page limit for the admin api
            products(first: 250) {
              edges {
                node {
                  id
                }
              }
              pageInfo {
                hasNextPage
              }
            }
          }
        }
      `,
          {
            variables: {
              publicationId: publication.id,
            },
          },
        )
        .then((res) => res.json());

    const products = response.data?.publication?.products?.edges || [];
    const hasMore =
      response.data?.publication?.products?.pageInfo?.hasNextPage || false;

    return {
      publicationId: parseGid(publication.id).id,
      count: products.length,
      hasMore,
    };
  }
}
