export interface ForecastSlot {
  main: {
    temp_min: number;
    temp_max: number;
  };
}

export interface ForecastResponse {
  list: ForecastSlot[];
}
