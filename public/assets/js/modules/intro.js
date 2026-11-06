/**
 * Intro de entrada. Se reproduce en cada carga de la portada.
 * Con prefers-reduced-motion no se muestra.
 */

export function initIntro() {
  const intro = document.querySelector('.page-intro');
  if (!intro) return;

  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    document.body.classList.remove('has-intro');
    intro.remove();
  };

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    finish();
    return;
  }

  intro.addEventListener('animationend', (event) => {
    if (event.target === intro && event.animationName === 'introLeave') finish();
  });

  window.setTimeout(finish, 3200);
}
