"""<new equipment image table>

Revision ID: 90665df0264f
Revises: b31fdcc5f252
Create Date: 2023-09-04 18:52:04.096769

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '90665df0264f'
down_revision = 'b31fdcc5f252'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('equipment_images',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('imageURL', sa.String(), nullable=True),
    sa.Column('equipment_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['equipment_id'], ['equipments.id'], name=op.f('fk_equipment_images_equipment_id_equipments')),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('equipment_images')
    # ### end Alembic commands ###