const input = document.getElementById("text");
const btnSearch = document.getElementById("btn-search");
const btnRandom = document.getElementById("btn-random");
const headingEl = document.getElementById("result-heading");
const mealsEl = document.getElementById("meals");
const sinleMeal = document.getElementById("single-meal");

const r = ["m", "l", "k"];

async function getRandomMeals() {
  const resp = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?f=${
      r[Math.floor(Math.random() * r.length)]
    }
    `
  );
  const data = await resp.json();
  mealsEl.innerHTML = data.meals
    .map(
      (meal) => `
  <div class="meal">
    <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
    <div class="meal-name" data-mealID="${meal.idMeal}">
      <h3>${meal.strMeal}</h3>
    </div>
  </div>
`
    )
    .join("");
  headingEl.innerHTML = "<h1>Latest Meals</h1>";
}
getRandomMeals();

async function searchMeal(term) {
  const resp = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${term}
    `
  );
  const data = await resp.json();
  console.log(data);
  if (data.meals !== null) {
    mealsEl.innerHTML = data.meals
      .map(
        (meal) => `
    <div class="meal">
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
      <div class="meal-name" data-mealID="${meal.idMeal}">
        <h3>${meal.strMeal}</h3>
      </div>
    </div>
  `
      )
      .join("");
    headingEl.innerHTML = `<h1>Results Of ${term}</h1>`;
  } else {
    mealsEl.innerHTML = "";
    headingEl.innerHTML = `<h1>Sorry ${term} Not Found !!</h1>`;
  }
}
function getMealById(mealID) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then((resp) => resp.json())
    .then((data) => {
      const meal = data.meals[0];

      addMealToDOM(meal);
    });
}
function getRandomMeal() {
  fetch("https://www.themealdb.com/api/json/v1/1/random.php")
    .then((resp) => resp.json())
    .then((data) => {
      const meal = data.meals[0];

      addMealToDOM(meal);
    });
}

function addMealToDOM(meal) {
  let ingredient = [];
  for (i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredient.push(
        `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
      );
    } else {
      break;
    }
  }
  headingEl.innerHTML = `<h1>${meal.strMeal}</h1>`;
  mealsEl.innerHTML = "";
  sinleMeal.innerHTML = `
  <div class="meal">
    <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
  </div>
  <h3>Ingredient</h3>
  <ul class='colection'> ${ingredient
    .map((ing) => `<li>${ing}</li>`)
    .join("")}</ul>
  <h3>Instraction</h3>
  <p>${meal.strInstructions}</p>
  `;
}

btnSearch.addEventListener("click", () => {
  const term = input.value;
  if (term.trim() !== "") {
    searchMeal(term);
    input.value = "";
    sinleMeal.innerHTML = "";
  } else {
    alert("Please Enter Meal");
  }
});

mealsEl.addEventListener("click", (e) => {
  const mealInfo = e.path.find((item) => {
    if (item.classList) {
      return item.classList.contains("meal-name");
    } else {
      return false;
    }
  });

  if (mealInfo) {
    const mealID = mealInfo.getAttribute("data-mealid");
    getMealById(mealID);
  }
});

btnRandom.addEventListener("click", getRandomMeal);
