from models import db, User, EquipmentOwner, Equipment, EquipmentImage, RentalAgreement, Message, Thread,UserInbox, OwnerInbox, Cart, CartItem, EquipmentPrice, Review, UserFavorite, OwnerFavorite, AgreementComment, FeaturedEquipment, EquipmentStateHistory, EquipmentStatus, EquipmentStateSummary
# from flask_cors import CORS
# from flask_migrate import Migrate
# from flask import Flask, request, make_response, jsonify
# from flask_restful import Api, Resource
# import os

from flask import Flask, request, make_response, jsonify, session
from flask_restful import Resource
from config import db, app, api
from sqlalchemy import asc, desc
from sqlalchemy.exc import IntegrityError
import pandas as pd
import xml.etree.ElementTree as ET

from flask_jwt_extended import create_access_token, set_access_cookies, jwt_required, get_jwt_identity, unset_jwt_cookies, create_refresh_token, get_jwt
import stripe
import os
#------------------------------------HELPERS----------------------------------
from datetime import datetime, timezone, timedelta
# from helpers import is_available_for_date_range
from dotenv import load_dotenv

# Have to tell the dotenv what to load specifically
load_dotenv('../.env.local')
stripe.api_key=os.getenv('STRIPE_TEST_SECRET_KEY')
#------------------------------------ BOTH USER LOGIN-----------------------------------------------------------------------------

class Login(Resource):
    def post(self):
        data = request.get_json()
        email = data['email']
        password = data['password']

        # Check user table
        user = User.query.filter(User.email == email).first()
        if user and user.authenticate(password):
            access_token = create_access_token(identity={'id': user.id, 'role': 'user'}) # https://flask-jwt-extended.readthedocs.io/en/stable/api.html#flask_jwt_extended.create_access_token It's made JSON serializable with 'This can be accessed later with []' : other_value
            user_data = user.to_dict(rules=('-_password_hash',))
            # I can also make user_type = 'user' and return that for one single login page on the front end.
            response = make_response(jsonify({"msg": "User login successful", "user": user_data, "role" : "user"}), 200) #This wouldn't work unless I did make_response, which I find strange since make_response is supposed to just jsonify? 
            set_access_cookies(response, access_token) #https://flask-jwt-extended.readthedocs.io/en/stable/api.html#flask_jwt_extended.set_access_cookies Sets the cookie
            return response

        # Check owner table
        owner = EquipmentOwner.query.filter(EquipmentOwner.email == email).first()
        if owner and owner.authenticate(password):
            access_token = create_access_token(identity={'id': owner.id, 'role': 'owner'})
            owner_data = owner.to_dict(rules=('-_password_hash',))
            # I can also make user_type = 'owner'
            response = make_response(jsonify({"msg": "Owner login successful", "owner": owner_data, "role": "owner"}), 200)
            set_access_cookies(response, access_token)
            return response

        # Neither
        return jsonify(error='Invalid credentials'), 401

api.add_resource(Login, '/login')
#------------------------------------------------------------------------------------------------------------------------------

#------------------------------------OWNER LOGIN------------------------------------------------------------------------------

class OwnerLogin(Resource):

    def get(self):
        pass

    def post(self):
        data = request.get_json()
        email = data['email']
        print(email)
        owner = EquipmentOwner.query.filter(EquipmentOwner.email == email).first()
        password = data['password']
        if owner and owner.authenticate(password):
            access_token = create_access_token(identity=owner.id)
            response = jsonify({"msg": "login successful"}, 200)
            set_access_cookies(response, access_token)
            return response
        else:
            return {'error': 'Invalid credentials'}, 401

api.add_resource(OwnerLogin, '/owner/login')
#------------------------------------------------------------------------------------------------------------------------------

#------------------------------------USER LOGOUT------------------------------------------------------------------------------

class Logout(Resource):

    def delete(self): 
        session.clear()
        response = make_response({'message': 'Logout successful'}, 200)
        unset_jwt_cookies(response) # https://flask-jwt-extended.readthedocs.io/en/stable/api.html#flask_jwt_extended.unset_jwt_cookies
        # response.delete_cookie('access_token')
        return response

api.add_resource(Logout, '/logout')
#------------------------------------------------------------------------------------------------------------------------------
# https://flask-jwt-extended.readthedocs.io/en/stable/refreshing_tokens.html

# def refresh_jwt_if_needed(response):
#     try:
#         exp_timestamp = get_jwt()["exp"]
#         now = datetime.now(timezone.utc)
#         target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
#         if target_timestamp > exp_timestamp:
#             access_token = create_access_token(identity=get_jwt_identity())
#             set_access_cookies(response, access_token)
#     except (RuntimeError, KeyError):
#         # Case where there is not a valid JWT. Just return the original response
#         pass
#     return response

@app.after_request
def refresh_expiring_jwts(response):
    try:
        exp_timestamp = get_jwt()["exp"]
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
        if target_timestamp > exp_timestamp:
            access_token = create_access_token(identity=get_jwt_identity())
            set_access_cookies(response, access_token)
        return response
    except (RuntimeError, KeyError):
        # Case where there is not a valid JWT. Just return the original response
        return response

#------------------------------------------------------------------------------------------------------------------------------
class CheckSession(Resource):
    @jwt_required()
    def get(self):
        identity = get_jwt_identity() #https://flask-jwt-extended.readthedocs.io/en/stable/api.html#flask_jwt_extended.get_jwt_identity
                                      # I use this to grab the access token identity information.
        # print(identity)
        identity_id = identity['id']  # Extract the ID from the identity object by grabbing the ['id']
        identity_role = identity['role']       # Extract the role from the identity object by grabbing the ['role']
        # print("THE IDENTITY ID",identity_id)
        if identity_role == 'user':
            user = User.query.get(identity_id)
            # print(user)
            if user:
                # session_response = {'role': identity_role, 'details': user.to_dict(rules=('-password_hash',))}, 200
                # response = refresh_jwt_if_needed(session_response)
                # return response
                return {'role': identity_role, 'details': user.to_dict(rules=('-password_hash',))}, 200
            else:
                return {'message': 'User not found'}, 404
        elif identity_role == 'owner':
            owner = EquipmentOwner.query.get(identity_id)
            # print(owner)
            if owner:
                # session_response = {'role': identity_role, 'details': owner.to_dict(rules=('-password_hash',))}, 200
                # response = refresh_jwt_if_needed(session_response)
                # return response
                return {'role': identity_role, 'details': owner.to_dict(rules=('-password_hash',))}, 200
            else:
                return {'message': 'Owner not found'}, 404

        return {'message': 'Invalid session or role'}, 401

api.add_resource(CheckSession, '/check_session')



#------------------------------------------------------------------------------------------------------------------------------


#-------------------------------------------------ROUTING FOR THE APP, NO LOG IN STUFF, NO LOG OUT, NO SESSION CHECK BEYOND HERE.---------------------------------------------------



#------------------------------------------------------USER RENTER CLASSES----------------------------------------------------------

class Users(Resource):
    
    #post to users, DONE, unsure if i want to be able to see all users..
    def get(self):
        users = [user.to_dict(rules =('-_password_hash',)) for user in User.query.all()]

        response = make_response(users, 200)

        return response

    def post(self):
        data = request.get_json()
        try:
            birth_date_str = data['date_of_birth']
            birth_date = datetime.strptime(birth_date_str, '%Y-%m-%d').date()
            #need a way to attach to rental agreement
            new_user = User(
                firstName = data['firstName'],
                lastName = data['lastName'],
                # age = data['age'],
                date_of_birth = birth_date,
                email = data['email'],
                _password_hash = data['password'],
                phone = data['phone'],
                country = data['country'],
                state = data['state'],
                city = data['city'],
                address = data['address'],
                address_line_2 = data['address_line_2'],
                postal_code = data['postal_code'],
                profession = data['profession'],
                profileImage = data['profileImg'],
                # bannerImg = data['bannerImg'],    
            )

            db.session.add(new_user)

            new_user.password_hash = new_user._password_hash

            db.session.commit()

            response = make_response(new_user.to_dict(), 201)
            return response
        except ValueError:
            return make_response({"error": ["validations errors, check your input and try again"]} , 400)

        #except ValueError: 
        # NEED TO WRITE VALIDATIONS
api.add_resource(Users, '/users')


class UserByID(Resource):

    #get one user by ID, may not even be necessary
    def get(self, id):
        user = User.query.filter(User.id == id).first()

        if user:
            return make_response(user.to_dict(),200)
        else:
            response = make_response({
            "error": "User not found"
            }, 404)
            return response
        
    #PATCH USER DONE
    def patch(self, id):
        user = User.query.filter(User.id == id).first()
        if user:
            try:
                data = request.get_json()
                for key in data:
                    if key == 'password':
                        user.password_hash = data['password']
                    if key == 'date_of_birth':
                        birth_date_str = data['date_of_birth']
                        birth_date = datetime.strptime(birth_date_str, '%Y-%m-%d').date()
                        user.date_of_birth = birth_date
                    else:
                        setattr(user, key, data[key])
                        # user.password_hash = user._password_hash
                db.session.commit()

                response = make_response(user.to_dict(), 202)
                return response
            except ValueError:
                return make_response({"error": ["validations errors, check your input and try again"]} , 400)

        else:
            response = make_response({
            "error": "User not found"
            }, 404)
            return response
        
    #DELETE USER -- OPERATIONAL, WOULD LIKE TO RETURN A MESSAGE
    def delete(self,id):
        user = User.query.filter(User.id == id).first()
        if user:
            # user.agreements do I need to cycle through and delete the agreement relationship also?
            db.session.delete(user)
            db.session.commit()
            response = make_response({"message":"Succesfully deleted!"}, 204)
            return response
        else:
            response = make_response({
            "error": "User not found"
            }, 404)
            return response
api.add_resource(UserByID, '/user/<int:id>')

# MAY WANT TO INCLUDE MORE, BUT GOING TO TRY AND SPEED UP NETWORK BY DOING AN ONLY instead of RUles
class UserByProfession(Resource):
    def get(self, ownerProfession):
        users = [user.to_dict(only =('id','email', 'firstName', 'lastName', 'address', 'country', 'postal_code', 'state', 'address_line_2', 'city', 'phone', 'profileImage')) for user in User.query.filter(User.profession == ownerProfession).all()]
        if users:
            response = make_response(users, 200)
        else:
            response = make_response({
            "error": "Users not found"
            }, 404)

        return response
api.add_resource(UserByProfession, '/users/<string:ownerProfession>')
#-----------------------------------------------------------EQUIPMENT Owners Classes--------------------------------------------------------------

