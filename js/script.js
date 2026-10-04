// ================= NAVBAR ACTIVE =================

const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("section");

window.addEventListener("scroll", function () {
  let current = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 150;
    const sectionHeight = section.offsetHeight;

    if (
      window.scrollY >= sectionTop &&
      window.scrollY < sectionTop + sectionHeight
    ) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");

    if (link.getAttribute("href") === "#" + current) {
      link.classList.add("active");
    }
  });
});

// ================= PROJECT MODAL =================

const projectData = {
  1: {
    title: "Website Rekomendasi Laptop",
    category: "Website",
    icon: "bi-laptop",
    description:
      "Website yang dibuat untuk membantu pengguna mencari laptop berdasarkan kebutuhan dan budget yang dimiliki.",
    technology: "HTML, CSS, JavaScript, Bootstrap",
    feature:
      "Pilihan kategori kebutuhan, input budget, rekomendasi laptop, dan tampilan responsive.",
  },

  2: {
    title: "Aplikasi Wisata Desa",
    category: "Mobile App",
    icon: "bi-geo-alt",
    description:
      "Aplikasi informasi wisata yang dibuat untuk menampilkan berbagai destinasi dan informasi mengenai desa.",
    technology: "Flutter, Dart, Node.js, MySQL",
    feature: "Informasi wisata, detail wisata, berita, laporan, dan statistik.",
  },

  3: {
    title: "Aplikasi Monitoring Sampah",
    category: "UI/UX",
    icon: "bi-recycle",
    description:
      "Konsep aplikasi yang dirancang untuk membantu proses monitoring dan pengelolaan sampah.",
    technology: "Figma, UI/UX",
    feature:
      "Perancangan tampilan, user flow, halaman monitoring, dan konsep pengelolaan data sampah.",
  },
};

function showProject(id) {
  const project = projectData[id];

  document.getElementById("modalTitle").textContent = project.title;

  document.getElementById("modalCategory").textContent = project.category;

  document.getElementById("modalDescription").textContent = project.description;

  document.getElementById("modalTechnology").textContent = project.technology;

  document.getElementById("modalFeature").textContent = project.feature;

  document.getElementById("modalIcon").innerHTML =
    `<i class="bi ${project.icon}"></i>`;

  document.getElementById("projectModal").classList.add("show");
}

function closeProject() {
  document.getElementById("projectModal").classList.remove("show");
}

window.addEventListener("click", function (event) {
  const modal = document.getElementById("projectModal");

  if (event.target === modal) {
    closeProject();
  }
});

// ================= ABOUT NAME TAG =================

const aboutSection = document.getElementById("about");
const aboutNameTag = document.getElementById("aboutNameTag");
const nameTagCard = document.getElementById("nameTagCard");
const nameTagRope = document.getElementById("nameTagRope");
const ropePath = document.getElementById("ropePath");
// ================= PHYSICS =================

let posX = 0;
let posY = 0;

let velocityX = 0;
let velocityY = 0;

let dragging = false;

let animationFrame = null;

let pointerId = null;

let grabOffsetX = 0;
let grabOffsetY = 0;

let lastPointerX = 0;
let lastPointerY = 0;
let lastTime = 0;

// ================= POSISI DASAR NAME TAG =================
// Mengikuti ukuran CSS secara otomatis

function getNameTagBasePosition() {
  if (!aboutNameTag || !nameTagCard) {
    return {
      centerX: 0,
      cardTop: 0,
      width: 0,
      height: 0,
    };
  }

  const wrapperWidth = aboutNameTag.offsetWidth;
  const wrapperHeight = aboutNameTag.offsetHeight;

  const centerX = wrapperWidth / 2;

  const cardStyle = window.getComputedStyle(nameTagCard);

  const cardTop = parseFloat(cardStyle.top) || 0;

  // SVG mengikuti ukuran wrapper secara otomatis
  if (nameTagRope) {
    nameTagRope.setAttribute("viewBox", `0 0 ${wrapperWidth} ${wrapperHeight}`);
  }

  return {
    centerX: centerX,
    cardTop: cardTop,
    width: wrapperWidth,
    height: wrapperHeight,
  };
}

// ================= UPDATE NAME TAG =================

function updateNameTag() {
  if (!nameTagCard || !ropePath || !nameTagRope) return;

  const base = getNameTagBasePosition();

  const centerX = base.centerX;
  const cardTop = base.cardTop;

  // Posisi ujung tali selalu mengikuti bagian atas kartu
  const endX = centerX + posX;
  const endY = cardTop + posY;

  // Membuat tali melengkung mengikuti pergerakan kartu
  const control1X = centerX + posX * 0.1;
  const control1Y = cardTop * 0.3 + posY * 0.1;

  const control2X = centerX + posX * 0.65;
  const control2Y = cardTop * 0.72 + posY * 0.65;

  ropePath.setAttribute(
    "d",
    `M${centerX} 0
     C${control1X} ${control1Y},
      ${control2X} ${control2Y},
      ${endX} ${endY}`,
  );

  // Kemiringan kartu mengikuti arah gerakan tali
  const ropeAngle =
    Math.atan2(posX, Math.max(100, cardTop + posY)) * (180 / Math.PI);

  const movementAngle = velocityX * 0.8;

  const rotation = ropeAngle * 0.85 + movementAngle;

  nameTagCard.style.transform = `
    translate(
      calc(-50% + ${posX}px),
      ${posY}px
    )
    rotate(${rotation}deg)
  `;
}

