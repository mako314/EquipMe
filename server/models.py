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
    
    profileImage = db.Column(db.String)
    # bannerImg = db.Column(db.String)
    # I don't think I'll be requiring / asking for banner images IMO

    #Bio ? Don't think needed tbh.

    #Would I need a document attribute here? To hold a users document such as insurance and such

    #relationships 
    #do a cascade to make life easier
    agreements = db.relationship('RentalAgreement', back_populates="user")

    user_inboxes = db.relationship("UserInbox", back_populates="user")

    cart = db.relationship('Cart', back_populates='user')

    #Serialization rules
    serialize_rules = ('-agreements.user', '-user_inboxes.user', '-cart.user')


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
    firstName = db.Column(db.String)
    lastName = db.Column(db.String)
    age = db.Column(db.Integer)
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

    owner_inboxes = db.relationship('OwnerInbox', back_populates='owner')
    #you can just do a query EquipmentOwner.query.get(1), or equipment = owner.equipment. Then you can do for equipment in owner.equipment print(equipment) for example

    #Serialization rules
    serialize_rules = ('-equipment.owner', '-agreements.owner', '-owner_inboxes.owner','-owner_inboxes.user' )

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
    def validates_name(self, key, firstName):
        if len(firstName) > 0:
            return firstName
        else:
            raise ValueError("Please input a first name")

    def __repr__(self):
        return f"My name is {self.firstName}"



class Equipment(db.Model, SerializerMixin):
    __tablename__= "equipments"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    type = db.Column(db.String)
    make = db.Column(db.String)
    model = db.Column(db.String)
    #THIS WILL BE TEMPORARY UNTIL I HAVE CLOUD HOSTING SET UP
    equipment_image = db.Column(db.String)
    location = db.Column(db.String)
    #base_of_operations = db.Column(db.String)
    availability = db.Column(db.String)
    delivery = db.Column(db.String)
    quantity = db.Column(db.Integer)

    #Should add things like a deposit required, short description, condition to rent vehicle i.e. license required? Y/N? What else could be included needs to be brainstormed

    #relationship
    #do a cascade to make life easier
    owner_id = db.Column(db.Integer, db.ForeignKey('owners.id'))

    owner = db.relationship("EquipmentOwner", back_populates="equipment")

    # agreements = db.relationship('RentalAgreement', back_populates="equipment")

    cart_item = db.relationship('CartItem', back_populates='equipment')

    equipment_price = db.relationship('EquipmentPrice', back_populates='equipment', cascade="all, delete")

    images = db.relationship('EquipmentImage', back_populates='equipment')

    #Serialization rules
    serialize_rules = ('-owner.equipment',  '-owner.agreements', '-images.equipment', '-cart_item.equipment','-equipment_price.equipment' )
    
    # '-agreements.equipment', # REMOVED DUE TO AGREEMENTS BEING TO CART ITEMS
    
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

class EquipmentPrice(db.Model, SerializerMixin):
    __tablename__= "equipment_prices"
    id = db.Column(db.Integer, primary_key = True)

    hourly_rate = db.Column(db.Integer, nullable= True)
    daily_rate = db.Column(db.Integer, nullable= True)
    weekly_rate = db.Column(db.Integer, nullable= True)
    promo_rate = db.Column(db.Integer, nullable= True) # I need to incorporate maybe multiple promo rates

    equipment_id = db.Column(db.Integer, db.ForeignKey('equipments.id'))
    equipment = db.Relationship('Equipment', back_populates ='equipment_price')

    serialize_rules = ('-equipment.equipment_price',)

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
    
#----------------------------------------------------------------
    rental_start_date = db.Column(db.String) 

    rental_end_date = db.Column(db.String)

    # delivery = db.Column(db.String)
    # delivery_address = db.Column(db.String, nullable= True)
    # user_comments = db.Column(db.String)

    # owner_decision = db.Column(db.String)
    # owner_comments = db.Column(db.String)

    
    # revisions = db.Column(db.Integer, default=0)

    # proof_of_ownership = db.Column(db.String)
    # owner_insurance = db.Column(db.String)
    # user_insurance_proof = db.Column(db.String)

    # agreement_stats = db.Column(db.String) 
    # Ex. in progress, user-accepted, owner-accepted, both-accepted

    # rental_length = db.Column()


    # legal_doc = db.Column(db.String) # need a way to upload documentation 
    #need a way to grab the equipment

