const shoppingCart = document.querySelector(".shopping-cart");
const addToCartBtn = document.querySelectorAll(".add-to-cart");


// local storage array
let storageArray = [];

if (localStorage.getItem("restShoppingCart")) {
    storageArray = JSON.parse(localStorage.getItem("restShoppingCart"));
    bringProductsFromLocalStorage()
}

// showing and removing shopping cart 
shoppingCartShowControl();


addToCartBtn.forEach(button => {
    button.addEventListener("click", ({ target }) => {
        addProductToShoppingCart(target)
    })
})



// these two function are for calculations operations inside shopping cart
function shoppingCartCalculations() {
    const cartProduct = document.querySelectorAll(".shopping-cart .cart-product");

    cartProduct.forEach(cart => {
        const quantityInput = cart.querySelector(".quantity input");
        const originalPrice = cart.querySelector(".original-price");
        const quantityTotalPrice = cart.querySelector(".price");

        quantityInput.addEventListener("input", () => {
            if (quantityInput.value < 1) return;
            quantityTotalPrice.innerHTML = (quantityInput.value * originalPrice.innerHTML).toFixed(2);
            bill_initialCalc(cartProduct, bill_subtotal, bill_discount, bill_shipping, bill_grandTotal)
        })
    })

    // bill
    const bill = document.querySelector(".shopping-cart .calculing");

    const bill_subtotal = bill.querySelector(".subtotal span:last-child");
    const bill_discount = bill.querySelector(".discount span:last-child");
    const bill_shipping = bill.querySelector(".shipping span:last-child");
    const bill_grandTotal = bill.querySelector(".grandtotal span:last-child");
    bill_initialCalc(cartProduct, bill_subtotal, bill_discount, bill_shipping, bill_grandTotal)
}

function bill_initialCalc(allCartProduct, subtotal, discount, shipping, grandtotal) {
    // subtotal
    let quantityPrices = 0;
    allCartProduct.forEach(cartProduct => {
        quantityPrices += +cartProduct.querySelector(".price").innerHTML;
    });
    subtotal.innerHTML = (quantityPrices).toFixed(2);
    // discount
    discount.innerHTML = 0;
    // shiping
    shipping.innerHTML = 10;
    // grand total
    grandtotal.innerHTML = (quantityPrices + +shipping.innerHTML).toFixed(2);
}

// and this function is for controlling the show and hide the shopping cart
function shoppingCartShowControl() {
    const shoppingCartOverlay = document.querySelector(".shopping-cart .overlay");
    const shoppingCartIcon = document.querySelector(".cart-icon i");
    const closeShoppingCartButton = document.querySelector(".closeCart");
    shoppingCartIcon.addEventListener("click", () => {
        shoppingCart.classList.toggle("show");
        setTimeout(() => {
            shoppingCart.querySelector(".content").style.transform = "translateX(0%)";
        }, 0)
    });

    [shoppingCartOverlay, closeShoppingCartButton].forEach(one => {
        one.addEventListener("click", () => {
            shoppingCart.classList.remove("show");
            shoppingCart.querySelector(".content").style.transform = "translateX(150%)";
        });
    });
}

// this function is for adding product to shopping cart when click on add to cart button
function addProductToShoppingCart(target) {
    const productCard = target.closest(".prdct");

    let productInformation = {};

    productInformation.name = productCard.querySelector(".name").innerText;
    productInformation.originalPrice = productCard.querySelector(".price").innerText;
    productInformation.pic = productCard.querySelector(".prdct-img img").getAttribute("src");

    let positionToPut = shoppingCart.querySelector(".calculing");

    if (shoppingCart.querySelector(`[src="${productInformation.pic}"]`)) return;

    positionToPut.insertAdjacentHTML("beforebegin", `
        <div class="cart-product">
            <img src="${productInformation.pic}" alt="">
            <div>
                <div class="name">
                    ${productInformation.name}
                    <div class="original-price">${productInformation.originalPrice}</div>
                </div>
                <div class="quantity">
                    <input type="number" min="1" value="1">
                </div>
                <div class="price">${productInformation.originalPrice}</div>
            </div>
            <div class="remove"><i class="fa-solid fa-xmark"></i></div>
        </div>
    `)

    removeProductFromCart();

    shoppingCartCalculations();


    // let storedDataCheck = JSON.parse(localStorage.getItem("restShoppingCart")).some(obj => { return obj.pic == productInformation.pic });

    // if (storedDataCheck) return;

    storageArray.push(productInformation)
    localStorage.setItem("restShoppingCart", JSON.stringify(storageArray))
}

// onreload, bring the localstorage products and put theme in shopping cart element
function bringProductsFromLocalStorage() {
    let data = JSON.parse(localStorage.getItem("restShoppingCart"));
    let positionToPut = shoppingCart.querySelector(".calculing");

    for (let i = 0; i < data.length; i++) {
        let currentProduct = data[i];
        positionToPut.insertAdjacentHTML("beforebegin", `
        <div class="cart-product">
            <img src="${currentProduct.pic}" alt="">
            <div>
                <div class="name">
                    ${currentProduct.name}
                    <div class="original-price">${currentProduct.originalPrice}</div>
                </div>
                <div class="quantity">
                    <input type="number" min="1" value="1">
                </div>
                <div class="price">${currentProduct.originalPrice}</div>
            </div>
            <div class="remove"><i class="fa-solid fa-xmark"></i></div>
        </div>
    `)
    };
    removeProductFromCart();
    shoppingCartCalculations();
}

// removing the product you don't want from the cart
function removeProductFromCart() {
    const removingIcon = document.querySelectorAll(".remove");

    removingIcon.forEach(icon => {
        icon.addEventListener("click", ({ target }) => {
            let productCartContainer = target.closest(".cart-product");

            let NewstoredData = JSON.parse(localStorage.getItem("restShoppingCart")).filter(obj => {
                return obj.pic != productCartContainer.querySelector("img").getAttribute("src")
            });

            storageArray = NewstoredData;

            localStorage.setItem("restShoppingCart", JSON.stringify(NewstoredData))

            productCartContainer.remove()

            shoppingCartCalculations()
        })
    })

}