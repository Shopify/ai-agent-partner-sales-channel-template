import {
  BlockStack,
  Card,
  InlineStack,
  Text,
  Box,
  Link,
  Icon,
} from "@shopify/polaris";
import { ExternalIcon, ViewIcon } from "@shopify/polaris-icons";
import type { PartnerConfigSerializable } from "../config";
import { useTranslation } from "react-i18next";

interface ProjectDetailsCardProps {
  shop: string;
  partnerConfig: PartnerConfigSerializable;
  partnerProjectLinks: {
    projectFrontendUrl: string | null;
    projectManagementUrl: string | null;
  };
}

export function ProjectDetailsCard({
  shop,
  partnerConfig,
  partnerProjectLinks,
}: ProjectDetailsCardProps) {
  const { t } = useTranslation("LandingPage");

  return (
    <Card>
      <BlockStack gap="400">
        <Text as="h2" variant="headingMd">
          {t("projectDetails")}
        </Text>

        <BlockStack gap="100">
          <InlineStack gap="400" align="space-between" blockAlign="center">
            <Text as="span" variant="bodyMd" fontWeight="medium">
              {t("project", { partnerName: partnerConfig.name })}
            </Text>

            {partnerProjectLinks.projectManagementUrl ? (
              <Link url={partnerProjectLinks.projectManagementUrl}>
                <InlineStack gap="100" blockAlign="center">
                  <Icon source={ExternalIcon} tone="interactive" />
                  {t("editIn", { partnerName: partnerConfig.name })}
                </InlineStack>{" "}
              </Link>
            ) : null}
          </InlineStack>
          <Box
            background="bg-surface-secondary"
            borderColor="border"
            borderWidth="025"
            borderRadius="200"
            padding="200"
            minHeight="36px"
          >
            <InlineStack
              align="space-between"
              blockAlign="center"
              wrap={false}
            >
              <Text as="span" variant="bodyMd" tone="subdued">
                {partnerProjectLinks.projectFrontendUrl}
              </Text>
              {partnerProjectLinks.projectFrontendUrl ? (
                <Box minWidth="20px">
                  <Link
                    url={partnerProjectLinks.projectFrontendUrl}
                    target="_blank"
                  >
                    <Icon source={ViewIcon} tone="subdued" />
                  </Link>
                </Box>
              ) : null}
            </InlineStack>
          </Box>
        </BlockStack>

        <BlockStack gap="100">
          <Text as="span" variant="bodyMd" fontWeight="medium">
            {t("currentShopifyStore")}
          </Text>
          <Box
            background="bg-surface-secondary"
            borderColor="border"
            borderWidth="025"
            borderRadius="200"
            padding="200"
            minHeight="36px"
          >
            <InlineStack
              align="space-between"
              blockAlign="center"
              wrap={false}
            >
              <Text as="span" variant="bodyMd" tone="subdued">
                {shop}
              </Text>
              <Box minWidth="20px">
                <Link url={`https://${shop}`} target="_blank">
                  <Icon source={ViewIcon} tone="subdued" />
                </Link>
              </Box>
            </InlineStack>
          </Box>
        </BlockStack>
      </BlockStack>
    </Card>
  );
}
