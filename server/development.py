from dotenv import load_dotenv
load_dotenv('../.env.local')

from app import app
app.run()