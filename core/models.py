from django.db import models

class Institution(models.Model):
    TYPE_CHOICES = [
        ('university', 'University'),
        ('polytechnic', 'Polytechnic'),
        ('college_of_education', 'College of Education'),
    ]
    
    CATEGORY_CHOICES = [
        ('federal', 'Federal'),
        ('state', 'State'),
        ('private', 'Private'),
    ]

    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    inst_type = models.CharField(max_length=50, choices=TYPE_CHOICES, default='university')
    inst_category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='federal')

    def __str__(self):
        return f"{self.name} ({self.get_inst_type_display()} - {self.get_inst_category_display()})"

class CampusLocation(models.Model):
    institution = models.ForeignKey(Institution, on_delete=models.CASCADE, related_name='locations')
    name = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.name} ({self.institution.name})"