// ================= MULAI TARIK =================

function startDrag(event) {
  if (!nameTagCard || !aboutNameTag) {
    return;
  }

  dragging = true;

  pointerId = event.pointerId;

  nameTagCard.classList.add("dragging");

  if (nameTagCard.setPointerCapture) {
    nameTagCard.setPointerCapture(pointerId);
  }

  // Hentikan animasi sebelumnya

  if (animationFrame) {
    cancelAnimationFrame(animationFrame);

    animationFrame = null;
  }

  // Posisi kartu sekarang

  const cardRect = nameTagCard.getBoundingClientRect();

  const cardCenterX = cardRect.left + cardRect.width / 2;

  const cardTopY = cardRect.top;

  grabOffsetX = event.clientX - cardCenterX;

  grabOffsetY = event.clientY - cardTopY;

  lastPointerX = event.clientX;

  lastPointerY = event.clientY;

  lastTime = performance.now();

  velocityX = 0;
  velocityY = 0;

  event.preventDefault();
}

// ================= SAAT DITARIK =================

function moveDrag(event) {
  if (!dragging) {
    return;
  }

  if (event.pointerId !== pointerId) {
    return;
  }

  const now = performance.now();

  const deltaTime = Math.max(8, now - lastTime);

  // Kecepatan gerakan

  velocityX = ((event.clientX - lastPointerX) / deltaTime) * 16;

  velocityY = ((event.clientY - lastPointerY) / deltaTime) * 16;

  lastPointerX = event.clientX;

  lastPointerY = event.clientY;

  lastTime = now;

  // Posisi wrapper

  const wrapperRect = aboutNameTag.getBoundingClientRect();

  const base = getNameTagBasePosition();

  // Titik gantung

  const anchorX = wrapperRect.left + base.centerX;

  const anchorY = wrapperRect.top + base.cardTop;

  // Posisi kartu mengikuti pointer

  posX = event.clientX - grabOffsetX - anchorX;

  posY = event.clientY - grabOffsetY - anchorY;

  updateNameTag();
}

// ================= SELESAI TARIK =================

function endDrag(event) {
  if (!dragging) {
    return;
  }

  if (event && event.pointerId !== pointerId) {
    return;
  }

  dragging = false;

  pointerId = null;

  nameTagCard.classList.remove("dragging");

  // Kartu kembali dengan momentum

  startSwing();
}

// ================= GERAKAN PEGAS =================

function startSwing() {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame);
  }

  let lastFrame = performance.now();

  function animate() {
    if (dragging) {
      return;
    }

    const now = performance.now();

    let dt = (now - lastFrame) / 1000;

    lastFrame = now;

    // Menjaga physics tetap stabil

    dt = Math.min(dt, 0.035);

    // ================= PEGAS =================

    const stiffness = 32;

    const damping = 7;

    const forceX = -stiffness * posX - damping * velocityX;

    const forceY = -stiffness * posY - damping * velocityY;

    velocityX += forceX * dt;

    velocityY += forceY * dt;

    posX += velocityX * dt;

    posY += velocityY * dt;

    updateNameTag();

    // ================= BERHENTI =================

    if (
      Math.abs(posX) < 0.4 &&
      Math.abs(posY) < 0.4 &&
      Math.abs(velocityX) < 0.4 &&
      Math.abs(velocityY) < 0.4
    ) {
      posX = 0;
      posY = 0;

      velocityX = 0;
      velocityY = 0;

      updateNameTag();

      animationFrame = null;

      return;
    }

    animationFrame = requestAnimationFrame(animate);
  }

  animationFrame = requestAnimationFrame(animate);
}

// ================= POINTER EVENT =================

if (nameTagCard) {
  nameTagCard.addEventListener("pointerdown", startDrag);
}

window.addEventListener("pointermove", moveDrag);

window.addEventListener("pointerup", endDrag);

window.addEventListener("pointercancel", endDrag);

// ================= ABOUT OBSERVER =================

const aboutObserver = new IntersectionObserver(
  function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        // Reset posisi

        posX = 0;
        posY = 0;

        velocityX = 0;
        velocityY = 0;

        if (animationFrame) {
          cancelAnimationFrame(animationFrame);

          animationFrame = null;
        }

        updateNameTag();

        aboutNameTag.classList.add("show");
      } else {
        aboutNameTag.classList.remove("show");
      }
    });
  },
  {
    threshold: 0.25,
  },
);

if (aboutSection && aboutNameTag) {
  aboutObserver.observe(aboutSection);
}

// ================= ESC UNTUK MODAL =================

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closeProject();
  }
});
