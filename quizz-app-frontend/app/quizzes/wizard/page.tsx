"use client";
import { useEffect, useState } from "react";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Input, Textarea } from "@nextui-org/input";
import { Select, SelectItem } from "@nextui-org/select";
import { Switch } from "@nextui-org/switch";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Spinner } from "@nextui-org/spinner";

import { categories } from "@/config/data";
import { useAuth } from "@/providers/authProvider";

const CREATE_QUIZ_URL = "/api/quizzes/create";
const GENERATE_QUIZ_URL = "/api/quizzes/generate";
const UPDATE_QUIZ_URL = (id: number) => `/api/quizzes/update?id=${id}`;


interface Question {
  name: string;
  options: { name: string; is_correct: boolean }[];
}

interface QuizPageProps {
  quizId?: number | null;
}

export default function QuizPage({ quizId }: QuizPageProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    is_public: false,
  });
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (quizId) {
      const fetchQuiz = async () => {
        try {
          const response = await fetch(`/api/quizzes/${quizId}`);
  
          if (response.status === 401) {
            auth.loginRequired();

            return;
          }
  
          if (response.status === 404) {
            router.push("/not-found");

            return;
          }
  
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
  
          const data = await response.json();
  
          setFormData({
            name: data.name,
            description: data.description,
            category: data.category,
            is_public: data.is_public,
          });
          setQuestions(data.questions || []);
        } catch {
          toast.error("Nie udało się pobrać danych quizu.");
        }
      };
  
      fetchQuiz();
    }
  }, [quizId]);
  


