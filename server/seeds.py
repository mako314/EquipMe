from models import db, User, EquipmentOwner, Equipment, RentalAgreement, EquipmentImage, Thread, UserInbox, OwnerInbox, Message, Cart, CartItem, EquipmentPrice, FeaturedEquipment, Review, UserFavorite, OwnerFavorite
import pandas as pd
from app import app
from random import randint, choice as rc


from datetime import datetime, timedelta
import random

# IF you want to re-seed when you start development, just add everything in here (tab for indentation)
def seed_database():
    pass

def random_time_30_days():
    current_day = datetime.now()
    days_ago_30 = current_day - timedelta(days=30)
    random_date = days_ago_30 + timedelta(days=random.randint(0, 30))
    return random_date

if __name__ == '__main__':
    with app.app_context():
        #Clear dbs
        print("Clearing db...")
        RentalAgreement.query.delete()
        CartItem.query.delete()
        Cart.query.delete()
        EquipmentPrice.query.delete()
        FeaturedEquipment.query.delete()
        UserFavorite.query.delete()
        OwnerFavorite.query.delete()
        Review.query.delete()
        Equipment.query.delete()
        UserInbox.query.delete()
        OwnerInbox.query.delete()
        EquipmentOwner.query.delete()
        User.query.delete()
        EquipmentImage.query.delete()
        Message.query.delete()
        Thread.query.delete()
        


#----------------------------------------------------------------------
#Seed Renters
        print("Seeding potential renters...")
    #Seed Renters
        user_1 =  User(
        firstName="Benjamin",
        lastName="Davis",
        age=42,
        email="benjamin.davis23@gmail.com",
        _password_hash="",
        phone="312-555-1122",
        location="Chicago, Illinois",
        profession="Construction Equipment Operator",
        bio="I have over 20 years of experience in construction equipment operation. Based in Chicago, I am committed to precision and expertise in handling complex machinery.",
        profileImage="https://avatarfiles.alphacoders.com/325/thumb-325695.png",
        # bannerImg="banner_benjamin.png"
    )

        user_2 = User(
        firstName="Ethan",
        lastName="Martinez",
        age=39,
        email="ethan.martinez77@yahoo.com",
        _password_hash="",
        phone="305-555-2233",
        location="Miami, Florida",
        profession="Heavy Machine Operator",
        bio="As a heavy machine operator based in Miami, I specialize in managing and operating large-scale industrial equipment. My nearly two decades in the field have honed my skills and knowledge.",
        profileImage="https://avatarfiles.alphacoders.com/325/thumb-325695.png",
        # bannerImg="banner_ethan.png"
    )
        
        user_3 = User(
        firstName="William",
        lastName="Anderson",
        age=32,
        email="william.anderson89@gmail.com",
        _password_hash="",
        phone="713-555-3344",
        location="Houston, Texas",
        profession="Industrial Cleaning Specialist",
        bio="An industrial cleaning specialist from Houston, I am dedicated to maintaining high standards of cleanliness and safety. My attention to detail is what sets me apart in this industry.",
        profileImage="https://avatarfiles.alphacoders.com/119/119089.png",
        # bannerImg="banner_william.png"
    )

        user_4 =User(
        firstName="Sofia",
        lastName="Rodriguez",
        age=29,
        email="sofia.rodriguez12@hotmail.com",
        _password_hash="",
        phone="602-555-4455",
        location="Phoenix, Arizona",
        profession="Party and Event Equipment Organizer",
        bio="Organizing large-scale events and parties in Phoenix, I excel in coordinating and arranging event equipment. My creativity and organizational skills ensure every event is a success and memorable.",
        profileImage="https://avatarfiles.alphacoders.com/325/thumb-325695.png",
        # bannerImg="banner_sofia.png"
    )
        
        user_4 = User(
        firstName="Christian",
        lastName="Domingues",
        age=42,
        email="christian.domingues55@yahoo.com",
        _password_hash="",
        phone="312-555-5566",
        location="Chicago, Illinois",
        profession="Painting Contractor",
        bio="As a seasoned painting contractor from Chicago, I combine artistic flair with technical expertise. I specialize in various painting techniques, ensuring quality and reliability in every project.",
        profileImage="https://avatarfiles.alphacoders.com/325/thumb-325695.png",
        # bannerImg="banner_christian.png"
    )

        user_5 = User(
        firstName="Sarah",
        lastName="Thompson",
        age=30,
        email="sarah.thompson99@gmail.com",
        _password_hash="",
        phone="206-555-6677",
        location="Seattle, Washington",
        profession="Landscape Designer",
        bio="As a landscape designer in Seattle, my passion lies in transforming outdoor spaces. My designs focus on sustainability and creating visually stunning landscapes that stand the test of time.",
        profileImage="https://avatarfiles.alphacoders.com/325/thumb-325695.png",
        # bannerImg="banner_sarah.png"
    )
        user_6 = User(
        firstName="Thomas",
        lastName="Brady",
        age=25,
        email="thomas.brady21@yahoo.com",
        _password_hash="",
        phone="713-555-7788",
        location="Houston, Texas",
        profession="Automotive Mechanic",
        bio="I am a skilled automotive mechanic from Houston with a passion for cars. My expertise lies in diagnostics and providing top-notch maintenance and repair services.",
        profileImage="https://avatarfiles.alphacoders.com/325/thumb-325695.png",
        # bannerImg="banner_thomas.png"
    )
        #Add all users
        db.session.add(user_1)
        db.session.add(user_2)
        db.session.add(user_3)
        db.session.add(user_4)
        db.session.add(user_5)
        db.session.add(user_6)
        
        db.session.commit()
        #This commit handles adding the users without their passwords for the time being.

        user_1_password = '123'
        user_2_password = '123'
        user_3_password = '123'
        user_4_password = '123'
        user_5_password = '123'
        user_6_password = '123'


        #hash users passwords
        user_1.password_hash = user_1_password
        user_2.password_hash = user_2_password
        user_3.password_hash = user_3_password
        user_4.password_hash = user_4_password
        user_5.password_hash = user_5_password
        user_6.password_hash = user_6_password


        #Re-add all users to include passwords
        db.session.add(user_1)
        db.session.add(user_2)
        db.session.add(user_3)
        db.session.add(user_4)
        db.session.add(user_5)
        db.session.add(user_6)


        db.session.commit()
        #Adds users with their passwords hashed. 

