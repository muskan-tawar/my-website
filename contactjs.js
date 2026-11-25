// =========================================================
// JEWELLERY STORE - CONTACT PAGE JAVASCRIPT
// =========================================================


// =========================================================
// 1. CONTACT FORM ELEMENTS
// =========================================================

const contactForm =
    document.getElementById("contactForm");


const nameInput =
    document.getElementById("name");


const emailInput =
    document.getElementById("email");


const nameError =
    document.getElementById("nameError");


const emailError =
    document.getElementById("emailError");


const successMessage =
    document.getElementById("successMessage");


// =========================================================
// 2. CONTACT FORM VALIDATION
// =========================================================

if (contactForm) {

    contactForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            let isValid = true;


            // Clear previous errors

            if (nameError) {
                nameError.textContent = "";
            }


            if (emailError) {
                emailError.textContent = "";
            }


            if (successMessage) {
                successMessage.classList.add("d-none");
            }


            // =================================================
            // NAME VALIDATION
            // =================================================

            const nameValue =
                nameInput
                    ? nameInput.value.trim()
                    : "";


            if (nameValue === "") {

                if (nameError) {

                    nameError.textContent =
                        "Please enter your name.";

                }

                isValid = false;

            }

            else if (nameValue.length < 3) {

                if (nameError) {

                    nameError.textContent =
                        "Name must contain at least 3 characters.";

                }

                isValid = false;

            }


            // =================================================
            // EMAIL VALIDATION
            // =================================================

            const emailValue =
                emailInput
                    ? emailInput.value.trim()
                    : "";


            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


            if (emailValue === "") {

                if (emailError) {

                    emailError.textContent =
                        "Please enter your email.";

                }

                isValid = false;

            }

            else if (!emailPattern.test(emailValue)) {

                if (emailError) {

                    emailError.textContent =
                        "Please enter a valid email address.";

                }

                isValid = false;

            }


            // =================================================
            // FORM SUCCESS
            // =================================================

            if (isValid) {

                if (successMessage) {

                    successMessage.classList.remove(
                        "d-none"
                    );

                }


                contactForm.reset();


                setTimeout(
                    function () {

                        if (successMessage) {

                            successMessage.classList.add(
                                "d-none"
                            );

                        }

                    },
                    5000
                );

            }

        }
    );

}


// =========================================================
// 3. BACK TO TOP
// =========================================================

const backToTop =
    document.getElementById("backToTop");


if (backToTop) {

    window.addEventListener(
        "scroll",
        function () {

            if (window.scrollY > 400) {

                backToTop.classList.add("show");

            }

            else {

                backToTop.classList.remove("show");

            }

        }
    );


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
// 4. CONTACT PAGE LOADED
// =========================================================

console.log(
    "Jewellery Store Contact Page Loaded Successfully!"
);


// =========================================================
// 5. MAIN ADD TO CART + VIEW CART
// =========================================================

const detailAddToCart =
    document.getElementById("detailAddToCart");


const viewCartButton =
    document.getElementById("viewCartButton");


if (detailAddToCart) {

    detailAddToCart.addEventListener(
        "click",
        function () {

            addCurrentProductToCart();


            if (viewCartButton) {

                viewCartButton.classList.add("show");

            }

        }
    );

}


// =========================================================
// 6. NAVBAR SCROLL BACKGROUND
// =========================================================

const navbar =
    document.querySelector(".jewellery-navbar");


if (navbar) {

    function updateNavbar() {

        if (window.scrollY > 50) {

            navbar.classList.add("scrolled");

        }

        else {

            navbar.classList.remove("scrolled");

        }

    }


    // Page load par check

    updateNavbar();


    // Scroll par check

    window.addEventListener(
        "scroll",
        updateNavbar
    );

}