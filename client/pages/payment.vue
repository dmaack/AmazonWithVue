<template>
  <!--MAIN-->
  <main>
    <!--Payment -->
    <div class="registerAddress mt-3">
      <div class="container-fluid c-section">
        <div class="row">
          <div class="col-sm-3"></div>
          <div class="col-sm-6">
            <div class="a-section a-spacing-medium">
              <!-- Breadcrumbs -->
              <div class="a-subheader a-breadcrumb a-spacing-small">
                <ul>
                  <li>
                    <nuxt-link to="/cart">
                      <span>Your Cart</span>
                    </nuxt-link>
                  </li>
                  <li class="a-breadcrumb-divider">›</li>
                  <li>
                    <nuxt-link to="/placeorder">
                      <span>Place order</span>
                    </nuxt-link>
                  </li>
                  <li class="a-breadcrumb-divider">›</li>
                  <li class="active">
                    <nuxt-link to="/payment">
                      <span>Payment</span>
                    </nuxt-link>
                  </li>
                </ul>
              </div>
            </div>
            <div class="a-section">
              <h2>Make a payment</h2>
              <div class="a-section a-spacing-none a-spacing-top-small">
                <b>The total price is ${{ getCartTotalPriceWithShipping }}</b>
              </div>

              <!-- Error message  -->
              <div class="a-section a-spacing-none a-spacing-top-small">
                <b>Error</b>
              </div>
              <form action="#" method="post">
                <div class="a-spacing-medium a-spacing-top-medium">
                  <div class="a-spacing-top-medium">
                    <!-- Stripe card -->
                    <div ref='card'></div>

                    <!-- End of Stripe card -->
                  </div>

                  <div class="a-spacing-top-medium"></div>
                  <hr />
                  <div class="a-spacing-top-medium">
                    <span>
                      <b>Make sure your address is correct</b>
                    </span>
                  </div>
                  <div>
                    <span>If the address contains typos or other errors, your package may be undeliverable.</span>
                  </div>

                  <!-- Purchase Button -->
                  <div class="a-spacing-top-large">
                    <span class="a-button-register">
                      <span class="a-button-inner">
                        <span @click='onPurchase' class="a-button-text">Purchase</span>
                      </span>
                    </span>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div class="col-sm-3"></div>
        </div>
      </div>
    </div>
    <!--/Payment ADDRESS-->
  </main>
  <!--/MAIN-->
</template>

<script>
import { mapGetters } from 'vuex'
    export default {
        // local state
        data() {
            return {
                error: '',
                stripe: null, // we are setting the stripe variable to the stripe object. Because we imported the stripe library, we can now access the stripe object and pass in public key
                cart: null
            };
        }, 
        // computed property
        computed: {
            ...mapGetters(['getCart', 'getCartTotalPriceWithShipping', 'getEstimatedDelivery'])
        },
        //similar to componentDidMount -- generally making an Axios/fetch call to initialize data in your component from BE
        mounted() {
               this.stripe = Stripe('pk_test_h1PiAqFdpVJpFn9xYKA1JEX7008fXbJlqI') // if the public key is valid we can access the elements from stripe
               let elements = this.stripe.elements(); // the elements will create an input field which we are calling card
               this.card = elements.create('card'); // then we set it to this.card
               this.card.mount(this.$refs.card) // then we mount it on the card based on the ref which is used in the html ref for the card input -- it has to be the same name that you are referencing in the line 48 div ref
            },
            // what you fallback on in Vue when computed properties and watchers dont fit your use-case -- similar to react
            methods: {
                async onPurchase() { // look at line 68
                    try {
                        let token = await this.stripe.createToken(this.card); // stripe will bundle up all the card information and will encrypt the information into a token for safety

                        let response = await this.$axios.$post('/api/payment', {
                            token: token,
                            totalPrice: this.getCartTotalPriceWithShipping,
                            cart: this.getCart,
                            estimatedDelivery: this.getEstimatedDelivery 
                        }); // after we attatch this to the api's body 

                        if(response.success) { // if response is a success...then
                            // Do something like redirect to order page
                            this.store.commit('clearCart'); // this reverts the cart to it's original state
                            this.$router.push('/order') 
                        }

                    } catch (err) {
                        console.log(err)
                    }
                }
            }
    }
</script>


<style>
.StripeElement {
  box-sizing: border-box;

  height: 40px;

  padding: 10px 12px;

  border: 1px solid transparent;
  border-radius: 4px;
  background-color: white;

  box-shadow: 0 1px 3px 0 #e6ebf1;
  -webkit-transition: box-shadow 150ms ease;
  transition: box-shadow 150ms ease;
}

.StripeElement--focus {
  box-shadow: 0 1px 3px 0 #cfd7df;
}

.StripeElement--invalid {
  border-color: #fa755a;
}

.StripeElement--webkit-autofill {
  background-color: #fefde5 !important;
}
</style>