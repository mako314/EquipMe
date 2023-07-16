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
#1. Individual Equipment page
#2. Rental Owner Page (So the rental owners own page with all their rental listings)
#3. See All Rentals (Equipment)
#4. See All owners (Owners)
#5. Search / Filter rental by type / name / owner
#6. See all Rentals
#7. Checkout a rental
#8. Post a Rental, 
#9. Take a rental ? (Rental Agreement?)