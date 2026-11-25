document.addEventListener("DOMContentLoaded", function () {
    // LOGIN MODAL HTML
    const loginModalHTML = ` <div class="modal fade" id="loginModal" tabindex="-1" aria-hidden="true">
                                <div class="modal-dialog modal-dialog-centered">
                                    <div class="modal-content login-modal-content">
                                        <!-- CLOSE BUTTON -->
                                        <div class="modal-header border-0">
                                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <!-- LOGIN FORM -->
                                        <div class="modal-body px-4 px-md-5 pb-5 pt-0">
                                            <!-- USERNAME -->
                                            <div class="mb-4">
                                                <label for="loginUsername"  class="form-label login-label"> Username or Email Address </label>
                                                <input type="text" class="form-control login-input" id="loginUsername" autocomplete="username">
                                                <div class="invalid-feedback"> Please enter your username or email. </div>
                                            </div>
                                            <!-- PASSWORD -->
                                            <div class="mb-4">
                                                <label for="loginPassword" class="form-label login-label"> Password </label>
                                                <input type="password" class="form-control login-input" id="loginPassword" autocomplete="current-password">
                                                <div class="invalid-feedback"> Please enter your password.</div>
                                            </div>
                                            <!-- REMEMBER ME -->
                                            <div class="form-check mb-4">
                                                <input class="form-check-input" type="checkbox" id="rememberMe">
                                                <label  class="form-check-label remember-label"   for="rememberMe">  Remember Me </label>
                                            </div>
                                            <!-- LOGIN BUTTON -->
                                            <button  type="button"class="btn login-button" id="loginButton">LOG IN</button>
                                            <!-- FORGOT PASSWORD -->
                                            <div class="mt-4">
                                                <a    href="#" class="lost-password" id="forgotPassword">   Lost your password?</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>`;
// ADD MODAL TO BODY
    document.body.insertAdjacentHTML( "beforeend", loginModalHTML);
// PERSON ICON CLICK
    const loginIcons = document.querySelectorAll(".login-icon");
    loginIcons.forEach(function (icon) {
        icon.addEventListener("click", function () {
            const loginModalElement = document.getElementById("loginModal");
            if (!loginModalElement) {
                console.error( "Login modal not found!");
                return;
            }
            if (typeof bootstrap === "undefined") {
                console.error( "Bootstrap JS is not loaded!");
                return;
            }
            const loginModal =bootstrap.Modal.getOrCreateInstance(loginModalElement);
            loginModal.show();
        });
    });
    // LOGIN BUTTON
    const loginButton =   document.getElementById("loginButton");
    const username = document.getElementById("loginUsername");
    const password = document.getElementById("loginPassword");
    loginButton.addEventListener("click",
        function () {
            let isValid = true;
            // USERNAME CHECK
            if (username.value.trim() === "") {
                username.classList.add("is-invalid");
                isValid = false;
            } else 
            { username.classList.remove("is-invalid");
            }
            // PASSWORD CHECK
            if (password.value.trim() === "") {
                password.classList.add("is-invalid");
                isValid = false;
            } else {
                password.classList.remove( "is-invalid");
            }
            if (!isValid) {return; }
            alert("Login Successful!");
            username.value = "";
            password.value = "";
            const loginModalElement = document.getElementById("loginModal");
            const loginModal =bootstrap.Modal.getInstance( loginModalElement );
            if (loginModal) {
             loginModal.hide();
            }
        }
    );
    // USERNAME ERROR REMOVE
    username.addEventListener( "input",
        function () {
            if (username.value.trim() !== "") {
                username.classList.remove( "is-invalid" );
            }
        }
    );
        // PASSWORD ERROR REMOVE
   password.addEventListener( "input",
        function () {
            if (password.value.trim() !== "") {
                password.classList.remove(    "is-invalid");
            }
        }
    );
    // FORGOT PASSWORD
    const forgotPassword = document.getElementById("forgotPassword");
    forgotPassword.addEventListener("click",
        function (event) {
            event.preventDefault();
            alert( "Password recovery page will be added here.");
        }
    );
     // SUCCESS MESSAGE
      console.log("Login system loaded successfully!");
});