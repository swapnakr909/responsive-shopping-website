// Custom Toast Notification System
function showToast(message) {
  // Create container if it doesn't exist
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  // Create toast element
  const toast = document.createElement('div');
  toast.className = 'toast';
  
  // Icon
  const icon = document.createElement('div');
  icon.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
  
  // Message
  const text = document.createElement('span');
  text.innerText = message;

  toast.appendChild(icon);
  toast.appendChild(text);
  container.appendChild(toast);

  // Remove toast after 3 seconds
  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => {
      if(toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300); // Wait for animation to finish
  }, 3000);
}

function formatPrice(price) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(price);
}

function addToCart(product, price) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  cart.push({
      name: product,
      price: price,
      id: Date.now() // Unique ID for key tracking
  });

  localStorage.setItem("cart", JSON.stringify(cart));

  // Show premium toast notification instead of alert
  showToast(product + " added to cart!");
}

function removeFromCart(id) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart = cart.filter(item => item.id !== id);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
  showToast("Item removed from cart");
}

function renderCart() {
  const list = document.getElementById("cartItems");
  if (!list) return;

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let total = 0;

  // Clear current list
  list.innerHTML = '';

  if (cart.length === 0) {
    list.innerHTML = '<div class="empty-cart">Your cart is currently empty.</div>';
    return;
  }

  cart.forEach(item => {
    let li = document.createElement("li");
    
    let nameSpan = document.createElement("span");
    nameSpan.innerText = item.name;
    
    let priceDiv = document.createElement("div");
    priceDiv.style.display = "flex";
    priceDiv.style.alignItems = "center";
    priceDiv.style.gap = "15px";
    
    let priceSpan = document.createElement("span");
    priceSpan.innerText = formatPrice(item.price);
    
    let removeBtn = document.createElement("button");
    removeBtn.innerHTML = "&times;";
    removeBtn.style.background = "rgba(236, 72, 153, 0.1)";
    removeBtn.style.color = "#ec4899";
    removeBtn.style.border = "none";
    removeBtn.style.borderRadius = "50%";
    removeBtn.style.width = "28px";
    removeBtn.style.height = "28px";
    removeBtn.style.cursor = "pointer";
    removeBtn.style.display = "flex";
    removeBtn.style.alignItems = "center";
    removeBtn.style.justifyContent = "center";
    removeBtn.style.fontSize = "18px";
    removeBtn.onclick = () => removeFromCart(item.id);

    priceDiv.appendChild(priceSpan);
    priceDiv.appendChild(removeBtn);
    
    li.appendChild(nameSpan);
    li.appendChild(priceDiv);

    list.appendChild(li);

    total += item.price;
  });

  let totalElement = document.createElement("div");
  totalElement.className = "cart-total";
  totalElement.innerHTML = `<span>Total:</span> <span>${formatPrice(total)}</span>`;

  list.appendChild(totalElement);

  const checkoutActions = document.getElementById('checkoutActions');
  if (checkoutActions) {
    checkoutActions.innerHTML = '';
    const checkoutBtn = document.createElement('button');
    checkoutBtn.className = 'btn checkout-btn';
    checkoutBtn.textContent = 'Checkout';
    checkoutBtn.onclick = () => window.location.href = 'payment.html';
    checkoutActions.appendChild(checkoutBtn);
  }
}

function renderPaymentPage() {
  const paymentItems = document.getElementById('paymentItems');
  const paymentTotal = document.getElementById('paymentTotal');
  const emptyMessage = document.getElementById('paymentEmptyMsg');
  const payNowBtn = document.getElementById('payNowBtn');
  const paymentSummary = document.getElementById('paymentSummary');

  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  if (cart.length === 0) {
    if (paymentSummary) paymentSummary.classList.add('hidden');
    if (emptyMessage) {
      emptyMessage.innerText = 'Your cart is empty. Add items from the shop first.';
      emptyMessage.style.display = 'block';
    }
    if (payNowBtn) payNowBtn.disabled = true;
    return;
  }

  if (paymentSummary) paymentSummary.classList.remove('hidden');
  if (emptyMessage) emptyMessage.style.display = 'none';

  paymentItems.innerHTML = '';
  let total = 0;

  cart.forEach(item => {
    const li = document.createElement('li');
    li.innerHTML = `<span>${item.name}</span><span>${formatPrice(item.price)}</span>`;
    paymentItems.appendChild(li);
    total += item.price;
  });

  if (paymentTotal) paymentTotal.innerText = formatPrice(total);
  if (payNowBtn) {
    payNowBtn.disabled = false;
    payNowBtn.onclick = function(e) {
      e.preventDefault();
      localStorage.removeItem('cart');
      showToast('Payment successful! Your order is confirmed.');
      window.location.href = 'home.html';
    };
  }
}

