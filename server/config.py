from flask import Flask
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Api
from sqlalchemy import MetaData
from dotenv import load_dotenv
from flask_jwt_extended import JWTManager
from datetime import timedelta
import os

app = Flask(__name__)

app.secret_key = "TESTING123456789" # signature for Flask session

# app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URI') # Pretty sure this allows to connect to gunicorn, mispelling maybe but whatever is hosting.
# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'


# load_dotenv()
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URI')
print("Database URI:", os.getenv('DATABASE_URI'))

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False

metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})
db = SQLAlchemy(metadata=metadata)

db.init_app(app)
migrate = Migrate(app, db)
api = Api(app)

bcrypt = Bcrypt(app) # allows for encryption/hashing

#Time to manage cookies, yum.
# locations – A location or list of locations to look for the JWT in this request, for example 'headers' or ['headers', 'cookies']. Defaults to None which indicates that JWTs will be looked for in the locations defined by the JWT_TOKEN_LOCATION configuration option.
# https://flask-jwt-extended.readthedocs.io/en/stable/api.html#flask_jwt_extended.jwt_required
# https://flask-jwt-extended.readthedocs.io/en/stable/token_locations.html#cookies
app.config["JWT_COOKIE_SECURE"] = True
app.config['JWT_SECRET_KEY'] = os.environ['JWT_SECRET_KEY']
app.config['JWT_TOKEN_LOCATION'] = ['cookies']
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
jwt = JWTManager(app)

CORS(app, supports_credentials=True)
