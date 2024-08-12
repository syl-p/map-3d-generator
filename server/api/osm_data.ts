import natural from "assets/geo_jsons/natural-leisure.json";
import buildings from "assets/geo_jsons/buildings.json";
import water from "assets/geo_jsons/water.json";

export default defineEventHandler((event) => {
  return {
    natural,
    buildings,
    water,
  };
});
