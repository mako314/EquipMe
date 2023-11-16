"""<remake rental agreements>

Revision ID: 9bebe2b5a60b
Revises: 8a3ca98d81cb
Create Date: 2023-11-15 17:09:45.305556

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '9bebe2b5a60b'
down_revision = '8a3ca98d81cb'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('agreements', schema=None) as batch_op:
        batch_op.add_column(sa.Column('rental_start_date', sa.String(), nullable=True))
        batch_op.add_column(sa.Column('rental_end_date', sa.String(), nullable=True))
        batch_op.add_column(sa.Column('cart_item_id', sa.Integer(), nullable=True))
        batch_op.drop_constraint('fk_agreements_equipment_id_equipments', type_='foreignkey')
        batch_op.create_foreign_key(batch_op.f('fk_agreements_cart_item_id_cart_items'), 'cart_items', ['cart_item_id'], ['id'])
        batch_op.drop_column('total_price')
        batch_op.drop_column('location')
        batch_op.drop_column('rental_dates')
        batch_op.drop_column('equipment_id')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('agreements', schema=None) as batch_op:
        batch_op.add_column(sa.Column('equipment_id', sa.INTEGER(), nullable=True))
        batch_op.add_column(sa.Column('rental_dates', sa.VARCHAR(), nullable=True))
        batch_op.add_column(sa.Column('location', sa.VARCHAR(), nullable=True))
        batch_op.add_column(sa.Column('total_price', sa.INTEGER(), nullable=True))
        batch_op.drop_constraint(batch_op.f('fk_agreements_cart_item_id_cart_items'), type_='foreignkey')
        batch_op.create_foreign_key('fk_agreements_equipment_id_equipments', 'equipments', ['equipment_id'], ['id'])
        batch_op.drop_column('cart_item_id')
        batch_op.drop_column('rental_end_date')
        batch_op.drop_column('rental_start_date')

    # ### end Alembic commands ###
