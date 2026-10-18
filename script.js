
"use strict";

// =====================================
// ONETOOL — INTERACTIVE FUNCTIONALITY
// =====================================

document.addEventListener("DOMContentLoaded", () => {
    const searchForm = document.getElementById("searchForm");
    const searchInput = document.getElementById("toolSearch");
    const toolCards = [...document.querySelectorAll(".tool-card")];
    const categoryButtons = [
        ...document.querySelectorAll(".category-button")
    ];

    const resultsCount = document.getElementById("resultsCount");
    const emptyState = document.getElementById("emptyState");
    const resetSearch = document.getElementById("resetSearch");

    const themeToggle = document.getElementById("themeToggle");
    const themeIcon = document.getElementById("themeIcon");

    const menuToggle = document.getElementById("menuToggle");
    const mainNav = document.getElementById("mainNav");

    const toast = document.getElementById("toast");

    let activeCategory = "all";
    let toastTimeout;

    // ---------------------------------
    // NOTIFICATION MESSAGE
    // ---------------------------------

    function showToast(message) {
        toast.textContent = message;
        toast.classList.add("show");

        clearTimeout(toastTimeout);

        toastTimeout = setTimeout(() => {
            toast.classList.remove("show");
        }, 3000);
    }

    // ---------------------------------
    // SEARCH AND CATEGORY FILTERING
    // ---------------------------------

    function filterTools() {
        const query = searchInput.value
            .trim()
            .toLowerCase();

        let visibleCount = 0;

        toolCards.forEach((card) => {
            const title = card.querySelector("h3").textContent;
            const description = card.querySelector("p").textContent;
            const keywords = card.dataset.search || "";
            const category = card.dataset.category || "";

            const searchableText =
                `${title} ${description} ${keywords}`.toLowerCase();

            const matchesSearch =
                query === "" || searchableText.includes(query);

            const matchesCategory =
                activeCategory === "all" ||
                category === activeCategory;

            const isVisible = matchesSearch && matchesCategory;

            card.hidden = !isVisible;

            if (isVisible) {
                visibleCount++;
            }
        });

        resultsCount.textContent =
            `${visibleCount} ${visibleCount === 1 ? "tool" : "tools"}`;

        emptyState.hidden = visibleCount !== 0;
    }

    searchInput.addEventListener("input", filterTools);

    searchForm.addEventListener("submit", (event) => {
        event.preventDefault();
        filterTools();

        document.getElementById("tools").scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

        if (searchInput.value.trim() && 
            toolCards.every(card => card.hidden)) {
            showToast("No matching tools found. Try another keyword.");
        }
    });

    categoryButtons.forEach((button) => {
        button.addEventListener("click", () => {
            activeCategory = button.dataset.category;

            categoryButtons.forEach((item) => {
                const isActive = item === button;
                item.classList.toggle("active", isActive);
                item.setAttribute("aria-pressed", String(isActive));
            });

            filterTools();
        });

        button.setAttribute(
            "aria-pressed",
            String(button.classList.contains("active"))
        );
    });

    // ---------------------------------
    // POPULAR SEARCH SUGGESTIONS
    // ---------------------------------

    document.querySelectorAll(".suggestion").forEach((button) => {
        button.addEventListener("click", () => {
            searchInput.value = button.dataset.search;
            activeCategory = "all";

            categoryButtons.forEach((item) => {
                const isActive = item.dataset.category === "all";
                item.classList.toggle("active", isActive);
                item.setAttribute("aria-pressed", String(isActive));
            });

            filterTools();

            document.getElementById("tools").scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

            searchInput.focus();
        });
    });

    // ---------------------------------
    // RESET SEARCH
    // ---------------------------------

    resetSearch.addEventListener("click", () => {
        searchInput.value = "";
        activeCategory = "all";

        categoryButtons.forEach((button) => {
            const isActive = button.dataset.category === "all";
            button.classList.toggle("active", isActive);
            button.setAttribute("aria-pressed", String(isActive));
        });

        filterTools();
        searchInput.focus();
    });

    // ---------------------------------
    // LIGHT / DARK THEME
    // ---------------------------------

    function applyTheme(theme) {
        const isLight = theme === "light";

        document.documentElement.dataset.theme =
            isLight ? "light" : "dark";

        themeIcon.textContent = isLight ? "☾" : "☼";

        themeToggle.setAttribute(
            "aria-label",
            isLight ? "Switch to dark theme" : "Switch to light theme"
        );

        themeToggle.title =
            isLight ? "Switch to dark theme" : "Switch to light theme";

        const themeColor = document.querySelector(
            'meta[name="theme-color"]'
        );

        if (themeColor) {
            themeColor.content = isLight ? "#f5f8ff" : "#080d18";
        }
    }

    let savedTheme = "dark";

    try {
        const storedTheme = localStorage.getItem("onetool-theme");

        if (storedTheme === "light" || storedTheme === "dark") {
            savedTheme = storedTheme;
        }
    } catch (error) {
        // Theme switching still works if storage is unavailable.
    }

    applyTheme(savedTheme);

    themeToggle.addEventListener("click", () => {
        const currentTheme =
            document.documentElement.dataset.theme || "dark";

        const newTheme = currentTheme === "dark" ? "light" : "dark";

        applyTheme(newTheme);

        try {
            localStorage.setItem("onetool-theme", newTheme);
        } catch (error) {
            // The selected theme remains active for this page session.
        }
    });

    // ---------------------------------
    // MOBILE NAVIGATION
    // ---------------------------------

    menuToggle.addEventListener("click", () => {
        const isOpen = mainNav.classList.toggle("open");

        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Close navigation" : "Open navigation"
        );
    });

    mainNav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            mainNav.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", "false");

            mainNav.querySelectorAll("a").forEach((item) => {
                item.classList.toggle("active", item === link);
            });
        });
    });

    