function updatePaymentFields() {
  const methodSelect = document.getElementById('paymentMethod');
  const detailsLabel = document.getElementById('paymentDetailsLabel');
  const detailsInput = document.getElementById('paymentDetails');
  const expiryRow = document.getElementById('expiryRow');

  if (!methodSelect || !detailsLabel || !detailsInput || !expiryRow) return;

  const method = methodSelect.value;
  if (method === 'card') {
    detailsLabel.textContent = 'Card number';
    detailsInput.placeholder = '1234 5678 9012 3456';
    detailsInput.required = true;
    expiryRow.style.display = 'grid';
  } else if (method === 'upi') {
    detailsLabel.textContent = 'UPI ID';
    detailsInput.placeholder = 'name@upi';
    detailsInput.required = true;
    expiryRow.style.display = 'none';
  } else if (method === 'netbanking') {
    detailsLabel.textContent = 'Bank name / UPI';
    detailsInput.placeholder = 'Your bank or UPI ID';
    detailsInput.required = true;
    expiryRow.style.display = 'none';
  } else if (method === 'wallet') {
    detailsLabel.textContent = 'Wallet provider';
    detailsInput.placeholder = 'PhonePe, Google Pay, Paytm';
    detailsInput.required = true;
    expiryRow.style.display = 'none';
  }
}

