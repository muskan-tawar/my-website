
// =====================================================
// JEWELLERY STORE - CART VIEW PAGE
// =====================================================
// IMPORTANT:
// Global cart functionality cartjs.js handle karega.
// Ye file sirf cartView.html ki table aur totals
// display karegi.
// =====================================================


document.addEventListener("DOMContentLoaded", function () {

    renderCartPage();

});



// =====================================================
// GET CART
// =====================================================

function getCartViewData() {

    try {

        const savedCart =
            localStorage.getItem("jewelleryCart");

        if (!savedCart) {
            return [];
        }

        const cart =
            JSON.parse(savedCart);

        return Array.isArray(cart)
            ? cart
            : [];

    } catch (error) {

        console.error(
            "Cart View Load Error:",
            error
        );

        return [];

    }

}



// =====================================================
// FORMAT PRICE
// =====================================================

function formatCartPrice(price) {

    return "$" + Number(price || 0).toFixed(2);

}



// =====================================================
// RENDER CART PAGE
// =====================================================

function renderCartPage() {

    const cart =
        getCartViewData();


    const cartSection =
        document.getElementById("cartSection");


    const emptyCart =
        document.getElementById("emptyCart");


    const cartTableBody =
        document.getElementById("cartTableBody");


    const cartSubtotal =
        document.getElementById("cartSubtotal");


    const cartTotal =
        document.getElementById("cartTotal");



    // =================================================
    // EMPTY CART
    // =================================================

    if (cart.length === 0) {

        if (cartSection) {

            cartSection.classList.add("d-none");

        }


        if (emptyCart) {

            emptyCart.classList.remove("d-none");

        }


        if (cartTableBody) {

            cartTableBody.innerHTML = "";

        }


        if (cartSubtotal) {

            cartSubtotal.textContent =
                "$0.00";

        }


        if (cartTotal) {

            cartTotal.textContent =
                "$0.00";

        }


        return;

    }



    // =================================================
    // CART HAS PRODUCTS
    // =================================================

    if (cartSection) {

        cartSection.classList.remove("d-none");

    }


    if (emptyCart) {

        emptyCart.classList.add("d-none");

    }



    if (!cartTableBody) {

        return;

    }



    cartTableBody.innerHTML = "";



    let total = 0;



    // =================================================
    // CREATE PRODUCT ROWS
    // =================================================

    cart.forEach(function (product) {


        const productId =
            String(product.id || "");


        const productName =
            product.name ||
            "Jewellery Product";


        const productImage =
            product.image ||
            "imgs/logo-retina.png";


        const price =
            Number(product.price) || 0;


        const quantity =
            Math.max(
                1,
                Number(product.quantity) || 1
            );


        const subtotal =
            price * quantity;


        total += subtotal;



        // =================================================
        // TABLE ROW
        // =================================================

        const row =
            document.createElement("tr");



        row.innerHTML = `

            <!-- REMOVE -->

            <td class="text-center">

                <button
                    type="button"
                    class="btn btn-sm text-secondary"
                    onclick="removeProduct('${escapeCartValue(productId)}')"
                    aria-label="Remove product"
                >

                    <i class="bi bi-x-circle fs-5"></i>

                </button>

            </td>



            <!-- PRODUCT -->

            <td>

                <div
                    class="d-flex align-items-center gap-3"
                >

                    <img
                        src="${escapeCartHTML(productImage)}"
                        alt="${escapeCartHTML(productName)}"
                        class="product-image"
                    >

                    <span class="product-name">

                        ${escapeCartHTML(productName)}

                    </span>

                </div>

            </td>



            <!-- PRICE -->

            <td>

                <span>

                    ${formatCartPrice(price)}

                </span>

            </td>



            <!-- QUANTITY -->

            <td>

                <div
                    class="input-group quantity-box"
                >

                    <button
                        type="button"
                        class="btn btn-outline-secondary"
                        onclick="decreaseQuantity('${escapeCartValue(productId)}')"
                    >
                        −
                    </button>


                    <input
                        type="text"
                        value="${quantity}"
                        class="form-control text-center"
                        readonly
                    >


                    <button
                        type="button"
                        class="btn btn-outline-secondary"
                        onclick="increaseQuantity('${escapeCartValue(productId)}')"
                    >
                        +
                    </button>

                </div>

            </td>



            <!-- SUBTOTAL -->

            <td>

                <span>

                    ${formatCartPrice(subtotal)}

                </span>

            </td>

        `;


        cartTableBody.appendChild(row);

    });



    // =================================================
    // UPDATE TOTALS
    // =================================================

    if (cartSubtotal) {

        cartSubtotal.textContent =
            formatCartPrice(total);

    }


    if (cartTotal) {

        cartTotal.textContent =
            formatCartPrice(total);

    }

}



// =====================================================
// ESCAPE HTML
// =====================================================

function escapeCartHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}



// =====================================================
// ESCAPE VALUE FOR ONCLICK
// =====================================================

function escapeCartValue(value) {

    return String(value ?? "")
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'");

}



// =====================================================
// PROCEED TO CHECKOUT
// =====================================================

function proceedCheckout() {

    const cart =
        getCartViewData();


    if (cart.length === 0) {

        alert("Your cart is empty.");

        return;

    }


    // Global cartjs.js ka function use karo

    if (typeof goToCheckout === "function") {

        goToCheckout();

        return;

    }


    // Fallback

    window.location.href =
        "checkout.html";

}



// =====================================================
// STORAGE SYNC
// =====================================================

window.addEventListener(
    "storage",
    function (event) {

        if (
            event.key === "jewelleryCart"
        ) {

            renderCartPage();

        }

    }
);



// =====================================================
// SAME TAB CART UPDATE SUPPORT
// =====================================================
// Jab isi page par global cartjs.js se quantity change hoti hai,
// custom event ke through table refresh ho jayegi.


window.addEventListener(
    "jewelleryCartUpdated",
    function () {

        renderCartPage();

    }
);

