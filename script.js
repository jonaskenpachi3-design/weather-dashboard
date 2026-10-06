"use strict";


/* =========================================
   WEATHERLY
   Desenvolvido por Jonas Sousa
========================================= */


/* =========================================
   API
========================================= */

const GEO_API =
    "https://geocoding-api.open-meteo.com/v1/search";

const WEATHER_API =
    "https://api.open-meteo.com/v1/forecast";


/* =========================================
   DOM
========================================= */

const cityInput =
    document.getElementById("city-input");

const searchButton =
    document.getElementById("search-button");

const weather =
    document.getElementById("weather");

const loading =
    document.getElementById("loading");

const error =
    document.getElementById("error");

const errorMessage =
    document.getElementById("error-message");

const themeButton =
    document.getElementById("theme-button");

const themeIcon =
    document.getElementById("theme-icon");

const favoriteButton =
    document.getElementById("favorite-button");

const favoriteIcon =
    document.getElementById("favorite-icon");

const favoriteText =
    document.getElementById("favorite-text");

const cityName =
    document.getElementById("city-name");

const countryName =
    document.getElementById("country-name");

const currentDate =
    document.getElementById("current-date");

const currentTime =
    document.getElementById("current-time");

const temperature =
    document.getElementById("temperature");

const weatherDescription =
    document.getElementById("weather-description");

const feelsLike =
    document.getElementById("feels-like");

const metricFeels =
    document.getElementById("metric-feels");

const humidity =
    document.getElementById("humidity");

const wind =
    document.getElementById("wind");

const conditionStatus =
    document.getElementById("condition-status");

const weatherIcon =
    document.getElementById("weather-icon");

const forecast =
    document.getElementById("forecast");

const favoritesList =
    document.getElementById("favorites-list");

const chartFallback =
    document.getElementById("chart-fallback");


/* =========================================
   STATE
========================================= */

let currentCity = null;

let temperatureChart = null;


let favorites = [];

try {

    favorites =
        JSON.parse(
            localStorage.getItem(
                "weatherFavorites"
            )
        ) || [];

} catch {

    favorites = [];

}


/* =========================================
   INITIALIZATION
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    initialize
);


function initialize() {

    initializeTheme();

    setupEvents();

    renderFavorites();

    /*
     * Pequeno atraso para garantir
     * que o navegador terminou de
     * montar a interface.
     */

    setTimeout(
        () => {

            searchCity("Rio Branco");

        },
        100
    );

}


/* =========================================
   EVENTS
========================================= */

function setupEvents() {

    if (searchButton) {

        searchButton.addEventListener(
            "click",
            () => searchCity()
        );

    }


    if (cityInput) {

        cityInput.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Enter"
                ) {

                    searchCity();

                }

            }
        );

    }


    if (themeButton) {

        themeButton.addEventListener(
            "click",
            toggleTheme
        );

    }


    if (favoriteButton) {

        favoriteButton.addEventListener(
            "click",
            toggleFavorite
        );

    }

}


/* =========================================
   SEARCH CITY
========================================= */

async function searchCity(
    cityFromFavorite = null
) {

    const city =
        cityFromFavorite ||
        cityInput.value.trim();


    if (!city) {

        showError(
            "Digite o nome de uma cidade."
        );

        return;

    }


    showLoading();

    hideError();


    try {

        const location =
            await getLocation(city);


        if (!location) {

            throw new Error(
                "Cidade não encontrada. Verifique o nome e tente novamente."
            );

        }


        const weatherData =
            await getWeather(location);


        currentCity = {

            ...location,

            weather: weatherData

        };


        updateDashboard();


    } catch (err) {

        console.error(
            "Weatherly:",
            err
        );


        showError(
            err.message ||
            "Não foi possível buscar os dados meteorológicos."
        );

    } finally {

        hideLoading();

    }

}


/* =========================================
   GEOLOCATION API
========================================= */

async function getLocation(city) {

    const url =
        `${GEO_API}?name=${encodeURIComponent(city)}&count=1&language=pt&format=json`;


    const response =
        await fetch(url);


    if (!response.ok) {

        throw new Error(
            "Não foi possível consultar a localização."
        );

    }


    const data =
        await response.json();


    if (
        !data.results ||
        data.results.length === 0
    ) {

        return null;

    }


    return data.results[0];

}


/* =========================================
   WEATHER API
========================================= */