#----------------------------------------------------------------
# Seed Equipment Owners
        print("Seeding equipment owners...")
        # equipment_owners = [

# Seed Equipment Owners individually,
        owner_1 = EquipmentOwner(
            firstName="Mark", # Painting Equipment
            lastName = "Davis",
            age=42,
            location="Chicago, Illinois",
            profession="Plumbing",
            bio= "I specialize in plumbing and bring years of experience in handling and supplying top-notch painting equipment in Chicago. My focus is on providing reliable and efficient tools for any job.",
            phone="312-555-6789",
            email="markdavis82@yahoo.com",
            _password_hash="", 
            profileImage = "https://avatarfiles.alphacoders.com/322/thumb-322447.png",
            website = " "
        )
        owner_2 = EquipmentOwner(
            firstName="Emily", # Party Equipment
            lastName = "Johnson",
            age=22,
            location="Port St. Lucie, FL",
            profession="Construction Equipment Operator",
            bio= "At 22, I'm deeply involved in the world of construction equipment operation in Port St. Lucie, FL. My goal is to ensure that every project has the right equipment for success.",
            phone="602-555-7891",
            email="ejohnson@live.com",
            _password_hash="",
            profileImage = "https://avatarfiles.alphacoders.com/322/thumb-322447.png",
            website = " "
        )
        owner_3 = EquipmentOwner(
            firstName="Andrew", #Automotive Equipment
            lastName = "Jacobs",
            age=32,
            location="Houston, Texas",
            profession="Automotive",
            bio= "Based in Houston, Texas, I provide automotive equipment for a variety of needs. With my extensive knowledge, I help clients choose the best tools for their automotive projects.",
            phone="713-555-0123",
            email="andrewjacobs93@gmail.com",
            _password_hash="",
            profileImage = "https://avatarfiles.alphacoders.com/322/thumb-322447.png",
            website = " "
        )
        owner_4 = EquipmentOwner(
            firstName="Henry", #Garden Equipment
            lastName = "Cavill",
            age=54,
            location="Seattle, Washington",
            profession="Garden",
            bio= "As a garden equipment provider in Seattle, I take pride in offering high-quality tools. My experience in gardening aids clients in selecting the perfect equipment for their outdoor spaces.",
            phone="206-555-3456",
            email="hcavill34@hotmail.com",
            _password_hash="",
            profileImage = "https://avatarfiles.alphacoders.com/322/thumb-322447.png",
            website = " "
        )
        owner_5 = EquipmentOwner(
            firstName="David", #Heavy Machinery
            lastName = "Rodriguez",
            age=65,
            location="Miami, Florida",
            profession="Heavy Machinery",
            bio= "From Miami, I specialize in heavy machinery. With my expertise, I ensure that each client gets the most suitable machinery for their industrial needs.",
            phone="305-555-1234",
            email="davidr83@gmail.com",
            _password_hash="",
            profileImage = "https://avatarfiles.alphacoders.com/322/thumb-322447.png",
            website = " "
        )
        owner_6 = EquipmentOwner(
            firstName="Amy", #Construction Equipment
            lastName = "Wilson",
            age=29,
            location="Chicago, Illinois",
            profession="Construction",
            bio= "In Chicago, I focus on supplying construction equipment. My aim is to help projects run smoothly by providing reliable and effective tools.",
            phone="312-555-5678",
            email="amywilson22@yahoo.com",
            _password_hash="",
            profileImage = "https://avatarfiles.alphacoders.com/322/thumb-322447.png",
            website = " "
        )
        owner_7 = EquipmentOwner(
            firstName="Daniel", # Cleaning Equipment
            lastName = "Lee",
            age=35,
            location="Houston, Texas",
            profession="Cleaning",
            bio= "I provide top-grade cleaning equipment in Houston. My mission is to ensure cleanliness and efficiency in various environments through state-of-the-art equipment.",
            phone="713-555-4567",
            email="daniel.lee78@yahoo.com",
            _password_hash="",
            profileImage = "https://avatarfiles.alphacoders.com/322/thumb-322447.png",
            website = " "
        )
        owner_8 = EquipmentOwner(
            firstName="Jessica", # Plumbing Equipment
            lastName = "Sanchez",
            age=38,
            location="New York City, New York",
            profession="Plumbing",
            bio= "From New York City, I specialize in plumbing equipment. I'm committed to offering the best tools and resources to meet diverse plumbing needs.",
            phone ="212-555-2345",
            email="jess.sanchez22@gmail.com",
            _password_hash="",
            profileImage = "https://avatarfiles.alphacoders.com/322/thumb-322447.png",
            website = " "
        )
        owner_9 = EquipmentOwner(
            firstName="Ryan", #Power-tool and hand-tool Equipment
            lastName = "Phillips",
            age=39,
            location="Orlando, Florida",
            profession="Power tools and Hand tools",
            bio= "In Orlando, Florida, I offer a range of power tools and hand tools. My expertise helps clients find the perfect tools for their projects, ensuring quality and durability.",
            phone="407-555-9012",
            email="ryan.phillips87@gmail.com",
            _password_hash="",
            profileImage = "https://avatarfiles.alphacoders.com/322/thumb-322447.png",
            website = " "
        )
        owner_10 = EquipmentOwner(
            firstName="Michelle", #Woodwork
            lastName = "Adams",
            age=40,
            location="New Orleans, Louisiana",
            profession="Woodworking",
            bio= "I am dedicated to woodworking in New Orleans, Louisiana. My passion is to provide high-quality woodworking tools that cater to the intricate needs of this craft.",
            phone="504-555-7890",
            email="madams90@gmail.com",
            _password_hash="",
            profileImage = "https://avatarfiles.alphacoders.com/322/thumb-322447.png",
            website = " "
        )
        
        #Add all owners
        db.session.add(owner_1)
        db.session.add(owner_2)
        db.session.add(owner_3)
        db.session.add(owner_4)
        db.session.add(owner_5)
        db.session.add(owner_6)
        db.session.add(owner_7)
        db.session.add(owner_8)
        db.session.add(owner_9)
        db.session.add(owner_10)

        db.session.commit()
        #This commit handles adding the owners without their passwords for the time being.

        # add owner passwords
        owner_1_password = '123'
        owner_2_password = '123'
        owner_3_password = '123'
        owner_4_password = '123'
        owner_5_password = '123'
        owner_6_password = '123'
        owner_7_password = '123'
        owner_8_password = '123'
        owner_9_password = '123'
        owner_10_password = '123'

        #hash owner passwords
        owner_1.password_hash = owner_1_password
        owner_2.password_hash = owner_2_password
        owner_3.password_hash = owner_3_password
        owner_4.password_hash = owner_4_password
        owner_5.password_hash = owner_5_password
        owner_6.password_hash = owner_6_password
        owner_7.password_hash = owner_7_password
        owner_8.password_hash = owner_8_password
        owner_9.password_hash = owner_9_password
        owner_10.password_hash = owner_10_password

        #Re-add all owners
        db.session.add(owner_1)
        db.session.add(owner_2)
        db.session.add(owner_3)
        db.session.add(owner_4)
        db.session.add(owner_5)
        db.session.add(owner_6)
        db.session.add(owner_7)
        db.session.add(owner_8)
        db.session.add(owner_9)
        db.session.add(owner_10)

        db.session.commit()

        print(owner_1.id)
        print(owner_2.id)
        print(owner_3.id)
        print(owner_4.id)
        print(owner_5.id)
        print(owner_6.id)
        print(owner_7.id)
        print(owner_8.id)
        print(owner_9.id)
        print(owner_10.id)
        #Adds owners with their passwords hashed. 

