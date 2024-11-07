from django.db import models
from authentication.models import User
from django.db.models import Avg, Count


class Quiz(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    user_count = models.PositiveBigIntegerField(default=0)
    average_score = models.FloatField(default=0.0)
    is_removed = models.BooleanField(default=False)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, related_name="quizzes", null=True, blank=True)
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
    
class Question(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name="questions")
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name
    
class Options(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name="options")
    name = models.CharField(max_length=255)
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return self.name
    
class UserStats(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    quiz = models.ForeignKey(Quiz, on_delete=models.SET_NULL, related_name="user_stats", null=True, blank=True)
    quiz_score = models.FloatField()
    completed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user_stats.user} - {self.question} - Answered: {self.selected_option.name}"


    def update_quiz_statistics(quiz_id):
        quiz = Quiz.objects.get(id=quiz_id)
        stats = UserStats.objects.filter(quiz=quiz)

        quiz.user_count = stats.count()
        quiz.average_score = stats.aggregate(Avg("quiz_score"))["quiz_score__avg"] or 0
        quiz.save()