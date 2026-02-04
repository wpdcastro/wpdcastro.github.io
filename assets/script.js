// script.js
(() => {
  "use strict";

  // ===== Helpers =====
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const setText = (sel, value) => {
    const el = $(sel);
    if (el && value != null) el.textContent = String(value);
  };

  const setHTML = (sel, value) => {
    const el = $(sel);
    if (el && value != null) el.innerHTML = String(value);
  };

  const setHref = (sel, href) => {
    const el = $(sel);
    if (el && href) el.href = href;
  };

  // ===== Configs =====
  const CONFIG = window.CONFIG || {
    spotifyUrl: "#",
    appleUrl: "#",
    ytMusicUrl: "#"
  };

  const TRANSLATIONS = window.TRANSLATIONS || null;

  // ===== Render: streaming =====
  function renderStreaming() {
    setHref("#spotifyBtn", CONFIG.spotifyUrl);
    setHref("#appleBtn", CONFIG.appleUrl);
    setHref("#ytMusicBtn", CONFIG.ytMusicUrl);
  }

  // ===== Reveal (data-reveal) =====
  function initReveal() {
    const nodes = $$("[data-reveal]");
    if (!nodes.length) return;

    if (!("IntersectionObserver" in window)) {
      nodes.forEach((n) => n.classList.add("show"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("show");
        });
      },
      { threshold: 0.12 }
    );

    nodes.forEach((n) => io.observe(n));
  }

  // ===== Multilíngue =====
  function setLang(lang) {
    if (!TRANSLATIONS) return;

    const t = TRANSLATIONS[lang] || TRANSLATIONS["pt-BR"];
    if (!t) return;

    // Atualizar idioma da página
    document.documentElement.lang = lang === "en-US" ? "en" : lang;

    // Nav
    if (Array.isArray(t.nav)) {
      const links = $$("a", $("#mainNav"));
      links.forEach((a, i) => {
        if (t.nav[i]) a.textContent = t.nav[i];
      });
    }

    // Hero
    setText(".kicker", t.kicker);
    setHTML(".ritualLine", t.heroLine);

    // Glades
    setText("#glades .ep-title", t.gladesTitle);
    setHTML("#glades .ep-desc", t.gladesDescHtml);

    // Single
    setText(".single-kicker", t.newSingleKicker);
    setText(".single-title", t.newSingleTitle);
    setText(".single-pill", t.watchNow);

    // Videos
    setText("#videos h3", t.videosTitle);
    setText("#videos .titleRow p", t.videosDesc);
    setText("#videos .videoMain small", t.featured);

    // Merch
    setText("#merch h3", t.merchTitle);
    setText("#merch .titleRow p", t.merchDesc);
    
    // Merch items - labels
    const merchSmalls = $$("#merchGrid .card small");
    if (merchSmalls[0]) merchSmalls[0].textContent = t.limitedEdition;
    if (merchSmalls[1]) merchSmalls[1].textContent = t.limitedEdition;
    if (merchSmalls[2]) merchSmalls[2].textContent = t.preOrder;

    // Botões Comprar
    $$("#merchGrid .btn.primary").forEach((btn) => {
      btn.textContent = t.comprarBtn;
    });

    // Tour
    setText("#tour h3", t.tourTitle);
    setText(".tour-foot .pill", t.tourInfo);
    setText("#tour .tag.past", t.done);
    
    // Atualizar tour cards "Em Breve"
    $$(".tour-card:not(.is-past) .tour-info small").forEach((el) => {
      if (el.textContent.includes("Em Breve") || el.textContent.includes("Coming Soon") || el.textContent.includes("Próximamente")) {
        el.textContent = lang === "pt-BR" ? "Em Breve · ??" : lang === "en-US" ? "Coming Soon · ??" : "Próximamente · ??";
      }
    });

    $$(".tour-card:not(.is-past) .tour-info h4").forEach((el) => {
      el.textContent = t.comingSoon;
    });

    $$(".tour-card:not(.is-past) .tour-info p").forEach((el) => {
      el.textContent = t.theGladesTour;
    });

    // Footer
    setText(".footer-dev", t.developedBy);
  }

  // ===== Custom Select =====
  function initLangSelect() {
    const select = $("#langSelect");
    const customSelect = $("#customSelect");
    const trigger = $(".select-trigger", customSelect);
    const optionsContainer = $(".select-options", customSelect);
    const options = $$(".select-option", customSelect);
    const selectValue = $(".select-value", trigger);

    if (!select || !customSelect) return;

    setLang(select.value);
    updateCustomSelectDisplay(select.value);

    trigger.addEventListener("click", () => {
      customSelect.classList.toggle("open");
      optionsContainer.toggleAttribute("hidden");
    });

    document.addEventListener("click", (e) => {
      if (!customSelect.contains(e.target)) {
        customSelect.classList.remove("open");
        optionsContainer.setAttribute("hidden", "");
      }
    });

    options.forEach((option) => {
      option.addEventListener("click", () => {
        const value = option.dataset.value;
        select.value = value;
        updateCustomSelectDisplay(value);
        customSelect.classList.remove("open");
        optionsContainer.setAttribute("hidden", "");
        setLang(value);
      });
    });

    select.addEventListener("change", (e) => {
      updateCustomSelectDisplay(e.target.value);
      setLang(e.target.value);
    });

    function updateCustomSelectDisplay(value) {
      selectValue.textContent = $$(".select-option", customSelect).find(
        (opt) => opt.dataset.value === value
      )?.textContent || "Português";

      options.forEach((opt) => {
        opt.classList.toggle("selected", opt.dataset.value === value);
      });
    }
  }

  // ===== Year =====
  function renderYear() {
    setText("#year", new Date().getFullYear());
  }

  // ===== Boot =====
  function boot() {
    renderStreaming();
    renderYear();
    initReveal();
    initLangSelect();
  }

  document.addEventListener("DOMContentLoaded", boot);
})();

// ===== HAMBURGER MENU =====
(function() {
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");
  const menuLinks = mobileMenu?.querySelectorAll("a");

  if (!hamburger || !mobileMenu) return;

  // Toggle menu
  hamburger.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.contains("show");
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Fechar menu ao clicar em um link
  menuLinks?.forEach((link) => {
    link.addEventListener("click", () => {
      closeMenu();
    });
  });

  // Fechar menu ao clicar fora
  document.addEventListener("click", (e) => {
    if (
      !hamburger.contains(e.target) &&
      !mobileMenu.contains(e.target)
    ) {
      closeMenu();
    }
  });

  // Fechar menu ao pressionar Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeMenu();
    }
  });

  function openMenu() {
    mobileMenu.classList.add("show");
    mobileMenu.setAttribute("aria-hidden", "false");
    hamburger.classList.add("active");
    hamburger.setAttribute("aria-expanded", "true");
  }

  function closeMenu() {
    mobileMenu.classList.remove("show");
    mobileMenu.setAttribute("aria-hidden", "true");
    hamburger.classList.remove("active");
    hamburger.setAttribute("aria-expanded", "false");
  }
})();