#----------------------------------------------------------------

    #relationships
    #do a cascade to make life easier 
    # this is how everything gets linked up
    # So I likely still need to do the rental agreement form

    # equipment_id = db.Column(db.Integer, db.ForeignKey('equipments.id'))
    owner_id = db.Column(db.Integer, db.ForeignKey('owners.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    cart_item_id = db.Column(db.Integer, db.ForeignKey('cart_items.id'))
    

#----------------------------------------------------------------
    
    # Include a created at date, updated at.
    created_at = db.Column(
    db.DateTime, nullable=False,
    default=datetime.utcnow,
    )

    updated_at = db.Column(
    db.DateTime, nullable=False,
    default=datetime.utcnow,
    onupdate=datetime.utcnow
    )
#----------------------------------------------------------------

    #this hopefully connects it
    user = db.relationship(
        "User", back_populates="agreements"
    )
    # equipment = db.relationship(
    #     "Equipment", back_populates="agreements")
    
    owner = db.relationship(
        "EquipmentOwner", back_populates="agreements"
    )
    items = db.relationship(
        'CartItem', back_populates='agreements', cascade="all, delete")
    
    
    #Serialization rules
    serialize_rules = ('-user.agreements', '-owner.equipment', '-owner.agreements', '-items.agreements')
    # '-equipment.owner', '-equipment.agreements',

    def __repr__(self):
        return f"<Rental Agreement: Equipment in {self.location}, Total Price: {self.total_price}, Rental Dates: {self.rental_dates}>"
    
#-------------------------Cart System---------------
class Cart(db.Model, SerializerMixin):
    __tablename__ = "carts"
    id = db.Column(db.Integer, primary_key=True)
    total = db.Column(db.Integer)
    cart_name = db.Column(db.String, nullable=True)
    cart_status = db.Column(db.String)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=True, default=datetime.utcnow, onupdate=datetime.utcnow)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    
    #We'll try this cascade delete first : https://docs.sqlalchemy.org/en/20/orm/cascades.html#cascade-delete-orphan
    items = db.relationship('CartItem', back_populates='cart', cascade="all, delete")
    user = db.relationship ('User', back_populates='cart')

    serialize_rules = ('-items.cart','-items.cart_id','-items.equipment.agreements','-items.equipment.owner.owner_inboxes','-user.cart','-user.user_inboxes','-user.agreements')

    def calculate_total(self):
        #Calculate the total price of all items in the cart
        self.total = sum(item.total_cost for item in self.items)
        db.session.add(self)  # Assuming you want to make the changes in the current session
        db.session.commit()   # Save the changes to the database
        return self.total


class CartItem(db.Model, SerializerMixin):
    __tablename__ = "cart_items"
    id = db.Column(db.Integer, primary_key= True)

    price_cents_at_addition = db.Column(db.Integer)
    price_cents_if_changed = db.Column(db.Integer, nullable = True)
    quantity = db.Column(db.Integer, default=1)
    rental_rate = db.Column(db.String)
    rental_length = db.Column(db.Integer, default=1)

    created_at = db.Column(
    db.DateTime, nullable=False,
    default=datetime.utcnow,
    )

    updated_at = db.Column(
    db.DateTime, nullable=False,
    default=datetime.utcnow,
    onupdate=datetime.utcnow
    )
    
    #Maybe length of rental here,
    cart_id = db.Column(db.Integer, db.ForeignKey('carts.id'))
    equipment_id = db.Column(db.Integer, db.ForeignKey('equipments.id'))

    cart = db.relationship('Cart', back_populates='items')
    equipment = db.relationship('Equipment', back_populates='cart_item')
    agreements = db.relationship('RentalAgreement', back_populates="items")

    serialize_rules = ('-cart.items','-cart.user','-equipment.agreements','-equipment.cart_item','-equipment.owner.owner_inboxes', '-agreements.items', '-agreements.user', '-agreements.owner')

    # _total = db.Column('total', db.Integer)
    #Need validations to test for positive integers,
    # @property
    # def total(self):
    #     return self._total
    # @total.setter
    # def total(self, price_cents_at_addition, price_cents_if_changed):
    #     if price_cents_at_addition and isinstance(price_cents_at_addition, int) and price_cents_at_addition > 0:
    #         self.total = (price_cents_at_addition * self.rental_length) * self.quantity
    #     elif price_cents_if_changed and isinstance(price_cents_if_changed, int) and price_cents_if_changed > 0:
    #         self.total = (price_cents_at_addition * self.rental_length) * self.quantity
    #     else:
    #         raise Exception

    @property
    def total_cost(self):
        price = self.price_cents_if_changed if self.price_cents_if_changed else self.price_cents_at_addition
        if isinstance(price, int) and price > 0:
            return (price * self.rental_length) * self.quantity
        else:
        # Handle the case where price is not an int.
            raise ValueError("The price must be an integer.")
        

    # Need to consider taxes, negative values, need validations here ASAP

#-------------------------Message System---------------

class Message(db.Model, SerializerMixin):
    __tablename__ = "messages"

    id = db.Column(db.Integer, primary_key=True)
    recipient_id = db.Column(db.Integer)
    sender_id = db.Column(db.Integer)

    context_id = db.Column(db.Integer, nullable = True)
    user_type = db.Column(db.String)

    # subject = db.Column(db.String, nullable = True)
    content = db.Column(db.String)
    message_status = db.Column(db.String, nullable = True)

    created_at = db.Column(
    db.DateTime, nullable=False,
    default=datetime.utcnow,
    )

    thread_id = db.Column(db.Integer, db.ForeignKey('threads.id'))
    thread = db.relationship('Thread', back_populates='messages')


    serialize_rules = ('-thread',)

    # I also have to consider attaching an equipment ID. Maybe equipment quotes can be a table also?


class Thread(db.Model, SerializerMixin):
    __tablename__ = "threads"

    id = db.Column(db.Integer, primary_key=True)
    subject = db.Column(db.String, nullable=True)
    #Need to incorporate something like user_delete & owner_delete

    messages = db.relationship('Message', back_populates='thread')
    user_inboxes = db.relationship("UserInbox", back_populates="thread")
    owner_inboxes = db.relationship("OwnerInbox", back_populates="thread")

    serialize_rules = ('-user_inboxes.thread', '-owner_inboxes.thread', '-messages.thread')

class UserInbox(db.Model, SerializerMixin):
    __tablename__ = "user_inboxes"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    thread_id = db.Column(db.Integer, db.ForeignKey('threads.id'))

    user = db.relationship("User", back_populates="user_inboxes")
    thread = db.relationship("Thread", back_populates="user_inboxes")

    serialize_rules = ('-user.user_inboxes', '-thread.user_inboxes', '-thread.owner_inboxes')

class OwnerInbox(db.Model, SerializerMixin):
    __tablename__ = "owner_inboxes"

    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(db.Integer, db.ForeignKey('owners.id'))
    thread_id = db.Column(db.Integer, db.ForeignKey('threads.id'))

    owner = db.relationship("EquipmentOwner", back_populates="owner_inboxes")
    thread = db.relationship("Thread", back_populates="owner_inboxes")

    serialize_rules = ('-owner.owner_inboxes', '-thread.owner_inboxes', '-thread.user_inboxes')


# class Inbox(db.Model, SerializerMixin):
#     __tablename__ = "inboxes"

#     id = db.Column(db.Integer, primary_key=True)
#     user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
#     owner_id = db.Column(db.Integer, db.ForeignKey('owners.id'))
#     message_id = db.Column(db.Integer, db.ForeignKey('messages.id'))
    

#     user = db.relationship(
#         "User", back_populates="inboxes", foreign_keys=[user_id])
    
#     owner = db.relationship(
#         "EquipmentOwner", back_populates="inboxes", foreign_keys=[owner_id])
    
#     serialize_rules = ('-user.inboxes', '-owner.inboxes')
