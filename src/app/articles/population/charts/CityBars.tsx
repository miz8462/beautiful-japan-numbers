"use client";

import styles from "../page.module.css";

const ANNUAL_DECREASE = 59;

const cities = [
  { name: "仙台市", pop: 110, color: "#F06449" },
  { name: "広島市", pop: 120, color: "#2E9E6E" },
  { name: "福岡市", pop: 162, color: "#5BBEE4" },
  { name: "札幌市", pop: 197, color: "#5BBEE4" },
  { name: "名古屋市", pop: 233, color: "#2E9E6E" },
  { name: "大阪市", pop: 275, color: "#F06449" },
  { name: "東京23区", pop: 973, color: "#AAAAAA" },
];

const maxPop = Math.max(...cities.map((city) => city.pop));

export default function CityBars() {
  return (
    <div className={styles.cityBars}>
      {cities.map((city) => {
        const years = (city.pop / ANNUAL_DECREASE).toFixed(1);
        const pct = (city.pop / maxPop) * 100;

        return (
          <div className={styles.cityBarRow} key={city.name}>
            <span className={styles.cityName}>{city.name}</span>
            <div className={styles.cityBarTrack}>
              <div
                className={styles.cityBarFill}
                style={{ backgroundColor: city.color, width: pct + "%" }}
              />
              <span className={styles.cityPopulation}>{city.pop}万人</span>
            </div>
            <span className={styles.cityYears}>
              {years}
              <span> 年</span>
            </span>
          </div>
        );
      })}
    </div>
  );
}
