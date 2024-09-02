interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  type?: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

function fetchProducts(): Product[] {
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

function displayProducts(products: Product[]): void {
  const productContainer = document.getElementById("product-container");
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
    productContainer!.appendChild(productDiv);
  });
}

function viewProductDetails(productId: number): void {
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

function closeProductDetails(): void {
  const productDetailContainer = document.querySelector(".product-details");
  if (productDetailContainer) {
    document.body.removeChild(productDetailContainer);
  }
}

function addToCart(productId: number): void {
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

function displayCart(): void {
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

function increaseQuantity(productId: number): void {
  const cart = getCart();
  const cartItem = cart.find((item) => item.product.id === productId);

  if (cartItem) {
    cartItem.quantity++;
    saveCart(cart);
    displayCart();
  }
}

function decreaseQuantity(productId: number): void {
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

function removeFromCart(productId: number): void {
  let cart = getCart();
  cart = cart.filter((item) => item.product.id !== productId);
  saveCart(cart);
  displayCart();
}

function saveCart(cart: CartItem[]): void {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function getCart(): CartItem[] {
  const cartJSON = localStorage.getItem("cart");
  return cartJSON ? JSON.parse(cartJSON) : [];
}

function init(): void {
  const products = fetchProducts();
  displayProducts(products);
  displayCart();
}

onload = init;

document.body.insertAdjacentHTML(
  "afterbegin",
  `
      <div>
        <input type="text" id="search-input" placeholder="Search..." />
        <select id="type-filter">
          <option value="">All Types</option>
          <option value="makeup">Make Up</option>
          <option value="perfumes">Perfumes</option>
        </select>
        <select id="price-sort">
          <option value="asc">Price: Low to High</option>
          <option value="desc">Price: High to Low</option>
        </select>
      </div>
      <div id="cart-container"></div>
    `
);
