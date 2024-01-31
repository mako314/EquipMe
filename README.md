<h1 align="center"> 🛠️ EquipMe: Your Local Tool & Equipment Rental Hub </h1> 

<h2 align="center">Welcome to EquipMe, where we connect neighbors and tools! 🌟</h2> 

<p align="center"> Our community-focused platform is all about making tool and equipment rental easy and accessible. Whether you're a handy homeowner, a creative DIYer, or a professional in need of specific equipment, EquipMe is your one-stop solution! </p> 

<p align="center">
  <img src="https://github.com/mako314/EquipMe/assets/119079347/52d418aa-fb35-4417-9678-22e66f5cda14" width="800">
</p>

## Motivation and Inspiration
### Growing Up in the Construction Industry: 
My journey with EquipMe began in my childhood, surrounded by the buzz of the construction industry. I often overheard conversations of my father and uncles discussing their need for specific equipment - something they needed for just a day or two but not enough to justify a purchase. This sparked a realization in me about the gap in the equipment rental market.

### Bridging a Market Gap: 
While aware of the rental services provided by larger companies like Home Depot, I noticed a significant missing piece - a platform that empowers individual contractors and equipment owners. The idea was not just about renting out equipment; it was about creating a community where equipment owners could earn additional income from tools that would otherwise sit idle.

### Empowering Owners and Renters: 
The concept of EquipMe came from the desire to cut out the middleman in the equipment rental process. By directly connecting homeowners or contractors who own tools with those who need them, EquipMe is more than a rental service; it's a community-driven marketplace.

## Problem Solving
### Ease of Access: 
The primary challenge I aimed to tackle with EquipMe was the complexity and inaccessibility of renting out equipment. Traditional methods often involved going through larger companies, which could be cumbersome and not always cost-effective.

### Creating a Marketplace: 
EquipMe is the intersection of a traditional marketplace and an equipment rental service, akin to what you'd get if Craigslist met an equipment rental store. It's about making the process as straightforward as shopping online, yet with the added trust and community feel of a local marketplace.

<p align="center">
  <em>Equipment Collection Page</em><br>
  <img src="https://github.com/mako314/EquipMe/assets/119079347/7f45df61-7b2f-4ee8-8a40-57cffa9f4c84" width="800"><br><br>
  <em>Equipment Display Page</em><br>
  <img src="https://github.com/mako314/EquipMe/assets/119079347/3574b92f-0646-409a-9f77-af70e35a5e3c" width="800">
</p>



### Community and Trust: 
By integrating features like ratings and reviews, EquipMe fosters a sense of community and trust. It's not just about transactions; it's about building relationships and a network of reliable, local equipment-sharing options.


## Front-End Development: Expanding Horizons Mastering React and Related Technologies

### Advanced Use of React Router DOM: 
While developing a larger application in React, I gained a deeper understanding of efficient navigation and routing. Additionally, I also learned about implementing location.state with React Router, further enhancing my skills in state management and user experience.

### Effective Context Management in React: 
I learned to proficiently use React Context for managing and passing around an API URL (also managed in a .env file), number of items ready for checkout and for session checking. This was crucial for maintaining a consistent state across the application, especially for user roles and current user information.

### Netlify Hosting and Optimization: 
Deploying the application on Netlify introduced me to new deployment strategies. I created a Netlify toml file for optimized server fetching, ensuring seamless transitions between local development and live updates.

### Global State Management: 
Utilizing global states for tracking user checkout items and equipment data proved essential for a seamless user experience. This approach allowed for real-time updates accessible across the entire application.

### Enhancing User Experience
Form Management and Validation: 
While using Formik and Yup for form validations, I realized the need to stay updated with newer front-end technologies. Recognizing Formik's limitations, I am open to learning about more current form management tools and welcome any recommendations.

### User and Owner Profiles: 
Creating distinct and interactive profiles for users and owners, complete with Google Maps API integration for location display, enhanced user engagement. These profiles included features like public information display, reviews, and favoriting functionality.


<p align="center">
  <em>EquipMe User Profile</em><br>
  <img src="https://github.com/mako314/EquipMe/assets/119079347/a6b18521-ad18-4751-a22a-06b0d3ec1b97" width="800"><br><br><br>
  <em>EquipMe Owner Profile</em><br>
  <img src="https://github.com/mako314/EquipMe/assets/119079347/b760afba-9be4-4f06-8af6-7c9585cba936" width="800">
</p>




