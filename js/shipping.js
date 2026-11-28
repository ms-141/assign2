// Shipping, tax and total for the cart summary

// Rates are listed by shipping type and destination
export const RATES = {
  standard: { canada: 10, us: 15, int: 20 },
  express: { canada: 25, us: 25, int: 30 },
  priority: { canada: 35, us: 50, int: 50 },
};

// Calculate the final order amounts
export function calculateSummary(merchandise, type, dest) {
  let shipping = RATES[type][dest];

  if (merchandise > 500) {
    shipping = 0;
  }

  let tax = 0;
  if (dest === "canada") {
    tax = merchandise * 0.05;
  }

  const total = merchandise + shipping + tax;

  return {
    merchandise: merchandise,
    shipping: shipping,
    tax: tax,
    total: total,
  };
}
