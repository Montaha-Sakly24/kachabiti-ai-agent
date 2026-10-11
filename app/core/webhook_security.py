import hashlib
import hmac

from app.core.config import META_APP_SECRET


def verify_signature(payload_body: bytes, signature_header: str | None) -> bool:
    if not signature_header or not signature_header.startswith("sha256="):
        return False

    expected = hmac.new(
        META_APP_SECRET.encode(),
        payload_body,
        hashlib.sha256,
    ).hexdigest()

    received = signature_header.split("sha256=", 1)[1]
    return hmac.compare_digest(expected, received)