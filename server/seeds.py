from models import db, User, EquipmentOwner, Equipment, RentalAgreement, EquipmentImage, Thread, UserInbox, OwnerInbox, Message, Cart, CartItem, EquipmentPrice
import pandas as pd
from app import app
from random import randint, choice as rc


from datetime import datetime


if __name__ == '__main__':
    with app.app_context():
        #Clear dbs
        print("Clearing db...")
        RentalAgreement.query.delete()
        Equipment.query.delete()
        EquipmentOwner.query.delete()
        User.query.delete()
        EquipmentImage.query.delete()
        Message.query.delete()
        UserInbox.query.delete()
        OwnerInbox.query.delete()
        Thread.query.delete()
        Cart.query.delete()
        CartItem.query.delete()
        EquipmentPrice.query.delete()


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
            location="Chicago, Illinois",
            profession="Plumbing",
            phone="312-555-6789",
            email="markdavis82@yahoo.com",
            _password_hash="", 
            profileImage = "https://avatarfiles.alphacoders.com/322/thumb-322447.png",
            website = " "
        )
        owner_2 = EquipmentOwner(
            firstName="Emily", # Party Equipment
            lastName = "Johnson",
            location="Phoenix, Arizona",
            profession="Construction Equipment Operator",
            phone="602-555-7891",
            email="ejohnson@live.com",
            _password_hash="",
            profileImage = "https://avatarfiles.alphacoders.com/322/thumb-322447.png",
            website = " "
        )
        owner_3 = EquipmentOwner(
            firstName="Andrew", #Automotive Equipment
            lastName = "Jacobs",
            location="Houston, Texas",
            profession="Automotive",
            phone="713-555-0123",
            email="andrewjacobs93@gmail.com",
            _password_hash="",
            profileImage = "https://avatarfiles.alphacoders.com/322/thumb-322447.png",
            website = " "
        )
        owner_4 = EquipmentOwner(
            firstName="Henry", #Garden Equipment
            lastName = "Cavill",
            location="Seattle, Washington",
            profession="Garden",
            phone="206-555-3456",
            email="hcavill34@hotmail.com",
            _password_hash="",
            profileImage = "https://avatarfiles.alphacoders.com/322/thumb-322447.png",
            website = " "
        )
        owner_5 = EquipmentOwner(
            firstName="David", #Heavy Machinery
            lastName = "Rodriguez",
            location="Miami, Florida",
            profession="Heavy Machinery",
            phone="305-555-1234",
            email="davidr83@gmail.com",
            _password_hash="",
            profileImage = "https://avatarfiles.alphacoders.com/322/thumb-322447.png",
            website = " "
        )
        owner_6 = EquipmentOwner(
            firstName="Amy", #Construction Equipment
            lastName = "Wilson",
            location="Chicago, Illinois",
            profession="Construction",
            phone="312-555-5678",
            email="amywilson22@yahoo.com",
            _password_hash="",
            profileImage = "https://avatarfiles.alphacoders.com/322/thumb-322447.png",
            website = " "
        )
        owner_7 = EquipmentOwner(
            firstName="Daniel", # Cleaning Equipment
            lastName = "Lee",
            location="Houston, Texas",
            profession="Cleaning",
            phone="713-555-4567",
            email="daniel.lee78@yahoo.com",
            _password_hash="",
            profileImage = "https://avatarfiles.alphacoders.com/322/thumb-322447.png",
            website = " "
        )
        owner_8 = EquipmentOwner(
            firstName="Jessica", # Plumbing Equipment
            lastName = "Sanchez",
            location="New York City, New York",
            profession="Plumbing",
            phone ="212-555-2345",
            email="jess.sanchez22@gmail.com",
            _password_hash="",
            profileImage = "https://avatarfiles.alphacoders.com/322/thumb-322447.png",
            website = " "
        )
        owner_9 = EquipmentOwner(
            firstName="Ryan", #Power-tool and hand-tool Equipment
            lastName = "Phillips",
            location="Orlando, Florida",
            profession="Power tools and Hand tools",
            phone="407-555-9012",
            email="ryan.phillips87@gmail.com",
            _password_hash="",
            profileImage = "https://avatarfiles.alphacoders.com/322/thumb-322447.png",
            website = " "
        )
        owner_10 = EquipmentOwner(
            firstName="Michelle", #Woodwork
            lastName = "Adams",
            location="New Orleans, Louisiana",
            profession="Woodworking",
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
                location = 'Miami, Florida',
                availability = 'True',
                delivery = 'False',
                quantity = 3,
                owner_id = 2
            ),
            Equipment(
                name = 'Forklift',
                type = 'Industrial Vehicle',
                make = 'Toyota Material Handling',
                model = '8FGCU25',
                location = 'Chicago, Illinois',
                availability = 'True',
                delivery = 'False',
                quantity = 2,
                owner_id = 2
            ),
            Equipment(
                name = 'Lawnmower',
                type = 'Garden Lawnmower',
                make = 'Honda',
                model = 'HRX217VKA',
                location = 'Seattle, Washington',
                availability = 'True',
                delivery = 'False',
                quantity = 5,
                owner_id = 2
            ),
            Equipment(
                name = 'Pipe Cutters',
                type = 'Plumbing Equipment',
                make = 'Lenox',
                model = '21011TC138',
                location = 'New York City, New York',
                availability = 'True',
                delivery = 'True',
                quantity = 4,
                owner_id = 2
            ),
        ]

        db.session.add_all(equipment_list)
        db.session.commit()

        print('Calculating price of Equipment...')
        equipment_prices = [
            EquipmentPrice(
            hourly_rate = 1595,
            daily_rate = 32000,
            weekly_rate = 220000,
            promo_rate = 1495,
            equipment_id = 1
            ),
            EquipmentPrice(
            hourly_rate = 1595,
            daily_rate = 32000,
            weekly_rate = 220000,
            promo_rate = 1495,
            equipment_id = 2
            ),
            EquipmentPrice(
            hourly_rate = 1595,
            daily_rate = 32000,
            weekly_rate = 220000,
            promo_rate = 1495,
            equipment_id = 3
            ),
            EquipmentPrice(
            hourly_rate = 1595,
            daily_rate = 32000,
            weekly_rate = 220000,
            promo_rate = 1495,
            equipment_id = 4
            ),
        ]

        db.session.add_all(equipment_prices)
        db.session.commit()