/* =====================================
   ONETOOL - WORKING TOOL MODAL
   Replace the old TOOL BUTTONS section
   ===================================== */

const modal = document.getElementById("toolModal");
const modalTitle = document.getElementById("toolModalTitle");
const modalDescription = document.getElementById("toolModalDescription");
const workspace = document.getElementById("toolWorkspace");
const closeModalButton = document.getElementById("closeToolModal");
const resetToolButton = document.getElementById("resetTool");

const toolInfo = {
    percentage: ["Percentage Calculator", "Calculate percentages, increases and decreases."],
    age: ["Age Calculator", "Calculate your age from your date of birth."],
    "word-counter": ["Word Counter", "Count words, characters and lines."],
    "unit-converter": ["Unit Converter", "Convert common length and weight units."],
    discount: ["Discount Calculator", "Calculate discounts and final prices."],
    temperature: ["Temperature Converter", "Convert Celsius, Fahrenheit and Kelvin."],
    "case-converter": ["Case Converter", "Change the case of your text."],
    "duplicate-lines": ["Duplicate Line Remover", "Remove repeated lines from text."],
    "date-difference": ["Date Difference", "Calculate the days between two dates."],
    loan: ["Loan Calculator", "Estimate monthly loan payments."],
    password: ["Password Generator", "Generate a random password in your browser."],
    "text-cleaner": ["Text Cleaner", "Clean up spaces and blank lines in text."]
};

let activeTool = "";
let previousFocus = null;

function field(label, id, type = "number", placeholder = "") {
    return `
        <div class="tool-field">
            <label for="${id}">${label}</label>
            <input id="${id}" name="${id}" type="${type}"
                ${type === "number" ? 'step="any"' : ""}
                placeholder="${placeholder}" required>
        </div>`;
}

function selectField(label, id, options) {
    return `
        <div class="tool-field">
            <label for="${id}">${label}</label>
            <select id="${id}" name="${id}">
                ${options.map(([value, text]) =>
                    `<option value="${value}">${text}</option>`
                ).join("")}
            </select>
        </div>`;
}

