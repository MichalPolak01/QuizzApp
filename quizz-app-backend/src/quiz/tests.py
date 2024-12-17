from django.test import TestCase
import pytest
from ninja_extra.testing import TestClient
from ninja_jwt.tokens import RefreshToken


from .api import router
from quiz.models import Quiz
from authentication.models import User


class TestCreateQuizEndpoint(TestCase):
    def setUp(self):
        self.client = TestClient(router)
        self.user = User.objects.create_user(
            username='JohnDoe123',
            email='johndoe@gmail.com',
            password='JohnDoe@!3'
        )



    def get_access_token(self):
        """Helper function to get JWT token for the test user"""
        refresh = RefreshToken.for_user(self.user)
        return str(refresh.access_token)

    # @pytest.mark.django_db
    # def test_create_quiz_success(self):
    #     """Test successful quiz creation (test integracyjny)"""

    #     # Arrange
    #     token = self.get_access_token()
    #     payload = {
    #         "name": "Python Basics",
    #         "description": "Test your knowledge of Python basics.",
    #         "category": "programming",
    #         "is_public": True,
    #         "questions": [
    #             {
    #                 "name": "What is Python?",
    #                 "options": [
    #                     {"name": "A snake", "is_correct": False},
    #                     {"name": "A programming language", "is_correct": True},
    #                     {"name": "A fruit", "is_correct": False}
    #                 ]
    #             },
    #             {
    #                 "name": "What is a list in Python?",
    #                 "options": [
    #                     {"name": "A collection of items", "is_correct": True},
    #                     {"name": "A data type for text", "is_correct": False},
    #                     {"name": "A single number", "is_correct": False}
    #                 ]
    #             }
    #         ]
    #     }

    #     # Act
    #     response = self.client.post('', json=payload, headers={'Authorization': f'Bearer {token}'})

    #     # Assert
    #     assert response.status_code == 201
    #     assert response.json()['name'] == 'Python Basics'
    #     assert response.json()['description'] == 'Test your knowledge of Python basics.'
    #     assert response.json()['category'] == 'programming'

    #     # Validate that quiz and related objects are created in the database
    #     quiz = Quiz.objects.get(name="Python Basics")
    #     assert quiz.questions.count() == 2
    #     assert quiz.questions.first().options.count() == 3


    # @pytest.mark.django_db
    # def test_create_quiz_without_authentication(self):
    #     """Test quiz creation without authentication token"""

    #     # Arrange
    #     payload = {
    #         "name": "Python Basics",
    #         "description": "Test your knowledge of Python basics.",
    #         "category": "programming",
    #         "is_public": True,
    #         "questions": [
    #             {
    #                 "name": "What is Python?",
    #                 "options": [
    #                     {"name": "A snake", "is_correct": False},
    #                     {"name": "A programming language", "is_correct": True},
    #                     {"name": "A fruit", "is_correct": False}
    #                 ]
    #             }
    #         ]
    #     }

    #     # Act
    #     response = self.client.post('', json=payload)

    #     # Assert
    #     assert response.status_code == 401
    #     assert response.json()['detail'] == 'Unauthorized'


    # @pytest.mark.django_db
    # def test_create_quiz_missing_required_fields(self):
    #     """Test quiz creation with missing required fields"""

    #     # Arrange
    #     token = self.get_access_token()
    #     payload = {
    #         "description": "Test your knowledge of Python basics.",
    #         "category": "programming",
    #         "is_public": True,
    #         "questions": []
    #     }

    #     # Act
    #     response = self.client.post('', json=payload, headers={'Authorization': f'Bearer {token}'})

    #     # Assert
    #     assert response.status_code == 422
    #     assert response.json()['detail'][0]['msg'] == "Field required"
    #     assert 'name' in response.json()['detail'][0]['loc']


    # @pytest.mark.django_db
    # def test_create_quiz_invalid_category(self):
    #     """Test quiz creation with an invalid category"""

    #     # Arrange
    #     token = self.get_access_token()
    #     payload = {
    #         "name": "Python Basics",
    #         "description": "Test your knowledge of Python basics.",
    #         "category": "invalid_category",
    #         "is_public": True,
    #         "questions": [
    #             {
    #                 "name": "What is Python?",
    #                 "options": [
    #                     {"name": "A snake", "is_correct": False},
    #                     {"name": "A programming language", "is_correct": True},
    #                     {"name": "A fruit", "is_correct": False}
    #                 ]
    #             }
    #         ]
    #     }

    #     # Act
    #     response = self.client.post('', json=payload, headers={'Authorization': f'Bearer {token}'})

    #     # Assert
    #     assert response.status_code == 422
    #     assert response.json()['detail'][0]['msg'] == "Input should be 'programming', 'math', 'history', 'science', 'geography', 'art', 'language', 'business', 'technology' or 'other'"
    #     assert 'category' in response.json()['detail'][0]['loc']


    # @pytest.mark.django_db
    # def test_create_quiz_invalid_question(self):
    #     """Test quiz creation with an invalid question"""

    #     # Arrange
    #     token = self.get_access_token()
    #     payload = {
    #         "name": "Python Basics",
    #         "description": "Test your knowledge of Python basics.",
    #         "category": "math",
    #         "is_public": True,
    #         "questions": [
    #             {
    #                 "title": "What is Python?",
    #                 "options": [
    #                     {"name": "A snake", "is_correct": False},
    #                     {"name": "A programming language", "is_correct": True},
    #                     {"name": "A fruit", "is_correct": False}
    #                 ]
    #             }
    #         ]
    #     }

    #     # Act
    #     response = self.client.post('', json=payload, headers={'Authorization': f'Bearer {token}'})

    #     # Assert
    #     assert response.status_code == 422
    #     assert response.json()['detail'][0]['msg'] == "Field required"
    #     assert 'question' and 'name' in response.json()['detail'][0]['loc']


    # @pytest.mark.django_db
    # def test_create_quiz_invalid_options(self):
    #     """Test quiz creation with an invalid question"""

    #     # Arrange
    #     token = self.get_access_token()
    #     payload = {
    #         "name": "Python Basics",
    #         "description": "Test your knowledge of Python basics.",
    #         "category": "math",
    #         "is_public": True,
    #         "questions": [
    #             {
    #                 "name": "What is Python?",
    #                 "options": [
    #                     {"title": "A snake", "is_correct": False},
    #                     {"title": "A programming language", "is_correct": True},
    #                     {"title": "A fruit", "is_correct": False}
    #                 ]
    #             }
    #         ]
    #     }

    #     # Act
    #     response = self.client.post('', json=payload, headers={'Authorization': f'Bearer {token}'})

    #     # Assert
    #     assert response.status_code == 422
    #     assert response.json()['detail'][0]['msg'] == "Field required"
    #     assert 'question' and 'option' and 'name' in response.json()['detail'][0]['loc']



