from ninja_extra import NinjaExtraAPI

api = NinjaExtraAPI(urls_namespace="myapi")

api.add_router("auth", "authentication.api.router", tags=["Authentication"])