async function getWeather(
    location
) {

    const params =
        new URLSearchParams({

            latitude:
                location.latitude,

            longitude:
                location.longitude,

            current:
                [
                    "temperature_2m",
                    "relative_humidity_2m",
                    "apparent_temperature",
                    "wind_speed_10m",
                    "weather_code"
                ].join(","),

            daily:
                [
                    "weather_code",
                    "temperature_2m_max",
                    "temperature_2m_min"
                ].join(","),

            timezone:
                "auto",

            forecast_days:
                "5"

        });


    const response =
        await fetch(
            `${WEATHER_API}?${params}`
        );


    if (!response.ok) {

        throw new Error(
            "Não foi possível consultar o clima."
        );

    }


    return await response.json();

}


/* =========================================
   UPDATE DASHBOARD
========================================= */

function updateDashboard() {

    weather.classList.remove(
        "hidden"
    );


    cityName.textContent =
        currentCity.name;


    countryName.textContent =
        [
            currentCity.admin1,
            currentCity.country
        ]
            .filter(Boolean)
            .join(", ");


    updateDate();

    updateCurrentWeather();

    updateMetrics();

    updateForecast();

    updateChart();

    updateFavoriteButton();


    cityInput.value =
        currentCity.name;

}


/* =========================================
   DATE
========================================= */

function updateDate() {

    const now =
        new Date();


    currentDate.textContent =
        now.toLocaleDateString(
            "pt-BR",
            {
                weekday: "long",
                day: "2-digit",
                month: "long"
            }
        );


    currentTime.textContent =
        now.toLocaleTimeString(
            "pt-BR",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );

}


/* =========================================
   CURRENT WEATHER
========================================= */

function updateCurrentWeather() {

    const current =
        currentCity.weather.current;


    const code =
        current.weather_code;


    temperature.textContent =
        Math.round(
            current.temperature_2m
        );


    weatherDescription.textContent =
        getWeatherDescription(
            code
        );


    feelsLike.textContent =
        `${Math.round(
            current.apparent_temperature
        )}°C`;


    metricFeels.textContent =
        `${Math.round(
            current.apparent_temperature
        )}°C`;


    humidity.textContent =
        `${current.relative_humidity_2m}%`;


    wind.textContent =
        `${Math.round(
            current.wind_speed_10m
        )} km/h`;


    conditionStatus.textContent =
        getShortCondition(
            code
        );


    setWeatherIcon(
        weatherIcon,
        code
    );

}


/* =========================================
   METRICS
========================================= */

function updateMetrics() {

    const current =
        currentCity.weather.current;


    humidity.textContent =
        `${Math.round(
            current.relative_humidity_2m
        )}%`;


    wind.textContent =
        `${Math.round(
            current.wind_speed_10m
        )} km/h`;

}


/* =========================================
   WEATHER DESCRIPTION
========================================= */

function getWeatherDescription(code) {

    const descriptions = {

        0: "Céu limpo",

        1: "Principalmente limpo",

        2: "Parcialmente nublado",

        3: "Nublado",

        45: "Neblina",

        48: "Neblina com geada",

        51: "Garoa leve",

        53: "Garoa moderada",

        55: "Garoa intensa",

        61: "Chuva leve",

        63: "Chuva moderada",

        65: "Chuva forte",

        71: "Neve leve",

        73: "Neve moderada",

        75: "Neve forte",

        80: "Pancadas de chuva",

        81: "Pancadas moderadas",

        82: "Pancadas fortes",

        95: "Trovoadas",

        96: "Trovoadas com granizo",

        99: "Trovoadas fortes"

    };


    return (
        descriptions[code] ||
        "Condição desconhecida"
    );

}


/* =========================================
   SHORT CONDITION
========================================= */

function getShortCondition(code) {

    if (code === 0)
        return "Limpo";


    if (code <= 3)
        return "Nublado";


    if (code <= 48)
        return "Neblina";


    if (code <= 67)
        return "Chuva";


    if (code <= 77)
        return "Neve";


    if (code <= 82)
        return "Pancadas";


    return "Tempestade";

}


/* =========================================
   WEATHER ICONS
========================================= */

function getWeatherEmoji(code) {

    if (code === 0)
        return "☀";


    if (code === 1)
        return "🌤";


    if (code === 2)
        return "⛅";


    if (code === 3)
        return "☁";


    if (code <= 48)
        return "🌫";


    if (code <= 67)
        return "🌧";


    if (code <= 77)
        return "❄";


    if (code <= 82)
        return "🌦";


    return "⛈";

}


