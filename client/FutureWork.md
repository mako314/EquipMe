-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------EQUIPMENT IN ITSELF------------------------------------------------------------------------------------
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Want to add:

1. Pictures for Equipment, be it an image link or an actual UPLOAD that is tied to their profile somehow?

2. Allow individuals to upload their equipment as a CSV, XML, etc and have pandas read and upload it the way I have done with the seed file.

3. Delivery, along with a radius finder, maybe google maps indiciator on the Product/Equipment display page showing where the equipment is located to help an individual understand (maybe use raidus here too if people do not want to disclose their location online)

4. Deposits, a way to somewhat secure actual serious renters and deter people from taking rental availability. (ADD TO MODELS)

5. Show a rental based on if the Equipment is available or not, meaning everytime a rental agreement gets signed -1 or -x amount of equipment. Have a way to rent more than one piece of equipment, like check the available equipment to the input of how many one would like to rent.
(Basically allowing renting of multiple pieces of equipment, if you need two forklifts, you can rent two forklifts) (THIS MATH MAY NEED TO BE DONE IN FRONT END, EXPERIMENT.)

<!-- ^^^ Once rental agreements are done, I'll get more into this type of functionality 
         So make the rental agreements display, dashboard, etc, and then worry about this.
-->

6. Rental costs, can be per hour, by day, by week, month. Think I will cap it per month
(promotional offers allocation?) (IN MODELS?)

7. Including a calendar and booking dates. Find a way to incorporate a real calendar that has availability, with informing the user of when a delivery could take place, along with notifications of delivery (Order received, enroute, delivered) Allow for notifications of when delivery needs to be returned, these can be custom similar to google calendar notification system is ideal. (MODELS?)

8. Time expiry, meaning if the equipments rental date has passed, and the owner has confirmed the returning of the delivery equipment, the equipment becomes available once again

9. Document uploading
10. Require authorization to post Equipment (proof of ownership)
11. Terms and conditions (basic, but can allow for owners to input their own)

12. When searching and hitting enter, find a way (maybe a search-results page?) that kind of fetches the data and outputs what an individual could be looking for. Could be through the equipment for example, or the owners "partners"


Sometimes text color is bugging on navbar if you move too quickly, need to find a solution for this.

13. Need a way to favorite, and possibly have reviews displayed on the Equipment?

14. Make rent now take you to rental prepop if signed in, additionally have that be really the only way you can get there, otherwise the flow doesn't make much sense


-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------USER IN ITSELF---------------------------------------------------------------------------------------------------
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

1. Profile page with favorites, possily separate from their actual user profile where owners can check reviews / leave reviews

2. REVIEWS AND COMMENTS, STAR RATING

3. Incorporate their rental agreements in a drop down menu, allow them to select from existing, previous, and possibly future ones.
Individuals should be able to view their rental agreements based on a date format 30-60-90-180-360

4. Users should have a way to favorite equipment and owners of said equipment. 
That being said, how should this be accounted for? a new model that indicates a user has favorited the piece of equipment or the owner? 

Cause ideally the user can favorite many equipments but there's 1 piece of equipment they favorite for that instance;

user - > favorite action < - item being favorited?
This would be similar for favoriting the owner. 

The user should not have only one person and one equipment favorited so there needs to be a way to favorite multiple.

Possibly allow the user to upload a worksite? Might be too extra tbh.


5. https://tailwindui.com/components/application-ui/page-examples/detail-screens
This page above looks amazing in terms of keeping track of their rentals and such

We can measure the rentals they currently have, documents that were uploaded for the rental, and the delivery progress if applicable.

6. I thought about something for users while in the shower but forgot... pain

7. Conversion rates, like how often a user actually goes through the rental agreement, then need to inquire about how often a user rents, so we can produce leads for owners to reach out.

FIN----

1. Incorporated useContext for User login authentication. Making sure that I have the user info everywhere with the way it's wrapped within my app! 
Lets go!!!

2. 
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------NAVBAR ITSELF--------------------------------------------------------------------------------------------------
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

1. Reinvented the navbar to actually look nice, included the search bar, added a mobile view and such.

2. So ideally, I want the search to not only be on change, but also an on submit if possible. When the search is submitted it takes one to a search result page that can show them what they're looking for, be it partners, or be it specific equipment.

Still need a possible location to have the search be sent to, so a search result page is in order.

3. Navbar is looking nice, still on the fence for a result page, will shelf it for now

-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-----------------------------------------------------------------------------Rental Agreements ITSELF------------------------------------------------------------------------------------------
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

1. Along with documentation upload, I'd like to make a nice card that reflects on the users dashboard / profile. When clicked it'll populate with the rental agreements that user currently has. Ideally they'd never be able to delete rental agreements (Unless one was submitted incorrectly, a new agreement was reached)

2. I'd like to incorporate a sort of message system for users to discuss with partners about rental agreements.

3. 3 way system:
3.1 Show interest, reach out. 
3.2 After reaching out, discuss, send rental agreement to partner. 
3.3 After partner accepts the rental agreement is formed.


4. Find a way to upload documents to the rental agreement, take deposits in, and from there it can be submitted.
4.1 Both the Renter and the Owner need to have the following:
Proof of renters insurance (Renter)
Proof of Owners equipment insurance (Owner)
Proof of Ownership (Owner) <--This should likely not be visible to the renter, but to a site admin-->

