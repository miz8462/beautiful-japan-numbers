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
    revenue: {
      item: Colors.blue[800],
      total: Colors.blue[700],
    },
    spending: {
      total: Colors.purple[700],
      item: Colors.purple[600],
    },
  },
} as const;
