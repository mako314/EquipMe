from datetime import date

# def is_available_for_date_range(equipment, start_date, end_date):
      #from models import db, User, EquipmentOwner, Equipment, RentalAgreement
#     existing_agreements = db.session.query(RentalAgreement).filter(
#         RentalAgreement.equipment == equipment,
#         # Check for overlapping date ranges
#         RentalAgreement.rental_dates.overlaps(f"{start_date} to {end_date}")
#     ).all()
    
#     return len(existing_agreements) == 0

def calculate_age(dob):
    if dob is None:
        return None  # Or handle how you prefer if DOB is not set
    today = date.today()
    return today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))