// Shopping cart data: lines of { id, qty }, saved in localStorage

export class Cart {
  #items; // private list of { id, qty }

  // load the saved cart (or start empty); onChange runs after every change
  constructor(key, onChange = () => {}) {
    this.key = key;
    this.onChange = onChange;
    const savedItems = localStorage.getItem(this.key);
    this.#items = savedItems ? JSON.parse(savedItems) : [];
  }

  // add a product, or increase its qty if it's already in the cart
  add(id, qty = 1) {
    let found = false;

    for (const item of this.#items) {
      if (item.id === id) {
        item.qty += qty;
        found = true;
        break;
      }
    }

    if (!found) {
      this.#items.push({ id: id, qty: qty });
    }

    this.#save();
  }

  // set an exact quantity; 0 or less removes the line
  setQty(id, qty) {
    if (qty <= 0) {
      this.remove(id);
      return;
    }

    for (const item of this.#items) {
      if (item.id === id) {
        item.qty = qty;
        break;
      }
    }

    this.#save();
  }

  // remove one product's line
  remove(id) {
    this.#items = this.#items.filter((item) => item.id !== id);
    this.#save();
  }

  // empty the whole cart (checkout)
  clear() {
    this.#items = [];
    this.#save();
  }

  // total number of items, for the header badge
  get count() {
    let total = 0;

    for (const item of this.#items) {
      total += item.qty;
    }

    return total;
  }

  // true when the cart has no lines
  get isEmpty() {
    return this.#items.length === 0;
  }

  // each line as the full product plus its qty, for drawing the cart
  lines(products) {
    const cartLines = [];

    for (const item of this.#items) {
      const product = products.find((candidate) => candidate.id === item.id);
      if (product) {
        cartLines.push({ ...product, qty: item.qty });
      }
    }

    return cartLines;
  }

  // sum of price × qty for every line
  merchandiseTotal(products) {
    let total = 0;
    const cartLines = this.lines(products);

    for (const line of cartLines) {
      total += line.price * line.qty;
    }

    return total;
  }

  // save to localStorage, then tell the page the cart changed
  #save() {
    localStorage.setItem(this.key, JSON.stringify(this.#items));
    this.onChange(this);
  }
}
