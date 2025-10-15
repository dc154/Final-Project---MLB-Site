const apikey = "zSW2sRQaCoNIkI21eghtoa5Gf7kWN33A"
const endpoint = `https://api.nytimes.com/svc/topstories/v2/nyregion.json?api-key=${apikey}`

function getStories(event) {

    fetch(endpoint)
        .then((response) => response.json())
        .then((data) => showData(data.results));
}
function showData(stories) {

    let looped = stories.map((story) =>
        `<div class="item">
${story.multimedia ?
            `<picture>
    <img src="${story.multimedia[2].url}" alt="" />
    <caption>${story.multimedia[2].caption}</caption>
    </picture>`
            : ``

        }

    <h3>${story.title}</h3>
    <p>${story.abstract}</p>
    </div>`
    )
        .join("");
    document.querySelector(".stories").innerHTML = looped;
}

if (document.querySelector('.p-home')) {
    getStories();
}

