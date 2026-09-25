document.addEventListener("DOMContentLoaded", () => {
    /* STICKY HEADER */
    const siteHeader = document.querySelector(".site-header");
    let headerTicking = false;

    function updateHeaderState() {
        siteHeader?.classList.toggle("is-scrolled", window.scrollY > 28);
        headerTicking = false;
    }

    updateHeaderState();
    window.addEventListener("scroll", () => {
        if (headerTicking) return;
        headerTicking = true;
        window.requestAnimationFrame(updateHeaderState);
    }, { passive: true });

    window.addEventListener("hashchange", updateHeaderState);

    /* MOBILE NAV */
    const mobileToggle = document.querySelector(".mobile-menu-toggle");
    const mobileNav = document.querySelector("#mobileNav");

    function closeMobileNav() {
        siteHeader?.classList.remove("menu-open");
        mobileNav?.classList.remove("is-open");
        mobileToggle?.setAttribute("aria-expanded", "false");
        mobileToggle?.setAttribute("aria-label", "Abrir menu");
    }

    mobileToggle?.addEventListener("click", () => {
        const isOpen = siteHeader?.classList.toggle("menu-open") ?? false;
        mobileNav?.classList.toggle("is-open", isOpen);
        mobileToggle.setAttribute("aria-expanded", String(isOpen));
        mobileToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
    });

    mobileNav?.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeMobileNav);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") closeMobileNav();
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 800) closeMobileNav();
    });

    /* HERO */
    const slides = [...document.querySelectorAll(".hero-slide")];
    const dots = [...document.querySelectorAll(".hero-dot")];
    const prev = document.querySelector(".hero-prev");
    const next = document.querySelector(".hero-next");
    const counter = document.querySelector(".hero-counter strong");

    let current = 0;
    let timer;

    function showSlide(index) {
        current = (index + slides.length) % slides.length;
        slides.forEach((slide, i) => slide.classList.toggle("is-active", i === current));
        dots.forEach((dot, i) => dot.classList.toggle("is-active", i === current));
        if (counter) counter.textContent = String(current + 1).padStart(2, "0");
    }

    function restartTimer() {
        window.clearInterval(timer);
        timer = window.setInterval(() => showSlide(current + 1), 6500);
    }

    prev?.addEventListener("click", () => {
        showSlide(current - 1);
        restartTimer();
    });

    next?.addEventListener("click", () => {
        showSlide(current + 1);
        restartTimer();
    });

    dots.forEach((dot) => {
        dot.addEventListener("click", () => {
            showSlide(Number(dot.dataset.target));
            restartTimer();
        });
    });

    restartTimer();

    /* PORTFOLIO CAROUSEL */
    const portfolioStage = document.querySelector("#portfolioStage");
    const portfolioPrev = document.querySelector(".portfolio-slide-prev");
    const portfolioNext = document.querySelector(".portfolio-slide-next");
    const portfolioCurrent = document.querySelector("#portfolioCurrent");
    const portfolioTotal = document.querySelector("#portfolioTotal");
    const portfolioProgressFill = document.querySelector("#portfolioProgressFill");
    let portfolioCards = [...document.querySelectorAll(".portfolio-card")];

    const portfolioItems = [
        { src: "assets/make_1.jpg", alt: "Produção de maquiagem", label: "Maquiagem profissional" },
        { src: "assets/make_2.webp", alt: "Produção de maquiagem", label: "Maquiagem profissional" },
        { src: "assets/make_3.webp", alt: "Produção de maquiagem", label: "Maquiagem profissional" },
        { src: "assets/make_5.webp", alt: "Produção de maquiagem", label: "Maquiagem profissional" },
        { src: "assets/make_6.webp", alt: "Produção de maquiagem", label: "Maquiagem profissional" },
        { src: "assets/debutante_1.webp", alt: "Produção para debutante", label: "Debutante" },
        { src: "assets/noiva_1.jfif", alt: "Produção de noiva", label: "Noivas" },
        { src: "assets/noiva_2.webp", alt: "Produção de noiva", label: "Noivas" }
    ];

    let portfolioIndex = 0;
    let portfolioTimer;
    let portfolioAnimating = false;

    function wrapIndex(index) {
        return (index + portfolioItems.length) % portfolioItems.length;
    }

    function setCardContent(card, item) {
        const image = card?.querySelector("img");
        if (!image) return;
        image.src = item.src;
        image.alt = item.alt;
        let caption = card.querySelector("figcaption");
        if (!caption) {
            caption = document.createElement("figcaption");
            caption.className = "portfolio-main-caption";
            card.appendChild(caption);
        }
        caption.textContent = item.label;
    }

    function setCaptionVisibility(activeCard) {
        portfolioCards.forEach((card) => {
            const caption = card.querySelector("figcaption");
            if (caption) caption.hidden = card !== activeCard;
        });
    }

    function updatePortfolioMeta() {
        if (portfolioCurrent) portfolioCurrent.textContent = String(portfolioIndex + 1).padStart(2, "0");
        if (portfolioTotal) portfolioTotal.textContent = String(portfolioItems.length).padStart(2, "0");
        if (portfolioProgressFill) portfolioProgressFill.style.width = `${((portfolioIndex + 1) / portfolioItems.length) * 100}%`;
    }

    function setPosition(card, offset) {
        card.classList.remove("pos--3", "pos--2", "pos--1", "pos-0", "pos-1", "pos-2", "pos-3", "is-entering");
        card.classList.add(offset === 0 ? "pos-0" : `pos-${offset}`);
    }

    function renderPortfolio() {
        portfolioCards.forEach((card, i) => {
            setPosition(card, i - 2);
        });

        portfolioCards.forEach((card, i) => {
            const item = portfolioItems[wrapIndex(portfolioIndex + i - 2)];
            setCardContent(card, item);
        });

        setCaptionVisibility(portfolioCards[2]);
        updatePortfolioMeta();
    }

    function movePortfolio(direction) {
        if (portfolioAnimating) return;
        portfolioAnimating = true;
        window.clearInterval(portfolioTimer);

        if (direction > 0) {
            portfolioCards.forEach((card, i) => {
                const oldOffset = i - 2;
                setPosition(card, oldOffset === -2 ? -3 : oldOffset - 1);
            });
        } else {
            portfolioCards.forEach((card, i) => {
                const oldOffset = i - 2;
                setPosition(card, oldOffset === 2 ? 3 : oldOffset + 1);
            });
        }

        window.setTimeout(() => {
            portfolioIndex = wrapIndex(portfolioIndex + direction);

            if (direction > 0) {
                // The old far-left card is recycled as the new far-right card.
                const recycled = portfolioCards.shift();
                setCardContent(recycled, portfolioItems[wrapIndex(portfolioIndex + 2)]);
                setPosition(recycled, 2);
                recycled.classList.add("is-entering");
                portfolioCards.push(recycled);
            } else {
                // The old far-right card is recycled as the new far-left card.
                const recycled = portfolioCards.pop();
                setCardContent(recycled, portfolioItems[wrapIndex(portfolioIndex - 2)]);
                setPosition(recycled, -2);
                recycled.classList.add("is-entering");
                portfolioCards.unshift(recycled);
            }

            setCaptionVisibility(portfolioCards[2]);
            updatePortfolioMeta();

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    portfolioCards.forEach((card) => card.classList.remove("is-entering"));
                });
            });

            window.setTimeout(() => {
                portfolioAnimating = false;
                restartPortfolioTimer();
            }, 100);
        }, 720);
    }

    function restartPortfolioTimer() {
        window.clearInterval(portfolioTimer);
        portfolioTimer = window.setInterval(() => movePortfolio(1), 5600);
    }

    portfolioPrev?.addEventListener("click", () => movePortfolio(-1));
    portfolioNext?.addEventListener("click", () => movePortfolio(1));

    portfolioStage?.addEventListener("mouseenter", () => window.clearInterval(portfolioTimer));
    portfolioStage?.addEventListener("mouseleave", restartPortfolioTimer);

    let pointerStartX = null;
    portfolioStage?.addEventListener("pointerdown", (event) => {
        pointerStartX = event.clientX;
        portfolioStage.setPointerCapture?.(event.pointerId);
    });

    portfolioStage?.addEventListener("pointerup", (event) => {
        if (pointerStartX === null) return;
        const distance = event.clientX - pointerStartX;
        if (Math.abs(distance) > 45) movePortfolio(distance < 0 ? 1 : -1);
        pointerStartX = null;
    });

    portfolioStage?.addEventListener("pointercancel", () => { pointerStartX = null; });

    renderPortfolio();
    restartPortfolioTimer();
});
