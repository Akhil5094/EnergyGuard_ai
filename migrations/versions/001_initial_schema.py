"""Initial schema for EnergyGuard AI

Revision ID: 001_initial
Revises: 
Create Date: 2026-10-29 07:15:00.000000

"""
from alembic import op
import sqlalchemy as sa

revision = '001_initial'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    op.create_table(
        'factories',
        sa.Column('id', sa.String(), primary_key=True),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('location', sa.String()),
        sa.Column('timezone', sa.String(), server_default='Asia/Kolkata'),
        sa.Column('electricity_tariff', sa.Float(), server_default='9.5'),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now())
    )

    op.create_table(
        'users',
        sa.Column('id', sa.String(), primary_key=True),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('email', sa.String(), unique=True, nullable=False),
        sa.Column('password_hash', sa.String(), nullable=False),
        sa.Column('role', sa.String(), server_default='operator'),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now())
    )

    op.create_table(
        'machines',
        sa.Column('id', sa.String(), primary_key=True),
        sa.Column('factory_id', sa.String(), sa.ForeignKey('factories.id')),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('machine_type', sa.String(), nullable=False),
        sa.Column('location', sa.String()),
        sa.Column('rated_power_kw', sa.Float(), nullable=False),
        sa.Column('status', sa.String(), server_default='running'),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now())
    )

    op.create_table(
        'iot_devices',
        sa.Column('id', sa.String(), primary_key=True),
        sa.Column('device_id', sa.String(), unique=True, nullable=False),
        sa.Column('machine_id', sa.String(), sa.ForeignKey('machines.id')),
        sa.Column('mqtt_topic', sa.String(), nullable=False),
        sa.Column('firmware_version', sa.String(), server_default='v1.4.2'),
        sa.Column('connection_status', sa.String(), server_default='connected'),
        sa.Column('last_seen', sa.DateTime(), server_default=sa.func.now())
    )

    op.create_table(
        'energy_readings',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('machine_id', sa.String(), sa.ForeignKey('machines.id'), index=True),
        sa.Column('device_id', sa.String(), index=True),
        sa.Column('timestamp', sa.DateTime(), server_default=sa.func.now(), index=True),
        sa.Column('voltage_v', sa.Float(), nullable=False),
        sa.Column('current_a', sa.Float(), nullable=False),
        sa.Column('power_factor', sa.Float(), server_default='0.92'),
        sa.Column('power_kw', sa.Float(), nullable=False),
        sa.Column('energy_kwh', sa.Float(), nullable=False),
        sa.Column('operating_status', sa.String(), server_default='running'),
        sa.Column('source', sa.String(), server_default='edge_iot')
    )

    op.create_table(
        'alerts',
        sa.Column('id', sa.String(), primary_key=True),
        sa.Column('factory_id', sa.String(), sa.ForeignKey('factories.id')),
        sa.Column('machine_id', sa.String(), sa.ForeignKey('machines.id')),
        sa.Column('alert_type', sa.String(), nullable=False),
        sa.Column('severity', sa.String(), server_default='warning'),
        sa.Column('title', sa.String(), nullable=False),
        sa.Column('description', sa.String()),
        sa.Column('triggered_value', sa.String()),
        sa.Column('threshold', sa.String()),
        sa.Column('status', sa.String(), server_default='active'),
        sa.Column('timestamp', sa.DateTime(), server_default=sa.func.now()),
        sa.Column('resolution_notes', sa.String(), nullable=True)
    )

def downgrade():
    op.drop_table('alerts')
    op.drop_table('energy_readings')
    op.drop_table('iot_devices')
    op.drop_table('machines')
    op.drop_table('users')
    op.drop_table('factories')