#Display all Owners of Equipment who list their stuff to rent, users should be able to click the Owner and get taken to their page with all their equipment
class EquipmentOwners(Resource):

    #succesful get to display
    def get(self):
        equip_owners = [owner.to_dict(only = ('id', 'profession', 'email', 'address', 'country', 'postal_code', 'state', 'address_line_2', 'city', 'firstName', 'lastName', 'phone','equipment', 'profileImage')) for owner in EquipmentOwner.query.all()]
        #had to allow ID also to grab it with link
        response = make_response(equip_owners, 200)
        #rules =('-agreements', 'equipment')

        return response
    
    #POST EQUIPMENT OWNERS -- DONE
    def post(self):
        data = request.get_json()
        try:
            birth_date_str = data['date_of_birth']
            birth_date = datetime.strptime(birth_date_str, '%Y-%m-%d').date()
            birth_day = birth_date.day
            birth_month = birth_date.month
            birth_year = birth_date.year

            new_owner = EquipmentOwner(
                firstName = data['firstName'],
                lastName = data['lastName'],
                country = data['country'],
                state = data['state'],
                city = data['city'],
                address = data['address'],
                address_line_2 = data['address_line_2'],
                postal_code = data['postal_code'],
                # age = data['age'],
                date_of_birth = birth_date,
                profession = data['profession'],
                phone = data['phone'],
                email = data['email'],
                _password_hash = data['password'],
                profileImage = data['profileImage'],
                website = data['website']
            )
            db.session.add(new_owner)

            new_owner.password_hash = new_owner._password_hash

            db.session.commit()
            
            account_link = None  # Initialize account_link to None

            if data['owner_consent'] == 'yes':
                account = stripe.Account.create(
                    type='express',
                    country=new_owner.country,
                    email=new_owner.email,
                    business_type='individual',
                    company = {
                        'address' : {
                            'city': new_owner.city,
                            'country': new_owner.country,
                            'line1': new_owner.address,
                            'line2': new_owner.address_line_2,
                            'postal_code': new_owner.postal_code,
                            'state': new_owner.state,
                        },
                        'name' : 'Marks Rentals',
                        'phone' : new_owner.phone,
                        'tax_id' : '000000000',
                    },
                    individual={
                        'address': {
                            'city': new_owner.city,
                            'country': new_owner.country,
                            'line1': new_owner.address,
                            'line2': new_owner.address_line_2,
                            'postal_code': new_owner.postal_code,
                            'state': new_owner.state,
                        },
                        'dob' : {
                            'day': birth_day,
                            'month': birth_month,
                            'year': birth_year,
                        },
                        'email' : new_owner.email,
                        'first_name' : new_owner.firstName,
                        'last_name' : new_owner.lastName,
                        'phone' : new_owner.phone,
                        'id_number': '000000000',
                        # 'id_number_provided' : True,
                    },
                    business_profile = {
                        'url' : 'https://accessible.stripe.com',
                        'support_phone' : new_owner.phone,
                        'support_email' : new_owner.email,
                        'name' : f"{new_owner.firstName} {new_owner.lastName}",
                        'support_address' : {
                            'city': new_owner.city,
                            'country': new_owner.country,
                            'line1': new_owner.address,
                            'line2': new_owner.address_line_2,
                            'postal_code': new_owner.postal_code,
                            'state': new_owner.state,
                        },
                    },
                    capabilities={
                        'card_payments': {'requested': True},
                        'transfers': {'requested': True},
                    },
                )
                 
                new_owner.stripe_id = account.id
                db.session.commit()
            
            if data['owner_consent'] == 'yes' and data['create_link']:
                account_link = stripe.AccountLink.create(
                account=account.id,
                refresh_url='http://localhost:3000/dashboard',
                return_url='http://localhost:3000/dashboard',
                type='account_onboarding',
            )
            # https://stripe.com/docs/api/account_links/create
                if account_link:
                    print(account_link.url)
                

            # response = make_response(new_owner.to_dict(), 201)
            if account_link:
                return jsonify({
                    'owner': new_owner,
                    'stripe_onboard_link': account_link.url
                }), 200
            else:
                return make_response(new_owner.to_dict(), 201)

            # return response

        except ValueError:
            return make_response({"error": ["validations errors, check your input and try again"]} , 400)
        # NEED TO WRITE VALIDATIONS

api.add_resource(EquipmentOwners, '/equipment_owners')
#Display all Equipment, whether available or not, this route should display all the equipment available on the website.
#this can either be ID or name,

#Get a specific owner of an equipment.
class EquipmentOwnerById(Resource):

    #succesfully GET OWNER by ID
    def get(self, id):
        equip_owner = EquipmentOwner.query.filter(EquipmentOwner.id == id).first()

        if equip_owner:
            return make_response(equip_owner.to_dict(),200)
        else:
            response = make_response({
            "error": "Owner not found"
            }, 404)
            return response
        
    #PATCH OWNER by ID -- DONE
    def patch(self, id):
        equip_owner = EquipmentOwner.query.filter(EquipmentOwner.id == id).first()
        if equip_owner:
            try:
                data = request.get_json()
                for key in data:
                    if key == 'password':
                        equip_owner.password_hash = data['password']
                    if key == 'date_of_birth':
                        birth_date_str = data['date_of_birth']
                        birth_date = datetime.strptime(birth_date_str, '%Y-%m-%d').date()
                        equip_owner.date_of_birth = birth_date
                    else:
                        setattr(equip_owner, key, data[key])
                # user.password_hash = user._password_hash
                # db.session.add(equip_owner)
                db.session.commit()

                response = make_response(equip_owner.to_dict(), 202)
                return response
            except ValueError:
                return make_response({"error": ["validations errors, check your input and try again"]} , 400)
        else:
            response = make_response({
            "error": "Owner not found"
            }, 404)
            return response
        
    #DELETE OWNER by ID -- DONE
    def delete(self, id):
        equip_owner = EquipmentOwner.query.filter(EquipmentOwner.id == id).first()
        print(equip_owner.id)
        if equip_owner:
            # owner.agreements and owner.equipment do I need to cycle through and delete the agreement relationship also?
            db.session.delete(equip_owner)
            db.session.commit()
            response = make_response({"message":"Succesfully deleted!"}, 204)
            return response
        else:
            response = make_response({
            "error": "Owner not found"
            }, 404)
            return response


api.add_resource(EquipmentOwnerById, '/equipment_owner/<int:id>')


class OwnerByProfession(Resource):
    def get(self, userProfession):
        owners = [owner.to_dict(rules =('-_password_hash',)) for owner in EquipmentOwner.query.filter(EquipmentOwner.profession == userProfession).all()]
        if owners:
            response = make_response(owners, 200)
        else:
            response = make_response({
            "error": "Owners not found"
            }, 404)

        return response
api.add_resource(OwnerByProfession, '/owners/<string:userProfession>')


#-----------------------------------------------------EQUIPMENT Classes------------------------------------------------------------------

class Equipments(Resource):

    #get ALL equipment -- DONE
    def get(self):
        equipment = [equipment.to_dict(
            only =('id','model','name','make', 'type','address', 'country', 'postal_code', 'state', 'address_line_2', 'city', 'availability','delivery', 'owner', 'equipment_price', 'equipment_image', 'featured_equipment','cart_item' ) #needed to include all of this for when one patches
        ) for equipment in Equipment.query.all()]                                       # no longer need phone, email, and owner_name

        response = make_response(equipment, 200)

        return response
    
    #POST EQUIPMENT, DONE
    #NEED TO UPDATE FOR VALIDATIONS
    def post(self):
        data = request.get_json()
        try:
        #need a way to input, owner_id and owner maybe a 2 step process?
            new_equipment = Equipment(
                name = data['name'],
                type = data['type'],
                make = data['make'],
                model = data['model'],
                equipment_image = data['equipment_image'],
                description = data['description'],
                country = data['country'],
                state = data['state'],
                city = data['city'],
                address = data['address'],
                address_line_2 = data['address_line_2'],
                postal_code = data['postal_code'],
                availability = data['availability'],
                delivery = data['delivery'],
                owner_id= data['owner_id']
            )

            db.session.add(new_equipment)
            db.session.commit()
            # https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt
            print(data['totalQuantity'])
            print(type(data['totalQuantity']))
            total_quantity = int(data['totalQuantity'])
            available_quantity = int(data['availableQuantity'])

            if available_quantity > total_quantity:
                state_total = available_quantity
            else:
                state_total = total_quantity

            new_equipment_status = EquipmentStatus(
                equipment_id = new_equipment.id,
                total_quantity = state_total,
                available_quantity = available_quantity,
                reserved_quantity = 0,
                rented_quantity = 0,
                maintenance_quantity = 0,
                transit_quantity = 0
            )
            
            new_state_history = EquipmentStateHistory(
                equipment_id = new_equipment.id,  # Lawnmower
                total_quantity = state_total,
                available_quantity = available_quantity,
                reserved_quantity = 0,
                rented_quantity = 0,
                maintenance_quantity = 0,
                transit_quantity = 0,
                damaged_quantity = 0,
                previous_state = 'non-existing',
                new_state = 'available',
                changed_at = datetime.utcnow(),
            )

            db.session.add(new_equipment_status)
            db.session.add(new_state_history)
            db.session.commit()

            # response = make_response(new_equipment.to_dict(), 201)
            # Since i am also returning state_history, my data object in the front end for ProductForm I needed to make an equipment const. Basically doing const equipment = data.equipment
            response_data = {
                "equipment": new_equipment.to_dict(),
                "state_history": new_state_history.to_dict()  # Assuming to_dict() method is defined for state history
            }

            response = make_response(response_data, 201)
            return response
        
            #if data['availability] == 'yes'
            #availability = True
        
        except ValueError:
            return make_response({"error": ["validations errors, check your input and try again"]} , 400)
        # NEED TO WRITE VALIDATIONS

api.add_resource(Equipments, '/equipment')

#-------------------------------
#Search and or filter by Equipment type, i.e. Heavy Machinery or painting
#I can't quite use this either atm, it'd need to be changed to handle cities maybe? so I may have to break up the data from location to actual address, city ,state
class EquipmentByLocation(Resource):
    # For now we will handle similar cities, if not postal codes?
    def get(self,postal_code):
        location_test = Equipment.query.filter(Equipment.postal_code == postal_code).all()
        if location_test:
            equipment = [equipment.to_dict(rules =('-agreements', '-owner.agreements')) for equipment in Equipment.query.filter(Equipment.postal_code == postal_code).all()]
            response = make_response(equipment, 200)
            return response
        else:
            response = make_response({
            "error": "No equipment in your location"
            }, 404)
            return response
        
        #need to find a way to make all the locations easily inputtable, for example Heavy Machinery doesn't get picked up if you do /heavymachinery

