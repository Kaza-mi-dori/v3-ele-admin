export interface navItem {
  id: number;
  label: string;
  name: string;
}

export const businessTypes: navItem[] = [
  { id: 1, label: "LNG", name: "LNG" },
  { id: 2, label: "燃料油", name: "FuelOil" },
  { id: 3, label: "成品油", name: "RefinedOilProduct" },
  { id: 4, label: "化工产品", name: "ChemicalProduct" },
  { id: 5, label: "原油", name: "CrudeOil" },
  { id: 6, label: "煤炭", name: "Coal" },
];

export const businessTypes2: navItem[] = [
  { id: 1, label: "化工产品", name: "ChemicalProduct" },
  { id: 2, label: "原油", name: "CrudeOil" },
  { id: 3, label: "燃料油", name: "FuelOil" },
  { id: 4, label: "成品油", name: "RefinedOilProduct" },
  { id: 5, label: "LNG", name: "LNG" },
  { id: 6, label: "煤炭", name: "Coal" },
];
