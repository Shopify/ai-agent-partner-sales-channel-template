import {
  Card,
  BlockStack,
  InlineStack,
  Badge,
  Button,
  Text,
} from "@shopify/polaris";
import type { PartnerConfigSerializable } from "app/config";
import { useTranslation } from "react-i18next";

interface ProductsPublishedCardProps {
  partnerConfig: PartnerConfigSerializable;
  publishedProductsInfo: {
    publicationId: string | null;
    count: number;
    hasMore: boolean;
  };
}

export function ProductsPublishedCard({
  partnerConfig,
  publishedProductsInfo,
}: ProductsPublishedCardProps) {
  const { t } = useTranslation("ProductsPublishing");
  const productsPublishedKey: string = publishedProductsInfo.hasMore
    ? "productsPublishedOverflow"
    : "productsPublished";
  return (
    <Card>
      <BlockStack gap="200">
        <InlineStack align="space-between" blockAlign="baseline">
          <InlineStack gap="100" blockAlign="center">
            <Text as="h2" variant="headingMd">
              {t("title", { partnerName: partnerConfig.name })}
            </Text>
            <Badge tone="info">
              {t(productsPublishedKey as "productsPublishedOverflow", {
                count: publishedProductsInfo.count,
              })}
            </Badge>
          </InlineStack>
          <Button url={getBulkEditUrl(publishedProductsInfo.publicationId)}>
            {t("manage")}
          </Button>
        </InlineStack>
        <Text as="p" variant="bodyMd" tone="subdued">
          {t("description", { partnerName: partnerConfig.name })}
        </Text>
      </BlockStack>
    </Card>
  );
}

function getBulkEditUrl(publicationId: string | null) {
  if (!publicationId) return "shopify://admin/products";

  return `shopify://admin/bulk/product?resource_name=Product&edit=status%2Cpublications.${publicationId}.published_at`;
}
