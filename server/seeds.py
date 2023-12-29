from models import db, User, EquipmentOwner, Equipment, RentalAgreement, EquipmentImage, Thread, UserInbox, OwnerInbox, Message, Cart, CartItem, EquipmentPrice, FeaturedEquipment, Review, UserFavorite, OwnerFavorite, AgreementComment, EquipmentStateHistory, EquipmentStateSummary, EquipmentStatus
import pandas as pd
from app import app
from random import randint, choice as rc

from sqlalchemy.exc import IntegrityError
from datetime import datetime, timedelta
from collections import defaultdict
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
        AgreementComment.query.delete()
        RentalAgreement.query.delete()
        Review.query.delete()
        CartItem.query.delete()
        Cart.query.delete()
        EquipmentStatus.query.delete()
        EquipmentStateSummary.query.delete()
        EquipmentStateHistory.query.delete()
        EquipmentPrice.query.delete()
        FeaturedEquipment.query.delete()
        UserFavorite.query.delete()
        OwnerFavorite.query.delete()
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
        profileImage="https://avatarfiles.alphacoders.com/224/224246.png",
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
        profileImage="https://avatarfiles.alphacoders.com/366/366869.png",
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
        profileImage="https://avatarfiles.alphacoders.com/325/325695.png",
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
        profileImage="https://avatarfiles.alphacoders.com/368/368085.png",
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
        profileImage="https://avatarfiles.alphacoders.com/368/368118.png",
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
        profileImage="https://avatarfiles.alphacoders.com/327/327294.png",
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
        profileImage="https://avatarfiles.alphacoders.com/359/359621.png",
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
        db.session.add_all([user_1,user_2,user_3,user_4,user_5,user_6])


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
            profileImage = "https://avatarfiles.alphacoders.com/290/290163.png",
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
            profileImage = "https://avatarfiles.alphacoders.com/352/352560.png",
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
            profileImage = "https://avatarfiles.alphacoders.com/263/263535.png",
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
            profileImage = "https://avatarfiles.alphacoders.com/162/162643.png",
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
            profileImage = "https://avatarfiles.alphacoders.com/322/322466.png",
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
            profileImage = "https://avatarfiles.alphacoders.com/327/327294.png",
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
            profileImage = "https://avatarfiles.alphacoders.com/947/94761.png",
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
            profileImage = "https://avatarfiles.alphacoders.com/352/352560.png",
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
            profileImage = "https://avatarfiles.alphacoders.com/330/330705.png",
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
        db.session.add_all([owner_1,owner_2,owner_3,owner_4,owner_5,owner_6,owner_7,owner_8,owner_9,owner_10,])
        # db.session.add(owner_1)
        # db.session.add(owner_2)
        # db.session.add(owner_3)
        # db.session.add(owner_4)
        # db.session.add(owner_5)
        # db.session.add(owner_6)
        # db.session.add(owner_7)
        # db.session.add(owner_8)
        # db.session.add(owner_9)
        # db.session.add(owner_10)

        db.session.commit()

        # print(owner_1.id)
        # print(owner_2.id)
        # print(owner_3.id)
        # print(owner_4.id)
        # print(owner_5.id)
        # print(owner_6.id)
        # print(owner_7.id)
        # print(owner_8.id)
        # print(owner_9.id)
        # print(owner_10.id)
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
                # quantity = 3,
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
                # quantity = 2,
                owner_id = owner_2.id
            ),
            Equipment(
                name = 'Lawnmower',
                type = 'Garden Lawnmower',
                make = 'Honda',
                model = 'HRX217VKA',
                description = "Our Honda HRX217VKA lawnmower makes lawn care effortless and enjoyable. With its precise cutting and user-friendly features, it delivers a perfect trim every time. It's lightweight, easy to maneuver, and has been kept in pristine condition for your landscaping needs. Rent this and give your lawn the care it deserves.",
                equipment_image='https://www.usatoday.com/gcdn/presto/2023/05/23/USAT/58538094-5018-47d0-8333-33d6835b9dbc-hondalawnmowerhero.png?crop=1436,1077,x349,y0',
                location = '701 NW Street, St Lucie W Blvd, Port St. Lucie, FL 34986',
                availability = 'True',
                delivery = 'False',
                # quantity = 5,
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
                # quantity = 4,
                owner_id = owner_2.id
            ), 
            Equipment(
                name = 'Dump Truck',
                type = 'Construction Vehicle',
                make = 'Mack Trucks',
                model = 'Granite',
                description = "Tackle the toughest jobs with ease using our Mack Granite dump truck. Known for its robust build and reliability, this dump truck is a key asset in any construction project. Regularly serviced and well-maintained, it offers superior performance and durability. Ideal for transporting heavy materials, it's ready to boost your productivity.",
                equipment_image='https://img.forconstructionpros.com/files/base/acbm/fcp/image/2023/01/Mack_Granite_web.63c6e947975ae.png?auto=format%2Ccompress&q=70',
                location = '701 NW Street, St Lucie W Blvd, Port St. Lucie, FL 34986',
                availability = 'True',
                delivery = 'True',
                owner_id = owner_2.id
            ),
            Equipment(
                name = 'Scissor Lift',
                type = 'Aerial Work Platform',
                make = 'Genie',
                model = 'GS-1930',
                description = "Elevate your efficiency with our Genie GS-1930 scissor lift. Ideal for indoor and outdoor construction, maintenance, and installation applications with firm, level surfaces. Characterized by its robustness and ease of use, it provides a stable platform for elevated work. Meticulously maintained for safe and reliable operation.",
                equipment_image='https://www.bcrentals.com/equipment/wp-content/uploads/2020/03/1930PIC1.jpg',
                location = '701 NW Street, St Lucie W Blvd, Port St. Lucie, FL 34986',
                availability = 'True',
                delivery = 'False',
                owner_id = owner_2.id
            ),
            Equipment(
                name = 'Pressure Washer',
                type = 'Cleaning Equipment',
                make = 'Kärcher',
                model = 'HD 3.5/30-4S EA',
                description = "Get spotless results with our Kärcher HD 3.5/30-4S pressure washer. Perfect for cleaning buildings, vehicles, and concrete surfaces. It combines efficiency with user-friendliness and offers high cleaning performance and reliability. This pressure washer has been kept in excellent condition for your cleaning needs.",
                equipment_image='https://sceclean.com/wp-content/uploads/2016/11/karcher_hd_superclass-506x506.jpg',
                location = '701 NW Street, St Lucie W Blvd, Port St. Lucie, FL 34986',
                availability = 'True',
                delivery = 'True',
                owner_id = owner_2.id
            ),
            Equipment(
                name = 'Generator',
                type = 'Power Supply',
                make = 'Honda',
                model = 'EU2200i',
                description = "Ensure uninterrupted power with our Honda EU2200i generator. Renowned for its quiet operation and portability, this generator is a reliable source of power for outdoor events, construction sites, or emergency backup. Regularly serviced for peak performance, it's ready to supply your power needs whenever and wherever.",
                equipment_image='https://i.ytimg.com/vi/vRLvH5M24ww/maxresdefault.jpg',
                location = '701 NW Street, St Lucie W Blvd, Port St. Lucie, FL 34986',
                availability = 'True',
                delivery = 'False',
                owner_id = owner_2.id
            ),
        ]

        db.session.add_all(equipment_list)
        print(equipment_list)
        # print('Accessing fourth element:', equipment_list[3])
        # print(len(equipment_list))
        db.session.commit()
