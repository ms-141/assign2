const STORAGE_KEY = "northwind_products_v1";
const PRODUCTS_API_URL = "https://dummyjson.com/products?limit=100";

// Fetches products once from the API and caches the array in localStorage for subsequent loads.
export async function getProducts() {
  const cached = localStorage.getItem(STORAGE_KEY);
  if (cached !== null) {
    return JSON.parse(cached);
  }

  const response = await fetch(PRODUCTS_API_URL);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  const data = await response.json();
  const products = data.products;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  return products;
}
