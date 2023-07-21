from random import choice as rc, randrange

from app import app
from models import db, UserRenter, EquipmentOwner, Equipment, RentalAgreement

from random import randint, choice as rc
import pandas as pd

if __name__ == '__main__':
    with app.app_context():
        #Clear dbs
        print("Clearing db...")
        RentalAgreement.query.delete()
        Equipment.query.delete()
        EquipmentOwner.query.delete()
        UserRenter.query.delete()

#----------------------------------------------------------------------
#Seed Renters
        print("Seeding potential renters...")
        renters = [
        UserRenter(
            name="Benjamin Davis", #Rents construction equipment from Amy Wilson (6)
            age=42,
            location="Chicago, Illinois",
            profession="Construction Equipment Operator",
            phone="312-555-1122",
            email="benjamin.davis23@gmail.com"
        ),
        UserRenter(
            name="Ethan Martinez", #Rents Heavy Machinery from David Rodriguez (5)
            age=39,
            location="Miami, Florida",
            profession="Heavy Machine Operator",
            phone="305-555-2233",
            email="ethan.martinez77@yahoo.com" 
        ),
        UserRenter(
            name="William Anderson", #Rents Cleaning Equipment from Daniel Lee (7)
            age=32,
            location="Houston, Texas",
            profession="Industrial Cleaning Specialist",
            phone="713-555-3344",
            email="william.anderson89@gmail.com"
        ),
        UserRenter(
            name="Sofia Rodriguez", # Rents Party Equipment from Emily Johnson (2)
            age=29,
            location="Phoenix, Arizona",
            profession="Party and Event Equipment Organizer",
            phone="602-555-4455",
            email="sofia.rodriguez12@hotmail.com"
        ),
        UserRenter(
            name="Christian Domingues", #Rents Painting Equipment from Mark Davis (1)
            age=42,
            location="Chicago, Illinois",
            profession="Painting Contractor",
            phone="312-555-5566",
            email="christian.domingues55@yahoo.com" 
        ),
        UserRenter(
            name="Sarah Thompson", #Rents Gardening Equipment from Henry Cavill (4)
            age=30,
            location="Seattle, Washington",
            profession="Landscape Designer",
            phone="206-555-6677",
            email="sarah.thompson99@gmail.com"
        ),
        UserRenter(
            name="Thomas Brady", #Rents Automotive Equipment from Andrew Jacons (3)
            age=25,
            location="Houston, Texas",
            profession="Automotive Mechanic",
            phone="713-555-7788",
            email="thomas.brady21@yahoo.com"
        ),]


        db.session.add_all(renters)