function textArea(label, id, placeholder = "Enter your text here...") {
    return `
        <div class="tool-field">
            <label for="${id}">${label}</label>
            <textarea id="${id}" name="${id}"
                placeholder="${placeholder}"></textarea>
        </div>`;
}

function toolForm(content, submitLabel = "Calculate") {
    return `
        <form class="tool-form" id="activeToolForm">
            ${content}
            <div class="tool-form-actions">
                <button class="btn btn-primary" type="submit">
                    ${submitLabel}
                </button>
                <button class="btn btn-secondary" type="button" id="copyToolResult">
                    Copy Result
                </button>
            </div>
            <div id="toolFeedback" aria-live="polite"></div>
            <div id="toolResult" class="tool-result" hidden>
                <div class="tool-result-label">RESULT</div>
                <div class="tool-result-value" id="toolResultValue"></div>
                <div class="tool-result-detail" id="toolResultDetail"></div>
            </div>
        </form>`;
}

function openTool(id) {
    if (!toolInfo[id]) return;

    activeTool = id;
    previousFocus = document.activeElement;

    modalTitle.textContent = toolInfo[id][0];
    modalDescription.textContent = toolInfo[id][1];

    let content = "";

    switch (id) {
        case "percentage":
            content = toolForm(
                selectField("Calculation", "calcMode", [
                    ["of", "What is X% of Y?"],
                    ["change", "Percentage change from X to Y"],
                    ["increase", "Increase X by Y%"],
                    ["decrease", "Decrease X by Y%"]
                ]) +
                field("First number (X)", "numX") +
                field("Second number (Y)", "numY")
            );
            break;

        case "age":
            content = toolForm(
                field("Date of birth", "birthDate", "date")
            );
            break;

        case "word-counter":
            content = toolForm(
                textArea("Your text", "textInput"),
                "Update Counts"
            );
            break;

        case "unit-converter":
            content = toolForm(
                field("Value", "unitValue") +
                selectField("Convert", "unitType", [
                    ["km-mi", "Kilometers → Miles"],
                    ["mi-km", "Miles → Kilometers"],
                    ["kg-lb", "Kilograms → Pounds"],
                    ["lb-kg", "Pounds → Kilograms"],
                    ["cm-in", "Centimeters → Inches"],
                    ["in-cm", "Inches → Centimeters"],
                    ["km-m", "Kilometers → Meters"],
                    ["m-km", "Meters → Kilometers"]
                ])
            );
            break;

        case "discount":
            content = toolForm(
                field("Original price", "originalPrice") +
                field("Discount (%)", "discountPercent")
            );
            break;

        case "temperature":
            content = toolForm(
                field("Temperature", "tempValue") +
                selectField("Convert from", "tempFrom", [
                    ["C", "Celsius (°C)"],
                    ["F", "Fahrenheit (°F)"],
                    ["K", "Kelvin (K)"]
                ]) +
                selectField("Convert to", "tempTo", [
                    ["F", "Fahrenheit (°F)"],
                    ["C", "Celsius (°C)"],
                    ["K", "Kelvin (K)"]
                ])
            );
            break;

        case "case-converter":
            content = toolForm(
                textArea("Text to convert", "caseInput") +
                selectField("Text case", "caseMode", [
                    ["upper", "UPPERCASE"],
                    ["lower", "lowercase"],
                    ["title", "Title Case"],
                    ["sentence", "Sentence case"]
                ]),
                "Convert Text"
            );
            break;

        case "duplicate-lines":
            content = toolForm(
                textArea("Text", "duplicateInput"),
                "Remove Duplicates"
            );
            break;

        case "date-difference":
            content = toolForm(
                field("Start date", "startDate", "date") +
                field("End date", "endDate", "date")
            );
            break;

        case "loan":
            content = toolForm(
                field("Loan amount", "loanAmount") +
                field("Annual interest rate (%)", "loanRate") +
                field("Loan term (years)", "loanYears")
            );
            break;

        case "password":
            content = toolForm(
                field("Password length (8–64)", "passwordLength") +
                `<div class="tool-field">
                    <label><input type="checkbox" id="includeNumbers" checked>
                    Include numbers</label>
                    <label><input type="checkbox" id="includeSymbols" checked>
                    Include symbols</label>
                </div>`,
                "Generate Password"
            );
            break;

        case "text-cleaner":
            content = toolForm(
                textArea("Text to clean", "cleanInput") +
                `<div class="tool-field">
                    <label><input type="checkbox" id="removeBlank" checked>
                    Remove blank lines</label>
                    <label><input type="checkbox" id="trimLines" checked>
                    Trim spaces on each line</label>
                </div>`,
                "Clean Text"
            );
            break;
    }

    workspace.innerHTML = content;
    modal.hidden = false;
    document.body.classList.add("modal-open");

    const form = document.getElementById("activeToolForm");

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        runTool();
    });

    document.getElementById("copyToolResult")
        .addEventListener("click", copyResult);

    const firstInput = form.querySelector("input:not([type=checkbox]), textarea, select");
    if (firstInput) firstInput.focus();
}

