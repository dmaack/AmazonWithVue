<template>
    <main>
        <div class='container-fluid c-section'>
            <div class='row'>
                <div class='col-sm-3'></div>
                <div class='col-sm-6'>
                    <div class='a-spacing-top-medium'></div>
                    <h2>Add a new Owner</h2>
                    <form>
                        <div class='a-spacing-top-medium'>
                    <!-- Name -->
                        <label>Name</label>
                        <input class='a-input-text' style='width: 100%' v-model='name'>
                    </div>
                     <div class='a-spacing-top-medium'>
                     <!-- About -->
                        <label>About</label>
                        <input class='a-input-text' style='width: 100%' v-model='about'>
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


                    <!-- Add Owner Button -->
                        <hr/>
                        <div class='a-spacing-top-large'>
                            <span class='a-button-register'>
                                <span class='a-button-inner'>
                                    <span class='a-button-text' @click='onAddOwner'>Add owner</span>
                                </span>
                            </span>
                        </div>


                    </form>
                    <br/>

                    <ul class='list-group-item'>
                     <li v-for='owner in owners' :key='owner._id'>{{ owner.name }}</li>
                    </ul>
                    

                </div>
                <div class='col-sm-3'></div>
            </div>
        </div>
    </main>
</template>

<script>
export default {
    async asyncData({ $axios }) { //if you want to populate the data on the page
        try {
            let res = await $axios.$get('http://localhost:3000/api/owners')

            return {
                owners: res.owners
            }
        } catch (err) {
            console.log(err)
        }
    },

    data() {
        return {
            name: '',
            about: '',
            selectedFile: null,
            fileName:''
        }
    },
    methods: {
         onFileSelected(event) { // it will select the file you chose and set it to this selected file
                this.selectedFile = event.target.files[0];
                //console.log(selectedFile)
                this.fileName = event.target.files[0].name;
            },
        async onAddOwner() {
            try {
                let data = new FormData();
                data.append('name', this.name);
                data.append('about', this.about);
                data.append('photo', this.selectedFile, this.selectedFile.name);
            
                let res = await this.$axios.$post('http://localhost:3000/api/owners', data);

           
                this.owners.push(this.name)
            
            } catch (err) {
                console.log(err)
            }
           
        }
    }
}
</script>