#-------------------------------------------------------------------------------------------------------------------------------------------------


#Seed rental agreements
#Rental agreements 
        print("Configuring our current rental agreements...")
        rental_agreements = [
        RentalAgreement(
            location="Chicago, Illinois",
            total_price=150,
            rental_dates="2023-07-15 to 2023-07-18",
            owner_id = 6, # Amy Wilson
            user_id=1,  # Benjamin Davis
            equipment_id=2,  # Amy Wilson #Available
            created_at = datetime.utcnow(),
            updated_at = datetime.utcnow()
        ),
        RentalAgreement(
            location="Miami, Florida",
            total_price=200,
            rental_dates="2023-07-19 to 2023-07-23",
            owner_id = 5, # David Rodriguez
            user_id=2,  # Ethan Martinez
            equipment_id=1,  # David Rodriguez #Available
            created_at = datetime.utcnow(),
            updated_at = datetime.utcnow()
        ),
        RentalAgreement(
            location="Seattle, Washington",
            total_price=100,
            rental_dates="2023-07-17 to 2023-07-20",
            owner_id = 4, # Henry Cavill
            user_id=5,  # Sarah Thompson
            equipment_id=3,  # Daniel Lee #Available
            created_at = datetime.utcnow(),
            updated_at = datetime.utcnow()
        )]

        db.session.add_all(rental_agreements)
        db.session.commit()

        print("Reseting EQUIPMENT pictures **TEMPORARILY**")

        #---------------------Thread testing----------------
        print("Creating threads...")
        threads = [
            Thread(
                subject="Equipment Inquiry",
            ),
            Thread(
                subject="Did I even spell inquiry right? Hope this works!", 
            )
        ]

        db.session.add_all(threads)
        db.session.commit()

