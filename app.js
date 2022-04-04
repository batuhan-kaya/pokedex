const pokeImages = document.querySelector(".pokeImages");
const pokeName = document.querySelector(".pokeName");
const pokeTypeOne = document.querySelector("#pokeTypeOne");
const pokeTypeTwo = document.querySelector("#pokeTypeTwo");
const pokeWeight = document.querySelector(".pokeWeight");
const pokePlatform = document.querySelector(".pokePlatform");
const pokeBtn = document.getElementById("pokeBtn").addEventListener("click", () => {
  enterValue();
  clearValue();
});

let input = document.getElementById("inputSearch");
input.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById("pokeBtn").click();
  }
});

function enterValue() {
  let pokeSearch = document.getElementById("inputSearch").value.trim().toLowerCase();
  let pokeSearchReady = pokeSearch.replaceAll(" ", "-");
  if (pokeSearch === "") {
    Swal.fire({
      title: "Please enter a pokemon name...",
      width: 600,
      padding: "3em",
      heightAuto: false,
      color: "#fff",
      background: "#fff url(./images/alertBackground.png)",
      backdrop: `rgba(0,0,123,0.4)
                url("./images/pikachugif.gif")
                left bottom
                no-repeat`,
    });
    return;
  } else {
    pokedex();
    UIDisplay();
  }

  async function pokedex() {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokeSearchReady}`);
    const allPokedex = await response.json();
    return allPokedex;
  }

  pokedex()
    .then((allPokedex) => {
      getPokeImages(allPokedex);

      let pokeBaseStats = [];
      for (let pokeStatsData of allPokedex.stats) {
        pokeBaseStats.push(pokeStatsData.base_stat);
      }

      let pokeTypes = [];

      for (let testtype of allPokedex.types) {
        pokeTypes.push(testtype.type.name);
      }

      if (pokeTypes.length === 2) {
        pokeTypeOne.removeAttribute("class");
        pokeTypeTwo.removeAttribute("class");

        var typesOne = pokeTypes[0];
        var typesTwo = pokeTypes[1];

        pokeTypeOne.innerHTML = typesOne[0].toUpperCase() + typesOne.substring(1);
        pokeTypeTwo.innerHTML = typesTwo[0].toUpperCase() + typesTwo.substring(1);

        pokeTypeOne.classList.add(typesOne);
        pokeTypeTwo.classList.add(typesTwo);
      } else {
        pokeTypeOne.removeAttribute("class");
        pokeTypeTwo.removeAttribute("class");
        pokeTypeTwo.innerHTML = "";
        let typesOne = pokeTypes[0];
        pokeTypeOne.innerHTML = typesOne[0].toUpperCase() + typesOne.substring(1);
        pokeTypeOne.classList.add(typesOne);
      }

      // UI
      let getPokemonName = allPokedex.name;

      let pokeNameSplit = getPokemonName.split("-");

      for (let i = 0; i < pokeNameSplit.length; i++) {
        pokeNameSplit[i] = pokeNameSplit[i][0].toUpperCase() + pokeNameSplit[i].substr(1);
      }

      let pokemonNameUpperCase = pokeNameSplit.join(" ");

      pokeName.innerHTML = `<span class="weightColor">Name: </span>` + pokemonNameUpperCase;
      pokeWeight.innerHTML = `<span class="weightColor">Weight: </span>` + allPokedex.weight;

      // Chart.js Data update
      myChart.config.data.datasets[0].data = pokeBaseStats;
      myChart.update();
    })
    .catch(() => {
      pokemonNotFound();
      myChart.config.data.datasets[0].data = [null, null, null, null, null, null];
      myChart.update();
    });
}

// #################### Poke images ####################

function getPokeImages(allPokedex) {
  let pokeNumber = allPokedex.id;
  console.log(pokeNumber);
  pokeImages.innerHTML = `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokeNumber}.png" />`;
  pokePlatform.innerHTML = `<img src="./images/platform.png" />`;
}

function pokemonNotFound() {
  pokeTypeOne.removeAttribute("class");
  pokeTypeTwo.removeAttribute("class");
  pokeTypeOne.innerHTML = "";
  pokeTypeTwo.innerHTML = "";
  pokeImages.innerHTML = '<img src="./images/questionmark.png" />';
  pokePlatform.innerHTML = `<img src="./images/platform.png" />`;
  pokeName.innerHTML = "Name: ---";
  pokeWeight.innerHTML = "Weight: ---";
}

function clearValue() {
  inputSearch.value = "";
}

function UIDisplay() {
  document.getElementById("pokeGraphicDisplay").style.display = "block";
  document.getElementById("infoDisplay").style.display = "flex";
}

// #################### Chart.JS ####################

const ctx = document.getElementById("myChart");
const myChart = new Chart(ctx, {
  type: "polarArea",
  data: {
    labels: ["Hp", "Attack", "Defance", "Special-Attack", "Special-Defance", "Speed"],
    datasets: [
      {
        data: [null, null, null, null, null, null],
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 2,
      },
    ],
  },
  options: {
    plugins: {
      datalabels: {
        color: "red",
      },
      legend: {
        labels: {
          color: "white",
          font: {
            size: 13,
          },
        },
      },
    },
    scales: {
      r: {
        max: 255,
        ticks: {
          backdropColor: "rgba(255, 255, 255, 0)",
          color: "white",
          stepSize: 50,
        },
      },
    },
  },
});

// #################### Tippy.JS ####################

tippy("#tippyJS", {
  content: 'When searching for a custom form, search for <br/> "name mega x/y" or "name gmax"!',
  arrow: true,
  placement: "left",
  animation: "fade",
  allowHTML: true,
  theme: "light",
});
