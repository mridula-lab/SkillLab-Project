/* =========================================================
   THADAM LABS
   EMAIL SECURITY APPLICATION
   FUNCTIONAL JAVASCRIPT
========================================================= */

"use strict";


/* =========================================================
   APPLICATION STATE
========================================================= */

const appState = {

    currentPage: "dashboard",

    stats: {

        analysed: 128,

        threats: 12,

        spam: 46,

        important: 18

    },

    blockedSenders: [],

    deletedEmails: [],

    analysis: {

        classification: "Suspicious",

        score: 78,

        sender: "unknown.sender@gmail.com",

        subject: "Your account requires verification",

        reasons: [

            "One suspicious link detected",

            "Unknown sender",

            "Phishing-like content"

        ]

    }

};


/* =========================================================
   HELPER FUNCTIONS
========================================================= */

function $(selector) {

    return document.querySelector(selector);

}


function $all(selector) {

    return document.querySelectorAll(selector);

}


function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================================
   LOGIN
========================================================= */

function loginUser() {

    const username =
        $("#username")?.value.trim();

    const password =
        $("#password")?.value.trim();


    if (!username || !password) {

        showToast(
            "Please enter your username and password.",
            true
        );

        return;

    }


    if (!username.includes("@")) {

        showToast(
            "Please enter a valid email address.",
            true
        );

        return;

    }


    $("#loginPage").classList.add("hidden");

    $("#app").classList.remove("hidden");


    showPage("dashboard");


    showToast(
        "Login successful."
    );

}


/* =========================================================
   LOGOUT
========================================================= */

function logoutUser() {

    $("#app").classList.add("hidden");

    $("#loginPage").classList.remove("hidden");


    if ($("#password")) {

        $("#password").value = "";

    }


    showToast(
        "You have been logged out."
    );

}


/* =========================================================
   PASSWORD VISIBILITY
========================================================= */

function togglePassword() {

    const password =
        $("#password");

    const eye =
        $(".eye");


    if (!password) return;


    if (password.type === "password") {

        password.type = "text";

        if (eye) {

            eye.textContent = "◉";

        }

    }

    else {

        password.type = "password";

        if (eye) {

            eye.textContent = "◌";

        }

    }

}


/* =========================================================
   FORGOT PASSWORD
========================================================= */

function forgotPassword(event) {

    if (event) {

        event.preventDefault();

    }


    showToast(
        "Password reset functionality can be connected later."
    );

}


/* =========================================================
   CREATE ACCOUNT
========================================================= */

function createAccount(event) {

    if (event) {

        event.preventDefault();

    }


    showToast(
        "Account registration can be added later."
    );

}


/* =========================================================
   PAGE NAVIGATION
========================================================= */