#--------------------------------------------Equipment Status---------------------------------------------------------------------
        print("Uploading the current Equipment statuses...")
        equipment_statuses = [
            EquipmentStatus(
                equipment_id = equipment_list[0].id, # Excavator
                total_quantity = 3,
                available_quantity = 3,
                reserved_quantity = 0,
                rented_quantity = 0,
                maintenance_quantity = 0,
                transit_quantity = 0
            ),
           EquipmentStatus(
                equipment_id = equipment_list[1].id, # Forklift
                total_quantity = 2,
                available_quantity = 2,
                reserved_quantity = 0,
                rented_quantity = 0,
                maintenance_quantity = 0,
                transit_quantity = 0
            ),
           EquipmentStatus(
                equipment_id = equipment_list[2].id, # Lawnmower
                total_quantity = 5,
                available_quantity = 5,
                reserved_quantity = 0,
                rented_quantity = 0,
                maintenance_quantity = 0,
                transit_quantity = 0
            ),
           EquipmentStatus(
                equipment_id = equipment_list[3].id, # Tractor
                total_quantity = 4,
                available_quantity = 4,
                rented_quantity = 0,
                reserved_quantity = 0,
                maintenance_quantity = 0,
                transit_quantity = 0
            ),
            EquipmentStatus(
                equipment_id = equipment_list[4].id, # Dump Truck
                total_quantity = 2,
                available_quantity = 2,
                reserved_quantity = 0,
                rented_quantity = 0,
                maintenance_quantity = 0,
                transit_quantity = 0
            ),
           EquipmentStatus(
                equipment_id = equipment_list[5].id, # Scissor Lift
                total_quantity = 4,
                available_quantity = 4,
                reserved_quantity = 0,
                rented_quantity = 0,
                maintenance_quantity = 0,
                transit_quantity = 0
            ),
           EquipmentStatus(
                equipment_id = equipment_list[6].id, # Pressure Washer
                total_quantity = 8,
                available_quantity = 8,
                reserved_quantity = 0,
                rented_quantity = 0,
                maintenance_quantity = 0,
                transit_quantity = 0
            ),
           EquipmentStatus(
                equipment_id = equipment_list[7].id, # Generator
                total_quantity = 10,
                available_quantity = 10,
                rented_quantity = 0,
                reserved_quantity = 0,
                maintenance_quantity = 0,
                transit_quantity = 0
            ),
        ]

        db.session.add_all(equipment_statuses)
        db.session.commit()


