from flask import Flask
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Api
from sqlalchemy import MetaData
from dotenv import load_dotenv
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

CORS(app)
