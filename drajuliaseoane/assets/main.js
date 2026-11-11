// Menú, cabecera al hacer scroll y animaciones de entrada
(function(){
  var nav=document.querySelector('nav.top');
  var onScroll=function(){ if(nav) nav.classList.toggle('scrolled',window.scrollY>30); };
  window.addEventListener('scroll',onScroll,{passive:true}); onScroll();

  var burger=document.querySelector('.burger');
  if(burger){
    burger.addEventListener('click',function(){
      var open=document.body.classList.toggle('menu-open');
      burger.setAttribute('aria-expanded',open);
    });
    document.querySelectorAll('.menu a').forEach(function(a){
      a.addEventListener('click',function(){document.body.classList.remove('menu-open');burger.setAttribute('aria-expanded',false);});
    });
  }

  // Marca en el menú la sección actual
  var home=document.querySelector('nav.top .logo');
  if(home){
    var homePath=new URL(home.href).pathname;
    document.querySelectorAll('.menu a').forEach(function(a){
      var p=new URL(a.href).pathname;
      if(p!==homePath && location.pathname.indexOf(p)===0) a.classList.add('active');
    });
  }

  // Comparador antes / después
  document.querySelectorAll('.ba').forEach(function(ba){
    var input=ba.querySelector('input');
    var set=function(v){v=Math.max(0,Math.min(100,v));ba.style.setProperty('--pos',v+'%');input.value=v;};
    var fromEvent=function(e){var r=ba.getBoundingClientRect();set((e.clientX-r.left)/r.width*100);};
    var dragging=false;
    ba.addEventListener('pointerdown',function(e){dragging=true;ba.setPointerCapture(e.pointerId);fromEvent(e);});
    ba.addEventListener('pointermove',function(e){if(dragging)fromEvent(e);});
    ba.addEventListener('pointerup',function(){dragging=false;});
    ba.addEventListener('pointercancel',function(){dragging=false;});
    input.addEventListener('input',function(){set(+input.value);});
    // Si falta alguna foto, se muestra el hueco "Foto pendiente" con el nombre del archivo
    ba.querySelectorAll('img').forEach(function(img){
      var fail=function(){ba.classList.add('missing');};
      img.addEventListener('error',fail);
      if(img.complete && img.naturalWidth===0 && img.getAttribute('src')) fail();
    });
  });

  var els=document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.12});
    els.forEach(function(el){io.observe(el);});
  } else { els.forEach(function(el){el.classList.add('in');}); }
})();
