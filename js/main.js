// ============ مركز القادة - السكربت ============

// رقم واتساب المركز بالصيغة الدولية (0789898201)
const WHATSAPP_NUMBER = "962789898201";

document.addEventListener("DOMContentLoaded", () => {
  // السنة في الفوتر
  document.getElementById("year").textContent = new Date().getFullYear();

  // كل أزرار واتساب (class="js-wa")
  document.querySelectorAll(".js-wa").forEach(a => {
    const text = a.dataset.msg || "مرحباً، أرغب بالاستفسار عن خدمات مركز القادة";
    a.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    a.target = "_blank"; a.rel = "noopener";
  });

  // ===== شاشة التحميل =====
  window.addEventListener("load", () => {
    setTimeout(() => document.getElementById("preloader").classList.add("hide"), 500);
  });

  // ===== شريط التنقل عند السكرول =====
  const nav = document.getElementById("mainNav");
  const toTop = document.getElementById("toTop");
  const onScroll = () => {
    nav.classList.toggle("scrolled", window.scrollY > 60);
    toTop.classList.toggle("show", window.scrollY > 500);
  };
  window.addEventListener("scroll", onScroll);
  onScroll();
  toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  // ===== تمييز الرابط النشط =====
  const links = document.querySelectorAll(".navbar .nav-link");
  const sections = [...links].map(l => document.querySelector(l.getAttribute("href")));
  window.addEventListener("scroll", () => {
    let current = 0;
    sections.forEach((s, i) => { if (s && s.getBoundingClientRect().top < 140) current = i; });
    links.forEach((l, i) => l.classList.toggle("active", i === current));
  });

  // إغلاق قائمة الموبايل بعد الضغط
  links.forEach(l => l.addEventListener("click", () => {
    const menu = document.getElementById("navMenu");
    if (menu.classList.contains("show")) bootstrap.Collapse.getOrCreateInstance(menu).hide();
  }));

  // ===== ظهور العناصر تدريجياً =====
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll(".reveal").forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 0.1}s`;
    io.observe(el);
  });

  // ===== عدّاد الأرقام =====
  const counters = document.querySelectorAll(".counter");
  const cio = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target, target = +el.dataset.target, dur = 1800, start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / dur, 1);
        el.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * target);
        if (p < 1) requestAnimationFrame(tick); else el.textContent = target;
      };
      requestAnimationFrame(tick);
      cio.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => cio.observe(c));

  // ===== كتابة متحركة =====
  const words = ["الرياضيات", "اللغة الإنجليزية", "اللغة العربية", "بناء الثقة بالنفس", "تنظيم وقت الدراسة"];
  const typed = document.getElementById("typed");
  let w = 0, c = 0, deleting = false;
  (function type() {
    const word = words[w];
    typed.textContent = word.substring(0, c);
    if (!deleting && c < word.length) { c++; setTimeout(type, 110); }
    else if (!deleting) { deleting = true; setTimeout(type, 1600); }
    else if (c > 0) { c--; setTimeout(type, 55); }
    else { deleting = false; w = (w + 1) % words.length; setTimeout(type, 400); }
  })();

  // ===== جزيئات الخلفية =====
  const canvas = document.getElementById("particles");
  const ctx = canvas.getContext("2d");
  let W, H, pts = [];
  const resize = () => {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    pts = Array.from({ length: Math.min(70, Math.floor(W / 18)) }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - .5) * .4, vy: (Math.random() - .5) * .4, r: Math.random() * 2 + 1
    }));
  };
  resize();
  window.addEventListener("resize", resize);
  (function draw() {
    ctx.clearRect(0, 0, W, H);
    pts.forEach((p, i) => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(232,203,133,.7)"; ctx.fill();
      for (let j = i + 1; j < pts.length; j++) {
        const q = pts[j], d = Math.hypot(p.x - q.x, p.y - q.y);
        if (d < 120) {
          ctx.strokeStyle = `rgba(201,162,75,${.18 * (1 - d / 120)})`;
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
        }
      }
    });
    requestAnimationFrame(draw);
  })();

  // ===== نموذج التواصل → واتساب =====
  const form = document.getElementById("contactForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fields = ["name", "phone", "service"].map(id => document.getElementById(id));
    let ok = true;
    fields.forEach(f => {
      const valid = f.checkValidity() && f.value.trim() !== "";
      f.classList.toggle("is-invalid", !valid);
      if (!valid) ok = false;
    });
    if (!ok) return;
    const msg =
      `السلام عليكم، أنا ${fields[0].value}%0Aرقمي: ${fields[1].value}%0Aالطلب: ${fields[2].value}%0A` +
      encodeURIComponent(document.getElementById("message").value);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
    form.reset();
  });
});

// ===== تكبير صور المعرض =====
document.addEventListener("DOMContentLoaded", () => {
  const img = document.getElementById("lightboxImg");
  document.querySelectorAll(".g-item").forEach(a => a.addEventListener("click", () => {
    img.src = a.dataset.src; img.alt = a.dataset.alt;
  }));
});
