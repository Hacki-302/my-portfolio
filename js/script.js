
"use strict";

/* =========================================
   BORIF GIDO — PERSONAL PORTFOLIO
   File: js/script.js
========================================= */

document.addEventListener("DOMContentLoaded", () => {
    initializeMobileNavigation();
    initializeActiveNavigation();
    initializeScrollAnimations();
    initializeBackToTop();
    initializeDynamicYear();
    initializeContactForm();
    initializeSmoothScrolling();
});


/* =========================================
   1. MOBILE NAVIGATION
========================================= */

function initializeMobileNavigation() {
    const navbar = document.querySelector(".navbar");
    const navMenu = document.querySelector(".nav-menu");

    if (!navbar || !navMenu) return;

    // Create a menu button without changing the HTML.
    const menuButton = document.createElement("button");

    menuButton.type = "button";
    menuButton.className = "menu-toggle";
    menuButton.setAttribute("aria-label", "Open navigation menu");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-controls", "main-navigation");
    menuButton.innerHTML = `
        <span></span>
        <span></span>
        <span></span>
    `;

    navMenu.id = "main-navigation";

    navbar.insertBefore(menuButton, navMenu);

    function closeMenu() {
        navMenu.classList.remove("is-open");
        menuButton.classList.remove("is-active");

        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute(
            "aria-label",
            "Open navigation menu"
        );
    }

    function toggleMenu() {
        const isOpen = navMenu.classList.toggle("is-open");

        menuButton.classList.toggle("is-active", isOpen);

        menuButton.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

        menuButton.setAttribute(
            "aria-label",
            isOpen
                ? "Close navigation menu"
                : "Open navigation menu"
        );
    }

    menuButton.addEventListener("click", toggleMenu);

    navMenu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeMenu();
            menuButton.focus();
        }
    });

    document.addEventListener("click", (event) => {
        if (
            !navbar.contains(event.target) &&
            navMenu.classList.contains("is-open")
        ) {
            closeMenu();
        }
    });

    // Reset the mobile menu when switching to desktop.
    window.addEventListener("resize", () => {
        if (window.innerWidth > 760) {
            closeMenu();
        }
    });
}


/* =========================================
   2. ACTIVE NAVIGATION LINK
========================================= */

function initializeActiveNavigation() {
    const sections = document.querySelectorAll(
        "main section[id]"
    );

    const navLinks = document.querySelectorAll(
        ".nav-menu .nav-link"
    );

    if (!sections.length || !navLinks.length) return;

    function updateActiveLink() {
        const header = document.querySelector(".header");

        const headerHeight = header
            ? header.offsetHeight
            : 0;

        let currentSection = sections[0].id;

        sections.forEach((section) => {
            const sectionTop =
                section.getBoundingClientRect().top;

            if (sectionTop <= headerHeight + 120) {
                currentSection = section.id;
            }
        });

        navLinks.forEach((link) => {
            const isActive =
                link.getAttribute("href") ===
                `#${currentSection}`;

            link.classList.toggle("active", isActive);

            if (isActive) {
                link.setAttribute("aria-current", "location");
            } else {
                link.removeAttribute("aria-current");
            }
        });
    }

    window.addEventListener(
        "scroll",
        updateActiveLink,
        { passive: true }
    );

    window.addEventListener("resize", updateActiveLink);

    updateActiveLink();
}


/* =========================================
   3. SCROLL REVEAL ANIMATIONS
========================================= */

function initializeScrollAnimations() {
    const animatedElements = document.querySelectorAll(`
        .section-heading,
        .about-text,
        .highlight-card,
        .skill-card,
        .project-card,
        .education-card,
        .learning-card,
        .resume-container,
        .contact-info,
        .contact-form-wrapper
    `);

    if (!animatedElements.length) return;

    // Respect the visitor's accessibility settings.
    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (
        prefersReducedMotion ||
        !("IntersectionObserver" in window)
    ) {
        animatedElements.forEach((element) => {
            element.classList.add("is-visible");
        });

        return;
    }

    animatedElements.forEach((element) => {
        element.classList.add("reveal");
    });

    const observer = new IntersectionObserver(
        (entries, observerInstance) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");

                    observerInstance.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -40px 0px"
        }
    );

    animatedElements.forEach((element) => {
        observer.observe(element);
    });
}


/* =========================================
   4. BACK-TO-TOP BUTTON
========================================= */

function initializeBackToTop() {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "back-to-top";
    button.textContent = "↑";

    button.setAttribute("aria-label", "Back to top");
    button.title = "Back to top";

    document.body.appendChild(button);

    function updateVisibility() {
        button.classList.toggle(
            "is-visible",
            window.scrollY > 400
        );
    }

    window.addEventListener(
        "scroll",
        updateVisibility,
        { passive: true }
    );

    button.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches
                ? "auto"
                : "smooth"
        });
    });

    updateVisibility();
}


