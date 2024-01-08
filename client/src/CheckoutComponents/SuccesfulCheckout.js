import React from "react";

function SuccesfulCheckout(){


    return(
        <div class="bg-white min-h-screen">
    <div class="mx-auto items-center container flex flex-col">
        <img src="https://i.imgur.com/9L7Tjf9.png" alt="Successful Checkout Image - Digital shopping cart with checkout items and a
            tick mark" class="w-80 mt-20"/>
        <p class="font-semibold text-2xl mt-10 text-gray-700">Thank you for your rental!</p>
        <p class="mt-10 text-gray-600 text-center max-w-lg">Your rental was successful and you will receive a confirmation
            email soon. If delivery was possible, we'll be in touch soon with the Owner to coordinate the delivery of your Equipment!</p>
        <div class="mt-20">
        <button fontfamily="Arial" type="submit" class="inline-flex border border-indigo-500 focus:outline-none
            focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 justify-center rounded-md py-2 px-4 bg-indigo-600
            text-sm font-medium text-white shadow-sm">Continue Shopping</button>
        </div>
    </div>
    </div>
        )
}

export default SuccesfulCheckout