#---------------------Cart and Item testing----------------
        print("Generating example cart...")
        cart1 = Cart(
            cart_status = "ACTIVE",
            created_at = datetime.utcnow(),
            user_id = 1,
        )
        db.session.add(cart1)
        

        print("Generating example cart items...")   
        cart_items = [
            CartItem(
                price_cents_at_addition = equipment_prices[0].hourly_rate,
                price_cents_if_changed = None,
                quantity = 1,
                rental_length = 1,
                cart_id= 1,
                equipment_id = 1,
            ),
            CartItem(
                price_cents_at_addition = equipment_prices[1].daily_rate,
                price_cents_if_changed = None,
                quantity = 1,
                rental_length = 1,
                cart_id= 1,
                equipment_id = 1,
            ),
            CartItem(
                price_cents_at_addition = equipment_prices[2].weekly_rate,
                price_cents_if_changed = None,
                quantity = 1,
                rental_length = 1,
                cart_id= 1,
                equipment_id = 1,
            ),
            CartItem(
                price_cents_at_addition = equipment_prices[3].weekly_rate,
                price_cents_if_changed = None,
                quantity = 1,
                rental_length = 1,
                cart_id= 1,
                equipment_id = 1,
            ),
        ]

        db.session.add_all(cart_items)
        db.session.commit()

        # Now that all items are added, calculate the total
        cart1.total = cart1.calculate_total()
        db.session.commit()

#---------------------Message and Inbox testing----------------

        print("Generating example messages...")
        messages = [
            Message(
                recipient_id = 2, # Owner
                sender_id = 1, # User,
                context_id = 1,
                content = "Hey, hope this message finds you well, I'd like to rent this equipment. What would the cost be?",
                user_type = "user",
                message_status = "Delivered",
                created_at = datetime.utcnow(),
                thread_id = 1
            ),
            Message(
                recipient_id = 1,
                sender_id = 2, # Owner
                context_id = 1,
                content = "Yes it is still available, we offer rate discounts depending on how long you are trying to rent for, what is the time frame?",
                user_type = "owner",
                message_status = "Delivered",
                created_at = datetime.utcnow(),
                thread_id = 1
            ),
            Message(
                recipient_id = 2, # Owner
                sender_id = 1, # User
                context_id = 1,
                content = "Lets try for three weeks if you can send me a quote?",
                user_type = "user",
                message_status = "Delivered",
                created_at = datetime.utcnow(),
                thread_id = 1
            ),
            Message(
                recipient_id = 1, # User
                sender_id = 2, # Owner
                context_id = 1,
                content = "Attached is a quote, thank you!",
                user_type = "owner",
                message_status = "Delivered",
                created_at = datetime.utcnow(),
                thread_id = 1
            ),
            Message(
                recipient_id = 2, # Owner
                sender_id = 3, # User,
                context_id = 2,
                content = "Hey, hope this message finds you well, I'd like to rent this equipment. What would the cost be?",
                user_type = "user",
                message_status = "Delivered",
                created_at = datetime.utcnow(),
                thread_id = 2
            ),
            Message(
                recipient_id = 3, # User
                sender_id = 2, # Owner
                context_id = 2,
                content = "tetseroni?",
                user_type = "owner",
                message_status = "Delivered",
                created_at = datetime.utcnow(),
                thread_id = 2
            ),
            Message(
                recipient_id = 2, # Owner
                sender_id = 3, # User
                context_id = 2,
                content = "Lets try for three weeks ON THAT LAWNMoWER if you can send me a quote?",
                user_type = "user",
                message_status = "Delivered",
                created_at = datetime.utcnow(),
                thread_id = 2
            ),
            Message(
                recipient_id = 3,  # User
                sender_id = 2, # Owner
                context_id = 2,
                content = "Attached is a quote, thank you!",
                user_type = "owner",
                message_status = "Delivered",
                created_at = datetime.utcnow(),
                thread_id = 2
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
                user_id=1,  
                thread_id = 1
            ),
            UserInbox(
                user_id=3,
                thread_id = 2
            )
        ]

        db.session.add_all(user_inbox)
        db.session.commit()

        print("Creating OWNER Inbox...")
        owner_inbox = [
            OwnerInbox(
                owner_id=2,  
                thread_id = 1
            ),
            OwnerInbox(
                owner_id=2,  
                thread_id = 2
            )
        ]

        db.session.add_all(owner_inbox)
        db.session.commit()

        owner2 = EquipmentOwner.query.filter_by(id=2).first()
        if owner2:
            print("Owner 2's Inboxes:")
            for inbox in owner2.owner_inboxes:
                print(f"Inbox ID: {inbox.id}, Thread ID: {inbox.thread_id}")