#---------------------------------------------------------

#-------------------------------------------------------------------------------------------------------------------------------------------------
#Seed Equipment - Going to do less equipment since I know the pandas works.
        print("Uploading the current equipment list...")
        equipment_list = [
            Equipment(
                name = 'Excavator',
                type = 'Heavy Machinery',
                make = 'Caterpillar',
                model = '336E L',
                description = "Experience the power and precision of our top-of-the-line Caterpillar 336E L excavator. With its exceptional durability and advanced technology, this excavator is a game-changer for any construction or excavation project. It's well-maintained, ensuring reliable performance and efficiency. Rent it out to tackle your most demanding earthmoving tasks with confidence.",
                equipment_image='https://s7d2.scene7.com/is/image/Caterpillar/C10123400',
                location = '701 NW Street, St Lucie W Blvd, Port St. Lucie, FL 34986',
                availability = 'True',
                delivery = 'False',
                quantity = 3,
                owner_id = owner_2.id
            ),
            Equipment(
                name = 'Forklift',
                type = 'Industrial Vehicle',
                make = 'Toyota Material Handling',
                model = '8FGCU25',
                description = "Get your hands on our Toyota 8FGCU25 forklift, the ultimate solution for your lifting needs. Renowned for its stability and robustness, this forklift is a staple in our rental fleet. It's been meticulously serviced to guarantee your safety and enhance productivity. Whether it's for a warehouse or a construction site, this forklift won't let you down.",
                equipment_image='https://sielift.com/wp-content/uploads/2018/02/IMG_0837.jpg',
                location = '701 NW Street, St Lucie W Blvd, Port St. Lucie, FL 34986',
                availability = 'True',
                delivery = 'False',
                quantity = 2,
                owner_id = owner_2.id
            ),
            Equipment(
                name = 'Lawnmower',
                type = 'Garden Lawnmower',
                make = 'Honda',
                model = 'HRX217VKA',
                description = "Our Honda HRX217VKA lawnmower makes lawn care effortless and enjoyable. With its precise cutting and user-friendly features, it delivers a perfect trim every time. It's lightweight, easy to maneuver, and has been kept in pristine condition for your landscaping needs. Rent this and give your lawn the care it deserves.",
                equipment_image='https://img.ksl.com/mx/mplace-classifieds.ksl.com/2962808-1691060871-602587.jpg?filter=marketplace/664x500',
                location = '701 NW Street, St Lucie W Blvd, Port St. Lucie, FL 34986',
                availability = 'True',
                delivery = 'False',
                quantity = 5,
                owner_id = owner_2.id
            ),
            Equipment(
                name = 'Tractor',
                type = 'Farming Equipment',
                make = 'John Deere',
                model = '8R 410',
                description = "Ready for the toughest farming tasks, our John Deere 8R 410 tractor combines strength with sophistication. It's been the backbone of our rental service due to its unmatched power and advanced features. We've taken great care to maintain it to the highest standards, ensuring it's ready to perform whenever you need it.",
                equipment_image='https://www.deere.com/assets/images/region-4/products/tractors/row-crop-tractors/8r-8rt-row-crop-tractors/8r-410/8r_410_r4f063847_medium_b87e9556a84a3c95374c774923365e9425dd7f67.jpg',
                location = '701 NW Street, St Lucie W Blvd, Port St. Lucie, FL 34986',
                availability = 'True',
                delivery = 'True',
                quantity = 4,
                owner_id = owner_2.id
            ),
        ]

        db.session.add_all(equipment_list)
        db.session.commit()
