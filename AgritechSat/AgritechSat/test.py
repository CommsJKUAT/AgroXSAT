import os
from dotenv import load_dotenv
import dj_database_url

load_dotenv()
print(os.getenv("DATABASECREDS"))