#--------------------------------------------Equipment State History----------------------------------------------------------------------
        print('Adding Equipment State History...')
        initial_equipment_state_histories = [ 
            EquipmentStateHistory(
            equipment_id = equipment_list[0].id,  # Excavator
            total_quantity = equipment_statuses[0].available_quantity,
            available_quantity = equipment_statuses[0].available_quantity,
            reserved_quantity = 0,
            rented_quantity = 0,
            maintenance_quantity = 0,
            transit_quantity = 0,
            damaged_quantity = 0,
            previous_state = 'non-existing',
            new_state = 'available',
            changed_at = datetime(2023, 12, 11),
        ),
        EquipmentStateHistory(
            equipment_id = equipment_list[1].id,  # Forklift
            total_quantity = equipment_statuses[1].available_quantity,
            available_quantity = equipment_statuses[1].available_quantity,
            reserved_quantity = 0,
            rented_quantity = 0,
            maintenance_quantity = 0,
            transit_quantity = 0,
            damaged_quantity = 0,
            previous_state = 'non-existing',
            new_state = 'available',
            changed_at = datetime(2023, 12, 11),
        ),
        EquipmentStateHistory(
            equipment_id = equipment_list[2].id,  # Lawnmower
            total_quantity = equipment_statuses[2].available_quantity,
            available_quantity = equipment_statuses[2].available_quantity,
            reserved_quantity = 0,
            rented_quantity = 0,
            maintenance_quantity = 0,
            transit_quantity = 0,
            damaged_quantity = 0,
            previous_state = 'non-existing',
            new_state = 'available',
            changed_at = datetime(2023, 12, 11),
        ),
        EquipmentStateHistory(
            equipment_id = equipment_list[3].id,  # Tractor
            total_quantity = equipment_statuses[3].available_quantity,
            available_quantity = equipment_statuses[3].available_quantity,
            reserved_quantity = 0,
            rented_quantity = 0,
            maintenance_quantity = 0,
            transit_quantity = 0,
            damaged_quantity = 0,
            previous_state = 'non-existing',
            new_state = 'available',
            changed_at = datetime(2023, 11, 11),
        ),
        EquipmentStateHistory(
            equipment_id = equipment_list[4].id,  # Dump Truck
            total_quantity = equipment_statuses[4].available_quantity,
            available_quantity = equipment_statuses[4].available_quantity,
            reserved_quantity = 0,
            rented_quantity = 0,
            maintenance_quantity = 0,
            transit_quantity = 0,
            damaged_quantity = 0,
            previous_state = 'non-existing',
            new_state = 'available',
            changed_at = datetime(2023, 12, 11),
        ),
        EquipmentStateHistory(
            equipment_id = equipment_list[5].id,  # Scissor Lift
            total_quantity = equipment_statuses[5].available_quantity,
            available_quantity = equipment_statuses[5].available_quantity,
            reserved_quantity = 0,
            rented_quantity = 0,
            maintenance_quantity = 0,
            transit_quantity = 0,
            damaged_quantity = 0,
            previous_state = 'non-existing',
            new_state = 'available',
            changed_at = datetime(2023, 11, 11),
        ),
        EquipmentStateHistory(
            equipment_id = equipment_list[6].id,  # Pressure Washer
            total_quantity = equipment_statuses[6].available_quantity,
            available_quantity = equipment_statuses[6].available_quantity,
            reserved_quantity = 0,
            rented_quantity = 0,
            maintenance_quantity = 0,
            transit_quantity = 0,
            damaged_quantity = 0,
            previous_state = 'non-existing',
            new_state = 'available',
            changed_at = datetime(2023, 11, 11),
        ),
        EquipmentStateHistory(
            equipment_id = equipment_list[7].id,  # Generator
            total_quantity = equipment_statuses[7].available_quantity,
            available_quantity = equipment_statuses[7].available_quantity,
            reserved_quantity = 0,
            rented_quantity = 0,
            maintenance_quantity = 0,
            transit_quantity = 0,
            damaged_quantity = 0,
            previous_state = 'non-existing',
            new_state = 'available',
            changed_at = datetime(2023, 11, 11),
        )
    ]
        db.session.add_all(initial_equipment_state_histories)

        db.session.commit()

        
