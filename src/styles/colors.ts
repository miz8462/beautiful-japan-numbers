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

export type ColorMode = "light" | "dark";

export const ChartColors = {
  governmentSpending: {
    light: {
      label: Colors.grey[900],
      linkOpacity: 0.45,
      revenue: {
        item: Colors.blue[800],
        total: Colors.blue[700],
      },
      spending: {
        total: Colors.purple[700],
        item: Colors.purple[600],
      },
    },
    dark: {
      label: Colors.grey[100],
      linkOpacity: 0.7,
      revenue: {
        item: Colors.blue[300],
        total: Colors.blue[400],
      },
      spending: {
        total: Colors.purple[300],
        item: Colors.purple[400],
      },
    },
  },
} as const;

export function getGovernmentSpendingChartColors(mode: ColorMode) {
  return ChartColors.governmentSpending[mode];
}