function setWeatherIcon(
    element,
    code
) {

    if (!element)
        return;


    element.textContent =
        getWeatherEmoji(code);

}


/* =========================================
   FORECAST
========================================= */

function updateForecast() {

    const daily =
        currentCity.weather.daily;


    forecast.innerHTML = "";


    daily.time.forEach(
        (date, index) => {

            const dateObject =
                new Date(
                    `${date}T12:00:00`
                );


            let day;


            if (index === 0) {

                day = "Hoje";

            } else {

                day =
                    dateObject.toLocaleDateString(
                        "pt-BR",
                        {
                            weekday: "short"
                        }
                    );

            }


            const code =
                daily.weather_code[index];


            const max =
                Math.round(
                    daily.temperature_2m_max[index]
                );


            const min =
                Math.round(
                    daily.temperature_2m_min[index]
                );


            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "forecast-card";


            card.innerHTML = `

                <span class="day">
                    ${escapeHTML(
                        capitalize(day)
                    )}
                </span>

                <div class="forecast-icon">
                    ${getWeatherEmoji(code)}
                </div>

                <strong>
                    ${max}°C
                </strong>

                <span class="min">
                    Mín. ${min}°C
                </span>

            `;


            forecast.appendChild(
                card
            );

        }
    );

}


/* =========================================
   CHART
========================================= */

function updateChart() {

    const canvas =
        document.getElementById(
            "temperature-chart"
        );


    if (!canvas)
        return;


    /*
     * Se Chart.js não estiver disponível,
     * o restante do aplicativo continua
     * funcionando normalmente.
     */

    if (
        typeof Chart ===
        "undefined"
    ) {

        chartFallback.classList.remove(
            "hidden"
        );

        return;

    }


    chartFallback.classList.add(
        "hidden"
    );


    if (temperatureChart) {

        temperatureChart.destroy();

    }


    const daily =
        currentCity.weather.daily;


    const labels =
        daily.time.map(
            (date, index) => {

                if (index === 0)
                    return "Hoje";


                return new Date(
                    `${date}T12:00:00`
                ).toLocaleDateString(
                    "pt-BR",
                    {
                        weekday: "short"
                    }
                );

            }
        );


    temperatureChart =
        new Chart(
            canvas,
            {

                type: "line",


                data: {

                    labels,


                    datasets: [

                        {

                            label:
                                "Máxima",

                            data:
                                daily.temperature_2m_max,

                            borderColor:
                                "#2563eb",

                            backgroundColor:
                                "rgba(37,99,235,0.10)",

                            fill: true,

                            tension: 0.4,

                            pointRadius: 4,

                            pointHoverRadius: 6

                        },


                        {

                            label:
                                "Mínima",

                            data:
                                daily.temperature_2m_min,

                            borderColor:
                                "#94a3b8",

                            backgroundColor:
                                "transparent",

                            fill: false,

                            tension: 0.4,

                            pointRadius: 3,

                            pointHoverRadius: 5

                        }

                    ]

                },


                options: {

                    responsive: true,

                    maintainAspectRatio: false,


                    interaction: {

                        intersect: false,

                        mode: "index"

                    },


                    plugins: {

                        legend: {

                            position:
                                "bottom",

                            labels: {

                                usePointStyle:
                                    true,

                                padding:
                                    20,

                                boxWidth:
                                    8

                            }

                        }

                    },


                    scales: {

                        y: {

                            border: {

                                display:
                                    false

                            },

                            grid: {

                                color:
                                    "rgba(148,163,184,0.12)"

                            },

                            ticks: {

                                callback:
                                    value =>
                                        `${value}°`

                            }

                        },


                        x: {

                            border: {

                                display:
                                    false

                            },

                            grid: {

                                display:
                                    false

                            }

                        }

                    }

                }

            }
        );

}


/* =========================================
   FAVORITES
========================================= */

function toggleFavorite() {

    if (!currentCity)
        return;


    const exists =
        favorites.some(
            city =>
                city.latitude ===
                    currentCity.latitude
                &&
                city.longitude ===
                    currentCity.longitude
        );


    if (exists) {

        favorites =
            favorites.filter(
                city =>
                    !(
                        city.latitude ===
                            currentCity.latitude
                        &&
                        city.longitude ===
                            currentCity.longitude
                    )
            );

    } else {

        favorites.push({

            name:
                currentCity.name,

            country:
                currentCity.country,

            admin1:
                currentCity.admin1,

            latitude:
                currentCity.latitude,

            longitude:
                currentCity.longitude

        });

    }


    saveFavorites();

    renderFavorites();

    updateFavoriteButton();

}


