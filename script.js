'use strict';

///////////////////////////////////////
// Modal window
const header = document.querySelector('header');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(Element => Element.addEventListener('click', openModal));
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//IMPLEMENTING SCROLL FEATURE
const s1 = document.querySelector('#section--1');
const btnScrollTo = document.querySelector('.btn--scroll-to');

btnScrollTo.addEventListener('click', function (e) {
  const s1coords = s1.getBoundingClientRect();
  s1.scrollIntoView({ behavior: 'smooth' });

  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });
  // console.log(s1coords);
  // console.log(e.target.getBoundingClientRect());
  // console.log(`Current Scroll X/Y`, window.pageXOffset, window.pageYOffset);
});

//IMPLEMENTING PAGE NAVIGATION
document.querySelector('.nav__links').addEventListener('click', e => {
  // console.log(e.target);
  e.preventDefault();
  // const className = e.target.classList.contains('nav__links')
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    // console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

//IMPLEMENTING TABS
//using event delegation
const tabs = document.querySelectorAll('.operations__tab'); //TABS CONTAINS ALL THE TABS
const tabsContainer = document.querySelector('.operations__tab-container');
const operationsContainer = document.querySelectorAll('.operations__content');
tabsContainer.addEventListener('click', e => {
  const ourBtn = e.target.closest('.operations__tab');

  //GUARD CLAUSE
  if (!ourBtn) return;

  //IMPLEMENTING TABS
  tabs.forEach(el => {
    el.classList.remove('operations__tab--active');
  });
  ourBtn.classList.add('operations__tab--active');

  const dataVal = ourBtn.dataset.tab;

  //REMOVING THE CLASSLIST FROM NODELIST OF OPERATIONSCONTAINER
  operationsContainer.forEach(el => {
    el.classList.remove('operations__content--active');
  });

  //ADDING THE CLASSLIST TO ONLY THAT CONTAINER FOR WHICH THE TAB IS CLICKED/OR EVENT OCCURED ON
  document
    .querySelector(`.operations__content--${dataVal}`) //this will select/fetch target section
    .classList.add('operations__content--active'); //on which we add class
});

//IMPLEMENTING MENU FADE
const nav = document.querySelector('.nav');
const handleHover = function (e) {
  // console.log(this);
  const link = e.target.closest('.nav__link');
  const siblings = e.target.closest('.nav').querySelectorAll('.nav__link'); //returns a nodelist
  const logo = e.target.closest('.nav').querySelector('img');
  //GUARD CLOSE
  if (!link) return;
  siblings.forEach(el => {
    if (el !== link) el.style.opacity = this;
  });
  logo.style.opacity = this;
};
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

//IMPLEMENTING STICKY NAVIGATION
const sec1 = document.querySelector('#section--1');
// const sec1InCoords = sec1.getBoundingClientRect(); //FIXED COORDINATES FROM THE TOP OF THE PAGE (NOT THE VIEWPORT) TO THE SECTION1
// window.addEventListener('scroll', () => {
//   // console.log(window.scrollY);
//   if (window.scrollY > sec1InCoords.top) {
//     nav.classList.add('sticky');
//   } else {
//     nav.classList.remove('sticky');
//   }
//   // console.log(sec1InCoords);
// });

// const obsCallback = (entries, observer) => {
//   // console.log(entries);
//   entries.forEach(el => {
//     console.log(el);
//   });
// };
// const obsOptions = {
//   root: null,
//   threshold: 0.1,
// };
// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(sec1);
// const header = document.querySelector('header');
const navHeight = nav.getBoundingClientRect().height;
const obsCallback = entries => {
  // console.log(entries);
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
  // console.log(entries[1]);
};
const obsOptions = {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight + 2}px`,
};
const observer = new IntersectionObserver(obsCallback, obsOptions);
observer.observe(header);

//REVEALING ELEMENTS ON SCROLL
const allSections = document.querySelectorAll('section');
const newObsCallback = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  sectionsObserver.unobserve(entry.target);
  // console.log(entry.target);
  // console.log('ok');
  // console.log(entry);
  // console.log(entries);
};
const newObsOptions = {
  root: null,
  threshold: 0.15,
};
const sectionsObserver = new IntersectionObserver(
  newObsCallback,
  newObsOptions
);
allSections.forEach(el => {
  sectionsObserver.observe(el);
  el.classList.add('section--hidden');
});

//LAZY LOADING IMAGES
const lazyImg = document.querySelectorAll('img[data-src');
// console.log(lazyImg);
const imgObsCallback = (entries, observer) => {
  const [entry] = entries;

  if (!entry.isIntersecting) return; //confused here
  //replace src with data set src
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  imgObserver.unobserve(entry.target);
};
const imgObsOptns = {
  root: null,
  threshold: 0,
  rootMargin: '300px', //y axis // pehle hee load kro
};

const imgObserver = new IntersectionObserver(imgObsCallback, imgObsOptns);
lazyImg.forEach(el => {
  imgObserver.observe(el);
});

//SLIDES
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  let currSlide = 0;
  const leftBtn = document.querySelector('.slider__btn--left');
  const rightBtn = document.querySelector('.slider__btn--right');
  const maxSlide = slides.length;
  const slider = document.querySelector('.slider');
  const dotContainer = document.querySelector('.dots');
  // slider.style.transform = 'scale(0.3) translateX(-1200px)';
  // slider.style.overflow = 'visible';
  //FUNCTIONS
  const inIt = function () {
    //TO SET THE SLIDES AT THE STAR
  };

  //WILL GO AT THAT SLIDE
  const goToSlide = slide => {
    // console.log(slide);
    slides.forEach((s, i) => {
      s.style.transform = `translateX(${100 * (i - slide)}%)`;
    });
  };
  //THIS IS IMPORTANT AS IMAGES ARE OVERLAPPING EACH OTHER
  goToSlide(0);
  //FOR RIGHT BUTTON
  const nextSlide = () => {
    if (currSlide === maxSlide - 1) {
      currSlide = 0;
    } else {
      currSlide++;
    }
    slides.forEach((s, i) => {
      s.style.transform = `translateX(${100 * (i - currSlide)}%)`;
    });
    goToSlide(currSlide); //SEE?
    activateDots(currSlide);
  };
  //FOR LEFT BUTTON
  const prevSlide = () => {
    if (currSlide === 0) {
      currSlide = maxSlide - 1;
    } else {
      currSlide--;
    }
    slides.forEach((s, i) => {
      s.style.transform = `translateX(${100 * (i - currSlide)}%)`;
    });
    goToSlide(currSlide); //SEE ?
    activateDots(currSlide);
  };

  //CREATING DOTS HERE SEE THE CODE
  const createDots = () => {
    slides.forEach((_, i) => {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slides="${i}"></button>`
      );
    });
  };
  // CREATING DOTS
  createDots();
  //ACTIVATE DOTS
  const activateDots = slide => {
    //SLIDE WOULD BE NUMBER OF THE DOT CHOSEN
    //REMOVING CLASS FROM ALL DOTS
    document.querySelectorAll('.dots__dot').forEach(dot => {
      dot.classList.remove('dots__dot--active');
    });
    //ADDING CLASS TO OUR CHOSEN DOT ONLY
    document
      .querySelector(`.dots__dot[data-slides="${slide}"]`)
      .classList.add('dots__dot--active');
  };
  //activate dots at start
  activateDots(0);

  //ALL THE EVENT LISTENERS
  rightBtn.addEventListener('click', nextSlide);

  leftBtn.addEventListener('click', prevSlide);
  //KEYDOWN EVENT
  document.addEventListener('keydown', e => {
    // if(e.key==='')
    if (e.key === 'ArrowRight') nextSlide();
    e.key === 'ArrowLeft' && prevSlide();
  });
  //WHEN U CLICK ON THE DOTS
  dotContainer.addEventListener('click', e => {
    if (e.target.classList.contains('dots__dot')) {
      const { slides } = e.target.dataset;
      goToSlide(slides);
      activateDots(slides);
    }
  });
};
slider();

