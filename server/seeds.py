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
            profession="Construction Equipment Operator" 
        ),
        UserRenter(
            name="Ethan Martinez", #Rents Heavy Machinery from David Rodriguez (5)
            age=39,
            location="Miami, Florida",
            profession="Heavy Machine Operator" 
        ),
        UserRenter(
            name="William Anderson", #Rents Cleaning Equipment from Daniel Lee (7)
            age=32,
            location="Houston, Texas",
            profession="Industrial Cleaning Specialist"
        ),
        UserRenter(
            name="Sofia Rodriguez", # Rents Party Equipment from Emily Johnson (2)
            age=29,
            location="Phoenix, Arizona",
            profession="Party and Event Equipment Organizer"
        ),
        UserRenter(
            name="Christian Domingues", #Rents Painting Equipment from Mark Davis (1)
            age=42,
            location="Chicago, Illinois",
            profession="Painting Contractor" 
        ),
        UserRenter(
            name="Sarah Thompson", #Rents Gardening Equipment from Henry Cavill (4)
            age=30,
            location="Seattle, Washington",
            profession="Landscape Designer"
        ),
        UserRenter(
            name="Thomas Brady", #Rents Automotive Equipment from Andrew Jacons (3)
            age=25,
            location="Houston, Texas",
            profession="Automotive Mechanic"
        ),]

        db.session.add_all(renters)
#----------------------------------------------------------------
# Seed Equipment Owners
        print("Seeding equipment owners...")
        equipment_owners = [
        EquipmentOwner(
            name="Mark Davis", # Painting Equipment
            location="Chicago, Illinois"
        ),
        EquipmentOwner(
            name="Emily Johnson", # Party Equipment
            location="Phoenix, Arizona"
        ),
        EquipmentOwner(
            name="Andrew Jacobs", #Automotive Equipment
            location="Houston, Texas"
        ),
        EquipmentOwner(
            name="Henry Cavill", #Garden Equipment
            location="Seattle, Washington"
        ),
        EquipmentOwner(
            name="David Rodriguez", #Heavy Machinery
            location="Miami, Florida"
        ),
        EquipmentOwner(
            name="Amy Wilson", #Construction Equipment
            location="Chicago, Illinois"
        ),
        EquipmentOwner(
            name="Daniel Lee", # Cleaning Equipment
            location="Houston, Texas"
        ),
        EquipmentOwner(
            name="Jessica Sanchez", # Plumbing Equipment
            location="New York City, New York"
        ),
        EquipmentOwner(
            name="Ryan Phillips", #Power-tool and hand-tool Equipment
            location="Orlando, Florida"
        ),
        EquipmentOwner(
            name="Michelle Adams", #Woodwork
            location="New Orleans, Louisiana"
        )]
        db.session.add_all(equipment_owners)
#---------------------------------------------------------
#rental agreements 
        print("Configuring our current rental agreements...")
        rental_agreements = [
        RentalAgreement(
            location="Chicago, Illinois",
            total_price=150,
            rental_dates="2023-07-15 to 2023-07-18",
            renter_id=1,  # Benjamin Davis
            owner_id=6  # Amy Wilson
        ),
        RentalAgreement(
            location="Miami, Florida",
            total_price=200,
            rental_dates="2023-07-19 to 2023-07-23",
            renter_id=2,  # Ethan Martinez
            owner_id=5  # David Rodriguez
        ),
        RentalAgreement(
            location="Houston, Texas",
            total_price=100,
            rental_dates="2023-07-17 to 2023-07-20",
            renter_id=3,  # William Anderson
            owner_id=7  # Daniel Lee
        ),
        RentalAgreement(
            location="Phoenix, Arizona",
            total_price=80,
            rental_dates="2023-07-16 to 2023-07-19",
            renter_id=4,  # Sofia Rodriguez
            owner_id=2  # Emily Johnson
        ),
        RentalAgreement(
            location="Seattle, Washington",
            total_price=180,
            rental_dates="2023-07-18 to 2023-07-21",
            renter_id=6,  # Sarah Thompson
            owner_id=4  # Henry Cavill
        ),
        RentalAgreement(
            location="Houston, Texas",
            total_price=120,
            rental_dates="2023-07-22 to 2023-07-24",
            renter_id=7,  # Thomas Brady
            owner_id=3  # Andrew Jacobs
        ),
        RentalAgreement(
            location="Chicago, Illinois",
            total_price=80,
            rental_dates="2023-07-23 to 2023-07-24",
            renter_id=5,  # Christian Domingues
            owner_id=1  # Mark Davis
        ),
        RentalAgreement(
            location="Phoenix, Arizona",
            total_price=120,
            rental_dates="2023-07-22 to 2023-07-23",
            renter_id=4,  # Sofia Rodriguez
            owner_id=2  # Emily Johnson
        ),
        RentalAgreement(
            location="Dallas, Texas",
            total_price=150,
            rental_dates="2023-07-19 to 2023-07-22",
            renter_id=3,  # William Anderson
            owner_id=7  # Daniel Lee
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
        print("Uploading the current equipment list...")
        data = pd.read_csv('/home/mako77/code/Flatiron/Projects/EquipMe/extrafiles/Copy_of_equipment_data_but_with_owners-equipment_data.csv')

        data.columns = ['Equipment_name', 'Equipment_type', 'Make', 'Model', 'Owner', 'Location', 'Availability', 'Delivery', 'Quantity']
        equipment_list = []

        for index, row in data.iterrows():
            owner_name = row['Owner']
            equipment_owner = EquipmentOwner.query.filter(EquipmentOwner.name == owner_name).first()
            # owner_listing_name = equipment_owner.name
            equipment = Equipment(
                name = row['Equipment_name'],
                type = row['Equipment_type'],
                make = row['Make'],
                model = row['Model'],
                owner_name = equipment_owner.name,
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
