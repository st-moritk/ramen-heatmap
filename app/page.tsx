import React from "react";
import { RamenHeatmap } from "../src/presentation/components/RamenHeatmap/RamenHeatmap";
import { Box, Flex, Heading, Text, Link } from "@chakra-ui/react";

/**
 * Next.jsのメインページコンポーネント
 * プレゼンテーション層のアダプタ
 */
export default function Page() {
  return (
    <Flex direction="column" minH="100vh">
      <Box as="header" bg="gray.800" color="white" p={4}>
        <Box maxW="container.xl" mx="auto">
          <Heading as="h1" size="xl" fontWeight="bold">
            東京ラーメンヒートマップ
          </Heading>
          <Text mt={2} color="gray.300">
            東京エリアのラーメン店舗分布をヒートマップで可視化
          </Text>
        </Box>
      </Box>

      <Box as="main" flex="1">
        <RamenHeatmap />
      </Box>

      <Box as="footer" bg="gray.800" color="white" p={4}>
        <Box maxW="container.xl" mx="auto" textAlign="center">
          <Text fontSize="sm">
            データソース:{" "}
            <Link
              href="https://www.openstreetmap.org"
              textDecoration="underline"
            >
              OpenStreetMap
            </Link>
          </Text>
        </Box>
      </Box>
    </Flex>
  );
}
