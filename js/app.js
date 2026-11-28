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
//make a copy of the date to manipulate without losing the original
const productsCopy = [...products];

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

const grid = $("#result-grid")

function prodSquareCr8er(product){
    //create div to add everything to
    const div = document.createElement("div");
    div.classList.add("product-card")
    //create and add the image
    const img = document.createElement("img");
    img.classList.add("product-card-image");
    img.src = product.thumbnail
    img.alt = product.title
    div.appendChild(img)
    
    //add the category
    const prodCategory  = document.createElement("span");
    prodCategory.textContent = product.category;
    div.appendChild(prodCategory);

    //add the title
    const title = document.createElement("h3");
    title.textContent = product.title;
    div.appendChild(title);

    //getting the price
    const price = document.createElement("h3");
    price.textContent = "CAD$"+product.price;
    div.appendChild(price);


    //add rating
    const prodRating = document.createElement("p");
    prodRating.textContent = product.rating + "/5 ★";
    div.appendChild(prodRating);

    grid.appendChild(div);
}

function renderProducts(array){
    //reset the grid every render
    grid.replaceChildren();
    array.forEach(prodSquareCr8er); //creates and appends elements
    result.textContent = array.length + " products found";    
}

//default sort of productsCopy
productsCopy.sort((a,b) => a.title.localeCompare(b.title));
//get the default sort then render them
renderProducts(productsCopy);

//get the value of sort
const sort = $("#sort");
sort.addEventListener("change", e => {
    //just call updateBrowse for this and all relevent eventlistenrs
    updateBrowse();
})

//filter for name
const nameFilter = $("#filter-name");
nameFilter.addEventListener("input", e => {
    updateBrowse()    
})

//rating filter variable
let rating = $("#filter-rating");
//blnk arrow function
rating.addEventListener("change", () => updateBrowse());

//filter for price
const lowPrice = $("#price-over");
lowPrice.addEventListener("input", () => updateBrowse());
const hiPrice = $("#price-under"); 
hiPrice.addEventListener("input", () => updateBrowse());

//update filtered results
function updateBrowse() {
    const name = nameFilter.value.toLowerCase();
    //check for rating
    const checkedRadio = $("#filter-rating :checked");
    const checkedVal = Number(checkedRadio.value);
    //check for pricing
    const lPrice = lowPrice.value;
    const hPrice = hiPrice.value; 
    //create new filtered our array based on the name and rating  and pricing
    const filtered = productsCopy.filter(product => {
        return product.title.toLowerCase().includes(name) && product.rating >= checkedVal && (lPrice==="" || product.price>Number(lPrice)) && (hPrice==="" || product.price < Number(hPrice));
    });

    //check for sort option
    const val = sort.value;
    console.log(val);
    //val check has to be string
    if (val === 'price') {
        filtered.sort((a, b) => a.price - b.price);
    }
    if ( val === 'category') {
        filtered.sort((a, b) => a.category.localeCompare(b.category));
        //localCompare compares text
    }
    if (val === 'name') {
        filtered.sort((a,b) => a.title.localeCompare(b.title));
    }   

    renderProducts(filtered);
    
}