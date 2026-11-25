// =========================================================
// JEWELLERY STORE - ABOUT PAGE JAVASCRIPT
// =========================================================


// =========================================================
// 1. NAVBAR
//    Top par transparent
//    Scroll karne par white
// =========================================================

const navbar = document.querySelector(".jewellery-navbar");

if (navbar) {

    function updateNavbar() {

        if (window.scrollY > 50) {

            navbar.classList.add("scrolled");

        } else {

            navbar.classList.remove("scrolled");

        }

    }

    // Page load hote hi navbar ki correct state
    updateNavbar();

    // Scroll par navbar update
    window.addEventListener(
        "scroll",
        updateNavbar
    );

}


// =========================================================
// 2. MOBILE NAVBAR
//    ☰ button Bootstrap collapse ke saath work karega
// =========================================================

const navbarToggler =
    document.querySelector(".navbar-toggler");

const mainNavbar =
    document.getElementById("mainNavbar");

if (navbarToggler && mainNavbar) {

    // Menu open/close hone par aria-expanded
    // Bootstrap automatically update karta hai.
    // Yahan sirf safety ke liye click listener hai.

    navbarToggler.addEventListener(
        "click",
        function () {

            const isOpen =
                navbarToggler.getAttribute(
                    "aria-expanded"
                ) === "true";

            navbarToggler.setAttribute(
                "aria-expanded",
                String(!isOpen)
            );

        }
    );

}


// =========================================================
// 3. BACK TO TOP BUTTON
// =========================================================

const backToTop =
    document.getElementById("backToTop");


if (backToTop) {

    function updateBackToTop() {

        if (window.scrollY > 400) {

            backToTop.classList.add(
                "show"
            );

        } else {

            backToTop.classList.remove(
                "show"
            );

        }

    }


    // Page load par check
    updateBackToTop();


    // Scroll par button show/hide
    window.addEventListener(
        "scroll",
        updateBackToTop
    );


    // Button click
    backToTop.addEventListener(
        "click",
        function () {

            window.scrollTo({

                top: 0,

                behavior: "smooth"

            });

        }
    );

}


// =========================================================
// 4. VISIT OUR STORES BUTTON
// =========================================================

const visitStoreBtn =
    document.getElementById(
        "visitStoreBtn"
    );


if (visitStoreBtn) {

    visitStoreBtn.addEventListener(
        "click",
        function () {

            window.scrollTo({

                top: 0,

                behavior: "smooth"

            });

        }
    );

}


// =========================================================
// 5. METAL CARDS
// =========================================================

const metalCards =
    document.querySelectorAll(
        ".metal-card"
    );


metalCards.forEach(
    function (card) {

        card.style.cursor =
            "pointer";

    }
);


// =========================================================
// 6. COPYRIGHT YEAR
// =========================================================

const currentYear =
    new Date().getFullYear();


const copyright =
    document.querySelector(
        ".copyright"
    );


if (copyright) {

    copyright.textContent =
        "Copyright © " +
        currentYear +
        " Jewellery Store";

}


// =========================================================
// 7. CLOSE MOBILE MENU AFTER CLICKING A LINK
// =========================================================

const mobileNavLinks =
    document.querySelectorAll(
        "#mainNavbar .nav-link"
    );


mobileNavLinks.forEach(
    function (link) {

        link.addEventListener(
            "click",
            function () {

                // Sirf mobile/tablet par menu close karo
                if (window.innerWidth <= 991) {

                    const navbarCollapse =
                        document.getElementById(
                            "mainNavbar"
                        );

                    if (navbarCollapse) {

                        const bsCollapse =
                            bootstrap.Collapse.getInstance(
                                navbarCollapse
                            );

                        if (bsCollapse) {

                            bsCollapse.hide();

                        }

                    }

                }

            }
        );

    }
);


// =========================================================
// 8. ABOUT PAGE LOADED
// =========================================================

console.log(
    "Jewellery Store About Page Loaded Successfully!"
);