# class TestGenerateQuizEndpoint(TestCase):
#     def setUp(self):
#         self.client = TestClient(router)
#         self.user = User.objects.create_user(
#             username='JohnDoe123',
#             email='johndoe@gmail.com',
#             password='JohnDoe@!3'
#         )

#     def get_access_token(self):
#         """Helper function to get JWT token for the test user"""
#         refresh = RefreshToken.for_user(self.user)
#         return str(refresh.access_token)


    # @pytest.mark.django_db
    # def test_generate_quiz_success(self):
    #     """Test successful quiz generation"""

    #     # Arrange
    #     token = self.get_access_token()
    #     payload = {
    #         "name": "Python Basics",
    #         "description": "Test your knowledge of Python basics.",
    #         "category": "programming",
    #         "is_public": True
    #     }

    #     # Act
    #     response = self.client.post('/generate', json=payload, headers={'Authorization': f'Bearer {token}'})

    #     # Assert
    #     assert response.status_code == 201
    #     assert response.json()['name'] == 'Python Basics'
    #     assert response.json()['category'] == 'programming'
    #     assert Quiz.objects.filter(name="Python Basics").exists()

    # @pytest.mark.django_db
    # def test_generate_quiz_without_authentication(self):
    #     """Test quiz generation without authentication token"""

    #     # Arrange
    #     payload = {
    #         "name": "Python Basics",
    #         "description": "Test your knowledge of Python basics.",
    #         "category": "programming",
    #         "is_public": True
    #     }

    #     # Act
    #     response = self.client.post('/generate', json=payload)

    #     # Assert
    #     assert response.status_code == 401
    #     assert response.json()['detail'] == 'Unauthorized'


# class TestGetQuizzesEndpoint(TestCase):
#     def setUp(self):
#         self.client = TestClient(router)
#         self.user = User.objects.create_user(
#             username='JohnDoe123',
#             email='johndoe@gmail.com',
#             password='JohnDoe@!3'
#         )
#         self.quiz = Quiz.objects.create(
#             name="Python Basics",
#             description="Test your knowledge of Python basics.",
#             category="programming",
#             is_public=True,
#             created_by=self.user
#         )

#     def get_access_token(self):
#         """Helper function to get JWT token for the test user"""
#         refresh = RefreshToken.for_user(self.user)
#         return str(refresh.access_token)


#     @pytest.mark.django_db
#     def test_get_all_public_quizzes(self):
#         """Test fetching all public quizzes"""

#         # Arrange
#         token = self.get_access_token()

#         # Act
#         response = self.client.get('', headers={'Authorization': f'Bearer {token}'})

#         # Assert
#         assert response.status_code == 200
#         assert len(response.json()) == 1
#         assert response.json()[0]['name'] == 'Python Basics'


#     @pytest.mark.django_db
#     def test_get_quizzes_with_filter_my(self):
#         """Test fetching quizzes with a my filter"""

#         # Arrange
#         token = self.get_access_token()

#         # Act
#         response = self.client.get('?filter=my', headers={'Authorization': f'Bearer {token}'})