#------------------------------------------EQUIPMENT PRICES---------------------------------------
        print('Calculating price of Equipment...')
        equipment_prices = [
            EquipmentPrice(
            hourly_rate = 1595,
            daily_rate = 32000,
            weekly_rate = 220000,
            promo_rate = 1495,
            equipment_id = equipment_list[0].id # Excavator
            ),
            EquipmentPrice(
            hourly_rate = 1595,
            daily_rate = 32000,
            weekly_rate = 220000,
            promo_rate = 1495,
            equipment_id = equipment_list[1].id # Forklift
            ),
            EquipmentPrice(
            hourly_rate = 1595,
            daily_rate = 32000,
            weekly_rate = 220000,
            promo_rate = 1495,
            equipment_id = equipment_list[2].id # Lawnmower
            ),
            EquipmentPrice(
            hourly_rate = 1595,
            daily_rate = 32000,
            weekly_rate = 220000,
            promo_rate = 1495,
            equipment_id = equipment_list[3].id # Tractor
            ),
            EquipmentPrice(
            hourly_rate = 1595,
            daily_rate = 32000,
            weekly_rate = 220000,
            promo_rate = 1495,
            equipment_id = equipment_list[4].id # Dump Truck
            ),
            EquipmentPrice(
            hourly_rate = 1595,
            daily_rate = 32000,
            weekly_rate = 220000,
            promo_rate = 1495,
            equipment_id = equipment_list[5].id # Scissor Lift
            ),
            EquipmentPrice(
            hourly_rate = 1595,
            daily_rate = 32000,
            weekly_rate = 220000,
            promo_rate = 1495,
            equipment_id = equipment_list[6].id # Pressure Washer
            ),
            EquipmentPrice(
            hourly_rate = 1595,
            daily_rate = 32000,
            weekly_rate = 220000,
            promo_rate = 1495,
            equipment_id = equipment_list[7].id # Generator
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

        cart3 = Cart(
            cart_name ="November Key West Project",
            cart_status = "ACTIVE",
            created_at = datetime(2023, 11, 11),
            user_id = user_1.id,
        )
        
        db.session.add_all([cart1, cart2])
        

        print("Generating example cart items...")   
        cart_items = [
            CartItem(
                price_cents_at_addition = equipment_prices[0].hourly_rate,
                price_cents_if_changed = None,
                quantity = 1,
                rental_rate="hourly",
                rental_length = 6,
                cart_id= cart1.id,
                equipment_id = equipment_list[0].id, # Excavator
                created_at = datetime(2023, 12, 9),
            ),
            CartItem(
                price_cents_at_addition = equipment_prices[1].daily_rate,
                price_cents_if_changed = None,
                quantity = 1,
                rental_rate="daily",
                rental_length = 5,
                cart_id= cart1.id,
                equipment_id = equipment_list[1].id, # Forklift
                created_at = datetime(2023, 12, 9),
            ),
            CartItem(
                price_cents_at_addition = equipment_prices[2].weekly_rate,
                price_cents_if_changed = None,
                quantity = 1,
                rental_rate="weekly",
                rental_length = 2,
                cart_id= cart1.id,
                equipment_id = equipment_list[2].id, # Lawnmower
                created_at = datetime(2023, 12, 9),
            ),
            CartItem(
                price_cents_at_addition = equipment_prices[2].weekly_rate,
                price_cents_if_changed = None,
                quantity = 2,
                rental_rate="weekly",
                rental_length = 2,
                cart_id= cart1.id,
                equipment_id = equipment_list[3].id, # JOHN DEERE
                created_at = datetime(2023, 11, 11),
            ),
            CartItem(
                price_cents_at_addition = equipment_prices[2].weekly_rate,
                price_cents_if_changed = None,
                quantity = 4,
                rental_rate="weekly",
                rental_length = 2,
                cart_id= cart1.id,
                equipment_id = equipment_list[6].id, # Pressure Washer
                created_at = datetime(2023, 11, 11),
            ),
            CartItem(
                price_cents_at_addition = equipment_prices[2].weekly_rate,
                price_cents_if_changed = None,
                quantity = 1,
                rental_rate="weekly",
                rental_length = 2,
                cart_id= cart1.id,
                equipment_id = equipment_list[7].id, # Generator
                created_at = datetime(2023, 11, 11),
            ),
        ]

        cart_item_equipment_state_histories = [
            EquipmentStateHistory(
            equipment_id = cart_items[0].equipment_id,  # Excavator
            total_quantity = initial_equipment_state_histories[0].total_quantity,
            available_quantity = initial_equipment_state_histories[0].available_quantity - cart_items[0].quantity,
            reserved_quantity = cart_items[0].quantity,
            rented_quantity = 0,
            maintenance_quantity = 0,
            transit_quantity = 0,
            damaged_quantity = 0,
            previous_state = initial_equipment_state_histories[0].new_state,
            new_state = f'User reserved {cart_items[0].quantity} item or items to their cart',
            changed_at = datetime(2023, 12, 12),
        ),
        EquipmentStateHistory(
            equipment_id = cart_items[1].equipment_id,  # Forklift
            total_quantity = initial_equipment_state_histories[1].total_quantity,
            available_quantity = initial_equipment_state_histories[1].available_quantity - cart_items[1].quantity,
            reserved_quantity = cart_items[1].quantity,
            rented_quantity = 0,
            maintenance_quantity = 0,
            transit_quantity = 0,
            damaged_quantity = 0,
            previous_state = initial_equipment_state_histories[1].new_state,
            new_state = f'User reserved {cart_items[1].quantity} item or items to their cart',
            changed_at = datetime(2023, 12, 12),
        ),
        EquipmentStateHistory(
            equipment_id = cart_items[2].equipment_id,  # Lawnmower
            total_quantity = initial_equipment_state_histories[2].total_quantity,
            available_quantity = initial_equipment_state_histories[2].available_quantity - cart_items[2].quantity,
            reserved_quantity = cart_items[2].quantity,
            rented_quantity = 0,
            maintenance_quantity = 0,
            transit_quantity = 0,
            damaged_quantity = 0,
            previous_state = initial_equipment_state_histories[2].new_state,
            new_state = f'User reserved {cart_items[2].quantity} item or items to their cart',
            changed_at = datetime(2023, 12, 12),
        ),
        EquipmentStateHistory(
            equipment_id = cart_items[3].equipment_id,  # John Deere
            total_quantity = initial_equipment_state_histories[3].total_quantity,
            available_quantity = initial_equipment_state_histories[3].available_quantity - cart_items[3].quantity,
            reserved_quantity = cart_items[3].quantity,
            rented_quantity = 0,
            maintenance_quantity = 0,
            transit_quantity = 0,
            damaged_quantity = 0,
            previous_state = initial_equipment_state_histories[7].new_state,
            new_state = f'User reserved {cart_items[3].quantity} item or items to their cart',
            changed_at = datetime(2023, 11, 11),
        ),
        EquipmentStateHistory(
            equipment_id = cart_items[4].equipment_id,  # Pressure Washer
            total_quantity = initial_equipment_state_histories[6].total_quantity,
            available_quantity = initial_equipment_state_histories[6].available_quantity - cart_items[4].quantity,
            reserved_quantity = cart_items[4].quantity,
            rented_quantity = 0,
            maintenance_quantity = 0,
            transit_quantity = 0,
            damaged_quantity = 0,
            previous_state = initial_equipment_state_histories[6].new_state,
            new_state = f'User reserved {cart_items[4].quantity} item or items to their cart',
            changed_at = datetime(2023, 11, 11),
        ),
        EquipmentStateHistory(
            equipment_id = cart_items[5].equipment_id,  # Generator
            total_quantity = initial_equipment_state_histories[7].total_quantity,
            available_quantity = initial_equipment_state_histories[7].available_quantity - cart_items[5].quantity,
            reserved_quantity = cart_items[5].quantity,
            rented_quantity = 0,
            maintenance_quantity = 0,
            transit_quantity = 0,
            damaged_quantity = 0,
            previous_state = initial_equipment_state_histories[7].new_state,
            new_state = f'User reserved {cart_items[5].quantity} item or items to their cart',
            changed_at = datetime(2023, 11, 11),
        )
        
        ]

        db.session.add_all(cart_items)
        db.session.add_all(cart_item_equipment_state_histories)
        # db.session.add_all([equipment_state_history_5, equipment_state_history_6, equipment_state_history_7])

        # print(' LOOK HERE ')
        # print(equipment_state_history_5.available_quantity)
        # print(equipment_state_history_6.available_quantity)
        # print(equipment_state_history_7.available_quantity)
        db.session.commit()

        # Changing quantity through equipment statuses, 
        print('THE MATH:', equipment_statuses[0].available_quantity - cart_item_equipment_state_histories[0].reserved_quantity)
        print(equipment_statuses[0].available_quantity)
        equipment_statuses[0].available_quantity -= cart_item_equipment_state_histories[0].reserved_quantity
        equipment_statuses[0].reserved_quantity += cart_item_equipment_state_histories[0].reserved_quantity
        
        equipment_statuses[1].available_quantity -= cart_item_equipment_state_histories[1].reserved_quantity
        equipment_statuses[1].reserved_quantity += cart_item_equipment_state_histories[1].reserved_quantity

        equipment_statuses[2].available_quantity -= cart_item_equipment_state_histories[2].reserved_quantity
        equipment_statuses[2].reserved_quantity += cart_item_equipment_state_histories[2].reserved_quantity

        equipment_statuses[3].available_quantity -= cart_item_equipment_state_histories[3].reserved_quantity
        equipment_statuses[3].reserved_quantity += cart_item_equipment_state_histories[3].reserved_quantity

        equipment_statuses[6].available_quantity -= cart_item_equipment_state_histories[4].reserved_quantity
        equipment_statuses[6].reserved_quantity += cart_item_equipment_state_histories[4].reserved_quantity

        equipment_statuses[7].available_quantity -= cart_item_equipment_state_histories[5].reserved_quantity
        equipment_statuses[7].reserved_quantity += cart_item_equipment_state_histories[5].reserved_quantity

        
        # equipment_list[0].status[0].available_quantity -= cart_items[0].quantity
        # equipment_list[1].status[0].available_quantity-= cart_items[1].quantity
        # equipment_list[2].status[0].available_quantity-= cart_items[2].quantity

        # equipment_list[0].status[0].reserved_quantity += cart_items[0].quantity
        # equipment_list[1].status[0].reserved_quantity += cart_items[1].quantity
        # equipment_list[2].status[0].reserved_quantity += cart_items[2].quantity

        # print(equipment_list[2].quantity)
        # print(equipment_list[1].quantity)
        # print(equipment_list[0].quantity)

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
            delivery = True,
            delivery_address = user_1.location,
            user_decision = "accept",
            owner_decision = "accept",
            agreement_status = "both-accepted",
            owner_id = owner_2.id, # Emily Johnson
            user_id=user_1.id,  # Benjamin Davis
            cart_item_id=cart_items[0].id,  # Excavator caterpillar thing
            created_at = datetime.utcnow(),
            updated_at = datetime.utcnow()
        ),
        RentalAgreement(
            rental_start_date="2023-07-17",
            rental_end_date="2023-07-20",
            delivery = False,
            delivery_address = "",
            user_decision = "accept",
            owner_decision = "pending",
            agreement_status = "user-accepted",
            owner_id = owner_2.id, # Emily Johnson
            user_id=user_1.id,  # Benjamin Davis
            cart_item_id=cart_items[1].id,  # Forklift
            created_at = datetime(2023, 11, 30),  # Year, Month, Day
            updated_at = datetime(2023, 11, 30)
            # created_at = datetime.utcnow(),
            # updated_at = datetime.utcnow()
        ),
        RentalAgreement(
            rental_start_date="2023-07-17",
            rental_end_date="2023-07-20",
            delivery = False,
            delivery_address = "",
            user_decision = "accept",
            owner_decision = "accept",
            agreement_status = "owner-accepted",
            owner_id = owner_2.id, # Emily Johnson
            user_id=user_1.id,  # Benjamin Davis
            cart_item_id=cart_items[2].id,  # Lawnmower
            created_at = datetime(2023, 11, 24),  # Year, Month, Day
            updated_at = datetime(2023, 11, 24)
            # created_at = datetime.utcnow(),
            # updated_at = datetime.utcnow()
        ),
        RentalAgreement(
            rental_start_date="2023-07-17",
            rental_end_date="2023-07-20",
            delivery = False,
            delivery_address = "",
            user_decision = "accept",
            owner_decision = "accept",
            agreement_status = "completed",
            owner_id = owner_2.id, # Emily Johnson
            user_id=user_1.id,  # Benjamin Davis
            cart_item_id=cart_items[2].id,  # Lawnmower
            created_at = datetime(2023, 12, 9),  # Year, Month, Day
            updated_at = datetime(2023, 12, 9)
        ),
        RentalAgreement(
            rental_start_date="2023-07-17",
            rental_end_date="2023-07-20",
            delivery = False,
            delivery_address = "",
            user_decision = "accept",
            owner_decision = "accept",
            agreement_status = "completed",
            owner_id = owner_2.id, # Emily Johnson
            user_id=user_1.id,  # Benjamin Davis
            cart_item_id=cart_items[3].id,  # John Deere
            created_at = datetime(2023, 12, 9),  # Year, Month, Day
            updated_at = datetime(2023, 12, 9)
        ),
        # RentalAgreement(
        #     rental_start_date="2023-07-17",
        #     rental_end_date="2023-07-20",
        #     delivery = False,
        #     delivery_address = "",
        #     user_decision = "accept",
        #     owner_decision = "accept",
        #     agreement_status = "completed",
        #     owner_id = owner_2.id, # Henry Cavill
        #     user_id=user_1.id,  # Sarah Thompson
        #     cart_item_id=cart_items[2].id,  # Lawnmower
        #     created_at = datetime(2023, 10, 15),  # Year, Month, Day
        #     updated_at = datetime(2023, 10, 15)
        # )
        RentalAgreement(
            rental_start_date="2023-11-11",
            rental_end_date="2023-11-20",
            delivery = False,
            delivery_address = "",
            user_decision = "accept",
            owner_decision = "accept",
            agreement_status = "completed",
            owner_id = owner_2.id, # Emily Johnson
            user_id=user_1.id,  # Benjamin Davis
            cart_item_id=cart_items[3].id,  # Pressure Washer
            created_at = datetime(2023, 11, 11),  # Year, Month, Day
            updated_at = datetime(2023, 11, 11)
        ),
        RentalAgreement(
            rental_start_date="2023-11-11",
            rental_end_date="2023-11-20",
            delivery = False,
            delivery_address = "",
            user_decision = "accept",
            owner_decision = "accept",
            agreement_status = "completed",
            owner_id = owner_2.id, # Emily Johnson
            user_id=user_1.id,  # Benjamin Davis
            cart_item_id=cart_items[4].id,  # Generator
            created_at = datetime(2023, 11, 11),  # Year, Month, Day
            updated_at = datetime(2023, 11, 11)
        ),
        ]

        db.session.add_all(rental_agreements)
        db.session.commit()