api.add_resource(EquipmentByLocation, '/equipment/location/<string:postal_code>')

#likely going to need to edit types, have like a generalized list of some sort. 
# class EquipmentByProfession(Resource):
#     def get(self, profession):
#         equipments = [equipment.to_dict() for equipment in Equipment.query.filter(equipment.type == profession).all()]
#         if equipments:
#             response = make_response(equipments, 200)
#         else:
#             response = make_response({
#             "error": "Equipments not found"
#             }, 404)

#         return response
# api.add_resource(EquipmentByProfession, '/equipment/<string:profession>')

class EquipmentByID(Resource):

    #Get a single piece of equipment -- done
    def get(self, id):
        equipment = Equipment.query.filter(Equipment.id == id).first()
        #need a way to input, owner_id and owner maybe a 2 step process?
        #may be able to do rules to remove agreements, likely not needed information, or is it?
        if equipment:
            return make_response(equipment.to_dict(),200)
        else:
            response = make_response({
            "error": "Equipment not found"
            }, 404)
            return response
        
    #Patch equipment DONE
    def patch(self, id):
        equipment = Equipment.query.filter(Equipment.id == id).first()

        print('THE ID:', id)
        equipment_status = EquipmentStatus.query.filter(EquipmentStatus.equipment_id == id).first()
        previous_quantity = (equipment_status.total_quantity)
        previous_reserved_quantity = (equipment_status.reserved_quantity)
        previous_available_quantity = (equipment_status.available_quantity)

        print('PREVIOUS QUANTITY:', previous_quantity)
        print('THE EQUIPMENT STATUS:', equipment_status)
        print('PATCH RAN')

        previous_state_history = EquipmentStateHistory.query.filter_by(
        equipment_id=id).order_by(EquipmentStateHistory.changed_at.desc()).first()
        if equipment:
            try:
                #going to need try and except if and when we do validations
                data = request.get_json()

                for key in data:
                    setattr(equipment, key, data[key])

                # print('Current Equipments TOTAL quantity:',equipment_status.total_quantity )
                # print('Current Equipments AVAILABLE quantity:',equipment_status.available_quantity )

                updated_available_quantity = int(data['availableQuantity'])
                current_total_quantity = int(data['totalQuantity'])

                if current_total_quantity < previous_reserved_quantity:
                    print('THE CURRENT TOTAL LESS THAN PREVIOUS RESERVED')
                    return make_response({"error": "Total quantity cannot be less than reserved quantity"}, 400)

                #Going to write in an if where if you are trying to have 5 available for example, and have a total quantity of 3, it'll just update it to 5 total.
                if updated_available_quantity > current_total_quantity:
                    state_total = updated_available_quantity
                else:
                    state_total = current_total_quantity


                if 'totalQuantity' in data and data['totalQuantity'] is not None:
                    equipment_status.total_quantity = current_total_quantity
                if 'availableQuantity' in data and data['availableQuantity'] is not None:
                    equipment_status.available_quantity = updated_available_quantity

                if 'availableQuantity' in data and updated_available_quantity > current_total_quantity:
                    equipment_status.total_quantity = updated_available_quantity


                # db.session.add(equipment)
                db.session.commit()

                # print('Current Equipments TOTAL quantity:',equipment_status.total_quantity )
                # print('Current Equipments AVAILABLE quantity:',equipment_status.available_quantity )
                # print('updated QUANTITY:',updated_quantity)
                # print(type(updated_quantity))
                # print('quantity' in data and updated_quantity != previous_quantity)
                # print('quantity' in data)
                # print(updated_quantity != previous_quantity)

                # Can not use equipment.quantity, because it gets updated with the patch and the number was the same.

                print('TRUTH TEST:', updated_available_quantity != previous_quantity)

                if 'availableQuantity' in data and updated_available_quantity != previous_quantity:
                    # Add state history before committing the changes to the equipment
                    if current_total_quantity > previous_quantity:
                        updated_new_state = 'added'
                    else:
                        updated_new_state = 'removed'

                    if updated_available_quantity > previous_available_quantity:
                        updated_new_state = 'added'
                    else:
                        updated_new_state = 'removed'
                    
                    previous_state = 'no_availability' if updated_available_quantity == 0 else 'available'

                    print('YOU ARE IN THE PLACE TO POST NEW STATE_HISTORY')
                    #Going to write in an if where if you are trying to have 5 available for example, and have a total quantity of 3, it'll just update it to 5 total.
                    #Need to impelement what was implemented above also in here.
                    new_state_history = EquipmentStateHistory(
                    equipment_id = id,
                    total_quantity = state_total,
                    available_quantity = updated_available_quantity,
                    reserved_quantity = previous_state_history.reserved_quantity,
                    rented_quantity = previous_state_history.rented_quantity,
                    maintenance_quantity = 0,
                    transit_quantity = 0,
                    damaged_quantity = 0,
                    previous_state = previous_state,
                    new_state = updated_new_state,
                    changed_at = datetime.utcnow(),
                )

                    print(new_state_history)

                    db.session.add(new_state_history)
                    db.session.commit()

                response = make_response(equipment.to_dict(), 202)
                return response
            
            except ValueError:
                return make_response({"error": ["validations errors, check your input and try again"]} , 400)
            except Exception as e:
                print(f"An unexpected error occurred: {str(e)}")
                return make_response({"error": f"An unexpected error occurred: {str(e)}"}, 500)
        else:
            response = make_response({
            "error": "Equipment not found"
            }, 404)
            return response
        
    #DELETE EQUIPMENT - DONE -- WOULD LIKE TO RETURN A MESSAGE
    def delete(self, id):
        equipment = Equipment.query.filter(Equipment.id == id).first()
        if equipment:
            #Do I only need to delete the foreign key? Or the thing with a relationship also?
            owners = [Equipment.query.filter(Equipment.owner_id == id).all()]
            for owner in owners:
                db.session.delete(owner)
            #This should take care of excess stuff, need to inquire about deleting 
            db.session.delete(equipment)

            db.session.commit()
            response = make_response({"message":"Succesfully deleted!"}, 204)
            return response
        else:
            response = make_response({
            "error": "Equipment not found"
            }, 404)
            return response
        
api.add_resource(EquipmentByID, '/equipment/<int:id>')

#GET ALL EQUIPMENT BY THEIR OWNER ID, THIS IS USED IN OUR RENTAL AGREEMENT FORM
class AllEquipmentByOwnerID(Resource):
    def get(self,id):
        equipment = [equipment.to_dict(
            only =('id','model','name','make', 'type','phone','email','address', 'country', 'postal_code', 'state', 'address_line_2', 'city','availability','delivery','quantity', 'owner_name') #needed to include all of this for when one patches
        ) for equipment in Equipment.query.filter(Equipment.owner_id == id).all()]

        response = make_response(equipment, 200)

        return response

api.add_resource(AllEquipmentByOwnerID, '/all_equipment/<int:id>')

#-----------------------------------------------------EQUIPMENT PRICING Classes------------------------------------------------------------------

class SetEquipmentPrice(Resource):
    def post(self):
        data = request.get_json()
        try:
            submitted_hourly_rate = float((data.get('hourly_rate')) * 100)
            submitted_daily_rate = float((data.get('daily_rate')) * 100)
            submitted_weekly_rate = float((data.get('weekly_rate')) * 100)
            submitted_promo_rate = float((data.get('promo_rate')) * 100)
            submitted_equipment_id = data.get('equipment_id')
            print("Submitted ID:",submitted_equipment_id)
        #need a way to input, owner_id and owner maybe a 2 step process?
            equipment_price = EquipmentPrice(
                hourly_rate = submitted_hourly_rate,
                daily_rate = submitted_daily_rate,
                weekly_rate = submitted_weekly_rate,
                promo_rate = submitted_promo_rate,
                equipment_id = submitted_equipment_id,
            )
            db.session.add(equipment_price)
            db.session.commit()

            response = make_response(equipment_price.to_dict(), 201)
            return response
        
            #if data['availability] == 'yes'
            #availability = True
        
        except ValueError:
            return make_response({"error": ["validations errors, check your input and try again"]} , 400)
        # NEED TO WRITE VALIDATIONS

api.add_resource(SetEquipmentPrice, '/equipment/price')

class HandleEquipmentPricing(Resource):
    def patch(self, id):
        data = request.get_json()

        print(data)
        equipment_pricing = EquipmentPrice.query.filter_by(equipment_id=id).first()

        if not data:
            return make_response({"error": "No data provided"}, 400)
        
        # if data:
        #     submitted_hourly_rate = data.get('hourly_rate')
        #     submitted_daily_rate = data.get('daily_rate')
        #     submitted_weekly_rate = data.get('weekly_rate')
        #     submitted_promo_rate = data.get('promo_rate')

        # So, originally I had the rates above and in data and is not none, but this way seemed to work better. I could probably set the above variables equal to data[variable] but it'd be more lines. This ended up working to patch the price.

        # Guess I could track prices too

        if equipment_pricing:
            try:
                if 'hourly_rate' in data and data['hourly_rate'] is not None:
                    equipment_pricing.hourly_rate = float(data['hourly_rate']) * 100
                if 'daily_rate' in data and data['daily_rate'] is not None:
                    equipment_pricing.daily_rate = float(data['daily_rate']) * 100
                if 'weekly_rate' in data and data['weekly_rate'] is not None:
                    equipment_pricing.weekly_rate = float(data['weekly_rate']) * 100
                if 'promo_rate' in data and data['promo_rate'] is not None:
                    equipment_pricing.promo_rate = float(data['promo_rate']) * 100

                db.session.commit()

                response = make_response(equipment_pricing.to_dict(), 202)
                return response
            except ValueError:
                return make_response({"error": ["validations errors, check your input and try again"]} , 400)
        else:
            response = make_response({
            "error": "Equipment not found,"
            }, 404)
            return response
        
api.add_resource(HandleEquipmentPricing, '/equipment/<int:id>/price')

#-----------------------------------------------------EQUIPMENT FEATURE Classes------------------------------------------------------------------

class SetFeaturedEquipment(Resource):
    def post(self, equipment_id):
        existing_feature = FeaturedEquipment.query.filter_by(equipment_id=equipment_id).first()
        if existing_feature:
            raise ValueError("You have already featured this equipment")

        data = request.get_json()
        # print(data)
        try:
        #need a way to input, owner_id and owner maybe a 2 step process?
            feature_equipment = FeaturedEquipment(
                equipment_id = data.get('equipment_id'),
            )
            # data['promo_rate']
            # data.get('equipment_id')
            db.session.add(feature_equipment)
            db.session.commit()

            response = make_response(feature_equipment.to_dict(), 201)
            return response
        
        except ValueError:
            return make_response({"error": ["validations errors, check your input and try again"]} , 400)

