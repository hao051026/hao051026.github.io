(function () {
  var btn = document.querySelector('.nav-toggle');
  var nav = document.getElementById('nav');
  if (btn && nav) {
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', String(open));
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') { nav.classList.remove('is-open'); btn.setAttribute('aria-expanded', 'false'); }
    });
  }

  var lb = document.getElementById('lightbox');
  if (!lb) return;
  var lbImg = lb.querySelector('img');
  var close = lb.querySelector('.close');

  function open(src, alt) {
    lbImg.src = src; lbImg.alt = alt || '';
    lb.classList.add('on');
    document.body.style.overflow = 'hidden';
  }
  function shut() {
    lb.classList.remove('on');
    lbImg.removeAttribute('src');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.gallery-grid figure').forEach(function (fig) {
    var img = fig.querySelector('img');
    if (!img) return;
    fig.addEventListener('click', function () { open(img.src, img.alt); });
  });
  lb.addEventListener('click', function (e) { if (e.target === lb || e.target === close) shut(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && lb.classList.contains('on')) shut(); });
})();