function showResult(value, detail = "") {
    const result = document.getElementById("toolResult");
    result.hidden = false;
    document.getElementById("toolResultValue").textContent = String(value);
    document.getElementById("toolResultDetail").textContent = detail;

    const feedback = document.getElementById("toolFeedback");
    feedback.textContent = "";
}

function showError(message) {
    document.getElementById("toolFeedback").textContent = message;
    document.getElementById("toolFeedback").className = "tool-error";
}

function getNumber(id) {
    const input = document.getElementById(id);
    const value = input.value.trim();

    if (value === "") throw new Error("Please fill in all required fields.");

    const number = Number(value);

    if (!Number.isFinite(number)) {
        throw new Error("Enter a valid number.");
    }

    return number;
}

function formatNumber(value) {
    if (!Number.isFinite(value)) throw new Error("The result is not valid.");
    return new Intl.NumberFormat("en-US", {
        maximumFractionDigits: 6
    }).format(value);
}

function runTool() {
    try {
        let result;
        let detail = "";

        switch (activeTool) {
            case "percentage": {
                const mode = document.getElementById("calcMode").value;
                const x = getNumber("numX");
                const y = getNumber("numY");

                if (mode === "of") {
                    result = formatNumber(y * x / 100);
                    detail = `${x}% of ${y}`;
                } else if (mode === "change") {
                    if (x === 0) throw new Error("The starting value cannot be zero.");
                    result = `${formatNumber((y - x) / Math.abs(x) * 100)}%`;
                    detail = y >= x ? "Increase" : "Decrease";
                } else if (mode === "increase") {
                    result = formatNumber(x * (1 + y / 100));
                    detail = `New value after a ${y}% increase`;
                } else {
                    result = formatNumber(x * (1 - y / 100));
                    detail = `New value after a ${y}% decrease`;
                }
                break;
            }

            case "age": {
                const value = document.getElementById("birthDate").value;
                if (!value) throw new Error("Select your date of birth.");

                const birth = new Date(value + "T00:00:00");
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                if (Number.isNaN(birth.getTime()) || birth > today) {
                    throw new Error("Enter a valid birth date that is not in the future.");
                }

                let years = today.getFullYear() - birth.getFullYear();
                let months = today.getMonth() - birth.getMonth();
                let days = today.getDate() - birth.getDate();

                if (days < 0) {
                    months--;
                    const previousMonthDays = new Date(
                        today.getFullYear(), today.getMonth(), 0
                    ).getDate();
                    days += previousMonthDays;
                }

                if (months < 0) {
                    years--;
                    months += 12;
                }

                result = `${years} years`;
                detail = `${months} months, ${days} days`;
                break;
            }

            case "word-counter": {
                const text = document.getElementById("textInput").value;
                const words = text.trim() ? text.trim().split(/\s+/u).length : 0;
                const chars = text.length;
                const noSpaces = text.replace(/\s/gu, "").length;
                const lines = text ? text.split(/\r\n|\r|\n/u).length : 0;

                result = `${words} words`;
                detail = `${chars} characters · ${noSpaces} without spaces · ${lines} lines`;
                break;
            }

            case "unit-converter": {
                const value = getNumber("unitValue");
                const conversion = {
                    "km-mi": [0.621371, "miles"],
                    "mi-km": [1.609344, "kilometers"],
                    "kg-lb": [2.204623, "pounds"],
                    "lb-kg": [0.45359237, "kilograms"],
                    "cm-in": [1 / 2.54, "inches"],
                    "in-cm": [2.54, "centimeters"],
                    "km-m": [1000, "meters"],
                    "m-km": [0.001, "kilometers"]
                }[document.getElementById("unitType").value];

                result = formatNumber(value * conversion[0]);
                detail = conversion[1];
                break;
            }

            case "discount": {
                const price = getNumber("originalPrice");
                const percent = getNumber("discountPercent");

                if (price < 0 || percent < 0 || percent > 100) {
                    throw new Error("Price must be non-negative and discount must be 0–100%.");
                }

                result = formatNumber(price * (1 - percent / 100));
                detail = `You save ${formatNumber(price * percent / 100)} (${percent}%)`;
                break;
            }

            case "temperature": {
                const value = getNumber("tempValue");
                const from = document.getElementById("tempFrom").value;
                const to = document.getElementById("tempTo").value;

                let celsius = value;
                if (from === "F") celsius = (value - 32) * 5 / 9;
                if (from === "K") celsius = value - 273.15;

                if (from === "K" && value < 0) {
                    throw new Error("Kelvin cannot be below zero.");
                }

                let converted = celsius;
                if (to === "F") converted = celsius * 9 / 5 + 32;
                if (to === "K") converted = celsius + 273.15;

                if (to === "K" && converted < 0) {
                    throw new Error("Temperature is below absolute zero.");
                }

                result = `${formatNumber(converted)} °${to === "K" ? "K" : to}`;
                detail = `${value} °${from} converted to ${to}`;
                break;
            }

            case "case-converter": {
                const text = document.getElementById("caseInput").value;
                const mode = document.getElementById("caseMode").value;

                if (!text) throw new Error("Enter some text first.");

                if (mode === "upper") result = text.toUpperCase();
                if (mode === "lower") result = text.toLowerCase();
                if (mode === "title") {
                    result = text.toLowerCase().replace(
                        /(^|[\s\p{P}])(\p{L})/gu,
                        (_, prefix, letter) => prefix + letter.toUpperCase()
                    );
                }
                if (mode === "sentence") {
                    result = text.toLowerCase().replace(
                        /(^\s*\p{L}|[.!?]\s+\p{L})/gu,
                        match => match.toUpperCase()
                    );
                }
                detail = "Converted text";
                break;
            }

            case "duplicate-lines": {
                const text = document.getElementById("duplicateInput").value;
                const lines = text.split(/\r\n|\r|\n/u);
                const seen = new Set();
                const unique = lines.filter(line => {
                    if (seen.has(line)) return false;
                    seen.add(line);
                    return true;
                });

                result = `${lines.length - unique.length} duplicates removed`;
                detail = unique.join("\n");
                break;
            }

            case "date-difference": {
                const startValue = document.getElementById("startDate").value;
                const endValue = document.getElementById("endDate").value;

                if (!startValue || !endValue) {
                    throw new Error("Choose both dates.");
                }

                const start = new Date(startValue + "T00:00:00Z");
                const end = new Date(endValue + "T00:00:00Z");

                const days = Math.round(Math.abs(end - start) / 86400000);
                result = `${days} days`;
                detail = `${Math.floor(days / 7)} weeks and ${days % 7} days`;
                break;
            }

            case "loan": {
                const principal = getNumber("loanAmount");
                const annualRate = getNumber("loanRate");
                const years = getNumber("loanYears");

                if (principal <= 0 || annualRate < 0 || years <= 0 || years > 100) {
                    throw new Error("Enter a positive loan amount and term, with a non-negative rate.");
                }

                const n = years * 12;
                const r = annualRate / 1200;
                const monthly = r === 0
                    ? principal / n
                    : principal * r / (1 - Math.pow(1 + r, -n));

                result = formatNumber(monthly);
                detail = `Estimated monthly payment · Total ${formatNumber(monthly * n)} · Interest ${formatNumber(monthly * n - principal)}`;
                break;
            }

            case "password": {
                const length = getNumber("passwordLength");
                const numbers = document.getElementById("includeNumbers").checked;
                const symbols = document.getElementById("includeSymbols").checked;

                if (!Number.isInteger(length) || length < 8 || length > 64) {
                    throw new Error("Password length must be an integer from 8 to 64.");
                }

                let chars = "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ";
                if (numbers) chars += "23456789";
                if (symbols) chars += "!@#$%&*+-_=?";
                if (!numbers && !symbols) {
                    // Letters-only passwords are allowed.
                }

                const random = new Uint32Array(length);
                crypto.getRandomValues(random);

                result = Array.from(random, n => chars[n % chars.length]).join("");
                detail = "Store your password securely. Do not share it.";
                break;
            }

            case "text-cleaner": {
                const text = document.getElementById("cleanInput").value;
                const removeBlank = document.getElementById("removeBlank").checked;
                const trimLines = document.getElementById("trimLines").checked;

                let lines = text.split(/\r\n|\r|\n/u);
                if (trimLines) lines = lines.map(line => line.trim());
                if (removeBlank) lines = lines.filter(line => line.length > 0);

                result = lines.join("\n");
                detail = `${text.length} original characters`;
                break;
            }
        }

        showResult(result, detail);
    } catch (error) {
        showError(error.message || "Something went wrong. Please check your input.");
    }
}

