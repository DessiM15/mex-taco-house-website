/* Mex Taco House - shared accessibility behaviours (WCAG 2.2 AA) */
(function () {
  'use strict';
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function setPressedLabel(btn, playing, what) {
    var icon = btn.querySelector('i');
    var text = btn.querySelector('.a11y-pause-text');
    btn.setAttribute('aria-pressed', playing ? 'false' : 'true');
    btn.setAttribute('aria-label', (playing ? 'Pause ' : 'Play ') + what);
    if (icon) {
      icon.className = playing ? 'fas fa-pause' : 'fas fa-play';
    }
    if (text) {
      text.textContent = playing ? 'Pause' : 'Play';
    }
  }

  /* ---- Skip link: move focus to main even when a smooth-scroll script eats the click */
  document.querySelectorAll('a.skip-link').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var main = document.getElementById('main-content');
      if (!main) { return; }
      e.preventDefault();
      e.stopImmediatePropagation();
      main.focus({ preventScroll: true });
      main.scrollIntoView({ block: 'start' });
    }, true);
  });

  /* ---- Embedded maps: browsers do not paint a ring on a focused iframe, so mark the wrapper */
  document.querySelectorAll('iframe').forEach(function (frame) {
    var wrap = frame.parentElement;
    if (!wrap) { return; }
    frame.addEventListener('focus', function () { wrap.classList.add('a11y-iframe-focus'); });
    frame.addEventListener('blur', function () { wrap.classList.remove('a11y-iframe-focus'); });
  });

  /* ---- Hero video pause / play + reduced motion + decorative ---------------- */
  document.querySelectorAll('[data-video-toggle]').forEach(function (btn) {
    var video = document.querySelector(btn.getAttribute('data-video-toggle'));
    if (!video) { return; }
    video.setAttribute('aria-hidden', 'true');
    video.muted = true;
    var sync = function () { setPressedLabel(btn, !video.paused, 'background video'); };
    if (reduceMotion) {
      video.removeAttribute('autoplay');
      video.dataset.a11yPaused = '1';
      video.pause();
    }
    btn.addEventListener('click', function () {
      if (video.paused) {
        delete video.dataset.a11yPaused;
        var p = video.play();
        if (p && p.catch) { p.catch(function () {}); }
      } else {
        video.dataset.a11yPaused = '1';
        video.pause();
      }
      setTimeout(sync, 50);
    });
    video.addEventListener('play', sync);
    video.addEventListener('pause', sync);
    sync();
  });

  /* ---- Scrolling marquee pause / play -------------------------------------- */
  document.querySelectorAll('[data-marquee-toggle]').forEach(function (btn) {
    var marquee = btn.closest('#desktopMarquee, .marquee-banner');
    if (!marquee) { return; }
    var paused = reduceMotion;
    var apply = function () {
      marquee.classList.toggle('is-paused', paused);
      setPressedLabel(btn, !paused, 'scrolling announcement');
    };
    btn.addEventListener('click', function () { paused = !paused; apply(); });
    apply();
  });

  /* ---- Bootstrap-style desktop navbar toggler: expanded state + Escape ------ */
  var toggler = document.querySelector('.navbar-toggler');
  var collapse = document.querySelector('.navbar-collapse');
  if (toggler && collapse) {
    if (collapse.id) { toggler.setAttribute('aria-controls', collapse.id); }
    if (!toggler.getAttribute('aria-label')) { toggler.setAttribute('aria-label', 'Toggle navigation menu'); }
    var syncToggler = function () {
      toggler.setAttribute('aria-expanded', collapse.classList.contains('show') ? 'true' : 'false');
    };
    toggler.addEventListener('click', function () { setTimeout(syncToggler, 0); });
    new MutationObserver(syncToggler).observe(collapse, { attributes: true, attributeFilter: ['class'] });
    syncToggler();
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && collapse.classList.contains('show')) {
        toggler.click();
        toggler.focus();
      }
    });
  }

  /* ---- Off-canvas mobile menu (desktop pages): aria-controls + Escape ------- */
  var mToggle = document.querySelector('.mobile-navbar-toggle');
  var mPanel = document.querySelector('.mobile-menu-panel');
  if (mToggle && mPanel) {
    if (!mPanel.id) { mPanel.id = 'mobileMenuPanel'; }
    mToggle.setAttribute('aria-controls', mPanel.id);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mToggle.getAttribute('aria-expanded') === 'true') {
        // Both mobile-navbar.js and mobile-site.js already close on Escape;
        // this only makes sure focus returns to the toggle.
        setTimeout(function () { mToggle.focus(); }, 0);
      }
    });
  }

  /* ---- Elements with role="button" (news cards): keyboard activation -------- */
  document.querySelectorAll('[role="button"][tabindex="0"]:not(button)').forEach(function (el) {
    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        el.click();
      }
    });
  });

  /* ---- Swiper: stop autoplay for reduced motion, pause on keyboard focus ---- */
  function hookSwiper() {
    var el = document.querySelector('.swiper-3d');
    if (!el || !el.swiper) { return false; }
    var sw = el.swiper;
    if (reduceMotion && sw.autoplay) { sw.autoplay.stop(); }
    el.addEventListener('focusin', function () { if (sw.autoplay) { sw.autoplay.stop(); } });
    el.addEventListener('focusout', function (e) {
      if (!reduceMotion && sw.autoplay && !el.contains(e.relatedTarget)) { sw.autoplay.start(); }
    });
    return true;
  }
  if (!hookSwiper()) {
    var tries = 0;
    var timer = setInterval(function () {
      if (hookSwiper() || ++tries > 20) { clearInterval(timer); }
    }, 250);
  }

  /* ---- Auto-rotating reviews banner / news rotator: pause control ----------- */
  function hookRotator(btn) {
    var key = btn.getAttribute('data-rotator-toggle');
    var api = key === 'reviews' ? window.a11yReviews : window.a11yNews;
    if (!api) { return false; }
    var what = key === 'reviews' ? 'review rotation' : 'news rotation';
    var paused = false;
    var container = btn.closest('section');
    var apply = function () {
      if (paused) { api.stop(); } else { api.start(); }
      setPressedLabel(btn, !paused, what);
    };
    btn.addEventListener('click', function () { paused = !paused; apply(); });
    if (container) {
      container.addEventListener('focusin', function () { api.stop(); });
      container.addEventListener('focusout', function (e) {
        if (!paused && !reduceMotion && !container.contains(e.relatedTarget)) { api.start(); }
      });
      // Mouse handlers in the page restart rotation on mouseleave; keep it paused if the user pressed pause.
      container.addEventListener('mouseleave', function () { if (paused || reduceMotion) { setTimeout(api.stop, 0); } });
    }
    if (reduceMotion) { paused = true; }
    apply();
    return true;
  }
  document.querySelectorAll('[data-rotator-toggle]').forEach(function (btn) {
    if (hookRotator(btn)) { return; }
    var n = 0;
    var t = setInterval(function () { if (hookRotator(btn) || ++n > 20) { clearInterval(t); } }, 250);
  });
})();