/* =========================================
   5. DYNAMIC COPYRIGHT YEAR
========================================= */

function initializeDynamicYear() {
    const copyright = document.querySelector(
        ".copyright"
    );

    if (!copyright) return;

    copyright.innerHTML =
        `&copy; ${new Date().getFullYear()} ` +
        "Borif Gido. All rights reserved.";
}


/* =========================================
   6. CONTACT FORM
========================================= */

function initializeContactForm() {
    const form = document.querySelector(
        ".contact-form-wrapper form"
    );

    if (!form) return;

    const nameInput = form.querySelector("#name");
    const emailInput = form.querySelector("#email");
    const subjectInput = form.querySelector("#subject");
    const messageInput = form.querySelector("#message");

    if (
        !nameInput ||
        !emailInput ||
        !subjectInput ||
        !messageInput
    ) {
        return;
    }

    // Use a live status message for validation feedback.
    const status = document.createElement("p");

    status.className = "form-status";
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");

    status.hidden = true;

    form.appendChild(status);

    function showStatus(message, isError = false) {
        status.textContent = message;
        status.hidden = false;

        status.classList.toggle("is-error", isError);
        status.classList.toggle("is-success", !isError);
    }

    function clearStatus() {
        status.hidden = true;
        status.textContent = "";
    }

    form.addEventListener("input", clearStatus);

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const subject = subjectInput.value.trim();
        const message = messageInput.value.trim();

        if (!name || !email || !subject || !message) {
            showStatus(
                "Please complete all fields before continuing.",
                true
            );

            return;
        }

        // Use the browser's email validation.
        if (!emailInput.validity.valid) {
            showStatus(
                "Please enter a valid email address.",
                true
            );

            emailInput.focus();

            return;
        }

        if (message.length < 10) {
            showStatus(
                "Please write a message containing at least 10 characters.",
                true
            );

            messageInput.focus();

            return;
        }

        // Prepare an email in the visitor's email application.
        const recipient = "borifhacki302@gmail.com";

        const emailSubject = encodeURIComponent(subject);

        const emailBody = encodeURIComponent(
            `Hello Borif,\n\n` +
            `${message}\n\n` +
            `Regards,\n${name}\n` +
            `Reply to: ${email}`
        );

        const mailtoLink =
            `mailto:${recipient}` +
            `?subject=${emailSubject}` +
            `&body=${emailBody}`;  
    });
}


/* =========================================
   7. SMOOTH INTERNAL NAVIGATION
========================================= */

function initializeSmoothScrolling() {
    const internalLinks = document.querySelectorAll(
        'a[href^="#"]'
    );

    internalLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") return;

            const target = document.querySelector(targetId);

            if (!target) return;

            event.preventDefault();

            const header = document.querySelector(".header");

            const headerHeight = header
                ? header.offsetHeight
                : 0;

            const targetPosition =
                target.getBoundingClientRect().top +
                window.scrollY -
                headerHeight -
                12;

            const prefersReducedMotion = window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches;

            window.scrollTo({
                top: Math.max(0, targetPosition),
                behavior: prefersReducedMotion
                    ? "auto"
                    : "smooth"
            });

            // Keep the address bar in sync with navigation.
            if (history.replaceState) {
                history.replaceState(null, "", targetId);
            }
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("contact-form");
    const submitButton = document.getElementById("contact-submit");
    const statusMessage = document.getElementById("contact-status");

    if (!form || !submitButton || !statusMessage) {
        return;
    }

    
    const API_URL = "https://borif-portfolio-api.onrender.com/api/contact";

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        // Use built-in browser validation.
        if (!form.reportValidity()) {
            return;
        }

        const formData = new FormData(form);

        // Basic frontend spam-trap check.
        if (String(formData.get("website") || "").trim()) {
            statusMessage.textContent = "Unable to submit this message.";
            statusMessage.dataset.state = "error";
            return;
        }

        const data = {
            name: String(formData.get("name") || "").trim(),
            email: String(formData.get("email") || "").trim(),
            subject: String(formData.get("subject") || "").trim(),
            message: String(formData.get("message") || "").trim(),
        };

        // Show a loading state.
        submitButton.disabled = true;
        submitButton.textContent = "Sending...";
        statusMessage.textContent = "Sending your message. Please wait.";
        statusMessage.dataset.state = "loading";

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message || "Unable to send your message."
                );
            }

            statusMessage.textContent = result.message;
            statusMessage.dataset.state = "success";

            form.reset();
        } catch (error) {
            console.error("Contact form error:", error);

            statusMessage.textContent =
                error.message === "Failed to fetch"
                    ? "Unable to connect to the server. Please try again later."
                    : error.message || "Something went wrong. Please try again.";

            statusMessage.dataset.state = "error";
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = "Send Message →";
        }
    });
});
