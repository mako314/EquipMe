import React, {useContext, useEffect} from 'react';
import 'tailwindcss/tailwind.css';
import { useNavigate } from 'react-router-dom';
import { UserSessionContext } from '../UserComponents/SessionContext';
// import UserContext from "../UserComponents/UserContext";
// import OwnerContext from '../OwnerComponents/OwnerContext';
import ApiUrlContext from '../Api';


function HomePage({ equipmentArray, setFeaturedRental }) {

    //I have not been in here forever!

    const featuredModel = "336E L";
    const navigate = useNavigate();
    const { currentUser, role } = UserSessionContext() 
    // const [user, setUser] = useContext(UserContext)
    // const[owner, setOwner] = useContext(OwnerContext)
    const apiUrl = useContext(ApiUrlContext)

    // console.log("Home Page User:",currentUser)

    function handleClick(e) {
        const test_item = equipmentArray?.filter((item) => {
            return item.model === featuredModel
        })
        navigate(`/equipment/${test_item[0].id}`)
        window.scrollTo(0, 0)
    }

    const handleClickLawnmowerClick = () => {
        const lawnMower = equipmentArray?.filter((item) => {
            return item.model === "HRX217VKA"
        })
        
        navigate(`/equipment/${lawnMower[0].id}`)
        window.scrollTo(0, 0)
    }

    const handleForkLiftClick = () => {
        const forkLift = equipmentArray?.filter((item) => {
            return item.model === "8FGCU25"
        })
        navigate(`/equipment/${forkLift[0].id}`)
        window.scrollTo(0, 0)
    }

    const handleTractorClick = () => {
        const tractor = equipmentArray?.filter((item) => {
            return item.model === "8R 410"
        })
        navigate(`/equipment/${tractor[0].id}`)
        window.scrollTo(0, 0)
    }

    // console.log(equipmentArray[116])

    // Featured item everything is hard coded btw
    const featuredThing =
        <section className="text-gray-600 body-font">
            <div className="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
                <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
                    <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">Check out our featured Rental
                        <br className="hidden lg:inline-block"></br>
                        <p> Before they're out of stock!</p>
                    </h1>
                    <p className="mb-8 leading-relaxed">
                        Looking to rent an excavator for your construction or mining project? Consider the 336E L Excavator by Caterpillar Inc. This robust and reliable model offers impressive digging capabilities and comes equipped with a comfortable operator cabin, ensuring efficiency and ease of operation. Rent the 336E L Excavator today to tackle your earth-moving tasks with confidence and precision
                    </p>
                    <div className="flex justify-center">
                        <button className="inline-flex text-white bg-amber-500 border-0 py-2 px-6 focus:outline-none hover:bg-gray-600 rounded text-lg" onClick={handleClick}>Rent</button>
                    </div>
                </div>
                <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6">
                    <img className="object-cover object-center rounded" alt="hero" src="https://www.trucksnl.com/pictures/ad-7355885-87863fddf344dc0d/crawler_excavator_caterpillar_336el_2014_7355885.jpg?format=jpg&quality=70&w=1110&h=832" />
                </div>
            </div>
        </section>


    // three item portion
    const threeItems =
        <div>
            <section className="text-gray-600 body-font">
                <div className="container px-5 py-24 mx-auto">
                    <div className="flex flex-col">
                        <div className="h-1 bg-gray-200 rounded overflow-hidden">
                            <div className="w-24 h-full bg-amber-500"></div>
                        </div>
                        <div className="flex flex-wrap sm:flex-row flex-col py-6 mb-12">
                            <h2 className="sm:w-2/5 text-gray-900 font-medium title-font text-2xl mb-2 sm:mb-0"> Together With our Partners, Dreams are Conquered.</h2>
                            <p className="sm:w-3/5 leading-relaxed text-base sm:pl-10 pl-0">Welcome to EquipMe, your ultimate renting and sharing platform for tools and equipment! Whether you're a DIY enthusiast, a homeowner, or a professional contractor, EquipMe offers a seamless and efficient way to access a wide range of tools and equipment for all your projects and tasks. Join our community today and experience the convenience of renting, sharing, and connecting with fellow users in need of the perfect tools for their next venture.</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap sm:-m-4 -mx-4 -mb-10 -mt-4">
                        <div className="p-4 md:w-1/3 sm:mb-0 mb-6">
                            <div className="rounded-lg h-64 overflow-hidden">
                                <img alt="Honda HRX217VKA Lawnmower" className="object-cover object-center h-full w-full cursor-pointer" onClick={handleClickLawnmowerClick} src="https://www.usatoday.com/gcdn/presto/2023/05/23/USAT/58538094-5018-47d0-8333-33d6835b9dbc-hondalawnmowerhero.png?crop=1436,1077,x349,y0" />
                            </div>
                            <h2 className="text-xl font-medium title-font text-gray-900 mt-5">Honda HRX217VKA Lawnmower</h2>
                            <p className="text-base leading-relaxed mt-2"> The Honda HRX217VKA Lawnmower, a powerful and efficient machine perfect for tackling any lawn size. Easy-to-use, it features self-propelled technology and a wide cutting deck for a seamless mowing experience.</p>
                            <span className="text-purple-500 inline-flex items-center mt-3 cursor-pointer" onClick={handleClickLawnmowerClick}>Learn More
                            <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 ml-2" viewBox="0 0 24 24">
                            <path d="M5 12h14M12 5l7 7-7 7"></path>
                            </svg>
                            </span>
                            {/* this needs to be a button */}
                        </div>
                        <div className="p-4 md:w-1/3 sm:mb-0 mb-6">
                            <div className="rounded-lg h-64 overflow-hidden">
                                <img alt="content" className="object-cover object-center h-full w-full cursor-pointer" onClick={handleForkLiftClick} src="https://st.mascus.com/image/product/large/discountforklift/toyota-8fgcu25,383008840d5d4f9f.jpg" />
                            </div>
                            <h2 className="text-xl font-medium title-font text-gray-900 mt-5">Toyota Material Handling 8FGCU25</h2>
                            <p className="text-base leading-relaxed mt-2">Toyota Material Handling 8FGCU25, a reliable and versatile forklift with a maximum lifting capacity of 5,000 pounds. Equipped with advanced safety features and smooth maneuverability, it's the ideal choice for handling heavy loads in various industrial settings.</p>
                            <span className="text-purple-500 inline-flex items-center mt-3 cursor-pointer" onClick={handleForkLiftClick}>Learn More
                            <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 ml-2" viewBox="0 0 24 24">
                            <path d="M5 12h14M12 5l7 7-7 7"></path>
                            </svg>
                            </span>
                            {/* this needs to be a button */}
                        </div>
                        <div className="p-4 md:w-1/3 sm:mb-0 mb-6">
                            <div className="rounded-lg h-64 overflow-hidden">
                                <img alt="John Deere 8R 410 Tractor" className="object-cover object-center h-full w-full cursor-pointer" onClick={handleTractorClick} src="https://www.deere.com/assets/images/region-4/products/tractors/row-crop-tractors/8r-8rt-row-crop-tractors/8r-410/8r_410_r4f063847_medium_b87e9556a84a3c95374c774923365e9425dd7f67.jpg" />
                            </div>
                            <h2 className="text-xl font-medium title-font text-gray-900 mt-5">John Deere 8R 410 Tractor</h2>
                            <p className="text-base leading-relaxed mt-2">
                            The John Deere 8R 410 is a robust and reliable tractor, perfect for a variety of farming tasks. With its advanced engine and user-friendly interface, it's designed to boost efficiency and comfort, making it a top choice for everyday fieldwork.
                            </p>
                            <span className="text-purple-500 inline-flex items-center mt-3 cursor-pointer" onClick={handleTractorClick}>Learn More
                            <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 ml-2" viewBox="0 0 24 24">
                            <path d="M5 12h14M12 5l7 7-7 7"></path>
                            </svg>
                            </span>
                            {/* this needs to be a button */}
                        </div>
                    </div>
                </div>
            </section>
        </div>

    //small tutorial for getting a rental or listing
    const tutorial =
        <div>
            <section className="text-gray-600 body-font">
                <div className="container px-5 py-24 mx-auto flex flex-wrap">
                    <div className="flex flex-wrap w-full">
                        <div className="lg:w-2/5 md:w-1/2 md:pr-10 md:py-6">
                            <div className="flex relative pb-12">
                                <div className="h-full w-10 absolute inset-0 flex items-center justify-center">
                                    <div className="h-full w-1 bg-gray-200 pointer-events-none"></div>
                                </div>
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-500 inline-flex items-center justify-center text-white relative z-10">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                                    </svg>
                                </div>
                                <div className="flex-grow pl-4">
                                    <h2 className="font-medium title-font text-sm text-gray-900 mb-1 tracking-wider">STEP 1 : GET STARTED</h2>
                                    <p className="leading-relaxed">Create an account to get renting, become a partner and start listing.</p>
                                </div>
                            </div>
                            <div className="flex relative pb-12">
                                <div className="h-full w-10 absolute inset-0 flex items-center justify-center">
                                    <div className="h-full w-1 bg-gray-200 pointer-events-none">
                                        
                                    </div>
                                </div>
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-500 inline-flex items-center justify-center text-white relative z-10">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                                    </svg>
                                </div>
                                <div className="flex-grow pl-4">
                                    <h2 className="font-medium title-font text-sm text-gray-900 mb-1 tracking-wider">STEP 2 : DISCOVER THE OPTIONS</h2>
                                    <p className="leading-relaxed">Explore a wide range of equipment and connect with experts offering their rentals.</p>
                                </div>
                            </div>
                            <div className="flex relative pb-12">
                                <div className="h-full w-10 absolute inset-0 flex items-center justify-center">
                                    <div className="h-full w-1 bg-gray-200 pointer-events-none"></div>
                                </div>
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-500 inline-flex items-center justify-center text-white relative z-10">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75" />
                                    </svg>
                                </div>
                                <div className="flex-grow pl-4">
                                    <h2 className="font-medium title-font text-sm text-gray-900 mb-1 tracking-wider">STEP 3 : RENT CONFIDENTLY</h2>
                                    <p className="leading-relaxed">Finalize your rental when both parties have both accepted.</p>
                                </div>
                            </div>
                            <div className="flex relative">
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-500 inline-flex items-center justify-center text-white relative z-10">
                                    <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                                        <path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
                                        <path d="M22 4L12 14.01l-3-3"></path>
                                    </svg>
                                </div>
                                <div className="flex-grow pl-4">
                                    <h2 className="font-medium title-font text-sm text-gray-900 mb-1 tracking-wider">STEP 4 : FINISH</h2>
                                    <p className="leading-relaxed">Pickup your equipment at an agreed upon location, or have it delivered to your worksite!</p>
                                </div>
                            </div>
                        </div>
                        <img className="lg:w-3/5 md:w-1/2 object-cover object-center rounded-lg md:mt-0 mt-12" src="https://www.westernstatescat.com/wp-content/uploads/2016/12/Jackson-Team.jpg" alt="step" />
                    </div>
                </div>
            </section>
        </div>


    const heroPart = 
<div className="bg-white pb-6 sm:pb-8 lg:pb-12">
    <br/>
  <section className="mx-auto max-w-screen-2xl px-4 md:px-8">
    <div className="mb-8 flex flex-wrap justify-between md:mb-16">
      <div className="mb-6 flex w-full flex-col justify-center sm:mb-12 lg:mb-0 lg:w-1/3 lg:pb-24 lg:pt-48">
        <h1 className="mb-4 text-4xl font-bold text-black sm:text-5xl md:mb-8 md:text-6xl">EquipMe <br/>Connect. Rent. Prosper.</h1>

        <p className="max-w-md leading-relaxed text-gray-500 xl:text-lg">Unleash the potential of your projects with EquipMe's collection of top-tier tools and equipment. Your one-stop destination for gear that's as passionate about your projects as you are.</p>
      </div>

      <div className="mb-12 flex w-full md:mb-16 lg:w-2/3">
        <div className="relative left-12 top-12 z-10 -ml-12 overflow-hidden rounded-lg bg-gray-100 shadow-lg md:left-16 md:top-16 lg:ml-0">
          <img src="https://media.istockphoto.com/id/143918313/photo/excavator-at-a-construction-site-against-the-setting-sun.jpg?s=612x612&w=0&k=20&c=1ULa8wwAxgczZDRpmVYuR-cC7wTpIWSZMzVhOCOgjr0=" loading="lazy" alt="Creator: Avalon_Studio | Credit: Getty Images Copyright: small_frog" className="h-full w-full object-cover object-center" />
        </div>

        <div className="overflow-hidden rounded-lg bg-gray-100 shadow-lg">
          <img src="https://www.deadlinenews.co.uk/wp-content/uploads/2022/09/zac-edmonds-N1LBcqLP9ec-unsplash-1024x683.jpg" loading="lazy" alt="Photo by Zac Edmonds on Unsplash" className="h-full w-full object-cover object-center" />
        </div>
      </div>
    </div>

  </section>
</div>





    return (
        <>
            {heroPart}
            {featuredThing}
            {threeItems}
            {tutorial}
        </>

    );
}

