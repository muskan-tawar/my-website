

(function () {

    "use strict";


    // =====================================================
    // STORAGE KEY
    // =====================================================

    const STORAGE_KEY = "jewelleryCart";

    let cart = [];


    // =====================================================
    // LOAD CART
    // =====================================================

    function loadCart() {

        try {

            const savedCart =
                localStorage.getItem(STORAGE_KEY);


            if (!savedCart) {

                return [];

            }


            const parsedCart =
                JSON.parse(savedCart);


            if (!Array.isArray(parsedCart)) {

                return [];

            }


            return parsedCart;


        } catch (error) {

            console.error(
                "Cart Load Error:",
                error
            );

            return [];

        }

    }


    // =====================================================
    // SAVE CART
    // =====================================================

    function saveCart() {

        try {

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(cart)
            );


        } catch (error) {

            console.error(
                "Cart Save Error:",
                error
            );

        }

    }


    // =====================================================
    // CART COUNT
    // =====================================================

    function getCartCount() {

        return cart.reduce(
            function (total, item) {

                return total +
                    Number(item.quantity || 0);

            },
            0
        );

    }


    // =====================================================
    // CART TOTAL
    // =====================================================

    function getCartTotal() {

        return cart.reduce(
            function (total, item) {

                return total +
                    (
                        Number(item.price || 0) *
                        Number(item.quantity || 0)
                    );

            },
            0
        );

    }


    // =====================================================
    // FORMAT PRICE
    // =====================================================

    function formatPrice(price) {

        return "$" +
            Number(price || 0).toFixed(2);

    }


    // =====================================================
    // ESCAPE HTML
    // =====================================================

    function escapeHTML(value) {

        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    // =====================================================
    // UPDATE CART COUNT
    // =====================================================

    function updateCartCount() {

        const count =
            getCartCount();


        document
            .querySelectorAll("#cart-count")
            .forEach(function (element) {

                element.textContent =
                    count;

            });

    }


    // =====================================================
    // UPDATE CART TOTAL
    // =====================================================

    function updateCartTotals() {

        const total =
            getCartTotal();


        const formattedTotal =
            formatPrice(total);


        // =================================================
        // NAVBAR TOTAL
        // =================================================

        document
            .querySelectorAll("#cart-total")
            .forEach(function (element) {

                element.textContent =
                    formattedTotal;

            });


        // =================================================
        // CART PRICE
        // =================================================

        document
            .querySelectorAll(".cart-price")
            .forEach(function (element) {

                element.textContent =
                    formattedTotal;

            });


        // =================================================
        // OLD POPUP SUPPORT
        // =================================================

        document
            .querySelectorAll("#popupCartTotal")
            .forEach(function (element) {

                element.textContent =
                    formattedTotal;

            });


        // =================================================
        // SUBTOTAL
        // =================================================

        document
            .querySelectorAll("#subtotal")
            .forEach(function (element) {

                element.textContent =
                    formattedTotal;

            });

    }


    // =====================================================
    // UPDATE ALL CART UI
    // =====================================================

    function updateCartUI() {

        updateCartCount();

        updateCartTotals();

    }


    // =====================================================
    // CREATE CART HTML
    // =====================================================

    function createCartHTML() {

        // =================================================
        // CART ALREADY EXISTS
        // =================================================

        if (
            document.getElementById(
                "shoppingCart"
            )
        ) {

            return;

        }


        // =================================================
        // CART HTML
        // =================================================

        const cartHTML = `

            <!-- =============================================
                 CART OVERLAY
            ============================================== -->

            <div
                id="cartOverlay"
                class="cart-overlay"
                onclick="closeCart()">
            </div>


            <!-- =============================================
                 SHOPPING CART
            ============================================== -->

            <div
                id="shoppingCart"
                class="offcanvas offcanvas-end shopping-cart-offcanvas"
                tabindex="-1"
                aria-labelledby="shoppingCartLabel">


                <!-- =========================================
                     CART HEADER
                ========================================== -->

                <div
                    class="offcanvas-header cart-offcanvas-header">

                    <h5
                        class="offcanvas-title"
                        id="shoppingCartLabel">

                        Shopping Cart

                    </h5>


                    <button
                        type="button"
                        class="cart-close-btn"
                        onclick="closeCart()"
                        aria-label="Close">

                        <i class="bi bi-x-lg"></i>

                    </button>

                </div>


                <!-- =========================================
                     CART BODY
                ========================================== -->

                <div
                    class="offcanvas-body p-0 d-flex flex-column">


                    <!-- =====================================
                         CART PRODUCTS
                    ====================================== -->

                    <div
                        id="cartItems"
                        class="cart-products flex-grow-1">

                    </div>


                    <!-- =====================================
                         EMPTY CART
                    ====================================== -->

                    <div
                        id="emptyCart"
                        class="empty-cart d-none">

                        <i class="bi bi-bag-x"></i>

                        <h3>
                            Your cart is empty
                        </h3>

                        <p>
                            Add some beautiful jewellery
                            to your cart.
                        </p>

                    </div>


                    <!-- =====================================
                         CART BOTTOM
                    ====================================== -->

                    <div
                        id="cartFooter"
                        class="cart-bottom mt-auto">


                        <!-- SUBTOTAL -->

                        <div
                            class="subtotal-row">

                            <span>
                                Subtotal:
                            </span>

                            <span id="subtotal">
                                $0.00
                            </span>

                        </div>


                        <!-- VIEW CART -->

                        <button
                            type="button"
                            class="cart-action-btn"
                            onclick="goToCartView()">

                            VIEW CART

                        </button>


                        <!-- CHECKOUT -->

                        <button
                            type="button"
                            class="cart-action-btn checkout-cart-btn"
                            onclick="goToCheckout()">

                            CHECKOUT

                        </button>

                    </div>

                </div>

            </div>

        `;


        // =================================================
        // INSERT CART INTO BODY
        // =================================================

        document.body.insertAdjacentHTML(
            "beforeend",
            cartHTML
        );

    }


    // =====================================================
    // RENDER CART
    // =====================================================

    function renderCart() {

        createCartHTML();


        const cartItems =
            document.getElementById(
                "cartItems"
            );


        const emptyCart =
            document.getElementById(
                "emptyCart"
            );


        const cartFooter =
            document.getElementById(
                "cartFooter"
            );


        if (
            !cartItems ||
            !emptyCart ||
            !cartFooter
        ) {

            return;

        }


        // =================================================
        // EMPTY CART
        // =================================================

        if (cart.length === 0) {

            cartItems.innerHTML = "";


            emptyCart.classList.remove(
                "d-none"
            );


            cartFooter.classList.add(
                "d-none"
            );


            updateCartUI();


            return;

        }


        // =================================================
        // CART HAS PRODUCTS
        // =================================================

        emptyCart.classList.add(
            "d-none"
        );


        cartFooter.classList.remove(
            "d-none"
        );


        // =================================================
        // PRODUCT HTML
        // =================================================

        cartItems.innerHTML =
            cart.map(function (item) {


                const itemTotal =
                    Number(item.price || 0) *
                    Number(item.quantity || 0);


                const image =
                    escapeHTML(
                        item.image ||
                        "imgs/logo-retina.png"
                    );


                const name =
                    escapeHTML(
                        item.name ||
                        "Jewellery Product"
                    );


                const category =
                    escapeHTML(
                        item.category ||
                        ""
                    );


                const id =
                    escapeHTML(
                        item.id
                    );


                const quantity =
                    Math.max(
                        1,
                        Number(item.quantity || 1)
                    );


                return `

                    <div
                        class="cart-item">


                        <!-- PRODUCT IMAGE -->

                        <div
                            class="cart-product-image">

                            <img
                                src="${image}"
                                alt="${name}">

                        </div>


                        <!-- PRODUCT INFORMATION -->

                        <div
                            class="cart-product-info">

                            <h3>
                                ${name}
                            </h3>


                            ${
                                category
                                    ? `
                                        <div class="cart-category">
                                            ${category}
                                        </div>
                                      `
                                    : ""
                            }


                            <!-- QUANTITY -->

                            <div
                                class="quantity-box">


                                <button
                                    type="button"
                                    class="quantity-btn"
                                    onclick="decreaseQuantity('${id}')">

                                    −

                                </button>


                                <span
                                    class="quantity">

                                    ${quantity}

                                </span>


                                <button
                                    type="button"
                                    class="quantity-btn"
                                    onclick="increaseQuantity('${id}')">

                                    +

                                </button>


                            </div>

                        </div>


                        <!-- REMOVE -->

                        <button
                            type="button"
                            class="remove-product"
                            onclick="removeProduct('${id}')"
                            aria-label="Remove product">

                            <i class="bi bi-x"></i>

                        </button>


                        <!-- PRODUCT PRICE -->

                        <div
                            class="product-price">

                            ${formatPrice(itemTotal)}

                        </div>


                    </div>

                `;

            }).join("");


        // =================================================
        // UPDATE UI
        // =================================================

        updateCartUI();

    }


    // =====================================================
    // OPEN CART
    // =====================================================

    function openCart() {

        // =================================================
        // CREATE CART
        // =================================================

        createCartHTML();


        // =================================================
        // LOAD LATEST CART
        // =================================================

        cart =
            loadCart();


        // =================================================
        // RENDER CART
        // =================================================

        renderCart();


        // =================================================
        // GET CART ELEMENT
        // =================================================

        const cartElement =
            document.getElementById(
                "shoppingCart"
            );


        const overlay =
            document.getElementById(
                "cartOverlay"
            );


        if (!cartElement) {

            return;

        }


        // =================================================
        // SHOW OVERLAY
        // =================================================

        if (overlay) {

            overlay.classList.add(
                "active"
            );

        }


        // =================================================
        // BOOTSTRAP OFFCANVAS
        // =================================================

        if (
    window.bootstrap &&
    window.bootstrap.Offcanvas
) {
    const cartOffcanvas =
        window.bootstrap.Offcanvas.getOrCreateInstance(
            cartElement,
            {
                backdrop: false,
                scroll: false
            }
        );

    cartOffcanvas.show();
}
    }


    // =====================================================
    // CLOSE CART
    // =====================================================

    function closeCart() {

        const cartElement =
            document.getElementById(
                "shoppingCart"
            );


        const overlay =
            document.getElementById(
                "cartOverlay"
            );


        // =================================================
        // HIDE BOOTSTRAP OFFCANVAS
        // =================================================

        if (
            cartElement &&
            window.bootstrap &&
            bootstrap.Offcanvas
        ) {

            const cartOffcanvas =
                bootstrap.Offcanvas
                    .getInstance(
                        cartElement
                    );


            if (cartOffcanvas) {

                cartOffcanvas.hide();

            }

        }


        // =================================================
        // HIDE CUSTOM OVERLAY
        // =================================================

        if (overlay) {

            overlay.classList.remove(
                "active"
            );

        }

    }


    // =====================================================
    // ADD PRODUCT TO CART
    // =====================================================

    function addProductToCart(product) {

        if (!product) {

            console.error(
                "Product data missing."
            );

            return;

        }


        // =================================================
        // LOAD LATEST CART
        // =================================================

        cart =
            loadCart();


        // =================================================
        // PRODUCT ID
        // =================================================

        const productId =
            String(
                product.id ||
                product.name
            );


        // =================================================
        // QUANTITY
        // =================================================

        const quantityToAdd =
            Math.max(
                1,
                Number(
                    product.quantity || 1
                )
            );


        // =================================================
        // CHECK EXISTING PRODUCT
        // =================================================

        const existingProduct =
            cart.find(function (item) {

                return String(item.id) ===
                    productId;

            });


        // =================================================
        // PRODUCT ALREADY EXISTS
        // =================================================

        if (existingProduct) {

            existingProduct.quantity =
                Number(
                    existingProduct.quantity || 0
                ) +
                quantityToAdd;

        }


        // =================================================
        // NEW PRODUCT
        // =================================================

        else {

            cart.push({

                id:
                    productId,

                name:
                    product.name ||
                    "Jewellery Product",

                price:
                    Number(product.price) || 0,

                category:
                    product.category || "",

                image:
                    product.image ||
                    "imgs/logo-retina.png",

                quantity:
                    quantityToAdd

            });

        }


        // =================================================
        // SAVE
        // =================================================

        saveCart();


        // =================================================
        // UPDATE NAVBAR
        // =================================================

        updateCartUI();


        // =================================================
        // UPDATE CART IF IT EXISTS
        // =================================================

        if (
            document.getElementById(
                "shoppingCart"
            )
        ) {

            renderCart();

        }


        // =================================================
        // CONSOLE
        // =================================================

        console.log(
            "Product added:",
            product.name,
            "Quantity:",
            quantityToAdd
        );

    }


    // =====================================================
    // REMOVE PRODUCT
    // =====================================================

    function removeProduct(id) {

        cart =
            loadCart();


        cart =
            cart.filter(function (item) {

                return String(item.id) !==
                    String(id);

            });


        saveCart();


        renderCart();


        updateCartUI();

    }


    // =====================================================
    // INCREASE QUANTITY
    // =====================================================

    function increaseQuantity(id) {

        cart =
            loadCart();


        const product =
            cart.find(function (item) {

                return String(item.id) ===
                    String(id);

            });


        if (!product) {

            return;

        }


        product.quantity =
            Number(
                product.quantity || 0
            ) + 1;


        saveCart();


        renderCart();


        updateCartUI();

    }


    // =====================================================
    // DECREASE QUANTITY
    // =====================================================

    function decreaseQuantity(id) {

        cart =
            loadCart();


        const product =
            cart.find(function (item) {

                return String(item.id) ===
                    String(id);

            });


        if (!product) {

            return;

        }


        // =================================================
        // DECREASE
        // =================================================

        if (
            Number(product.quantity || 0) > 1
        ) {

            product.quantity--;

        }


        // =================================================
        // REMOVE WHEN QUANTITY = 1
        // =================================================

        else {

            cart =
                cart.filter(function (item) {

                    return String(item.id) !==
                        String(id);

                });

        }


        saveCart();


        renderCart();


        updateCartUI();

    }


    // =====================================================
    // VIEW CART PAGE
    // =====================================================

    function goToCartView() {

        window.location.href =
            "cartview.html";

    }


    // =====================================================
    // CHECKOUT PAGE
    // =====================================================

    function goToCheckout() {

        cart =
            loadCart();


        // =================================================
        // EMPTY CART
        // =================================================

        if (cart.length === 0) {

            alert(
                "Your cart is empty."
            );

            return;

        }


        // =================================================
        // CLOSE CART
        // =================================================

        closeCart();


        // =================================================
        // GO TO CHECKOUT
        // =================================================

        window.location.href =
            "checkout.html";

    }


    // =====================================================
    // SETUP CART EVENTS
    // =====================================================

    function setupCartEvents() {

        const cartElement =
            document.getElementById(
                "shoppingCart"
            );


        const overlay =
            document.getElementById(
                "cartOverlay"
            );


        if (!cartElement) {

            return;

        }


        // =================================================
        // BOOTSTRAP OFFCANVAS HIDDEN
        // =================================================

        cartElement.addEventListener(
            "hidden.bs.offcanvas",
            function () {

                if (overlay) {

                    overlay.classList.remove(
                        "active"
                    );

                }

            }
        );


        // =================================================
        // BOOTSTRAP OFFCANVAS SHOWN
        // =================================================

        cartElement.addEventListener(
            "shown.bs.offcanvas",
            function () {

                if (overlay) {

                    overlay.classList.add(
                        "active"
                    );

                }

            }
        );

    }


    // =====================================================
    // PAGE LOAD
    // =====================================================

    document.addEventListener(
        "DOMContentLoaded",
        function () {

            // LOAD CART

            cart =
                loadCart();


            // CREATE CART

            createCartHTML();


            // SETUP EVENTS

            setupCartEvents();


            // RENDER

            renderCart();


            // UPDATE NAVBAR

            updateCartUI();


            console.log(
                "Global Jewellery Cart Loaded Successfully."
            );

        }
    );


    // =====================================================
    // STORAGE EVENT
    // =====================================================

    window.addEventListener(
        "storage",
        function (event) {

            if (
                event.key === STORAGE_KEY
            ) {

                cart =
                    loadCart();


                renderCart();


                updateCartUI();

            }

        }
    );


    // =====================================================
    // MAKE FUNCTIONS GLOBAL
    // =====================================================

    window.openCart =
        openCart;


    window.closeCart =
        closeCart;


    window.addProductToCart =
        addProductToCart;


    window.removeProduct =
        removeProduct;


    window.increaseQuantity =
        increaseQuantity;


    window.decreaseQuantity =
        decreaseQuantity;


    window.goToCartView =
        goToCartView;


    window.goToCheckout =
        goToCheckout;


    // =====================================================
    // GLOBAL CART ACCESS
    // =====================================================

    window.getJewelleryCart =
        function () {

            return loadCart();

        };


})();