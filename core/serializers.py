from rest_framework import serializers
from .models import Institution, CampusLocation

class CampusLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = CampusLocation
        fields = ('id', 'institution', 'name')

class InstitutionSerializer(serializers.ModelSerializer):
    locations = CampusLocationSerializer(many=True, read_only=True)

    class Meta:
        model = Institution
        fields = ('id', 'name', 'slug', 'inst_type', 'inst_category', 'locations')
