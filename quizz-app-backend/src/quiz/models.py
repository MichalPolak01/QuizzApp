from django.db import models
from authentication.models import User
from django.db.models import Avg
from django.db.models.signals import post_save
from django.dispatch import receiver


class Quiz(models.Model):
    CATEGORY_CHOICES = [
        ("programming", "Języki Programowania"),
        ("math", "Matematyka"),
        ("history", "Historia"),
        ("science", "Nauki Przyrodnicze"),
        ("geography", "Geografia"),
        ("art", "Sztuka"),
        ("language", "Kultura i Język"),
        ("business", "Biznes i Ekonomia"),
        ("technology", "Technologia"),
        ("other", "Inna")
    ]

    name = models.CharField(max_length=255)
    description = models.TextField()
    category = models.CharField(max_length=32, choices=CATEGORY_CHOICES, default="other")
    user_count = models.PositiveBigIntegerField(default=0)
    average_score = models.FloatField(default=0.0)
    average_rating = models.FloatField(default=0.0)
    is_removed = models.BooleanField(default=False)
    is_public = models.BooleanField(default=False)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, related_name="quizzes", null=True, blank=True)
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
    
    @staticmethod
    def update_quiz_statistics(quiz_id):
        """Update quiz stats"""
        quiz = Quiz.objects.get(id=quiz_id)
        stats = UserStats.objects.filter(quiz=quiz)

        quiz.user_count = stats.count()
        quiz.average_score = stats.aggregate(Avg("quiz_score"))["quiz_score__avg"] or 0
        quiz.average_rating = stats.aggregate(Avg("rating"))["rating__avg"] or 0
        quiz.save()
    

class Question(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name="questions")
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name
    

class Option(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name="options")
    name = models.CharField(max_length=255)
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return self.name
    

class UserStats(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    quiz = models.ForeignKey(Quiz, on_delete=models.SET_NULL, related_name="user_stats", null=True, blank=True)
    quiz_score = models.FloatField()
    rating = models.FloatField(default=2.5)
    completed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user_stats.user} - {self.question} - Answered: {self.selected_option.name}"


@receiver(post_save, sender=UserStats)
def update_quiz_statistics_signal(sender, instance, **kwargs):
    if instance.quiz:
        Quiz.update_quiz_statistics(instance.quiz.id)