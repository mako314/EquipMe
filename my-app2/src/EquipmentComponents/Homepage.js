import React from 'react';
import 'tailwindcss/tailwind.css';

const HomePage = () => {
  return (
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
  );
};

export default HomePage;