from django.apps import AppConfig

class BackappConfig(AppConfig):
    name = 'backapp'

    def ready(self):
        import backapp.signals
