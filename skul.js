// ============================================
// ANIMASI SCROLL REVEAL
// ============================================
const observerOptions = {
  threshold: 0.15,
  rootMargin: "0px 0px -80px 0px",
};

const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0) scale(1)";
        entry.target.style.filter = "blur(0)";
      }, index * 100);
      scrollObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

// Fungsi untuk menambahkan animasi scroll reveal
function initScrollReveal() {
  const elementsToAnimate = document.querySelectorAll(
    ".card, .fasilitas, .ekskul, .teacher-card, .info-item"
  );

  elementsToAnimate.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(40px) scale(0.96)";
    el.style.filter = "blur(4px)";
    el.style.transition = "all 0.7s cubic-bezier(0.23, 1, 0.32, 1)";
    scrollObserver.observe(el);
  });
}

// ============================================
// PARALLAX EFFECT PADA HERO SECTION
// ============================================
function initParallax() {
  const hero = document.querySelector(".hero");
  if (!hero) return;

  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset;
    const rate = scrolled * 0.5;
    hero.style.backgroundPositionY = `${rate}px`;
  });
}

// ============================================
// ANIMASI COUNTER UNTUK ANGKA
// ============================================
function animateCounter(element, target, duration = 2000) {
  let current = 0;
  const increment = target / (duration / 16);
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    element.textContent = Math.floor(current) + "+";
  }, 16);
}

// ============================================
// TYPING EFFECT PADA HERO TEXT
// ============================================
function initTypingEffect() {
  const heroP = document.querySelector(".hero-text p");
  if (!heroP) return;

  const originalText = heroP.textContent;
  heroP.textContent = "";
  heroP.style.opacity = "1";

  let charIndex = 0;
  const typingSpeed = 50;

  function typeChar() {
    if (charIndex < originalText.length) {
      heroP.textContent += originalText.charAt(charIndex);
      charIndex++;
      setTimeout(typeChar, typingSpeed);
    }
  }

  setTimeout(typeChar, 500);
}

// ============================================
// SMOOTH SCROLL DENGAN OFFSET UNTUK HEADER
// ============================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href === "#" || href === "#beranda") return;

      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const headerHeight =
          document.querySelector(".site-header").offsetHeight;
        const targetPosition = target.offsetTop - headerHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });
}

// ============================================
// ACTIVE NAVIGATION LINK SAAT SCROLL
// ============================================
function initActiveNavigation() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-list a");

  window.addEventListener("scroll", () => {
    let current = "";
    const scrollPosition = window.pageYOffset + 200;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.style.color = "";
      link.style.fontWeight = "";
      if (link.getAttribute("href") === `#${current}`) {
        link.style.color = "#fae20a";
        link.style.fontWeight = "800";
      }
    });
  });
}

// ============================================
// HOVER EFFECT 3D PADA CARDS
// ============================================
function init3DCardEffect() {
  const cards = document.querySelectorAll(
    ".card, .teacher-card, .fasilitas, .ekskul"
  );

  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}

// ============================================
// LOADING ANIMATION
// ============================================
function initLoadingAnimation() {
  window.addEventListener("load", () => {
    document.body.style.opacity = "0";
    setTimeout(() => {
      document.body.style.transition = "opacity 0.5s ease";
      document.body.style.opacity = "1";
    }, 100);
  });
}

// ============================================
// LAZY LOADING IMAGES
// ============================================
function initLazyLoading() {
  const images = document.querySelectorAll("img[src]");

  const imageObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.style.opacity = "0";
          img.style.transition = "opacity 0.5s ease";

          setTimeout(() => {
            img.style.opacity = "1";
          }, 100);

          imageObserver.unobserve(img);
        }
      });
    },
    { threshold: 0.1 }
  );

  images.forEach((img) => imageObserver.observe(img));
}

// ============================================
// SCROLL PROGRESS BAR
// ============================================
function initScrollProgress() {
  const progressBar = document.createElement("div");
  progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 0%;
    height: 4px;
    background: linear-gradient(90deg, #3ed343, #fae20a);
    z-index: 9999;
    transition: width 0.1s ease;
    box-shadow: 0 2px 8px rgba(62, 211, 67, 0.5);
  `;
  document.body.appendChild(progressBar);

  window.addEventListener("scroll", () => {
    const windowHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    const scrolled = (window.pageYOffset / windowHeight) * 100;
    progressBar.style.width = scrolled + "%";
  });
}

// ============================================
// ANIMASI TEKS KEPALA SEKOLAH
// ============================================
function initKepalaSectionAnimation() {
  const kepalaContent = document.querySelector(".kepala-content");
  if (!kepalaContent) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const children = entry.target.children;
          Array.from(children).forEach((child, index) => {
            child.style.opacity = "0";
            child.style.transform = "translateX(-40px)";
            child.style.transition = "all 0.6s cubic-bezier(0.23, 1, 0.32, 1)";

            setTimeout(() => {
              child.style.opacity = "1";
              child.style.transform = "translateX(0)";
            }, index * 150);
          });
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  observer.observe(kepalaContent);
}

// ============================================
// EASTER EGG: KLIK LOGO 5X
// ============================================
function initEasterEgg() {
  const logo = document.querySelector(".img_sekul");
  let clickCount = 0;
  let timer;

  logo.addEventListener("click", () => {
    clickCount++;
    clearTimeout(timer);

    if (clickCount === 5) {
      document.body.style.animation = "rainbow 3s linear";
      setTimeout(() => {
        document.body.style.animation = "";
        clickCount = 0;
      }, 3000);
    }

    timer = setTimeout(() => {
      clickCount = 0;
    }, 2000);
  });
}

// ============================================
// INISIALISASI SEMUA FUNGSI
// ============================================
document.addEventListener("DOMContentLoaded", () => {
  initLoadingAnimation();
  initScrollReveal();
  initParallax();
  initTypingEffect();
  initSmoothScroll();
  initActiveNavigation();
  init3DCardEffect();
  initLazyLoading();
  initScrollProgress();
  initKepalaSectionAnimation();
  initEasterEgg();

  console.log("🎓 Website MA Al-Islam Jamsaren siap digunakan!");
});

// ============================================
// ANIMASI SAAT RESIZE WINDOW
// ============================================
let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    console.log("Window resized - recalculating animations");
  }, 250);
});
