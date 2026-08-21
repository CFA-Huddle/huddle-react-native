import { Module } from "@/types/Modules";

export const MODULE_GROUPS = ["Back of House", "Front of House"] as const;

export const MODULES: Module[] = [
  {
    id: "primary",
    title: "Primary",
    icon: "https://media.pathway.cfahome.com/img/procedures/ChickenSandwich.svg",
    group: "Back of House",
  },
  {
    id: "secondary",
    title: "Secondary",
    icon: "https://media.pathway.cfahome.com/img/procedures/Nuggets.svg",
    group: "Back of House",
  },
  {
    id: "fries",
    title: "Fries",
    icon: "https://media.pathway.cfahome.com/img/procedures/WaffleFries.svg",
    group: "Back of House",
  },
  {
    id: "drinks-and-desserts",
    title: "Drinks & Desserts",
    icon: "https://media.pathway.cfahome.com/img/procedures/Milkshake.svg",
    group: "Front of House",
  },
];