async function copyResult() {
    const value = document.getElementById("toolResultValue");
    const detail = document.getElementById("toolResultDetail");
    const feedback = document.getElementById("toolFeedback");

    if (!value || document.getElementById("toolResult").hidden) {
        feedback.textContent = "Calculate or generate a result first.";
        feedback.className = "tool-error";
        return;
    }

    const text = [value.textContent, detail.textContent]
        .filter(Boolean).join("\n");

    try {
        await navigator.clipboard.writeText(text);
        feedback.className = "";
        feedback.textContent = "Result copied.";
    } catch {
        feedback.className = "tool-error";
        feedback.textContent =
            "Copy was blocked by the browser. Select the result and copy it manually.";
    }
}

function closeToolModal() {
    modal.hidden = true;
    document.body.classList.remove("modal-open");

    if (previousFocus && typeof previousFocus.focus === "function") {
        previousFocus.focus();
    }
}

closeModalButton.addEventListener("click", closeToolModal);

modal.querySelectorAll("[data-close-modal]").forEach(element => {
    element.addEventListener("click", closeToolModal);
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !modal.hidden) {
        closeToolModal();
    }
});

resetToolButton.addEventListener("click", () => {
    if (!activeTool) return;
    openTool(activeTool);
});

// Connect every tool card/button using data-tool="tool-id".
document.querySelectorAll("[data-tool]").forEach(button => {
    button.addEventListener("click", () => {
        openTool(button.dataset.tool);
    });
});
    // ---------------------------------
    // FOOTER YEAR
    // ---------------------------------

    document.getElementById("currentYear").textContent =
        new Date().getFullYear();

    // Initial display
    filterTools();
});
