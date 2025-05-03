import { Box, HStack, Text } from "native-base";

interface MonthBudget {
  usedPercentage: string;
}

export const MonthBudget: React.FC<MonthBudget> = ({ usedPercentage }) => {
  return (
    <Box bg="#ede7f7" borderRadius="lg" p={4}>
      <HStack justifyContent="space-between">
        <Text color="purple.700" fontWeight="bold" fontSize="sm">
          Ngan sach thang 3
        </Text>
        <Text color="blue.500" fontWeight="medium" fontSize="sm">
          {usedPercentage} da su dung
        </Text>
      </HStack>
    </Box>
  );
};
