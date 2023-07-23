from django.db import models
import random
# Create your models here.
class RoomNumber(models.Model):
    roomCode = models.IntegerField(null=True)
    usersConnected = models.IntegerField(default=0)

    def __str__(self):
        return str(self.id)
