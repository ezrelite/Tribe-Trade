from django.urls import path
from .views import InstitutionListView, CampusLocationListView, CouncilStatsView, CouncilDataPurgeView

urlpatterns = [
    path('institutions/', InstitutionListView.as_view(), name='institution-list'),
    path('campuses/', CampusLocationListView.as_view(), name='campus-list'),
    path('council-stats/', CouncilStatsView.as_view(), name='council-stats'),
    path('council-purge/', CouncilDataPurgeView.as_view(), name='council-purge'),
]
