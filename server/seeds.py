from models import db, User, EquipmentOwner, Equipment, RentalAgreement
import pandas as pd
from app import app
from random import randint, choice as rc

if __name__ == '__main__':
    with app.app_context():
        #Clear dbs
        print("Clearing db...")
        RentalAgreement.query.delete()
        Equipment.query.delete()
        EquipmentOwner.query.delete()
        User.query.delete()

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
        profileImg="profile_benjamin.png",
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
        profileImg="profile_ethan.png",
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
        profileImg="profile_william.png",
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
        profileImg="profile_sofia.png",
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
        profileImg="profile_christian.png",
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
        profileImg="profile_sarah.png",
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
        profileImg="profile_thomas.png",
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
        equipment_owners = [
        EquipmentOwner(
            name="Mark Davis", # Painting Equipment
            location="Chicago, Illinois",
            profession="Plumbing",
            phone="312-555-6789",
            email="markdavis82@yahoo.com",
            website = " "
        ),
        EquipmentOwner(
            name="Emily Johnson", # Party Equipment
            location="Phoenix, Arizona",
            profession="Party",
            phone="602-555-7891",
            email="ejohnson@live.com",
            website = " "
        ),
        EquipmentOwner(
            name="Andrew Jacobs", #Automotive Equipment
            location="Houston, Texas",
            profession="Automotive",
            phone="713-555-0123",
            email="andrewjacobs93@gmail.com",
            website = " "
        ),
        EquipmentOwner(
            name="Henry Cavill", #Garden Equipment
            location="Seattle, Washington",
            profession="Garden",
            phone="206-555-3456",
            email="hcavill34@hotmail.com",
            website = " "
        ),
        EquipmentOwner(
            name="David Rodriguez", #Heavy Machinery
            location="Miami, Florida",
            profession="Heavy Machinery",
            phone="305-555-1234",
            email="davidr83@gmail.com",
            website = " "
        ),
        EquipmentOwner(
            name="Amy Wilson", #Construction Equipment
            location="Chicago, Illinois",
            profession="Construction",
            phone="312-555-5678",
            email="amywilson22@yahoo.com",
            website = " "
        ),
        EquipmentOwner(
            name="Daniel Lee", # Cleaning Equipment
            location="Houston, Texas",
            profession="Cleaning",
            phone="713-555-4567",
            email="daniel.lee78@yahoo.com",
            website = " "
        ),
        EquipmentOwner(
            name="Jessica Sanchez", # Plumbing Equipment
            location="New York City, New York",
            profession="Plumbing",
            phone ="212-555-2345",
            email="jess.sanchez22@gmail.com",
            website = " "
        ),
        EquipmentOwner(
            name="Ryan Phillips", #Power-tool and hand-tool Equipment
            location="Orlando, Florida",
            profession="Power tools and Hand tools",
            phone="407-555-9012",
            email="ryan.phillips87@gmail.com",
            website = " "
        ),
        EquipmentOwner(
            name="Michelle Adams", #Woodwork
            location="New Orleans, Louisiana",
            profession="Woodworking",
            phone="504-555-7890",
            email="madams90@gmail.com",
            website = " "
        )]
        db.session.add_all(equipment_owners)
