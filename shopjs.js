
document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    // ============================================================
    // 1. HTML ELEMENTS
    // ============================================================

    const filterBtn = document.getElementById("filterBtn");
    const filterSidebar = document.getElementById("filterSidebar");
    const filterClose = document.getElementById("filterClose");
    const filterOverlay = document.getElementById("filterOverlay");

    const minPrice = document.getElementById("minPrice");
    const maxPrice = document.getElementById("maxPrice");
    const minPriceValue = document.getElementById("minPriceValue");
    const maxPriceValue = document.getElementById("maxPriceValue");
    const trackFill = document.querySelector(".price-track-fill");

    const categoryFilters = Array.from(
        document.querySelectorAll(".category-checkbox")
    );

    const applyFilter = document.getElementById("applyFilter");
    const resetFilter = document.getElementById("resetFilter");
    const categoryToggle = document.getElementById("categoryToggle");
    const categoryList = document.getElementById("categoryList");

    const productGrid = document.getElementById("productGrid");
    const productCount = document.getElementById("productCount");
    const gridView = document.getElementById("gridView");
    const listView = document.getElementById("listView");
    const sortProducts = document.getElementById("sortProducts");

    const cartCount = document.getElementById("cart-count");
    const cartTotal = document.getElementById("cart-total");
    const backToTop = document.getElementById("backToTop");
    const checkoutForm = document.getElementById("checkoutForm");

    const DEFAULT_MIN_PRICE = minPrice ? Number(minPrice.min) : 0;
    const DEFAULT_MAX_PRICE = maxPrice ? Number(maxPrice.max) : 100000;

    let allProducts = [];
    let originalProductOrder = [];
    let cart = [];

    try {
        const savedCart = JSON.parse(
            localStorage.getItem("jewelleryCart")
        );

        cart = Array.isArray(savedCart) ? savedCart : [];
    } catch (error) {
        cart = [];
    }

    // ============================================================
    // 2. HELPER FUNCTIONS
    // ============================================================

    function money(value) {
        return "$" + (Number(value) || 0).toFixed(2);
    }

    function normalizeCategory(value) {
        return String(value || "")
            .toLowerCase()
            .trim()
            .replace(/[\s_-]+/g, "");
    }

    function getProductPrice(card) {
        return Number(card.dataset.price) || 0;
    }

    function getProductId(product) {
        return String(
            product.id ??
            product.productId ??
            product.name ??
            ""
        );
    }

    function getProductImage(product) {
        return (
            product.image ||
            product.img ||
            product.imageUrl ||
            ""
        );
    }
    
    function openProductDetails(card) {
        const productId = card.dataset.id;

        window.location.href =
            "productsdetails.html?id=" +
            encodeURIComponent(productId);
    }

    // ============================================================
    // 3. FILTER SIDEBAR
    // ============================================================

    const hasBootstrapOffcanvas = Boolean(
        filterSidebar &&
        filterSidebar.classList.contains("offcanvas") &&
        window.bootstrap &&
        window.bootstrap.Offcanvas
    );

    const filterOffcanvas = hasBootstrapOffcanvas
        ? window.bootstrap.Offcanvas.getOrCreateInstance(filterSidebar)
        : null;

    function closeFilter() {
        if (hasBootstrapOffcanvas) {
            filterOffcanvas.hide();
        } else {
            if (filterSidebar) {
                filterSidebar.classList.remove("active");
            }

            if (filterOverlay) {
                filterOverlay.classList.remove("active");
            }

            document.body.style.overflow = "";
        }
    }

    if (filterClose) {
        filterClose.addEventListener("click", closeFilter);
    }

    if (filterOverlay) {
        filterOverlay.addEventListener("click", closeFilter);
    }

    if (filterSidebar && hasBootstrapOffcanvas) {
        filterSidebar.addEventListener(
            "hidden.bs.offcanvas",
            function () {
                document.body.style.overflow = "";
            }
        );
    }

    // ============================================================
    // 4. PRICE SLIDER
    // ============================================================

    function updatePriceSlider() {
        if (!minPrice || !maxPrice) return;

        const min = Number(minPrice.min);
        const max = Number(minPrice.max);

        let low = Number(minPrice.value);
        let high = Number(maxPrice.value);

        if (low > high) {
            if (document.activeElement === minPrice) {
                low = high;
                minPrice.value = String(low);
            } else {
                high = low;
                maxPrice.value = String(high);
            }
        }

        const range = max - min || 1;

        const leftPercent = ((low - min) / range) * 100;
        const rightPercent = ((high - min) / range) * 100;

        if (trackFill) {
            trackFill.style.left = leftPercent + "%";

            trackFill.style.width =
                Math.max(0, rightPercent - leftPercent) + "%";
        }

        if (minPriceValue) {
            minPriceValue.textContent = "$" + low;
        }

        if (maxPriceValue) {
            maxPriceValue.textContent = "$" + high;
        }

        updateResetButton();
    }

    function updateResetButton() {
        const priceChanged = Boolean(
            minPrice &&
            maxPrice &&
            (
                Number(minPrice.value) !== DEFAULT_MIN_PRICE ||
                Number(maxPrice.value) !== DEFAULT_MAX_PRICE
            )
        );

        const categoryChanged = categoryFilters.some(
            function (checkbox) {
                return checkbox.checked;
            }
        );

        if (resetFilter) {
            const shouldShow = priceChanged || categoryChanged;

            resetFilter.classList.toggle("d-none", !shouldShow);
            resetFilter.hidden = !shouldShow;
        }
    }

    if (minPrice) {
        minPrice.addEventListener("input", function () {
            if (
                maxPrice &&
                Number(minPrice.value) > Number(maxPrice.value)
            ) {
                minPrice.value = maxPrice.value;
            }

            updatePriceSlider();
            filterProducts();
        });
    }

    if (maxPrice) {
        maxPrice.addEventListener("input", function () {
            if (
                minPrice &&
                Number(maxPrice.value) < Number(minPrice.value)
            ) {
                maxPrice.value = minPrice.value;
            }

            updatePriceSlider();
            filterProducts();
        });
    }

    // ============================================================
    // 5. RENDER PRODUCTS
    // ============================================================

    
