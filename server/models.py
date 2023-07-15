from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from sqlalchemy.orm import validates
from sqlalchemy_serializer import SerializerMixin

metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})

db = SQLAlchemy()

class UserRenter(db.Model, SerializerMixin):
    __tablename__ = "renters"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    age = db.Column(db.Integer)
    location = db.Column(db.String)
    profession = db.Column(db.String)

    #relationships
    agreements = db.relationship('RentalAgreement', back_populates="renter", overlaps="renters,owners")

    #Serialization rules
    serialize_rules = ('-agreements.renter', )

class EquipmentOwner(db.Model, SerializerMixin):
    __tablename__ = "owners"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    location = db.Column(db.String)

    #relationships
    agreements = db.relationship('RentalAgreement', back_populates="owner", overlaps="renters,owners")

    equipment = db.relationship('Equipment', back_populates='owner', overlaps="owners,equipments") 
    #overlaps="owners,equipments" #This is a way to access the equipment that an owner has, 
    
    #you can just do a query EquipmentOwner.query.get(1), or equipment = owner.equipment. Then you can do for equipment in owner.equipment print(equipment) for example

    #equipment_inventory = db.Column(db.Integer, db.ForeignKey('equipments.id'))
    #foreign key is for the child

    #Serialization rules
    serialize_rules = ('-agreements.owner', '-equipment.owner' )

    def __repr__(self):
        return f"My name is {self.name}"


class Equipment(db.Model, SerializerMixin):
    __tablename__= "equipments"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    type = db.Column(db.String)
    make = db.Column(db.String)
    model = db.Column(db.String)
    owner_name = db.Column(db.String)
    location = db.Column(db.String)
    availability = db.Column(db.Boolean)
    delivery = db.Column(db.Boolean)
    quantity = db.Column(db.Integer)

    #relationship
    owner_id = db.Column(db.Integer, db.ForeignKey('owners.id'))

    owner = db.relationship("EquipmentOwner", back_populates="equipment", overlaps="owners,equipments" )

    #Serialization rules
    serialize_rules = ('-owner.equipment', )


class RentalAgreement(db.Model, SerializerMixin):
    __tablename__ = "agreements"

    id = db.Column(db.Integer, primary_key=True)
    location = db.Column(db.String)
    total_price = db.Column(db.Integer) # Maybe find a way to find the daily cost / hourly cost?
    rental_dates = db.Column(db.String) #maybe integer?
    #need a way to grab the equipment

    #relationships
    renter_id = db.Column(db.Integer, db.ForeignKey('renters.id'))
    owner_id = db.Column(db.Integer, db.ForeignKey('owners.id'))

    #this hopefully connects it
    renter = db.relationship(
        "UserRenter", back_populates="agreements", overlaps="renters,owners"
    )
    owner = db.relationship(
        "EquipmentOwner", back_populates="agreements", overlaps="renters,owners")
    
    #Serialization rules
    serialize_rules = ('-owner.agreements', '-renter.agreements' )

    def __repr__(self):
        return f"<Rental Agreement: Equipment in {self.location}, Total Price: {self.total_price}, Rental Dates: {self.rental_dates}>"