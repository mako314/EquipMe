"""add order history table

Revision ID: b198f1e8329c
Revises: 98b6793504a8
Create Date: 2024-01-06 12:45:53.669732

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'b198f1e8329c'
down_revision = '98b6793504a8'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('order_history',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('order_datetime', sa.DateTime(), nullable=True),
    sa.Column('total_amount', sa.Integer(), nullable=True),
    sa.Column('payment_status', sa.String(length=50), nullable=True),
    sa.Column('payment_method', sa.String(length=50), nullable=True),
    sa.Column('order_status', sa.String(length=50), nullable=True),
    sa.Column('delivery_address', sa.String(), nullable=True),
    sa.Column('order_details', sa.String(), nullable=True),
    sa.Column('estimated_delivery_date', sa.DateTime(), nullable=True),
    sa.Column('actual_delivery_date', sa.DateTime(), nullable=True),
    sa.Column('cancellation_date', sa.DateTime(), nullable=True),
    sa.Column('return_date', sa.DateTime(), nullable=True),
    sa.Column('actual_return_date', sa.DateTime(), nullable=True),
    sa.Column('notes', sa.String(), nullable=True),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('owner_id', sa.Integer(), nullable=True),
    sa.Column('equipment_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['equipment_id'], ['equipments.id'], name=op.f('fk_order_history_equipment_id_equipments')),
    sa.ForeignKeyConstraint(['owner_id'], ['owners.id'], name=op.f('fk_order_history_owner_id_owners')),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], name=op.f('fk_order_history_user_id_users')),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('order_history')
    # ### end Alembic commands ###
