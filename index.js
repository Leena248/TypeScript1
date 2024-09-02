function fetchProducts() {
  const request = new XMLHttpRequest();
  request.open("GET", "https://dummyjson.com/products?limit=10", false);
  request.send();
  if (request.status === 200) {
    const response = JSON.parse(request.responseText);
    return response.products;
  } else {
    console.error(
      "Failed to fetch products:",
      request.status,
      request.statusText
    );
    return [];
  }
}

function displayProducts(products) {
  const productContainer = document.getElementById("product-container");
  productContainer.innerHTML = "";
  products.forEach((product) => {
    const productDiv = document.createElement("div");
    productDiv.className = "product";
    productDiv.innerHTML = `
            <img src="${product.thumbnail}" alt="${product.title}" />
            <h3>${product.title}</h3>
            <p>${product.description}</p>
            <p>Price: $${product.price}</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
            <button onclick="viewProductDetails(${product.id})">View Details</button>
        `;
    productContainer.appendChild(productDiv);
  });
}

function viewProductDetails(productId) {
  const products = fetchProducts();
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  const productDetailContainer = document.createElement("div");
  productDetailContainer.className = "product-details";
  productDetailContainer.innerHTML = `
        <h2>${product.title}</h2>
        <img src="${product.thumbnail}" alt="${product.title}" />
        <p>${product.description}</p>
        <p>Price: $${product.price}</p>
        <button onclick="addToCart(${product.id})">Add to Cart</button>
        <button onclick="closeProductDetails()">Close</button>
    `;
  document.body.prepend(productDetailContainer);
}

function closeProductDetails() {
  const productDetailContainer = document.querySelector(".product-details");
  if (productDetailContainer) {
    document.body.removeChild(productDetailContainer);
  }
}

function addToCart(productId) {
  const products = fetchProducts();
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  const cart = getCart();
  const cartItem = cart.find((item) => item.product.id === productId);

  if (cartItem) {
    cartItem.quantity++;
  } else {
    cart.push({ product, quantity: 1 });
  }

  saveCart(cart);
  alert(`Product ${product.title} added to cart!`);
  displayCart();
}

function displayCart() {
  const cartContainer = document.getElementById("cart-container");
  if (!cartContainer) return;

  const cart = getCart();
  cartContainer.innerHTML = "";

  cart.forEach((item) => {
    const cartItemDiv = document.createElement("div");
    cartItemDiv.className = "cart-item";
    cartItemDiv.innerHTML = `
            <p>${item.product.title} - Quantity: ${item.quantity}</p>
            <button onclick="increaseQuantity(${item.product.id})">+</button>
            <button onclick="decreaseQuantity(${item.product.id})">-</button>
            <button onclick="removeFromCart(${item.product.id})">Remove</button>
        `;
    cartContainer.appendChild(cartItemDiv);
  });
}

function increaseQuantity(productId) {
  const cart = getCart();
  const cartItem = cart.find((item) => item.product.id === productId);

  if (cartItem) {
    cartItem.quantity++;
    saveCart(cart);
    displayCart();
  }
}

function decreaseQuantity(productId) {
  let cart = getCart();
  const cartItem = cart.find((item) => item.product.id === productId);

  if (cartItem && cartItem.quantity > 1) {
    cartItem.quantity--;
  } else if (cartItem) {
    cart = cart.filter((item) => item.product.id !== productId);
  }

  saveCart(cart);
  displayCart();
}

function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter((item) => item.product.id !== productId);
  saveCart(cart);
  displayCart();
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function getCart() {
  const cartJSON = localStorage.getItem("cart");
  return cartJSON ? JSON.parse(cartJSON) : [];
}

function init() {
  const products = fetchProducts();
  displayProducts(products);
  displayCart();

  document.getElementById("search-input").addEventListener("input", () => {
    applyFilters();
  });

  document.getElementById("type-filter").addEventListener("change", () => {
    applyFilters();
  });

  document.getElementById("price-sort").addEventListener("change", () => {
    applyFilters();
  });
}

function applyFilters() {
  const searchValue = document
    .getElementById("search-input")
    .value.toLowerCase();
  const typeFilter = document.getElementById("type-filter").value;
  const priceSort = document.getElementById("price-sort").value;

  let products = fetchProducts();

  if (typeFilter) {
    products = products.filter((product) => product.type === typeFilter);
  }

  if (searchValue) {
    products = products.filter((product) =>
      product.title.toLowerCase().includes(searchValue)
    );
  }

  if (priceSort === "asc") {
    products.sort((a, b) => a.price - b.price);
  } else if (priceSort === "desc") {
    products.sort((a, b) => b.price - a.price);
  }

  displayProducts(products);
}

onload = init;
