import { useBreakpointValue } from "@chakra-ui/react";

/**
 * モバイル端末かどうかを判定するカスタムフック
 *
 * @returns {boolean} モバイル端末の場合はtrue、それ以外はfalse
 */
export const useIsMobile = (): boolean => {
  return useBreakpointValue({ base: true, md: false }) ?? false;
};