#----------------- OLD RENTAL AGREEMENTS 
        #     RentalAgreement(
        #     location="Orlando, Florida",
        #     total_price=300,
        #     rental_dates="2023-07-20 to 2023-07-25",
        #     user_id=2,  # Ethan Martinez
        #     owner_id=9  # Ryan Phillips
        # ),

        # RentalAgreement(
        #     location="Chicago, Illinois",
        #     total_price=150,
        #     rental_dates="2023-07-15 to 2023-07-18",
        #     owner_id = 6, # Amy Wilson
        #     user_id=1,  # Benjamin Davis
        #     equipment_id=38,  # Amy Wilson #Available
        #     created_at = datetime.utcnow(),
        #     updated_at = datetime.utcnow()
        # ),
        # RentalAgreement(
        #     location="Miami, Florida",
        #     total_price=200,
        #     rental_dates="2023-07-19 to 2023-07-23",
        #     owner_id = 5, # David Rodriguez
        #     user_id=2,  # Ethan Martinez
        #     equipment_id=8,  # David Rodriguez #Available
        #     created_at = datetime.utcnow(),
        #     updated_at = datetime.utcnow()
        # ),
        # RentalAgreement(
        #     location="Houston, Texas",
        #     total_price=100,
        #     rental_dates="2023-07-17 to 2023-07-20",
        #     owner_id = 7, # Daniel Lee
        #     user_id=3,  # William Anderson
        #     equipment_id=317,  # Daniel Lee #Available
        #     created_at = datetime.utcnow(),
        #     updated_at = datetime.utcnow()
        # ),
        # RentalAgreement(
        #     location="Phoenix, Arizona",
        #     total_price=80,
        #     rental_dates="2023-07-16 to 2023-07-19",
        #     owner_id = 2, # Emily Johnson
        #     user_id=4,  # Sofia Rodriguez
        #     equipment_id=361,  # Emily Johnson #Available
        #     created_at = datetime.utcnow(),
        #     updated_at = datetime.utcnow()
        # ),
        # RentalAgreement(
        #     location="Seattle, Washington",
        #     total_price=180,
        #     rental_dates="2023-07-18 to 2023-07-21",
        #     owner_id = 4, # Henry Cavill
        #     user_id=6,  # Sarah Thompson
        #     equipment_id=121,  # Henry Cavill #Available
        #     created_at = datetime.utcnow(),
        #     updated_at = datetime.utcnow()
        # ),
        # RentalAgreement(
        #     location="Houston, Texas",
        #     total_price=120,
        #     rental_dates="2023-07-22 to 2023-07-24",
        #     owner_id = 3, # Andrew Jacobs
        #     user_id=7,  # Thomas Brady
        #     equipment_id=311,  # Andrew Jacobs #Available
        #     created_at = datetime.utcnow(),
        #     updated_at = datetime.utcnow()
        # ),
        # RentalAgreement(
        #     location="Chicago, Illinois",
        #     total_price=80,
        #     rental_dates="2023-07-23 to 2023-07-24",
        #     owner_id = 1, # Mark Davis
        #     user_id=5,  # Christian Domingues
        #     equipment_id=238,  # Mark Davis #Available
        #     created_at = datetime.utcnow(),
        #     updated_at = datetime.utcnow()
        # ),
        # RentalAgreement(
        #     location="Phoenix, Arizona",
        #     total_price=120,
        #     rental_dates="2023-07-22 to 2023-07-23",
        #     owner_id = 2, # Emily Johnson
        #     user_id=4,  # Sofia Rodriguez
        #     equipment_id=355,  # Emily Johnson #Available
        #     created_at = datetime.utcnow(),
        #     updated_at = datetime.utcnow()
        # ),
        # RentalAgreement(
        #     location="Dallas, Texas",
        #     total_price=150,
        #     rental_dates="2023-07-19 to 2023-07-22",
        #     owner_id = 7,
        #     user_id=3,  # William Anderson
        #     equipment_id=318,  # Daniel Lee #Available
        #     created_at = datetime.utcnow(),
        #     updated_at = datetime.utcnow()
        # )
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
