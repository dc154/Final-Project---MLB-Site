// const apikey = "zSW2sRQaCoNIkI21eghtoa5Gf7kWN33A"
// const endpoint = `https://api.nytimes.com/svc/topstories/v2/nyregion.json?api-key=${apikey}`

// function getStories(event) {

//     fetch(endpoint)
//         .then((response) => response.json())
//         .then((data) => showData(data.results));
// }
// function showData(stories) {

//     let looped = stories.map((story) =>
//         `<div class="item">
// ${story.multimedia ?
//             `<picture>
//     <img src="${story.multimedia[2].url}" alt="" />
//     <caption>${story.multimedia[2].caption}</caption>
//     </picture>`
//             : ``

//         }

//     <h3>${story.title}</h3>
//     <p>${story.abstract}</p>
//     </div>`
//     )
//         .join("");
//     document.querySelector(".stories").innerHTML = looped;
// }

// if (document.querySelector('.p-home')) {
//     getStories();
// }

//---------------------------------------------------//

//Final Projet MLB API

// const apikey = "zSW2sRQaCoNIkI21eghtoa5Gf7kWN33A"
// MLB API Endpoints
const standingsEndpoint = "https://statsapi.mlb.com/api/v1/standings?leagueId=103,104";
const scheduleEndpoint = "https://statsapi.mlb.com/api/v1/schedule?sportId=1";

// ====== HOMEPAGE (STANDINGS) ======
function getStandings() {
    fetch("https://statsapi.mlb.com/api/v1/standings?leagueId=103,104")
        .then(response => response.json())
        .then(data => {
            console.log(data.records[0]); // See full object structure
            showStandings(data.records);
        })
        .catch(err => console.error("Error fetching standings:", err));
}

function showStandings(records) {
    const divisionNames = [
        "American League East",
        "American League Central",
        "American League West",
        "National League East",
        "National League Central",
        "National League West"
    ];

    const html = records.map((record, index) => {
        const teams = record.teamRecords.map(team => `
            <tr>
                <td>${team.team.name}</td>
                <td>${team.wins}</td>
                <td>${team.losses}</td>
                <td>${team.winningPercentage}</td>
            </tr>
        `).join("");

        return `
            <div class="division">
                <h2>${divisionNames[index] || "Unknown Division"}</h2>
                <table>
                    <tr>
                        <th>Team</th>
                        <th>Wins</th>
                        <th>Losses</th>
                        <th>Win %</th>
                    </tr>
                    ${teams}
                </table>
            </div>
        `;
    }).join("");

    document.querySelector(".stories").innerHTML = html;
}


if (document.querySelector('.p-home')) {
    getStandings();
}




// ====== SCHEDULE PAGE ======
function getSchedule() {
    const endpoint = 'https://statsapi.mlb.com/api/v1/schedule?sportId=1&startDate=2025-03-01&endDate=2025-11-01';
    fetch(endpoint)
        .then(res => res.json())
        .then(data => showSchedule(data.dates))
        .catch(err => console.error("Error fetching schedule:", err));
}

function showSchedule(dates) {
    const html = dates.map(day => {
        const games = day.games.map(game => {
            const gameDate = new Date(game.gameDate);
            const gameTime = gameDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            return `
                <tr>
                    <td>${game.teams.away.team.name}</td>
                    <td>at</td>
                    <td>${game.teams.home.team.name}</td>
                    <td>${gameTime}</td>
                </tr>
            `;
        }).join("");

        return `
            <div class="date-block">
                <h2>${day.date}</h2>
                <table>
                    <tr>
                        <th>Away</th>
                        <th></th>
                        <th>Home</th>
                        <th>Time</th>
                    </tr>
                    ${games}
                </table>
            </div>
        `;
    }).join("");

    document.querySelector(".schedule").innerHTML = html;
}

if (document.body.classList.contains('p-schedule')) {
    getSchedule();
}


//======= Results Page ========
const resultsEndpoint = 'https://statsapi.mlb.com/api/v1/schedule?sportId=1&startDate=2025-03-01&endDate=2025-11-01';

function getResults() {
    fetch(resultsEndpoint)
        .then(res => res.json())
        .then(data => showResults(data.dates))
        .catch(err => console.error("Error fetching results:", err));
}

function showResults(dates) {
    // Flatten all games into one array
    const allGames = dates.flatMap(day => day.games.map(game => {
        const awayScore = game.teams.away.score ?? '-';
        const homeScore = game.teams.home.score ?? '-';
        const winner = awayScore > homeScore ? game.teams.away.team.name :
            homeScore > awayScore ? game.teams.home.team.name :
                'Tie';
        return {
            date: day.date,
            away: game.teams.away.team.name,
            home: game.teams.home.team.name,
            awayScore,
            homeScore,
            winner
        };
    }));

    if (allGames.length === 0) {
        document.querySelector(".results").innerHTML = "<p>No results available.</p>";
        return;
    }

    const html = allGames.map(game => `
        <tr>
            <td>${game.date}</td>
            <td>${game.away}</td>
            <td>${game.awayScore}</td>
            <td>at</td>
            <td>${game.homeScore}</td>
            <td>${game.home}</td>
            <td>${game.winner}</td>
        </tr>
    `).join("");

    document.querySelector(".results").innerHTML = `
        <table>
            <tr>
                <th>Date</th>
                <th>Away</th>
                <th>Score</th>
                <th></th>
                <th>Score</th>
                <th>Home</th>
                <th>Winner</th>
            </tr>
            ${html}
        </table>
    `;
}

// Page routing
if (document.body.classList.contains('p-home')) {
    getStandings();
} else if (document.body.classList.contains('p-schedule')) {
    getSchedule();
} else if (document.body.classList.contains('p-results')) { // note the "p-results" match your body class
    getResults();
}









