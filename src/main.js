//selecting elements
const categoryBtns = document.getElementById('section-category-btn');
const petContainer = document.getElementById('pet-container');
const petLikedContainer = document.getElementById('pet-selected');
const loading = document.getElementById('loading');
const modal = document.getElementById('my-modal');
const modal2 = document.getElementById('my-modal-2');
const sortBtn = document.getElementById('sort-btn');


// fetch data using url
async function fetchData(url) {
    try {
        const response = await fetch(url)

        if(!response.ok){
            throw new Error("Network response was not okay!")
        }
        const data = await response.json();
       return data;
    } catch (error) {
        console.log(error)
    }
    
}


// display category
async function displayingCategory() {
    const url = 'https://openapi.programming-hero.com/api/peddy/categories';
    const data = await fetchData(url);
    
    if(data){
        categoryBtns.innerHTML = ''
        data.categories.forEach(pet => {
            const {category, category_icon: icon} = pet;
           categoryBtns.innerHTML += `
            <div class="flex gap-3 items-center justify-center border md:px-2 px-1 md:py-4 py-2 rounded-xl category-btn cursor-pointer" data-category=${category}>
            <img src="${icon}" alt="category_icon">
            <h3 class="font-bold text-lg">${category}</h3>
            </div>
            `            
            });
            
    }

    const categoryElements = document.querySelectorAll('.category-btn');
    
    categoryElements.forEach(btn => {
        btn.addEventListener('click', ()=> {
        
            categoryElements.forEach(element => {
                element.classList.remove('active-category')
            })

            btn.classList.add('active-category')
            loading.classList.remove('hidden');
            petContainer.innerHTML = '';

             setTimeout(() => {
                loading.classList.add('hidden')
                 displayPet(btn.getAttribute('data-category'))
             }, 2000)
            
        })
    })
}
displayingCategory();


// displaying  pet
async function displayPet(selectedCategory = null){
    const url = "https://openapi.programming-hero.com/api/peddy/pets";
    const data = await fetchData(url);

    
    petContainer.classList.add('grid')
   
    const filterPets = selectedCategory ? data.pets.filter(pet => pet.category == selectedCategory) : data.pets

    if(filterPets.length === 0){
        petContainer.classList.remove('grid');
        sortBtn.classList.add('hidden')
        petContainer.innerHTML = `
            <div class="flex flex-col justify-center items-center bg-gray-100 rounded-2xl h-80 py-52">
                <img src="../images/error.webp" alt="error png" class="md:w-32 w-20" />
                <h2 class="md:text-2xl text-lg font-bold my-3 ">No information available</h2>
                <p class="text-gray-500 md:text-base text-sm px-4 mx-auto">Oops! It looks like there are no pets available in the category right now. Please try again later.</p>
            </div>
        `
    }

    else{
        sortBtn.classList.remove('hidden')
            renderPets(filterPets)
            soringPetDecendingOrder(filterPets)
       
            
    }
}
displayPet();


// rendering pet cards
function renderPets(filterPets){
   let petHtml = '';
    petContainer.innerHTML = ''
    
    filterPets.forEach(pet => {
        const {image, pet_name: name, breed, date_of_birth: birth, gender, price} = pet;

         petHtml += `
             <div class="card shadow-lg p-4 border">
                 <figure>
                     <img
                     src="${image}"
                     alt="Shoes" class="rounded-2xl pet-img w-full" />
                 </figure>
                 <div class="card-body px-0 pb-0 -mt-4">
                     <h2 class="card-title font-bold">${name ? name : 'Not available'}</h2>

                   <div class="flex gap-2">
                     <img src="../images/Frame.png" alt="icon" class="w-6 h-6" /> 
                     <p class="text-gray-500 font-bold text-sm">Breed: ${breed ? breed : 'Not available'}</p>
                   </div>

                   <div class="flex gap-2">
                     <img src="../images/Frame2.png" alt="icon" class="w-6 h-6" />
                     <p class="text-gray-500 font-bold text-sm">Birth: ${birth ? birth : 'Not available'}</p>
                  </div>

                  <div class="flex gap-2">
                     <img src="../images/Frame3.png" alt="icon" class="w-6 h-6" /> 
                     <p class="text-gray-500 font-bold text-sm">Gender: ${gender ? gender : 'Not available'}</p>
                   </div>

                 <div class="flex gap-2">
                     <img src="../images/Frame4.png" alt="icon" class="w-6 h-6" />
                     <p class="text-gray-500 font-bold text-sm">Price: ${price ? price + '$' : 'Not available'}</p>
                 </div>

                     <div class="flex justify-between gap-2 -ml-1">
                     <button class="border text-xl font-bold py-1 px-2 rounded-md pet-items">
                         <svg 
                             xmlns="http://www.w3.org/2000/svg" 
                             width="28" height="28" 
                             viewBox="0 0 24 24" 
                             fill="none" stroke="currentColor" 
                             stroke-width="1.5" stroke-linecap="square" stroke-linejoin="round"
                             class="pet-icon">

                              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z">
                             </path>
                         </svg>
                     </button>
                     <button class="border text-base font-bold py-1 px-2 rounded-md text-primary adopt">Adopt</button>
                     <button class="border text-base font-bold py-1 px-2 rounded-md text-primary details">Details</button>
                     </div>
                     
                 </div>
             </div>
         `

        })
        
        petContainer.innerHTML = petHtml
        const petItems = document.querySelectorAll('.pet-items');
            const petImg = document.querySelectorAll('.pet-img');
            const petIcon = document.querySelectorAll('.pet-icon');
            const detailsBtn = document.querySelectorAll('.details');
            const adoptedBtn = document.querySelectorAll('.adopt')
             
            likedPet(petItems, petImg, petIcon);
            displayDetails(detailsBtn, filterPets);
            petAdopted(adoptedBtn)
}


