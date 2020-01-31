<template>
    <main>
        <div class='container-fluid'>
            <div lass='row'>
                <div class='col-sm-3'></div>
                <div class='col-sm-6'>
                    <div class='a-section'>
                        <div class='a-spacing-top-medium'></div>
                        <h2 style='text-align: center'>Add a new Product</h2>
                        <form class=''>
                            <!-- Category DropDown -->
                            <div class='a-spacing-top-medium'>
                                <label>Category</label>
                                <select class='a-select-option' v-model='categoryID'>
                                    <option 
                                        v-for='category in categories' 
                                        :value='category._id' 
                                        :key='category._id'
                                    >
                                    {{ category.type }}
                                    </option>
                                </select>
                            </div>
                            <!-- Owner DropDown -->
                            <div class='a-spacing-top-medium'>
                                <label>Owner</label>
                                <select class='a-select-option' v-model='ownerID'>
                                    <option 
                                        v-for='owner in owners' 
                                        :value='owner._id' 
                                        :key='owner._id'
                                    >
                                    {{ owner.name }}
                                    </option>

                                </select>
                            </div>
                        <!-- Title Input -->
                        <div class='a-spacing-top-medium'>
                            <label style='margin-bottom: 0px'>Title</label>
                            <input type='text' class='a-input-text' style='width: 100%' v-model='title'/>
                        </div>
                         <!-- Price Input -->
                        <div class='a-spacing-top-medium'>
                            <label style='margin-bottom: 0px'>Price</label>
                           <input type='number' class='a-input-text' style='width: 100%' v-model='price'/>
                        </div>
                         <!-- Stock Quantity Input -->
                        <div class='a-spacing-top-medium'>
                            <label style='margin-bottom: 0px'>Stock Quantity</label>
                           <input type='number' class='a-input-text' style='width: 100%' v-model='stockQuantity'/>
                        </div>

                         <!-- Description TextArea -->
                        <div class='a-spacing-top-medium'>
                            <label style='margin-bottom: 0px'>Description</label>
                            <textarea placeholder='Provide a description for your product' style='width: 100%' v-model='description'></textarea>
                        </div>

                        <!-- Photo file -->
                        <div class='a-spacing-top-medium'>
                            <label style='margin-bottom: 0px'>Add Photo</label>
                            <div class='a-row a-spacing-top-medium'>
                                <label class='choosefile-button'>
                                    <i class='fal fa-plus'></i>
                                    <input type='file' @change='onFileSelected'>
                                    <p style='margin-top: -70px'>{{ fileName }}</p>
                                </label>
                            </div>
                        </div>
                        <!-- Add Product Button -->
                        <hr/>
                        <div class='a-spacing-top-large'>
                            <span class='a-button-register'>
                                <span class='a-button-inner'>
                                    <span class='a-button-text' @click='onAddProduct'>Add product</span>
                                </span>
                            </span>
                        </div>
                        </form>
                    </div>
                </div>
                <div class='col-sm-3'></div>
            </div>
        </div>
    </main>
</template>


<script>
    export default {
        async asyncData({ $axios }) { // asyncData is a process on the server side
            try {
                let categories = $axios.$get('http://localhost:3000/api/categories');
                let owners = $axios.$get('http://localhost:3000/api/owners');

                const [ categoryResponse, ownerResponse ] = await Promise.all([ // runs the two api's at the same time beacuse they are not dependent on one another -- we want it to run paralelly
                    categories,
                    owners
                ]);

                console.log('category response', categoryResponse, 'owner response', ownerResponse)

                return {
                    categories: categoryResponse.categories, // we are doing the dot notation because of our api response given to use 
                    owners: ownerResponse.owners
                }
            } catch (err) {
            console.log(err)
            }
        },
        
        data() { // data is process on the client side
            return {
                categoryID: null,
                ownerID: null,
                title: '',
                price: 0,
                description: '',
                selectedFile: null,
                fileName: '',
                stockQuantity: 1
            };
        },
        methods: {
            onFileSelected(event) { // it will select the file you chose and set it to this selected file
                this.selectedFile = event.target.files[0];
                //console.log(selectedFile)
                this.fileName = event.target.files[0].name;
            },

            async onAddProduct() {
                let data = new FormData(); // why do form data? because we are attaching a file rather than just text or numbers
                data.append('title', this.title)
                data.append('description', this.description)
                data.append('price', this.price)
                data.append('stockQuantity', this.stockQuantity)
                data.append('ownerID', this.ownerID)
                data.append('categoryID', this.categoryID)
                data.append('photo', this.selectedFile, this.selectedFile.name)

                let result = await this.$axios.$post('http://localhost:3000/api/products', data) // we are attatching the data to the axios post body -- the server will receive it and save it

                this.$router.push('/') // redirect them to the homepage
            }
        }
    }
</script>


<style>

</style>