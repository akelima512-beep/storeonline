// --- 1. DATA MASTER PRODUK INDONESIA ---
const INITIAL_PRODUCTS = [
  { id: 'p1', name: 'Headphone Wireless Noise Cancelling Pro', category: 'gadget', price: 499000, originalPrice: 850000, discount: 41, rating: 4.9, soldCount: 1420, location: 'Jakarta Barat', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80', description: 'Headphone Bluetooth dengan fitur Active Noise Cancelling (ANC), daya tahan baterai hingga 40 jam pemakaian non-stop.', variants: ['Matte Black', 'Silver Grey'], stock: 18, freeShipping: true, isStar: true },
  { id: 'p2', name: 'Sepatu Sneakers Retro Pria / Wanita', category: 'shoes', price: 289000, originalPrice: 450000, discount: 35, rating: 4.8, soldCount: 2310, location: 'Bandung', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80', description: 'Sneakers kasual sol empuk bahan kanvas premium berpadu suede. Nyaman untuk kuliah dan jalan.', variants: ['Merah (Size 41)', 'Putih (Size 40)'], stock: 25, freeShipping: true, isStar: true },
  { id: 'p3', name: 'Jam Tangan Analog Minimalis Pria Leather', category: 'accessories', price: 199000, originalPrice: 350000, discount: 43, rating: 4.7, soldCount: 980, location: 'Surabaya', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=80', description: 'Jam tangan kuarsa berdesain elegan minimalis dengan strap kulit asli tahan air 3 ATM.', variants: ['Brown', 'Black'], stock: 12, freeShipping: false, isStar: true },
  { id: 'p4', name: 'Kemeja Katun Linen Kerah Shanghai Adem', category: 'fashion', price: 145000, originalPrice: 220000, discount: 34, rating: 4.9, soldCount: 3100, location: 'Tangerang', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=700&q=80', description: 'Kemeja pria berbahan 100% linen katun alami yang sangat sejuk, tidak menerawang.', variants: ['Putih', 'Sage Green'], stock: 40, freeShipping: true, isStar: false },
  { id: 'p5', name: 'Biji Kopi Arabika Gayo Single Origin 250g', category: 'food', price: 85000, originalPrice: 110000, discount: 22, rating: 5.0, soldCount: 4500, location: 'Aceh Tengah', image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=700&q=80', description: 'Biji kopi sangrai specialty grade 1 dari dataran tinggi Gayo.', variants: ['Biji Utuh', 'Giling Halus'], stock: 50, freeShipping: false, isStar: true },
  { id: 'p6', name: 'Mechanical Gaming Keyboard RGB 65% Hot-Swap', category: 'gadget', price: 375000, originalPrice: 599000, discount: 37, rating: 4.8, soldCount: 870, location: 'Jakarta Utara', image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=700&q=80', description: 'Keyboard mekanik ringkas dengan switch hot-swappable, lampu latar RGB dinamis.', variants: ['Red Switch', 'Blue Switch'], stock: 14, freeShipping: true, isStar: true },
  { id: 'p7', name: 'Tas Ransel Laptop Anti Air USB Charging Port', category: 'accessories', price: 179000, originalPrice: 280000, discount: 36, rating: 4.7, soldCount: 1650, location: 'Semarang', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=80', description: 'Backpack tahan cipratan air dengan kompartemen laptop hingga 15.6 inch.', variants: ['Dark Grey', 'Black'], stock: 30, freeShipping: true, isStar: false },
  { id: 'p8', name: 'Madu Hutan Murni Asli Sumbawa 500ml', category: 'food', price: 115000, originalPrice: 160000, discount: 28, rating: 4.9, soldCount: 2200, location: 'Sumbawa', image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=700&q=80', description: 'Madu mentah (raw honey) langsung dari sarang lebah hutan Sumbawa tanpa campuran.', variants: ['500ml', '1 Liter'], stock: 35, freeShipping: true, isStar: true }
];

const CATEGORIES = [
  { id: 'all', name: '✨ Semua Produk' },
  { id: 'gadget', name: '📱 Gadget & Elektronik' },
  { id: 'fashion', name: '👕 Fashion' },
  { id: 'shoes', name: '👟 Sepatu' },
  { id: 'accessories', name: '🎒 Aksesoris' },
  { id: 'food', name: '☕ Makanan & Minuman' }
];

// --- 2. APPLICATION STATE ---
let products = [...INITIAL_PRODUCTS];
let cart = [];
let wishlist = [];
let selectedCategory = 'all';
let searchQuery = '';
let currentSort = 'popular';
let activeVoucher = null; 
let myOrders = [];

// Safely load data from LocalStorage
try {
  const savedOrders = localStorage.getItem('pk_my_orders');
  if(savedOrders) myOrders = JSON.parse(savedOrders);
} catch(e) {
  console.warn("Local storage tidak tersedia (mungkin diblokir oleh browser karena dijalankan via file://)");
}

// --- 3. FORMATTER HELPERS ---
const formatIDR = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

// --- 4. RENDER CATEGORY TABS ---
function renderCategoryTabs() {
  const container = document.getElementById('categoryTabs');
  container.innerHTML = CATEGORIES.map(cat => `
    <button
      onclick="setCategory('${cat.id}')"
      class="px-3.5 py-1.5 rounded-xl font-medium shrink-0 transition ${
        selectedCategory === cat.id
          ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30 font-semibold'
          : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
      }"
    >
      ${cat.name}
    </button>
  `).join('');
}

function setCategory(catId) {
  selectedCategory = catId;
  renderCategoryTabs();
  renderProducts();
}

// --- 5. RENDER PRODUCT CATALOG ---
function renderProducts() {
  const grid = document.getElementById('productGrid');
  const emptyState = document.getElementById('emptyState');

  let filtered = products.filter(p => {
    const matchCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  if (currentSort === 'price-low') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (currentSort === 'price-high') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (currentSort === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  } else {
    filtered.sort((a, b) => b.soldCount - a.soldCount);
  }

  if (filtered.length === 0) {
    grid.innerHTML = '';
    emptyState.classList.remove('hidden');
    return;
  }

  emptyState.classList.add('hidden');
  grid.innerHTML = filtered.map(prod => {
    const isWish = wishlist.includes(prod.id);
    return `
      <div class="group bg-white rounded-2xl border border-slate-200 hover:border-emerald-400 hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden relative">
        <div class="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 items-start">
          ${prod.discount ? `<span class="bg-rose-500 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-md shadow-xs">Diskon ${prod.discount}%</span>` : ''}
          ${prod.freeShipping ? `<span class="bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-xs">Gratis Ongkir</span>` : ''}
        </div>
        <button
          onclick="toggleWishlist('${prod.id}', event)"
          class="absolute top-2.5 right-2.5 z-10 p-1.5 rounded-full bg-white/90 backdrop-blur-xs text-slate-400 hover:text-rose-500 shadow-sm transition"
          title="Tambah ke Wishlist"
        >
          <span class="text-sm ${isWish ? 'text-rose-500' : ''}">${isWish ? '❤️' : '🤍'}</span>
        </button>
        <div onclick="openProductDetail('${prod.id}')" class="aspect-square bg-slate-100 overflow-hidden cursor-pointer relative">
          <img src="${prod.image}" alt="${prod.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
        </div>
        <div class="p-3.5 flex-1 flex flex-col justify-between space-y-2">
          <div onclick="openProductDetail('${prod.id}')" class="cursor-pointer space-y-1">
            <div class="flex items-center gap-1 text-[11px] text-slate-500">
              <span>📍 ${prod.location}</span>
              ${prod.isStar ? '<span class="text-amber-500 font-bold">⭐ Star</span>' : ''}
            </div>
            <h3 class="font-semibold text-slate-800 text-xs sm:text-sm line-clamp-2 leading-snug group-hover:text-emerald-600 transition">
              ${prod.name}
            </h3>
          </div>
          <div class="space-y-1">
            <div class="flex items-baseline gap-1.5">
              <span class="font-extrabold text-slate-900 text-sm sm:text-base text-emerald-700">${formatIDR(prod.price)}</span>
              ${prod.originalPrice ? `<span class="text-[11px] text-slate-400 line-through">${formatIDR(prod.originalPrice)}</span>` : ''}
            </div>
            <div class="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
              <div class="flex items-center gap-1 text-amber-500 font-bold"><span>⭐</span><span>${prod.rating}</span></div>
              <span>Terjual ${prod.soldCount > 1000 ? (prod.soldCount/1000).toFixed(1)+'rb+' : prod.soldCount}</span>
            </div>
          </div>
          <button
            onclick="addToCart('${prod.id}')"
            class="w-full mt-2 py-2 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white font-bold text-xs rounded-xl border border-emerald-200 hover:border-transparent transition flex items-center justify-center gap-1.5"
          >
            <span>+ Keranjang</span>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// --- 6. PRODUCT DETAIL MODAL ---
function openProductDetail(prodId) {
  const prod = products.find(p => p.id === prodId);
  if (!prod) return;

  const container = document.getElementById('detailContent');
  container.innerHTML = `
    <div class="space-y-3">
      <div class="aspect-square bg-slate-100 rounded-2xl overflow-hidden border border-slate-200">
        <img src="${prod.image}" alt="${prod.name}" class="w-full h-full object-cover">
      </div>
      <div class="flex items-center gap-2 text-xs text-slate-500">
        <span>🛡️ 100% Original</span><span>•</span><span>📦 Dikirim dari ${prod.location}</span>
      </div>
    </div>
    <div class="flex flex-col justify-between space-y-4">
      <div class="space-y-2">
        <h2 class="text-base sm:text-lg font-bold text-slate-900 leading-snug">${prod.name}</h2>
        <div class="flex items-center gap-3 text-xs">
          <span class="flex items-center gap-1 text-amber-500 font-bold">⭐ ${prod.rating}</span>
          <span class="text-slate-400">•</span><span class="text-slate-600">${prod.soldCount} Terjual</span>
        </div>
        <div class="p-3 bg-emerald-50/60 rounded-2xl border border-emerald-100 space-y-1">
          <div class="flex items-baseline gap-2">
            <span class="text-2xl font-black text-emerald-700">${formatIDR(prod.price)}</span>
            ${prod.originalPrice ? `<span class="text-xs text-slate-400 line-through">${formatIDR(prod.originalPrice)}</span>` : ''}
          </div>
        </div>
        ${prod.variants ? `
          <div class="space-y-1.5 pt-2">
            <label class="block text-xs font-bold text-slate-700">Pilih Varian:</label>
            <div class="flex flex-wrap gap-1.5" id="variantChoices">
              ${prod.variants.map((v, i) => `
                <button onclick="selectVariant(this)" class="px-3 py-1.5 text-xs rounded-xl border ${i === 0 ? 'border-emerald-600 bg-emerald-50 text-emerald-700 font-bold' : 'border-slate-200 bg-white text-slate-700'}">${v}</button>
              `).join('')}
            </div>
          </div>
        ` : ''}
        <div class="pt-2">
          <h4 class="text-xs font-bold text-slate-800 mb-1">Deskripsi Produk:</h4>
          <p class="text-xs text-slate-600 leading-relaxed">${prod.description}</p>
        </div>
      </div>
      <div class="pt-4 border-t border-slate-100 flex gap-2">
        <button onclick="addToCart('${prod.id}'); closeModal('detailModal')" class="flex-1 py-3 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-lg flex items-center justify-center">🛒 Masukkan Keranjang</button>
      </div>
    </div>
  `;
  openModal('detailModal');
}

function selectVariant(btn) {
  document.getElementById('variantChoices').querySelectorAll('button').forEach(b => b.className = 'px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-700');
  btn.className = 'px-3 py-1.5 text-xs rounded-xl border border-emerald-600 bg-emerald-50 text-emerald-700 font-bold';
}

// --- 7. CART SYSTEM ---
function addToCart(prodId) {
  const prod = products.find(p => p.id === prodId);
  if (!prod) return;
  const existingIndex = cart.findIndex(item => item.product.id === prodId);
  if (existingIndex > -1) cart[existingIndex].quantity += 1;
  else cart.push({ product: prod, quantity: 1 });
  updateCartUI();
  showToast('Berhasil ditambahkan ke keranjang!', '🛒');
}

function updateCartQuantity(prodId, delta) {
  const index = cart.findIndex(item => item.product.id === prodId);
  if (index === -1) return;
  cart[index].quantity += delta;
  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
    showToast('Item dihapus dari keranjang', '🗑️');
  }
  updateCartUI();
}

function removeCartItem(prodId) {
  cart = cart.filter(item => item.product.id !== prodId);
  updateCartUI();
  showToast('Item berhasil dihapus', '🗑️');
}

function updateCartUI() {
  const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  document.getElementById('cartBadge').innerText = totalQty;
  document.getElementById('cartCountTitle').innerText = `(${totalQty})`;
  document.getElementById('cartTotalItems').innerText = `${totalQty} pcs`;
  document.getElementById('cartTotalPrice').innerText = formatIDR(subtotal);

  const container = document.getElementById('cartItemsContainer');
  const emptyState = document.getElementById('cartEmptyState');
  const footer = document.getElementById('cartFooter');

  if (cart.length === 0) {
    container.innerHTML = '';
    emptyState.classList.remove('hidden');
    footer.classList.add('hidden');
    return;
  }

  emptyState.classList.add('hidden');
  footer.classList.remove('hidden');

  container.innerHTML = cart.map(item => `
    <div class="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200/80 rounded-2xl">
      <img src="${item.product.image}" class="w-16 h-16 rounded-xl object-cover bg-white shrink-0 border border-slate-200">
      <div class="flex-1 min-w-0">
        <h4 class="font-bold text-slate-800 text-xs truncate">${item.product.name}</h4>
        <p class="text-xs font-extrabold text-emerald-600 mt-0.5">${formatIDR(item.product.price)}</p>
        <div class="flex items-center justify-between mt-2">
          <div class="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden text-xs">
            <button onclick="updateCartQuantity('${item.product.id}', -1)" class="px-2 py-0.5 hover:bg-slate-100 font-bold text-slate-600">-</button>
            <span class="px-2.5 py-0.5 font-bold text-slate-800">${item.quantity}</span>
            <button onclick="updateCartQuantity('${item.product.id}', 1)" class="px-2 py-0.5 hover:bg-slate-100 font-bold text-slate-600">+</button>
          </div>
          <button onclick="removeCartItem('${item.product.id}')" class="text-slate-400 hover:text-rose-500 text-xs p-1">🗑️</button>
        </div>
      </div>
    </div>
  `).join('');
}

function openCartDrawer() {
  document.getElementById('cartDrawerBackdrop').classList.remove('hidden');
  document.getElementById('cartDrawer').classList.remove('translate-x-full');
}

function closeCartDrawer() {
  document.getElementById('cartDrawerBackdrop').classList.add('hidden');
  document.getElementById('cartDrawer').classList.add('translate-x-full');
}

// --- 8. WISHLIST SYSTEM ---
function toggleWishlist(prodId, event) {
  if (event) event.stopPropagation();
  const index = wishlist.indexOf(prodId);
  if (index > -1) {
    wishlist.splice(index, 1);
    showToast('Dihapus dari wishlist', '🤍');
  } else {
    wishlist.push(prodId);
    showToast('Disimpan ke wishlist!', '❤️');
  }
  updateWishlistBadge();
  renderProducts();
}

function updateWishlistBadge() {
  const badge = document.getElementById('wishlistBadge');
  if (wishlist.length > 0) {
    badge.innerText = wishlist.length;
    badge.classList.remove('hidden');
  } else {
    badge.classList.add('hidden');
  }
}

function openWishlistModal() {
  const container = document.getElementById('wishlistContainer');
  const wishProducts = products.filter(p => wishlist.includes(p.id));

  if (wishProducts.length === 0) {
    container.innerHTML = `
      <div class="text-center py-10 text-slate-400">
        <span class="text-5xl block mb-2">🤍</span>
        <p class="text-xs">Belum ada produk favorit di wishlist Anda.</p>
      </div>
    `;
  } else {
    container.innerHTML = wishProducts.map(p => `
      <div class="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-2xl gap-3">
        <img src="${p.image}" class="w-14 h-14 rounded-xl object-cover bg-white">
        <div class="flex-1 min-w-0">
          <h4 class="font-bold text-slate-800 text-xs truncate">${p.name}</h4>
          <p class="text-xs text-emerald-600 font-extrabold">${formatIDR(p.price)}</p>
        </div>
        <div class="flex gap-1.5">
          <button onclick="addToCart('${p.id}'); closeModal('wishlistModal')" class="px-3 py-1.5 bg-emerald-600 text-white font-bold text-xs rounded-xl">Beli</button>
          <button onclick="toggleWishlist('${p.id}'); openWishlistModal()" class="p-1.5 text-slate-400 hover:text-rose-500 text-xs">✕</button>
        </div>
      </div>
    `).join('');
  }
  openModal('wishlistModal');
}

// --- 9. CHECKOUT & ORDER LOGIC ---
function openCheckoutModal() {
  if (cart.length === 0) {
    showToast('Keranjang Anda kosong!', '⚠️');
    return;
  }
  closeCartDrawer();
  updateCheckoutCalculation();
  openModal('checkoutModal');
}

function updateCheckoutCalculation() {
  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const courier = document.querySelector('input[name="courier"]:checked')?.value || 'sicepat';
  let shippingCost = courier === 'sicepat' ? 12000 : courier === 'jne' ? 20000 : 35000;
  let discountAmount = 0;

  if (activeVoucher) {
    if (activeVoucher.discountPercent) discountAmount = (subtotal * activeVoucher.discountPercent) / 100;
    if (activeVoucher.freeShipping) shippingCost = 0;
  }

  const total = Math.max(0, subtotal + shippingCost - discountAmount);
  document.getElementById('summarySubtotal').innerText = formatIDR(subtotal);
  document.getElementById('summaryShipping').innerText = shippingCost === 0 ? 'GRATIS' : formatIDR(shippingCost);
  
  const discRow = document.getElementById('summaryDiscountRow');
  if (discountAmount > 0 || (activeVoucher && activeVoucher.freeShipping)) {
    discRow.classList.remove('hidden');
    document.getElementById('summaryDiscount').innerText = `-${formatIDR(discountAmount)}`;
  } else {
    discRow.classList.add('hidden');
  }
  document.getElementById('summaryTotal').innerText = formatIDR(total);
}

function applyVoucher() {
  const code = document.getElementById('voucherInput').value.trim().toUpperCase();
  const msg = document.getElementById('voucherMessage');

  if (code === 'HEMAT20') {
    activeVoucher = { code: 'HEMAT20', discountPercent: 20, freeShipping: false };
    msg.className = 'text-[11px] font-semibold text-emerald-600 block';
    msg.innerText = '✅ Kupon HEMAT20 aktif! Diskon 20% berhasil dipotong.';
  } else if (code === 'GRATISONGKIR') {
    activeVoucher = { code: 'GRATISONGKIR', discountPercent: 0, freeShipping: true };
    msg.className = 'text-[11px] font-semibold text-emerald-600 block';
    msg.innerText = '✅ Kupon GRATISONGKIR aktif! Ongkos kirim Rp 0.';
  } else {
    activeVoucher = null;
    msg.className = 'text-[11px] font-semibold text-rose-500 block';
    msg.innerText = '❌ Kode voucher tidak valid.';
  }
  updateCheckoutCalculation();
}

function processOrder(e) {
  e.preventDefault();
  const name = document.getElementById('custName').value.trim();
  const phone = document.getElementById('custPhone').value.trim();
  const address = document.getElementById('custAddress').value.trim();
  const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value || 'QRIS';
  const courier = document.querySelector('input[name="courier"]:checked')?.value.toUpperCase() || 'SICEPAT';
  
  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  let shippingCost = courier === 'SICEPAT' ? 12000 : courier === 'JNE' ? 20000 : 35000;
  let discountAmount = 0;

  if (activeVoucher) {
    if (activeVoucher.discountPercent) discountAmount = (subtotal * activeVoucher.discountPercent) / 100;
    if (activeVoucher.freeShipping) shippingCost = 0;
  }
  const grandTotal = Math.max(0, subtotal + shippingCost - discountAmount);
  const invoiceNo = 'PK-' + Math.floor(100000 + Math.random() * 900000);

  // --- SAVE TO ORDER HISTORY ---
  const newOrder = {
    invoice: invoiceNo,
    date: new Date().toISOString(),
    total: grandTotal,
    status: 'PACKING', // Status awal: Sedang Dikemas
    items: cart.map(i => ({
      name: i.product.name,
      qty: i.quantity,
      image: i.product.image
    }))
  };
  
  myOrders.unshift(newOrder);
  try {
    localStorage.setItem('pk_my_orders', JSON.stringify(myOrders));
  } catch(err) {
    console.warn("Gagal simpan ke localStorage", err);
  }

  // Populate Success Modal
  document.getElementById('invNumber').innerText = invoiceNo;
  document.getElementById('invCustName').innerText = `${name} (${phone})`;
  document.getElementById('invPaymentMethod').innerText = paymentMethod;
  document.getElementById('invTotalAmount').innerText = formatIDR(grandTotal);

  const itemsListText = cart.map(i => `• ${i.product.name} (${i.quantity}x) = ${formatIDR(i.product.price * i.quantity)}`).join('%0A');
  const waText = `Halo Admin PasarKlick! Saya telah membuat pesanan dengan rincian:%0A%0A*No Invoice:* ${invoiceNo}%0A*Nama:* ${name}%0A*Alamat:* ${address}%0A%0A*Total Bayar:* ${formatIDR(grandTotal)}%0A%0AMohon diproses ya min!`;
  document.getElementById('whatsappOrderBtn').href = `https://wa.me/6281234567890?text=${waText}`;

  cart = [];
  activeVoucher = null;
  updateCartUI();
  closeModal('checkoutModal');
  openModal('successModal');
  showToast('Pesanan berhasil dibuat!', '🎉');
}

function closeSuccessModal() {
  closeModal('successModal');
  openOrderHistoryModal(); // Otomatis buka pelacakan pesanan
}

// --- 10. JUAL BARANG (SELLER CENTER) ---
function handleAddNewProduct(e) {
  e.preventDefault();
  const title = document.getElementById('newProdTitle').value.trim();
  const category = document.getElementById('newProdCategory').value;
  const price = Number(document.getElementById('newProdPrice').value);
  const imageUrl = document.getElementById('newProdImage').value.trim() || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80';
  const desc = document.getElementById('newProdDesc').value.trim() || 'Produk berkualitas dari seller terverifikasi.';

  products.unshift({
    id: 'user_' + Date.now(),
    name: title, category: category, price: price, originalPrice: Math.round(price * 1.25),
    discount: 20, rating: 5.0, soldCount: 1, location: 'Indonesia',
    image: imageUrl, description: desc, variants: [], stock: 10, freeShipping: true, isStar: true
  });

  closeModal('sellerModal');
  document.getElementById('sellProductForm').reset();
  selectedCategory = 'all';
  renderCategoryTabs();
  renderProducts();
  showToast('Barang berhasil ditayangkan!', '🚀');
}

// --- 11. TRACKING HISTORY MODAL ---
function openOrderHistoryModal() {
  const container = document.getElementById('orderHistoryContainer');
  
  if (myOrders.length === 0) {
    container.innerHTML = `
      <div class="text-center py-12 text-slate-400">
        <span class="text-5xl block mb-3">📦</span>
        <p class="text-sm font-medium">Anda belum memiliki riwayat pesanan.</p>
      </div>`;
  } else {
    container.innerHTML = myOrders.map(order => {
      const orderDate = new Date(order.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute:'2-digit' });
      
      let statusBadge = '';
      let timeline = '';
      
      // Simulasi Logika Status
      if (order.status === 'PACKING') {
        statusBadge = '<span class="bg-amber-100 text-amber-700 px-2.5 py-1 rounded-md text-[10px] font-extrabold tracking-wide uppercase border border-amber-200">📦 Sedang Dikemas</span>';
        timeline = `
          <div class="flex items-center mt-4 text-[10px] font-bold">
            <div class="flex-1 flex flex-col items-center text-emerald-600">
              <div class="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-sm border border-emerald-300 mb-1">✓</div>
              <span>Dibayar</span>
            </div>
            <div class="flex-1 h-1 bg-emerald-500 rounded-full mx-1"></div>
            <div class="flex-1 flex flex-col items-center text-amber-600">
              <div class="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-sm border border-amber-300 mb-1 animate-pulse shadow-md">📦</div>
              <span>Dikemas</span>
            </div>
            <div class="flex-1 h-1 bg-slate-200 rounded-full mx-1"></div>
            <div class="flex-1 flex flex-col items-center text-slate-400">
              <div class="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-sm mb-1">🚚</div>
              <span>Dikirim</span>
            </div>
          </div>
        `;
      }

      return `
        <div class="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:border-emerald-300 transition">
          <div class="flex justify-between items-center border-b border-slate-100 pb-3 mb-3">
            <div class="flex items-center gap-2">
              <span class="text-lg">🛍️</span>
              <div>
                <p class="font-mono text-[11px] font-bold text-slate-500">${order.invoice}</p>
                <p class="text-[10px] text-slate-400">${orderDate}</p>
              </div>
            </div>
            ${statusBadge}
          </div>
          
          <div class="flex items-start gap-3">
            <img src="${order.items[0].image}" class="w-14 h-14 rounded-xl object-cover bg-slate-50 border border-slate-200">
            <div class="flex-1">
              <h4 class="font-bold text-slate-800 text-xs">${order.items[0].name}</h4>
              <p class="text-[10px] text-slate-500 mt-0.5">${order.items[0].qty} barang</p>
              ${order.items.length > 1 ? `<p class="text-[10px] text-emerald-600 font-semibold mt-1">+ ${order.items.length - 1} produk lainnya</p>` : ''}
            </div>
          </div>
          
          <div class="mt-4 flex justify-between items-center text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <span class="text-slate-600 font-medium">Total Belanja</span>
            <span class="font-black text-emerald-700 text-sm">${formatIDR(order.total)}</span>
          </div>
          
          ${timeline}
        </div>
      `;
    }).join('');
  }
  
  openModal('orderHistoryModal');
}

// --- 12. GENERAL MODAL & TOAST CONTROLLERS ---
function openModal(id) { document.getElementById(id).classList.remove('hidden'); }
function closeModal(id) { document.getElementById(id).classList.add('hidden'); }

function showToast(text, icon = '✅') {
  const toast = document.getElementById('toast');
  document.getElementById('toastIcon').innerText = icon;
  document.getElementById('toastMessage').innerText = text;
  toast.classList.remove('translate-y-20', 'opacity-0');
  setTimeout(() => { toast.classList.add('translate-y-20', 'opacity-0'); }, 2600);
}

function resetFilters() {
  searchQuery = ''; selectedCategory = 'all';
  document.getElementById('searchInput').value = '';
  document.getElementById('mobileSearchInput').value = '';
  renderCategoryTabs(); renderProducts();
}

// --- 13. INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
  renderCategoryTabs();
  renderProducts();
  updateCartUI();

  const searchInput = document.getElementById('searchInput');
  const clearBtn = document.getElementById('clearSearchBtn');
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    clearBtn.classList.toggle('hidden', !searchQuery);
    renderProducts();
  });
  clearBtn.addEventListener('click', () => {
    searchInput.value = ''; searchQuery = '';
    clearBtn.classList.add('hidden'); renderProducts();
  });

  document.getElementById('mobileSearchInput').addEventListener('input', (e) => {
    searchQuery = e.target.value; renderProducts();
  });

  document.getElementById('sortSelect').addEventListener('change', (e) => {
    currentSort = e.target.value; renderProducts();
  });
});