### Unified Login and Registration Process: 
Implementing a single login and sign-up system for both user types streamlined the authentication process while maintaining role-specific functionalities.

### E-Commerce-like Components and Navigation: 
Developing collection and card components that mimic e-commerce sites, along with dynamic navigation, was crucial for user-friendly interfaces.

### Complete E-Commerce Workflow: 
Handling the entire e-commerce process, from adding items to the cart to post-rental reviews and agreement management, was a comprehensive learning experience. The integration of a unique system for creating and agreeing upon rental agreements added complexity and real-world applicability.

## Data Visualization and Dashboards
### Chart.js Integration: 
For owner dashboards, I implemented Chart.js to create dynamic doughnut and bar charts for tracking equipment and rental summaries. Learning to update these charts with real-time data was particularly challenging and rewarding.

### User Dashboards: 
Developing distinct dashboards for owners and users, each with role-specific features, was a significant undertaking that improved my skills in user interface design.

<p align="center">
  <em>EquipMe Owner Dashboard</em><br>
  <img src="https://github.com/mako314/EquipMe/assets/119079347/919c7b3c-c2eb-4cd2-91e6-e696ad523fff" width="800"><br><br><br>
  <em>EquipMe User Dashboard Home</em><br>
  <img src="https://github.com/mako314/EquipMe/assets/119079347/6fde57c9-e7f2-48c5-8566-b246053e8e63" width="800">
</p>


### In-House Messaging System
Creating a custom messaging system, including tables for inboxes, threads, and messages, was a unique challenge. This feature facilitated direct communication between users and owners, essential for negotiating and finalizing rental agreements.

<p align="center">
  <em>EquipMe Owner Inbox</em><br>
  <img src="https://github.com/mako314/EquipMe/assets/119079347/6c0db6f1-6dd8-46b9-a3f0-29fbe4466601" width="800"><br><br>
</p>

## Additional Front-End Features
### Google Maps API Integration: 
Extensive use of this API for owners, equipment, and users added a geographical dimension to the application.

### Loading States and UI Optimization: 
Implementing loading pages and state tracking for various actions significantly improved the UI/UX, providing users with visual feedback during operations.

### Stripe Integration for Secure Payments: 
Embedding Stripe pages ensured a secure and smooth checkout process, complemented by post-checkout payment records and display.

<p align="center">
  <em>EquipMe Stripe Checkout Page</em><br>
  <img src="https://github.com/mako314/EquipMe/assets/119079347/0cd5adab-1109-48ef-b221-ded76c412430" width="800"><br><br>
</p>

### Streamlining the Cart and Checkout Process: 
The development of a sophisticated system to manage multiple carts, rental durations, and pricing calculations was the most formidable task. This included implementing calendar components and real-time updates based on user actions.

### Bulk Data Upload via CSV: 
The ability to upload equipment data en masse via a CSV file upload functionality added an important feature for bulk data management.

<p align="center">
  <em>EquipMe Owner CSV Upload</em><br>
  <img src="https://github.com/mako314/EquipMe/assets/119079347/a22e4e60-f7ab-4ac8-bec3-3ce263e74a6c" width="800"><br><br>
</p>


## Back-End Development: A Deep Dive

### Database Management with Flask and SQLAlchemy: 
Managing 22 tables was a formidable challenge. I gained valuable experience in handling database errors, both locally and with an online database hosted on Render. This included tackling issues like mismatched migrations and managing nullable fields.

### User Authentication and Security: 
Implementing two user types (owners and regular users) was ambitious but rewarding. I used Flask-Bcrypt for hashing passwords and Flask-JWT-Extended for managing authentication tokens and cookies. This approach ensured secure user sessions and data handling, especially critical for sensitive operations like Stripe API transactions.

### Advanced Routing Techniques: 
Learning to route based on criteria other than IDs, such as profession and location, added a new layer of complexity. I also managed linked tables and routes to create a dynamic and responsive system. For example, an equipment piece could link to its status for quantity monitoring, with its state history tracking changes and a summary table providing an overview.

### Integrating Environmental Variables: 
Utilizing .env files for managing environment variables enhanced the security and flexibility of the application.

### Payment Processing with Stripe: 
The integration of Stripe for payment processing was a key learning area. This included understanding webhooks for handling payment intents and creating a payment record table. Although I initially experimented with SSE endpoints for real-time updates, compatibility issues led me to adapt the implementation.

