document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector(".header");
    const nav = document.querySelector(".nav");
    const navToggle = document.querySelector(".nav-toggle");
    const navMenu = document.querySelector(".nav-menu");
    const navLinks = document.querySelectorAll(".nav-menu a");
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // --- Menu de Navegação e Acessibilidade ---
    if (navToggle && navMenu) {
        // Adiciona ARIA para acessibilidade
        if (!navMenu.id) navMenu.id = "primary-menu";
        navToggle.setAttribute("aria-controls", navMenu.id);
        navToggle.setAttribute("aria-expanded", "false");

        const openMenu = () => {
            navToggle.classList.add("active");
            navMenu.classList.add("active");
            navToggle.setAttribute("aria-expanded", "true");
            document.body.style.overflow = "hidden"; // Trava o scroll em mobile
        };

        const closeMenu = () => {
            navToggle.classList.remove("active");
            navMenu.classList.remove("active");
            navToggle.setAttribute("aria-expanded", "false");
            document.body.style.overflow = "";
        };

        navToggle.addEventListener("click", () => {
            const isOpen = navMenu.classList.contains("active");
            isOpen ? closeMenu() : openMenu();
        });

        navLinks.forEach((link) => {
            link.addEventListener("click", () => closeMenu());
        });

        document.addEventListener("click", (e) => {
            const clickedInsideNav = nav.contains(e.target);
            const isOpen = navMenu.classList.contains("active");
            if (isOpen && !clickedInsideNav) closeMenu();
        });

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") closeMenu();
        });
    }

    // --- Smooth Scroll com Offset do Header ---
    const getHeaderHeight = () => (header ? header.offsetHeight : 0);

    const smoothScrollTo = (targetEl) => {
        const headerH = getHeaderHeight();
        const targetY = targetEl.getBoundingClientRect().top + window.pageYOffset - headerH - 8;
        if (prefersReducedMotion) {
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

    // --- Header com Sombra ao Rolar ---
    const onScroll = () => {
        if (header) {
            if (window.scrollY > 4) {
                header.classList.add("scrolled");
            } else {
                header.classList.remove("scrolled");
            }
        }
    };
    window.addEventListener("scroll", onScroll);
    onScroll();

    // --- Animação de Surgir e Sumir das Seções com Intersection Observer ---
    const sections = document.querySelectorAll("section");
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                } else {
                    // Adiciona a regra para remover a classe quando a seção não estiver visível
                    entry.target.classList.remove("visible");
                }
            });
        }, {
            // Gatilho de visibilidade: 15% da seção precisa estar visível
            threshold: 0.15
        }
    );
    sections.forEach((section) => {
        observer.observe(section);
    });

    // --- Carrossel de Imagens ---
    document.querySelectorAll(".carousel-container").forEach((container) => {
        const track = container.querySelector(".carousel-track");
        const slides = Array.from(track.children);
        const nextButton = container.querySelector(".carousel-button.next");
        const prevButton = container.querySelector(".carousel-button.prev");
        let currentSlide = 0;
        let isAnimating = false; // Flag para evitar cliques múltiplos

        const updateTrackPosition = () => {
            const slideWidth = slides[0].getBoundingClientRect().width;
            track.style.transform = `translateX(-${slideWidth * currentSlide}px)`;
        };

        const goToSlide = (slideIndex) => {
            if (isAnimating) return;
            isAnimating = true;
            currentSlide = slideIndex;
            updateTrackPosition();
            setTimeout(() => {
                isAnimating = false;
            }, 500); // tempo da transição em CSS
        };

        const moveToNextSlide = () => {
            let nextIndex = (currentSlide + 1) % slides.length;
            goToSlide(nextIndex);
        };

        const moveToPrevSlide = () => {
            let prevIndex = (currentSlide - 1 + slides.length) % slides.length;
            goToSlide(prevIndex);
        };

        if (nextButton) nextButton.addEventListener("click", moveToNextSlide);
        if (prevButton) prevButton.addEventListener("click", moveToPrevSlide);
        
        window.addEventListener("resize", updateTrackPosition);
        updateTrackPosition();
    });
});