function renderProducts(products) {
    if (!productGrid) {
        console.error('Missing "#productGrid" in shop.html');
        return;
    }

    productGrid.innerHTML = "";

    if (!Array.isArray(products)) {
        throw new Error(
            "products.json must contain a JSON array."
        );
    }

    products.forEach(function (product, index) {
        const card = document.createElement("article");

        card.className = "product-card col position-relative";

        card.dataset.id =
            getProductId(product) || "product" + (index + 1);

        card.dataset.name = product.name || "Jewellery Product";
        card.dataset.category = product.category || "";
        card.dataset.price = String(Number(product.price) || 0);
        card.dataset.order = String(product.order ?? index);
        card.dataset.popularity = String(
            Number(product.popularity) || 0
        );
        card.dataset.rating = String(Number(product.rating) || 0);
        card.dataset.date = product.date || product.createdAt || "";

        // Discount badge
        if (product.discount) {
            const discount = document.createElement("span");

            discount.className =
                "discount d-flex align-items-center justify-content-center rounded-pill";

            discount.textContent =
                "-" + Number(product.discount) + "%";

            card.appendChild(discount);
        }

        // Product image
        const imageBox = document.createElement("div");

        imageBox.className =
            "product-image d-flex align-items-center justify-content-center";

        const image = document.createElement("img");

        image.src = getProductImage(product);
        image.alt = product.name || "Jewellery product";
        image.loading = "lazy";

        image.addEventListener("error", function () {
            image.classList.add("image-load-error");
            image.alt = "Product image could not be loaded";
        });

        imageBox.appendChild(image);

        // Product information
        const info = document.createElement("div");
        info.className = "product-info";

        const category = document.createElement("p");
        category.className = "product-category mb-2";
        category.textContent = product.category || "";

        const title = document.createElement("h3");
        title.className = "mb-2";
        title.textContent = product.name || "Jewellery Product";

        const price = document.createElement("p");
        price.className = "product-price";

        if (
            product.oldPrice &&
            Number(product.oldPrice) > Number(product.price)
        ) {
            price.classList.add("sale-price");

            const oldPrice = document.createElement("span");

            oldPrice.className = "old-price";
            oldPrice.textContent = money(product.oldPrice);

            price.appendChild(oldPrice);

            price.appendChild(
                document.createTextNode(
                    " " + money(product.price)
                )
            );
        } else {
            price.textContent = money(product.price);
        }

        info.append(category, title, price);
        card.append(imageBox, info);

        // ==========================================
        // OPEN PRODUCT DETAILS PAGE ON CARD CLICK
        // ==========================================

        card.style.cursor = "pointer";
        card.setAttribute("tabindex", "0");
        card.setAttribute(
            "aria-label",
            "View details for " + (product.name || "Jewellery Product")
        );

        function openDetailsPage() {
            const productId =
                card.dataset.id || "product" + (index + 1);

            window.location.href =
                "productsdetails.html?id=" +
                encodeURIComponent(productId);
        }

        card.addEventListener("click", function (event) {
            // Keep Add to Cart and Quick View buttons working
            if (event.target.closest("button")) {
                return;
            }

            openDetailsPage();
        });

        // Keyboard accessibility: Enter or Space
        card.addEventListener("keydown", function (event) {
            if (
                event.target === card &&
                (event.key === "Enter" || event.key === " ")
            ) {
                event.preventDefault();
                openDetailsPage();
            }
        });

        productGrid.appendChild(card);
    });

    originalProductOrder = Array.from(
        productGrid.querySelectorAll(".product-card")
    );
}

    // ============================================================
    // 6. CART STORAGE AND NAVBAR UI
    // ============================================================

    function saveCart() {
        try {
            localStorage.setItem(
                "jewelleryCart",
                JSON.stringify(cart)
            );
        } catch (error) {
            console.error("Could not save cart:", error);
        }
    }

    function updateCartUI() {
        const quantity = cart.reduce(
            function (sum, item) {
                return sum + (Number(item.quantity) || 0);
            },
            0
        );

        const total = cart.reduce(
            function (sum, item) {
                return sum +
                    (
                        (Number(item.price) || 0) *
                        (Number(item.quantity) || 0)
                    );
            },
            0
        );

        if (cartCount) {
            cartCount.textContent = String(quantity);
        }

        if (cartTotal) {
            cartTotal.textContent = money(total);
        }

        const cartSubtotal =
            document.getElementById("cartSubtotal");

        if (cartSubtotal) {
            cartSubtotal.textContent = money(total);
        }
    }

    function showCartMessage(name) {
        const previous = document.getElementById("shopCartToast");

        if (previous) {
            previous.remove();
        }

        const toast = document.createElement("div");

        toast.id = "shopCartToast";
        toast.className =
            "alert alert-dark position-fixed bottom-0 end-0 m-3";

        toast.style.zIndex = "2000";
        toast.textContent = (name || "Product") + " added to cart.";

        document.body.appendChild(toast);

        window.setTimeout(function () {
            if (toast.isConnected) {
                toast.remove();
            }
        }, 2200);
    }

    function addToCart(card) {
        const image = card.querySelector(".product-image img");

        const item = {
            id: card.dataset.id,
            name: card.dataset.name,
            category: card.dataset.category,
            price: getProductPrice(card),
            image: image ? image.getAttribute("src") : "",
            quantity: 1
        };

        const existing = cart.find(function (cartItem) {
            return String(cartItem.id) === String(item.id);
        });

        if (existing) {
            existing.quantity =
                (Number(existing.quantity) || 1) + 1;
        } else {
            cart.push(item);
        }

        saveCart();
        updateCartUI();
        showCartMessage(item.name);
    }

    // ============================================================
    // 7. QUICK VIEW MODAL
    // ============================================================

    function createQuickViewModal() {
        if (document.getElementById("quickViewModal")) {
            return;
        }

        const wrapper = document.createElement("div");

        wrapper.innerHTML = `
            <div class="modal fade"
                 id="quickViewModal"
                 tabindex="-1"
                 aria-hidden="true">

                <div class="modal-dialog modal-lg modal-dialog-centered">
                    <div class="modal-content border-0">

                        <div class="modal-header">
                            <h5 class="modal-title" id="quickViewTitle">
                                Product details
                            </h5>

                            <button type="button"
                                    class="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close">
                            </button>
                        </div>

                        <div class="modal-body">
                            <div class="row align-items-center g-4">

                                <div class="col-md-6 text-center">
                                    <img id="quickViewImage"
                                         src=""
                                         alt=""
                                         class="img-fluid"
                                         style="max-height:380px;object-fit:contain;">
                                </div>

                                <div class="col-md-6">
                                    <p id="quickViewCategory"
                                       class="text-secondary"></p>

                                    <h2 id="quickViewName"
                                        class="mb-3"></h2>

                                    <h4 id="quickViewPrice"
                                        class="mb-4"></h4>

                                    <button type="button"
                                            id="quickViewAddCart"
                                            class="btn btn-dark w-100 py-3">
                                        <i class="bi bi-bag-plus me-2"></i>
                                        ADD TO CART
                                    </button>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(wrapper.firstElementChild);
    }

    function openQuickView(card) {
        const image = card.querySelector(".product-image img");

        const modalElement =
            document.getElementById("quickViewModal");

        if (!modalElement || !window.bootstrap) {
            return;
        }

        const title = card.dataset.name || "";

        document.getElementById("quickViewTitle").textContent = title;
        document.getElementById("quickViewName").textContent = title;

        document.getElementById("quickViewCategory").textContent =
            card.dataset.category || "";

        document.getElementById("quickViewPrice").textContent =
            money(getProductPrice(card));

        const modalImage =
            document.getElementById("quickViewImage");

        modalImage.src = image ? image.src : "";
        modalImage.alt = title;

        document.getElementById("quickViewAddCart").onclick =
            function () {
                addToCart(card);
            };

        window.bootstrap.Modal
            .getOrCreateInstance(modalElement)
            .show();
    }

    // ============================================================
    // 8. PRODUCT ACTION BUTTONS
    // ============================================================

    function createProductButtons() {
        if (!productGrid) return;

        productGrid.querySelectorAll(".product-card").forEach(
            function (card) {
                const imageBox =
                    card.querySelector(".product-image");

                if (
                    !imageBox ||
                    imageBox.querySelector(".product-actions")
                ) {
                    return;
                }

                const actions = document.createElement("div");
                actions.className = "product-actions";

                const addButton = document.createElement("button");

                addButton.type = "button";
                addButton.className =
                    "product-action-btn add-cart-btn";

                addButton.title = "Add to cart";

                addButton.setAttribute(
                    "aria-label",
                    "Add " + card.dataset.name + " to cart"
                );

                addButton.innerHTML =
                    '<i class="bi bi-basket"></i>';

                const viewButton = document.createElement("button");

                viewButton.type = "button";
                viewButton.className =
                    "product-action-btn view-product-btn";

                viewButton.title = "Quick view";

                viewButton.setAttribute(
                    "aria-label",
                    "Quick view " + card.dataset.name
                );

                viewButton.innerHTML =
                    '<i class="bi bi-eye"></i>';

                addButton.addEventListener("click", function (event) {
                    event.preventDefault();
                    event.stopPropagation();

                    addToCart(card);
                });

                viewButton.addEventListener("click", function (event) {
                    event.preventDefault();
                    event.stopPropagation();

                    openQuickView(card);
                });

                actions.append(addButton, viewButton);
                imageBox.appendChild(actions);
            }
        );
    }

    // ============================================================
    // 9. FILTER PRODUCTS
    // ============================================================

    function filterProducts() {
        if (!productGrid) return;

        const low = minPrice ? Number(minPrice.value) : 0;

        const high = maxPrice
            ? Number(maxPrice.value)
            : Infinity;

        const selected = categoryFilters
            .filter(function (checkbox) {
                return checkbox.checked;
            })
            .map(function (checkbox) {
                return normalizeCategory(checkbox.value);
            });

        let visible = 0;

        productGrid.querySelectorAll(".product-card").forEach(
            function (card) {
                const category =
                    normalizeCategory(card.dataset.category);

                const price = getProductPrice(card);

                const categoryMatches =
                    selected.length === 0 ||
                    selected.includes(category);

                const priceMatches =
                    price >= low && price <= high;

                const show = categoryMatches && priceMatches;

                card.classList.toggle("d-none", !show);
                card.style.display = show ? "" : "none";

                if (show) {
                    visible++;
                }
            }
        );

        if (productCount) {
            productCount.textContent =
                visible === 1
                    ? "Showing 1 product"
                    : "Showing " + visible + " products";
        }

        let noProducts =
            document.getElementById("noProductsMessage");

        if (visible === 0) {
            if (!noProducts) {
                noProducts = document.createElement("p");

                noProducts.id = "noProductsMessage";
                noProducts.className = "text-center py-5";
                noProducts.textContent =
                    "No products match your filters.";

                productGrid.insertAdjacentElement(
                    "afterend",
                    noProducts
                );
            }

            noProducts.hidden = false;
        } else if (noProducts) {
            noProducts.hidden = true;
        }

        updateResetButton();
    }

    categoryFilters.forEach(function (checkbox) {
        checkbox.addEventListener("change", filterProducts);
    });

    if (applyFilter) {
        applyFilter.addEventListener("click", function () {
            filterProducts();
            closeFilter();
        });
    }

    if (resetFilter) {
        resetFilter.addEventListener("click", function () {
            if (minPrice) {
                minPrice.value = String(DEFAULT_MIN_PRICE);
            }

            if (maxPrice) {
                maxPrice.value = String(DEFAULT_MAX_PRICE);
            }

            categoryFilters.forEach(function (checkbox) {
                checkbox.checked = false;
            });

            updatePriceSlider();
            filterProducts();
        });
    }

    // ============================================================
    // 10. SORT PRODUCTS
    // ============================================================

    function sortProductCards(sortType) {
        if (!productGrid) return;

        const cards = Array.from(
            productGrid.querySelectorAll(".product-card")
        );

        if (sortType === "default") {
            const orderMap = new Map(
                originalProductOrder.map(function (card, index) {
                    return [card, index];
                })
            );

            cards.sort(function (a, b) {
                return (
                    (orderMap.get(a) ?? 0) -
                    (orderMap.get(b) ?? 0)
                );
            });
        } else if (sortType === "low") {
            cards.sort(function (a, b) {
                return getProductPrice(a) - getProductPrice(b);
            });
        } else if (sortType === "high") {
            cards.sort(function (a, b) {
                return getProductPrice(b) - getProductPrice(a);
            });
        } else if (sortType === "popular") {
            cards.sort(function (a, b) {
                return (
                    Number(b.dataset.popularity) -
                    Number(a.dataset.popularity)
                );
            });
        } else if (sortType === "rating") {
            cards.sort(function (a, b) {
                return (
                    Number(b.dataset.rating) -
                    Number(a.dataset.rating)
                );
            });
        } else if (sortType === "latest") {
            cards.sort(function (a, b) {
                const dateA =
                    Date.parse(a.dataset.date) ||
                    Number(a.dataset.order) ||
                    0;

                const dateB =
                    Date.parse(b.dataset.date) ||
                    Number(b.dataset.order) ||
                    0;

                return dateB - dateA;
            });
        }

        cards.forEach(function (card) {
            productGrid.appendChild(card);
        });

        filterProducts();
    }

    if (sortProducts) {
        sortProducts.addEventListener("change", function () {
            sortProductCards(sortProducts.value);
        });
    }

    // ============================================================
    // 11. GRID AND LIST VIEW
    // ============================================================

    if (gridView && listView && productGrid) {
        gridView.addEventListener("click", function () {
            productGrid.classList.remove("list-view");

            gridView.classList.add("active");
            listView.classList.remove("active");
        });

        listView.addEventListener("click", function () {
            productGrid.classList.add("list-view");

            listView.classList.add("active");
            gridView.classList.remove("active");
        });
    }

    // ============================================================
    // 12. CATEGORY COLLAPSE ICON
    // ============================================================

    if (categoryList && categoryToggle) {
        const categoryIcon =
            document.getElementById("categoryIcon");

        categoryList.addEventListener(
            "shown.bs.collapse",
            function () {
                if (categoryIcon) {
                    categoryIcon.classList.remove("bi-chevron-down");
                    categoryIcon.classList.add("bi-chevron-up");
                }
            }
        );

        categoryList.addEventListener(
            "hidden.bs.collapse",
            function () {
                if (categoryIcon) {
                    categoryIcon.classList.remove("bi-chevron-up");
                    categoryIcon.classList.add("bi-chevron-down");
                }
            }
        );
    }

    // ============================================================
    // 13. CHECKOUT SUMMARY
    // Front-end demo only. No real payment is processed.
    // ============================================================

    function renderCheckout() {
        const itemsContainer =
            document.getElementById("checkoutItems");

        const subtotalElement =
            document.getElementById("checkoutSubtotal");

        const totalElement =
            document.getElementById("checkoutTotal");

        if (!itemsContainer) return;

        itemsContainer.innerHTML = "";

        const subtotal = cart.reduce(
            function (sum, item) {
                const rowTotal =
                    (Number(item.price) || 0) *
                    (Number(item.quantity) || 0);

                const row = document.createElement("div");

                row.className =
                    "d-flex justify-content-between gap-3 mb-2";

                const label = document.createElement("span");

                label.textContent =
                    (item.name || "Product") +
                    " × " +
                    item.quantity;

                const price = document.createElement("strong");

                price.textContent = money(rowTotal);

                row.append(label, price);
                itemsContainer.appendChild(row);

                return sum + rowTotal;
            },
            0
        );

        if (subtotalElement) {
            subtotalElement.textContent = money(subtotal);
        }

        if (totalElement) {
            totalElement.textContent = money(subtotal);
        }
    }

    if (checkoutForm) {
        checkoutForm.addEventListener("submit", function (event) {
            event.preventDefault();

            if (cart.length === 0) {
                alert("Your cart is empty.");
                return;
            }

            if (!checkoutForm.reportValidity()) {
                return;
            }

            renderCheckout();

            const orderNumber =
                "JS" + Date.now().toString().slice(-6);

            const orderNumberElement =
                document.getElementById("orderNumber");

            if (orderNumberElement) {
                orderNumberElement.textContent = orderNumber;
            }

            const checkoutModalElement =
                document.getElementById("checkoutModal");

            const successModalElement =
                document.getElementById("orderSuccessModal");

            if (
                checkoutModalElement &&
                window.bootstrap &&
                window.bootstrap.Modal
            ) {
                const modal =
                    window.bootstrap.Modal.getInstance(
                        checkoutModalElement
                    );

                if (modal) {
                    modal.hide();
                }
            }

            // Demo order only; this does not create a real order.
            cart = [];

            saveCart();
            updateCartUI();

            window.setTimeout(function () {
                if (
                    successModalElement &&
                    window.bootstrap &&
                    window.bootstrap.Modal
                ) {
                    window.bootstrap.Modal
                        .getOrCreateInstance(successModalElement)
                        .show();
                }
            }, 350);
        });
    }

    // ============================================================
    // 14. BACK TO TOP
    // ============================================================

    if (backToTop) {
        window.addEventListener("scroll", function () {
            backToTop.classList.toggle(
                "show",
                window.scrollY > 400
            );
        });

        backToTop.addEventListener("click", function () {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    // ============================================================
    // 15. INITIALIZE WEBSITE
    // ============================================================

    updatePriceSlider();
    updateCartUI();

    fetch("products.json")
        .then(function (response) {
            if (!response.ok) {
                throw new Error(
                    "products.json file load nahi ho paayi. HTTP " +
                    response.status
                );
            }

            return response.json();
        })
        .then(function (products) {
            if (!Array.isArray(products)) {
                throw new Error(
                    "products.json mein products ki JSON array honi chahiye."
                );
            }

            allProducts = products;

            renderProducts(allProducts);

            createQuickViewModal();
            createProductButtons();

            filterProducts();
            updatePriceSlider();
            updateCartUI();
        })
        .catch(function (error) {
            console.error("Products loading error:", error);

            if (productGrid) {
                productGrid.innerHTML = `
                    <div class="col-12 text-center py-5">
                        <p class="text-danger">
                            Products load nahi ho paaye.
                        </p>
                        <p>
                            Live Server se page open karo aur
                            products.json ka path aur JSON format
                            check karo.
                        </p>
                    </div>
                `;
            }

            if (productCount) {
                productCount.textContent =
                    "Products could not be loaded";
            }
        });

    // ============================================================
    // 16. UPDATE CART WHEN ANOTHER PAGE CHANGES IT
    // ============================================================

    window.addEventListener("storage", function (event) {
        if (event.key === "jewelleryCart") {
            try {
                const saved = JSON.parse(
                    localStorage.getItem("jewelleryCart")
                );

                cart = Array.isArray(saved) ? saved : [];
            } catch (error) {
                cart = [];
            }

            updateCartUI();
        }
    });
});