5. Include a created at date, updated at.


6. Need a (formik setvalues like done in hobby wars), to pre-populate information for a user trying to rent an equipment.

7. Need to make nice rental agreement cards, that way they are legible to read and indivdiuals can edit.
7.1 How should editing the agreement work? 
User requests to edit -> submits edits for review to owner 
Owner can approve or deny edits -> user informed, from there they can discuss where to go. So will likely need to add comments to the agreement form.

Owner requests to edit -> (Why would they? Maybe piece broke from previous use?) -> send to user, user has options to receive deposit back, or accept the changes
Sent to owner as confirmation, from there the agreement continues

7.2 Deleting the agreement
Will have to implement a date function that takes into account how soon the renter can cancel, for example, if the renter wants to rent a piece of equipment the next day, how early would they have to cancel? Do they forfeit the deposit? 

Owner, have to find a way to safeguard users so the owner cannot just collect deposits, after Owners have done too many cancellations / deletions, send a flag basically. If the equipment has been completely removed, maybe submit an inquiry? 

Regardless, terms and conditions will have to be built that both parties are required to comply to.


8. Make this all into a presentable document, a short card that can be expanded to the dashboard for that individual rental agreement.
8.1 Remember, it will have to track delivery, be available for edits, host comments, and have a check for delivered, received, in progress of using?, and returned.


9. Need to fix rentalForm so that when a piece of equipment is clicked, the owner can be taken there with the form prepopulated. 
May incoroporate a way to just filter the way I currently have it also, meaning they can select an owner and or select a type of Equipment and see available rentals from there. 

10. Need preferences for the above. Say a user from Orlando wants to rent a drill, we can show them which ones are available to do delivery, and which ones are local to their area so they can better optimize their rentals.


fin --- 
1. Created a rental agreement card that will be hosted on the users page and the owners page, so they can keep track of their rentals

-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------Owner IN ITSELF--------------------------------------------------------------------------------------------------
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

1. Need to make a display page for the owners, likely make their own profile that they can view? That's something I have to consider. I don't know if a display page is better or basically the same thing .

2. Need to consider a dashboard for when owners log in, so maybe this can take the place of having their own profile. Somewhere to manage their rentals and such.
2.1 Owners now have a nice resume display page when clicked by anyone, should this be equal to their page they're able to edit and such?
2.2 I need to make an actual owner profile page ^ so refer to this, I'd like the dashboard to be a part of both users and owners interaction. Will have to see how to structure it
2.3 There's a connect button, I'd love to make a messaging / inbox system.

3. Will write more as it comes. Coded out today 8/23/23

4.  NEED to create an owner login still, this will be done soon enough. 

5. Upon owner login, also wrote that I need to edit the ownerEquipmentListing to be prepopulated for when they want to list equipment. (Need something for documentation upload that allows also posting to the owners equipment database.)

-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Things I'd like to do: Week of 8/21/23 - 8/28/23

1. Implement search result page, I keep thinking, this may not really be needed...

2. Design the website to have user logged in displays and user logged out displays


   Working on | Completed |       Logged in Display         |             Logged out display
--------------|-----------|---------------------------------|------------------------------------------------------------------------
Navbar          ✅             Req                             Req
--------------|-----------|---------------------------------|------------------------------------------------------------------------
User/Renter SU              NEEDED. Logged in cant sign up      If logged out, allow sign up
--------------|-----------|---------------------------------|------------------------------------------------------------------------
Collections                 Not needed, rentals private req    If logged out, can still view owner /products
--------------|-----------|---------------------------------|------------------------------------------------------------------------
Display Pages               Not needed, should be public      if logged out OKAY
--------------|-----------|---------------------------------|------------------------------------------------------------------------
Owner form                 Req. Users != owner, owner signed up, can't sign up again.           If logged out allow signup
--------------|-----------|---------------------------------|------------------------------------------------------------------------
Owner Edit                  REQ. must be owner match to edit    If not logged in, simply can't edit
--------------|-----------|---------------------------------|------------------------------------------------------------------------
Product Form                Should I allow user to post products? owners can post for sure. NO anonymous posting. logged in to post
--------------|-----------|---------------------------------|------------------------------------------------------------------------
Product Edit Form           MUST be your product              Cannot edit a product you did not list
--------------|-----------|---------------------------------|------------------------------------------------------------------------
Rental form                 MUST be logged in to to rent        CANNOT be logged out to rent 
<- this form and the one below, I may only need 1- >
--------------|-----------|---------------------------------|------------------------------------------------------------------------
Prepop Rental               While logged in,  prepopulates      Cannot be logged out to rent
--------------|-----------|---------------------------------|------------------------------------------------------------------------
User Login                user logged in,to profile or home     if logged out, allow for login.
--------------|-----------|---------------------------------|------------------------------------------------------------------------
Footer                     Should remain the same for both
--------------|-----------|---------------------------------|------------------------------------------------------------------------
HomePage                    Should it be different if they're signed in?
--------------|-----------|---------------------------------|-------------------------------------------------------------------------

3. Research what more cool things I can incorporate with React!

4. Read the notes I've written above to see how I will go about editing my backend, specifically what will need to be included inside my models.


5. Make this into UseContext ?  
useEffect(() => {
    fetch("/check_session").then((response) => {
      if (response.ok) {
        response.json().then((user) => setUser(user));
      }
    });
  }, []);
