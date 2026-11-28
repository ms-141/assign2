// Renders the cart view and handles its controls

import { state } from "../state.js";
import { calculateSummary } from "../shipping.js";
import { toast } from "../ui.js";

const $ = (selector) => document.querySelector(selector);

// Show cart lines or the empty message and update controls
export function renderCart() {
  const lines = state.cart.lines(state.products);
  const empty = lines.length === 0;
  const cartEmpty = $("#cart-empty");
  const cartTable = $("#cart-table");
  const cartRows = $("#cart-rows");
  const shipType = $("#ship-type");
  const shipDest = $("#ship-dest");
  const checkout = $("#checkout");

  cartEmpty.hidden = !empty;
  cartTable.hidden = empty;
  shipType.disabled = empty;
  shipDest.disabled = empty;
  checkout.disabled = empty;

  cartRows.replaceChildren(...lines.map(createCartRow));
  renderSummary();
}

// Build a table row for a product
function createCartRow(line) {
  const row = document.createElement("tr");
  row.dataset.id = line.id;

  const productCell = document.createElement("td");
  const product = document.createElement("div");
  product.className = "cart-product";

  const image = document.createElement("img");
  image.src = line.thumbnail;
  image.alt = line.title;

  const details = document.createElement("div");
  const title = document.createElement("strong");
  title.textContent = line.title;
  const category = document.createElement("small");
  category.textContent = line.category;
  details.append(title, category);
  product.append(image, details);
  productCell.append(product);

  const priceCell = document.createElement("td");
  priceCell.className = "num";
  priceCell.textContent = "$" + line.price.toFixed(2);

  const quantityCell = document.createElement("td");
  quantityCell.className = "num";
  const quantity = document.createElement("input");
  quantity.className = "qty-input";
  quantity.type = "number";
  quantity.min = "1";
  quantity.value = line.qty;
  quantity.dataset.id = line.id;
  quantityCell.append(quantity);

  const subtotalCell = document.createElement("td");
  subtotalCell.className = "num";
  subtotalCell.textContent = "$" + (line.price * line.qty).toFixed(2);

  const removeCell = document.createElement("td");
  const remove = document.createElement("button");
  remove.type = "button";
  remove.className = "remove-button";
  remove.dataset.id = line.id;
  remove.textContent = "×";
  removeCell.append(remove);

  row.append(productCell, priceCell, quantityCell, subtotalCell, removeCell);
  return row;
}

// Update the merchandise, shipping, tax and total amounts
function renderSummary() {
  const summary = calculateSummary(
    state.cart.merchandiseTotal(state.products),
    $("#ship-type").value,
    $("#ship-dest").value,
  );

  $("#sum-merch").textContent = "$" + summary.merchandise.toFixed(2);
  $("#sum-ship").textContent = "$" + summary.shipping.toFixed(2);
  $("#sum-tax").textContent = "$" + summary.tax.toFixed(2);
  $("#sum-total").textContent = "$" + summary.total.toFixed(2);
}

// Listen for cart changes and checkout
export function setupCart(onCheckout) {
  $("#cart-rows").addEventListener("click", (event) => {
    const button = event.target.closest(".remove-button");
    if (!button) return;

    state.cart.remove(Number(button.dataset.id));
    renderCart();
  });

  $("#cart-rows").addEventListener("change", (event) => {
    const input = event.target.closest(".qty-input");
    if (!input) return;

    state.cart.setQty(Number(input.dataset.id), Number(input.value));
    renderCart();
  });

  $("#ship-type").addEventListener("change", renderSummary);
  $("#ship-dest").addEventListener("change", renderSummary);

  $("#checkout").addEventListener("click", () => {
    toast("Order placed!");
    state.cart.clear();
    onCheckout();
  });
}
