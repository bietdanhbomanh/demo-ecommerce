// slider
const slider = document.querySelector('.home-slider__list');
function slide() {
    const next = document.querySelector('.home-slider__control-next');
    const prev = document.querySelector('.home-slider__control-prev');
    const countItem = slider.childElementCount;
    let clear;

    function auto() {
        clearInterval(clear);
        clear = setInterval(() => {
            if (slider.scrollLeft + slider.offsetWidth === slider.scrollWidth) {
                slider.scrollLeft = 0;
            } else slider.scrollLeft += slider.scrollWidth + 16 / countItem;
        }, 5000);
    }
    const stopAutoAgain = function () {
        setTimeout(() => {
            auto();
        }, 10000);
    };
    auto();
    next.onclick = function () {
        clearInterval(clear);
        stopAutoAgain();
        if (slider.scrollLeft + slider.offsetWidth === slider.scrollWidth) {
            slider.scrollLeft = 0;
        } else slider.scrollLeft += slider.scrollWidth / countItem;
    };
    prev.onclick = function () {
        clearInterval(clear);
        stopAutoAgain();
        if (slider.scrollLeft === 0) {
            slider.scrollLeft = slider.scrollWidth - slider.offsetWidth;
        } else slider.scrollLeft -= slider.scrollWidth / countItem;
    };
    // prevent hidden search history list
    const a = document.querySelector('.search__history');
    a.onmousedown = function (e) {
        e.preventDefault();
    };
}
if (slider) {
    slide();
}

// fixed header when scroll
const header = document.querySelector('#header-fixed');
window.onscroll = function () {
    if (window.scrollY < 50) {
        header.classList.remove('header-fixed');
    } else {
        header.classList.add('header-fixed');
    }
};

// animation product in to cart
const addCart = document.querySelectorAll('.product__buy');
const cart = document.querySelector('.body-header .cart');
for (let btn of addCart) {
    btn.onclick = function () {
        const product = this.closest('.product');
        const productClone = product.cloneNode(true);
        productClone.style.position = 'absolute';
        productClone.style.top = 0;
        productClone.style.left = 0;
        productClone.style.right = 0;
        product.appendChild(productClone);
        let a = product.getBoundingClientRect();
        let b = cart.getBoundingClientRect();
        const positionProduct = {
            xMid: a.left + product.offsetWidth / 2,
            yMid: a.top + product.offsetHeight / 2,
        };
        const positionCart = {
            xMid: b.left + cart.offsetWidth / 2,
            yMid: b.top + cart.offsetHeight / 2,
        };

        // product.style['z-index'] = 1000;
        productClone.style['z-index'] = 1000;

        productClone.animate(
            [
                {
                    transform: `translateX(${positionCart.xMid - positionProduct.xMid}px) translateY(${
                        positionCart.yMid - positionProduct.yMid
                    }px) scale(0)`,
                },
            ],
            { fill: 'both', duration: 500 }
        );

        setTimeout(() => {
            productClone.remove();
        }, 2000);
    };
}

// toast

const btnSuccess = document.querySelector('.btn--success');
const btnError = document.querySelector('.btn--error');
function toast(object) {
    const toast = document.querySelector('#toast');
    if (toast) {
        const toastItem = document.createElement('div');
        toastItem.style.animation = `drop 0.4s linear, fadeout 0.4s linear ${object.duration} forwards`;
        toastItem.classList.add('toast', `toast--${object.type}`);
        toastItem.innerHTML = `
                    <div class="toast__header">
                        <span class="toast__lable">${object.title} </span>
                        <span class="toast__time">${object.time} ago</span>
                    </div>
                    <div class="toast__body">
                        <p class="toast__content">
                            ${object.content}                            
                        </p>
                    </div>
                    <i class="fa toast__close fa-window-close"></i>
                    `;
        toast.append(toastItem);
        setTimeout(() => {
            if (toastItem) {
                toastItem.remove();
            }
        }, `5400`);
        toastItem.onclick = function (e) {
            const close = Array.from(e.target.classList).some((ele) => ele === 'toast__close');
            if (close) {
                toastItem.style.animation = `fadefast 0.4s linear backwards`;
                setTimeout(() => {
                    toastItem.remove();
                }, 400);
            }
        };
    }
}
btnSuccess.onclick = function () {
    toast({
        title: 'Đặt hàng thành công',
        content: 'Vui lòng nhấn ở giỏ hàng để thanh toán',
        type: 'success',
        time: '12h30',
        duration: '5s',
    });
};

if (btnError) {
    btnError.onclick = function () {
        toast({
            title: 'Lỗi không xác định',
            content: 'Đang cố gắng sửa chữa, sẽ khắc phục ngay',
            type: 'error',
            time: '12h30',
            duration: '5s',
        });
    };
}

document.querySelectorAll('.star.rating').forEach((star) => {
    star.onclick = function (e) {
        console.log(e.target.dataset.rating);
        star.parentNode.setAttribute('data-stars', e.target.dataset.rating);
    };
});
