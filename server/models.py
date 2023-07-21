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
    phone = db.Column(db.String)
    email = db.Column(db.String)

    #STUFF BELOW IS DONE
    #might need to add email to identify user
    #Also a phone number to reach them?
    # and reviews

    #relationships 
    #do a cascade to make life easier
    agreements = db.relationship('RentalAgreement', back_populates="renter", overlaps="renters,owners")

    #Serialization rules
    serialize_rules = ('-agreements.renter', )

    #VALIDATES HERE
    @validates("email")
    def validates_email(self, key, email):
        if len(email) > 0 and "@"  in email:
            return email
        else:
            raise ValueError("Please check that you entered your email correctly")
    
    @validates("name")
    def validates_name(self, key, name):
        if len(name) > 0:
            return name
        else:
            raise ValueError("Please input a name")

    @validates("age")
    def validates_age(self, key, age):
        if age >= 18:
            return age
        else:
            raise ValueError("Sorry, but you must be 18 years or older to sign up.")
    


class EquipmentOwner(db.Model, SerializerMixin):
    __tablename__ = "owners"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    location = db.Column(db.String)
    profession = db.Column(db.String)
    phone = db.Column(db.String)
    email = db.Column(db.String)

    #STUFF BELOW IS DONE
    #may need to include a profession, i.e Heavy Machinery, Painting
    #Also may need to include contact information, this could be a string? Maybe email + phone #
    #reviews also?
    
    #relationships
    # agreements = db.relationship('RentalAgreement', back_populates="owner", overlaps="renters,owners")

    #do a cascade to make life easier
    equipment = db.relationship('Equipment', back_populates='owner', overlaps="owners,equipments")

    agreements = db.relationship('RentalAgreement', back_populates ='owner', overlaps="owners,agreements")
    #overlaps="owners,equipments" #This is a way to access the equipment that an owner has, 
    
    #you can just do a query EquipmentOwner.query.get(1), or equipment = owner.equipment. Then you can do for equipment in owner.equipment print(equipment) for example

    #Serialization rules
    serialize_rules = ('-equipment.owner', '-agreements.owner' )

    #VALIDATIONS HERE
    @validates("email")
    def validates_email(self, key, email):
        if len(email) > 0 and "@"  in email:
            return email
        else:
            raise ValueError("Please check that you entered your email correctly")
        
    @validates("name")
    def validates_name(self, key, name):
        if len(name) > 0:
            return name
        else:
            raise ValueError("Please input a name")

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
    phone = db.Column(db.String) #this and the one below are recently added.
    email = db.Column(db.String)
    location = db.Column(db.String)
    availability = db.Column(db.String)
    delivery = db.Column(db.String)
    quantity = db.Column(db.Integer)

    #relationship
    #do a cascade to make life easier

    owner_id = db.Column(db.Integer, db.ForeignKey('owners.id'))

    owner = db.relationship("EquipmentOwner", back_populates="equipment", overlaps="owners,equipments" )

    agreements = db.relationship('RentalAgreement', back_populates="equipment", overlaps="renters,equipments")

    #Serialization rules
    serialize_rules = ('-owner.equipment', '-agreements.equipment' )

    #VALIDATIONS BEGIN HERE
    @validates("email")
    def validates_email(self, key, email):
        if len(email) > 0 and "@"  in email:
            return email
        else:
            raise ValueError("Please check that you entered your email correctly")
        
    @validates("quantity")
    def validates_quanity(self, key, quantity):
        if quantity > 0:
            return quantity
        else:
            raise ValueError("You cannot list nothing, please enter a quantity greater than 0.")



class RentalAgreement(db.Model, SerializerMixin):
    __tablename__ = "agreements"

    id = db.Column(db.Integer, primary_key=True)
    location = db.Column(db.String)
    total_price = db.Column(db.Integer) # Maybe find a way to find the daily cost / hourly cost?
    rental_dates = db.Column(db.String) #maybe integer?
    #need a way to grab the equipment

    #relationships
    #do a cascade to make life easier
    owner_id = db.Column(db.Integer, db.ForeignKey('owners.id'))
    renter_id = db.Column(db.Integer, db.ForeignKey('renters.id'))
    equipment_id = db.Column(db.Integer, db.ForeignKey('equipments.id'))

    #this hopefully connects it
    renter = db.relationship(
        "UserRenter", back_populates="agreements", overlaps="renters,owners"
    )
    equipment = db.relationship(
        "Equipment", back_populates="agreements", overlaps="renters,equipment")
    
    owner = db.relationship(
        "EquipmentOwner", back_populates="agreements", overlaps="renters,agreements"
    )
    
    #Serialization rules
    serialize_rules = ('-renter.agreements', '-owner.equipment', '-owner.agreements', '-equipment.owner', '-equipment.agreements')

    def __repr__(self):
        return f"<Rental Agreement: Equipment in {self.location}, Total Price: {self.total_price}, Rental Dates: {self.rental_dates}>"