#------------------------------------------EQUIPMENT PRICES---------------------------------------
        print('Calculating price of Equipment...')
        equipment_prices = [
            EquipmentPrice(
            hourly_rate = 1595,
            daily_rate = 32000,
            weekly_rate = 220000,
            promo_rate = 1495,
            equipment_id = equipment_list[0].id
            ),
            EquipmentPrice(
            hourly_rate = 1595,
            daily_rate = 32000,
            weekly_rate = 220000,
            promo_rate = 1495,
            equipment_id = equipment_list[1].id
            ),
            EquipmentPrice(
            hourly_rate = 1595,
            daily_rate = 32000,
            weekly_rate = 220000,
            promo_rate = 1495,
            equipment_id = equipment_list[2].id
            ),
            EquipmentPrice(
            hourly_rate = 1595,
            daily_rate = 32000,
            weekly_rate = 220000,
            promo_rate = 1495,
            equipment_id = equipment_list[3].id
            ),
        ]

        db.session.add_all(equipment_prices)
        db.session.commit()

#-------------------------------------------------------------------------------------------------------------------------------------------------

        # print("Reseting EQUIPMENT pictures **TEMPORARILY**")
        print("Temporarily Featured Equipment")
        featured_equipment = [
            FeaturedEquipment(
            equipment_id = equipment_list[0].id
            ),
            FeaturedEquipment(
            equipment_id = equipment_list[1].id
            )
        ]

        db.session.add_all(featured_equipment)
        db.session.commit()


