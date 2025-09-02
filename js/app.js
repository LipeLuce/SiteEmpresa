document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector(".header");
    const nav = document.querySelector(".nav");
    const navToggle = document.querySelector(".nav-toggle");
    const navMenu = document.querySelector(".nav-menu");
    const navLinks = document.querySelectorAll(".nav-menu a");

    if (!navToggle || !navMenu) return;

    // Acessibilidade: ARIA
    if (!navMenu.id) navMenu.id = "primary-menu";
    navToggle.setAttribute("aria-controls", navMenu.id);
    navToggle.setAttribute("aria-expanded", "false");

    const openMenu = () => {
        navToggle.classList.add("active");
        navMenu.classList.add("active");
        navToggle.setAttribute("aria-expanded", "true");
        document.body.style.overflow = "hidden"; // trava scroll do body em mobile
    };

    const closeMenu = () => {
        navToggle.classList.remove("active");
        navMenu.classList.remove("active");
        navToggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
    };

    // Toggle do menu
    navToggle.addEventListener("click", () => {
        const isOpen = navMenu.classList.contains("active");
        isOpen ? closeMenu() : openMenu();
    });

    // Fecha ao clicar em um link
    navLinks.forEach((link) => {
        link.addEventListener("click", () => closeMenu());
    });

    // Fecha ao clicar fora do menu
    document.addEventListener("click", (e) => {
        const clickedInsideNav = nav.contains(e.target);
        const isOpen = navMenu.classList.contains("active");
        if (isOpen && !clickedInsideNav) closeMenu();
    });

    // Fecha com ESC
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeMenu();
    });

    // Smooth scroll com offset do header
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const getHeaderHeight = () => (header ? header.offsetHeight : 0);

    const smoothScrollTo = (targetEl) => {
        const headerH = getHeaderHeight();
        const targetY = targetEl.getBoundingClientRect().top + window.pageYOffset - headerH - 8; // 8px de folga
        if (prefersReduced) {
            window.scrollTo(0, targetY);
        } else {
            window.scrollTo({ top: targetY, behavior: "smooth" });
        }
    };

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", (e) => {
            const id = anchor.getAttribute("href");
            if (!id || id === "#") return;
            const target = document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            smoothScrollTo(target);
        });
    });

    // Header “scrolled” para sombra mais forte ao rolar
    const onScroll = () => {
        if (!header) return;
        if (window.scrollY > 4) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    };
    window.addEventListener("scroll", onScroll);
    onScroll();

    // ================= CARROSSEL (SLIDER) =================
    document.querySelectorAll(".carousel-container").forEach((container) => {
        const track = container.querySelector(".carousel-track");
        const slides = Array.from(track.children);
        const nextButton = container.querySelector(".carousel-button.next");
        const prevButton = container.querySelector(".carousel-button.prev");
        let slideWidth = slides[0].getBoundingClientRect().width;
        let currentSlide = 0;

        // Ajusta a largura do slide em caso de redimensionamento
        const setSlideWidth = () => {
            slideWidth = slides[0].getBoundingClientRect().width;
            track.style.transform = `translateX(-${slideWidth * currentSlide}px)`;
        };

        window.addEventListener("resize", setSlideWidth);
        setSlideWidth(); // Define a largura inicial

        // Move para o próximo slide
        const moveToNextSlide = () => {
            currentSlide = (currentSlide + 1) % slides.length;
            track.style.transform = `translateX(-${slideWidth * currentSlide}px)`;
        };

        // Move para o slide anterior
        const moveToPrevSlide = () => {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            track.style.transform = `translateX(-${slideWidth * currentSlide}px)`;
        };

        nextButton.addEventListener("click", moveToNextSlide);
        prevButton.addEventListener("click", moveToPrevSlide);
    });
});