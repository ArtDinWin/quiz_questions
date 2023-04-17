// Объект с данными ответов
let answers = {
  2: null,
  3: null,
  4: null,
  5: null,
};
let btnNext = document.querySelectorAll("[data-nav='next']");
let btnPrev = document.querySelectorAll("[data-nav='prev']");

// перемещение вперед
btnNext.forEach(function (button) {
  button.addEventListener("click", function () {
    let thisCard = this.closest("[data-card]");
    let thisCardNumber = parseInt(thisCard.dataset.card);
    if (thisCard.dataset.validate == "novalidate") {
      navigate("next", thisCard);
      updateProgressBar("next", thisCardNumber);
    } else {
      saveAnswer(thisCardNumber, gatherCardData(thisCardNumber));
      // валидация на заполненность
      if (isFiled(thisCardNumber) && checkOnRequired(thisCardNumber) == true) {
        // true or false
        navigate("next", thisCard);
        updateProgressBar("next", thisCardNumber);
      } else if (checkOnRequired(thisCardNumber)[1]) {
        alert(checkOnRequired(thisCardNumber)[1]);
      } else {
        alert("Укажите ответ, прежде чем переходить далее.");
      }
    }
  });
});

// перемещение назад
btnPrev.forEach(function (button) {
  button.addEventListener("click", function () {
    let thisCard = this.closest("[data-card]");
    navigate("prev", thisCard);
    let thisCardNumber = parseInt(thisCard.dataset.card);
    updateProgressBar("prev", thisCardNumber);
  });
});

// функция навигации по карточкам
function navigate(direction, thisCard) {
  let thisCardNumber = parseInt(thisCard.dataset.card);
  let nextCard;
  if (direction == "next") {
    nextCard = thisCardNumber + 1;
  } else {
    nextCard = thisCardNumber - 1;
  }
  thisCard.classList.toggle("hidden");
  document
    .querySelector(`[data-card='${nextCard}']`)
    .classList.toggle("hidden");
}

// функция сбора данных
function gatherCardData(number) {
  let question;
  let result = [];
  let currentCard = document.querySelector(`[data-card='${number}']`);
  question = currentCard.querySelector(`[data-question]`).innerText;
  let radioValues = currentCard.querySelectorAll('[type="radio"]');
  radioValues.forEach(function (item) {
    if (item.checked) {
      result.push({
        name: item.name,
        value: item.value,
      });
    }
  });

  let checkboxValues = currentCard.querySelectorAll('[type="checkbox"]');
  checkboxValues.forEach(function (item) {
    if (item.checked) {
      result.push({
        name: item.name,
        value: item.value,
      });
    }
  });

  let inputValues = currentCard.querySelectorAll(
    '[type="text"],[type="email"],[type="number"]'
  );
  inputValues.forEach(function (item) {
    let itemValue = item.value;
    if (itemValue.trim() != "") {
      result.push({
        name: item.getAttribute("placeholder"),
        value: itemValue,
      });
    }
  });

  let data = {
    question: question,
    answer: result,
  };
  return data;
}

//  функция записи в объект с ответами
function saveAnswer(number, data) {
  answers[number] = data;
}

// функция валидации карточки на наличие ответов
function isFiled(number) {
  if (answers[number].answer.length > 0) {
    return true;
  } else {
    return false;
  }
}

// Функция проверки на заполненность required чекбоксов и инпутов
function checkOnRequired(number) {
  let currentCard = document.querySelector(`[data-card='${number}']`);
  let requiredFields = currentCard.querySelectorAll("[required]");
  let isValidArray = [];
  let error = [];
  requiredFields.forEach(function (item) {
    if (item.type == "checkbox" && item.checked == false) {
      isValidArray.push(false);
    } else if (item.type == "email") {
      if (item.value == "") {
        // alert("Введите email."  );
        //  fail;

        error.push("Введите email.");
        isValidArray.push(false);
      } else {
        if (validateEmail(item.value)) {
          isValidArray.push(true);
          error.push(
            "Вы должны согласиться с условиями политики конфиденциальности, чтобы продолжить и получить Ваши бонусы. Для этого внизу отметьте галочку - С политикой конфеденциальности ознакомлен."
          );
        } else {
          isValidArray.push(false);
          error.push("Введите корректный email!");
        }
      }
    }
  });

  if (isValidArray.indexOf(false) == -1) {
    return true;
  } else {
    return [false, error];
  }
}

// функция для проверки email
function validateEmail(email) {
  var pattern = /^[\w-\.]+@[\w-]+\.[a-z]{2,4}$/i;
  return pattern.test(email);
}

// Подсвечиваем рамку у радиокнопок
document.querySelectorAll(".radio-group").forEach(function (item) {
  item.addEventListener("click", function (e) {
    let label = e.target.closest("label");
    if (label) {
      label
        .closest(".radio-group")
        .querySelectorAll("label")
        .forEach(function (item) {
          item.classList.remove("radio-block--active");
        });
      label.classList.add("radio-block--active");
    }
  });
});

// Подсвечиваем рамку у чекбоксов
document
  .querySelectorAll("label.checkbox-block input[type='checkbox']")
  .forEach(function (item) {
    item.addEventListener("change", function (e) {
      let label = e.target.closest("label");
      if (label) {
        label.classList.toggle("checkbox-block--active");
      }
    });
  });

// функция обработка прогрессбара
function updateProgressBar(direction, cardNumber) {
  let carsTotalNumber = document.querySelectorAll("[data-card]").length;

  if (direction == "next") {
    cardNumber = cardNumber + 1;
  } else if (direction == "prev") {
    cardNumber = cardNumber - 1;
  }
  let progress = ((cardNumber * 100) / carsTotalNumber).toFixed();
  let progressBar = document
    .querySelector(`[data-card='${cardNumber}']`)
    .querySelector(`.progress`);

  if (progressBar) {
    progressBar.querySelector(
      ".progress__label strong"
    ).innerText = `${progress}%`;
    progressBar.querySelector(
      ".progress__line-bar"
    ).style = `width: ${progress}%`;
  }
}
