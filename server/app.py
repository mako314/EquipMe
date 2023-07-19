from models import db, UserRenter, EquipmentOwner, Equipment, RentalAgreement
from flask_cors import CORS
from flask_migrate import Migrate
from flask import Flask, request, make_response, jsonify
from flask_restful import Api, Resource
import os

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DATABASE = os.environ.get(
    "DB_URI", f"sqlite:///{os.path.join(BASE_DIR, 'app.db')}")

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False


migrate = Migrate(app, db)

db.init_app(app)
api = Api(app)
CORS(app)
#------------------------------------------------------USER RENTER CLASSES----------------------------------------------------------

class UserRenters(Resource):
    
    #post to users, DONE, unsure if i want to be able to see all users..
    def post(self):
        data = request.get_json()
        #try
        #need a way to attach to rental agreement
        new_user = UserRenter(
            name = data['name'],
            age = data['age'],
            location = data['location'],
            profession = data['profession'],
            phone = data['phone'],
            email = data['email']
        )

        db.session.add(new_user)
        db.session.commit()

        response = make_response(new_user.to_dict(), 201)
        return response

        #except ValueError: 
        # NEED TO WRITE VALIDATIONS
api.add_resource(UserRenters, '/renters')


class UserByID(Resource):

    #get one user by ID, may not even be necessary
    def get(self, id):
        user = UserRenter.query.filter(UserRenter.id == id).first()

        if user:
            return make_response(user.to_dict(),200)
        else:
            response = make_response({
            "error": "User not found"
            }, 404)
            return response
        
    #PATCH USER DONE
    def patch(self, id):
        user = UserRenter.query.filter(UserRenter.id == id).first()
        if user:
            #try FOR VALIDATION
            data = request.get_json()
            for key in data:
                setattr(user, key, data[key])
            db.session.add(user)
            db.session.commit()

            response = make_response(user.to_dict(), 202)
            return response
            #except ValueError:
        else:
            response = make_response({
            "error": "User not found"
            }, 404)
            return response
        
    #DELETE USER -- OPERATIONAL, WOULD LIKE TO RETURN A MESSAGE
    def delete(self,id):
        user = UserRenter.query.filter(UserRenter.id == id).first()
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
        equip_owners = [owner.to_dict(only = ('id', 'email', 'location', 'name', 'phone','equipment')) for owner in EquipmentOwner.query.all()]

        response = make_response(equip_owners, 200)
        #rules =('-agreements', 'equipment')

        return response
    
    #POST EQUIPMENT OWNERS -- DONE
    def post(self):
        data = request.get_json()
        #try:
        new_owner = EquipmentOwner(
            name = data['name'],
            location = data['location'],
            profession = data['profession'],
            phone = data['phone'],
            email = data['email']
        )
        db.session.add(new_owner)
        db.session.commit()

        response = make_response(new_owner.to_dict(), 201)
        return response

        #except ValueError: 
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
            #try
            data = request.get_json()
            for key in data:
                setattr(equip_owner, key, data[key])
            db.session.add(equip_owner)
            db.session.commit()

            response = make_response(equip_owner.to_dict(), 202)
            return response
            #except ValueError:
        else:
            response = make_response({
            "error": "Owner not found"
            }, 404)
            return response
        
    #DELETE OWNER by ID -- DONE
    def delete(self, id):
        equip_owner = EquipmentOwner.query.filter(EquipmentOwner.id == id).first()
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
            only =('id','model','name','make','location')
        ) for equipment in Equipment.query.all()]

        response = make_response(equipment, 200)

        return response
    
    #POST EQUIPMENT, DONE
    #NEED TO UPDATE FOR VALIDATIONS
    def post(self):
        data = request.get_json()
        #try:
        #need a way to input, owner_id and owner maybe a 2 step process?
        new_equipment = Equipment(
            name = data['name'],
            type = data['type'],
            make = data['make'],
            model = data['model'],
            owner_name = data['owner_name'],
            phone = data['phone'],
            email = data['email'],
            location = data['location'],
            availability = data['availability'],
            delivery = data['delivery'],
            quantity = data['quantity']
        )
        db.session.add(new_equipment)
        db.session.commit()

        response = make_response(new_equipment.to_dict(), 201)
        return response

        #except ValueError: 
        # NEED TO WRITE VALIDATIONS

api.add_resource(Equipments, '/equipment')

#Search and or filter by Equipment type, i.e. Heavy Machinery or painting
class EquipmentByType(Resource):

    def get(self,type):
        type_test = Equipment.query.filter(Equipment.type == type).all()
        if type_test:
            equipment = [equipment.to_dict() for equipment in Equipment.query.filter(Equipment.type == type).all()]
            response = make_response(equipment, 200)
            return response
        else:
            response = make_response({
            "error": "Equipment type not supported yet"
            }, 404)
            return response
        
        #need to find a way to make all the types easily inputtable, for example Heavy Machinery doesn't get picked up if you do /heavymachinery

api.add_resource(EquipmentByType, '/equipment/<string:type>')

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
            #try:
            #going to need try and except if and when we do validations
            data = request.get_json()
            for key in data:
                setattr(equipment, key, data[key])
            db.session.add(equipment)
            db.session.commit()

            response = make_response(equipment.to_dict(), 202)
            return response
            #except ValueError:
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
            owners = Equipment.query.filter(Equipment.owner_id == id).all()
            for owner in owners:
                db.session.delete(owner)
            #This should take care of excess stuff, need to inquire about deleting 
            db.session.delete(equipment)

            db.session.commit()
            #how do I input succesfully delete into the {}?
            response = make_response({"message":"Succesfully deleted!"}, 204)
            return response
        else:
            response = make_response({
            "error": "Equipment not found"
            }, 404)
            return response
        
api.add_resource(EquipmentByID, '/equipment/<int:id>')


#-----------------------------------------------Rental Agreement Classes-----------------------------------------------------------------------------
#Rental agreements, need a post and a patch
class RentalAgreements(Resource):
    #Get ALL rental agreements
    #list of all the renters and the equipment
    def get(self):
        agreements = [agreement.to_dict( only = ('equipment','renter','rental_dates')) for agreement in RentalAgreement.query.all()]

        response = make_response(agreements, 200)

        return response
    
    #post a rental agreement
    def post(self):
        data = request.get_json()
        #try:

        #need a way to grab equipment and owner
        # load category and then from there display 
        #take the input

        #may need a way to write in validations
        new_rental_agreement = RentalAgreement(
            location = data['location'],
            total_price = data['total_price'],
            rental_dates = data['rental_dates'],
            renter_id = data['renter_id'],
            equipment_id = data['equipment_id']
        )

        db.session.add(new_rental_agreement)
        db.session.commit()

        response = make_response(new_rental_agreement.to_dict(), 201)
        return response


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