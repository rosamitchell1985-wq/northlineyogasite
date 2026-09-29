/* Northline Yoga — main.js */
(function () {
  "use strict";

  /* ---- Mobile menu ---- */
  var toggle = document.querySelector(".menu-toggle");
  var nav = document.getElementById("main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  /* ---- Text size controls ---- */
  var sizes = { small: "17px", medium: "19px", large: "21px", xlarge: "23px" };
  document.querySelectorAll("[data-textsize]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.documentElement.style.fontSize = sizes[btn.dataset.textsize] || "19px";
      try { localStorage.setItem("nly-textsize", btn.dataset.textsize); } catch (e) {}
    });
  });
  try {
    var saved = localStorage.getItem("nly-textsize");
    if (saved && sizes[saved]) document.documentElement.style.fontSize = sizes[saved];
  } catch (e) {}

  /* ---- Back to top ---- */
  var topBtn = document.querySelector(".back-top");
  if (topBtn) {
    window.addEventListener("scroll", function () {
      topBtn.classList.toggle("show", window.scrollY > 500);
    });
    topBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---- Checkout plan prefill from ?plan= ---- */
  var planSelect = document.getElementById("plan-select");
  if (planSelect) {
    var params = new URLSearchParams(location.search);
    var plan = params.get("plan");
    if (plan) {
      var opt = planSelect.querySelector('option[value="' + plan + '"]');
      if (opt) planSelect.value = plan;
    }
    updateSummary();
    planSelect.addEventListener("change", updateSummary);
  }

  function planPrice(v) {
    if (v === "monthly") return { name: "Monthly Membership", price: 9 };
    if (v === "yearly") return { name: "Annual Membership", price: 90 };
    return { name: "Monthly Membership", price: 9 };
  }

  function updateSummary() {
    var s = document.getElementById("order-summary");
    if (!s || !planSelect) return;
    var p = planPrice(planSelect.value);
    var today = p.price;
    s.innerHTML =
      '<div class="row"><span>' + p.name + "</span><span>$" + today.toFixed(2) + "</span></div>" +
      (planSelect.value === "yearly"
        ? '<div class="row"><span>Billed once per year</span><span>&nbsp;</span></div>'
        : '<div class="row"><span>Billed monthly, cancel anytime</span><span>&nbsp;</span></div>') +
      '<div class="row"><span>Setup &amp; joining fee</span><span>$0.00</span></div>' +
      '<div class="row total"><span>Due today</span><span>$' + today.toFixed(2) + "</span></div>";
  }

  /* ---- Card number formatting ---- */
  var cardInput = document.getElementById("card-number");
  if (cardInput) {
    cardInput.addEventListener("input", function () {
      var v = cardInput.value.replace(/\D/g, "").slice(0, 16);
      cardInput.value = v.replace(/(.{4})/g, "$1 ").trim();
    });
  }
  var expInput = document.getElementById("card-exp");
  if (expInput) {
    expInput.addEventListener("input", function () {
      var v = expInput.value.replace(/\D/g, "").slice(0, 4);
      expInput.value = v.length > 2 ? v.slice(0, 2) + "/" + v.slice(2) : v;
    });
  }

  /* ---- Payment form ---- */
  var payForm = document.getElementById("payment-form");
  if (payForm) {
    payForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!payForm.checkValidity()) { payForm.reportValidity(); return; }
      var btn = payForm.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.textContent = "Processing payment…";
      setTimeout(function () {
        document.getElementById("checkout-area").style.display = "none";
        var ok = document.getElementById("checkout-success");
        var name = (document.getElementById("full-name") || {}).value || "Friend";
        var first = name.trim().split(" ")[0];
        var p = planPrice(planSelect ? planSelect.value : "monthly");
        var ref = "NLY-" + Date.now().toString(36).toUpperCase();
        document.getElementById("success-name").textContent = first;
        document.getElementById("success-plan").textContent = p.name + " — $" + p.price.toFixed(2) + (p.price === 9 ? "/month" : "/year");
        document.getElementById("success-ref").textContent = ref;
        ok.style.display = "block";
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 1800);
    });
  }

  /* ---- Contact form ---- */
  var contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!contactForm.checkValidity()) { contactForm.reportValidity(); return; }
      contactForm.style.display = "none";
      document.getElementById("contact-success").style.display = "block";
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---- Current year ---- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
