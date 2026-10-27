/* ==========================================================================
   PORTAFOLIO PROFESIONAL · script.js
   ==========================================================================
   JavaScript Vanilla (sin librerías). Cada bloque está comentado y es
   independiente, así que puedes activar/desactivar funciones sin romper el
   resto. Se ejecuta cuando el HTML está listo.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ========================================================================
     1) MENÚ MÓVIL FLUIDO
     ------------------------------------------------------------------------
     Abre/cierra el panel lateral, anima el botón a "X", muestra la capa
     oscura, bloquea el scroll del fondo y se cierra al pulsar un enlace,
     la tecla Escape o la capa oscura.
     ===================================================================== */
  const toggle   = document.getElementById('nav-toggle');
  const menu     = document.getElementById('nav-menu');
  const backdrop = document.getElementById('nav-backdrop');
  const body     = document.body;

  const openMenu = () => {
    menu.classList.add('is-open');
    backdrop.classList.add('is-open');
    toggle.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    body.classList.add('no-scroll');
  };

  const closeMenu = () => {
    menu.classList.remove('is-open');
    backdrop.classList.remove('is-open');
    toggle.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    body.classList.remove('no-scroll');
  };

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      menu.classList.contains('is-open') ? closeMenu() : openMenu();
    });

    // Cerrar al hacer clic en cualquier enlace del menú
    menu.querySelectorAll('.nav__link').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Cerrar al pulsar la capa oscura o la tecla Escape
    backdrop.addEventListener('click', closeMenu);
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeMenu();
    });
  }


  /* ========================================================================
     2) CABECERA AL HACER SCROLL
     ------------------------------------------------------------------------
     Añade fondo translúcido con desenfoque cuando bajas un poco.
     ===================================================================== */
  const header = document.getElementById('site-header');
  const onScrollHeader = () => {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 24);
  };
  onScrollHeader();
  window.addEventListener('scroll', onScrollHeader, { passive: true });


  /* ========================================================================
     3) SCROLL REVEAL · aparición de elementos (Intersection Observer)
     ------------------------------------------------------------------------
     Todo elemento con la clase .reveal se anima al entrar en pantalla.
     Cambia 'threshold' (0 a 1) para que aparezcan antes o después.
     ===================================================================== */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && revealEls.length) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target); // se anima solo una vez
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -60px 0px'
    });

    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    // Navegadores antiguos: mostramos todo directamente
    revealEls.forEach(el => el.classList.add('is-visible'));
  }


  /* ========================================================================
     4) BARRAS DE SKILLS · se rellenan al entrar en pantalla
     ------------------------------------------------------------------------
     Lee el atributo data-level (0–100) de cada .skill y anima su barra.
     ===================================================================== */
  const skills = document.querySelectorAll('.skill');

  if ('IntersectionObserver' in window && skills.length) {
    const skillObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const level = entry.target.getAttribute('data-level') || 0;
          const bar = entry.target.querySelector('.skill__bar');
          if (bar) bar.style.width = level + '%';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    skills.forEach(skill => skillObserver.observe(skill));
  }


  /* ========================================================================
     5) FILTRADO DE PROYECTOS · suave y animado
     ------------------------------------------------------------------------
     Los botones .filter tienen data-filter. Las tarjetas .project tienen
     data-category. Al pulsar un filtro, se ocultan las que no coinciden con
     una transición y se muestran las que sí.
     ===================================================================== */
  const filterBtns   = document.querySelectorAll('.filter');
  const projects     = document.querySelectorAll('.project');
  const emptyMessage = document.getElementById('projects-empty');

  const applyFilter = (value) => {
    let visibleCount = 0;

    projects.forEach(project => {
      const category = project.getAttribute('data-category');
      const matches  = value === 'all' || category === value;

      if (matches) {
        // Mostrar (con pequeña animación de entrada)
        project.classList.remove('is-hidden', 'is-hiding');
        project.classList.add('is-showing');
        visibleCount++;
        // Limpiamos la clase de animación al terminar para poder repetirla
        project.addEventListener('animationend', function handler() {
          project.classList.remove('is-showing');
          project.removeEventListener('animationend', handler);
        });
      } else {
        // Ocultar (primero desvanece, luego se quita del flujo)
        project.classList.add('is-hiding');
        project.classList.remove('is-showing');
        setTimeout(() => project.classList.add('is-hidden'), 300);
      }
    });

    // Mensaje cuando no hay resultados
    if (emptyMessage) emptyMessage.hidden = visibleCount !== 0;
  };

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Marcar el botón activo (estado visual + accesibilidad)
      filterBtns.forEach(b => {
        b.classList.remove('is-active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-selected', 'true');

      applyFilter(btn.getAttribute('data-filter'));
    });
  });


  /* ========================================================================
     6) NAVEGACIÓN ACTIVA SEGÚN LA SECCIÓN VISIBLE (scrollspy)
     ------------------------------------------------------------------------
     Resalta el enlace del menú correspondiente a la sección que estás viendo.
     ===================================================================== */
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  if ('IntersectionObserver' in window && sections.length) {
    const spyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            const isCurrent = link.getAttribute('href') === '#' + id;
            link.classList.toggle('is-active', isCurrent);
          });
        }
      });
    }, {
      // El "punto de activación" está hacia el centro-superior de la pantalla
      rootMargin: '-45% 0px -50% 0px'
    });

    sections.forEach(section => spyObserver.observe(section));
  }


  /* ========================================================================
     7) BOTÓN "VOLVER ARRIBA"
     ------------------------------------------------------------------------
     Aparece tras bajar 600px y sube la página suavemente al pulsarlo.
     ===================================================================== */
  const toTop = document.getElementById('to-top');
  if (toTop) {
    const onScrollTopBtn = () => {
      const show = window.scrollY > 600;
      toTop.classList.toggle('is-visible', show);
      toTop.hidden = !show;
    };
    onScrollTopBtn();
    window.addEventListener('scroll', onScrollTopBtn, { passive: true });

    toTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  /* ========================================================================
     8) AÑO ACTUAL EN EL FOOTER (se actualiza solo cada año)
     ===================================================================== */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();


  /* ========================================================================
     9b) TÍTULO DE PESTAÑA AL CAMBIAR DE VENTANA
     ------------------------------------------------------------------------
     Cuando el usuario va a otra pestaña, el título alterna entre mensajes
     con emojis para llamar su atención. Al volver, restaura el original.
     ===================================================================== */
  const originalTitle = document.title;
  const hiddenTitles  = ['⚙️ ¿Te lo pierdes?', '🔧 Tu solución aquí', '💡 ¿Qué te falta?'];
  let hiddenTitleIdx  = 0;
  let titleInterval   = null;

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      titleInterval = setInterval(() => {
        document.title = hiddenTitles[hiddenTitleIdx % hiddenTitles.length];
        hiddenTitleIdx++;
      }, 2200);
    } else {
      clearInterval(titleInterval);
      hiddenTitleIdx = 0;
      document.title = originalTitle;
    }
  });


  /* ========================================================================
     10) BARRA DE PROGRESO DE SCROLL
     ------------------------------------------------------------------------
     Línea fina del color de acento que crece a medida que bajas la página.
     ===================================================================== */
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  progressBar.setAttribute('aria-hidden', 'true');
  document.body.prepend(progressBar);

  const updateProgress = () => {
    const scrolled = window.scrollY;
    const total    = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = (total > 0 ? (scrolled / total) * 100 : 0) + '%';
  };
  updateProgress();
  window.addEventListener('scroll', updateProgress, { passive: true });


  /* ========================================================================
     11) EFECTO DE ESCRITURA EN EL TITULAR DEL HERO
     ------------------------------------------------------------------------
     El span .hero__title-accent cicla entre palabras simulando que se escribe
     y se borra, con un cursor parpadeante.
     ===================================================================== */
  const accentEl = document.querySelector('.hero__title-accent');
  if (accentEl) {
    const words        = ['servidores', 'firewalls', 'servicios', 'redes', 'dominios', 'backups'];
    let wordIndex      = 0;
    let charIndex      = 0;
    let isDeleting     = false;
    const TYPE_SPEED   = 110;
    const DELETE_SPEED = 65;
    const PAUSE_FULL   = 2400;
    const PAUSE_EMPTY  = 320;

    const type = () => {
      const word = words[wordIndex];
      accentEl.textContent = isDeleting
        ? word.substring(0, charIndex - 1)
        : word.substring(0, charIndex + 1);

      charIndex += isDeleting ? -1 : 1;

      if (!isDeleting && charIndex > word.length) {
        isDeleting = true;
        setTimeout(type, PAUSE_FULL);
        return;
      }
      if (isDeleting && charIndex < 0) {
        isDeleting = false;
        charIndex  = 0;
        wordIndex  = (wordIndex + 1) % words.length;
        setTimeout(type, PAUSE_EMPTY);
        return;
      }
      setTimeout(type, isDeleting ? DELETE_SPEED : TYPE_SPEED);
    };

    accentEl.classList.add('typing');

    // Esperar a fuentes cargadas → medir → fijar espacio → entonces animar
    document.fonts.ready.then(() => {
      const h1 = accentEl.closest('h1');

      // 1) Anchura de la palabra más larga (para el span)
      const probe = document.createElement('span');
      const cs    = window.getComputedStyle(accentEl);
      probe.style.cssText = `position:absolute;visibility:hidden;white-space:nowrap;` +
                            `font:${cs.font};letter-spacing:${cs.letterSpacing}`;
      document.body.appendChild(probe);
      const maxWordW = Math.max(...words.map(w => { probe.textContent = w; return probe.offsetWidth; }));
      document.body.removeChild(probe);
      accentEl.style.minWidth = maxWordW + 'px';

      // 2) Altura máxima del h1 con cada palabra (para que nunca cambie de alto)
      if (h1) {
        const clone = h1.cloneNode(true);
        clone.style.cssText = 'position:absolute;visibility:hidden;top:-9999px;left:0;' +
                              `width:${h1.offsetWidth}px;pointer-events:none`;
        document.body.appendChild(clone);
        const ca = clone.querySelector('.hero__title-accent');
        if (ca) {
          ca.style.minWidth = maxWordW + 'px';
          const maxH1H = Math.max(...words.map(w => { ca.textContent = w; return clone.offsetHeight; }));
          h1.style.minHeight = maxH1H + 'px';
        }
        document.body.removeChild(clone);
      }

      setTimeout(type, 800);
    });
  }


  /* ========================================================================
     12) TOAST DE NOTIFICACIÓN (reutilizado por otras funciones)
     ===================================================================== */
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  toast.setAttribute('aria-atomic', 'true');
  document.body.appendChild(toast);

  let toastTimer = null;
  const showToast = (msg, duration = 3200) => {
    clearTimeout(toastTimer);
    toast.textContent = msg;
    toast.classList.add('is-visible');
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), duration);
  };


  /* ========================================================================
     13) COPIAR EMAIL AL PORTAPAPELES
     ------------------------------------------------------------------------
     Al hacer clic en cualquier enlace mailto se copia el email y se notifica
     con el toast. El cliente de correo sigue abriéndose igualmente.
     ===================================================================== */
  document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
    link.addEventListener('click', () => {
      const email = link.getAttribute('href').replace('mailto:', '');
      if (navigator.clipboard) {
        navigator.clipboard.writeText(email).catch(() => {});
        showToast('✓ Email copiado al portapapeles');
      }
    });
  });


  /* ========================================================================
     14) SPOTLIGHT DEL CURSOR (solo en dispositivos con ratón de precisión)
     ------------------------------------------------------------------------
     Resplandor sutil del acento que sigue al puntero. No se activa en táctil.
     ===================================================================== */
  if (window.matchMedia('(pointer: fine)').matches) {
    const spotlight = document.createElement('div');
    spotlight.className = 'cursor-spotlight';
    spotlight.setAttribute('aria-hidden', 'true');
    document.body.appendChild(spotlight);

    let rafId = null;
    let mx = 0, my = 0;

    document.addEventListener('mousemove', (e) => {
      mx = e.clientX;
      my = e.clientY;
      spotlight.classList.add('is-visible');
      if (!rafId) {
        rafId = requestAnimationFrame(() => {
          spotlight.style.transform = `translate(${mx}px, ${my}px)`;
          rafId = null;
        });
      }
    });

    document.addEventListener('mouseleave', () => spotlight.classList.remove('is-visible'));
  }


  /* ========================================================================
     15) EASTER EGG · CÓDIGO KONAMI
     ------------------------------------------------------------------------
     Introduce ↑ ↑ ↓ ↓ ← → ← → B A para activar el mensaje secreto.
     ===================================================================== */
  const KONAMI = [
    'ArrowUp','ArrowUp','ArrowDown','ArrowDown',
    'ArrowLeft','ArrowRight','ArrowLeft','ArrowRight',
    'b','a'
  ];
  let konamiIdx = 0;

  document.addEventListener('keydown', (e) => {
    if (e.key === KONAMI[konamiIdx]) {
      konamiIdx++;
      if (konamiIdx === KONAMI.length) {
        konamiIdx = 0;
        showToast('🎮 ¡Código Konami! Modo root activado — bienvenido, administrador', 4500);
      }
    } else {
      konamiIdx = 0;
    }
  });


  /* ========================================================================
     9) FORMULARIO DE CONTACTO
     ------------------------------------------------------------------------
     IMPORTANTE: una web estática NO envía correos por sí sola. Este código:
       · Valida los campos en el navegador.
       · Por defecto, muestra un mensaje de éxito (modo demostración).
     Para RECIBIR los mensajes de verdad tienes 2 caminos sencillos:

     OPCIÓN A — Servicio externo (recomendado, sin backend):
       1. Crea una cuenta gratis en https://formspree.io o https://web3forms.com
       2. En index.html, cambia el <form ...> por:
            action="https://formspree.io/f/TU_ID"  method="POST"
       3. Borra (o comenta) el bloque "MODO DEMO" de abajo para que el
          formulario envíe de verdad al pulsar.

     OPCIÓN B — Backend propio:
       Envía los datos con fetch() a tu endpoint (ejemplo comentado al final).
     ===================================================================== */
  const form    = document.getElementById('contact-form');
  const success = document.getElementById('form-success');

 if (form) {
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Validación HTML5
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        // Obtener los datos del formulario
        const datos = {
            nombre: document.getElementById("nombre").value.trim(),
            email: document.getElementById("email").value.trim(),
            asunto: document.getElementById("asunto").value.trim(),
            mensaje: document.getElementById("mensaje").value.trim()
        };

        try {

            const response = await fetch("api/formulario", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(datos)
            });

            if (!response.ok) {
                throw new Error("Error al enviar");
            }

            const resultado = await response.json();

            if (resultado.ok) {
                if (success) {
                    success.hidden = false;
                    success.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });
                }

                form.reset();
            } else {
                alert(resultado.error || "No se pudo enviar el mensaje.");
            }

        } catch (error) {
            console.error(error);
            alert("Hubo un error al enviar el formulario. Inténtalo más tarde.");
        }
    });
}

});
