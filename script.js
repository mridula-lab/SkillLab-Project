/* =========================================================
   LOGIN
========================================================= */

function loginUser() {

    const username =
        document.getElementById("username").value;

    const password =
        document.getElementById("password").value;


    if (username.trim() === "" || password.trim() === "") {

        alert("Please enter your username and password.");

        return;
    }


    document
        .getElementById("loginPage")
        .classList.add("hidden");


    document
        .getElementById("app")
        .classList.remove("hidden");


    showPage("dashboard");
}



/* =========================================================
   LOGOUT
========================================================= */

function logoutUser() {

    document
        .getElementById("app")
        .classList.add("hidden");


    document
        .getElementById("loginPage")
        .classList.remove("hidden");
}



/* =========================================================
   PASSWORD VISIBILITY
========================================================= */

function togglePassword() {

    const password =
        document.getElementById("password");

    if (password.type === "password") {

        password.type = "text";

    } else {

        password.type = "password";
    }
}



/* =========================================================
   PAGE NAVIGATION
========================================================= */

function showPage(pageId) {

    const pages =
        document.querySelectorAll(".page");


    pages.forEach(page => {

        page.classList.remove("active-page");

    });


    const selectedPage =
        document.getElementById(pageId);


    if (selectedPage) {

        selectedPage.classList.add("active-page");
    }


    /* Update top title */

    const titles = {

        dashboard: "Dashboard",

        analysis: "Email Analysis",

        threatResult: "Threat Result",

        inbox: "Inbox",

        spam: "Spam",

        threats: "Threats",

        important: "Important Emails"
    };


    document.getElementById("pageTitle").textContent =
        titles[pageId] || "Dashboard";


    /* Sidebar active state */

    document
        .querySelectorAll(".navigation a")
        .forEach(link => {

            link.classList.remove("active");

        });


    /* Find matching navigation item */

    document
        .querySelectorAll(".navigation a")
        .forEach(link => {

            const onclickValue =
                link.getAttribute("onclick");

            if (
                onclickValue &&
                onclickValue.includes(`'${pageId}'`)
            ) {

                link.classList.add("active");
            }

        });


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}



/* =========================================================
   EMAIL ANALYSIS
========================================================= */

function analyseEmail() {

    const content =
        document.getElementById("emailContent").value;


    const file =
        document.getElementById("emailFile").files[0];


    if (content.trim() === "" && !file) {

        alert(
            "Please upload an email or paste email content first."
        );

        return;
    }


    /*
       Demo analysis.

       Later this can be connected to
       your actual AI/ML backend.
    */

    showPage("threatResult");
}



/* =========================================================
   FILE UPLOAD
========================================================= */

function fileUploaded() {

    const file =
        document.getElementById("emailFile").files[0];


    if (file) {

        alert(
            "Email file selected: " + file.name
        );
    }
}



/* =========================================================
   REPORT SPAM
========================================================= */

function markSpam() {

    alert(
        "Email reported as spam successfully."
    );
}



/* =========================================================
   DELETE EMAIL
========================================================= */

function deleteEmail() {

    const confirmation =
        confirm(
            "Are you sure you want to delete this email?"
        );


    if (confirmation) {

        alert(
            "Email deleted successfully."
        );
    }
}



/* =========================================================
   SEARCH EMAILS
========================================================= */

function searchEmails(searchText) {

    const emails =
        document.querySelectorAll(".email-item");


    const search =
        searchText.toLowerCase();


    emails.forEach(email => {

        const text =
            email.textContent.toLowerCase();


        if (text.includes(search)) {

            email.style.display = "block";

        } else {

            email.style.display = "none";
        }

    });
}



/* =========================================================
   MOBILE SIDEBAR
========================================================= */

const mobileMenu =
    document.querySelector(".mobile-menu");


if (mobileMenu) {

    mobileMenu.addEventListener(
        "click",
        function () {

            document
                .querySelector(".sidebar")
                .classList.toggle("open");

        }
    );
}