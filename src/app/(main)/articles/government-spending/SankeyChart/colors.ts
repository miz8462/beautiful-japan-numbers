import {
  blue,
  green,
  grey,
  orange,
  purple,
  red,
} from "@mui/material/colors";

export const Colors = {
  blue,
  green,
  grey,
  orange,
  purple,
  red,
  transparent: "transparent",
} as const;

export const ChartColors = {
  governmentSpending: {
    dark: {
      label: Colors.grey[100],
      linkOpacity: 0.7,
      revenue: {
        detail: Colors.blue[500],
        item: Colors.blue[300],
        total: Colors.blue[400],
      },
      spending: {
        total: Colors.purple[300],
        item: Colors.purple[400],
        detail: Colors.purple[500],
      },
    },
  },
} as const;

export function getGovernmentSpendingChartColors() {
  return ChartColors.governmentSpending.dark;
}