#         # Assert
#         assert response.status_code == 200
#         assert len(response.json()) == 1


#     @pytest.mark.django_db
#     def test_get_quizzes_with_filter_latest(self):
#         """Test fetching quizzes with a latest filter"""

#         # Arrange
#         token = self.get_access_token()

#         # Act
#         response = self.client.get('?filter=latest', headers={'Authorization': f'Bearer {token}'})

#         # Assert
#         assert response.status_code == 200
#         assert len(response.json()) == 1


#     @pytest.mark.django_db
#     def test_get_quizzes_with_filter_highest_rated(self):
#         """Test fetching quizzes with a highest-rated filter"""

#         # Arrange
#         token = self.get_access_token()

#         # Act
#         response = self.client.get('?filter=highest-rated', headers={'Authorization': f'Bearer {token}'})

#         # Assert
#         assert response.status_code == 200
#         assert len(response.json()) == 1


#     @pytest.mark.django_db
#     def test_get_quizzes_with_filter_most_popular(self):
#         """Test fetching quizzes with a most-popular filter"""

#         # Arrange
#         token = self.get_access_token()

#         # Act
#         response = self.client.get('?filter=most-popular', headers={'Authorization': f'Bearer {token}'})

#         # Assert
#         assert response.status_code == 200
#         assert len(response.json()) == 1


#     @pytest.mark.django_db
#     def test_get_quizzes_with_wrong_filter(self):
#         """Test fetching quizzes with a wrong filter"""

#         # Arrange
#         token = self.get_access_token()

#         # Act
#         response = self.client.get('?filter=wrong-filter', headers={'Authorization': f'Bearer {token}'})

#         # Assert
#         assert response.status_code == 400
#         assert response.json()['message'] == "Invalid filter option. Choose from 'my', 'latest', 'highest-rated', 'most-popular'."



class TestQuizDetailEndpoint(TestCase):
    def setUp(self):
        self.client = TestClient(router)
        self.user = User.objects.create_user(
            username='JohnDoe123',
            email='johndoe@gmail.com',
            password='JohnDoe@!3'
        )

        self.user2 = User.objects.create_user(
            username='AliceSmith21',
            email='alicesmith21@gmailcom',
            password='Alice123$'
        )

        self.quiz = Quiz.objects.create(
            name="Python Basics",
            description="Test your knowledge of Python basics.",
            category="programming",
            is_public=True,
            created_by=self.user
        )

    def get_access_token(self, user):
        """Helper function to get JWT token for the test user"""
        refresh = RefreshToken.for_user(user)
        return str(refresh.access_token)


    @pytest.mark.django_db
    def test_get_quiz_detail_success(self):
        """Test fetching quiz details by ID"""

        # Arrange
        token = self.get_access_token(self.user)

        # Act
        response = self.client.get(f'/{self.quiz.id}', headers={'Authorization': f'Bearer {token}'})

        # Assert
        assert response.status_code == 200
        assert response.json()['name'] == 'Python Basics'

    @pytest.mark.django_db
    def test_get_quiz_detail_non_exist(self):
        """Test fetching quiz details with wrong ID"""

        # Arrange
        token = self.get_access_token(self.user)

        # Act
        response = self.client.get(f'/999', headers={'Authorization': f'Bearer {token}'})

        # Assert
        assert response.status_code == 404
        assert response.json()['message'] == 'Quiz with id 999 not found.'


    @pytest.mark.django_db
    def test_get_quiz_detail_without_token(self):
        """Test fetching quiz details without token"""

        # Arrange
        token = self.get_access_token(self.user)

        # Act
        response = self.client.get(f'/{self.quiz.id}')

        # Assert
        assert response.status_code == 401
        assert response.json()['detail'] == 'Unauthorized'


    @pytest.mark.django_db
    def test_update_quiz_success(self):
        """Test updating an existing quiz"""

        # Arrange
        token = self.get_access_token(self.user)
        payload = {
            "name": "Python Advanced",
            "description": "Test your knowledge of advanced Python concepts.",
            "category": "programming",
            "is_public": False,
            "questions": []
        }

        # Act
        response = self.client.put(f'/{self.quiz.id}', json=payload, headers={'Authorization': f'Bearer {token}'})

        # Assert
        assert response.status_code == 200
        self.quiz.refresh_from_db()
        assert self.quiz.name == "Python Advanced"
        assert not self.quiz.is_public


    @pytest.mark.django_db
    def test_update_quiz_non_author(self):
        """Test updating quiz by other user"""

        # Arrange
        token = self.get_access_token(self.user2)
        payload = {
            "name": "Python Advanced",
            "description": "Test your knowledge of advanced Python concepts.",
            "category": "programming",
            "is_public": False,
            "questions": []
        }

        # Act
        response = self.client.put(f'/999', json=payload, headers={'Authorization': f'Bearer {token}'})

        # Assert
        assert response.status_code == 404
        self.quiz.refresh_from_db()
        assert response.json()['message'] == "No quiz with this ID was found for this user."
