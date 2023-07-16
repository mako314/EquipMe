from models import db, UserRenter, EquipmentOwner, Equipment, RentalAgreement
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

class UserRenters(Resource):
    def get(self):
        pass

api.add_resource(UserRenters, '/renters')

#Display all Owners of Equipment who list their stuff to rent, users should be able to click the Owner and get taken to their page with all their equipment
class EquipmentOwners(Resource):
    def get(self):
        equip_owners = [owner.to_dict() for owner in EquipmentOwner.query.all()]

        response = make_response(equip_owners, 200)
        #rules =('-agreements', 'equipment')

        return response

api.add_resource(EquipmentOwners, '/equipment_owners')

#this can either be ID or name,
class EquipmentOwnersById(Resource):
    pass
api.add_resource(EquipmentOwnersById, '/equipment_owners/<int:id>')
#Display all Equipment, whether available or not, this route should display all the equipment available on the website.
class Equipments(Resource):
    def get(self):
        equipment = [equipment.to_dict() for equipment in Equipment.query.all()]

        response = make_response(equipment, 200)

        return response
    
    #NEED TO UPDATE FOR VALIDATIONS
    def post(self):
        data = request.get_json()
#name = db.Column(db.String)
#type = db.Column(db.String)
#make = db.Column(db.String)
#model = db.Column(db.String)
#owner_name = db.Column(db.String)
#location = db.Column(db.String)
#availability = db.Column(db.Boolean)
#delivery = db.Column(db.Boolean)
#quantity = db.Column(db.Integer)
        #try:
        new_equipment = Equipment(
            name = data['name'],
            type = data['type'],
            make = data['make'],
            model = data['model'],
            owner_name = data['owner_name'],
            location = data['location']
            availability = data['availability'],
            delivery = data['delivery'],
            quantity = data['quantity']
        )
        db.session.add(new_equipment)
        db.session.commit()

        response = make_response(new_equipment.to_dict(), 201)

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
            response = make_response(" We don't support this Equipment quite yet", 404)
            return response
        
        #need to find a way to make all the types easily inputtable, for example Heavy Machinery doesn't get picked up if you do /heavymachinery

api.add_resource(EquipmentByType, '/equipment/<string:type>')
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