"""add stripe id to owners

Revision ID: e6208129bfa8
Revises: e692abaa9be7
Create Date: 2024-01-04 23:31:49.865027

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'e6208129bfa8'
down_revision = 'e692abaa9be7'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('owners', schema=None) as batch_op:
        batch_op.add_column(sa.Column('stripe_id', sa.String(), nullable=True))
        batch_op.create_unique_constraint('uq_owners_stripe_id', ['stripe_id'])
        batch_op.drop_column('age')

    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.drop_column('age')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.add_column(sa.Column('age', sa.INTEGER(), nullable=True))

    with op.batch_alter_table('owners', schema=None) as batch_op:
        batch_op.add_column(sa.Column('age', sa.INTEGER(), nullable=True))
        batch_op.drop_constraint('uq_owners_stripe_id', type_='unique')
        batch_op.drop_column('stripe_id')

    # ### end Alembic commands ###