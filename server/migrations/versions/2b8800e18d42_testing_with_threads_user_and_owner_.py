"""<testing with threads, user and owner inboxes>

Revision ID: 2b8800e18d42
Revises: 8edbf577e6cf
Create Date: 2023-10-23 18:13:02.189474

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '2b8800e18d42'
down_revision = '8edbf577e6cf'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('threads',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('subject', sa.String(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('owner_inboxes',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('owner_id', sa.Integer(), nullable=True),
    sa.Column('thread_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['owner_id'], ['owners.id'], name=op.f('fk_owner_inboxes_owner_id_owners')),
    sa.ForeignKeyConstraint(['thread_id'], ['threads.id'], name=op.f('fk_owner_inboxes_thread_id_threads')),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('user_inboxes',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('thread_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['thread_id'], ['threads.id'], name=op.f('fk_user_inboxes_thread_id_threads')),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], name=op.f('fk_user_inboxes_user_id_users')),
    sa.PrimaryKeyConstraint('id')
    )
    op.drop_table('inboxes')
    with op.batch_alter_table('messages', schema=None) as batch_op:
        batch_op.add_column(sa.Column('thread_id', sa.Integer(), nullable=True))
        batch_op.create_foreign_key(batch_op.f('fk_messages_thread_id_threads'), 'threads', ['thread_id'], ['id'])
        batch_op.drop_column('subject')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('messages', schema=None) as batch_op:
        batch_op.add_column(sa.Column('subject', sa.VARCHAR(), nullable=True))
        batch_op.drop_constraint(batch_op.f('fk_messages_thread_id_threads'), type_='foreignkey')
        batch_op.drop_column('thread_id')

    op.create_table('inboxes',
    sa.Column('id', sa.INTEGER(), nullable=False),
    sa.Column('user_id', sa.INTEGER(), nullable=True),
    sa.Column('owner_id', sa.INTEGER(), nullable=True),
    sa.Column('message_id', sa.INTEGER(), nullable=True),
    sa.ForeignKeyConstraint(['message_id'], ['messages.id'], name='fk_inboxes_message_id_messages'),
    sa.ForeignKeyConstraint(['owner_id'], ['owners.id'], name='fk_inboxes_owner_id_owners'),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], name='fk_inboxes_user_id_users'),
    sa.PrimaryKeyConstraint('id')
    )
    op.drop_table('user_inboxes')
    op.drop_table('owner_inboxes')
    op.drop_table('threads')
    # ### end Alembic commands ###