api.add_resource(SetFeaturedEquipment, '/feature/equipment/<int:equipment_id>')

class HandleFeaturedEquipment(Resource):
    def delete(self, id):
        featured_equipment = FeaturedEquipment.query.filter(FeaturedEquipment.equipment_id==id).first()

        print("The featurd equipment",featured_equipment)

        if featured_equipment:
            try:
                #going to need try and except if and when we do validations
                db.session.delete(featured_equipment)
                db.session.commit()
                response = make_response({"message":"Succesfully deleted!"}, 204)
                return response
            except ValueError:
                return make_response({"error": ["validations errors, check your input and try again"]} , 400)
        else:
            response = make_response({
            "error": "Equipment not found,"
            }, 404)
            return response
        
api.add_resource(HandleFeaturedEquipment, '/feature/equipment/<int:id>')
#-----------------------------------------------------EQUIPMENT IMAGE Classes------------------------------------------------------------------

class EquipmentImages(Resource):
    #Get ALL Equipment IMAGES
    def get(self):
        equipment_images = [equipment_image.to_dict() for equipment_image in EquipmentImage.query.all()]

        response = make_response(equipment_images, 200)

        return response
    #Post an Equipment IMAGE
    def post(self):
        data = request.get_json()
        #try VALIDATIONS:

        new_equipment_image = EquipmentImage(
            imageURL = data['imageURL'],
            equipment_id = data['equipment_id']
        )

        db.session.add(new_equipment_image)

        db.session.commit()

        response = make_response(new_equipment_image.to_dict(), 201)

        return response

        #except ValueError ()

api.add_resource(EquipmentImages, '/equipment/images')

#-----------------------------------------------------EQUIPMENT IMAGE  BY ID Classes------------------------------------------------------------------

class EquipmentImagesByID(Resource):
    #Get ONE Equipment IMAGE
    def get(self, id):
        equipment_image = EquipmentImage.query.filter(EquipmentImage.id == id).first()

        if equipment_image:
            return make_response(equipment_image.to_dict(), 200)
        else:
            response = make_response({
            "error": "Equipment image not found"
            }, 404)
            return response
        
    def patch(self, id):
        equipment_image = EquipmentImage.query.filter(EquipmentImage.id == id).first()
        if equipment_image:
            #try VALIDATIONS:
            data = request.get_json()
            for key in data:
                setattr(equipment_image, key, data[key])
                # db.session.add(equipment_image)
                db.session.commit()
                response = make_response(equipment_image.to_dict(), 202)
                return response
            #except ValueError:
        else:
            response = make_response({
            "error": "Equipment image not found"
            }, 404)
            return response

api.add_resource(EquipmentImagesByID, '/equipment/image/<int:id>')

#-----------------------------------------------Rental Agreement Classes-----------------------------------------------------------------------------
#Rental agreements, need a post and a patch
# WHEN DISPLAYING THESE TIMES IN THE FRONT END YOU WILL NEED TO CONVERT IT THERE, MUCH EASIER TO HOLD UTC HERE
#  Take the below example (implement for patch also)
#  let currentDate = new Date()
#  let tzTime = currentDate.getTimezoneOffset() * 60000
#  let localDate = new Date(currentDate - tzTime).toISOString()

class RentalAgreements(Resource):
    #Get ALL rental agreements
    #list of all the renters and the equipment
    def get(self):
        agreements = [agreement.to_dict() for agreement in RentalAgreement.query.all()]

        response = make_response(agreements, 200)

        return response
    
    #post a rental agreement
    # This post is different from the rest, as for some of the validations I'm using
    # I used get because I was having issue with data['name'] especially when it came time to get the rental dates, cart_item id, etc,
    def post(self):
        data = request.get_json()

        #try:
        equipment_id = data.get('equipment_id')
        start_date = data.get('rental_start_date')
        end_date = data.get('rental_end_date')
        cart_item_id = data.get('cart_item_id')
        cart_id = data.get('cart_id')

        print("Received start date:", start_date)
        print("Received end date:", end_date)
        print(f"Cart ID: {cart_id}, Type: {type(cart_id)}")


        cart = Cart.query.filter(Cart.id == cart_id).first()
        # If neither cart or equipment are found, return 404
        if not cart:
            return make_response({'error': 'Cart not found'}, 404)
        
        cart_item_received = CartItem.query.filter(CartItem.id == cart_item_id).first()
        if not cart_item_received or cart_item_received.cart_id != cart_id:
            return make_response({'error': 'Cart item not found in the cart'}, 404)
        
        equipment = Equipment.query.filter(Equipment.id == equipment_id).first()
        if not equipment:
            return make_response({"error": "Equipment not found"}, 404)
        
        # previous_state_history = EquipmentStateHistory.query.filter_by(
        # equipment_id=cart_item_received.equipment_id
        # ).order_by(EquipmentStateHistory.changed_at.desc()).first()

        # equipment_status = EquipmentStatus.query.filter(EquipmentStatus.equipment_id == equipment_id).first()

        # print("AMOUNT AVAILABLE:",equipment_status.available_quantity)
        # print("CART ITEMS ASKED:",cart_item_received)

        #This block likely just going to the 
        # if equipment_status.available_quantity >= cart_item_received.quantity:
        #     equipment_status.available_quantity -= cart_item_received.quantity
        #     equipment_status.reserved_quantity += cart_item_received.quantity
        #     db.session.commit()  # Commit the changes for both new_item and updated equipment quantity
        #     # response = make_response(response_data, 201)
        #     # return response
        # else:
        #     # If not enough equipment quantity, handle error 
        #     return make_response({'error': 'Not enough equipment available'}, 400)

        #may need a way to write in validations
        new_rental_agreement = RentalAgreement(
            rental_start_date = start_date,
            rental_end_date = end_date,
            delivery = data.get('delivery', False),
            delivery_address = data.get('delivery_address', False),
            user_decision = 'created',
            owner_decision = 'pending',
            revisions = 0,
            agreement_status = 'in-progress',
            owner_id = data.get('owner_id'),
            user_id = data.get('user_id'),
            cart_item_id = cart_item_id,
            created_at = data.get('created_at') or datetime.utcnow(),
            updated_at = datetime.utcnow(),
        )
        db.session.add(new_rental_agreement)
        print(data.get('delivery'))
        print(type(data.get('delivery')))
        db.session.commit()

        # new_state_history = EquipmentStateHistory(
        #     equipment_id = cart_item_received.equipment_id,  # Lawnmower
        #     total_quantity = previous_state_history.total_quantity,
        #     available_quantity = previous_state_history.total_quantity - cart_item_received.quantity,
        #     reserved_quantity = cart_item_received.quantity,
        #     rented_quantity = 0,
        #     previous_state = previous_state_history.new_state,
        #     new_state = f'User added {cart_item_received.quantity} item or items to their cart, reserved',
        #     changed_at = datetime.utcnow(),
        # )

        # db.session.add(new_state_history)
        # db.session.commit()

        # response_data = {
        #     "equipment": new_rental_agreement.to_dict(),
        #     "state_history": new_state_history.to_dict()  # Assuming to_dict() method is defined for state history
        # }

        # response = make_response(response_data, 201)
        # return response

        response = make_response(new_rental_agreement.to_dict(), 201)
        return response

        # else:
        #     return {"error": "Equipment not available for the requested date range or quantity depleted"}, 400
        # db.session.add(new_rental_agreement)
        # db.session.commit()

        # response = make_response(new_rental_agreement.to_dict(), 201)
        # return response


api.add_resource(RentalAgreements, '/rental/agreements')

#Get a rental agreement by ID
class RentalAgreementsByID(Resource):

    #Get a single rental agreement by ID
    def get(self, id):
        agreement = RentalAgreement.query.filter(RentalAgreement.id == id).first()

        if agreement:
            return make_response(agreement.to_dict(), 200)
        else:
            response = make_response({
            "error": "Rental Agreement not found"
            }, 404)
            return response
        
    #delete a single rental agreement
    def delete(self, id):
        agreement = RentalAgreement.query.filter(RentalAgreement.id == id).first()
        if agreement:
            #may need to delete the renter id and equipment id
            db.session.delete(agreement)
            db.session.commit()
            response = make_response({"message":"Succesfully deleted!"}, 204)
            return response
        else:
            response = make_response({
            "error": "Rental Agreement not found"
            }, 404)
            return response
        
    #patch a rental agreement
    def patch(self, id):
        agreement = RentalAgreement.query.filter(RentalAgreement.id == id).first()

        cart_item_received = CartItem.query.filter(CartItem.id == agreement.cart_item_id).first()

        equipment_status = EquipmentStatus.query.filter(EquipmentStatus.equipment_id == cart_item_received.equipment_id).first()

        previous_state_history = EquipmentStateHistory.query.filter_by(
        equipment_id=cart_item_received.equipment_id).order_by(EquipmentStateHistory.changed_at.desc()).first()

        if agreement:
            data = request.get_json()
            for key in data:
                setattr(agreement, key, data[key])
            # db.session.add(agreement)
            agreement.revisions += 1

            new_equipment_status = EquipmentStatus(
            equipment_id = cart_item_received.equipment_id,
            total_quantity = equipment_status.total_quantity,
            available_quantity = equipment_status.available_quantity,
            reserved_quantity = equipment_status.available_quantity - cart_item_received,
            rented_quantity = cart_item_received,
            maintenance_quantity = 0,
            transit_quantity = 0
            )

            new_state_history = EquipmentStateHistory(
            equipment_id = cart_item_received.equipment_id,  # Lawnmower
            total_quantity = equipment_status.total_quantity,
            available_quantity = equipment_status.available_quantity,
            reserved_quantity = equipment_status.available_quantity - cart_item_received,
            rented_quantity = cart_item_received,
            maintenance_quantity = 0,
            transit_quantity = 0,
            damaged_quantity = 0,
            previous_state = previous_state_history.new_state,
            new_state = f'User rented {cart_item_received} item or items',
            changed_at = datetime.utcnow(),
            )
            db.session.commit()
            if agreement.user_decision == 'accept' and agreement.owner_decision == 'accept':
                agreement.agreement_status = 'Completed'
                db.session.add(new_equipment_status)
                db.session.add(new_state_history)
                db.session.commit()
                #All Parties Accepted
            elif agreement.user_decision == 'accept' and agreement.owner_decision == 'decline':
                agreement.agreement_status = 'Owner has DECLINED this agreement'
            elif agreement.user_decision == 'decline' and agreement.owner_decision == 'accept':
                agreement.agreement_status = 'User has DECLINED this agreement'
            elif agreement.user_decision == 'decline' and agreement.owner_decision == 'decline':
                agreement.agreement_status = 'Both Parties Declined'
            elif agreement.user_decision == 'pending' and agreement.owner_decision == 'pending':
                agreement.agreement_status = 'Pending'

            db.session.commit()
            # new_rental_agreement is created with an 'in-progress' status. could add another status like 'reserved' for state history
            response = make_response(agreement.to_dict(), 202)
            return response
        else:
            response = make_response({
            "error": "Rental Agreement not found"
            }, 404)
            return response
