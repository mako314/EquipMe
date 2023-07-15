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

class EquipmentOwners(Resource):
    def get(self):
        equip_owners = [owner.to_dict() for owner in EquipmentOwner.query.all()]

        response = make_response(equip_owners, 200)
        #rules =('-agreements', 'equipment')
        
        return response

api.add_resource(EquipmentOwners, '/equipment_owners')
if __name__ == '__main__':
    app.run(port=5555, debug=True)