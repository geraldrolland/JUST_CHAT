# Generated by Django 4.2.6 on 2024-10-28 21:56

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('justChat_api', '0008_alter_group_group_id_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='group',
            name='group_id',
            field=models.CharField(default='<function uuid4 at 0x000001E19595A7A0>', editable=False, max_length=124, primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='isgroupadmin',
            name='is_group_admin_id',
            field=models.CharField(default='<function uuid4 at 0x000001E19595A7A0>', editable=False, max_length=124, primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='message',
            name='message_id',
            field=models.CharField(default=uuid.uuid4, editable=False, max_length=124, primary_key=True, serialize=False),
        ),
    ]