#---------------------Cart and Item testing----------------
        print("Generating example cart...")
        cart1 = Cart(
            cart_name ="Heavy Duty",
            cart_status = "ACTIVE",
            created_at = datetime.utcnow(),
            user_id = user_1.id,
        )
        cart2 = Cart(
            cart_name ="My Miami Project",
            cart_status = "ACTIVE",
            created_at = datetime.utcnow(),
            user_id = user_1.id,
        )
        db.session.add_all([cart1, cart2])
        

        print("Generating example cart items...")   
        cart_items = [
            CartItem(
                price_cents_at_addition = equipment_prices[0].hourly_rate,
                price_cents_if_changed = None,
                quantity = 3,
                rental_rate="hourly",
                rental_length = 6,
                cart_id= cart1.id,
                equipment_id = equipment_list[0].id,
                created_at = random_time_30_days(),
            ),
            CartItem(
                price_cents_at_addition = equipment_prices[1].daily_rate,
                price_cents_if_changed = None,
                quantity = 2,
                rental_rate="daily",
                rental_length = 5,
                cart_id= cart1.id,
                equipment_id = equipment_list[0].id,
                created_at = random_time_30_days(),
            ),
            CartItem(
                price_cents_at_addition = equipment_prices[2].weekly_rate,
                price_cents_if_changed = None,
                quantity = 2,
                rental_rate="weekly",
                rental_length = 2,
                cart_id= cart1.id,
                equipment_id = equipment_list[0].id,
                created_at = random_time_30_days(),
            ),
        ]

        db.session.add_all(cart_items)
        db.session.commit()

        # Now that all items are added, calculate the total
        cart1.total = cart1.calculate_total()
        db.session.commit()

#Seed rental agreements
#---------------------Rental agreements---------------
        print("Configuring our current rental agreements...")
        rental_agreements = [
        RentalAgreement(
            rental_start_date="2023-07-17",
            rental_end_date="2023-07-20",
            owner_id = owner_2.id, # Amy Wilson
            user_id=user_1.id,  # Benjamin Davis
            cart_item_id=cart_items[0].id,  # Excavator caterpillar thing
            created_at = datetime.utcnow(),
            updated_at = datetime.utcnow()
        ),
        RentalAgreement(
            rental_start_date="2023-07-17",
            rental_end_date="2023-07-20",
            owner_id = owner_2.id, # David Rodriguez
            user_id=user_1.id,  # Ethan Martinez
            cart_item_id=cart_items[1].id,  # Forklift
            created_at = datetime.utcnow(),
            updated_at = datetime.utcnow()
        ),
        RentalAgreement(
            rental_start_date="2023-07-17",
            rental_end_date="2023-07-20",
            owner_id = owner_2.id, # Henry Cavill
            user_id=user_1.id,  # Sarah Thompson
            cart_item_id=cart_items[2].id,  # Lawnmower
            created_at = datetime.utcnow(),
            updated_at = datetime.utcnow()
        )]

        db.session.add_all(rental_agreements)
        db.session.commit()

