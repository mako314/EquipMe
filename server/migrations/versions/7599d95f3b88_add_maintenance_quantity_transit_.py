"""add maintenance quantity, transit quantity, and damaged quantity to history and summary

Revision ID: 7599d95f3b88
Revises: 471140720df2
Create Date: 2023-12-19 13:02:01.135812

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '7599d95f3b88'
down_revision = '471140720df2'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('equipment_state_history', schema=None) as batch_op:
        batch_op.add_column(sa.Column('maintenance_quantity', sa.Integer(), nullable=True))
        batch_op.add_column(sa.Column('transit_quantity', sa.Integer(), nullable=True))
        batch_op.add_column(sa.Column('damaged_quantity', sa.Integer(), nullable=True))

    with op.batch_alter_table('equipment_state_summaries', schema=None) as batch_op:
        batch_op.add_column(sa.Column('total_maintenance_quantity', sa.Integer(), nullable=True))
        batch_op.add_column(sa.Column('total_transit_quantity', sa.Integer(), nullable=True))

    with op.batch_alter_table('equipment_status', schema=None) as batch_op:
        batch_op.add_column(sa.Column('transit_quantity', sa.Integer(), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('equipment_status', schema=None) as batch_op:
        batch_op.drop_column('transit_quantity')

    with op.batch_alter_table('equipment_state_summaries', schema=None) as batch_op:
        batch_op.drop_column('total_transit_quantity')
        batch_op.drop_column('total_maintenance_quantity')

    with op.batch_alter_table('equipment_state_history', schema=None) as batch_op:
        batch_op.drop_column('damaged_quantity')
        batch_op.drop_column('transit_quantity')
        batch_op.drop_column('maintenance_quantity')

    # ### end Alembic commands ###