/////////////////////////////////////////////JUNK/////////////////////////////////////////////////////////////////
// //CREATING ELEMENTS
// const message = document.createElement('div');
// message.classList.add('cookie-message');
// message.innerHTML =
//   'We use cookies for improved functionality and analytics . <button class="btn btn--close--cookie">Got it!</button>';
// //INSERTING ELEMENTS
// header.append(message);
// // header.prepend(message.cloneNode(true));

// // //DELETING ELEMENTS
// // document.querySelector('.btn--close--cookie').addEventListener('click', () => {
// //   // e.preventDefault();
// //   message.remove();
// // });

// //styles
// message.style.width = '120%';
// message.style.backgroundColor = 'lightgrey';
// // console.log(getComputedStyle(message).color);
// message.style.height =
//   Number.parseFloat(getComputedStyle(message), 10) + 30 + 'px'; //check why 10
// // document.documentElement.style.setProperty('--color-primary', 'orangered'); //setting custom properties

// //attributes
// const logo = document.querySelector('.nav__logo');
// // console.log(logo.alt);
// console.log(logo.className);
// console.log(logo.classList);
// console.log(logo.developer); //undefined
// console.log(logo.getAttribute('developer')); //Mayank
// logo.setAttribute('alt', 'oi');

// console.log(logo.src);
// console.log(logo.getAttribute('src'));

//DATA ATTRIBUTES
// console.log(logo.dataset.versionNumber);
// console.log(logo.dataset.ok);
// //classses
// toggle;
// add;
// remove;
// contain;

//TRAVERSING THRU THE DOM
// const h1 = document.querySelector('h1');
// console.log(h1);

//GOING DOWNWARDS : CHILD
// console.log(h1.querySelectorAll('.highlight')); //highlights green nodelist
// console.log(h1.childNodes); //returns childNodes that include everything like text comments any htmlelement used etc
// console.log(h1.children); //returns html collection of htmlElement
// console.log(h1.firstChild); //"when"
// console.log(h1.lastChild); //#text i guess after: we used
// console.log(h1.childElementCount); //gives 3 that are html element

//GOING UPWARDS: PARENT
// console.log(h1.parentNode); // //returns parent (closest or first parent) //header title
// console.log(h1.parentElement); //returns parent but in htmlElement form
// console.log(h1.closest('header')); //returns closest parent of whatever i write

//GOING SIDEWAYS: SIBLINGS
// console.log(h1.nextSibling); //returns #text and not the html element
// console.log(h1.nextElementSibling); //returns htmlElement of next sibling
// console.log(h1.previousSibling); //#text ?
// console.log(h1.previousElementSibling); //It's null as h1 is first child
//HOW TO ACCESS ALL CHILDRENS
// [...h1.parentElement.children].forEach(el => {
//   // if (el !== h1) el.style.transform = 'scale(0.5)';
// });