#---------------------Review Testing----------------
        print("Creating reviews...")
        reviews = [
            Review(
                review_stars = 5,
                review_comment = "Having worked with a wide array of heavy machinery in my two decades on the job, I can say with confidence that Emily Johnson's Caterpillar Excavator is one of the best I've operated. Not only was the machine in excellent condition, but it also performed flawlessly throughout the rental period. Emily was punctual and professional, providing clear instructions and quick support whenever needed. The equipment was well-maintained and handled the demands of the job with ease. It's a solid piece of machinery that I'd recommend to any fellow construction equipment operator looking for reliable heavy machinery. Five stars for both the excavator and Emily's outstanding service.",
                reviewer_type = "user",
                created_at = datetime.utcnow(),
                updated_at = datetime.utcnow(),
                cart_item_id= cart_items[0].id,
                user_id = user_1.id,
                owner_id = owner_2.id
            ),
            Review(
                review_stars = 5,
                review_comment = "Benjamin Davis was an exemplary renter. His vast experience was evident from the start, handling the excavator with skill and care. He followed all operational guidelines and returned the equipment in impeccable condition. Communication was clear and consistent, making the rental process smooth and professional. It was a pleasure working with someone who respects the machinery and operates it as if it were their own. Benjamin's expertise and professionalism make him a highly recommended renter. I would not hesitate to rent to him again in the future.",
                reviewer_type = "owner",
                created_at = datetime.utcnow(),
                updated_at = datetime.utcnow(),
                cart_item_id= cart_items[0].id,
                user_id = user_1.id,
                owner_id =owner_2.id 
            )
        ]

        db.session.add_all(reviews)
        db.session.commit()

#---------------------Favorite testing----------------
        print("Creating Favorites...")
        favorites = [
            UserFavorite(
                equipment_id= equipment_list[0].id,
                user_id = user_1.id,
            ),
            UserFavorite(
                user_id = user_1.id,
                owner_id = owner_2.id
            ),
            OwnerFavorite(
                user_id = user_1.id,
                owner_id = owner_2.id,
            )
        ]

        db.session.add_all(favorites)
        db.session.commit()

#---------------------Message and Inbox testing----------------

#---------------------Thread testing----------------
        print("Creating threads...")
        threads = [
            Thread(
                subject="Equipment Inquiry",
            ),
            Thread(
                subject="I'd like to rent your Forklift, please and thank you.", 
            )
        ]

        db.session.add_all(threads)
        db.session.commit()

#---------------------Messages----------------
        print("Generating example messages...")
        messages = [
            Message(
                recipient_id = owner_2.id, # Owner
                sender_id = user_1.id, # User,
                context_id = 1,
                content = "Hey, hope this message finds you well, I'd like to rent this equipment. What would the cost be?",
                user_type = "user",
                message_status = "Delivered",
                created_at = datetime.utcnow(),
                thread_id = threads[0].id
            ),
            Message(
                recipient_id = user_1.id, # User
                sender_id = owner_2.id, # Owner
                context_id = 1,
                content = "Yes it is still available, we offer rate discounts depending on how long you are trying to rent for, what is the time frame?",
                user_type = "owner",
                message_status = "Delivered",
                created_at = datetime.utcnow(),
                thread_id = threads[0].id
            ),
            Message(
                recipient_id = owner_2.id, # Owner
                sender_id = user_1.id, # User
                context_id = 1,
                content = "Lets try for three weeks if you can send me a quote?",
                user_type = "user",
                message_status = "Delivered",
                created_at = datetime.utcnow(),
                thread_id = threads[0].id
            ),
            Message(
                recipient_id = user_1.id, # User
                sender_id = owner_2.id, # Owner
                context_id = 1,
                content = "Attached is a quote, thank you!",
                user_type = "owner",
                message_status = "Delivered",
                created_at = datetime.utcnow(),
                thread_id = threads[0].id
            ),
            Message(
                recipient_id = owner_2.id, # Owner
                sender_id = user_1.id, # User,
                context_id = 2,
                content = "Hey, hope this message finds you well, I'd like to rent this equipment. What would the cost be?",
                user_type = "user",
                message_status = "Delivered",
                created_at = datetime.utcnow(),
                thread_id = threads[1].id
            ),
            Message(
                recipient_id = user_1.id, # User
                sender_id = owner_2.id, # Owner
                context_id = 2,
                content = "Yes I got it, how can I help you?",
                user_type = "owner",
                message_status = "Delivered",
                created_at = datetime.utcnow(),
                thread_id = threads[1].id
            ),
            Message(
                recipient_id = owner_2.id, # Owner
                sender_id = user_1.id, # User
                context_id = 2,
                content = "Lets try for three weeks ON THAT LAWNMoWER if you can send me a quote?",
                user_type = "user",
                message_status = "Delivered",
                created_at = datetime.utcnow(),
                thread_id = threads[1].id
            ),
            Message(
                recipient_id = user_1.id,  # User
                sender_id = owner_2.id, # Owner
                context_id = 2,
                content = "Attached is a quote, thank you!",
                user_type = "owner",
                message_status = "Delivered",
                created_at = datetime.utcnow(),
                thread_id = threads[1].id
            ),
        ]

        db.session.add_all(messages)
        db.session.commit()

        # thread2 = Thread.query.filter_by(id=2).first()
        # if thread2:
        #     print(f"Subject of Thread {thread2.id}: {thread2.subject}")
            
        #     # Print messages for the thread
        #     print("Messages in this thread:")
        #     for message in thread2.messages:
        #         print(f"Message Content: {message.content}")
        # else:
        #     print("No thread with ID 2 found.")
