from django.test import TestCase
from ninja_extra.testing import TestClient
from ninja_jwt.tokens import RefreshToken
import pytest

from authentication.api import router
from authentication.models import User


class TestRegistrationEndpoint(TestCase):
    def setUp(self):
        self.client = TestClient(router)
        self.existing_user = User.objects.create_user(username='JohnDoe123', email='johndoe@gmail.com', password='JohnDoe@!3')

    @pytest.mark.django_db
    def test_register_success(self):
        """Test successful registration with valid data"""

        # Arrange
        payload = {
            'username': 'AliceSmith',
            'email': 'alice@gmail.com',
            'password': 'Alice@1234',
            'confirm_password': 'Alice@1234'
        }

        # Act
        response = self.client.post('/register', json=payload)

        # Assert
        assert response.status_code == 201
        assert response.json()['username'] == 'AliceSmith'
        assert response.json()['email'] == 'alice@gmail.com'


    @pytest.mark.django_db
    def test_register_with_duplicate_email(self):
        """Test registration with already existing email"""

        # Arrange
        payload = {
            'username': 'NewUser',
            'email': 'johndoe@gmail.com',
            'password': 'NewUser@123',
            'confirm_password': 'NewUser@123'
        }

        # Act
        response = self.client.post('/register', json=payload)

        # Assert
        assert response.status_code == 400
        assert response.json()['message'] == 'Email is already registered.'


    @pytest.mark.django_db
    def test_register_with_duplicate_username(self):
        """Test registration with already existing username"""

        # Arrange
        payload = {
            'username': 'JohnDoe123',
            'email': 'newuser@gmail.com',
            'password': 'NewUser@123',
            'confirm_password': 'NewUser@123'
        }

        # Act
        response = self.client.post('/register', json=payload)

        # Assert
        assert response.status_code == 400
        assert response.json()['message'] == 'Username is already registered.'


    @pytest.mark.django_db
    def test_register_with_password_mismatch(self):
        """Test registration with mismatched passwords"""

        # Arrange
        payload = {
            'username': 'MismatchUser',
            'email': 'mismatch@gmail.com',
            'password': 'Mismatch@123',
            'confirm_password': 'Mismatch@124'
        }

        # Act
        response = self.client.post('/register', json=payload)

        # Assert
        assert response.status_code == 400
        assert response.json()['message'] == 'Passwords do not match.'


    @pytest.mark.django_db
    def test_register_with_invalid_email_format(self):
        """Test register with missing @-sign in the email address"""

        # Arrange
        payload = {
            'username': 'InvalidEmailUser',
            'email': 'invalid-email',
            'password': 'ValidPass@123',
            'confirm_password': 'ValidPass@123'
        }

        # Act
        response = self.client.post('/register', json=payload)

        # Assert
        assert response.status_code == 422
        assert response.json()['detail'][0]['msg'] == 'value is not a valid email address: An email address must have an @-sign.'


    @pytest.mark.django_db
    def test_register_invalid_email_missing_period_in_domain(self):
        """Test register with missing period in the email domain"""

        # Arrange
        payload = {
            'username': 'AliceSmith21',
            'email': 'alicesmith21@gmailcom',
            'password': 'Alice123$',
            'role': 'TEACHER'
        }

        # Act
        response = self.client.post('/register', json=payload)

        # Assert
        assert response.status_code == 422
        assert response.json()['detail'][0]['msg'] == 'value is not a valid email address: The part after the @-sign is not valid. It should have a period.'


    @pytest.mark.django_db
    def test_register_invalid_password_missing_uppercase_letter(self):
        """Test register with missing uppercase letter in password"""

        # Arrange
        payload = {
            'username': 'AliceSmith21',
            'email': 'alicesmith21@gmail.com',
            'password': 'alice123$',
            'role': 'TEACHER'
        }

        # Act
        response = self.client.post('/register', json=payload)

        # Assert
        assert response.status_code == 422
        assert response.json()['detail'][0]['msg'] == 'Value error, Password must contain at least one uppercase letter.'


    @pytest.mark.django_db
    def test_register_invalid_password_missing_lowercase_letter(self):
        """Test register with missing uppercase letter in password"""

        # Arrange
        payload = {
            'username': 'AliceSmith21',
            'email': 'alicesmith21@gmail.com',
            'password': 'alice123$',
            'role': 'TEACHER'
        }

        # Act
        response = self.client.post('/register', json=payload)

        # Assert
        assert response.status_code == 422
        assert response.json()['detail'][0]['msg'] == 'Value error, Password must contain at least one uppercase letter.'


    @pytest.mark.django_db
    def test_register_invalid_password_missing_digit(self):
        """Test register with missing digit in password"""

        # Arrange
        payload = {
            'username': 'AliceSmith21',
            'email': 'alicesmith21@gmail.com',
            'password': 'AliceABC$',
            'role': 'TEACHER'
        }

        # Act
        response = self.client.post('/register', json=payload)

        # Assert
        assert response.status_code == 422
        assert response.json()['detail'][0]['msg'] == 'Value error, Password must contain at least one digit.'


    @pytest.mark.django_db
    def test_register_invalid_password_missing_special_character(self):
        """Test register with missing special character in password"""

        # Arrange
        payload = {
            'username': 'AliceSmith21',
            'email': 'alicesmith21@gmail.com',
            'password': 'Alice1234',
            'role': 'TEACHER'
        }

        # Act
        response = self.client.post('/register', json=payload)

        # Assert
        assert response.status_code == 422
        assert response.json()['detail'][0]['msg'] == 'Value error, Password must contain at least one special character.'


    @pytest.mark.django_db
    def test_register_invalid_password_too_short(self):
        """Test register with too short password"""

        # Arrange
        payload = {
            'username': 'AliceSmith21',
            'email': 'alicesmith21@gmail.com',
            'password': 'Alice1$',
            'role': 'TEACHER'
        }

        # Act
        response = self.client.post('/register', json=payload)

        # Assert
        assert response.status_code == 422
        assert response.json()['detail'][0]['msg'] == "String should have at least 8 characters"
