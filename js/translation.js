if (!localStorage.getItem("currentLang")) localStorage.setItem("currentLang", "en");
let currentLang = localStorage.getItem("currentLang");

let translation; // глобальна змінна для всіх функцій

fetch('../data/translation.json')
    .then(res => res.json())
    .then(t => {
        translation = t;

        document.querySelectorAll(".settings_and_contacts__lang li").forEach(li => li.classList.remove("active"));
        const activeBtn = document.getElementById(currentLang);
        if (activeBtn) activeBtn.classList.add("active");

        loadContent(pageCategory, pageName, componentsList);
    })
    .catch(console.error);

function changeLang(newLang) {
    localStorage.setItem("currentLang", newLang);
    currentLang = newLang;

    document.querySelectorAll(".settings_and_contacts__lang li").forEach(li => li.classList.remove("active"));
    const activeBtn = document.getElementById(currentLang);
    if (activeBtn) activeBtn.classList.add("active");

    loadContent(pageCategory, pageName, componentsList);
}

function loadContent(pageCategory, pageName, componentsList) {
    let basePageContent = translation.pages?.[pageName] || {};
    let content = {};

    if (pageCategory === "static") {
        content = { ...basePageContent };
    } else if (pageCategory === "entry") {
        const urlParams = new URLSearchParams(window.location.search);
        const pageId = urlParams.get("id");

        const entryBlock = (pageId && basePageContent?.[pageId]) ? basePageContent[pageId] : {};
        content = { ...basePageContent, ...entryBlock };
    }

    if (Array.isArray(componentsList) && componentsList.length > 0) {
        componentsList.forEach(compName => {
            const comp = translation.components?.[compName];
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

        const targetAttr = el.getAttribute("data-attr");
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