#------------------------------------------ NEW STATE HISTORY FOR A RENTAL AGREEMENT---------------
        print('Adding Equipment State History for Completed Rentals...')
        #(available → reserved → rented)

        # equipment_state_history_8 = EquipmentStateHistory(
        #     equipment_id = cart_items[2].equipment_id,  # Lawnmower
        #     total_quantity = initial_equipment_state_histories[2].total_quantity,
        #     available_quantity = initial_equipment_state_histories[2].total_quantity - cart_items[2].quantity,
        #     reserved_quantity = initial_equipment_state_histories[2].total_quantity - cart_items[2].quantity,
        #     rented_quantity = cart_items[2].quantity,
        #     maintenance_quantity = 0,
        #     transit_quantity = 0,
        #     damaged_quantity = 0,
        #     previous_state = cart_item_equipment_state_histories[2].new_state,
        #     new_state = f'User rented {cart_items[2].quantity} item or items',
        #     changed_at = datetime(2023, 12, 13),
        # )
        print('READ THIS PRINT:', cart_item_equipment_state_histories[3].available_quantity - cart_items[3].quantity)
        rental_agreements_state_history = [
            EquipmentStateHistory(
            equipment_id = cart_items[2].equipment_id,  # Lawnmower
            total_quantity = cart_item_equipment_state_histories[2].total_quantity,
            available_quantity = cart_item_equipment_state_histories[2].available_quantity,
            reserved_quantity = cart_item_equipment_state_histories[2].reserved_quantity - cart_items[2].quantity,
            rented_quantity = cart_items[2].quantity,
            maintenance_quantity = 0,
            transit_quantity = 0,
            damaged_quantity = 0,
            previous_state = cart_item_equipment_state_histories[2].new_state,
            new_state = f'User rented {cart_items[2].quantity} item or items',
            changed_at = datetime(2023, 12, 13),
        ),
        EquipmentStateHistory(
            equipment_id = cart_items[3].equipment_id,  # John Deere
            total_quantity = cart_item_equipment_state_histories[3].total_quantity,
            available_quantity = cart_item_equipment_state_histories[3].available_quantity,
            reserved_quantity = cart_item_equipment_state_histories[3].reserved_quantity - cart_items[3].quantity,
            rented_quantity = cart_items[3].quantity,
            maintenance_quantity = 0,
            transit_quantity = 0,
            damaged_quantity = 0,
            previous_state = cart_item_equipment_state_histories[3].new_state,
            new_state = f'User rented {cart_items[3].quantity} item or items',
            changed_at = datetime(2023, 11, 11),
        ),
        EquipmentStateHistory(
            equipment_id = cart_items[4].equipment_id,  # Pressure Washer
            total_quantity = cart_item_equipment_state_histories[4].total_quantity,
            available_quantity = cart_item_equipment_state_histories[4].available_quantity,
            reserved_quantity = cart_item_equipment_state_histories[4].reserved_quantity - cart_items[4].quantity,
            rented_quantity = cart_items[4].quantity,
            maintenance_quantity = 0,
            transit_quantity = 0,
            damaged_quantity = 0,
            previous_state = cart_item_equipment_state_histories[3].new_state,
            new_state = f'User rented {cart_items[4].quantity} item or items',
            changed_at = datetime(2023, 11, 11),
        ),
        EquipmentStateHistory(
            equipment_id = cart_items[5].equipment_id,  # Generator
            total_quantity = cart_item_equipment_state_histories[5].total_quantity,
            available_quantity = cart_item_equipment_state_histories[5].available_quantity,
            reserved_quantity = cart_item_equipment_state_histories[5].reserved_quantity - cart_items[5].quantity,
            rented_quantity = cart_items[5].quantity,
            maintenance_quantity = 0,
            transit_quantity = 0,
            damaged_quantity = 0,
            previous_state = cart_item_equipment_state_histories[4].new_state,
            new_state = f'User rented {cart_items[5].quantity} item or items',
            changed_at = datetime(2023, 11, 11),
        )
        ]

        one_rented_8_added = EquipmentStateHistory(
            equipment_id = cart_items[2].equipment_id,  # Lawnmower
            total_quantity = cart_item_equipment_state_histories[2].total_quantity + 8,
            available_quantity = cart_item_equipment_state_histories[2].available_quantity + 8,
            reserved_quantity = rental_agreements_state_history[0].reserved_quantity,
            rented_quantity = cart_items[2].quantity,
            maintenance_quantity = 0,
            transit_quantity = 0,
            damaged_quantity = 0,
            previous_state = rental_agreements_state_history[0].new_state,
            new_state = f'Owner added {8} items or item',
            changed_at = datetime(2023, 12, 13),
        )

        one_maintained_9 = EquipmentStateHistory(
            equipment_id = cart_items[2].equipment_id,  # Lawnmower
            total_quantity = one_rented_8_added.total_quantity,
            available_quantity = one_rented_8_added.available_quantity - 1,
            reserved_quantity = one_rented_8_added.reserved_quantity,
            rented_quantity = cart_items[2].quantity,
            maintenance_quantity = 1,
            transit_quantity = 0,
            damaged_quantity = 0,
            previous_state = one_rented_8_added.new_state,
            new_state = f'Owner sent {1} items or item to maintenance',
            changed_at = datetime(2023, 12, 15),
        )

        print('READ THIS PRINT:', cart_item_equipment_state_histories[4].total_quantity - cart_items[4].quantity)

        # db.session.add_all([equipment_state_history_8,])
        
        db.session.add_all(rental_agreements_state_history,)
        db.session.commit()

        print("PLEASE BE 0:", cart_item_equipment_state_histories[3].reserved_quantity - cart_items[3].quantity,)

        equipment_statuses[2].rented_quantity += rental_agreements_state_history[0].rented_quantity
        equipment_statuses[2].reserved_quantity -= rental_agreements_state_history[0].rented_quantity

        equipment_statuses[3].rented_quantity += rental_agreements_state_history[1].rented_quantity
        equipment_statuses[3].reserved_quantity -= rental_agreements_state_history[1].rented_quantity

        equipment_statuses[6].rented_quantity += rental_agreements_state_history[2].rented_quantity
        equipment_statuses[6].reserved_quantity -= rental_agreements_state_history[2].rented_quantity
        
        equipment_statuses[7].rented_quantity += rental_agreements_state_history[3].rented_quantity
        equipment_statuses[7].reserved_quantity -= rental_agreements_state_history[3].rented_quantity

        db.session.add_all([one_rented_8_added, one_maintained_9])
        db.session.commit()

        equipment_statuses[2].total_quantity = one_maintained_9.total_quantity
        equipment_statuses[2].available_quantity = one_maintained_9.available_quantity
        equipment_statuses[2].reserved_quantity -= one_maintained_9.rented_quantity
        equipment_statuses[2].maintenance_quantity += one_maintained_9.maintenance_quantity

        # print("TOTAL QUANTITY CHECK:", one_maintained_9.available_quantity)
        print("TOTAL QUANTITY CHECK:", equipment_statuses[2].total_quantity)
        print("TOTAL AVAILABLE CHECK:", equipment_statuses[2].available_quantity)

        # if len(cart_items) == 3:
        #     print('Tractor', cart_items[3].quantity)
        # else:
        #     print("Tractor item not found in cart_items")

        # print(len(equipment_list))
        # print('Excavator',equipment_list[0].quantity)
        # print('Forklift',equipment_list[1].quantity)
        # print('Lawnmower',equipment_list[2].quantity)
        # print('Tractor',equipment_list[3].quantity)

        

