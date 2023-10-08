from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from sqlalchemy.orm import validates
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.hybrid import hybrid_property
from config import db, bcrypt

from datetime import datetime


#---------------HELPER IMPORTS----------------



class User(db.Model, SerializerMixin):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)

    firstName = db.Column(db.String)
    lastName = db.Column(db.String)
    age = db.Column(db.Integer)
    email = db.Column(db.String)
    _password_hash = db.Column(db.String, nullable=False)
    phone = db.Column(db.String)

    age = db.Column(db.Integer)
    location = db.Column(db.String)
    profession = db.Column(db.String)
    
    profileImg = db.Column(db.String)
    # bannerImg = db.Column(db.String)
    # I don't think I'll be requiring / asking for banner images IMO



    #Position and or profession? 
    #Bio ? Don't think needed tbh.

    #Would I need a document attribute here? To hold a users document such as insurance and such?


    #STUFF BELOW IS DONE
    #might need to add email to identify user
    #Also a phone number to reach them?
    # and reviews

    #relationships 
    #do a cascade to make life easier
    agreements = db.relationship('RentalAgreement', back_populates="user")

    inboxes = db.relationship(
        "Inbox", back_populates="user")

    #Serialization rules
    serialize_rules = ('-agreements.user', '-inboxes.user')


    #PROPERTIES
    @hybrid_property
    def password_hash(self):
        return self._password_hash

    @password_hash.setter
    def password_hash(self, password):
        # utf-8 encoding and decoding is required in python 3
        password_hash = bcrypt.generate_password_hash(
            password.encode('utf-8'))
        self._password_hash = password_hash.decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(
            self._password_hash, password.encode('utf-8'))

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
        age = int(age)
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
    _password_hash = db.Column(db.String, nullable=False)
    profileImage = db.Column(db.String)
    website = db.Column(db.String)
    
    #relationships
    # agreements = db.relationship('RentalAgreement', back_populates="owner", overlaps="users,owners")

    #do a cascade to make life easier
    equipment = db.relationship('Equipment', back_populates='owner')

    agreements = db.relationship('RentalAgreement', back_populates ='owner')

    inboxes = db.relationship('Inbox', back_populates='owner')
    #you can just do a query EquipmentOwner.query.get(1), or equipment = owner.equipment. Then you can do for equipment in owner.equipment print(equipment) for example

    #Serialization rules
    serialize_rules = ('-equipment.owner', '-agreements.owner', '-inbox.owner','-inbox.user' )

    #PROPERTIES
    @hybrid_property
    def password_hash(self):
        return self._password_hash

    @password_hash.setter
    def password_hash(self, password):
        # utf-8 encoding and decoding is required in python 3
        password_hash = bcrypt.generate_password_hash(
            password.encode('utf-8'))
        self._password_hash = password_hash.decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(
            self._password_hash, password.encode('utf-8'))

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

#----------------------------------------------------------------
    #Removed due to incorporating a relationship
    # owner_name = db.Column(db.String)
    # phone = db.Column(db.String) #this and the one below are recently added.
    # email = db.Column(db.String) #This is already included via the owner relationship.
#----------------------------------------------------------------
    location = db.Column(db.String)
    availability = db.Column(db.String)
    delivery = db.Column(db.String)
    quantity = db.Column(db.Integer)


    #Going to have to change my seeds file, to incorporate some of this, I may just do 6 pieces of equipment to start.


    # I need to think about how to do the rates better. I know I'd like to use an hourly rate, a daily, weekly, monthly, maybe even one for a year. I'd likely calculate it with a property so I need to think about how i'd write it and the flow.
    
    # cost_per_day = db.Column(db.Integer)
    # cost_per_week = db.Column(db.Integer)
    # cost_per_month = db.Column(db.Integer)

    #Should add things like a deposit required, short description, condition to rent vehicle i.e. license required? Y/N? What else could be included needs to be brainstormed


    #relationship
    #do a cascade to make life easier

    #Do I need owner ID? I likely do, I also need to do cascades still for a cleaner delete

    owner_id = db.Column(db.Integer, db.ForeignKey('owners.id'))

    owner = db.relationship("EquipmentOwner", back_populates="equipment")

    agreements = db.relationship('RentalAgreement', back_populates="equipment")

    images = db.relationship('EquipmentImage', back_populates='equipment')

    #Serialization rules
    serialize_rules = ('-owner.equipment', '-agreements.equipment', '-owner.agreements', '-images.equipment')

    #VALIDATIONS BEGIN HERE
    # @validates("email")
    # def validates_email(self, key, email):
    #     if len(email) > 0 and "@"  in email:
    #         return email
    #     else:
    #         raise ValueError("Please check that you entered your email correctly")
        
    @validates("quantity")
    def validates_quanity(self, key, quantity):
        quantity = int(quantity)
        if quantity > 0:
            return quantity
        else:
            raise ValueError("You cannot list nothing, please enter a quantity greater than 0.")