api.add_resource(RentalAgreementsByID, '/rental/agreements/<int:id>')

#-----------------------------------------------Agreement Comment Routes-----------------------------------------------------------------------------#
class RentalAgreementComments(Resource):
    def post(self):
        data = request.get_json()
        #try VALIDATIONS:

        new_comment = AgreementComment(
            comment =  data.get('comment'),
            created_at = datetime.utcnow(),
            updated_at = datetime.utcnow(),
            user_id =  data.get('user_id'),
            owner_id =  data.get('owner_id'),
            agreement_id =  data.get('agreement_id')
        )

        db.session.add(new_comment)

        db.session.commit()

        response = make_response(new_comment.to_dict(), 201)

        return response

api.add_resource(RentalAgreementComments, '/rental/comment')
#-----------------------------------------------Favoriting for Users and Owners Routes-----------------------------------------------------------------------------#
class UserFavoriteEquipment(Resource):
    def post(self, user_id,equipment_id ):
        data = request.get_json()
        try:
        #https://stackoverflow.com/questions/46173418/sqlalchemy-two-filters-vs-one-and
        #need a way to input, owner_id and owner maybe a 2 step process?
            existing_favorite = UserFavorite.query.filter_by(user_id=user_id, equipment_id=equipment_id).first()
            print(existing_favorite)
            if existing_favorite:
                raise ValueError("You have already favorited this equipment")
            
            new_favorite = UserFavorite(
                equipment_id = data['equipment_id'],
                user_id = data['user_id'],
            )
            db.session.add(new_favorite)
            db.session.commit()

            response = make_response(new_favorite.to_dict(), 201)
            return response
        
        except ValueError:
            return make_response({"error": ["validations errors, check your input and try again"]} , 400)

api.add_resource(UserFavoriteEquipment, '/user/<int:user_id>/favorite/equipment/<int:equipment_id>')


class UserFavoriteOwner(Resource):
    def post(self, user_id, owner_id):
        data = request.get_json()
        try:
            existing_favorite = UserFavorite.query.filter_by(user_id=user_id, owner_id=owner_id).first()
            print(existing_favorite)
            if existing_favorite:
                raise ValueError("You have already favorited this equipment")
            
            new_favorite = UserFavorite(
                user_id = data['user_id'],
                owner_id = data['owner_id'],
            )
            db.session.add(new_favorite)
            db.session.commit()

            response = make_response(new_favorite.to_dict(), 201)
            return response
        
        except ValueError:
            return make_response({"error": ["validations errors, check your input and try again"]} , 400)

api.add_resource(UserFavoriteOwner, '/user/<int:user_id>/favorite/owner/<int:owner_id>')

class RemoveUserEquipmentFavorite(Resource):
    def delete(self, user_id, equipment_id):
        favorite = UserFavorite.query.filter_by(user_id=user_id, equipment_id=equipment_id).first()

        if favorite:
            db.session.delete(favorite)
            db.session.commit()
            response = make_response({"message":"Succesfully deleted!"}, 204)
            return response
        else:
            response = make_response({
            "error": "Favorite not found"
            }, 404)
            return response

api.add_resource(RemoveUserEquipmentFavorite, '/remove/user/<int:user_id>/favorite/equipment/<int:equipment_id>')


#------------------------------------------OWNER FAVORITING------------------------------
class RemoveUserOwnerFavorite(Resource):
    def delete(self, user_id, owner_id):
        favorite = UserFavorite.query.filter_by(user_id=user_id, owner_id=owner_id).first()

        if favorite:
            db.session.delete(favorite)
            db.session.commit()
            response = make_response({"message":"Succesfully deleted!"}, 204)
            return response
        else:
            response = make_response({
            "error": "Favorite not found"
            }, 404)
            return response

api.add_resource(RemoveUserOwnerFavorite, '/remove/user/<int:user_id>/favorite/owner/<int:owner_id>')

class OwnerFavoriteUser(Resource):
    def post(self, owner_id, user_id):
        data = request.get_json()
        try:
            existing_favorite = OwnerFavorite.query.filter_by(owner_id=owner_id, user_id=user_id).first()
            print(existing_favorite)
            if existing_favorite:
                raise ValueError("You have already favorited this user")
            
            new_favorite = OwnerFavorite(
                owner_id = data['owner_id'],
                user_id = data['user_id'],
            )
            db.session.add(new_favorite)
            db.session.commit()

            response = make_response(new_favorite.to_dict(), 201)
            return response
        except ValueError:
            return make_response({"error": ["validations errors, check your input and try again"]} , 400)

api.add_resource(OwnerFavoriteUser, '/owner/<int:owner_id>/favorite/user/<int:user_id>')

class RemoveOwnerFavorite(Resource):
    def delete(self, owner_id, user_id):
        favorite = OwnerFavorite.query.filter_by(owner_id=owner_id, user_id=user_id).first()

        if favorite:
            db.session.delete(favorite)
            db.session.commit()
            response = make_response({"message":"Succesfully deleted!"}, 204)
            return response
        else:
            response = make_response({
            "error": "Favorite not found"
            }, 404)
            return response

api.add_resource(RemoveOwnerFavorite, '/remove/owner/<int:owner_id>/favorite/user/<int:user_id>')


#-----------------------------------------------Bulk Equipment Upload Route-----------------------------------------------------------------------------#

class BulkEquipmentUpload(Resource):
    # Only POST method written now
    def post(self):
        # Get requested file sent from frontend
        equipmentFile = request.files['file']
        # If not received, throw error
        if not equipmentFile:
            return jsonify({'error': 'No file provided'}), 400
        
        # Read CSV, XML, and XLSX documents to rapidly add equipment row by row, appending to the owner's equipment list, and commit
        try:
            file_extension_type = equipmentFile.filename.split('.')[-1].lower()

            if file_extension_type == '.csv':
                allEquipment = pd.read_csv(equipmentFile)

            # Conditional for XML file types
            elif file_extension_type == 'xml':
                root = ET.fromstring(equipmentFile.read())
                allEquipment = []

                for equipment_element in root:
                    equipment_data = {}
                    for element_data in equipment_element:
                        equipment_data[element_data.tag] = element_data.text
                    allEquipment.append(equipment_data)

            # Conditional for Microsoft Excel files
            elif file_extension_type == 'xlsx':
                allEquipment = pd.read_excel(equipmentFile)

            allEquipment.columns = ['Equipment_name', 'Equipment_type', 'Make', 'Model', 'Owner', 'Phone', 'Email', 'Location', 'Availability', 'Delivery', 'Quantity']
            equipment_list = []

            for index, row in allEquipment.iterrows():
                owner_name = row['Owner']
                equipment_owner = EquipmentOwner.query.filter(EquipmentOwner.name == owner_name).first()
                equipment = Equipment(
                    name = row['Equipment_name'],
                    type = row['Equipment_type'],
                    make = row['Make'],
                    model = row['Model'],
                    country = row['country'],
                    state = row['state'],
                    city = row['city'],
                    address = row['address'],
                    address_line_2 = row['address_line_2'],
                    postal_code = row['postal_code'],
                    availability = row['Availability'],
                    delivery = row['Delivery'],
                    quantity = row['Quantity'],
                    owner_id = equipment_owner.id
                )

                equipment_list.append(equipment)
                equipment_owner.equipment.append(equipment)

            db.session.add_all(equipment_list)
            db.session.commit()

        except ValueError:
            return jsonify({'error': 'Value Error when reading file'}), 500

api.add_resource(BulkEquipmentUpload, '/bulk_file_upload')

#-----------------------------------------------REVIEWS-----------------------------------------------------------------------------

class ReviewHandling(Resource):
    def post(self):
        data = request.get_json()
        try:
            agreement_id = data['agreement_id']
            user_id = data['user_id']
            owner_id = data['owner_id']
            reviewer_type = data['reviewer_type']

            # Check for existing reviews
            user_review_existing = Review.query.filter_by(user_id = user_id, agreement_id = agreement_id, reviewer_type = reviewer_type).first()
            owner_review_existing = Review.query.filter_by(owner_id = owner_id, agreement_id = agreement_id, reviewer_type = reviewer_type).first()
            
            if user_review_existing:
                response = {"error": "You have already left a review for this agreement"}
                return make_response(response, 409) # 409 Conflict
            
            if owner_review_existing:
                response = {"error": "You have already left a review for this agreement"}
                return make_response(response, 409) # 409 Conflict
        
            new_review = Review(
                review_stars = data['review_stars'],
                review_comment = data['review_comment'],
                reviewer_type = data['reviewer_type'],
                created_at = datetime.utcnow(),
                updated_at = datetime.utcnow(),
                agreement_id = data['agreement_id'],
                user_id = user_id,
                owner_id = owner_id,
            )
            db.session.add(new_review)
            db.session.commit()

            response = make_response(new_review.to_dict(), 201)
            return response
        
        except ValueError:
            return make_response({"error": ["validations errors, check your input and try again"]} , 400)

api.add_resource(ReviewHandling, '/review')

class UserReviewEditing(Resource):
    def patch(self, user_id, review_id):
        selected_review = Review.query.filter_by(user_id = user_id, id = review_id).first()
        if selected_review:
            #try VALIDATIONS:
            data = request.get_json()
            print("Received data:", data)
            for key in data:
                setattr(selected_review, key, data[key])
                if 'review_comment' in data:
                    selected_review.review_comment = data['review_comment']
                # db.session.add(selected_review)
                db.session.commit()
                response = make_response(selected_review.to_dict(), 202)
                return response
            #except ValueError:
        else:
            response = make_response({
            "error": "Review not found"
            }, 404)
            return response

api.add_resource(UserReviewEditing, '/user/<int:user_id>/review/<int:review_id>/')


class OwnerReviewEditing(Resource):
    def patch(self, owner_id, review_id):
        selected_review = Review.query.filter_by(owner_id = owner_id, id = review_id).first()
        if selected_review:
            #try VALIDATIONS:
            data = request.get_json()
            print("Received data:", data)
            for key in data:
                setattr(selected_review, key, data[key])
                if 'review_comment' in data:
                    selected_review.review_comment = data['review_comment']
                # db.session.add(selected_review)
                db.session.commit()
                response = make_response(selected_review.to_dict(), 202)
                return response
            #except ValueError:
        else:
            response = make_response({
            "error": "Review not found"
            }, 404)
            return response