// liked pet
function likedPet(btns, img, icon){
    
    btns.forEach((btn, i) => {
        btn.addEventListener('click', ()=> {
            icon[i].setAttribute('fill', '');
            displayLikedImage(img[i].src)
        })
    })
}

function displayLikedImage(url){
    petLikedContainer.innerHTML += `
        <img src="${url}" class="rounded-xl"/>
    `
}

// handling pet Adopeted button
function petAdopted(adopt){

    const countDownElement = document.getElementById('count');
    adopt.forEach(adopting=> {
        adopting.addEventListener('click', ()=> {
            modal2.showModal();

            let count = 4;
            const timer = setInterval(function() {
                count--;
                countDownElement.innerHTML = count;
           
                if (count === 0) {
                    clearInterval(timer);
                    modal2.close();
                    
                    adopting.disabled = true;
                    adopting.classList.remove('text-primary')
                    adopting.classList.add('bg-gray-100', 'text-gray-500', 'cursor-not-allowed');
                    adopting.textContent = 'Adopted'
                }
            }, 1000);
        })
    })
}

// display details about pet when clicked on the details button
function  displayDetails(detailsBtn, arr){

    soringPetDecendingOrder(arr)

    detailsBtn.forEach((btn, i) => {

        btn.addEventListener('click', (e)=> {
            
        const {image, pet_name: name, breed, date_of_birth: birth, gender, price, vaccinated_status, 
            pet_details: details } = arr[i];

        modal.innerHTML = `
            <div class="modal-box w-3/5 max-w-5xl">        
                    <figure>
                        <img
                        src="${image}"
                        alt="Shoes" class="rounded-2xl pet-img w-full" />
                    </figure>
                    <div class="card-body px-0 pb-0 -mt-4">
                        <h2 class="card-title font-bold">${name ? name : 'Not available'}</h2>

                     <div class="grid grid-cols-2 md:w-4/5">
                      <div class="flex gap-2">
                        <img src="../images/Frame.png" alt="icon" class="w-6 h-6" /> 
                        <p class="text-gray-500 font-bold text-sm">Breed: ${breed ? breed : 'Not available'}</p>
                      </div>

                      <div class="flex gap-2">
                        <img src="../images/Frame2.png" alt="icon" class="w-6 h-6" />
                        <p class="text-gray-500 font-bold text-sm">Birth: ${birth ? birth : 'Not available'}</p>
                     </div>

                     <div class="flex gap-2">
                        <img src="../images/Frame3.png" alt="icon" class="w-6 h-6" /> 
                        <p class="text-gray-500 font-bold text-sm">Gender: ${gender ? gender : 'Not available'}</p>
                      </div>
                   
                     <div class="flex gap-2">
                        <img src="../images/Frame4.png" alt="icon" class="w-6 h-6" />
                        <p class="text-gray-500 font-bold text-sm">Price: ${price ? price + '$' : 'Not available'}</p>
                     </div>

                     <div class="flex gap-2">
                        <img src="../images/Frame3.png" alt="icon" class="w-6 h-6" /> 
                        <p class="text-gray-500 font-bold text-sm">Vaccinated status: ${vaccinated_status ? vaccinated_status : 'Not'} </p>
                      </div>
                    </div>

                    <hr class="mt-5 mb-5 border-t-2 border-gray-300">

                    <div>
                        <h3 class="text-base font-bold mb-3">Details Information</h3>
                        <p class="text-gray-500 ">${details}</p>
                    </div>

                    <div class="mt-8">
                        <form method="dialog">
                            <button class="btn btn-block link-hover border-none bg-gray-200">Cancel</button>
                        </form>
                    </div>
            </div>
            `
            modal.show()
            
        })
    })
}

// sorting pet with decending order
function soringPetDecendingOrder(arr){
    const sortedArr = [...arr].sort((a,b) => b.price - a.price)
    sortBtn.addEventListener('click', ()=> renderPets(sortedArr))
}