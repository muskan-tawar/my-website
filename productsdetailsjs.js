document.addEventListener("DOMContentLoaded", function () {

    "use strict";


    /* =====================================================
       URL PRODUCT DATA
    ====================================================== */

    const urlParams =
        new URLSearchParams(window.location.search);


    const productName =
        urlParams.get("name");


    const productCategory =
        urlParams.get("category");


    const productPrice =
        urlParams.get("price");


    const productImage =
        urlParams.get("image");


    /* =====================================================
       DEFAULT DATA
    ====================================================== */

    const finalCategory =
        productCategory || "Jewellery";


    const finalPrice =
        Number(productPrice || 0);


    const finalImage =
        productImage ||
        "imgs/product-010-300x300.jpg";


    const finalName =
        productName ||
        "Minola Golden Earrings";


    /* =====================================================
       MAIN PRODUCT ELEMENTS
    ====================================================== */

    const detailImage =
        document.getElementById(
            "productDetailImage"
        );


    const detailName =
        document.getElementById(
            "productDetailName"
        );


    const detailCategory =
        document.getElementById(
            "productDetailCategory"
        );


    const detailPrice =
        document.getElementById(
            "productDetailPrice"
        );


    const detailCategoryBottom =
        document.getElementById(
            "detailCategory"
        );


    const breadcrumbCategory =
        document.getElementById(
            "breadcrumbCategory"
        );


    const breadcrumbName =
        document.getElementById(
            "breadcrumbName"
        );


    /* =====================================================
       LOAD PRODUCT DETAILS
    ====================================================== */

    if (detailImage) {

        detailImage.src =
            finalImage;

        detailImage.alt =
            finalName;

    }


    if (detailName) {

        detailName.textContent =
            finalName;

    }


    if (detailCategory) {

        detailCategory.textContent =
            finalCategory;

    }


    if (detailCategoryBottom) {

        detailCategoryBottom.textContent =
            finalCategory;

    }


    if (detailPrice) {

        detailPrice.textContent =
            "$" + finalPrice.toFixed(2);

    }


    if (breadcrumbCategory) {

        breadcrumbCategory.textContent =
            finalCategory;

    }


    if (breadcrumbName) {

        breadcrumbName.textContent =
            finalName;

    }


    /* =====================================================
       STICKY PRODUCT ELEMENTS
    ====================================================== */

    const stickyProductBar =
        document.getElementById(
            "stickyProductBar"
        );


    const stickyProductImage =
        document.getElementById(
            "stickyProductImage"
        );


    const stickyProductName =
        document.getElementById(
            "stickyProductName"
        );


    const stickyProductPrice =
        document.getElementById(
            "stickyProductPrice"
        );


    const stickyQuantity =
        document.getElementById(
            "stickyProductQuantity"
        );


    const stickyMinus =
        document.getElementById(
            "stickyQuantityMinus"
        );


    const stickyPlus =
        document.getElementById(
            "stickyQuantityPlus"
        );


    const stickyAddToCart =
        document.getElementById(
            "stickyAddToCart"
        );


    const stickyScrollTop =
        document.getElementById(
            "stickyScrollTop"
        );


    /* =====================================================
       SET STICKY PRODUCT DATA
    ====================================================== */

    if (stickyProductImage) {

        stickyProductImage.src =
            finalImage;

        stickyProductImage.alt =
            finalName;

    }


    if (stickyProductName) {

        stickyProductName.textContent =
            finalName;

    }


    if (stickyProductPrice) {

        stickyProductPrice.textContent =
            "$" + finalPrice.toFixed(2);

    }


    /* =====================================================
       MAIN QUANTITY
    ====================================================== */

    const quantityInput =
        document.getElementById(
            "productQuantity"
        );


    const quantityMinus =
        document.getElementById(
            "quantityMinus"
        );


    const quantityPlus =
        document.getElementById(
            "quantityPlus"
        );


    let quantity = 1;


    function updateQuantity() {

        if (quantity < 1) {

            quantity = 1;

        }


        if (quantityInput) {

            quantityInput.value =
                quantity;

        }


        if (stickyQuantity) {

            stickyQuantity.value =
                quantity;

        }

    }


    /* =====================================================
       MAIN MINUS
    ====================================================== */

    if (quantityMinus) {

        quantityMinus.addEventListener(
            "click",
            function () {

                if (quantity > 1) {

                    quantity--;

                    updateQuantity();

                }

            }
        );

    }


    /* =====================================================
       MAIN PLUS
    ====================================================== */

    if (quantityPlus) {

        quantityPlus.addEventListener(
            "click",
            function () {

                quantity++;

                updateQuantity();

            }
        );

    }


    /* =====================================================
       STICKY MINUS
    ====================================================== */

    if (stickyMinus) {

        stickyMinus.addEventListener(
            "click",
            function () {

                if (quantity > 1) {

                    quantity--;

                    updateQuantity();

                }

            }
        );

    }


    /* =====================================================
       STICKY PLUS
    ====================================================== */

    if (stickyPlus) {

        stickyPlus.addEventListener(
            "click",
            function () {

                quantity++;

                updateQuantity();

            }
        );

    }


    /* =====================================================
       MAIN ADD TO CART + VIEW CART ELEMENTS
    ====================================================== */

    const detailAddToCart =
        document.getElementById(
            "detailAddToCart"
        );


    const viewCartButton =
        document.getElementById(
            "viewCartButton"
        );


    /* =====================================================
       VIEW CART INITIAL STATE
    ====================================================== */

    /*
       Page open hote hi VIEW CART hidden rahega.
    */

    if (viewCartButton) {

        viewCartButton.classList.remove(
            "show"
        );

    }


    /* =====================================================
       ADD CURRENT PRODUCT TO CART
    ====================================================== */

    function addCurrentProductToCart() {

        /*
           Check whether cartjs.js has
           addProductToCart() function.
        */

        if (
            typeof window.addProductToCart !==
            "function"
        ) {

            console.error(
                "addProductToCart function not found."
            );

            return false;

        }


        /* =================================================
           CREATE PRODUCT OBJECT
        ================================================== */

        const product = {

            id:
                finalName
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-"),

            name:
                finalName,

            price:
                finalPrice,

            image:
                finalImage,

            category:
                finalCategory,

            quantity:
                quantity

        };


        /* =================================================
           ADD PRODUCT TO CART
        ================================================== */

        window.addProductToCart(product);


        /* =================================================
           RESET QUANTITY AFTER ADDING
        ================================================== */

        quantity = 1;

        updateQuantity();


        /*
           IMPORTANT:
           Yahan window.openCart() intentionally nahi hai.

           Isliye ADD TO CART click karne par
           cart popup OPEN NAHI HOGA.
        */


        return true;

    }


    /* =====================================================
       MAIN ADD TO CART BUTTON
    ====================================================== */

    if (detailAddToCart) {

        detailAddToCart.addEventListener(
            "click",
            function () {

                /*
                   Product ko cart me add karo.
                */

                const added =
                    addCurrentProductToCart();


                /*
                   Successfully add hone ke baad
                   VIEW CART button show karo.
                */

                if (
                    added &&
                    viewCartButton
                ) {

                    viewCartButton.classList.add(
                        "show"
                    );

                }

            }
        );

    }


    /* =====================================================
       VIEW CART BUTTON
    ====================================================== */

    /*
       HTML me VIEW CART:

       <a href="cartview.html"
          id="viewCartButton"
          class="view-cart-btn">

          VIEW CART

       </a>

       Isliye browser naturally
       cartview.html open karega.

       Yahan JavaScript navigation ki
       zarurat nahi hai.
    */

    if (viewCartButton) {

        viewCartButton.addEventListener(
            "click",
            function () {

                window.location.href =
                    "cartview.html";

            }
        );

    }


    /* =====================================================
       STICKY ADD TO CART
    ====================================================== */

    if (stickyAddToCart) {

        stickyAddToCart.addEventListener(
            "click",
            function () {

                addCurrentProductToCart();

            }
        );

    }


    /* =====================================================
       STICKY BAR SHOW / HIDE
    ====================================================== */

    const productTopSection =
        document.querySelector(
            ".product-top-section"
        );


    function checkStickyBar() {

        if (!stickyProductBar) {

            return;

        }


        if (!productTopSection) {

            return;

        }


        const rect =
            productTopSection.getBoundingClientRect();


        if (rect.bottom <= 0) {

            stickyProductBar.classList.add(
                "show"
            );

        } else {

            stickyProductBar.classList.remove(
                "show"
            );

        }

    }


    window.addEventListener(
        "scroll",
        checkStickyBar,
        {
            passive: true
        }
    );


    window.addEventListener(
        "resize",
        checkStickyBar
    );


    checkStickyBar();


    /* =====================================================
       STICKY SCROLL TOP
    ====================================================== */

    if (stickyScrollTop) {

        stickyScrollTop.addEventListener(
            "click",
            function () {

                window.scrollTo({

                    top: 0,

                    behavior: "smooth"

                });

            }
        );

    }


    /* =====================================================
       PRODUCT TABS
    ====================================================== */

    const productTabs =
        document.querySelectorAll(
            ".product-tab"
        );


    const tabContents =
        document.querySelectorAll(
            ".product-tab-content"
        );


    productTabs.forEach(
        function (tab) {

            tab.addEventListener(
                "click",
                function () {

                    const target =
                        tab.getAttribute(
                            "data-tab"
                        );


                    productTabs.forEach(
                        function (item) {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    tabContents.forEach(
                        function (content) {

                            content.classList.remove(
                                "active"
                            );

                        }
                    );


                    tab.classList.add(
                        "active"
                    );


                    const targetContent =
                        document.getElementById(
                            target
                        );


                    if (targetContent) {

                        targetContent.classList.add(
                            "active"
                        );

                    }

                }
            );

        }
    );


    /* =====================================================
       RELATED PRODUCTS
    ====================================================== */

    const relatedProducts =
        document.querySelectorAll(
            ".related-product"
        );


    relatedProducts.forEach(
        function (product) {

            product.addEventListener(
                "click",
                function () {

                    const name =
                        product.dataset.name ||
                        "";


                    const category =
                        product.dataset.category ||
                        "Jewellery";


                    const price =
                        product.dataset.price ||
                        "0";


                    const image =
                        product.dataset.image ||
                        "";


                    const url =
                        "productsdetails.html?" +

                        "name=" +
                        encodeURIComponent(name) +

                        "&category=" +
                        encodeURIComponent(category) +

                        "&price=" +
                        encodeURIComponent(price) +

                        "&image=" +
                        encodeURIComponent(image);


                    window.location.href =
                        url;

                }
            );

        }
    );


    /* =====================================================
       PRODUCT IMAGE ZOOM ELEMENTS
    ====================================================== */

    const productZoomButton =
        document.getElementById(
            "productZoomButton"
        );


    const productZoomModal =
        document.getElementById(
            "productImageZoomModal"
        );


    const productZoomView =
        document.getElementById(
            "productZoomView"
        );


    const productZoomImage =
        document.getElementById(
            "productZoomImage"
        );


    const productZoomClose =
        document.getElementById(
            "productZoomClose"
        );


    /* =====================================================
       ZOOM VARIABLES
    ====================================================== */

    const ZOOM_LEVEL = 2.5;


    let zoomIsOpen = false;


    /* =====================================================
       GET ACTUAL CONTAINED IMAGE SIZE
    ====================================================== */

    function getContainedImageRect() {

        if (
            !productZoomView ||
            !productZoomImage
        ) {

            return null;

        }


        const viewWidth =
            productZoomView.clientWidth;


        const viewHeight =
            productZoomView.clientHeight;


        const naturalWidth =
            productZoomImage.naturalWidth;


        const naturalHeight =
            productZoomImage.naturalHeight;


        if (
            !naturalWidth ||
            !naturalHeight ||
            !viewWidth ||
            !viewHeight
        ) {

            return null;

        }


        const scale =
            Math.min(
                viewWidth / naturalWidth,
                viewHeight / naturalHeight
            );


        const width =
            naturalWidth * scale;


        const height =
            naturalHeight * scale;


        const left =
            (viewWidth - width) / 2;


        const top =
            (viewHeight - height) / 2;


        return {

            viewWidth:
                viewWidth,

            viewHeight:
                viewHeight,

            width:
                width,

            height:
                height,

            left:
                left,

            top:
                top

        };

    }


    /* =====================================================
       RESET ZOOM IMAGE
    ====================================================== */

    function resetZoomImage() {

        if (
            !productZoomImage
        ) {

            return;

        }


        const imageRect =
            getContainedImageRect();


        if (!imageRect) {

            return;

        }


        productZoomImage.style.objectFit =
            "fill";


        productZoomImage.style.width =
            imageRect.width + "px";


        productZoomImage.style.height =
            imageRect.height + "px";


        productZoomImage.style.left =
            imageRect.left + "px";


        productZoomImage.style.top =
            imageRect.top + "px";


        productZoomImage.style.transform =
            "none";


        productZoomImage.style.transformOrigin =
            "initial";

    }


    /* =====================================================
       OPEN ZOOM
    ====================================================== */

    function openProductImageZoom() {

        if (
            !productZoomModal ||
            !productZoomView ||
            !productZoomImage ||
            !detailImage
        ) {

            return;

        }


        productZoomImage.src =
            detailImage.currentSrc ||
            detailImage.src;


        productZoomImage.alt =
            detailImage.alt ||
            finalName;


        zoomIsOpen = true;


        productZoomModal.classList.add(
            "show"
        );


        productZoomModal.setAttribute(
            "aria-hidden",
            "false"
        );


        document.body.style.overflow =
            "hidden";


        if (
            productZoomImage.complete
        ) {

            resetZoomImage();

        } else {

            productZoomImage.onload =
                function () {

                    if (zoomIsOpen) {

                        resetZoomImage();

                    }

                };

        }

    }


    /* =====================================================
       ZOOM BUTTON
    ====================================================== */

    if (productZoomButton) {

        productZoomButton.addEventListener(
            "click",
            openProductImageZoom
        );

    }


    /* =====================================================
       CURSOR BASED ZOOM
    ====================================================== */

    if (
        productZoomView &&
        productZoomImage
    ) {

        productZoomView.addEventListener(
            "mousemove",
            function (event) {

                if (!zoomIsOpen) {

                    return;

                }


                const base =
                    getContainedImageRect();


                if (!base) {

                    return;

                }


                const viewRect =
                    productZoomView.getBoundingClientRect();


                const mouseX =
                    event.clientX -
                    viewRect.left;


                const mouseY =
                    event.clientY -
                    viewRect.top;


                const imageX =
                    Math.max(
                        0,
                        Math.min(
                            base.width,
                            mouseX - base.left
                        )
                    );


                const imageY =
                    Math.max(
                        0,
                        Math.min(
                            base.height,
                            mouseY - base.top
                        )
                    );


                const zoomedWidth =
                    base.width *
                    ZOOM_LEVEL;


                const zoomedHeight =
                    base.height *
                    ZOOM_LEVEL;


                let newLeft =
                    mouseX -
                    imageX * ZOOM_LEVEL;


                let newTop =
                    mouseY -
                    imageY * ZOOM_LEVEL;


                const minLeft =
                    base.viewWidth -
                    zoomedWidth;


                const minTop =
                    base.viewHeight -
                    zoomedHeight;


                newLeft =
                    Math.max(
                        minLeft,
                        Math.min(
                            0,
                            newLeft
                        )
                    );


                newTop =
                    Math.max(
                        minTop,
                        Math.min(
                            0,
                            newTop
                        )
                    );


                productZoomImage.style.objectFit =
                    "fill";


                productZoomImage.style.width =
                    zoomedWidth + "px";


                productZoomImage.style.height =
                    zoomedHeight + "px";


                productZoomImage.style.left =
                    newLeft + "px";


                productZoomImage.style.top =
                    newTop + "px";


                productZoomImage.style.transform =
                    "none";

            }
        );


        /* =================================================
           MOUSE LEAVE = NORMAL IMAGE
        ================================================= */

        productZoomView.addEventListener(
            "mouseleave",
            function () {

                if (!zoomIsOpen) {

                    return;

                }


                resetZoomImage();

            }
        );

    }


    /* =====================================================
       RESIZE WHILE ZOOM IS OPEN
    ====================================================== */

    window.addEventListener(
        "resize",
        function () {

            if (
                zoomIsOpen &&
                productZoomModal &&
                productZoomModal.classList.contains(
                    "show"
                )
            ) {

                resetZoomImage();

            }

        }
    );


    /* =====================================================
       CLOSE ZOOM
    ====================================================== */

    function closeProductImageZoom() {

        if (!productZoomModal) {

            return;

        }


        zoomIsOpen = false;


        productZoomModal.classList.remove(
            "show"
        );


        productZoomModal.setAttribute(
            "aria-hidden",
            "true"
        );


        if (productZoomImage) {

            productZoomImage.style.objectFit =
                "contain";


            productZoomImage.style.width =
                "100%";


            productZoomImage.style.height =
                "100%";


            productZoomImage.style.left =
                "0";


            productZoomImage.style.top =
                "0";


            productZoomImage.style.transform =
                "none";

        }


        document.body.style.overflow =
            "";

    }


    /* =====================================================
       CLOSE BUTTON
    ====================================================== */

    if (productZoomClose) {

        productZoomClose.addEventListener(
            "click",
            closeProductImageZoom
        );

    }


    /* =====================================================
       CLICK OUTSIDE = CLOSE
    ====================================================== */

    if (productZoomModal) {

        productZoomModal.addEventListener(
            "click",
            function (event) {

                if (
                    event.target ===
                    productZoomModal
                ) {

                    closeProductImageZoom();

                }

            }
        );

    }


    /* =====================================================
       ESC = CLOSE
    ====================================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape" &&
                productZoomModal &&
                productZoomModal.classList.contains(
                    "show"
                )
            ) {

                closeProductImageZoom();

            }

        }
    );


    /* =====================================================
       INITIAL QUANTITY
    ====================================================== */

    updateQuantity();

});