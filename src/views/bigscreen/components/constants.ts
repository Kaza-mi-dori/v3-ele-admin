export interface navItem {
  id: number;
  label: string;
  name: string;
}

export const businessTypes: navItem[] = [
  { id: 1, label: "LNG", name: "LNG" },
  { id: 2, label: "燃料油", name: "fuelOil" },
  { id: 3, label: "成品油", name: "refinedOilProduct" },
  { id: 4, label: "化工产品", name: "chemicalProduct" },
  { id: 5, label: "原油", name: "crudeOil" },
  { id: 6, label: "煤炭", name: "coal" },
];

export const businessTypes2: navItem[] = [
  { id: 1, label: "化工产品", name: "chemicalProduct" },
  { id: 2, label: "原油", name: "crudeOil" },
  { id: 3, label: "燃料油", name: "fuelOil" },
  { id: 4, label: "成品油", name: "refinedOilProduct" },
  { id: 5, label: "LNG", name: "LNG" },
  { id: 6, label: "煤炭", name: "coal" },
];