export default HomePage;








// <section className="">
//                 <div className="gap-16 items-center py-8 px-4 mx-auto max-w-screen-xl lg:grid lg:grid-cols-2 lg:py-16 lg:px-6">
//                     <div className="font-light  text-black dark:text-black-900">
//                         <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-black dark:text-black-900">We didn't reinvent the wheel</h2>
//                         <p className="mb-4">Unleash Your Potential with EquipMe Rentals!</p>
//                         <p>Get ready to conquer any project with our vast range of equipment and tools. From excavators to power tools, we've got it all! Find what you need, when you need it, and at unbeatable prices. Say goodbye to expensive purchases and hello to affordable rentals. Start exploring now and experience the ease and convenience of our rental services. Your next big project starts here!</p>
//                     </div>
//                     <div className="grid grid-cols-2 gap-4 mt-8">
//                         <img className="w-full rounded-lg" src="https://t3.ftcdn.net/jpg/01/59/19/32/240_F_159193220_m3b64OVIdlWiQrggEf6OqFRVOrEMAY4m.jpg" alt="excavator content 1" />
//                         <img className="mt-4 w-full lg:mt-10 rounded-lg" src="https://t4.ftcdn.net/jpg/03/13/91/39/240_F_313913951_YNI9FAsXnOwbk3ZftOFy8PveFlnpnl4B.jpg" alt="excavator and dump truck" />
//                     </div>
//                 </div>     
// </section>