#---------------------Inbox testing----------------
        print("Creating USER Inbox...")
        user_inbox = [
            UserInbox(
                user_id=user_1.id,  
                thread_id = threads[0].id
            ),
            UserInbox(
                user_id=user_1.id,
                thread_id = threads[1].id
            )
        ]

        db.session.add_all(user_inbox)
        db.session.commit()

        print("Creating OWNER Inbox...")
        owner_inbox = [
            OwnerInbox(
                owner_id=owner_2.id,  
                thread_id = threads[0].id
            ),
            OwnerInbox(
                owner_id=owner_2.id,  
                thread_id = threads[1].id
            )
        ]

        db.session.add_all(owner_inbox)
        db.session.commit()
        
        owner2 = EquipmentOwner.query.filter_by(id = owner_2.id).first()
        if owner2:
            print("Owner 2's Inboxes:")
            for inbox in owner2.owner_inboxes:
                print(f"Inbox ID: {inbox.id}, Thread ID: {inbox.thread_id}")


#-------------------------------------------------------------------------------------------------------------------------------------------------



#Seed Equipment with panda. 
#Seed Equipment
        # print("Uploading the current equipment list...")
        # data = pd.read_csv('/home/mako77/code/Flatiron/Projects/EquipMe/extrafiles/equipment_list_with_contact - equipment_data.csv')

        # data.columns = ['Equipment_name', 'Equipment_type', 'Make', 'Model', 'Owner', 'Phone', 'Email', 'Location', 'Availability', 'Delivery', 'Quantity']
        # equipment_list = []

        # for index, row in data.iterrows():
        #     owner_name = row['Owner']
        #     equipment_owner = EquipmentOwner.query.filter(EquipmentOwner.name == owner_name).first()
        #     equipment = Equipment(
        #         name = row['Equipment_name'],
        #         type = row['Equipment_type'],
        #         make = row['Make'],
        #         model = row['Model'],
        #         owner_name = equipment_owner.name,
        #         phone = equipment_owner.phone,
        #         email = equipment_owner.email,
        #         location = row['Location'],
        #         availability = row['Availability'],
        #         delivery = row['Delivery'],
        #         quantity = row['Quantity'],
        #         owner_id = equipment_owner.id
        #     )

(            # print(equipment_owner.name)
)            # equipment_list.append(equipment) # this works, just appending to list

        # print("Commiting all the equipment to your database...")
        # db.session.add_all(equipment_list)

        # print("Matching Equipment to Appropriate Owner...")
        # owner = EquipmentOwner.query.filter(EquipmentOwner.name == owner_name).first()
        # owner.equipment.append(equipment)
        
        # db.session.commit()

    # name = db.Column(db.String)
    # type = db.Column(db.String)
    # make = db.Column(db.String)
    # model = db.Column(db.String)
    # availability = db.Column(db.Boolean)
    # delivery = db.Column(db.Boolean)
    # quantity = db.Column(db.Integer)
