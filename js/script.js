document.addEventListener('DOMContentLoaded', () => {

    // burger
    const burger = document.querySelector('.header__burger')
    const menu = document.querySelector('.menu')
    const menuClose = document.querySelectorAll('[data-menuClose]')

    burger.addEventListener('click', () => {
        menu.classList.add('menu--active')
    })
    menuClose.forEach(item => {
        item.addEventListener('click', () => {
            menu.classList.remove('menu--active')
        })
    })
    menu.addEventListener('click', (e) => {
        if (e.target.classList.contains('menu')) {
            menu.classList.remove('menu--active')
        }
    })

    // функция для модалки

    function calcScroll() {
        let div = document.createElement('div');
        
        div.style.width = '50px';
        div.style.height = '50px';
        div.style.overflowY = 'scroll';
        div.style.visibility = 'hidden';
        
        document.body.appendChild(div);
        let scarollWidth = div.offsetWidth - div.clientWidth;
        div.remove();
        
        return scarollWidth;
    }

    let scrollWidth = calcScroll();

    function modal(modal, modalActiveClass, triggers, modalClose) {
        const triggers_ = document.querySelectorAll(triggers),
                modal_ = document.querySelector(modal),
                modalClose_ = document.querySelector(modalClose);

        if (triggers_.length > 0) {
            triggers_.forEach(item => {
                item.addEventListener('click', () => {
                    modal_.classList.add(modalActiveClass);
                    document.body.style.overflow = 'hidden';
                    document.body.style.marginRight = `${scrollWidth}px`;
                });
            });

            modalClose_.addEventListener('click', () => {
                modal_.classList.remove(modalActiveClass);
                document.body.style.overflow = '';
                document.body.style.marginRight = '0px';
            });

            modal_.addEventListener('click', (e) => {
                if (e.target.classList.contains('modal__container')) {
                    modal_.classList.remove(modalActiveClass);
                    document.body.style.overflow = '';
                    document.body.style.marginRight = '0px';
                }
            });
        }
    }

    modal('.modal-main', 'modal--active', '[data-modal]', '.modal-main__close');

    //slider
    function slider(window, field, cards, dotsWrap, dotClass, dotClassActive, arrowPrev, arrowNext, arrowClass, progress) {
        const window_ = document.querySelector(window),
            field_ = document.querySelector(field),
            cards_ = document.querySelectorAll(cards),
            arrowPrev_ = document.querySelector(arrowPrev),
            arrowNext_ = document.querySelector(arrowNext),
            progress_ = document.querySelector(progress);

        let startPoint,
            swipeAction,
            endPoint,
            sliderCounter = 0,
            dots_ = [];

        // считаем расстояние между карточками
        const betweenCards = (field_.scrollWidth - (cards_[0].clientWidth * cards_.length)) / (cards_.length -1)
        // считаем количество карточек, помещающихся в окне
        function numberIntegerVisibleCards() {
            return Math.floor((window_.clientWidth + betweenCards) / (cards_[0].clientWidth + betweenCards))
        }
        // проверяем, показывается ли последняя карточка
        function lastCard() {
            if ( (sliderCounter + numberIntegerVisibleCards()) >= (cards_.length) ) {
                sliderCounter = cards_.length - numberIntegerVisibleCards() - 1
                return true
            }
            return false
        }
        // Устанавливаем фиксированную ширину поля слайдов

        // field_.style.width = `${cardWidth * cards_.length + (margin * (cards_.length - 1))}px`;
        // field_.style.marginLeft = 'auto';
        // field_.style.marginRight = 'auto';
        // field_.style.display = 'flex';

        //Устанавливаем ширину бегунка прогресс-бара
        if (progress_) {
            progress_.style.width = 100 / cards_.length + '%'
        }

        // Слайд следующий

        function slideNext() {
            sliderCounter++;
            arrowNext_.classList.remove(arrowClass);
            arrowPrev_.classList.remove(arrowClass);
            if (sliderCounter >= cards_.length) {
                sliderCounter = cards_.length - 1;
            }
            if ((sliderCounter + 1) == cards_.length) {
                arrowNext_.classList.add(arrowClass);
            }
            if (dotsWrap) {
                dots_.forEach((item, index)=> {
                item.classList.remove(dotClassActive);
                if (index == sliderCounter) {
                    item.classList.add(dotClassActive);
                }
                });
            }

            if (progress_) {
                progress_.style.left = (100 / cards_.length) * sliderCounter + '%'
            }
            if (lastCard()) {
                field_.style.transform = `translateX(-${field_.scrollWidth - window_.clientWidth}px)`
                sliderCounter = cards_.length - numberIntegerVisibleCards()
                return
            }
            field_.style.transform = `translateX(-${(cards_[0].scrollWidth + betweenCards) * sliderCounter}px)`;

        }

        // Слайд предыдущий

        function slidePrev() {
            sliderCounter--;
            arrowNext_.classList.remove(arrowClass);
            arrowPrev_.classList.remove(arrowClass);
            if (sliderCounter <= 0) {
                sliderCounter = 0;
            }
            if (sliderCounter == 0) {
                arrowPrev_.classList.add(arrowClass);
            }
            if (dotsWrap) {
                dots_.forEach((item, index)=> {
                    item.classList.remove(dotClassActive);
                    if (index == sliderCounter) {
                        item.classList.add(dotClassActive);
                    }
                });
            }

            if (progress) {
                progress_.style.left = (100 / cards_.length) * sliderCounter + '%'
            }
            if (lastCard()) {
                field_.style.transform = `translateX(-${field_.scrollWidth - window_.clientWidth - (cards_[0].scrollWidth + betweenCards)}px)`
                sliderCounter = cards_.length - numberIntegerVisibleCards() - 1
                return
            }

            field_.style.transform = `translateX(-${(cards_[0].scrollWidth + betweenCards) * sliderCounter}px)`;
        }

        // Рендер точек

        if (dotsWrap) {
            const dotsWrap_ = document.querySelector(dotsWrap);

            cards_.forEach(() => {
                const dot = document.createElement('div');
                dot.classList.add(dotClass);
                dotsWrap_.appendChild(dot);
                dots_.push(dot);
            });
            dots_[0].classList.add(dotClassActive);
            dots_.forEach((item, index) => {
                item.addEventListener('click', () => {
                    sliderCounter = index;
                    arrowNext_.classList.remove(arrowClass);
                    arrowPrev_.classList.remove(arrowClass);
                    if (sliderCounter == 0) {
                        arrowPrev_.classList.add(arrowClass);
                    }
                    if ((sliderCounter + 1) == cards_.length) {
                        arrowNext_.classList.add(arrowClass);
                    }
                    dots_.forEach(item_ => {
                        item_.classList.remove(dotClassActive);
                    });
                    item.classList.add(dotClassActive);
                    field_.style.transform = `translateX(-${(cards_[0].scrollWidth + betweenCards) * sliderCounter}px)`;
                });
            });
        }

        // Переключение на стрелки

        arrowPrev_.addEventListener('click', () => {
            slidePrev();
        });

        arrowNext_.addEventListener('click', () => {
            slideNext();
        });

        // Свайп слайдов тач-событиями

        window_.addEventListener('touchstart', (e) => {
            startPoint = e.changedTouches[0].pageX;
        });

        window_.addEventListener('touchmove', (e) => {
            swipeAction = e.changedTouches[0].pageX - startPoint;
            field_.style.transform = `translateX(${swipeAction + (-(cards_[0].scrollWidth + betweenCards) * sliderCounter)}px)`;
        });

        window_.addEventListener('touchend', (e) => {
            endPoint = e.changedTouches[0].pageX;
            if (Math.abs(startPoint - endPoint) > 50) {
                arrowNext_.classList.remove(arrowClass);
                arrowPrev_.classList.remove(arrowClass);
                if (endPoint < startPoint) {
                    slideNext();
                } else {
                    slidePrev();
                }
            } else {
                field_.style.transform = `translateX(-${(cards_[0].scrollWidth + betweenCards) * sliderCounter}px)`;
            }
        });
    }
    slider(
        '.catalog__window',
        '.catalog__field',
        '.catalog__card',
        false,
        false,
        false,
        '.catalog__wrap__arrow--prev',
        '.catalog__wrap__arrow--next',
        false,
        false
    );

    //faq
    const tabs = document.querySelectorAll('.faq__item')
    const tabsTriggers = document.querySelectorAll('.faq__item__header')
    const tabsContents = document.querySelectorAll('.faq__item__text')

    tabsTriggers.forEach((trigger, triggerIndex) => {
        trigger.addEventListener('click', () => {
            tabs[triggerIndex].classList.toggle('faq__item--active')
            if (tabs[triggerIndex].classList.contains('faq__item--active')) {
                tabsContents[triggerIndex].style.height= tabsContents[triggerIndex].scrollHeight + 'px'
            } else {
                tabsContents[triggerIndex].style = ''
            }
        })
    })

})