api.add_resource(OwnerReviewEditing, '/owner/<int:owner_id>/review/<int:review_id>/')


#-----------------------------------------------Rental Agreement Classes - CHECKING FOR AVAILABILITY AND SUCH -----------------------------------------------------------------------------

# Will need to make a call to this route I believe, to check whether or not the date and end date will be available for using the equipment. Need to find a way to also match the time. If someone's only renting a piece out for two hours, they have another 10 hours ahead in which the equipment can be rented.
# class AvailabilityChecker(Resource):
#     def get(self, equipment_id, start_date, end_date):
#         #Grab equipment with the equipment ID, declare an available quantity
#         equipment = Equipment.query.filter(Equipment.id == equipment_id).first()
#         available_quantity = equipment.quantity

#         # Check if the equipment is available and if there's enough quantity
#         if is_available_for_date_range(equipment, start_date, end_date) and available_quantity > 0:
#             # Deduct quantity
#             equipment.quantity -= 1
#             db.session.commit()
#             return {"available": True, "available_quantity": equipment.quantity}
#         else:
#             return {"available": False, "available_quantity": equipment.quantity}



# api.add_resource(AvailabilityChecker, "/availability/<int:equipment_id>/<string:start_date>/<string:end_date>")

#----------------------------------------------- Cart / Item Routes -----------------------------------------------------------------------------
class Carts(Resource):
    #Get ALL rental agreements
    #list of all the renters and the equipment
    def get(self):
        carts = [cart.to_dict() for cart in Cart.query.all()]

        response = make_response(carts, 200)

        return response
    
    def post(self):
        data = request.get_json()

        #try Validations
        new_cart = Cart(
            total = 0,
            cart_name = data['cart_name'],
            cart_status = data['cart_status'],
            created_at = datetime.utcnow(),
            user_id = data['user_id']
        )

        db.session.add(new_cart)

        db.session.commit()

        response = make_response(new_cart.to_dict(), 201)

        return response

        #except ValueError ()
    
api.add_resource(Carts, "/carts")

class CartByUserID(Resource):
    def get(self,user_id):
        carts = Cart.query.filter(Cart.user_id == user_id).all()
        if carts:
            carts_dict = [cart.to_dict() for cart in carts]
            return make_response(carts_dict,200)
        else:
            response = make_response({
            "error": "Item not found"
            }, 404)
            return response
        
    def patch(self, user_id):
        cart = Cart.query.filter(Cart.user_id == user_id).first()
        if cart:
            data = request.get_json()
            for key in data:
                setattr(cart, key, data[key])
            # db.session.add(cart)
            db.session.commit()
            response = make_response(cart.to_dict(), 202)
            return response
        else:
            response = make_response({
            "error": "Item not found"
            }, 404)
            return response
    
    def delete(self, user_id):
        cart = Cart.query.filter(Cart.user_id == user_id).first()

        if cart:
            db.session.delete(cart)
            db.session.commit()
            response = make_response({"message":"Succesfully deleted!"}, 204)
            return response
        else:
            response = make_response({
            "error": "Item not found"
            }, 404)
            return response
        
api.add_resource(CartByUserID, "/user/<int:user_id>/cart/")

class UserCartByCartID(Resource):
    def get(self,cart_id, user_id):
        cart = Cart.query.filter_by(id = cart_id, user_id = user_id).first()
        if cart:
            return make_response(cart.to_dict(),200)
        else:
            response = make_response({
            "error": "Item not found"
            }, 404)
            return response
        
    def patch(self, cart_id, user_id):
        cart = Cart.query.filter_by(id = cart_id, user_id = user_id).first()

        if cart:
            data = request.get_json()
            for key in data:
                setattr(cart, key, data[key])
            # db.session.add(cart)
            db.session.commit()
            response = make_response(cart.to_dict(), 202)
            return response
        else:
            response = make_response({
            "error": "Item not found"
            }, 404)
            return response
    
    def delete(self, cart_id, user_id):
        cart = Cart.query.filter_by(id = cart_id, user_id = user_id).first()

        if cart:
            db.session.delete(cart)
            db.session.commit()
            response = make_response({"message":"Succesfully deleted!"}, 204)
            return response
        else:
            response = make_response({
            "error": "Item not found"
            }, 404)
            return response
        
api.add_resource(UserCartByCartID, "/user/<int:user_id>/cart/<int:cart_id>")

class AddItemToCart(Resource):
    def post(self,cart_id):
        data = request.get_json()

        #try Validations
        # Look for cart and equipment
        cart = Cart.query.filter(Cart.id == cart_id).first()
        equipment = Equipment.query.filter(Equipment.id == data['equipment_id']).first()
        equipment_status = EquipmentStatus.query.filter(EquipmentStatus.equipment_id == data['equipment_id']).first()

        previous_state_history = EquipmentStateHistory.query.filter_by(
        equipment_id=data['equipment_id']).order_by(EquipmentStateHistory.changed_at.desc()).first()

        # new_items = [] # Math here, need to add stuff to a list, call function on it, then calculate total. Something is going wrong somewhere. 
        # THE ABOVE MIGHT BEEN FIXED BY READING BELOOOOOOOOOOOOOOOOOOOOOW

        # If neither cart or equipment are found, return 404
        if not cart:
            return make_response({'error': 'Cart not found'}, 404)
        if not equipment:
            return make_response({'error': 'Equipment not found'}, 404)
        
        #Initialize pricing, pricing at the moment can only handle array with an index of 0, unless I decide to incorporate other pricing options, so you could run pricing "sets" owner could just select. Has access to rates
        pricing = equipment.equipment_price[0]   
        
        #changed rental_rate and rental_length because I was reusing the variable names in the post. Changed names to be INPUT

        input_rental_rate = data['rental_rate']  # For example: 'hourly', 'daily', 'weekly', 'promo'
        input_rental_length = data['rental_length']
        price_when_added = 0

        # Takes input and changes price accordingly
        if input_rental_rate == 'hourly':
            price_when_added = pricing.hourly_rate
        elif input_rental_rate == 'daily':
            price_when_added = pricing.daily_rate
        elif input_rental_rate == 'weekly':
            price_when_added = pricing.weekly_rate
        elif input_rental_rate == 'promo':
            price_when_added = pricing.promo_rate
        else:
            return make_response({'error': 'Invalid rental period'}, 400)
#----------------------------------------------------------------------------------------------------------------------------------
        # total_price_cents = (price_cents_at_addition * input_rental_length) * data['quantity']
        # This reads as it was doing the math, calculating how much was there, but then it re-does the math in cart.
        #^ I think this was messing it up, it's getting late now so I will test this more tomorrow
#----------------------------------------------------------------------------------------------------------------------------------
        # print("Your cart is:",cart.cart_name)
        # print("Your equipment is:", equipment)
        # print("Your rental rate:", input_rental_rate)
        # print("Your rental length:", input_rental_length)
        # print("Total price in CENTS:", price_when_added)
        # print("QUANTITY OF:", data['quantity'])

        #Create new CartItem with price calculated by $ * quantity (ALL IN CENTS)
        new_item = CartItem(
        equipment_id = equipment.id,
        quantity = data['quantity'],
        rental_rate = input_rental_rate,
        rental_length = input_rental_length,
        price_cents_at_addition=price_when_added,
        created_at = datetime.utcnow(),
        )

        # Append item to cart, after adding and comitting, calculcate total if wanting to do a group adding system can do for item in a new list made here, append, then calculate total at the end.
        amount_added_to_cart = int(data['quantity'])
        print("EQUIPMENT QUANTITY WHEN ADDING TO CART", equipment_status.available_quantity)
        print('AMOUNT TRYING TO BE ADDED', amount_added_to_cart)
        print(equipment_status.available_quantity > amount_added_to_cart)
        print('PREVIOUS RESERVED QUANTITY', equipment_status.reserved_quantity) 

        # if equipment_status.available_quantity >= cart_item_received.quantity:
        #     equipment_status.available_quantity -= cart_item_received.quantity
        #     equipment_status.reserved_quantity += cart_item_received.quantity
        #     db.session.commit()  # Commit the changes for both new_item and updated equipment quantity
        #     # response = make_response(response_data, 201)
        #     # return response
        # else:
        #     # If not enough equipment quantity, handle error 
        #     return make_response({'error': 'Not enough equipment available'}, 400)

        if equipment_status.available_quantity < amount_added_to_cart:
            return make_response({'error': 'Not enough equipment available'}, 400)
        elif equipment_status.available_quantity >= amount_added_to_cart:
            cart.cart_item.append(new_item)
            db.session.add(new_item)
            db.session.commit()
            equipment_status.available_quantity -= amount_added_to_cart
            equipment_status.reserved_quantity += amount_added_to_cart

        print('NEW RESERVED QUANTITY', equipment_status.reserved_quantity)

        new_state_history = EquipmentStateHistory(
            equipment_id = equipment.id,
            total_quantity = equipment_status.total_quantity,
            available_quantity = equipment_status.available_quantity,
            reserved_quantity = amount_added_to_cart,
            rented_quantity = previous_state_history.rented_quantity,
            maintenance_quantity = previous_state_history.maintenance_quantity,
            transit_quantity = previous_state_history.transit_quantity,
            damaged_quantity = previous_state_history.damaged_quantity,
            previous_state = previous_state_history.new_state,
            new_state = f'User added {amount_added_to_cart} item or items to their cart, reserved',
            changed_at = datetime.utcnow(),
        )

        # Previous State used to be just 'available'

        # May need to include this commit back
        # db.session.commit()  # Commit the changes for both new_item and updated equipment quantity
        cart.calculate_total()
        db.session.add(new_state_history)
        db.session.commit()  # Commit changes after recalculating the total
        response = make_response({'id': new_item.id,'details': new_item.to_dict()}, 201)
        return response
    
        # else:
        #     # If not enough equipment quantity, handle error 
        #     return make_response({'error': 'Not enough equipment available'}, 400)

        # cart.calculate_total()
        # db.session.commit()
        #except ValueError ()

    def patch(self, cart_id):
        data = request.get_json()
        cart = Cart.query.filter(Cart.id == cart_id).first()

        cart_item = cart.query.filter(CartItem.id == data['cart_item_id']).first()

        # if cart_item.agreements[0].agreement_status == 'both-accepted':
        #     response = make_response({
        #     "error": "Both parties have accepted, no longer able to edit this agreement."
        #     }, 405 )
        #     return response

        if cart_item:
            data = request.get_json()
            for key in data:
                setattr(cart_item, key, data[key])
            # db.session.add(cart_item)
            db.session.commit()
            response = make_response(cart_item.to_dict(), 202)
            return response
        else:
            response = make_response({
            "error": "Item not found"
            }, 404)
            return response


