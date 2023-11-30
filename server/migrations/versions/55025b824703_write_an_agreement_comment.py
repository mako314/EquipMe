"""write an agreement comment

Revision ID: 55025b824703
Revises: bbae0bcbab80
Create Date: 2023-11-30 15:39:01.351339

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '55025b824703'
down_revision = 'bbae0bcbab80'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('agreement_comments',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('comment', sa.String(), nullable=True),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('owner_id', sa.Integer(), nullable=True),
    sa.Column('agreement_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['agreement_id'], ['agreements.id'], name=op.f('fk_agreement_comments_agreement_id_agreements')),
    sa.ForeignKeyConstraint(['owner_id'], ['owners.id'], name=op.f('fk_agreement_comments_owner_id_owners')),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], name=op.f('fk_agreement_comments_user_id_users')),
    sa.PrimaryKeyConstraint('id')
    )
    with op.batch_alter_table('agreements', schema=None) as batch_op:
        batch_op.add_column(sa.Column('delivery', sa.String(), nullable=True))
        batch_op.add_column(sa.Column('delivery_address', sa.String(), nullable=True))
        batch_op.add_column(sa.Column('user_decision', sa.String(), nullable=True))
        batch_op.add_column(sa.Column('owner_decision', sa.String(), nullable=True))
        batch_op.add_column(sa.Column('revisions', sa.Integer(), nullable=True))
        batch_op.add_column(sa.Column('agreement_status', sa.String(), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('agreements', schema=None) as batch_op:
        batch_op.drop_column('agreement_status')
        batch_op.drop_column('revisions')
        batch_op.drop_column('owner_decision')
        batch_op.drop_column('user_decision')
        batch_op.drop_column('delivery_address')
        batch_op.drop_column('delivery')

    op.drop_table('agreement_comments')
    # ### end Alembic commands ###