### Owner and Equipment Management: 
Enabling owners to create a Stripe Express account upon registration allowed them to manage payments and listings effectively. This included features like equipment highlighting, pricing, and quantity management through table relationships.

### Simplifying User Experience for Renters: 
On the renter side, the primary focus was on streamlining the checkout process. This involved handling multiple line items and integrating with Stripe's checkout system to allow for multi-item transactions.

### Building a Contact Form with Email Integration: 
Developing a contact form that could send emails to my Gmail account was a novel and practical feature. This involved using EmailMessage, ssl (for creating a secure context), and smtplib.SMTP_SSL for secure email sending.



### Concluding Thoughts
The front-end development of EquipMe was a journey of discovery and innovation. From mastering React and its ecosystem to creating a user-friendly and interactive e-commerce experience, each aspect of the project added to my skillset. I learned not only the technicalities of front-end development but also the art of creating an engaging and intuitive user experience. This project was a testament to the importance of continual learning and adaptation in the ever-evolving field of web development.

The process of developing EquipMe was not just about mastering technical skills; it was also a journey in problem-solving, creativity, and perseverance. Each challenge, whether it was managing complex database relationships or integrating third-party APIs like Stripe, contributed to a deeper understanding of back-end development and its nuances. This project has been a testament to the power of learning through doing, and it has significantly enhanced my skills as a developer.



# How to Use EquipMe

### If You're Logged Out:
- **View Equipment Listings:** Browse through available equipment without logging in.

### For Users:
- **Account Creation and Sign In:** Create an account or sign in to access all features.
  <p align="center">
    <em>EquipMe User Sign Up</em><br>
    <img src="https://github.com/mako314/EquipMe/assets/119079347/87c27f1f-cc09-4df3-8185-6b54eacb7234" width="800"><br><br>
  </p>

- **Browsing:** Explore equipment listings and owner profiles.
  <p align="center">
    <em>EquipMe User View Owners</em><br>
    <img src="https://github.com/mako314/EquipMe/assets/119079347/451fe674-163c-4a7a-b6f3-eacd6d7fe474" width="800"><br><br>
  </p>

- **Adding to Cart:** Add items to different carts for various projects.
  <p align="center">
    <em>EquipMe User Create New Cart</em><br>
    <img src="https://github.com/mako314/EquipMe/assets/119079347/d21ba6de-ad1e-4d86-a3ac-ea8a5b37b4e5" width="800"><br><br>
  </p>

- **Rental Time Selection:** Choose from hourly, daily, or weekly rental durations.
  <p align="center">
    <em>EquipMe User Add to Cart</em><br>
    <img src="https://github.com/mako314/EquipMe/assets/119079347/0a9c7849-7998-4b33-a057-d21b2eceeb72" width="800"><br><br>
  </p>

- **Rental Agreement:** Form and manage rental agreements through your dashboard.
  <p align="center">
    <em>EquipMe User Dashboard Rental Agreements</em><br>
    <img src="https://github.com/mako314/EquipMe/assets/119079347/eaa7fc79-963d-4951-8627-0ca15eef9eff" width="800"><br><br>
  </p>
  
  <p align="center">
  <em>EquipMe User Dashboard Handle Rental Agreements</em><br>
  <img src="https://github.com/mako314/EquipMe/assets/119079347/6a5c0ebf-b339-457b-8abf-b89cf48101c9" width="800"><br><br>
  </p>

- **Checkout:** Proceed to checkout after accepting the rental agreement.
  <p align="center">
    <em>EquipMe User Carts </em><br>
    <img src="https://github.com/mako314/EquipMe/assets/119079347/0e7beed9-2174-4a9e-b91f-caa18788f459" width="800"><br><br>
  </p>



### For Owners:
- **Account Setup:** Sign up or log in and complete Stripe onboarding for payments.
  <p align="center">
    <em>EquipMe Owner Signup</em><br>
    <img src="https://github.com/mako314/EquipMe/assets/119079347/d4bd1a20-30f5-4288-b75f-7ca4eaa19226" width="800"><br><br>
  </p>

- **Equipment Upload:** Upload individual items or a CSV file for bulk listings.
  <p align="center">
    <em>EquipMe Owner CSV Upload</em><br>
    <img src="https://github.com/mako314/EquipMe/assets/119079347/1c479f06-8df3-4031-92f9-4d92c61a00fb" width="800"><br><br>
    <em>EquipMe Owner Listing Individual Items</em><br>
    <img src="https://github.com/mako314/EquipMe/assets/119079347/20263ed7-6b97-468a-9166-19f0c00dc137" width="800"><br><br>
  </p>