api.add_resource(AddItemToCart, '/cart/<int:cart_id>')

class CartItemByID(Resource):
    def get(self,cart_item_id):
        cart_item = CartItem.query.filter(CartItem.id == cart_item_id).first()

        if cart_item:
            return make_response(cart_item.to_dict(),200)
        else:
            response = make_response({
            "error": "Item not found"
            }, 404)
            return response
        
    def patch(self, cart_id, cart_item_id):
        cart = Cart.query.filter(Cart.id == cart_id).first()
        cart_item = CartItem.query.filter(CartItem.id == cart_item_id).first()

        # print("THE CART ITEM ID:", cart_item_id)
        # print("THE CART ITEM:", cart_item)
        # print('THE CART ITEM PRICE CENTS IF CHANGED BEFORE:', cart_item.price_cents_if_changed)
        # print("THE CART ID:", cart_id)
        # print("THE CART NAME:", cart.cart_name)
        if cart_item.agreements[0].agreement_status == 'both-accepted':
            response = make_response({
            "error": "Both parties have accepted, no longer able to edit this agreement."
            }, 405 )
            return response

        if cart_item:
            data = request.get_json()
            print("THE DATA",data)
            for key in data:
                # if key == 'price_cents_if_changed':
                #     cart_item.price_cents_if_changed = data['price_cents_if_changed']
                #     print('THE CHANGED PRICE INCOMING',data['price_cents_if_changed'])
                print("THE KEYS:", key)
                setattr(cart_item, key, data[key])
                # db.session.commit()
            # db.session.add(cart_item)
            db.session.commit()

            print('THE CHANGED PRICE FIN', cart_item.price_cents_if_changed)

            
            for cart_item in cart.cart_item:
                # print("inital cart item rates:",cart_item.total_cost)
                cart_item.total_cost
                # print("after cart item rates:",cart_item.total_cost)
            
            cart.calculate_total()
            db.session.commit()
            # print(cart_item.to_dict())

            # Had to re-fetch the updated cart_item to send it in the response after committing the changes. It was having difficulty handling the changes and sending it in the existing one.
            updated_cart_item = CartItem.query.filter(CartItem.id == cart_item_id).first()

            response = make_response(updated_cart_item.to_dict(), 202)
            print(cart.total)
            return response
        else:
            response = make_response({
            "error": "Item not found"
            }, 404)
            return response
    
    def delete(self, cart_item_id):
        cart_item = CartItem.query.filter(CartItem.id == cart_item_id).first()

        if cart_item:
            db.session.delete(cart_item)
            db.session.commit()
            response = make_response({"message":"Succesfully deleted!"}, 204)
            return response
        else:
            response = make_response({
            "error": "Item not found"
            }, 404)
            return response
        
api.add_resource(CartItemByID, "/cart/<int:cart_id>/item/<int:cart_item_id>")

#----------------------------------------------- Messaging Routes -----------------------------------------------------------------------------

#--------------------------------------------Inbox handling, and message sending below-----------------------------------------
class SendMessage(Resource):
    def post(self):
        data = request.get_json()
        #try Validations:

        new_message = Message(
            recipient_id = data['recipient_id'],
            sender_id = data['sender_id'],
            context_id = data['context_id'],
            user_type = data["user_type"],
            content = data['content'],
            message_status = data['message_status'],
            created_at = datetime.utcnow(),
            thread_id = data['thread_id']
        )

        db.session.add(new_message)

        db.session.commit()

        response = make_response(new_message.to_dict(), 201)

        return response

        #except ValueError ()

api.add_resource(SendMessage, "/messages")

class StartNewThread(Resource):
    def post(self):
        data = request.get_json()
        #try validations:

        new_thread = Thread(
            subject = data['subject'],
        )

        db.session.add(new_thread)

        db.session.commit()

        response = make_response(new_thread.to_dict(),201)

        return response

        #except ValueError

api.add_resource(StartNewThread, "/new/thread")

class AddToInboxes(Resource):
    def post(self):
        data = request.get_json()
        #try validations:

        new_user_inbox = UserInbox(
            user_id = data['user_id'],
            thread_id = data['thread_id']
        )

        new_owner_inbox = OwnerInbox(
            owner_id = data['owner_id'],
            thread_id = data['thread_id']
        )

        db.session.add_all([new_user_inbox, new_owner_inbox])

        db.session.commit()

        response_data = {
            'user_inbox': new_user_inbox.to_dict(),
            'owner_inbox': new_owner_inbox.to_dict()
        }

        response = make_response(response_data, 201)

        return response
        
        #except valueError

api.add_resource(AddToInboxes, "/new/inboxes")


class ThreadById(Resource):
    def get(self, thread_id):
        thread = Thread.query.filter(Thread.id == thread_id).first()

        if thread:
            return make_response(thread.to_dict(),200)
        else:
            response = make_response({
            "error": "Thread not found"
            }, 404)
            return response

api.add_resource(ThreadById, "/thread/<int:thread_id>")

class MessageByID(Resource):
    def get(self, id):
        message = Message.query.filter(Message.id == id).first()

        if message:
            return make_response(message.to_dict(),200)
        else:
            response = make_response({
            "error": "Message not found"
            }, 404)
            return response
        
    def patch(self, id):
        message = Message.query.filter(Message.id == id).first()

        if message:
            data = request.get_json()
            for key in data:
                setattr(message, key, data[key])
            # db.session.add(message)
            db.session.commit()
            response = make_response(message.to_dict(), 202)
            return response
        else:
            response = make_response({
            "error": "Message not found"
            }, 404)
            return response
        
    def delete(self, id):
        message = Message.query.filter(Message.id == id).first()

        if message:
            #may need to delete the renter id and equipment id
            db.session.delete(message)
            db.session.commit()
            response = make_response({"message":"Succesfully deleted!"}, 204)
            return response
        else:
            response = make_response({
            "error": "Message not found"
            }, 404)
            return response
        
api.add_resource(MessageByID, '/message/<int:id>')

class StripeCreateConnectAccount(Resource):
    @jwt_required()
    def post(self):
        current_user = get_jwt_identity()
        print(current_user)
        owner_id = current_user.get('id')
        print(owner_id)
        owner_role = current_user.get('role')
        print(owner_role)
        equip_owner = EquipmentOwner.query.filter(EquipmentOwner.id == owner_id).first()
        print(equip_owner)

        if owner_role != 'owner':
            return {'error': 'Unauthorized'}, 403
        if not equip_owner:
            return {'error': 'Owner not found'}, 404
        
        account = stripe.Account.create(
            type='express',
            country=equip_owner.country,
            email=equip_owner.email,
            business_type='individual',
            company = {
                'address' : {
                    'city': equip_owner.city,
                    'country': equip_owner.country,
                    'line1': equip_owner.address,
                    'line2': equip_owner.address_line_2,
                    'postal_code': equip_owner.postal_code,
                    'state': equip_owner.state,
                },
                'name' : 'Marks Rentals',
                'phone' : equip_owner.phone,
                'tax_id' : '000000000',
            },
            individual={
                'address': {
                    'city': equip_owner.city,
                    'country': equip_owner.country,
                    'line1': equip_owner.address,
                    'line2': equip_owner.address_line_2,
                    'postal_code': equip_owner.postal_code,
                    'state': equip_owner.state,
                },
                'dob' : {
                    'day': '01',
                    'month': '01',
                    'year': '1901',
                },
                'email' : equip_owner.email,
                'first_name' : equip_owner.firstName,
                'last_name' : equip_owner.lastName,
                'phone' : equip_owner.phone,
                'id_number': '000000000',
                # 'id_number_provided' : True,
            },
            business_profile = {
                'url' : 'https://accessible.stripe.com',
                'support_phone' : equip_owner.phone,
                'support_email' : equip_owner.email,
                'name' : f"{equip_owner.firstName} {equip_owner.lastName}",
                'support_address' : {
                    'city': equip_owner.city,
                    'country': equip_owner.country,
                    'line1': equip_owner.address,
                    'line2': equip_owner.address_line_2,
                    'postal_code': equip_owner.postal_code,
                    'state': equip_owner.state,
                },
            },
            capabilities={
                'card_payments': {'requested': True},
                'transfers': {'requested': True},
            },
        )

        # account_link = stripe.AccountLink.create(
        #         account=account.id,
        #         refresh_url='http://localhost:3000/dashboard',
        #         return_url='http://localhost:3000/dashboard',
        #         type='account_onboarding',
        # )

        equip_owner.stripe_id = account.id
        # print(account_link.url)
        
        # equip_owner.stripe_onboard_link = account_link.url
        db.session.commit()
        # print(equip_owner.stripe_onboard_link)
        # db.session.refresh(equip_owner)

        response = make_response(account, 200)
        return response

api.add_resource(StripeCreateConnectAccount, '/v1/accounts')

class StripeHandleConnectAccount(Resource):
    @jwt_required()
    def get(self, id):
        current_user = get_jwt_identity()
        owner_id = current_user.get('id')
        # owner_role = current_user.get('role')
        equip_owner = EquipmentOwner.query.filter(EquipmentOwner.id == owner_id).first()
        # equip_owner = EquipmentOwner.query.filter(EquipmentOwner.stripe_id == id).first()
        
        print("THE OWNER STRIPE ID:", id)

        # check for charges_enabled
        # check the state of the details_submitted
        # https://stripe.com/docs/connect/express-accounts#:~:text=You%20can%20check%20the%20state,ve%20completed%20the%20onboarding%20process.
        # A user that’s redirected to your return_url might not have completed the onboarding process. Retrieve the user’s account and check for charges_enabled. If the account isn’t fully onboarded, provide UI prompts to allow the user to continue onboarding later. The user can complete their account activation through a new account link (generated by your integration). You can check the state of the details_submitted parameter on their account to see if they’ve completed the onboarding process.
        
        if equip_owner:
            # stripe_account = stripe.Account.retrieve(id)
            stripe_account = stripe.Account.retrieve(equip_owner.stripe_id)
            if stripe_account:
                response = make_response(stripe_account, 200)
        else:
            response = make_response({
            "error": "Stripe Account not found"
            }, 404)
        return response

    @jwt_required()
    def post(self, id):
        current_user = get_jwt_identity()
        owner_id = current_user.get('id')
        owner_role = current_user.get('role')

        equip_owner = EquipmentOwner.query.filter(EquipmentOwner.id == owner_id).first()

        # equip_owner = EquipmentOwner.query.filter(EquipmentOwner.stripe_id == id).first()
        if equip_owner:
            # stripe_account = stripe.Account.modify(
            # id,
            # metadata={"order_id": "6735"},
            # )

            stripe_account = stripe.Account.modify(
            equip_owner.stripe_id,
            metadata={"order_id": "6735"},
            )

            if stripe_account:
                response = make_response(stripe_account, 200)
        else:
            response = make_response({
            "error": "Stripe Account not found"
            }, 404)
        return response

    @jwt_required()
    def delete(self, id):
        current_user = get_jwt_identity()
        owner_id = current_user.get('id')
        owner_role = current_user.get('role')

        equip_owner = EquipmentOwner.query.filter(EquipmentOwner.id == owner_id).first()

        # equip_owner = EquipmentOwner.query.filter(EquipmentOwner.stripe_id == id).first()
        if equip_owner:
            # stripe_account = stripe.Account.modify(
            # id,
            # metadata={"order_id": "6735"},
            # )

            stripe_account = stripe.Account.modify(
            equip_owner.stripe_id,
            metadata={"order_id": "6735"},
            )

            if stripe_account:
                response = make_response(stripe_account, 204)
        else:
            response = make_response({
            "error": "Stripe Account not found"
            }, 404)
        return response
    