function updateFavoriteButton() {

    if (!currentCity)
        return;


    const exists =
        favorites.some(
            city =>
                city.latitude ===
                    currentCity.latitude
                &&
                city.longitude ===
                    currentCity.longitude
        );


    favoriteButton.classList.toggle(
        "active",
        exists
    );


    favoriteIcon.textContent =
        exists
            ? "★"
            : "☆";


    favoriteText.textContent =
        exists
            ? "Favoritado"
            : "Favoritar";

}


/* =========================================
   SAVE FAVORITES
========================================= */

function saveFavorites() {

    try {

        localStorage.setItem(
            "weatherFavorites",
            JSON.stringify(
                favorites
            )
        );

    } catch (err) {

        console.warn(
            "Não foi possível salvar favoritos.",
            err
        );

    }

}


/* =========================================
   RENDER FAVORITES
========================================= */

function renderFavorites() {

    if (!favoritesList)
        return;


    if (!favorites.length) {

        favoritesList.innerHTML = `

            <div class="empty-favorites">

                <span class="empty-favorites-icon">
                    ☆
                </span>

                <p>
                    Nenhuma cidade favoritada.
                </p>

                <span>
                    Pesquise uma cidade e adicione aos favoritos.
                </span>

            </div>

        `;


        return;

    }


    favoritesList.innerHTML = "";


    favorites.forEach(
        (city, index) => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "favorite-city";


            item.innerHTML = `

                <span class="favorite-pin">
                    ●
                </span>

                <div class="city-info">

                    <strong>
                        ${escapeHTML(
                            city.name
                        )}
                    </strong>

                    <span>
                        ${escapeHTML(
                            city.admin1 ||
                            city.country ||
                            ""
                        )}
                    </span>

                </div>

                <button
                    type="button"
                    class="remove-favorite"
                    aria-label="Remover cidade"
                >
                    ×
                </button>

            `;


            item
                .querySelector(
                    ".city-info"
                )
                .addEventListener(
                    "click",
                    () => {

                        searchCity(
                            city.name
                        );

                    }
                );


            item
                .querySelector(
                    ".remove-favorite"
                )
                .addEventListener(
                    "click",
                    event => {

                        event.stopPropagation();


                        favorites.splice(
                            index,
                            1
                        );


                        saveFavorites();

                        renderFavorites();

                        updateFavoriteButton();

                    }
                );


            favoritesList.appendChild(
                item
            );

        }
    );

}


/* =========================================
   THEME
========================================= */

function initializeTheme() {

    let savedTheme = null;


    try {

        savedTheme =
            localStorage.getItem(
                "weatherTheme"
            );

    } catch {

        savedTheme = null;

    }


    if (
        savedTheme === "dark"
    ) {

        document.body.classList.add(
            "dark"
        );

    }


    updateThemeIcon();

}


function toggleTheme() {

    const dark =
        document.body.classList.toggle(
            "dark"
        );


    try {

        localStorage.setItem(
            "weatherTheme",
            dark
                ? "dark"
                : "light"
        );

    } catch {

        console.warn(
            "Não foi possível salvar o tema."
        );

    }


    updateThemeIcon();

}


function updateThemeIcon() {

    if (!themeIcon)
        return;


    const dark =
        document.body.classList.contains(
            "dark"
        );


    themeIcon.textContent =
        dark
            ? "☀"
            : "☾";

}


/* =========================================
   LOADING
========================================= */

function showLoading() {

    loading.classList.remove(
        "hidden"
    );


    searchButton.disabled =
        true;


    searchButton.textContent =
        "Buscando...";

}


function hideLoading() {

    loading.classList.add(
        "hidden"
    );


    searchButton.disabled =
        false;


    searchButton.textContent =
        "Buscar";

}


/* =========================================
   ERROR
========================================= */

function showError(
    message
) {

    errorMessage.textContent =
        message;


    error.classList.remove(
        "hidden"
    );

}


function hideError() {

    error.classList.add(
        "hidden"
    );

}


/* =========================================
   HELPERS
========================================= */

function capitalize(
    text
) {

    if (!text)
        return "";


    return (
        text.charAt(0).toUpperCase() +
        text.slice(1)
    );

}


function escapeHTML(
    value
) {

    return String(value)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );

}