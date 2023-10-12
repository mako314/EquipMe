from models import db, User, EquipmentOwner, Equipment, EquipmentImage, RentalAgreement, Message, Inbox
# from flask_cors import CORS
# from flask_migrate import Migrate
# from flask import Flask, request, make_response, jsonify
# from flask_restful import Api, Resource
# import os

from flask import Flask, request, make_response, jsonify, session
from flask_restful import Resource
from config import db, app, api
from sqlalchemy import asc
import pandas as pd
import xml.etree.ElementTree as ET

#------------------------------------HELPERS----------------------------------
from datetime import datetime
from helpers import is_available_for_date_range



#------------------------------------USER LOGIN------------------------------------------------------------------------------

class Login(Resource):

    def get(self):
        pass

    def post(self):
        data = request.get_json()
        #Test to find username,
        email = data['email']
        print(email)
        user = User.query.filter(User.email == email).first()
        #Grab password
        password = data['password']
        # print(user)
        #Test to see if password matches
        if user:
            if user.authenticate(password):
                session['user_id'] = user.id
                return user.to_dict(), 200
        #Do I need to JSONIFY^ ?

        return make_response({'error': 'Invalid email or password'}, 401)

api.add_resource(Login, '/login')
#------------------------------------------------------------------------------------------------------------------------------

#------------------------------------OWNER LOGIN------------------------------------------------------------------------------

class OwnerLogin(Resource):

    def get(self):
        pass

    def post(self):
        data = request.get_json()
        #Test to find username,
        email = data['email']
        print(email)
        owner = EquipmentOwner.query.filter(EquipmentOwner.email == email).first()
        #Grab password
        password = data['password']
        # print(user)
        #Test to see if password matches
        if owner:
            if owner.authenticate(password):
                session['owner_id'] = owner.id
                return owner.to_dict(), 200
        #Do I need to JSONIFY^ ?

        return make_response({'error': 'Invalid email or password'}, 401)

api.add_resource(OwnerLogin, '/owner/login')
#------------------------------------------------------------------------------------------------------------------------------

#------------------------------------USER LOGOUT------------------------------------------------------------------------------

class Logout(Resource):

    def delete(self): # just add this line!
        session['user_id'] = None
        return {'message': '204: No Content'}, 204

api.add_resource(Logout, '/logout')
#------------------------------------------------------------------------------------------------------------------------------
#------------------------------------OWNER LOGOUT------------------------------------------------------------------------------

class OwnerLogout(Resource):

    def delete(self): # just add this line!
        session['owner_id'] = None
        return {'message': '204: No Content'}, 204

api.add_resource(OwnerLogout, '/owner/logout')
#------------------------------------------------------------------------------------------------------------------------------

#------------------------------------ USER Check Session------------------------------------------------------------------------------

class CheckSession(Resource):

    def get(self):

        # user_id = session.get('user_id')

        # if user_id:

        #     user_row = User.query.filter(User.id == user_id).first()

        #     response = make_response(jsonify(user_row.to_dict()), 200)



        user = User.query.filter(User.id == session.get('user_id')).first()
        if user:
            return user.to_dict()
        else:
            return {'message': '401: Not Authorized'}, 401

api.add_resource(CheckSession, '/check_session')
#------------------------------------------------------------------------------------------------------------------------------

#------------------------------------ OWNER Check Session------------------------------------------------------------------------------

class OwnerCheckSession(Resource):

    def get(self):

        # user_id = session.get('user_id')

        # if user_id:

        #     user_row = User.query.filter(User.id == user_id).first()

        #     response = make_response(jsonify(user_row.to_dict()), 200)



        owner = EquipmentOwner.query.filter(EquipmentOwner.id == session.get('owner_id')).first()
        if owner:
            return owner.to_dict()
        else:
            return {'message': '401: Not Authorized'}, 401

api.add_resource(OwnerCheckSession, '/owner/check_session')
#------------------------------------------------------------------------------------------------------------------------------


#-------------------------------------------------ROUTING FOR THE APP, NO LOG IN STUFF, NO LOG OUT, NO SESSION CHECK BEYOND HERE.---------------------------------------------------



#------------------------------------------------------USER RENTER CLASSES----------------------------------------------------------

