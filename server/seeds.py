from models import db, User, EquipmentOwner, Equipment, RentalAgreement, EquipmentImage, Inbox, Message
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
        Inbox.query.delete()

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
            name="Mark Davis", # Painting Equipment
            location="Chicago, Illinois",
            profession="Plumbing",
            phone="312-555-6789",
            email="markdavis82@yahoo.com",
            _password_hash="", 
            profileImage = "https://avatarfiles.alphacoders.com/322/thumb-322447.png",
            website = " "
        )
        owner_2 = EquipmentOwner(
            name="Emily Johnson", # Party Equipment
            location="Phoenix, Arizona",
            profession="Party",
            phone="602-555-7891",
            email="ejohnson@live.com",
            _password_hash="",
            profileImage = "https://avatarfiles.alphacoders.com/322/thumb-322447.png",
            website = " "
        )
        owner_3 = EquipmentOwner(
            name="Andrew Jacobs", #Automotive Equipment
            location="Houston, Texas",
            profession="Automotive",
            phone="713-555-0123",
            email="andrewjacobs93@gmail.com",
            _password_hash="",
            profileImage = "https://avatarfiles.alphacoders.com/322/thumb-322447.png",
            website = " "
        )
        owner_4 = EquipmentOwner(
            name="Henry Cavill", #Garden Equipment
            location="Seattle, Washington",
            profession="Garden",
            phone="206-555-3456",
            email="hcavill34@hotmail.com",
            _password_hash="",
            profileImage = "https://avatarfiles.alphacoders.com/322/thumb-322447.png",
            website = " "
        )
        owner_5 = EquipmentOwner(
            name="David Rodriguez", #Heavy Machinery
            location="Miami, Florida",
            profession="Heavy Machinery",
            phone="305-555-1234",
            email="davidr83@gmail.com",
            _password_hash="",
            profileImage = "https://avatarfiles.alphacoders.com/322/thumb-322447.png",
            website = " "
        )
        owner_6 = EquipmentOwner(
            name="Amy Wilson", #Construction Equipment
            location="Chicago, Illinois",
            profession="Construction",
            phone="312-555-5678",
            email="amywilson22@yahoo.com",
            _password_hash="",
            profileImage = "https://avatarfiles.alphacoders.com/322/thumb-322447.png",
            website = " "
        )
        owner_7 = EquipmentOwner(
            name="Daniel Lee", # Cleaning Equipment
            location="Houston, Texas",
            profession="Cleaning",
            phone="713-555-4567",
            email="daniel.lee78@yahoo.com",
            _password_hash="",
            profileImage = "https://avatarfiles.alphacoders.com/322/thumb-322447.png",
            website = " "
        )
        owner_8 = EquipmentOwner(
            name="Jessica Sanchez", # Plumbing Equipment
            location="New York City, New York",
            profession="Plumbing",
            phone ="212-555-2345",
            email="jess.sanchez22@gmail.com",
            _password_hash="",
            profileImage = "https://avatarfiles.alphacoders.com/322/thumb-322447.png",
            website = " "
        )
        owner_9 = EquipmentOwner(
            name="Ryan Phillips", #Power-tool and hand-tool Equipment
            location="Orlando, Florida",
            profession="Power tools and Hand tools",
            phone="407-555-9012",
            email="ryan.phillips87@gmail.com",
            _password_hash="",
            profileImage = "https://avatarfiles.alphacoders.com/322/thumb-322447.png",
            website = " "
        )
        owner_10 = EquipmentOwner(
            name="Michelle Adams", #Woodwork
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
                # owner_name = ,
                # phone = ,
                # email = ,
                location = 'Miami, Florida',
                availability = 'True',
                delivery = 'False',
                quantity = 3,
                owner_id = 5
            ),
            Equipment(
                name = 'Forklift',
                type = 'Industrial Vehicle',
                make = 'Toyota Material Handling',
                model = '8FGCU25',
                # owner_name = ,
                # phone = ,
                # email = ,
                location = 'Chicago, Illinois',
                availability = 'True',
                delivery = 'False',
                quantity = 2,
                owner_id = 6
            ),
            Equipment(
                name = 'Lawnmower',
                type = 'Garden Lawnmower',
                make = 'Honda',
                model = 'HRX217VKA',
                # owner_name = ,
                # phone = ,
                # email = ,
                location = 'Seattle, Washington',
                availability = 'True',
                delivery = 'False',
                quantity = 5,
                owner_id = 4
            ),
            Equipment(
                name = 'Pipe Cutters',
                type = 'Plumbing Equipment',
                make = 'Lenox',
                model = '21011TC138',
                # owner_name = ,
                # phone = ,
                # email = ,
                location = 'New York City, New York',
                availability = 'True',
                delivery = 'True',
                quantity = 4,
                owner_id = 8
            ),
        ]

        db.session.add_all(equipment_list)
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
            created_on = datetime.utcnow(),
            modified_on = datetime.utcnow()
        ),
        RentalAgreement(
            location="Miami, Florida",
            total_price=200,
            rental_dates="2023-07-19 to 2023-07-23",
            owner_id = 5, # David Rodriguez
            user_id=2,  # Ethan Martinez
            equipment_id=1,  # David Rodriguez #Available
            created_on = datetime.utcnow(),
            modified_on = datetime.utcnow()
        ),
        RentalAgreement(
            location="Seattle, Washington",
            total_price=100,
            rental_dates="2023-07-17 to 2023-07-20",
            owner_id = 4, # Henry Cavill
            user_id=5,  # Sarah Thompson
            equipment_id=3,  # Daniel Lee #Available
            created_on = datetime.utcnow(),
            modified_on = datetime.utcnow()
        )]

        db.session.add_all(rental_agreements)
        db.session.commit()

        print("Reseting EQUIPMENT pictures **TEMPORARILY**")