function showPage(pageId) {

    const page =
        document.getElementById(pageId);


    if (!page) {

        showToast(
            "This page is not available yet.",
            true
        );

        return;

    }


    $all(".page").forEach(p => {

        p.classList.remove(
            "active-page"
        );

    });


    page.classList.add(
        "active-page"
    );


    appState.currentPage =
        pageId;


    const titles = {

        dashboard:
            "Dashboard",

        analysis:
            "Email Analysis",

        threatResult:
            "Threat Result",

        inbox:
            "Inbox",

        spam:
            "Spam",

        threats:
            "Threats",

        important:
            "Important Emails",

        reports:
            "Reports"

    };


    const pageTitle =
        $("#pageTitle");


    if (pageTitle) {

        pageTitle.textContent =
            titles[pageId] || "Dashboard";

    }


    /* Highlight sidebar */

    $all(".navigation a").forEach(link => {

        link.classList.remove(
            "active"
        );


        const action =
            link.getAttribute(
                "onclick"
            ) || "";


        if (
            action.includes(
                `'${pageId}'`
            )
        ) {

            link.classList.add(
                "active"
            );

        }

    });


    updateStats();


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


/* =========================================================
   DASHBOARD STATISTICS
========================================================= */

function updateStats() {

    const analysed =
        $("#analysedCount");

    const threats =
        $("#threatCount");

    const spam =
        $("#spamCount");

    const important =
        $("#importantCount");


    if (analysed) {

        analysed.textContent =
            appState.stats.analysed;

    }


    if (threats) {

        threats.textContent =
            appState.stats.threats;

    }


    if (spam) {

        spam.textContent =
            appState.stats.spam;

    }


    if (important) {

        important.textContent =
            appState.stats.important;

    }


    /* Report page */

    if ($("#reportAnalysed")) {

        $("#reportAnalysed").textContent =
            appState.stats.analysed;

    }


    if ($("#reportThreats")) {

        $("#reportThreats").textContent =
            appState.stats.threats;

    }


    if ($("#reportSpam")) {

        $("#reportSpam").textContent =
            appState.stats.spam;

    }


    if ($("#reportImportant")) {

        $("#reportImportant").textContent =
            appState.stats.important;

    }

}


/* =========================================================
   FILE UPLOAD
========================================================= */

function fileUploaded() {

    const input =
        $("#emailFile");


    if (
        !input ||
        !input.files ||
        !input.files.length
    ) {

        return;

    }


    const file =
        input.files[0];


    const valid =
        /\.(eml|txt|msg)$/i
            .test(file.name);


    if (!valid) {

        showToast(
            "Please upload an .eml, .txt or .msg file.",
            true
        );


        input.value = "";


        return;

    }


    const reader =
        new FileReader();


    reader.onload =
        function(event) {

            const textarea =
                $("#emailContent");


            if (textarea) {

                textarea.value =
                    event.target.result || "";

            }


            showToast(
                `${file.name} loaded successfully.`
            );

        };


    reader.onerror =
        function() {

            showToast(
                "Could not read the email file.",
                true
            );

        };


    reader.readAsText(file);

}


/* =========================================================
   PARSE EMAIL
========================================================= */

function parseEmail(rawText) {

    const subjectMatch =
        rawText.match(
            /^Subject\s*:\s*(.+)$/im
        );


    const fromMatch =
        rawText.match(
            /^From\s*:\s*(.+)$/im
        );


    return {

        subject:
            subjectMatch
                ? subjectMatch[1].trim()
                : "Subject unavailable",

        sender:
            fromMatch
                ? fromMatch[1].trim()
                : "Sender information unavailable"

    };

}


/* =========================================================
   EMAIL THREAT ANALYSIS
========================================================= */

function analyseEmail() {

    const textarea =
        $("#emailContent");


    const content =
        textarea
            ? textarea.value.trim()
            : "";


    if (!content) {

        showToast(
            "Please upload an email or paste email content first.",
            true
        );

        return;

    }


    const lower =
        content.toLowerCase();


    const parsed =
        parseEmail(content);


    let score = 5;


    const reasons = [];


    /* -----------------------------------------------------
       SUSPICIOUS LINKS
    ----------------------------------------------------- */

    const urls =
        content.match(
            /https?:\/\/[^\s<>"']+/gi
        ) || [];


    if (urls.length > 0) {

        score += 20;


        const shortened =
            urls.some(url =>

                /bit\.ly|tinyurl\.com|t\.co|goo\.gl|ow\.ly|is\.gd/i
                    .test(url)

            );


        if (shortened) {

            score += 15;

            reasons.push(
                "Suspicious or shortened link detected"
            );

        }

        else {

            reasons.push(
                "Link detected in the email"
            );

        }

    }


    /* -----------------------------------------------------
       PHISHING / URGENCY
    ----------------------------------------------------- */

    const urgentWords = [

        "urgent",

        "immediately",

        "act now",

        "verify your account",

        "account suspended",

        "account will be closed",

        "confirm your account",

        "security alert",

        "click here",

        "password expired"

    ];


    const foundUrgent =
        urgentWords.filter(
            word => lower.includes(word)
        );


    if (foundUrgent.length > 0) {

        score += Math.min(
            30,
            foundUrgent.length * 8
        );


        reasons.push(
            "Phishing-like or urgent language detected"
        );

    }


    /* -----------------------------------------------------
       SCAM / FINANCIAL WORDS
    ----------------------------------------------------- */

    const scamWords = [

        "won a prize",

        "claim your reward",

        "lottery",

        "free money",

        "refund",

        "bank account",

        "credit card",

        "payment required",

        "gift card"

    ];


    if (
        scamWords.some(
            word => lower.includes(word)
        )
    ) {

        score += 20;


        reasons.push(
            "Potential financial or reward scam content"
        );

    }


    /* -----------------------------------------------------
       SENDER
    ----------------------------------------------------- */

    if (
        parsed.sender !==
        "Sender information unavailable"
    ) {

        const trustedDomains = [

            "college.edu"

        ];


        if (
            !trustedDomains.some(
                domain =>
                    parsed.sender
                        .toLowerCase()
                        .includes(domain)
            )
        ) {

            score += 15;


            reasons.push(
                "Sender domain could not be verified"
            );

        }

    }

    else {

        score += 10;


        reasons.push(
            "Sender information is missing"
        );

    }


    /* -----------------------------------------------------
       EXCESSIVE CAPITAL LETTERS
    ----------------------------------------------------- */

    const uppercase =
        (
            content.match(
                /[A-Z]/g
            ) || []
        ).length;


    const letters =
        (
            content.match(
                /[A-Za-z]/g
            ) || []
        ).length;


    if (
        letters > 30 &&
        uppercase / letters > 0.55
    ) {

        score += 10;


        reasons.push(
            "Unusual excessive capitalization"
        );

    }


    /* -----------------------------------------------------
       FINAL SCORE
    ----------------------------------------------------- */

    score =
        Math.min(
            100,
            score
        );


    let classification =
        "Safe";


    if (score >= 70) {

        classification =
            "Harmful";

    }

    else if (score >= 45) {

        classification =
            "Suspicious";

    }

    else if (score >= 25) {

        classification =
            "Spam";

    }


    if (!reasons.length) {

        reasons.push(
            "No major threat indicators detected"
        );

    }


    appState.analysis = {

        classification,

        score,

        sender:
            parsed.sender,

        subject:
            parsed.subject,

        reasons

    };


    appState.stats.analysed++;


    if (
        classification === "Harmful" ||
        classification === "Suspicious"
    ) {

        appState.stats.threats++;

    }


    if (
        classification === "Spam"
    ) {

        appState.stats.spam++;

    }


    renderThreatResult();


    showPage(
        "threatResult"
    );


    showToast(
        "Email analysis completed."
    );

}


/* =========================================================
   THREAT RESULT
========================================================= */

function renderThreatResult() {

    const result =
        appState.analysis;


    const card =
        $(".threat-result-card");


    if (!card) return;


    const icons = {

        Safe: "✓",

        Spam: "●",

        Suspicious: "⚠",

        Harmful: "☠"

    };


    const heading =
        card.querySelector(
            ".result-heading"
        );


    const description =
        card.querySelector(
            ".result-description"
        );


    const riskBox =
        card.querySelector(
            ".risk-box"
        );


    const riskTitle =
        riskBox
            ? riskBox.querySelector("span")
            : null;


    const riskScore =
        riskBox
            ? riskBox.querySelector("strong")
            : null;


    if (heading) {

        heading.textContent =
            `${icons[result.classification]} ${result.classification} Email`;

    }


    if (description) {

        if (
            result.classification ===
            "Safe"
        ) {

            description.textContent =
                "This email appears to be safe";

        }

        else if (
            result.classification ===
            "Spam"
        ) {

            description.textContent =
                "This email appears to be unwanted";

        }

        else if (
            result.classification ===
            "Harmful"
        ) {

            description.textContent =
                "This email may be harmful";

        }

        else {

            description.textContent =
                "This email may be unsafe";

        }

    }


    let riskLabel =
        "LOW RISK";


    if (result.score >= 70) {

        riskLabel =
            "HIGH RISK";

    }

    else if (result.score >= 45) {

        riskLabel =
            "MEDIUM RISK";

    }


    if (riskTitle) {

        riskTitle.textContent =
            riskLabel;

    }


    if (riskScore) {

        riskScore.textContent =
            `${result.score}/100`;

    }


    /* Email details */

    const details =
        card.querySelector(
            ".email-details"
        );


    if (details) {

        details.innerHTML = `

            <h3>
                Email Details
            </h3>

            <p>
                <b>From:</b><br>
                ${escapeHTML(result.sender)}
            </p>

            <p>
                <b>Subject:</b><br>
                ${escapeHTML(result.subject)}
            </p>

        `;

    }


    /* Reasons */

    const reasons =
        card.querySelector(
            ".flag-reasons"
        );


    if (reasons) {

        const reasonIcons = [

            "🔗",

            "👤",

            "⚠",

            "💳",

            "🔠"

        ];


        reasons.innerHTML = `

            <h3>
                Why was this flagged?
            </h3>

            ${result.reasons
                .map(
                    (reason, index) => `

                    <p>
                        ${
                            reasonIcons[
                                index %
                                reasonIcons.length
                            ]
                        }

                        ${escapeHTML(reason)}

                    </p>

                `
                )
                .join("")}

        `;

    }

}


/* =========================================================
   REPORT SPAM
========================================================= */

function markSpam() {

    appState.stats.spam++;


    showToast(
        "Email reported as spam."
    );


    setTimeout(
        () => showPage("spam"),
        500
    );


    updateStats();

}


/* =========================================================
   BLOCK SENDER
========================================================= */

function blockSender() {

    const sender =
        appState.analysis.sender;


    if (
        !sender ||
        sender ===
        "Sender information unavailable"
    ) {

        showToast(
            "Sender information is unavailable.",
            true
        );

        return;

    }


    if (
        appState.blockedSenders
            .includes(sender)
    ) {

        showToast(
            "Sender is already blocked."
        );

        return;

    }


    appState.blockedSenders.push(
        sender
    );


    showToast(
        `${sender} has been blocked.`
    );

}


/* =========================================================
   DELETE EMAIL
========================================================= */

function deleteEmail() {

    const confirmed =
        confirm(
            "Are you sure you want to delete this email?"
        );


    if (!confirmed) return;


    appState.deletedEmails.push(
        appState.analysis
    );


    showToast(
        "Email deleted successfully."
    );


    setTimeout(
        () => showPage("inbox"),
        500
    );

}


/* =========================================================
   THREAT DETAILS
========================================================= */

function openThreat(
    title,
    sender,
    score,
    reason
) {

    let classification =
        "Spam";


    if (score >= 70) {

        classification =
            "Harmful";

    }

    else if (score >= 45) {

        classification =
            "Suspicious";

    }


    appState.analysis = {

        classification,

        score,

        sender,

        subject: title,

        reasons: [reason]

    };


    renderThreatResult();


    showPage(
        "threatResult"
    );

}


/* =========================================================
   SEARCH - GENERIC
========================================================= */

function filterList(
    listSelector,
    searchText
) {

    const items =
        document.querySelectorAll(
            `${listSelector} .email-item`
        );


    const search =
        searchText
            .toLowerCase()
            .trim();


    let found = 0;


    items.forEach(item => {

        const text =
            item.textContent
                .toLowerCase();


        if (
            text.includes(search)
        ) {

            item.style.display =
                "block";

            found++;

        }

        else {

            item.style.display =
                "none";

        }

    });


    return found;

}


function searchInbox(text) {

    filterList(
        "#inboxList",
        text
    );

}


function searchSpam(text) {

    filterList(
        "#spamList",
        text
    );

}


function searchImportant(text) {

    filterList(
        "#importantList",
        text
    );

}


/* =========================================================
   MOBILE SIDEBAR
========================================================= */

function toggleSidebar() {

    const sidebar =
        $(".sidebar");


    if (!sidebar) return;


    sidebar.classList.toggle(
        "open"
    );

}


/* =========================================================
   TOAST
========================================================= */

function showToast(
    message,
    isError = false
) {

    let toast =
        $("#toast");


    if (!toast) {

        toast =
            document.createElement(
                "div"
            );


        toast.id =
            "toast";


        Object.assign(
            toast.style,
            {

                position:
                    "fixed",

                bottom:
                    "25px",

                left:
                    "50%",

                transform:
                    "translateX(-50%)",

                padding:
                    "10px 18px",

                borderRadius:
                    "20px",

                color:
                    "white",

                fontSize:
                    "12px",

                zIndex:
                    "9999",

                boxShadow:
                    "0 8px 25px rgba(0,0,0,.25)",

                transition:
                    "opacity .25s ease",

                maxWidth:
                    "90%",

                textAlign:
                    "center"

            }

        );


        document.body.appendChild(
            toast
        );

    }


    toast.textContent =
        message;


    toast.style.background =
        isError
            ? "#8b1e2d"
            : "#101933";


    toast.style.opacity =
        "1";


    clearTimeout(
        window.toastTimer
    );


    window.toastTimer =
        setTimeout(
            () => {

                toast.style.opacity =
                    "0";

            },
            2500
        );

}


/* =========================================================
   GENERATE REPORT
========================================================= */

function generateReport() {

    updateStats();


    showToast(
        "Security report updated successfully."
    );

}


/* =========================================================
   KEYBOARD SHORTCUTS
========================================================= */

document.addEventListener(
    "keydown",
    function(event) {

        /* Enter = Login */

        if (
            event.key === "Enter" &&
            $("#loginPage") &&
            !$("#loginPage")
                .classList
                .contains("hidden")
        ) {

            loginUser();

        }


        /* Escape = close sidebar */

        if (
            event.key === "Escape"
        ) {

            const sidebar =
                $(".sidebar");


            if (sidebar) {

                sidebar.classList.remove(
                    "open"
                );

            }

        }


        /* Ctrl + K = Email Analysis */

        if (
            (event.ctrlKey ||
             event.metaKey) &&
            event.key.toLowerCase() === "k"
        ) {

            event.preventDefault();


            const app =
                $("#app");


            if (
                app &&
                !app.classList.contains(
                    "hidden"
                )
            ) {

                showPage(
                    "analysis"
                );


                setTimeout(
                    () => {

                        $("#emailContent")
                            ?.focus();

                    },
                    100
                );

            }

        }

    }
);


/* =========================================================
   INITIALISE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        updateStats();


        renderThreatResult();


        /*
         * Login is shown initially.
         */

        if ($("#loginPage")) {

            $("#loginPage")
                .classList
                .remove("hidden");

        }


        if ($("#app")) {

            $("#app")
                .classList
                .add("hidden");

        }


        /*
         * Close mobile sidebar after
         * clicking a navigation item.
         */

        $all(
            ".navigation a"
        ).forEach(
            link => {

                link.addEventListener(
                    "click",
                    () => {

                        $(".sidebar")
                            ?.classList
                            .remove("open");

                    }
                );

            }
        );

    }
);
