export type CategoryColors = {
  badge: string;
  button: string;
};

const NEUTRAL_COLORS: CategoryColors = {
  badge: "bg-blush text-aubergine",
  button: "bg-aubergine text-ivory hover:bg-aubergine-deep",
};

export const CATEGORY_COLORS: Record<string, CategoryColors> = {
  Background: {
    badge: "bg-aubergine text-ivory",
    button: "bg-aubergine text-ivory hover:bg-aubergine-deep",
  },
  Work: {
    badge: "bg-teal text-ivory",
    button: "bg-teal text-ivory hover:bg-teal-deep",
  },
  Skills: {
    badge: "bg-saffron text-aubergine-deep",
    button: "bg-saffron text-aubergine-deep hover:bg-saffron-deep",
  },
  Personal: {
    badge: "bg-rose text-ivory",
    button: "bg-rose text-ivory hover:bg-rose-deep",
  },
};

export function getCategoryColors(category: string): CategoryColors {
  return CATEGORY_COLORS[category] ?? NEUTRAL_COLORS;
}