function setupPaymentInteractions() {
  const methodSelect = document.getElementById('paymentMethod');
  const locationBtn = document.getElementById('locationBtn');
  const locationOutput = document.getElementById('locationOutput');
  const paymentForm = document.getElementById('paymentForm');

  if (methodSelect) {
    methodSelect.addEventListener('change', updatePaymentFields);
    updatePaymentFields();
  }

  if (locationBtn && locationOutput) {
    locationBtn.addEventListener('click', () => {
      if (!navigator.geolocation) {
        locationOutput.innerText = 'Geolocation is not supported by your browser.';
        return;
      }
      locationOutput.innerText = 'Getting location…';
      navigator.geolocation.getCurrentPosition(
        position => {
          locationOutput.innerText = `Lat: ${position.coords.latitude.toFixed(4)}, Lon: ${position.coords.longitude.toFixed(4)}`;
        },
        () => {
          locationOutput.innerText = 'Unable to get your location. Please enable location access.';
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  }

  if (paymentForm) {
    paymentForm.addEventListener('submit', event => {
      event.preventDefault();
      const payNowBtn = document.getElementById('payNowBtn');
      if (payNowBtn) payNowBtn.click();
    });
  }
}

// Run renderCart if we are on the cart page
if (document.getElementById("cartItems")) {
  renderCart();
}

// Run payment page setup when on payment page
if (document.getElementById('paymentForm')) {
  renderPaymentPage();
}

// Search Functionality
const searchInput = document.querySelector('.search');
if (searchInput) {
  searchInput.addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const productCards = document.querySelectorAll('.products .card');
    
    // If we are not on the products page, redirect to it with the search term
    if (productCards.length === 0 && searchTerm.length > 0) {
      // Allow pressing enter to search if not on products page
      searchInput.addEventListener('keypress', function(k) {
        if (k.key === 'Enter') {
          window.location.href = `products.html?search=${encodeURIComponent(searchTerm)}`;
        }
      });
      return;
    }

    let visibleCount = 0;

    productCards.forEach(card => {
      const productName = card.querySelector('h3').innerText.toLowerCase();
      const productTags = card.getAttribute('data-tags') ? card.getAttribute('data-tags').toLowerCase() : '';
      
      if (productName.includes(searchTerm) || productTags.includes(searchTerm)) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    // Handle 'No products found' state
    let noResultsMsg = document.getElementById('no-results-msg');
    const productsContainer = document.querySelector('.products');
    
    if (visibleCount === 0) {
      if (!noResultsMsg) {
        noResultsMsg = document.createElement('div');
        noResultsMsg.id = 'no-results-msg';
        noResultsMsg.style.gridColumn = '1 / -1';
        noResultsMsg.style.textAlign = 'center';
        noResultsMsg.style.padding = '40px';
        noResultsMsg.style.fontSize = '20px';
        noResultsMsg.style.color = 'var(--text-muted)';
        productsContainer.appendChild(noResultsMsg);
      }
      noResultsMsg.innerText = `No products found matching "${searchTerm}".`;
      noResultsMsg.style.display = 'block';
    } else if (noResultsMsg) {
      noResultsMsg.style.display = 'none';
    }
  });

  // Check URL parameters on load for products page
  const urlParams = new URLSearchParams(window.location.search);
  const searchParam = urlParams.get('search');
  if (searchParam) {
    searchInput.value = searchParam;
    // Trigger the input event to filter products immediately
    searchInput.dispatchEvent(new Event('input'));
  }
}

// Category Filtering Logic
const categoryPills = document.querySelectorAll('.pill-card');
const sidebarFilters = document.querySelectorAll('.filter-group li');
const productCards = document.querySelectorAll('.products .card');
const showingCount = document.getElementById('showing-count');

function filterByCategory(category) {
  let visibleCount = 0;
  const searchTerm = category.toLowerCase();

  // Update active state in sidebar
  sidebarFilters.forEach(li => {
    if (li.innerText.toLowerCase() === searchTerm) {
      li.classList.add('active');
    } else {
      li.classList.remove('active');
    }
  });

  // Filter products
  productCards.forEach(card => {
    const productTags = card.getAttribute('data-tags') ? card.getAttribute('data-tags').toLowerCase() : '';
    
    // Map UI categories to our data-tags
    let match = false;
    if (searchTerm === 'all') {
      match = true;
    } else if (searchTerm === 'electronics' && (productTags.includes('phone') || productTags.includes('laptop') || productTags.includes('watch') || productTags.includes('audio') || productTags.includes('gaming') || productTags.includes('camera'))) {
      match = true;
    } else if (searchTerm === 'clothing' && productTags.includes('cloth')) {
      match = true;
    } else if (searchTerm === 'home' && productTags.includes('home')) {
      match = true;
    } else if (searchTerm === 'books' && productTags.includes('book')) {
      match = true;
    } else if (searchTerm === 'sports' && productTags.includes('sport')) {
      match = true;
    } else if (searchTerm === 'beauty' && productTags.includes('beauty')) {
      match = true;
    } else if (searchTerm === 'toys' && productTags.includes('toy')) {
      match = true;
    }

    if (match) {
      card.style.display = 'flex';
      visibleCount++;
    } else {
      card.style.display = 'none';
    }
  });

  // Update count text
  if (showingCount) {
    showingCount.innerText = `Showing ${visibleCount} products`;
  }

  // Handle empty state
  let noResultsMsg = document.getElementById('no-results-msg');
  const productsContainer = document.querySelector('.products');
  
  if (visibleCount === 0) {
    if (!noResultsMsg && productsContainer) {
      noResultsMsg = document.createElement('div');
      noResultsMsg.id = 'no-results-msg';
      noResultsMsg.style.gridColumn = '1 / -1';
      noResultsMsg.style.textAlign = 'center';
      noResultsMsg.style.padding = '40px';
      noResultsMsg.style.fontSize = '20px';
      noResultsMsg.style.color = 'var(--text-muted)';
      productsContainer.appendChild(noResultsMsg);
    }
    if(noResultsMsg) {
      noResultsMsg.innerText = `No products found in "${category}".`;
      noResultsMsg.style.display = 'block';
    }
  } else if (noResultsMsg) {
    noResultsMsg.style.display = 'none';
  }
}

// Add event listeners to category pills
categoryPills.forEach(pill => {
  pill.addEventListener('click', () => {
    const category = pill.querySelector('span').innerText;
    filterByCategory(category);
  });
});

// Add event listeners to sidebar filters
sidebarFilters.forEach(li => {
  li.addEventListener('click', () => {
    const category = li.innerText;
    filterByCategory(category);
  });
});