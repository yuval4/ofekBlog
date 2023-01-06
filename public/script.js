const questionForm = document.getElementById("question-form");
const questionInput = document.getElementById("question-input");
const questionsDiv = document.getElementById("questions");

let questions = [];

window.onload = () => {
  fetch("/api/posts/comments", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((posts) => {
      questions = posts;
      renderQuestions();
    })
    .catch((error) => console.error(error));
};

questionForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const questionText = questionInput.value;

  if (questionText.trim() === "") {
    return;
  }

  fetch("/api/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content: questionText }),
  })
    .then((res) => res.json())
    .then((post) => {
      post.comments = [];
      questions.push(post);
      renderQuestions();
      questionInput.value = "";
    })
    .catch((error) => console.error(error));
});

function renderQuestions() {
  questionsDiv.innerHTML = "";
  for (const question of questions) {
    const questionElement = document.createElement("div");
    questionElement.classList.add("question");

    const questionText = document.createElement("h2");
    questionText.textContent = question.content;
    questionElement.appendChild(questionText);

    const answerForm = document.createElement("form");

    answerForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const answerInput = answerForm.querySelector("input");
      const answerText = answerInput.value;

      if (answerText.trim() === "") {
        return;
      }

      fetch(`/api/comments/${question.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: answerText }),
      })
        .then((res) => res.json())
        .then((comment) => {
          question.comments.push(comment);
          renderQuestions();
          answerInput.value = "";
        })
        .catch((error) => console.error(error));
    });
    const answerInput = document.createElement("input");
    answerInput.type = "text";
    answerForm.appendChild(answerInput);
    const answerButton = document.createElement("button");
    answerButton.type = "submit";
    answerButton.textContent = "Submit";
    answerForm.appendChild(answerButton);
    questionElement.appendChild(answerForm);

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-button");
    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", () => {
      fetch(`/api/posts/${question.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((post) => {
          questions = questions.filter((q) => q.id !== post.id);
          renderQuestions();
        })
        .catch((error) => console.error(error));
    });

    questionElement.appendChild(deleteButton);

    const answersDiv = document.createElement("div");
    answersDiv.classList.add("answers");

    for (const answer of question.comments) {
      const answerElement = document.createElement("div");
      answerElement.classList.add("answer");
      const answerText = document.createElement("p");
      answerText.textContent = answer.content;
      answerElement.appendChild(answerText);

      const deleteAnswerButton = document.createElement("button");
      deleteAnswerButton.classList.add("delete-button");
      deleteAnswerButton.textContent = "Delete";

      deleteAnswerButton.addEventListener("click", () => {
        // here
        deleteAnswerButton.addEventListener("click", () => {
          console.log(answer);
          fetch(`/api/comments/${answer.id}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          })
            .then((res) => res.json())
            .then((comment) => {
              question.comments = question.comments.filter(
                (a) => a.id !== comment.id
              );
              renderQuestions();
            })
            .catch((error) => console.error(error));
        });
      });

      answerElement.appendChild(deleteAnswerButton);
      answersDiv.appendChild(answerElement);
    }

    questionElement.appendChild(answersDiv);
    questionsDiv.appendChild(questionElement);
  }
}