#----------------------------------------------------------------
# Seed Equipment Owners
        print("Seeding equipment owners...")
        equipment_owners = [
        EquipmentOwner(
            name="Mark Davis", # Painting Equipment
            location="Chicago, Illinois",
            profession="Plumbing",
            phone="312-555-6789",
            email="markdavis82@yahoo.com"
        ),
        EquipmentOwner(
            name="Emily Johnson", # Party Equipment
            location="Phoenix, Arizona",
            profession="Party",
            phone="602-555-7891",
            email="ejohnson@live.com"
        ),
        EquipmentOwner(
            name="Andrew Jacobs", #Automotive Equipment
            location="Houston, Texas",
            profession="Automotive",
            phone="713-555-0123",
            email="andrewjacobs93@gmail.com"
        ),
        EquipmentOwner(
            name="Henry Cavill", #Garden Equipment
            location="Seattle, Washington",
            profession="Garden",
            phone="206-555-3456",
            email="hcavill34@hotmail.com"
        ),
        EquipmentOwner(
            name="David Rodriguez", #Heavy Machinery
            location="Miami, Florida",
            profession="Heavy Machinery",
            phone="305-555-1234",
            email="davidr83@gmail.com"
        ),
        EquipmentOwner(
            name="Amy Wilson", #Construction Equipment
            location="Chicago, Illinois",
            profession="Construction",
            phone="312-555-5678",
            email="amywilson22@yahoo.com"
        ),
        EquipmentOwner(
            name="Daniel Lee", # Cleaning Equipment
            location="Houston, Texas",
            profession="Cleaning",
            phone="713-555-4567",
            email="daniel.lee78@yahoo.com"
        ),
        EquipmentOwner(
            name="Jessica Sanchez", # Plumbing Equipment
            location="New York City, New York",
            profession="Plumbing",
            phone ="212-555-2345",
            email="jess.sanchez22@gmail.com"
        ),
        EquipmentOwner(
            name="Ryan Phillips", #Power-tool and hand-tool Equipment
            location="Orlando, Florida",
            profession="Power tools and Hand tools",
            phone="407-555-9012",
            email="ryan.phillips87@gmail.com"
        ),
        EquipmentOwner(
            name="Michelle Adams", #Woodwork
            location="New Orleans, Louisiana",
            profession="Woodworking",
            phone="504-555-7890",
            email="madams90@gmail.com"
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
            renter_id=1,  # Benjamin Davis
            equipment_id=38  # Amy Wilson #Available
        ),
        RentalAgreement(
            location="Miami, Florida",
            total_price=200,
            rental_dates="2023-07-19 to 2023-07-23",
            renter_id=2,  # Ethan Martinez
            equipment_id=8  # David Rodriguez #Available
        ),
        RentalAgreement(
            location="Houston, Texas",
            total_price=100,
            rental_dates="2023-07-17 to 2023-07-20",
            renter_id=3,  # William Anderson
            equipment_id=317  # Daniel Lee #Available
        ),
        RentalAgreement(
            location="Phoenix, Arizona",
            total_price=80,
            rental_dates="2023-07-16 to 2023-07-19",
            renter_id=4,  # Sofia Rodriguez
            equipment_id=361  # Emily Johnson #Available
        ),
        RentalAgreement(
            location="Seattle, Washington",
            total_price=180,
            rental_dates="2023-07-18 to 2023-07-21",
            renter_id=6,  # Sarah Thompson
            equipment_id=121  # Henry Cavill #Available
        ),
        RentalAgreement(
            location="Houston, Texas",
            total_price=120,
            rental_dates="2023-07-22 to 2023-07-24",
            renter_id=7,  # Thomas Brady
            equipment_id=311  # Andrew Jacobs #Available
        ),
        RentalAgreement(
            location="Chicago, Illinois",
            total_price=80,
            rental_dates="2023-07-23 to 2023-07-24",
            renter_id=5,  # Christian Domingues
            equipment_id=238  # Mark Davis #Available
        ),
        RentalAgreement(
            location="Phoenix, Arizona",
            total_price=120,
            rental_dates="2023-07-22 to 2023-07-23",
            renter_id=4,  # Sofia Rodriguez
            equipment_id=355  # Emily Johnson #Available
        ),
        RentalAgreement(
            location="Dallas, Texas",
            total_price=150,
            rental_dates="2023-07-19 to 2023-07-22",
            renter_id=3,  # William Anderson
            equipment_id=318  # Daniel Lee #Available
        )]

        db.session.add_all(rental_agreements)

        #     RentalAgreement(
        #     location="Orlando, Florida",
        #     total_price=300,
        #     rental_dates="2023-07-20 to 2023-07-25",
        #     renter_id=2,  # Ethan Martinez
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
            # phone = row['Phone']
            # email = row['Email'] # We don't really need this, it would be required if we had a relationship
            equipment_owner = EquipmentOwner.query.filter(EquipmentOwner.name == owner_name).first()
            # owner_phone = EquipmentOwner.query.filter(EquipmentOwner.phone == phone).first()
            # owner_email = EquipmentOwner.query.filter(EquipmentOwner.email == email).first()

            #this stuff above also unnecessary sorry for poor english, but likely can remove soon
            
            # owner_listing_name = equipment_owner.name
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
