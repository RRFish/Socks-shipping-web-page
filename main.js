Vue.component('product',{
    props:{
        premium:{
            type:Boolean,
            required:true
        },
        cart:{
            type:Array,
            required:true
        }
    },
    data(){
        return {
            product:"Socks",
            brand:'Vue Mastery',
            selectedVariant:0,
            altText:"A pair of socks",
            details:["80% cotton","20% polyester","Gender-natural"],
            variants:[
                {
                    variantId:2234,
                    variantColor:"green",
                    variantImage:"./assets/vmSocks-green-onWhite.jpg",
                    variantQuantity:10,
                    value:234,
                    describeation:"this is a green socks!!"
                },
                {
                    variantId:2235,
                    variantColor:"blue",
                    variantImage:"./assets/vmSocks-blue-onWhite.jpg",
                    variantQuantity:0,
                    value:300,
                    describeation:"this is a blue socks!!"
                },
            ],
            reviews:[]
        }
    },
    template:`
    <div class="product">
        <div class="product-image">
            <img v-bind:src="image" v-bind:alt="altText">
        </div>
        <div class="product-info">
            <h1>{{title}}</h1>
            <p>shipping: {{ shipping }}</p>
                <p v-if="inStock">In Stock</p>
            <p v-else>Out of Stock</p>
            <product-details :details="details"></product-details>
            <div class="color-box" 
                v-for="(variant, index) in variants" 
                :key="variant.variantId"
                :style="{ backgroundColor:variant.variantColor }"
                @mouseover="updateProduct(index)">
            </div>
            <button @click="addToCart"
                    :disabled="!inStock"
                    :class="{disabledButton:!inStock}">Add to cart
            </button>
            <button @click="removeToCart"
                    :disabled="cartEmpty"
                    :class="{disabledButton:cartEmpty}">Remove last
            </button>
        </div>
        <product-tabs :reviews="reviews"></product-tabs>
    </div>    
    `,
    computed:{
        title(){
            return `${this.brand} ${this.product}`;
        },
        image(){
            return this.variants[this.selectedVariant].variantImage;
        },
        inStock(){
            return this.variants[this.selectedVariant].variantQuantity;
        },
        cartEmpty(){
            if(this.cart.length==0) return true;
            else return false;
        },
        shipping(){
            if(this.premium){
                return "Free";
            }else{
                return 2.99;
            }
        }
    },
    methods:{
        addToCart(){
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId);
        },
        removeToCart(){
            this.$emit('remove-to-cart');
        }, 
        updateProduct(index){
            this.selectedVariant=index;
        }
    },
    mounted(){
        eventBus.$on('review-submitted', productReview => {
            this.reviews.push(productReview);
        })
    }
})
Vue.component('product-details',{
    props:["details"],
    template:`
    <ul>
        <li v-for="detail in details">{{detail}}</li>
    </ul>
    `
})
Vue.component('product-tabs',{
    props:{
        reviews:{
            type:Array,
            required:false
        }
    },
    data(){
        return{
            tabs:['Reviews','Make a Review'],
            selectedTab:'Reviews'
        }
    },
    template:`
    <div>
        <div>
            <span class='tab' 
                v-for="(tab,index) in tabs" 
                @click="selectedTab = tab" 
                :key="index"
                :class="{ activeTab: selectedTab === tab }"
            >{{ tab }}</span>
        </div>

        <div v-show="selectedTab === 'Reviews'">
            <p v-if="!reviews.length">There are no reviews yet.</p>
            <ul>
                <li v-for="review in reviews">
                <p>{{ review.name }}</p>
                <p>Rating: {{ review.rating }}</p>
                <p>{{ review.review }}</p>
                </li>
            </ul>
        </div>
        <div v-show="selectedTab === 'Make a Review'">
            <product-review></product-review>
        </div>   
    </div>
    `
})
Vue.component('product-review',{
    data(){
        return {
            name:null,
            review:null,
            rating:null,
            recommend:null,
            errors:[]
        }
    },
    template:`
    <div>
        <p v-if="errors.length">
            <b>Please correct the following error(s):</b>
            <ul>
                <li v-for="error in errors">{{ error }}</li>
            </ul>
        </p>
        <form class="review-form" @submit.prevent="onSubmit">
            <p>
                <label for="name">Name:</label>
                <input id="name" v-model="name" placeholder="name">
            </p>
            
            <p>
                <label for="review">Review:</label>      
                <textarea id="review" v-model="review"></textarea>
            </p>
            
            <p>
                <label for="rating">Rating:</label>
                <select id="rating" v-model.number="rating" >
                    <option>5</option>
                    <option>4</option>
                    <option>3</option>
                    <option>2</option>
                    <option>1</option>
                </select>
            </p>
            
            <p>
                Would you recommend this product.<br>
                Yes<input class="radio" type="radio" value="yes" v-model="recommend">　｜　
                No<input class="radio" type="radio" value="no" v-model="recommend"><br>
            </p>            

            <p>
                <input type="submit" value="Submit">  
            </p>



        </form>
    </div>

    `,
    methods:{
        onSubmit(){
            if(this.name && this.review && this.rating && this.recommend){
                let productReview={
                    name:this.name,
                    review:this.review,
                    rating:this.rating,
                    recommend:this.recommend
                }
                eventBus.$emit("review-submitted",productReview);
                this.name=null;
                this.review=null;
                this.rating=null;
                this.recommend=null;
            }else{
                if(!this.name) this.errors.push("Name required.");
                if(!this.review) this.errors.push("Review required.");
                if(!this.rating) this.errors.push("Rating required.");
                if(!this.recommend) this.errors.push("Recommendation required.");

            }

        }
    }

})

const eventBus = new Vue();
const app = new Vue({
    el:"#app",
    data:{
        premium:true,
        cart:[],
    },
    methods:{
        updateCart(id){
            this.cart.push(id);
        },
        deleteCart(){
            this.cart.pop();
        }
    }

})