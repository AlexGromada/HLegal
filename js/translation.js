if (!localStorage.getItem("currentLang")) {
    localStorage.setItem("currentLang", "en");
}
let currentLang = localStorage.getItem("currentLang");

// Завантажуємо JSON один раз і зберігаємо
let translationsData = null;
async function fetchTranslations() {
    if (!translationsData) {
        const response = await fetch('../data/translation.json');
        translationsData = await response.json();
    }
    return translationsData;
}

async function changeLang(newLang) {
    localStorage.setItem("currentLang", newLang);
    currentLang = newLang;

    await loadContent(pageCategory, pageId, componentsList);
}

async function loadContent(pageCategory, pageId, componentsList) {
    const translations = await fetchTranslations();

    // Оновлюємо активну мову у меню
    document.querySelectorAll(".settings_and_contacts__lang li").forEach(li => li.classList.remove("active"));
    const activeLang = document.getElementById(currentLang);
    if (activeLang) activeLang.classList.add("active");

    let basePageContent = translations.pages?.[pageId] || {};
    let content = {};

    if (pageCategory === "static") {
        content = { ...basePageContent };
    } else if (pageCategory === "entry") {
        const urlParams = new URLSearchParams(window.location.search);
        const pageName = urlParams.get("id");
        const entryBlock = (pageName && basePageContent?.[pageName]) ? basePageContent[pageName] : {};
        content = { ...basePageContent, ...entryBlock };
    }

    if (Array.isArray(componentsList) && componentsList.length > 0) {
        componentsList.forEach(compName => {
            const comp = translations.components?.[compName];
            if (comp && typeof comp === "object") {
                content = { ...comp, ...content };
            }
        });
    }

    if (!content || Object.keys(content).length === 0) {
        document.body.innerHTML = "<h2>Content not found</h2>";
        return;
    }

    document.querySelectorAll("[data-translate]").forEach(el => {
        const key = el.getAttribute("data-translate");
        if (!key) return;

        const value = content[key];
        if (!value) return;

        const targetAttr = el.getAttribute("data-attr"); // наприклад "placeholder"
        let text = typeof value === "object" ? value[currentLang] : value;

        if (targetAttr) {
            el.setAttribute(targetAttr, text);
        } else if (el.tagName === "IMG") {
            el.src = text;
        } else {
            el.textContent = text;
        }
    });
}
