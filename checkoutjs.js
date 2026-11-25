/* =====================================================
   JEWELLERY STORE - CHECKOUT JS
===================================================== */


/* =====================================================
   GLOBAL VARIABLES
===================================================== */

let checkoutCart = [];

let discount = 0;


/* =====================================================
   STORAGE KEY
===================================================== */

const CHECKOUT_STORAGE_KEY = "jewelleryCart";


/* =====================================================
   DOM READY
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    loadCheckoutCart();

    displayCheckoutProducts();

    updateCheckoutTotals();

    setupCoupon();

    setupPlaceOrder();

});


/* =====================================================
   LOAD CART
===================================================== */

function loadCheckoutCart() {

    try {

        const storedCart =
            localStorage.getItem(CHECKOUT_STORAGE_KEY);


        if (!storedCart) {

            checkoutCart = [];

            return;

        }


        const parsedCart =
            JSON.parse(storedCart);


        if (!Array.isArray(parsedCart)) {

            checkoutCart = [];

            return;

        }


        checkoutCart = parsedCart;


    } catch (error) {

        console.error(
            "Checkout Cart Loading Error:",
            error
        );

        checkoutCart = [];

    }

}


/* =====================================================
   DISPLAY PRODUCTS
===================================================== */

function displayCheckoutProducts() {

    const container =
        document.getElementById("checkoutProducts");


    if (!container) {

        return;

    }


    container.innerHTML = "";


    /* =================================================
       EMPTY CART
    ================================================= */

    if (checkoutCart.length === 0) {

        container.innerHTML = `

            <div class="empty-checkout">

                Your cart is empty.

                <br><br>

                <a href="shop.html">
                    Continue Shopping
                </a>

            </div>

        `;

        return;

    }


    /* =================================================
       PRODUCTS
    ================================================= */

    checkoutCart.forEach(function (product) {


        const quantity =
            Math.max(
                1,
                Number(product.quantity) || 1
            );


        const price =
            getProductPrice(product.price);


        const productName =
            escapeHTML(
                product.name ||
                "Jewellery Product"
            );


        const productImage =
            escapeHTML(
                product.image ||
                "imgs/logo-retina.png"
            );


        const itemTotal =
            price * quantity;


        const productHTML = `

            <div class="checkout-product">


                <!-- PRODUCT IMAGE -->

                <div class="checkout-product-image-wrapper">

                    <img
                        src="${productImage}"
                        alt="${productName}"
                        class="checkout-product-image"
                    >


                    <span class="checkout-product-quantity">
                        ${quantity}
                    </span>

                </div>



                <!-- PRODUCT INFORMATION -->

                <div class="checkout-product-info">

                    <div class="checkout-product-name">

                        ${productName}

                    </div>

                </div>



                <!-- PRODUCT PRICE -->

                <div class="checkout-product-price">

                    $${itemTotal.toFixed(2)}

                </div>


            </div>

        `;


        container.insertAdjacentHTML(
            "beforeend",
            productHTML
        );

    });

}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHTML(value) {

    return String(value ?? "")

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}


/* =====================================================
   PRICE CONVERTER
===================================================== */

function getProductPrice(price) {


    if (typeof price === "number") {

        return price;

    }


    if (typeof price === "string") {

        const cleanedPrice =
            price.replace(
                /[^0-9.]/g,
                ""
            );


        return Number(cleanedPrice) || 0;

    }


    return 0;

}


/* =====================================================
   CALCULATE SUBTOTAL
===================================================== */

function calculateSubtotal() {

    let subtotal = 0;


    checkoutCart.forEach(function (product) {


        const price =
            getProductPrice(
                product.price
            );


        const quantity =
            Math.max(
                1,
                Number(product.quantity) || 1
            );


        subtotal +=
            price * quantity;

    });


    return subtotal;

}


/* =====================================================
   CALCULATE FINAL TOTAL
===================================================== */

function calculateFinalTotal() {

    const subtotal =
        calculateSubtotal();


    let total =
        subtotal - discount;


    if (total < 0) {

        total = 0;

    }


    return total;

}


/* =====================================================
   UPDATE TOTALS
===================================================== */

function updateCheckoutTotals() {

    const subtotal =
        calculateSubtotal();


    const total =
        calculateFinalTotal();


    const subtotalElement =
        document.getElementById(
            "checkoutSubtotal"
        );


    const totalElement =
        document.getElementById(
            "checkoutTotal"
        );


    const placeOrderTotal =
        document.getElementById(
            "placeOrderTotal"
        );


    /* =================================================
       SUBTOTAL
    ================================================= */

    if (subtotalElement) {

        subtotalElement.textContent =
            "$" +
            subtotal.toFixed(2);

    }


    /* =================================================
       TOTAL
    ================================================= */

    if (totalElement) {

        totalElement.textContent =
            "$" +
            total.toFixed(2);

    }


    /* =================================================
       PLACE ORDER BUTTON TOTAL
    ================================================= */

    if (placeOrderTotal) {

        placeOrderTotal.textContent =
            "$" +
            total.toFixed(2);

    }

}


/* =====================================================
   COUPON
===================================================== */