#---------------------------------------------------------
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
            equipment_id=38  # Amy Wilson #Available
        ),
        RentalAgreement(
            location="Miami, Florida",
            total_price=200,
            rental_dates="2023-07-19 to 2023-07-23",
            owner_id = 5, # David Rodriguez
            user_id=2,  # Ethan Martinez
            equipment_id=8  # David Rodriguez #Available
        ),
        RentalAgreement(
            location="Houston, Texas",
            total_price=100,
            rental_dates="2023-07-17 to 2023-07-20",
            owner_id = 7, # Daniel Lee
            user_id=3,  # William Anderson
            equipment_id=317  # Daniel Lee #Available
        ),
        RentalAgreement(
            location="Phoenix, Arizona",
            total_price=80,
            rental_dates="2023-07-16 to 2023-07-19",
            owner_id = 2, # Emily Johnson
            user_id=4,  # Sofia Rodriguez
            equipment_id=361  # Emily Johnson #Available
        ),
        RentalAgreement(
            location="Seattle, Washington",
            total_price=180,
            rental_dates="2023-07-18 to 2023-07-21",
            owner_id = 4, # Henry Cavill
            user_id=6,  # Sarah Thompson
            equipment_id=121  # Henry Cavill #Available
        ),
        RentalAgreement(
            location="Houston, Texas",
            total_price=120,
            rental_dates="2023-07-22 to 2023-07-24",
            owner_id = 3, # Andrew Jacobs
            user_id=7,  # Thomas Brady
            equipment_id=311  # Andrew Jacobs #Available
        ),
        RentalAgreement(
            location="Chicago, Illinois",
            total_price=80,
            rental_dates="2023-07-23 to 2023-07-24",
            owner_id = 1, # Mark Davis
            user_id=5,  # Christian Domingues
            equipment_id=238  # Mark Davis #Available
        ),
        RentalAgreement(
            location="Phoenix, Arizona",
            total_price=120,
            rental_dates="2023-07-22 to 2023-07-23",
            owner_id = 2, # Emily Johnson
            user_id=4,  # Sofia Rodriguez
            equipment_id=355  # Emily Johnson #Available
        ),
        RentalAgreement(
            location="Dallas, Texas",
            total_price=150,
            rental_dates="2023-07-19 to 2023-07-22",
            owner_id = 7,
            user_id=3,  # William Anderson
            equipment_id=318  # Daniel Lee #Available
        )]

        db.session.add_all(rental_agreements)

        #     RentalAgreement(
        #     location="Orlando, Florida",
        #     total_price=300,
        #     rental_dates="2023-07-20 to 2023-07-25",
        #     user_id=2,  # Ethan Martinez
        #     owner_id=9  # Ryan Phillips
        # ),
#-------------------------------------------------------------------------------------------------------------------------------------------------
#Seed Equipment with panda. 
#Seed Equipment
        print("Uploading the current equipment list...")
        data = pd.read_csv('/home/mako77/code/Flatiron/Projects/EquipMe/extrafiles/equipment_list_with_contact - equipment_data.csv')

        data.columns = ['Equipment_name', 'Equipment_type', 'Make', 'Model', 'Owner', 'Phone', 'Email', 'Location', 'Availability', 'Delivery', 'Quantity']
        equipment_list = []

        for index, row in data.iterrows():
            owner_name = row['Owner']
            equipment_owner = EquipmentOwner.query.filter(EquipmentOwner.name == owner_name).first()
            equipment = Equipment(
                name = row['Equipment_name'],
                type = row['Equipment_type'],
                make = row['Make'],
                model = row['Model'],
                owner_name = equipment_owner.name,
                phone = equipment_owner.phone,
                email = equipment_owner.email,
                location = row['Location'],
                availability = row['Availability'],
                delivery = row['Delivery'],
                quantity = row['Quantity'],
                owner_id = equipment_owner.id
            )

            # print(equipment_owner.name)
            equipment_list.append(equipment) # this works, just appending to list

        print("Commiting all the equipment to your database...")
        db.session.add_all(equipment_list)

        print("Matching Equipment to Appropriate Owner...")
        # owner = EquipmentOwner.query.filter(EquipmentOwner.name == owner_name).first()
        # owner.equipment.append(equipment)
        
        db.session.commit()

    # name = db.Column(db.String)
    # type = db.Column(db.String)
    # make = db.Column(db.String)
    # model = db.Column(db.String)
    # availability = db.Column(db.Boolean)
    # delivery = db.Column(db.Boolean)
    # quantity = db.Column(db.Integer)