class EquipmentImage(db.Model, SerializerMixin):
    __tablename__= "equipment_images"

    id = db.Column(db.Integer, primary_key = True)
    imageURL = db.Column(db.String)
    equipment_id = db.Column(db.Integer, db.ForeignKey('equipments.id'))
    
    #relationship

    equipment = db.relationship('Equipment', back_populates='images')

    #Serialization rules
    serialize_rules = ('-equipment.images', )




class RentalAgreement(db.Model, SerializerMixin):
    __tablename__ = "agreements"

    id = db.Column(db.Integer, primary_key=True)
    location = db.Column(db.String)
    total_price = db.Column(db.Integer) # Maybe find a way to find the daily cost / hourly cost?
    
#----------------------------------------------------------------
    rental_dates = db.Column(db.String) #maybe integer? will need to do this in routing

    # legal_doc = db.Column(db.String) # need a way to upload documentation 
    #need a way to grab the equipment

#----------------------------------------------------------------

    #relationships
    #do a cascade to make life easier 
    # this is how everything gets linked up
    # So I likely still need to do the rental agreement form
    owner_id = db.Column(db.Integer, db.ForeignKey('owners.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    equipment_id = db.Column(db.Integer, db.ForeignKey('equipments.id'))

#----------------------------------------------------------------
    
    # Include a created at date, updated at.
    created_on = db.Column(
    db.DateTime, nullable=False,
    default=datetime.utcnow,
    )

    modified_on = db.Column(
    db.DateTime, nullable=False,
    default=datetime.utcnow,
    onupdate=datetime.utcnow
    )
#----------------------------------------------------------------

    #this hopefully connects it
    user = db.relationship(
        "User", back_populates="agreements"
    )
    equipment = db.relationship(
        "Equipment", back_populates="agreements")
    
    owner = db.relationship(
        "EquipmentOwner", back_populates="agreements"
    )
    
    #Serialization rules
    serialize_rules = ('-user.agreements', '-owner.equipment', '-owner.agreements', '-equipment.owner', '-equipment.agreements')

    def __repr__(self):
        return f"<Rental Agreement: Equipment in {self.location}, Total Price: {self.total_price}, Rental Dates: {self.rental_dates}>"
    


#-------------------------Message System---------------

class Message(db.Model, SerializerMixin):
    __tablename__ = "messages"

    id = db.Column(db.Integer, primary_key=True)
    recepient_id = db.Column(db.Integer)
    sender_id = db.Column(db.Integer)
    # context_id = db.Column(db.Integer)

    content = db.Column(db.String)
    message_status = db.Column(db.String, nullable = True)

    created_on = db.Column(
    db.DateTime, nullable=False,
    default=datetime.utcnow,
    )

    # I also have to consider attaching an equipment ID. Maybe equipment quotes can be a table also?



class Inbox(db.Model, SerializerMixin):
    __tablename__ = "inboxes"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    owner_id = db.Column(db.Integer, db.ForeignKey('owners.id'))
    message_id = db.Column(db.Integer, db.ForeignKey('messages.id'))
    

    user = db.relationship(
        "User", back_populates="inboxes", foreign_keys=[user_id])
    
    owner = db.relationship(
        "EquipmentOwner", back_populates="inboxes", foreign_keys=[owner_id])
    
    serialize_rules = ('-user.inboxes', '-owner.inboxes')