#---------------------Message and Inbox testing----------------
        print("Generating example messages...")
        messages = [
            Message(
                recipient_id = 2, # Owner
                sender_id = 1, # User,
                context_id = 1,
                subject = "Equipment Inquiry",
                content = "Hey, hope this message finds you well, I'd like to rent this equipment. What would the cost be?",
                user_type = "user",
                message_status = "Delivered",
                created_on = datetime.utcnow(),
            ),
            Message(
                recipient_id = 1,
                sender_id = 2, # Owner
                context_id = 1,
                content = "Yes it is still available, we offer rate discounts depending on how long you are trying to rent for, what is the time frame?",
                user_type = "owner",
                message_status = "Delivered",
                created_on = datetime.utcnow(),
            ),
            Message(
                recipient_id = 2, # Owner
                sender_id = 1, # User
                context_id = 1,
                content = "Lets try for three weeks if you can send me a quote?",
                user_type = "user",
                message_status = "Delivered",
                created_on = datetime.utcnow(),
            ),
            Message(
                recipient_id = 1, # User
                sender_id = 2, # Owner
                context_id = 1,
                content = "Attached is a quote, thank you!",
                user_type = "owner",
                message_status = "Delivered",
                created_on = datetime.utcnow(),
            ),
            Message(
                recipient_id = 2, # Owner
                sender_id = 3, # User,
                context_id = 2,
                subject = "Still got that lawnmower?",
                content = "Hey, hope this message finds you well, I'd like to rent this equipment. What would the cost be?",
                user_type = "user",
                message_status = "Delivered",
                created_on = datetime.utcnow(),
            ),
            Message(
                recipient_id = 3, # User
                sender_id = 2, # Owner
                context_id = 2,
                content = "tetseroni?",
                user_type = "owner",
                message_status = "Delivered",
                created_on = datetime.utcnow(),
            ),
            Message(
                recipient_id = 3, # Owner
                sender_id = 1, # User
                context_id = 2,
                content = "Lets try for three weeks ON THAT LAWNMoWER if you can send me a quote?",
                user_type = "user",
                message_status = "Delivered",
                created_on = datetime.utcnow(),
            ),
            Message(
                recipient_id = 3,  # User
                sender_id = 2, # Owner
                context_id = 2,
                content = "Attached is a quote, thank you!",
                user_type = "owner",
                message_status = "Delivered",
                created_on = datetime.utcnow(),
            ),
        ]

        db.session.add_all(messages)
        db.session.commit()


