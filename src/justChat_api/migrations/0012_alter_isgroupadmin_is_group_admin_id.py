# Generated by Django 4.2.6 on 2024-10-28 22:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('justChat_api', '0011_alter_isgroupadmin_is_group_admin_id_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='isgroupadmin',
            name='is_group_admin_id',
            field=models.CharField(default='<function uuid4 at 0x000002FB89EEA7A0>', editable=False, max_length=124, primary_key=True, serialize=False),
        ),
    ]