export const state = () => ({
    // State
    cart: [],
    cartLength: 0,
    shippingPrice: 0,
    shippingEstimatedDelivery: ''
});

export const actions = {
    addProductToCart({ state, commit }, product) {
        const cartProduct = state.cart.find(prod => prod._id === product._id);

        if(!cartProduct) {
            commit('pushProductToCart', product);
        } else {
            commit('incrementProductQuantity', cartProduct)
        }

        commit('incrementCartLength');
    }
};

export const mutations = {
    pushProductToCart(state, product) {
        product.quantity = 1;
        state.cart.push(product);
    },

    incrementProductQuantity(state, product) {
        product.quantity++;
        let indexOfProduct = state.cart.indexOf(product);
        state.cart.splice(indexOfProduct, 1, product)
    },

    incrementCartLength(state) {
        state.cartLength = 0;
        if(state.cart.length > 0) {
            state.cart.map(product => {
                state.cartLength += product.quantity
            });
        }

        let indexOfProduct = state.cart.indexOf(cartProduct);
        state.cart.splice(indexOfProduct, 1, cartProduct);
    },
    /*
    1. remove the product quantity from the cartLength
    2. get the index of the product that we want to delete
    3. remove the product by using splice
    */
   removeProduct(state, product) {
       state.cartLength -= product.quantity;
       let indexOfProduct = state.cart.indexOf(product);
       state.cart.splice(indexOfProduct, 1);
   }, 

   setShipping(state, {price, estimatedDelivery}) {
       state.shippingPrice = price;
       state.shippingEstimatedDelivery = estimatedDelivery;
   },

   clearCart(state) { //after a successful payment, we want to clear the cart to it's original state
        state.cart = []
        state.cartLength = 0
        state.shippingPrice = 0
        state.shippingEstimatedDelivery = ''
   }
};

export const getters = {
    getCartLength(state) {
        return state.cartLength;
    },
    getCart(state) {
        return state.cart;
    },
    getCartTotalPrice(state) {
        let total = 0;
        state.cart.map(product => {
            total += product.price * product.quantity;
        });

        return total;
    },
    getCartTotalPriceWithShipping(state) {
        let total = 0;
        state.cart.map(product => {
            total += product.price * product.quantity;
        });

        return total + state.shippingPrice;
    },
    getEstimatedDelivery(state) {
        return shippingEstimatedDelivery;
    }
};