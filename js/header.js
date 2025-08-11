const openBtn = document.getElementById('open-menu');
const closeBtn = document.getElementById('close-menu');
const shade = document.getElementById('shade');
const menu = document.getElementById('menu');

function openMenu() {
  menu.classList.add('visible');
  closeBtn.classList.add('visible');
  openBtn.classList.add('invisible');
  shade.classList.remove('invisible');
  
  openBtn.setAttribute('aria-expanded', 'true');
  closeBtn.setAttribute('aria-expanded', 'true');
}

function closeMenu() {
  menu.classList.remove('visible');
  closeBtn.classList.remove('visible');
  openBtn.classList.remove('invisible');
  shade.classList.add('invisible');
  
  openBtn.setAttribute('aria-expanded', 'false');
  closeBtn.setAttribute('aria-expanded', 'false');
}

openBtn.addEventListener('click', openMenu);
closeBtn.addEventListener('click', closeMenu);

shade.addEventListener('click', closeMenu);