- **Dashboard Insights:** Access analytics and charts for your equipment.
  <p align="center">
    <em>EquipMe Owner Dashboard</em><br>
    <img src="https://github.com/mako314/EquipMe/assets/119079347/faa39cec-26d3-4ff0-86de-e0297e8eec01" width="800"><br><br>
  </p>

- **Stripe Onboarding and Rental Agreement Management:** 
  - Complete Stripe onboarding before renting out equipment.
    <p align="center">
      <em>EquipMe Dashboard Stripe Onboarding</em><br>
      <img src="https://github.com/mako314/EquipMe/assets/119079347/218b92c5-150a-47d5-8188-ed56d3a87d19" width="800"><br><br>
    </p>

  - Filter rental agreements by status and time created.
    <p align="center">
      <em>EquipMe Rental Agreements</em><br>
      <img src="https://github.com/mako314/EquipMe/assets/119079347/e0c59b5f-062f-4e90-80e2-a7728c648cf3" width="800"><br><br>
    </p>

  - Change delivery information if needed.
  - Accept or decline agreements.
  <p align="center">
    <em>EquipMe Owner Rental Agreement Handle Agreements</em><br>
    <img src="https://github.com/mako314/EquipMe/assets/119079347/a7be669b-96e8-4a41-bf0f-49bd55c7d73f" width="800"><br><br>
  </p>


### Global Features
- **Favorites:** Mark equipment, owners, and users as favorites for quick access.
  <p align="center">
    <em>EquipMe Dashboard Favorites</em><br>
    <img src="https://github.com/mako314/EquipMe/assets/119079347/c0ff2b1d-b3be-4072-ac12-cdf61b7361b8" width="800"><br><br>
  </p>

- **In-House Messaging System:** Facilitate communication through the dashboard messaging system.
  <p align="center">
    <em>EquipMe Inboxes </em><br>
    <img src="https://github.com/mako314/EquipMe/assets/119079347/3590b30d-cc06-4a32-97dd-aaed2eeb7f48" width="800"><br><br>
  </p>



# Credits
## Credits and Acknowledgements

This project was made possible thanks to a variety of open-source resources and contributions from the web development community. Special thanks to the following for their exceptional work:

- **Owner Profile Page:** Inspired by [Ketan's Tailwind Flex Profile](https://tailwindflex.com/@rp-ketan).
- **User Profile Page:** Based on the [Tailwind Starter Kit's React Profile Page](https://github.com/creativetimofficial/tailwind-starter-kit/blob/main/Profile%20Page/react-profile-page/src/views/Profile.js).
- **Product Cards and Footer:** Utilized components from [Tailblocks](https://tailblocks.cc/).
- **Login Form:** Adopted from [Wicked Blocks](https://wickedblocks.dev/groups/login/).
- **Input Error Styling:** Inspired by Meraki UI's Input Components, particularly style #7 ([Meraki UI](https://merakiui.com/components/inputs)).
- **Various Forms:** Integrated designs from [Flowrift](https://flowrift.com/c/form/bUtAg?view=preview).
- **Rental Card:** Adapted from [Meraki UI Cards](https://merakiui.com/components/cards).
- **Contact Modal:** Based on Flowbite's Components ([Flowbite Modal](https://flowbite.com/docs/components/modal/)).
- **Checkout Page Design:** Inspired by designs on [Harisha's Codepen](https://codepen.io/Harishash).
- **Shopping Cart:** Layout from [Tailwind Components](https://tailwindcomponents.com/component/shopping-cart-responsive).
- **Date-Time Selection:** Implemented HTML's `date-time-local` input type.
- **Reviews Section:** Testimonial component from [Tailspark](https://tailspark.co/?component=Testimonial) and [Tailspark Rental Agreements](https://tailspark.co/).
- **404 Page Design:** Creative 404 page design from [Meraki UI Marketing](https://merakiui.com/components/marketing/404-pages).
- **Order History Page:** Adapted from [Tailwind Template by Santosharron](https://tailwind-template-santosharron.netlify.app/components/ecommerce/components/order-history/).

Additionally, I'd like to acknowledge freeCodeCamp for their excellent guide on writing README files, which greatly assisted in the documentation of this project. You can find their guide here: [How to Write a Good README File](https://www.freecodecamp.org/news/how-to-write-a-good-readme-file/).

Thank you to all the creators and developers for their amazing work that has greatly contributed to this project.
