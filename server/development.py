from dotenv import load_dotenv


load_dotenv('../.env.local')

# from seeds import seed_database

from app import app

# def run_seeding():
#     print("Seeding database...")
#     with app.app_context():
#         seed_database()

# run_seeding()
app.run(port=5555, debug=True)


# Just run 
# export JWT_SECRET_KEY=
# export DATABASE_URI=sqlite:///app.db

# If there's previous data and you have a non-nullable value, you'll likely need to clear all the data in seed first.
# for some reason I had to re-upgrade the db for this to work, so just remember flask db init and all those steps.
# Use this to seed if it goes nuclear like it did before. You may not even need the run_seeding()