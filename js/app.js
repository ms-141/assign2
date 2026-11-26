/*
 * app.js
 * Entry point for the Corner Store single-page app (COMP 3612 Assignment 2).
 * Loaded by index.html as an ES module.
 *
 * Planned modules (see the Build Plan note):
 *   dom.js       - element helpers and formatters
 *   data.js      - getProducts(): localStorage cache, otherwise fetch once
 *   router.js    - showView(): switch between the five views
 *   ui.js        - toast and dialogs
 *   cart.js      - Cart class (localStorage)
 *   shipping.js  - shipping/tax calculation
 *   views/*.js   - one render function per view
 */


//data import
import { getProducts } from "./data.js";
const products = await getProducts();

// HELPER FUNCTIONS
const $ = (e) => {
    return document.querySelector(e);
};


// VIEWS ------------------------

// showing different views function
const views = document.querySelectorAll(".view");
//iterable

function showView(view) {
    const chosenView = $(`#${view}`); //shortcut function $
    
    for (const view of views) {
        //if its not the chosen view, add the hidden attribute to view class
        view.hidden = view !== chosenView;
    }
}

document.addEventListener("click", (e) => {
    const link  = e.target.closest("[data-view]");

    if(!link) {
        return;
    }
    e.preventDefault();
    showView(link.dataset.view);
})

// BROWSE -----------------

//test to see if i can load how many products there are
const result = $("#result-count");
result.textContent = products.length;
console.log(products.length);

const grid = $("#result-grid")
products.forEach(prodSquareCr8er)
function prodSquareCr8er(product){
    //create div to add everything to
    const div = document.createElement("div");
    //create and add the image
    const img = document.createElement("img");
    img.src = product.thumbnail
    img.alt = product.title
    div.appendChild(img)

    //add the title
    const title = document.createElement("h3");
    title.textContent = product.title;
    div.appendChild(title);

    //getting the price
    const price = document.createElement("h3");
    price.textContent = "CAD$"+product.price;
    div.appendChild(price);

    grid.appendChild(div);
}