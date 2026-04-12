import lifeAreas from "../data/lifeAreas";

const areaLabelOverrides = {
  personal: "Desarrollo personal",
};

export const lifeAreaByKey = Object.fromEntries(
  lifeAreas.map((area) => [area.key, area])
);

export const areaTitleToKey = Object.fromEntries(
  lifeAreas.flatMap((area) => {
    const displayTitle = areaLabelOverrides[area.key] || area.title;

    return [
      [area.title.toLowerCase(), area.key],
      [displayTitle.toLowerCase(), area.key],
    ];
  })
);

export function getAreaDisplayTitle(area) {
  if (!area) {
    return "";
  }

  return areaLabelOverrides[area.key] || area.title;
}

export function getAreaPath(areaKey) {
  return `/areas/${areaKey}`;
}

export default lifeAreas;