#-----------------------------------------------------------------------------

#This will be an attempt to write a function that handles creating summaries of state history.
         
        # print("ATTEMPTING TO CALCULATE MONTHLY STATE SUMMARY")
        # def calculate_monthly_summaries_for_all_equipment(month, year):
        #     start_of_month = datetime(year, month, 1)
        #     end_of_month = datetime(year, month + 1, 1) if month < 12 else datetime(year + 1, 1, 1)

        #     unique_equipment_ids = EquipmentStateHistory.query.with_entities(EquipmentStateHistory.equipment_id).distinct().all()

        #     all_summaries = {}

        #     for equipment_id_tuple in unique_equipment_ids:
        #         equipment_id = equipment_id_tuple[0]

        #         # Fetch all state history records for this equipment in the specified month
        #         monthly_history_records = EquipmentStateHistory.query.filter(
        #             EquipmentStateHistory.equipment_id == equipment_id,
        #             EquipmentStateHistory.changed_at >= start_of_month,
        #             EquipmentStateHistory.changed_at < end_of_month
        #         ).order_by(EquipmentStateHistory.changed_at).all()

        #         if not monthly_history_records:
        #             continue

        #         # Initialize summary data for new equipment
        #         summary_data = all_summaries.setdefault(equipment_id, {
        #             'total_quantity': 0,
        #             'total_available': 0,
        #             'total_reserved': 0,
        #             'total_rented_out': 0,
        #             'total_maintenance': 0,
        #             'total_cancelled': 0,
        #             'equipment_history_id': monthly_history_records[-1].id
        #         })
        #         # https://www.w3schools.com/python/ref_func_max.asp
        #         for record in monthly_history_records:
        #             summary_data['total_quantity'] = max(summary_data['total_quantity'], record.total_quantity)
        #             summary_data['total_reserved'] = record.reserved_quantity
        #             summary_data['total_rented_out'] = record.rented_quantity
        #             summary_data['total_available'] = record.available_quantity
        #             summary_data['total_maintenance'] = record.maintenance_quantity
        #             # Add other relevant state changes here

        #         # Calculate total available based on the last record of the month
        #         last_record = monthly_history_records[-1]
        #         summary_data['total_available'] = last_record.available_quantity

        #     # Create summary records for each equipment
        #     for equipment_id, summary_data in all_summaries.items():
        #         new_summary = EquipmentStateSummary(
        #             equipment_history_id=summary_data['equipment_history_id'],
        #             date=start_of_month,
        #             state='summary',
        #             total_quantity=summary_data['total_quantity'],
        #             total_available=summary_data['total_available'],
        #             total_reserved=summary_data['total_reserved'],
        #             total_rented_out=summary_data['total_rented_out'],
        #             total_cancelled=summary_data['total_cancelled'],
        #             total_maintenance_quantity=summary_data['total_maintenance'],
        #             equipment_id=equipment_id
        #         )
        #         db.session.add(new_summary)

        #     db.session.commit()

        #     return all_summaries
        
        # summaries_for_november = calculate_monthly_summaries_for_all_equipment(11, 2023)
        # summaries_for_december = calculate_monthly_summaries_for_all_equipment(12, 2023)

        def calculate_monthly_summaries_for_all_equipment(month, year):
            start_of_month = datetime(year, month, 1).date()
            end_of_month = datetime(year, month + 1, 1).date() if month < 12 else datetime(year + 1, 1, 1).date()
            
            print("THE START OF THE MONTH:", start_of_month)
            print("THE END OF THE MONTH:", end_of_month)
            unique_equipment_ids = EquipmentStateHistory.query.with_entities(EquipmentStateHistory.equipment_id).distinct().all()
            
            all_summaries = {}
            
            for equipment_id_tuple in unique_equipment_ids:
                equipment_id = equipment_id_tuple[0]
                
                monthly_history_records = EquipmentStateHistory.query.filter(
                    EquipmentStateHistory.equipment_id == equipment_id,
                    EquipmentStateHistory.changed_at >= start_of_month,
                    EquipmentStateHistory.changed_at < end_of_month
                ).order_by(EquipmentStateHistory.changed_at).all()
                
                if not monthly_history_records:
                    continue
                
                summary_data = all_summaries.setdefault(equipment_id, {
                    'total_quantity': 0,
                    'total_available': 0,
                    'total_reserved': 0,
                    'total_rented_out': 0,
                    'total_maintenance': 0,
                    'total_cancelled': 0,
                    'equipment_history_id': monthly_history_records[-1].id
                })
                
                for record in monthly_history_records:
                    summary_data['total_quantity'] = max(summary_data['total_quantity'], record.total_quantity)
                    summary_data['total_reserved'] = record.reserved_quantity
                    summary_data['total_rented_out'] = record.rented_quantity
                    summary_data['total_available'] = record.available_quantity
                    summary_data['total_maintenance'] = record.maintenance_quantity
                
                last_record = monthly_history_records[-1]
                summary_data['total_available'] = last_record.available_quantity
            
            for equipment_id, summary_data in all_summaries.items():
                existing_summary = EquipmentStateSummary.query.filter_by(
                    equipment_id=equipment_id,
                    date=start_of_month
                ).first()
                
                if existing_summary:
                    for key, value in summary_data.items():
                        setattr(existing_summary, key, value)
                else:
                    new_summary = EquipmentStateSummary(
                        equipment_history_id=summary_data['equipment_history_id'],
                        date=start_of_month,
                        state='summary',
                        total_quantity=summary_data['total_quantity'],
                        total_available=summary_data['total_available'],
                        total_reserved=summary_data['total_reserved'],
                        total_rented_out=summary_data['total_rented_out'],
                        total_cancelled=summary_data['total_cancelled'],
                        total_maintenance_quantity=summary_data['total_maintenance'],
                        equipment_id=equipment_id
                    )
                    db.session.add(new_summary)
            
            try:
                db.session.commit()
            except IntegrityError:
                db.session.rollback()
                raise

        summaries_for_november = calculate_monthly_summaries_for_all_equipment(11, 2023)
        summaries_for_december = calculate_monthly_summaries_for_all_equipment(12, 2023)
        



