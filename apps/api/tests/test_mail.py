from app.services.mail import mail_backend, mail_configured, send_mail, send_mail_batch


def test_mail_stays_off_without_smtp_or_resend(monkeypatch) -> None:
    from app.config import settings

    monkeypatch.setattr(settings, "SMTP_HOST", "")
    monkeypatch.setattr(settings, "RESEND_API_KEY", "")
    assert mail_configured() is False
    assert mail_backend() == "off"
    assert send_mail(to="a@poly.ac.ke", subject="Test", body="Hi") is False
    assert send_mail_batch(to=["a@poly.ac.ke"], subject="Test", body="Hi") == 0


def test_resend_sends_when_key_is_set(monkeypatch) -> None:
    from app.config import settings
    from app.services import mail

    monkeypatch.setattr(settings, "SMTP_HOST", "")
    monkeypatch.setattr(settings, "RESEND_API_KEY", "re_test_key")
    monkeypatch.setattr(settings, "SMTP_FROM", "Empower <noreply@empower.test>")

    class FakeResponse:
        is_success = True
        status_code = 200

    def fake_post(url, **kwargs):
        assert url == mail.RESEND_URL
        assert kwargs["headers"]["Authorization"] == "Bearer re_test_key"
        assert kwargs["json"]["to"] == ["amina@poly.ac.ke"]
        return FakeResponse()

    monkeypatch.setattr(mail.httpx, "post", fake_post)
    assert mail_backend() == "resend"
    assert send_mail(to="amina@poly.ac.ke", subject="Reset", body="code 123") is True