api.add_resource(StripeHandleConnectAccount, '/v1/accounts/<string:id>')

class StripeCreateAccountLink(Resource):
    @jwt_required()
    def post(self):
        current_user = get_jwt_identity()
        owner_id = current_user.get('id')
        owner_role = current_user.get('role')
        equip_owner = EquipmentOwner.query.filter(EquipmentOwner.id == owner_id).first()

        if owner_role != 'owner':
            return {'error': 'Unauthorized'}, 403
        if not equip_owner:
            return {'error': 'Owner not found'}, 404
        
        account_link = stripe.AccountLink.create(
                account=equip_owner.stripe_id,
                refresh_url='http://localhost:3000/dashboard',
                return_url='http://localhost:3000/dashboard',
                type='account_onboarding',
        )

        if account_link:
            response = make_response(account_link, 201)
        else:
            response = make_response({
            "error": "Account link not found"
            }, 404)
        return response
        
api.add_resource(StripeCreateAccountLink, '/v1/account_links')

# class CheckingOut(Resource):
#     def checkout_equipment(equipment_id, quantity):
#         # Fetch the most recent state history
#         last_state = EquipmentStateHistory.query.filter_by(
#             equipment_id=equipment_id
#         ).order_by(EquipmentStateHistory.changed_at.desc()).first()

#         # Ensure that the equipment is actually reserved before proceeding
#         if 'reserved' in last_state.new_state:
#             raise ValueError("Equipment must be in reserved state to check out.")

#         # Deduct the quantity from the equipment's available stock
#         equipment = Equipment.query.get(equipment_id)
#         if equipment.status[0].current_quantity < quantity:
#             raise ValueError("Not enough equipment available to fulfill this rental.")

#         equipment.status[0].current_quantity -= quantity
#         equipment.status[0].reserved_quantity += quantity
#         db.session.add(equipment)

#         # Record the state change
#         new_state_history = EquipmentStateHistory(
#             equipment_id = equipment_id,
#             total_quantity = last_state.new_quantity,
#             available_quantity = last_state.available_quantity,
#             reserved_quantity = last_state.reserved_quantity,
#             rented_quantity = 0,
#             maintenance_quantity = 0,
#             transit_quantity = 0,
#             damaged_quantity = 0,
#             previous_state = last_state.new_state,
#             new_state = 'available',
#             changed_at=datetime.utcnow(),
#         )
#         db.session.add(new_state_history)

#         db.session.commit()

# api.add_resource(CheckingOut, '/checkout/<int:equipment_id>/<int:quantity>')

class CheckingOut(Resource):
    def post(equipment_id, quantity):
        stripe.checkout.Session.create(
        line_items=[
            {
            "price_data": {
                "currency": "usd",
                "product_data": {
                    "name": "T-shirt",
                    "description": "",
                    "images": "",
                    },
                #Unit amount = how much to charge
                "unit_amount": 2000,
                "tax_behavior": "exclusive",
            },
            "quantity": 1,
            },
        ],
        payment_intent_data={
            "application_fee_amount": 123,
            "transfer_data": {"destination": '{{CONNECTED_ACCOUNT_ID}}'},
        },
        mode="payment",
        ui_mode="embedded",
        return_url="https://example.com/checkout/return?session_id={CHECKOUT_SESSION_ID}",
        )
        # Fetch the most recent state history
        last_state = EquipmentStateHistory.query.filter_by(
            equipment_id=equipment_id
        ).order_by(EquipmentStateHistory.changed_at.desc()).first()

        # Ensure that the equipment is actually reserved before proceeding
        if 'reserved' in last_state.new_state:
            raise ValueError("Equipment must be in reserved state to check out.")

        # Deduct the quantity from the equipment's available stock
        equipment = Equipment.query.get(equipment_id)
        if equipment.status[0].current_quantity < quantity:
            raise ValueError("Not enough equipment available to fulfill this rental.")

        equipment.status[0].current_quantity -= quantity
        equipment.status[0].reserved_quantity += quantity
        db.session.add(equipment)

        # Record the state change
        new_state_history = EquipmentStateHistory(
            equipment_id = equipment_id,
            total_quantity = last_state.new_quantity,
            available_quantity = last_state.available_quantity,
            reserved_quantity = last_state.reserved_quantity,
            rented_quantity = 0,
            maintenance_quantity = 0,
            transit_quantity = 0,
            damaged_quantity = 0,
            previous_state = last_state.new_state,
            new_state = 'available',
            changed_at=datetime.utcnow(),
        )
        db.session.add(new_state_history)

        db.session.commit()

api.add_resource(CheckingOut, '/checkout/<int:equipment_id>/<int:quantity>')


class CalculateMonthlyTotals(Resource):
    def get(self, month, year):
        print(f"Processing summaries for month: {month}, year: {year}")
        intYear = int(year)
        intMonth = int(month)
        start_of_month = datetime(intYear, intMonth, 1).date()
        end_of_month = datetime(intYear, intMonth + 1, 1).date() if intMonth < 12 else datetime(intYear + 1, 1, 1).date()
        
        print("Database datetime:", [summary.date for summary in EquipmentStateSummary.query.all()])
        print("Query datetime:", start_of_month)
        print("THE START OF THE MONTH:", start_of_month)
        print("THE END OF THE MONTH:", end_of_month)
        unique_equipment_ids = EquipmentStateHistory.query.with_entities(EquipmentStateHistory.equipment_id).distinct().all()
        
        all_summaries = {}

        # EquipmentStateSummary.query.delete()
        
        for equipment_id_tuple in unique_equipment_ids:
            equipment_id = equipment_id_tuple[0]
            print(f"Processing equipment_id: {equipment_id}")
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
                if 'reserved' in record.new_state.lower():
                    summary_data['total_reserved'] += record.reserved_quantity
                # summary_data['total_reserved'] += record.reserved_quantity
                # summary_data['total_rented_out'] += record.rented_quantity
                if 'rented' in record.new_state.lower():
                    summary_data['total_rented_out'] += record.rented_quantity
                summary_data['total_available'] = record.available_quantity 
                if 'maintenance' in record.new_state.lower():
                    summary_data['total_maintenance'] += record.maintenance_quantity
                    
            last_record = monthly_history_records[-1]
            summary_data['total_available'] = last_record.available_quantity
        
        for equipment_id, summary_data in all_summaries.items():
            print(equipment_id)
            existing_summary = EquipmentStateSummary.query.filter_by(
                equipment_id=equipment_id,
                date=start_of_month
            ).first()
            
            if existing_summary:
                print(f"Found existing summary for equipment_id: {equipment_id}")
                for key, value in summary_data.items():
                    setattr(existing_summary, key, value)
            else:
                print(f"Creating new summary for equipment_id: {equipment_id}")
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
        print(f"Committing changes to the database")
        try:
            db.session.commit()
            print(f"Commit successful")
            all_summaries_serializable = {
                str(equipment_id): {
                    'date': start_of_month,
                    'total_quantity': summary_data['total_quantity'],
                    'total_available': summary_data['total_available'],
                    'total_reserved': summary_data['total_reserved'],
                    'total_rented_out': summary_data['total_rented_out'],
                    'total_maintenance_quantity': summary_data['total_maintenance'],
                    'total_cancelled': summary_data['total_cancelled'],
                    'equipment_history_id': summary_data['equipment_history_id'],
                    'equipment_id': equipment_id
                } for equipment_id, summary_data in all_summaries.items()
            }

            return jsonify(all_summaries_serializable)
        except IntegrityError:
            print(f"Commit failed")
            db.session.rollback()
            return {"message": "An error occurred while calculating monthly totals."}, 500

    
api.add_resource(CalculateMonthlyTotals, '/summarize/<string:month>/<string:year>')

if __name__ == '__main__':
    app.run(port=5555, debug=True)




#holy cow stop coding on main u gOOFY 

#Routes needed -
# INDEX
#1. Individual Equipment page
#2. Rental Owner Page (So the rental owners own page with all their rental listings)
#3. See All Rentals (Equipment)
#4. See All owners (Owners)
#5. Search / Filter rental by type / name / owner
#6. Checkout a rental (rental agreement?)
#7. Post a Rental, 
#8  Delete a rental
#9  Edit a rental

# FLOW
#1. Index page
# See a featured rental, 3 featured items, recent reviews if possible? 

#2. Rental Owner Page (id or name)
# Takes you to the Owner of the rentals own homepage-esque, showing all of their available rentals, along with a button to check them out. Possibly add in user authentication so they can sign in and for example edit their rentals.

#3. See all rentals, (Anyone)
# basically a button / navbar thing that allows an individual to see all the rentals that the site hosts

#4. See All Owners (Anyone)
# A button / navbar to see everyone that uses the site and lists equipment for rent

#5 A search or filter rental by type / name / owner (Anyone)
# Same functionality, click owner name be taken to owner page, click equipment and be taken to the equipment (by Id?) page. 

#6 Actual ability to check out a rental, (Users)
# would be a patch impacting quantity, if 0 are available, need to work logic out on how it would impact that number. Possibly available and checked out as attributes? So make it where if all quantity are checked out = none available?

#7 Post a rental, (new Owners? Anyone? Also it should be post an equipment for rent)
# Post a rental equipment, simply put

#8 Delete a rental listing (Owners)
# Simply no longer list that rental

#9 Edit a rental, (Owners)
# if you end up having less because one is in the shop for example, or maybe you move





#equipment by ID, owner by ID, and user by ID done. NEED to check whether or not we should do to_dict() rules.