#-----------------------------------------------------------------------------
#---------------------Rental Comments---------------
        print("Configuring our current rental agreement comments...")
        agreement_comments = [
        AgreementComment(
            comment = " This looks good to me, I'll go ahead and accept it!",
            owner_id = owner_2.id, # Emily Johnson
            agreement_id = rental_agreements[0].id,
            created_at = datetime.utcnow(),
            updated_at = datetime.utcnow()
        ),
        AgreementComment(
            comment = " I'm so sorry, but I actually don't need this for delivery!",
            user_id=user_1.id,  # Benjamin Davis
            agreement_id = rental_agreements[0].id,
            created_at = datetime.utcnow(),
            updated_at = datetime.utcnow()
        ),
        AgreementComment(
            comment = "Sounds good, thanks for renting it!",
            owner_id = owner_2.id, # Emily Johnson
            agreement_id = rental_agreements[0].id,
            created_at = datetime.utcnow(),
            updated_at = datetime.utcnow()
        )]

        db.session.add_all(agreement_comments)
        db.session.commit()

#---------------------Review Testing----------------
        
        # THIS WORKS PERFECTLY BTW, JUST COMMENTED OUT TO TEST OUT THE POSTING OF REVIEWS AND SUCH

        # print("Creating reviews...")
        # reviews = [
        #     Review(
        #         review_stars = 5,
        #         review_comment = "Having worked with a wide array of heavy machinery in my two decades on the job, I can say with confidence that Emily Johnson's Caterpillar Excavator is one of the best I've operated. Not only was the machine in excellent condition, but it also performed flawlessly throughout the rental period. Emily was punctual and professional, providing clear instructions and quick support whenever needed. The equipment was well-maintained and handled the demands of the job with ease. It's a solid piece of machinery that I'd recommend to any fellow construction equipment operator looking for reliable heavy machinery. Five stars for both the excavator and Emily's outstanding service.",
        #         reviewer_type = "user",
        #         created_at = datetime.utcnow(),
        #         updated_at = datetime.utcnow(),
        #         agreement_id = rental_agreements[2].id,
        #         user_id = user_1.id,
        #         owner_id = owner_2.id
        #     ),
        #     Review(
        #         review_stars = 5,
        #         review_comment = "Benjamin Davis was an exemplary renter. His vast experience was evident from the start, handling the excavator with skill and care. He followed all operational guidelines and returned the equipment in impeccable condition. Communication was clear and consistent, making the rental process smooth and professional. It was a pleasure working with someone who respects the machinery and operates it as if it were their own. Benjamin's expertise and professionalism make him a highly recommended renter. I would not hesitate to rent to him again in the future.",
        #         reviewer_type = "owner",
        #         created_at = datetime.utcnow(),
        #         updated_at = datetime.utcnow(),
        #         agreement_id = rental_agreements[2].id,
        #         user_id = user_1.id,
        #         owner_id =owner_2.id 
        #     )
        # ]

        # db.session.add_all(reviews)
        # db.session.commit()

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
        
        # owner2 = EquipmentOwner.query.filter_by(id = owner_2.id).first()
        # if owner2:
        #     print("Owner 2's Inboxes:")
        #     for inbox in owner2.owner_inboxes:
        #         print(f"Inbox ID: {inbox.id}, Thread ID: {inbox.thread_id}")


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
