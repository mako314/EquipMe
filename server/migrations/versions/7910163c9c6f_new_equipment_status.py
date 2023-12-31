"""new equipment status

Revision ID: 7910163c9c6f
Revises: 7c4641194d0e
Create Date: 2023-12-15 16:37:48.584406

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '7910163c9c6f'
down_revision = '7c4641194d0e'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('equipment_status',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('equipment_id', sa.Integer(), nullable=True),
    sa.Column('current_quantity', sa.Integer(), nullable=True),
    sa.Column('reserved_quantity', sa.Integer(), nullable=True),
    sa.Column('maintenance_quantity', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['equipment_id'], ['equipments.id'], name=op.f('fk_equipment_status_equipment_id_equipments')),
    sa.PrimaryKeyConstraint('id')
    )
    with op.batch_alter_table('equipment_state_summaries', schema=None) as batch_op:
        batch_op.add_column(sa.Column('total_reserved', sa.Integer(), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('equipment_state_summaries', schema=None) as batch_op:
        batch_op.drop_column('total_reserved')

    op.drop_table('equipment_status')
    # ### end Alembic commands ###