const handleFormChange = (event: { target: { name: string; value: string } }) => {
    const { name, value } = event.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  

  const handleGenerateQuestions = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateQuizDetails()) return;

    setIsGenerating(true);

    try {
      const response = await fetch(GENERATE_QUIZ_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          category: formData.category,
          is_public: formData.is_public
        }),
      });
      const data = await response.json();

      if (response.status === 201) {
        quizId = data.id;

        router.push(`/quizzes/update/${quizId}`)
      } else if (response.status === 401) {
          auth.loginRequired();
      }
    } catch (error) {

      toast(`Podczas generowania treści wystąpił błąd: ${error}. Spróbuj ponownie później!`,
        {
            icon: '❌',
            style: {
            borderRadius: '16px',
            textAlign: "center",
            padding: '16px',
            background: "#006FEE",
            color: '#fff',
            },
        }
    );

    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddQuestion = () => {
    setQuestions((prevQuestions) => [
      ...prevQuestions,
      { name: "", options: [{ name: "", is_correct: false }] },
    ]);
  };

  const handleQuestionChange = (index: number, value: string) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];

      updatedQuestions[index].name = value;

      return updatedQuestions;
    });
  };

  const handleAddOption = (qIndex: number) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((question, index) =>
        index === qIndex
          ? {
              ...question,
              options: [...question.options, { name: "", is_correct: false }],
            }
          : question
      )
    );
  };

  const handleOptionChange = (qIndex: number, oIndex: number, value: string) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];

      updatedQuestions[qIndex].options[oIndex].name = value;

      return updatedQuestions;
    });
  };

  const handleCorrectAnswerChange = (qIndex: number, oIndex: number) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];

      updatedQuestions[qIndex].options = updatedQuestions[qIndex].options.map((option, index) => ({
        ...option,
        is_correct: index === oIndex,
      }));

      return updatedQuestions;
    });
  };

  const handleDeleteQuestion = (qIndex: number) => {
    setQuestions((prevQuestions) => prevQuestions.filter((_, index) => index !== qIndex));
  };

  const handleDeleteOption = (qIndex: number, oIndex: number) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];

      updatedQuestions[qIndex].options = updatedQuestions[qIndex].options.filter((_, index) => index !== oIndex);

      return updatedQuestions;
    });
  };

  const [validationErrors, setValidationErrors] = useState({
    name: false,
    description: false,
    category: false,
    questions: [] as boolean[],
    hasAtLeastThreeQuestions: true
  });

  const validateQuizDetails = () => {
    const nameError = formData.name === "";
    const descriptionError = formData.description === "";
    const categoryError = formData.category === "";
  
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      name: nameError,
      description: descriptionError,
      category: categoryError,
    }));
  
    return !nameError && !descriptionError && !categoryError;
  };
  
  const validateFullQuiz = () => {
    const isDetailsValid = validateQuizDetails();
  
    const questionsErrors = questions.map((question) => {
      const questionTitleError = question.name === "";
      const hasAtLeastThreeOptions = question.options.length >= 3;
      const allOptionsFilled = question.options.every((option) => option.name !== "");
      const hasOneCorrectOption = question.options.some((option) => option.is_correct);
  
      return (
        questionTitleError ||
        !hasAtLeastThreeOptions ||
        !allOptionsFilled ||
        !hasOneCorrectOption
      );
    });
  
    const hasAtLeastThreeQuestions = questions.length >= 3;
  
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      questions: questionsErrors,
      hasAtLeastThreeQuestions: hasAtLeastThreeQuestions,
    }));
  
    return (
      isDetailsValid &&
      hasAtLeastThreeQuestions &&
      questionsErrors.every((error) => !error)
    );
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateFullQuiz()) return;

    try {
      const quizData = { ...formData, questions };
      const url = quizId ? UPDATE_QUIZ_URL(quizId) : CREATE_QUIZ_URL;
      const method = quizId ? "PUT" : "POST";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quizData),
      });

      interface HandleSubmit {
        message?: string,
        id?: number
    };
    let data: HandleSubmit = {};

    try {
        data = await response.json();
    } catch { }

      if (response.status === 200 || response.status === 201) {
        if (!quizId) router.push(`/quizzes/${data.id}`);
        saveQuizToast(false);
        router.push("/home");
      } else if (response.status === 401) {
        auth.loginRequired();
      } else if (response.status === 404 && data.message === "No quiz with this ID was found for this user.") {
        toast(`Ten quiz nie należy do Ciebie. Możesz edytować tylko quizy stworzone przez siebie.`,
          {
              icon: '❌',
              style: {
              borderRadius: '16px',
              textAlign: "center",
              padding: '16px',
              background: "#F31260",
              color: '#fff',
              },
          });
          router.push("/");
      }

    } catch {
      saveQuizToast(true);
    }
  };

  const saveQuizToast = async (isError: boolean) => {
    toast(isError? 'Podczas zapisywania quizu wystąpił błąd. Spróbuj ponownie później!': 'Pomyślnie utworzono quiz. Miłej zabawy!',
        {
            icon: isError? '❌' : '✔️',
            style: {
            borderRadius: '16px',
            textAlign: "center",
            padding: '16px',
            background: isError? "#F31260" : "#006FEE",
            color: '#fff',
            },
        }
    );
}

  return (
    <div className="relative">
      {isGenerating && (
        <div className="fixed inset-0 z-50 flex flex-row gap-4 items-center justify-center bg-black/70">
          <Spinner color="primary" size="lg" />
          <p className="text-md text-primary">Generowanie pytań...</p>
        </div>
      )}
      <Card className="p-10">
        <CardHeader>
          <h1 className="text-primary text-4xl font-semibold mb-2">{quizId ? "Stwórz Quiz" : "Edytuj Quiz"}</h1>
        </CardHeader>
        <CardBody>
          <form className="overflow-visible flex flex-col gap-5" onSubmit={handleSubmit}>
            <Input
              color={validationErrors.name? "danger" : "default"}
              errorMessage="Podanie tematu quizu jest wymagane!"
              isInvalid={validationErrors.name}
              isRequired={true}
              label="Temat quizu"
              labelPlacement="outside"
              name="name"
              placeholder="Podaj temat quizu"
              value={formData.name}
              onChange={handleFormChange}
            />
            <Textarea
              color={validationErrors.description? "danger" : "default"}
              errorMessage="Podanie opisu quizu jest wymagane!"
              isInvalid={validationErrors.description}
              isRequired={true}
              label="Opis quizu"
              labelPlacement="outside"
              name="description"
              placeholder="Podaj krótki opis quizu"
              value={formData.description}
              onChange={handleFormChange}
            />
          <Select
            isInvalid={validationErrors.category}
            label="Kategoria"
            labelPlacement="outside"
            name="category"
            placeholder="Wybierz kategorię quizu"
            value={formData.category}
            onChange={(e) => handleFormChange({ target: { name: "category", value: e.target.value } })}
            >
            {categories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
              {category.label}
              </SelectItem>
          ))}
          </Select>

            <Switch
              isSelected={formData.is_public}
              onChange={() => setFormData((prev) => ({ ...prev, is_public: !prev.is_public }))}
            >
              {formData.is_public ? "Quiz Publiczny" : "Quiz Prywatny"}
            </Switch>

            {questions.length === 0 && (
              <Button
                className="mt-4"
                color="primary"
                disabled={isGenerating}
                type="button"
                onClick={handleGenerateQuestions}
              >
                {isGenerating ? "Generowanie Pytań..." : "Wygeneruj Pytania"}
              </Button>
            )}
            <div>
              <h2 className="text-xl font-semibold mt-5">Pytania:</h2>
              {!validationErrors.hasAtLeastThreeQuestions &&
                <p className="text-danger text-md">Quiz musi posiadać co najmniej 3 pytania!</p>
              }
            </div>
            {questions.map((question, qIndex) => (
              <div key={qIndex} className="mb-4 p-4 ml-16 border border-default-200 rounded-lg">
                <h3 className="text-lg font-semibold my-3 text-secondary">Pytanie {qIndex + 1}</h3>
                <Input
                  errorMessage="Każde pytanie wymaga tytułu, co najmniej 3 odpowiedzi i jednej poprawnej."
                  isInvalid={validationErrors.questions[qIndex]}
                  placeholder="Podaj pytanie"
                  value={question.name}
                  onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                />
                <h3 className="mt-3">Odpowiedzi:</h3>
                {question.options.map((option, oIndex) => (
                  <div key={oIndex} className="flex items-center gap-2 mt-2 pl-8">
                    <Input
                    isInvalid={validationErrors.questions[qIndex] && option.name === ""}
                      placeholder={`Odpowiedź ${oIndex + 1}`}
                      value={option.name}
                      onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                    />
                    <Switch
                      color="secondary"
                      isSelected={option.is_correct}
                      onChange={() => handleCorrectAnswerChange(qIndex, oIndex)}
                    />
                    <Button
                      color="danger"
                      variant="bordered"
                      onClick={() => handleDeleteOption(qIndex, oIndex)}
                    >
                      <Trash2 size={16}/>
                    </Button>
                  </div>
                ))}
                <div className="flex flex-row justify-start items-center gap-4 mt-3">
                <Button
                  className="mt-2"
                  color="secondary"
                  onClick={() => handleAddOption(qIndex)}
                >
                  Dodaj Odpowiedź
                </Button>
                <Button
                  className="mt-2"
                  color="danger"
                  variant="bordered"
                  onClick={() => handleDeleteQuestion(qIndex)}
                >
                  <Trash2 size={16} /> Usuń pytanie
                </Button>
                </div>
              </div>
            ))}

            <Button className="mt-4 ml-16" color="secondary" onClick={handleAddQuestion}>
              Dodaj Pytanie
            </Button>

            <Button className="mt-6" color="primary" type="submit">
              {quizId ? "Zaktualizuj Quiz" : "Stwórz Quiz"}
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
