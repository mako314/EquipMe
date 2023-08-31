from models import db, User, EquipmentOwner, Equipment, RentalAgreement

def is_available_for_date_range(equipment, start_date, end_date):
    existing_agreements = db.session.query(RentalAgreement).filter(
        RentalAgreement.equipment == equipment,
        # Check for overlapping date ranges
        RentalAgreement.rental_dates.overlaps(f"{start_date} to {end_date}")
    ).all()
    
    return len(existing_agreements) == 0