class Users(Resource):
    
    #post to users, DONE, unsure if i want to be able to see all users..
    def get(self):
        users = [user.to_dict() for user in User.query.all()]

        response = make_response(users, 200)

        return response

    def post(self):
        data = request.get_json()
        try:
            #need a way to attach to rental agreement
            new_user = User(
                firstName = data['firstName'],
                lastName = data['lastName'],
                age = data['age'],
                email = data['email'],
                _password_hash = data['password'],
                phone = data['phone'],
                location = data['location'],
                profession = data['profession'],
                profileImg = data['profileImg'],
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
                    setattr(user, key, data[key])
                db.session.add(user)
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


#-----------------------------------------------------------EQUIPMENT Owners Classes--------------------------------------------------------------

#Display all Owners of Equipment who list their stuff to rent, users should be able to click the Owner and get taken to their page with all their equipment
class EquipmentOwners(Resource):

    #succesful get to display
    def get(self):
        equip_owners = [owner.to_dict(only = ('id', 'profession', 'email', 'location', 'name', 'phone','equipment')) for owner in EquipmentOwner.query.all()]
        #had to allow ID also to grab it with link
        response = make_response(equip_owners, 200)
        #rules =('-agreements', 'equipment')

        return response
    
    #POST EQUIPMENT OWNERS -- DONE
    def post(self):
        data = request.get_json()
        try:
            new_owner = EquipmentOwner(
                name = data['name'],
                location = data['location'],
                profession = data['profession'],
                phone = data['phone'],
                email = data['email'],
                profileImage = data['profileImage'],
                website = data['website']
            )
            db.session.add(new_owner)
            db.session.commit()

            response = make_response(new_owner.to_dict(), 201)
            return response

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
            return make_response(equip_owner.to_dict(rules=('-inboxes.owner','-inboxes.user' )),200)
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
                    setattr(equip_owner, key, data[key])
                db.session.add(equip_owner)
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


#-----------------------------------------------------EQUIPMENT Classes------------------------------------------------------------------

class Equipments(Resource):

    #get ALL equipment -- DONE
    def get(self):
        equipment = [equipment.to_dict(
            only =('id','model','name','make','location', 'type','location','availability','delivery','quantity', 'owner', ) #needed to include all of this for when one patches
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
                location = data['location'],
                availability = data['availability'],
                delivery = data['delivery'],
                quantity = data['quantity'],
                owner_id= data['owner_id']
            )
            db.session.add(new_equipment)
            db.session.commit()

            response = make_response(new_equipment.to_dict(), 201)
            return response
        
            #if data['availability] == 'yes'
            #availability = True
        
        except ValueError:
            return make_response({"error": ["validations errors, check your input and try again"]} , 400)
        # NEED TO WRITE VALIDATIONS

api.add_resource(Equipments, '/equipment')

#-------------------------------
#Search and or filter by Equipment type, i.e. Heavy Machinery or painting
class EquipmentByLocation(Resource):

    def get(self,location):
        location_test = Equipment.query.filter(Equipment.location == location).all()
        if location_test:
            equipment = [equipment.to_dict(rules =('-agreements', '-owner.agreements')) for equipment in Equipment.query.filter(Equipment.location == location).all()]
            response = make_response(equipment, 200)
            return response
        else:
            response = make_response({
            "error": "No equipment in your location"
            }, 404)
            return response
        
        #need to find a way to make all the locations easily inputtable, for example Heavy Machinery doesn't get picked up if you do /heavymachinery

api.add_resource(EquipmentByLocation, '/equipment/location/<string:location>')

class EquipmentByID(Resource):

    #Get a single piece of equipment -- done
    def get(self, id):
        equipment = Equipment.query.filter(Equipment.id == id).first()
        #need a way to input, owner_id and owner maybe a 2 step process?
        #may be able to do rules to remove agreements, likely not needed information, or is it?
        if equipment:
            return make_response(equipment.to_dict(rules = ('-owner',)),200)
        else:
            response = make_response({
            "error": "Equipment not found"
            }, 404)
            return response
        
    #Patch equipment DONE
    def patch(self, id):
        equipment = Equipment.query.filter(Equipment.id == id).first()

        if equipment:
            try:
                #going to need try and except if and when we do validations
                data = request.get_json()
                for key in data:
                    setattr(equipment, key, data[key])
                db.session.add(equipment)
                db.session.commit()

                response = make_response(equipment.to_dict(), 202)
                return response
            except ValueError:
                return make_response({"error": ["validations errors, check your input and try again"]} , 400)
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
class AllEquipmentByID(Resource):
    def get(self,id):
        equipment = [equipment.to_dict(
            only =('id','model','name','make','location', 'type','phone','email','location','availability','delivery','quantity', 'owner_name') #needed to include all of this for when one patches
        ) for equipment in Equipment.query.filter(Equipment.owner_id == id).all()]

        response = make_response(equipment, 200)

        return response

api.add_resource(AllEquipmentByID, '/all_equipment/<int:id>')

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
                db.session.add(equipment_image)
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
class RentalAgreements(Resource):
    #Get ALL rental agreements
    #list of all the renters and the equipment
    def get(self):
        agreements = [agreement.to_dict( only = ('equipment','user','rental_dates')) for agreement in RentalAgreement.query.all()]

        response = make_response(agreements, 200)

        return response
    
    #post a rental agreement
    def post(self):
        data = request.get_json()
        #try:

        #need a way to grab equipment and owner
        # load category and then from there display 
        #take the input

        equipment_id = data['equipment_id']
        start_date = data['start_date']
        end_date = data['end_date']

        equipment = Equipment.query.filter(Equipment.id == equipment_id).first()
        
        if not equipment:
            return {"error": "Equipment not found"}, 404
        
        if is_available_for_date_range(equipment, start_date, end_date) and equipment.quantity > 0:
            equipment.quantity -= 1

            #may need a way to write in validations
            new_rental_agreement = RentalAgreement(
                location = data['location'],
                total_price = data['total_price'],
                rental_dates = data[f"{start_date} to {end_date}"],
                owner_id = data['owner_id'],
                user_id = data['user_id'],
                equipment_id = data['equipment_id'],
                created_on = datetime.utcnow(),
                modified_on = datetime.utcnow(),

            )
            db.session.add(new_rental_agreement)
            db.session.commit()

            response = make_response(new_rental_agreement.to_dict(), 201)
            return response
        else:
            return {"error": "Equipment not available for the requested date range or quantity depleted"}, 400
        # db.session.add(new_rental_agreement)
        # db.session.commit()

        # response = make_response(new_rental_agreement.to_dict(), 201)
        # return response


api.add_resource(RentalAgreements, '/rental_agreements')

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

        if agreement:
            data = request.get_json()
            for key in data:
                setattr(agreement, key, data[key])
            db.session.add(agreement)
            db.session.commit()
            response = make_response(agreement.to_dict(), 202)
            return response
        else:
            response = make_response({
            "error": "Rental Agreement not found"
            }, 404)
            return response
api.add_resource(RentalAgreementsByID, '/rental_agreements/<int:id>')

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
                    location = row['Location'],
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

#-----------------------------------------------Rental Agreement Classes - CHECKING FOR AVAILABILITY AND SUCH -----------------------------------------------------------------------------

# Will need to make a call to this route I believe, to check whether or not the date and end date will be available for using the equipment. Need to find a way to also match the time. If someone's only renting a piece out for two hours, they have another 10 hours ahead in which the equipment can be rented.
class AvailabilityChecker(Resource):
    def get(self, equipment_id, start_date, end_date):
        #Grab equipment with the equipment ID, declare an available quantity
        equipment = Equipment.query.filter(Equipment.id == equipment_id).first()
        available_quantity = equipment.quantity

        # Check if the equipment is available and if there's enough quantity
        if is_available_for_date_range(equipment, start_date, end_date) and available_quantity > 0:
            # Deduct quantity
            equipment.quantity -= 1
            db.session.commit()
            return {"available": True, "available_quantity": equipment.quantity}
        else:
            return {"available": False, "available_quantity": equipment.quantity}



api.add_resource(AvailabilityChecker, "/availability/<int:equipment_id>/<string:start_date>/<string:end_date>")


#----------------------------------------------- Messaging Routes -----------------------------------------------------------------------------

class OwnerMessages(Resource):
    def get(self, owner_id):
        owner_message_threads = Inbox.query.filter_by(owner_id=owner_id).all()
        message_threads = []

        for thread in owner_message_threads:
            message_id = thread.message_id
            # Use message_id to retrieve the content of the message, sender, and recipient
            message = Message.query.get(message_id)
            sender_id = message.sender_id
            context_id = message.context_id
            recipient_id = message.recipient_id
            subject = message.subject
            content = message.content
            
            # Append the message details to the message_threads list
            message_threads.append({
                "id": message_id,
                "message_id": message_id,
                "sender_id": sender_id,
                "recipient_id": recipient_id,
                "context_id": context_id,
                "subject": subject,
                "content": content
            })

        if message_threads:
            return make_response(message_threads, 200)
        else:
            response = make_response({
            "error": "Message thread not found"
            }, 404)
            return response

api.add_resource(OwnerMessages, "/messages/<int:owner_id>/")

class SendMessage(Resource):
    def post(self):
        data = request.get_json()
        #try Validations:

        new_message = Message(
            recipient_id = data['recipient_id'],
            sender_id = data['sender_id'],
            context_id = data['context_id'],
            subject = data['subject'],
            content = data['content'],
            message_status = data['message_status'],
            created_on = datetime.utcnow()
        )

        db.session.add(new_message)

        db.session.commit()

        response = make_response(new_message.to_dict(), 201)

        return response

        #except ValueError ()

api.add_resource(SendMessage, "/messages")

class EditMessage(Resource):
    def patch(self, id):
        message = RentalAgreement.query.filter(RentalAgreement.id == id).first()

        if message:
            data = request.get_json()
            for key in data:
                setattr(message, key, data[key])
            db.session.add(message)
            db.session.commit()
            response = make_response(message.to_dict(), 202)
            return response
        else:
            response = make_response({
            "error": "Message not found"
            }, 404)
            return response
api.add_resource(EditMessage, '/message/<int:id>')

class NewThread(Resource):
    def post(self):
        data = request.getjson()

        #try Validations:
        new_inbox = Inbox(
            user_id = data['user_id'],
            owner_id = data['owner_id'],
            message_id = data['message_id'],
        )

        db.session.add(new_inbox)

        db.session.commit()

        response = make_response(new_inbox.to_dict(), 201)

        return response
        #except ValueError ()

api.add_resource(NewThread, '/inbox')


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