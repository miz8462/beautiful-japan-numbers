export type CpiDataPoint = {
  year: number;
  total: number;
  core: number;
  corecore: number;
};

export type CpiJson = {
  meta: {
    source: string;
    sourceUrl: string;
    base: string;
    retrievedAt: string;
  };
  index: CpiDataPoint[];
  yoy: CpiDataPoint[];
};
