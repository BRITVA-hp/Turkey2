document.addEventListener('DOMContentLoaded', () => {

    //плавное появление элемента
    function blink (elem) {
        let startAnimation = null;
        const step = timestamp => {
            if (!startAnimation) startAnimation = timestamp;
            let progress = timestamp - startAnimation;
            elem.style.opacity = progress/500;
            if (progress < 500) {
                window.requestAnimationFrame(step);
            }
        }
        window.requestAnimationFrame(step);
    }

    // Очистка активного класаа
    function clearActiveClass(arr, activeClass) {
        arr.forEach(item => {
            item.classList.remove(activeClass);
        });
    }

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
    modal('.modal-det', 'modal--active', '[data-modalDet]', '.modal-det__close');

    //video
    function video(triggers, _video, _modalVideo, _modalVideoClose) {
        const play = document.querySelectorAll(triggers),
            video = document.querySelector(_video),
            modalVideo = document.querySelector(_modalVideo),
            modalVideoClose = document.querySelector(_modalVideoClose);

        play.forEach(item => {
            item.addEventListener('click', (e) => {
                const path = e.currentTarget.getAttribute('data-video');
                modalVideo.classList.add('modal--active');
                document.body.style.overflow = 'hidden';
                video.setAttribute('src', path);
                video.play();
            });
        });

        modalVideo.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal__container')) {
                modalVideo.classList.remove('modal--active');
                video.pause();
                document.body.style.overflow = '';
            }
        });
        modalVideoClose.addEventListener('click', () => {
            modalVideo.classList.remove('modal--active');
            video.pause();
            document.body.style.overflow = '';
        })
    }

    video('.main__play', '#video', '.modal-video', '.modal-video__close');

    //slider
    function slider(window, field, cards, dotsWrap, dotClass, dotClassActive, arrowPrev, arrowNext, arrowClass, progress, activeCard = false) {
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
            dots_ = [],
            mouseMoveFlag = false;

        // !--------------ФУНКЦИОНАЛ ИСКЛЮЧИТЕЛЬНО КАСТОМНЫЙ------------!
                // добавление активного класса карточке и вывод её в увеличенном окне
                // переключение слайдера, если активная карточка находится с края при нажатии на стрелки
        if (activeCard) {
            const prev = document.querySelector('.modal-det__slider__arrow--prev')
            const next = document.querySelector('.modal-det__slider__arrow--next')
            const sliderMain = document.querySelector('.modal-det__slider__main img')
            const progressActiveCard = document.querySelector('.modal-det__slider__progress__inner')
    
            const srcArr = []

            let counterActiveCard = 0
    
            cards_.forEach(el => {
                srcArr.push(el.querySelector('img').getAttribute('src'))
            })

            progressActiveCard.style.width = 100/cards_.length + '%'

            function setActiveCard(num) {
                clearActiveClass(cards_, 'modal-det__slider__card--active')
                cards_[num].classList.add('modal-det__slider__card--active')
                blink(sliderMain)
                sliderMain.setAttribute('src', srcArr[num])
                progressActiveCard.style.width = ((num + 1) * 100)/cards_.length + '%'
            }
    
            prev.addEventListener('click', (e) => {
                e.preventDefault()
                counterActiveCard--
                if (counterActiveCard < 0) {
                    counterActiveCard = 0
                    return
                }

                setActiveCard(counterActiveCard)
                if (counterActiveCard < sliderCounter) {
                    slidePrev()
                }
            })

            next.addEventListener('click', (e) => {
                e.preventDefault()
                counterActiveCard++
                if (counterActiveCard > cards_.length - 1) {
                    counterActiveCard = cards_.length - 1
                    return
                }
                setActiveCard(counterActiveCard)
                if (counterActiveCard >= sliderCounter + numberIntegerVisibleCards()) {
                    slideNext()
                }
            })

            cards_.forEach((card, cardIndex) => {
                card.addEventListener('click', () => {
                    counterActiveCard = cardIndex
                    setActiveCard(counterActiveCard)
                })
            })
        }
        // !--------------ФУНКЦИОНАЛ ИСКЛЮЧИТЕЛЬНО КАСТОМНЫЙ ЗАКОНЧИЛСЯ------------!

        // считаем расстояние между карточками
            // общая длина всех карточек + расстояния между ними
        const lengthCardAndBetweenCards = cards_[cards_.length - 1].getBoundingClientRect().right - window_.getBoundingClientRect().left;
            // расстояние между карточками
        const betweenCards = (lengthCardAndBetweenCards - (cards_[0].clientWidth * cards_.length)) / (cards_.length -1);

        // считаем количество карточек, помещающихся в окне
        function numberIntegerVisibleCards() {
            return Math.floor((window_.clientWidth + betweenCards) / (cards_[0].clientWidth + betweenCards))
        }
        // считаем на какая часть карточки не помещается
        function partCard() {
            return (window_.clientWidth + betweenCards) / (cards_[0].clientWidth + betweenCards) - Math.trunc((window_.clientWidth + betweenCards) / (cards_[0].clientWidth + betweenCards))
        }
        // проверяем, показывается ли последняя карточка
        function lastCard() {
            if ( (sliderCounter + numberIntegerVisibleCards()) >= (cards_.length) && cards_.length >= numberIntegerVisibleCards()) {
                sliderCounter = cards_.length - numberIntegerVisibleCards() - 1
                return true
            }
            return false
        }

        // проверяем, больше ли у нас карточек, чем может поместиться в видимой части слайдера
        function checkNumCards() {
            if (cards_.length > numberIntegerVisibleCards()) {
                return true
            }
            return false
        }

        //Устанавливаем ширину бегунка прогресс-бара
        if (progress_) {
            progress_.style.width = 100 / cards_.length + '%'
        }

        // Слайд следующий

        function slideNext() {
            if (!checkNumCards()) {
                return
            }
            sliderCounter++;
            if (arrowNext_) arrowNext_.classList.remove(arrowClass);
            if (arrowPrev_) arrowPrev_.classList.remove(arrowClass);
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
                sliderCounter = cards_.length - numberIntegerVisibleCards() - partCard()
                return
            }
            field_.style.transform = `translateX(-${(cards_[0].scrollWidth + betweenCards) * sliderCounter}px)`;

        }

        // Слайд предыдущий

        function slidePrev() {
            if (!checkNumCards()) {
                return
            }
            sliderCounter = Math.floor(sliderCounter)
            sliderCounter--;
            if (arrowNext_) arrowNext_.classList.remove(arrowClass);
            if (arrowPrev_) arrowPrev_.classList.remove(arrowClass);
            if (sliderCounter <= 0) {
                sliderCounter = 0;
            }
            if (sliderCounter == 0 && arrowPrev_) {
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
        if (arrowPrev_) {
            arrowPrev_.addEventListener('click', () => {
                slidePrev();
            });   
        }

        if (arrowNext_) {
            arrowNext_.addEventListener('click', () => {
                slideNext();
            });   
        }

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
            if (Math.abs(startPoint - endPoint) > 50 && checkNumCards()) {
                if (arrowNext_) arrowNext_.classList.remove(arrowClass);
                if (arrowPrev_) arrowPrev_.classList.remove(arrowClass);
                if (endPoint < startPoint) {
                    slideNext();
                } else {
                    slidePrev();
                }
            } else {
                field_.style.transform = `translateX(-${(cards_[0].scrollWidth + betweenCards) * sliderCounter}px)`;
            }
        });

        // Свайп слайдов маус-событиями
        window_.addEventListener('mousedown', (e) => {
            e.preventDefault();
            startPoint = e.pageX;
            mouseMoveFlag = true;
        });
        window_.addEventListener('mousemove', (e) => {
            if (mouseMoveFlag) {
                e.preventDefault();
                swipeAction = e.pageX - startPoint;
                field_.style.transform = `translateX(${swipeAction + (-(cards_[0].scrollWidth + betweenCards) * sliderCounter)}px)`;
            }
        });
        window_.addEventListener('mouseup', (e) => {
            mouseMoveFlag = false
            endPoint = e.pageX;
            if (Math.abs(startPoint - endPoint) > 50 && checkNumCards()) {
                if (arrowNext_) arrowNext_.classList.remove(arrowClass);
                if (arrowPrev_) arrowPrev_.classList.remove(arrowClass);
                if (endPoint < startPoint) {
                    slideNext();
                } else {
                    slidePrev();
                }
            } else if(Math.abs(startPoint - endPoint) === 0) {
                return
            } 
            else {
                field_.style.transform = `translateX(-${(cards_[0].scrollWidth + betweenCards) * sliderCounter}px)`;
            }
        })
        window_.addEventListener('mouseleave', () => {
            if (mouseMoveFlag) {
                field_.style.transform = `translateX(-${(cards_[0].scrollWidth + betweenCards) * sliderCounter}px)`;   
            }
            mouseMoveFlag = false
        })
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

    slider(
        '.modal-det__slider__window',
        '.modal-det__slider__row',
        '.modal-det__slider__card',
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        true
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