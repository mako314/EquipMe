import React from 'react';
import 'tailwindcss/tailwind.css';

function HomePage ({equipmentArray})  {

    console.log(equipmentArray[116])

    
    const featuredThing = 
    <section class="text-gray-600 body-font">
        <div class="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
            <div class="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
            <h1 class="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">Check out our featured Rental 
                <br class="hidden lg:inline-block"></br>
                <p> Before they're out of stock!</p>
            </h1>
            <p class="mb-8 leading-relaxed">
            Looking to rent an excavator for your construction or mining project? Consider the 336E L Excavator by Caterpillar Inc. This robust and reliable model offers impressive digging capabilities and comes equipped with a comfortable operator cabin, ensuring efficiency and ease of operation. Rent the 336E L Excavator today to tackle your earth-moving tasks with confidence and precision
            </p>
            <div class="flex justify-center">
                <button class="inline-flex text-white bg-amber-500 border-0 py-2 px-6 focus:outline-none hover:bg-gray-600 rounded text-lg">Rent</button>
                <button class="ml-4 inline-flex text-white bg-amber-500 border-0 py-2 px-6 focus:outline-none hover:bg-gray-600 rounded text-lg">Info</button>
                
            </div>
            </div>
            <div class="lg:max-w-lg lg:w-full md:w-1/2 w-5/6">
                <img class="object-cover object-center rounded" alt="hero" src="https://www.trucksnl.com/pictures/ad-7355885-87863fddf344dc0d/crawler_excavator_caterpillar_336el_2014_7355885.jpg?format=jpg&quality=70&w=1110&h=832"/>
            </div>
        </div>
    </section>

    const threeItems = 
    <div>
        <section class="text-gray-600 body-font">
            <div class="container px-5 py-24 mx-auto">
                <div class="flex flex-col">
                <div class="h-1 bg-gray-200 rounded overflow-hidden">
                    <div class="w-24 h-full bg-indigo-500"></div>
                </div>
                <div class="flex flex-wrap sm:flex-row flex-col py-6 mb-12">
                    <h1 class="sm:w-2/5 text-gray-900 font-medium title-font text-2xl mb-2 sm:mb-0"> Please Rent From us We're still Paying our Government Bailout</h1>
                    <p class="sm:w-3/5 leading-relaxed text-base sm:pl-10 pl-0">Welcome to EquipMe, your ultimate renting and sharing platform for tools and equipment! Whether you're a DIY enthusiast, a homeowner, or a professional contractor, EquipMe offers a seamless and efficient way to access a wide range of tools and equipment for all your projects and tasks. Join our community today and experience the convenience of renting, sharing, and connecting with fellow users in need of the perfect tools for their next venture.</p>
                </div>
                </div>
                <div class="flex flex-wrap sm:-m-4 -mx-4 -mb-10 -mt-4">
                <div class="p-4 md:w-1/3 sm:mb-0 mb-6">
                    <div class="rounded-lg h-64 overflow-hidden">
                    <img alt="content" class="object-cover object-center h-full w-full" src="https://i.ytimg.com/vi/QcUU78NLzPk/maxresdefault.jpg"/>
                    </div>
                    <h2 class="text-xl font-medium title-font text-gray-900 mt-5">Toro 20339 Lawnmower</h2>
                    <p class="text-base leading-relaxed mt-2">Toro 20339 Lawnmower, a powerful and efficient machine perfect for tackling any lawn size. Easy-to-use, it features self-propelled technology and a wide cutting deck for a seamless mowing experience.</p>
                    <a class="text-indigo-500 inline-flex items-center mt-3">Learn More
                    <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-2" viewBox="0 0 24 24">
                        <path d="M5 12h14M12 5l7 7-7 7"></path>
                    </svg>
                    </a> 
                    {/* this needs to be a button */}
                </div>
                <div class="p-4 md:w-1/3 sm:mb-0 mb-6">
                    <div class="rounded-lg h-64 overflow-hidden">
                    <img alt="content" class="object-cover object-center h-full w-full" src="https://st.mascus.com/image/product/large/discountforklift/toyota-8fgcu25,383008840d5d4f9f.jpg"/>
                    </div>
                    <h2 class="text-xl font-medium title-font text-gray-900 mt-5">Toyota Material Handling 8FGCU25</h2>
                    <p class="text-base leading-relaxed mt-2">Toyota Material Handling 8FGCU25, a reliable and versatile forklift with a maximum lifting capacity of 5,000 pounds. Equipped with advanced safety features and smooth maneuverability, it's the ideal choice for handling heavy loads in various industrial settings.</p>
                    <a class="text-indigo-500 inline-flex items-center mt-3">Learn More
                    <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-2" viewBox="0 0 24 24">
                        <path d="M5 12h14M12 5l7 7-7 7"></path>
                    </svg>
                    </a>
                    {/* this needs to be a button */}
                </div>
                <div class="p-4 md:w-1/3 sm:mb-0 mb-6">
                    <div class="rounded-lg h-64 overflow-hidden">
                    <img alt="content" class="object-cover object-center h-full w-full" src="https://m.media-amazon.com/images/I/51G5dELf0tL._AC_UF894,1000_QL80_.jpg"/>
                    </div>
                    <h2 class="text-xl font-medium title-font text-gray-900 mt-5">Laguna Tools REVO 18|36</h2>
                    <p class="text-base leading-relaxed mt-2">The Laguna Tools REVO 18|36 woodworking lathe for precision and versatility in your woodworking projects. With its spacious capacity and user-friendly controls, this lathe is perfect for both beginners and experienced woodworkers alike.
                    </p>
                    <a class="text-indigo-500 inline-flex items-center mt-3">Learn More
                    <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-2" viewBox="0 0 24 24">
                        <path d="M5 12h14M12 5l7 7-7 7"></path>
                    </svg>
                    </a>
                    {/* this needs to be a button */}
                </div>
                </div>
            </div>
        </section>
    </div>


const tutorial = 
<div>
    <section class="text-gray-600 body-font">
    <div class="container px-5 py-24 mx-auto flex flex-wrap">
        <div class="flex flex-wrap w-full">
        <div class="lg:w-2/5 md:w-1/2 md:pr-10 md:py-6">
            <div class="flex relative pb-12">
            <div class="h-full w-10 absolute inset-0 flex items-center justify-center">
                <div class="h-full w-1 bg-gray-200 pointer-events-none"></div>
            </div>
            <div class="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-500 inline-flex items-center justify-center text-white relative z-10">
                <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
            </div>
            <div class="flex-grow pl-4">
                <h2 class="font-medium title-font text-sm text-gray-900 mb-1 tracking-wider">STEP 1</h2>
                <p class="leading-relaxed">VHS cornhole pop-up, try-hard 8-bit iceland helvetica. Kinfolk bespoke try-hard cliche palo santo offal.</p>
            </div>
            </div>
            <div class="flex relative pb-12">
            <div class="h-full w-10 absolute inset-0 flex items-center justify-center">
                <div class="h-full w-1 bg-gray-200 pointer-events-none"></div>
            </div>
            <div class="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-500 inline-flex items-center justify-center text-white relative z-10">
                <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                </svg>
            </div>
            <div class="flex-grow pl-4">
                <h2 class="font-medium title-font text-sm text-gray-900 mb-1 tracking-wider">STEP 2</h2>
                <p class="leading-relaxed">Vice migas literally kitsch +1 pok pok. Truffaut hot chicken slow-carb health goth, vape typewriter.</p>
            </div>
            </div>
            <div class="flex relative pb-12">
            <div class="h-full w-10 absolute inset-0 flex items-center justify-center">
                <div class="h-full w-1 bg-gray-200 pointer-events-none"></div>
            </div>
            <div class="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-500 inline-flex items-center justify-center text-white relative z-10">
                <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
                <circle cx="12" cy="5" r="3"></circle>
                <path d="M12 22V8M5 12H2a10 10 0 0020 0h-3"></path>
                </svg>
            </div>
            <div class="flex-grow pl-4">
                <h2 class="font-medium title-font text-sm text-gray-900 mb-1 tracking-wider">STEP 3</h2>
                <p class="leading-relaxed">Coloring book nar whal glossier master cleanse umami. Salvia +1 master cleanse blog taiyaki.</p>
            </div>
            </div>
            <div class="flex relative pb-12">
            <div class="h-full w-10 absolute inset-0 flex items-center justify-center">
                <div class="h-full w-1 bg-gray-200 pointer-events-none"></div>
            </div>
            <div class="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-500 inline-flex items-center justify-center text-white relative z-10">
                <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
                </svg>
            </div>
            <div class="flex-grow pl-4">
                <h2 class="font-medium title-font text-sm text-gray-900 mb-1 tracking-wider">STEP 4</h2>
                <p class="leading-relaxed">VHS cornhole pop-up, try-hard 8-bit iceland helvetica. Kinfolk bespoke try-hard cliche palo santo offal.</p>
            </div>
            </div>
            <div class="flex relative">
            <div class="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-500 inline-flex items-center justify-center text-white relative z-10">
                <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
                <path d="M22 4L12 14.01l-3-3"></path>
                </svg>
            </div>
            <div class="flex-grow pl-4">
                <h2 class="font-medium title-font text-sm text-gray-900 mb-1 tracking-wider">FINISH</h2>
                <p class="leading-relaxed">Pitchfork ugh tattooed scenester echo park gastropub whatever cold-pressed retro.</p>
            </div>
            </div>
        </div>
        <img class="lg:w-3/5 md:w-1/2 object-cover object-center rounded-lg md:mt-0 mt-12" src="https://dummyimage.com/1200x500" alt="step"/>
        </div>
    </div>
    </section>
</div>




return (
    <div>
    <section className="bg-white dark:bg-gray-900">
    <div className="gap-16 items-center py-8 px-4 mx-auto max-w-screen-xl lg:grid lg:grid-cols-2 lg:py-16 lg:px-6">
        <div className="font-light text-gray-500 sm:text-lg dark:text-gray-400">
        <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">We didn't reinvent the wheel</h2>
        <p className="mb-4">Unleash Your Potential with EquipMe Rentals!</p>
        <p>Get ready to conquer any project with our vast range of equipment and tools. From excavators to power tools, we've got it all! Find what you need, when you need it, and at unbeatable prices. Say goodbye to expensive purchases and hello to affordable rentals. Start exploring now and experience the ease and convenience of our rental services. Your next big project starts here!</p>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-8">
        <img className="w-full rounded-lg" src="https://t3.ftcdn.net/jpg/01/59/19/32/240_F_159193220_m3b64OVIdlWiQrggEf6OqFRVOrEMAY4m.jpg" alt="excavator content 1"/>
        <img className="mt-4 w-full lg:mt-10 rounded-lg" src="https://t4.ftcdn.net/jpg/03/13/91/39/240_F_313913951_YNI9FAsXnOwbk3ZftOFy8PveFlnpnl4B.jpg" alt="excavator and dump truck"/>
        </div>
    </div>
    </section>

    {featuredThing}
    {threeItems}
    </div>

    
);
}

export default HomePage;