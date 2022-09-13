const container = document.querySelector(".container"),
  homePage = container.querySelector(".home-page"),
  themes = homePage.querySelector("header .colors"),
  searchInput = homePage.querySelector(".input-part input"),
  hint = homePage.querySelector(".hint"),
  ul = homePage.querySelector("ul"),
  speak = ul.querySelector(".word i");
let audio;

themes.addEventListener('click', e => {
  console.log(e.target);
  if (e.target.classList.contains("white")) {
    document.querySelector("body").classList.add("light");
  } else if (e.target.classList.contains("dark")) {
    document.querySelector("body").classList.remove("light");
  }
})

searchInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter" && e.target.value) {
    fetchApi(e.target.value);
    e.target.value = "";
  }
});

function fetchApi(word) {
  hint.innerHTML = `Searching the meaning for <span>"${word}"</span>  . . .`;
  let api = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

  fetch(api)
    .then((response) => response.json())
    .then((result) => {console.log(result),
      wordDetails(result, word);
    });
}

function wordDetails(result, word) {
  if (result.title) {
    hint.classList.add("error");
    hint.innerHTML = `Sorry pal, we couldn't find definitions for the word <span>"${word}"</span> you were looking for`;
    ul.style.display = "none";
    hint.style.display = "block";
  } else {
    let phonetic;
    for (let i = 0; i < result[0].phonetics.length; i++) {
      phonetic = result[0].phonetics[i].text;
    }

    let partOfSpeech = result[0].meanings[0].partOfSpeech;

    if (ul.querySelector(".content .meaning .details span")) {
      let meaning = result[0].meanings[0].definitions[0].definition;

      let mean = ul.querySelector(".content .meaning .details span");
      mean.innerText = meaning;
    } else {
      meaning = result[0].meanings[0].definitions[0].definition;

      let mean = document.createElement("span");
      mean.classList.add("mean");
      mean.classList.add("txt");
      mean.innerText = meaning;
      ul.querySelector(".content .meaning .details").appendChild(mean);
    }

    let example =
      result[0].meanings[result[0].meanings.length - 1].definitions[0].example;

    audio = result[0].phonetics[0].audio;
    if (audio !== undefined) {
      speak.addEventListener("click", (e) => {
          let play = new Audio(audio);
          play.play();
      });
    }

    ul.querySelector(".word .details p").innerText = word;
    ul.querySelector(
      ".word .details span"
    ).innerHTML = `${partOfSpeech} <span>${phonetic}</span>`;

    if (example == undefined) {
      ul.querySelector(".content .example .details .ex").innerText =
        "no examples found";
    } else {
      ul.querySelector(".content .example .details .ex").innerText = example;
    }

    ul.querySelector(".content .synonyms .details .list").innerHTML = "";

    for (let i = 0; i < 4; i++) {
      let tag = result[0].meanings[0].synonyms[i];
      if (tag !== undefined) {
        let synonyms = `<span onClick=search('${tag}') class='synon txt'> ${tag} ,</span>`;
        ul.querySelector(
          ".content .synonyms .details .list"
        ).insertAdjacentHTML("beforeend", synonyms);
      } else {
        let synonyms = `<span class='synon txt'> . . . </span>`;
        ul.querySelector(
          ".content .synonyms .details .list"
        ).insertAdjacentHTML("beforeend", synonyms);
      }
    }

    ul.style.display = "block";
    hint.style.display = "none";
  }
}

function search(word) {
    searchInput.value = word;
    fetchApi(word);
}
