const cartContainer = document.querySelector('.cart-container');
const productList = document.querySelector('#product-list');
const cartList = document.querySelector('.cart-list');
const cartTotalValue = document.getElementById('cart-total-value');



let cartItemID = 1;

eventListeners();



function eventListeners(){
    window.addEventListener('DOMContentLoaded', () => {
        loadJSON();
        loadCart();
    })

    document.getElementById('cart-btn').addEventListener('click', () => {
        cartContainer.classList.toggle('show-cart-container');
    })

    productList.addEventListener('click', purchaseProduct);

    cartList.addEventListener('click', deleteProduct);
}

function updateCartInfo(){
    let cartInfo = findCartInfo();
    cartTotalValue.textContent = cartInfo.total;

}

updateCartInfo();

function loadJSON(){
    fetch('products.json')
    .then(response => response.json())
    .then(data => {
        let html ='';
        data.forEach(product => {
            if (product.price  == null){
                product.price = "-";
            };
            if (product.name  == null){
                product.name = "-";
            }; 
            if (product.rating  == null){
                product.rating = "-";
            };  
            if (product.description  == null){
                product.description = "-";
            };  
            html +=`
            
            <div class="card">
                <div class="product-item">
                    <div class ="product-img">
                        <img src="${product.image}" class=" card-img-top mt-2 mb-2" alt="product image">
                       
                    <div class="product-content card-body">
                        <h6 class="product-name card-title">${product.name}</h5>
                    </div>
                    <div class="col text-center">
                        <button type="button" class="view-more-btn btn btn-primary text-center" data-toggle="modal" data-target="#exampleModalCenter">View More</button>
                        <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLongTitle">${product.name}</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                            </div>
                            <div class="modal-body">
                            Price: ${product.price} <br>
                            Rating: ${product.rating} <br>
                            Description: ${product.description}
                            </div>
                        </div>
                        </div>
                    </div>
                        <button type="button" class="product-price add-to-cart-btn btn btn-primary text-center">${product.price}€</button>

                        </div>  
                    </div>    
                </div>
            </div> 
            `;
        });
    productList.innerHTML = html;    
    })
  
}

function purchaseProduct(e){
    if(e.target.classList.contains('add-to-cart-btn')){
        let product = e.target.parentElement.parentElement;
        getProductInfo(product);
    }
}

function getProductInfo(product){
    let productInfo = {
        id: cartItemID,
        image: product.querySelector('.product-img img').src,
        name: product.querySelector('.product-name').textContent,
        price: product.querySelector('.product-price').textContent,
        rating: product.querySelector('.product-rating'),
        description: product.querySelector('.product-description')
    }


    cartItemID++;
    console.log(productInfo);
    addToCartList(productInfo);
    saveProductInStorage(productInfo);
}

function addToCartList(product){
    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');
    cartItem.setAttribute('data-id', `${product.id}`);
    cartItem.innerHTML = `

        <div class="cart-item-info">
            <h3 class="cart-item-name">${product.name}</h3>
            <span class="cart-item-price">${product.price}</span>
        </div>

        <button type = "button" class="cart-item-del-btn">
            <i class = "fas fa-times"></i>
        </button>
    `;
    cartList.appendChild(cartItem);
}

function saveProductInStorage(item){
    let products = getProductFromStorage();
    products.push(item);
    localStorage.setItem('products', JSON.stringify(products));
    updateCartInfo();
}

function getProductFromStorage(){
    return localStorage.getItem('products') ? JSON.parse (localStorage.getItem('products')) : [];
}

function loadCart(){
    let products = getProductFromStorage();
    if(products.length < 1) {
        cartItemID = 1
    } else {
        cartItemID = products[products.length - 1].id;
        cartItemID++;
    }

    products.forEach(product => addToCartList(product));

    updateCartInfo();
}

function findCartInfo(){
    
    let products = getProductFromStorage();
    let total = products.reduce((acc, product) => {
        let price = parseFloat(product.price); 
        return acc += price;

    }, 0);
    
    return {
        total: total.toFixed(2),
    }

}

function deleteProduct(e){
    let cartItem;
    if(e.target.tagName === "BUTTON"){
        cartItem = e.target.parentElement;
        cartItem.remove();
    } else if(e.target.tagName === "I"){
        cartItem = e.target.parentElement.parentElement;
        cartItem.remove();
    }

    let products = getProductFromStorage();
    let updatedProducts = products.filter(product => {
        return product.id !== parseInt(cartItem.dataset.id);
    });
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    updateCartInfo();
}






