#---------------------Inbox testing----------------
        print("Creating test Inbox...")
        inbox = [
            Inbox(
                user_id=1,  # User 1 (sender of message 1)
                owner_id=2,  # Owner 2 (recipient of message 1)
                message_id=1,  # Message 1
            ),
            Inbox(
                user_id=1,  # User 2 (sender of message 2)
                owner_id=2,  # Owner 1 (recipient of message 2)
                message_id=2,  # Message 2
            ),
            Inbox(
                user_id=1,  # User 1 (sender of message 3)
                owner_id=2,  # Owner 2 (recipient of message 3)
                message_id=3,  # Message 3
            ),
            Inbox(
                user_id=1,  # User 2 (sender of message 4)
                owner_id=2,  # Owner 2 (recipient of message 4)
                message_id=4,  # Message 4
            ),
            Inbox(
                user_id=3,  # User 3 (sender of message 1)
                owner_id=2,  # Owner 2 (recipient of message 1)
                message_id=5,  # Message 5
            ),
            Inbox(
                user_id=3,  # User 2 (sender of message 2)
                owner_id=2,  # Owner 2 (recipient of message 2)
                message_id=6,  # Message 6
            ),
            Inbox(
                user_id=3,  # User 3 (sender of message 3)
                owner_id=2,  # Owner 2 (recipient of message 3)
                message_id=7,  # Message 7
            ),
            Inbox(
                user_id=3,  # User 3 (sender of message 4)
                owner_id=2,  # Owner 2 (recipient of message 4)
                message_id=8,  # Message 8
            ),
        ]

        db.session.add_all(inbox)
        db.session.commit()




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
        #     created_on = datetime.utcnow(),
        #     modified_on = datetime.utcnow()
        # ),
        # RentalAgreement(
        #     location="Miami, Florida",
        #     total_price=200,
        #     rental_dates="2023-07-19 to 2023-07-23",
        #     owner_id = 5, # David Rodriguez
        #     user_id=2,  # Ethan Martinez
        #     equipment_id=8,  # David Rodriguez #Available
        #     created_on = datetime.utcnow(),
        #     modified_on = datetime.utcnow()
        # ),
        # RentalAgreement(
        #     location="Houston, Texas",
        #     total_price=100,
        #     rental_dates="2023-07-17 to 2023-07-20",
        #     owner_id = 7, # Daniel Lee
        #     user_id=3,  # William Anderson
        #     equipment_id=317,  # Daniel Lee #Available
        #     created_on = datetime.utcnow(),
        #     modified_on = datetime.utcnow()
        # ),
        # RentalAgreement(
        #     location="Phoenix, Arizona",
        #     total_price=80,
        #     rental_dates="2023-07-16 to 2023-07-19",
        #     owner_id = 2, # Emily Johnson
        #     user_id=4,  # Sofia Rodriguez
        #     equipment_id=361,  # Emily Johnson #Available
        #     created_on = datetime.utcnow(),
        #     modified_on = datetime.utcnow()
        # ),
        # RentalAgreement(
        #     location="Seattle, Washington",
        #     total_price=180,
        #     rental_dates="2023-07-18 to 2023-07-21",
        #     owner_id = 4, # Henry Cavill
        #     user_id=6,  # Sarah Thompson
        #     equipment_id=121,  # Henry Cavill #Available
        #     created_on = datetime.utcnow(),
        #     modified_on = datetime.utcnow()
        # ),
        # RentalAgreement(
        #     location="Houston, Texas",
        #     total_price=120,
        #     rental_dates="2023-07-22 to 2023-07-24",
        #     owner_id = 3, # Andrew Jacobs
        #     user_id=7,  # Thomas Brady
        #     equipment_id=311,  # Andrew Jacobs #Available
        #     created_on = datetime.utcnow(),
        #     modified_on = datetime.utcnow()
        # ),
        # RentalAgreement(
        #     location="Chicago, Illinois",
        #     total_price=80,
        #     rental_dates="2023-07-23 to 2023-07-24",
        #     owner_id = 1, # Mark Davis
        #     user_id=5,  # Christian Domingues
        #     equipment_id=238,  # Mark Davis #Available
        #     created_on = datetime.utcnow(),
        #     modified_on = datetime.utcnow()
        # ),
        # RentalAgreement(
        #     location="Phoenix, Arizona",
        #     total_price=120,
        #     rental_dates="2023-07-22 to 2023-07-23",
        #     owner_id = 2, # Emily Johnson
        #     user_id=4,  # Sofia Rodriguez
        #     equipment_id=355,  # Emily Johnson #Available
        #     created_on = datetime.utcnow(),
        #     modified_on = datetime.utcnow()
        # ),
        # RentalAgreement(
        #     location="Dallas, Texas",
        #     total_price=150,
        #     rental_dates="2023-07-19 to 2023-07-22",
        #     owner_id = 7,
        #     user_id=3,  # William Anderson
        #     equipment_id=318,  # Daniel Lee #Available
        #     created_on = datetime.utcnow(),
        #     modified_on = datetime.utcnow()
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