function setupCoupon() {

    const button =
        document.getElementById(
            "applyCoupon"
        );


    const input =
        document.getElementById(
            "couponCode"
        );


    const message =
        document.getElementById(
            "couponMessage"
        );


    if (
        !button ||
        !input ||
        !message
    ) {

        return;

    }


    button.addEventListener(
        "click",
        function () {


            const coupon =
                input.value
                    .trim()
                    .toUpperCase();


            /* =========================================
               EMPTY COUPON
            ========================================== */

            if (coupon === "") {

                discount = 0;


                message.textContent =
                    "Please enter a coupon code.";


                updateCheckoutTotals();


                return;

            }


            /* =========================================
               SAVE10 COUPON
            ========================================== */

            if (coupon === "SAVE10") {


                const subtotal =
                    calculateSubtotal();


                discount =
                    subtotal * 0.10;


                message.textContent =
                    "Coupon applied successfully! 10% discount.";


                updateCheckoutTotals();


            }


            /* =========================================
               INVALID COUPON
            ========================================== */

            else {

                discount = 0;


                message.textContent =
                    "Invalid coupon code.";


                updateCheckoutTotals();

            }

        }
    );

}


/* =====================================================
   PLACE ORDER
===================================================== */

function setupPlaceOrder() {

    const button =
        document.getElementById(
            "placeOrderBtn"
        );


    if (!button) {

        return;

    }


    button.addEventListener(
        "click",
        function () {


            /* =========================================
               CHECK CART
            ========================================== */

            if (checkoutCart.length === 0) {

                alert(
                    "Your cart is empty."
                );

                return;

            }


            /* =========================================
               CUSTOMER DETAILS
            ========================================== */

            const email =
                document
                    .getElementById("email")
                    .value
                    .trim();


            const firstName =
                document
                    .getElementById("firstName")
                    .value
                    .trim();


            const lastName =
                document
                    .getElementById("lastName")
                    .value
                    .trim();


            const country =
                document
                    .getElementById("country")
                    .value;


            const address =
                document
                    .getElementById("address")
                    .value
                    .trim();


            const apartment =
                document
                    .getElementById("apartment")
                    .value
                    .trim();


            const city =
                document
                    .getElementById("city")
                    .value
                    .trim();


            const state =
                document
                    .getElementById("state")
                    .value;


            const postcode =
                document
                    .getElementById("postcode")
                    .value
                    .trim();


            const phone =
                document
                    .getElementById("phone")
                    .value
                    .trim();


            const notes =
                document
                    .getElementById("orderNotes")
                    .value
                    .trim();


            const paymentAgree =
                document
                    .getElementById("paymentAgree")
                    .checked;


            /* =========================================
               VALIDATION
            ========================================== */

            if (
                email === "" ||
                firstName === "" ||
                lastName === "" ||
                address === "" ||
                city === "" ||
                postcode === "" ||
                phone === ""
            ) {

                alert(
                    "Please fill all required billing details."
                );

                return;

            }


            /* =========================================
               PAYMENT CHECK
            ========================================== */

            if (!paymentAgree) {

                alert(
                    "Please confirm the payment information."
                );

                return;

            }


            /* =========================================
               ORDER TOTAL
            ========================================== */

            const orderTotal =
                calculateFinalTotal();


            /* =========================================
               ORDER DATA
            ========================================== */

            const orderData = {

                orderId:
                    "JS" +
                    Date.now(),


                customer: {

                    email:
                        email,

                    firstName:
                        firstName,

                    lastName:
                        lastName,

                    country:
                        country,

                    address:
                        address,

                    apartment:
                        apartment,

                    city:
                        city,

                    state:
                        state,

                    postcode:
                        postcode,

                    phone:
                        phone,

                    notes:
                        notes

                },


                /* =====================================
                   IMPORTANT
                   Same products from Shop
                ====================================== */

                products:
                    checkoutCart.map(
                        function (product) {

                            return {

                                id:
                                    product.id,

                                name:
                                    product.name,

                                price:
                                    getProductPrice(
                                        product.price
                                    ),

                                category:
                                    product.category || "",

                                image:
                                    product.image || "",

                                quantity:
                                    Number(
                                        product.quantity
                                    ) || 1

                            };

                        }
                    ),


                subtotal:
                    calculateSubtotal(),


                discount:
                    discount,


                total:
                    orderTotal,


                date:
                    new Date()
                        .toLocaleString()

            };


            /* =========================================
               SAVE LAST ORDER
            ========================================== */

            localStorage.setItem(

                "lastOrder",

                JSON.stringify(
                    orderData
                )

            );


            /* =========================================
               SUCCESS MESSAGE
            ========================================== */

            alert(

                "Order placed successfully!\n\n" +

                "Order ID: " +

                orderData.orderId

            );


            /* =========================================
               CLEAR ACTUAL GLOBAL CART
               
               IMPORTANT:
               jewelleryCart use ho raha hai,
               "cart" nahi.
            ========================================== */

            localStorage.removeItem(
                "jewelleryCart"
            );


            /* =========================================
               OPTIONAL OLD CART DATA CLEANUP
            ========================================== */

            localStorage.removeItem(
                "cart"
            );


            localStorage.removeItem(
                "cartCount"
            );


            /* =========================================
               REDIRECT
            ========================================== */

            window.location.href =
                "home.html";

        }
    );

}


/* =====================================================
   STORAGE CHANGE
   Agar cart kisi doosre tab mein change ho
===================================================== */

window.addEventListener(
    "storage",
    function (event) {


        if (
            event.key ===
            "jewelleryCart"
        ) {


            loadCheckoutCart();


            displayCheckoutProducts();


            updateCheckoutTotals();


        }

    }
);