function clickToShow(elements) {
    elements.forEach((element) => {
        const ele = document.querySelector(element);
        ele.onclick = function (e) {
            if (e.target.closest(element).classList.contains('active')) {
                ele.classList.toggle('active');
            } else {
                let active = document.querySelector('.active');
                if (active) {
                    active.classList.remove('active');
                }
                ele.classList.add('active');
            }
        };
    });

    document.onclick = function (e) {
        let target = elements.some((ele) => {
            let dom = document.querySelector(ele);
            return e.target.closest(ele) === dom;
        });
        if (!target) {
            let active = document.querySelector('.active');
            if (active) {
                active.classList.remove('active');
            }
        }
    };
}

clickToShow(['.menu', '.cart']);

//stopPropagation
function preventHidden(lists) {
    lists.forEach((list) => {
        document.querySelector(list).onclick = function (e) {
            e.stopPropagation();
        };
    });
}
preventHidden(['.menu__list', '.cart__list']);

// prevent hidden search history list
const a = document.querySelector('.search__history');
a.onmousedown = function (e) {
    e.preventDefault();
};
// search handle
const searchCategory = document.querySelector('.search__category');
const categoryName = searchCategory.querySelector('span');
const itemNames = searchCategory.querySelectorAll('.search__category-item');
for (let name of itemNames) {
    name.onclick = function () {
        categoryName.innerText = this.innerText;
    };
}

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
}
if (slider) {
    slide();
}

// rating star in detail product page
document.querySelectorAll('.star.rating').forEach((star) => {
    star.onclick = function (e) {
        star.parentNode.setAttribute('data-stars', e.target.dataset.rating);
    };
});

// fixed header when scroll
const header = document.querySelector('#header-fixed');
window.onscroll = function () {
    if (window.scrollY < 50) {
        header.classList.remove('header-fixed');
    } else {
        header.classList.add('header-fixed');
    }
};

// add product
const addCart = document.querySelectorAll('.product__buy');
const cart = document.querySelector('.body-header .cart');
const cartList = cart.querySelector('.cart__list');
function countCart() {
    const cartCount = cart.querySelector('.cart__count');
    const itemCount = cartList.querySelectorAll('.cart__product');
    cartCount.innerText = itemCount.length;
    if (cartCount.innerText == 0) {
        cart.classList.add('cart--empty');
    } else {
        cart.classList.remove('cart--empty');
    }
}

for (let btn of addCart) {
    btn.onclick = function () {
        const product = this.closest('.product');

        // add product to cart
        const img = product.querySelector('.product__img').style['background-image'].slice(5, -2);
        const title = product.querySelector('h5').innerText;
        const price = product.querySelector('.product__price-new').innerText;

        const itemProduct = `
        <li class="cart__product">
            <div class="cart__product__info">
                <p class="cart__product__info__heading txtlead txtcolor primarytxt">
                    ${title}
                </p>
                <div class="cart__product__control">
                    <span class="cart__product__control__subtract">-</span>
                    <span class="cart__product__control__quantity">1</span>
                    <span class="cart__product__control__add">+</span>
                    <span class="cart__product__price">${price}</span>
                </div>
            </div>
            <img
                class="cart__product__img"
                src="${img}"
                alt=""
            />
        </li>
        `;
        cartList.innerHTML += itemProduct;
        controlCart();
        countCart();

        // animation product in to cart
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
            { duration: 500, fill: 'both' }
        );

        setTimeout(() => {
            productClone.remove();
        }, 500);
    };
}

// control product in cart
function controlCart(params) {
    let priceOrigin;
    const subtract = document.querySelectorAll('.cart__product__control__subtract');
    const add = document.querySelectorAll('.cart__product__control__add');
    for (let btn of add) {
        btn.onclick = function () {
            const item = this.closest('li');
            const quantity = item.querySelector('.cart__product__control__quantity');
            quantity.innerText = Number(quantity.innerText) + 1;
            const price = item.querySelector('.cart__product__price');
            if (!priceOrigin) {
                priceOrigin = Number(price.innerText.slice(0, -4));
            }
            price.innerText = (priceOrigin * Number(quantity.innerText)).toFixed(2) + ' USD';
        };
    }
    for (let btn of subtract) {
        btn.onclick = function () {
            const item = this.closest('li');
            const quantity = item.querySelector('.cart__product__control__quantity');
            quantity.innerText = Number(quantity.innerText) - 1;
            if (Number(quantity.innerText) === 0) {
                setTimeout(() => {
                    item.remove();
                    countCart();
                }, 100);
                return;
            }
            const price = item.querySelector('.cart__product__price');
            if (!priceOrigin) {
                priceOrigin = Number(price.innerText.slice(0, -4));
            }
            price.innerText = (priceOrigin * Number(quantity.innerText)).toFixed(2) + ' USD';
        };
    }
}

controlCart();

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
if (btnSuccess) {
    btnSuccess.onclick = function () {
        toast({
            title: 'Đặt hàng thành công',
            content: 'Vui lòng nhấn ở giỏ hàng để thanh toán',
            type: 'success',
            time: '12h30',
            duration: '5s',
        });
        if (btnSuccess.classList.contains('product__buy')) {
            const product = document.querySelector('.detail-product');
            const img = product.querySelector('.product__img').style['background-image'].slice(5, -2);
            const title = product.querySelector('.detail-product__heading').innerText;
            const price = product.querySelector('.new').innerText;
            console.log(img, title, price);

            const itemProduct = `
                <li class="cart__product">
                    <div class="cart__product__info">
                        <p class="cart__product__info__heading txtlead txtcolor primarytxt">
                            ${title}
                        </p>
                        <div class="cart__product__control">
                            <span class="cart__product__control__subtract">-</span>
                            <span class="cart__product__control__quantity">1</span>
                            <span class="cart__product__control__add">+</span>
                            <span class="cart__product__price">${price}</span>
                        </div>
                    </div>
                    <img
                        class="cart__product__img"
                        src="${img}"
                        alt=""
                    />
                </li>
        `;
            cartList.innerHTML += itemProduct;
            controlCart();
            countCart();
        }
    };
}

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
