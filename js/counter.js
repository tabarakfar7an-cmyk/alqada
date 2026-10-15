// ============ عدّاد الزيارات والتسجيل ============
// يستخدم خدمة Abacus المجانية (بدون تسجيل). الأعداد تُعرض في الصفحة المخفية stats.html
// الأعداد تُحفظ على الخدمة نفسها، لذلك تجمع كل الزوار من كل الأجهزة.

const COUNTER_BASE = "https://abacus.jasoncameron.dev";
// اسم خاص بموقع المركز (3 - 64 حرفاً إنجليزياً/أرقام). غيّره إذا بدك تبدأ العدّ من الصفر.
const COUNTER_NS = "alqada-tarra-center-9x4k";

(function () {
  // لا نحتسب الزيارات أثناء التجربة على جهازك (ملف محلي أو localhost) إلا إذا أضفت ?track=1 للرابط
  if (/stats\.html$/.test(location.pathname)) return; // لا نحتسب زيارات صفحة الإحصائيات نفسها

  const isLocal = ["", "localhost", "127.0.0.1"].includes(location.hostname);
  const force = new URLSearchParams(location.search).has("track");
  if (isLocal && !force) return;

  const hit = (key) => {
    try {
      fetch(`${COUNTER_BASE}/hit/${COUNTER_NS}/${key}`, { keepalive: true, mode: "cors" }).catch(() => {});
    } catch (e) { /* تجاهل الأخطاء بصمت */ }
  };

  // 1) كل دخول للصفحة
  hit("visits");

  // 2) زائر جديد (مرة واحدة لكل متصفح)
  try {
    if (!localStorage.getItem("alqada_visitor")) {
      localStorage.setItem("alqada_visitor", "1");
      hit("visitors");
    }
  } catch (e) { /* التخزين غير متاح: نكتفي بعدّ الزيارات */ }

  // 3) الضغط على أي زر/رابط "سجّل الآن"
  let last = 0;
  document.addEventListener("click", (e) => {
    const el = e.target.closest("a, button");
    if (!el) return;
    const text = el.textContent.replace(/\s+/g, " ").trim();
    if (/^سج[ّ]?ل الآن/.test(text)) {
      const now = Date.now();
      if (now - last < 1500) return; // منع العدّ المزدوج السريع
      last = now;
      hit("register-clicks");
    }
  });

  // 4) إرسال نموذج التواصل
  const form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", () => {
      if (form.querySelector(".is-invalid")) return;
      const name = document.getElementById("name").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const service = document.getElementById("service").value;
      if (name && phone && service) hit("form-submits");
    });
  }
})();
