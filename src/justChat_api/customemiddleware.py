import redis
from datetime import datetime
from django.http import HttpResponseForbidden, JsonResponse

from rest_framework import status

def IpLimiterMiddleware(get_response):
    def ip_limiter (request):
        r = redis.Redis()
        ip = request.META.get("HTTP_X_FORWARDED_FOR")
        if ip:
            ip = ip.split(",")[0]
        else:
            ip = request.META.get("REMOTE_ADDR")
        ip_rate_time = datetime.now()
        ip_addr = f"{ip}: rate per second{ip_rate_time.second}"
        num_of_req_in_1s = r.incrby(ip_addr, 1)
        if num_of_req_in_1s > 3:
             r.sadd("ip_blacklists", ip_addr)
             return JsonResponse({"error": "forbidden request"}, status=status.HTTP_403_FORBIDDEN)
        return get_response(request)
    return ip_limiter