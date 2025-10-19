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
    // Show the entire 2025 MLB season (regular + postseason)
    const endpoint = 'https://statsapi.mlb.com/api/v1/schedule?sportId=1&startDate=2025-03-01&endDate=2025-11-01';

    fetch(endpoint)
        .then(res => res.json())
        .then(data => showSchedule(data.dates))
        .catch(err => console.error("Error fetching schedule:", err));
}

function showSchedule(dates) {
    if (!dates || dates.length === 0) {
        document.querySelector(".schedule").innerHTML = "<p>No games found for the 2025 season.</p>";
        return;
    }

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

// Initialize only on schedule page
if (document.body.classList.contains('p-schedule')) {
    getSchedule();
}




//======= Results Page ========
// Fetch all 2025 game results (regular + postseason)
const resultsEndpoint = 'https://statsapi.mlb.com/api/v1/schedule?sportId=1&startDate=2025-03-01&endDate=2025-11-01';

function getResults() {
    fetch(resultsEndpoint)
        .then(res => res.json())
        .then(data => showResults(data.dates))
        .catch(err => console.error("Error fetching results:", err));
}

function showResults(dates) {
    if (!dates || dates.length === 0) {
        document.querySelector(".results").innerHTML = "<p>No game results found for the 2025 season.</p>";
        return;
    }

    // Flatten all games into one array
    const allGames = dates.flatMap(day =>
        day.games.map(game => {
            const awayScore = game.teams.away.score ?? '-';
            const homeScore = game.teams.home.score ?? '-';
            const winner =
                awayScore > homeScore
                    ? game.teams.away.team.name
                    : homeScore > awayScore
                        ? game.teams.home.team.name
                        : 'Tie';
            return {
                date: day.date,
                away: game.teams.away.team.name,
                home: game.teams.home.team.name,
                awayScore,
                homeScore,
                winner
            };
        })
    );

    if (allGames.length === 0) {
        document.querySelector(".results").innerHTML = "<p>No results available in this date range.</p>";
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
} else if (document.body.classList.contains('p-results')) {
    getResults();
}

// =============== PLAYERS PAGE ===============
// MLB Stats API endpoints
const TEAMS_ENDPOINT = 'https://statsapi.mlb.com/api/v1/teams?sportId=1&season=2025';
const ROSTER_ENDPOINT = (teamId) => `https://statsapi.mlb.com/api/v1/teams/${teamId}/roster?rosterType=active`;

// MLB headshot URL pattern (small square)
const headshotUrl = (personId) =>
    `https://img.mlbstatic.com/mlb-photos/image/upload/w_96,h_96,c_fill,f_auto,q_auto/v1/people/${personId}/headshot/67/current`;

async function getTeamsAndInitPlayers() {
    const teamSelect = document.getElementById('teamSelect');
    const grid = document.querySelector('.players-grid');
    if (!teamSelect || !grid) return;

    try {
        const res = await fetch(TEAMS_ENDPOINT);
        const data = await res.json();
        const teams = (data.teams || [])
            .filter(t => t.sport?.id === 1 && t.active !== false)
            .sort((a, b) =>
                (a.league?.id || 0) - (b.league?.id || 0) ||
                (a.division?.id || 0) - (b.division?.id || 0) ||
                a.name.localeCompare(b.name)
            );

        // Populate dropdown
        teamSelect.innerHTML = teams.map(t =>
            `<option value="${t.id}">${t.name}</option>`
        ).join('');

        // Load first team by default
        if (teams.length) {
            await loadRoster(teams[0].id);
        }

        // On team change
        teamSelect.addEventListener('change', async (e) => {
            const teamId = e.target.value;
            await loadRoster(teamId);
        });

    } catch (err) {
        console.error('Error loading teams:', err);
        grid.innerHTML = `<p>Sorry, couldn’t load teams.</p>`;
    }
}

async function loadRoster(teamId) {
    const grid = document.querySelector('.players-grid');
    const teamSelect = document.getElementById('teamSelect');
    if (!grid) return;
    grid.innerHTML = `<p>Loading roster…</p>`;

    try {
        const res = await fetch(ROSTER_ENDPOINT(teamId));
        const data = await res.json();
        const roster = data.roster || [];

        if (!roster.length) {
            grid.innerHTML = `<p>No active roster found.</p>`;
            return;
        }

        const teamName = teamSelect?.selectedOptions?.[0]?.text || 'Team';

        // Build player cards with position and stats
        const playerCards = await Promise.all(
            roster.map(async (item) => {
                const player = item.person || {};
                const name = player.fullName || 'Unknown';
                const pid = player.id;
                const position = item.position?.abbreviation || 'UNK';
                const positionFull = item.position?.name || 'Unknown Position';

                // ✅ Corrected: use abbreviation to detect pitchers
                const isPitcher = position === 'P';

                const img = pid ? headshotUrl(pid) : '';

                // Get 2025 season stats
                const stats = await getPlayerStats(pid, isPitcher);
                const battingAvg = stats?.battingAvg || '-';
                const homeRuns = stats?.homeRuns || '-';
                const rbi = stats?.rbi || '-';
                const era = stats?.era || '-';
                const wins = stats?.wins || '-';
                const losses = stats?.losses || '-';
                const strikeOuts = stats?.strikeOuts || '-';

                return `
          <div class="player-card">
            <img src="${img}" alt="${name}" loading="lazy" />
            <div class="player-meta">
              <div class="player-name">${name}</div>
              <div class="player-position">${position} — ${positionFull}</div>
              <div class="player-team">${teamName}</div>
              <div class="player-stats">
                ${isPitcher ? `
                  <div>ERA: ${era}</div>
                  <div>W-L: ${wins}-${losses}</div>
                  <div>SO: ${strikeOuts}</div>
                ` : `
                  <div>AVG: ${battingAvg}</div>
                  <div>HR: ${homeRuns}</div>
                  <div>RBI: ${rbi}</div>
                `}
              </div>
            </div>
          </div>
        `;
            })
        );

        grid.innerHTML = playerCards.join('');

    } catch (err) {
        console.error('Error loading roster:', err);
        grid.innerHTML = `<p>Sorry, couldn’t load roster.</p>`;
    }
}

// Fetch player stats for 2025 (batting or pitching)
async function getPlayerStats(playerId, isPitcher) {
    const statType = isPitcher ? 'pitching' : 'batting';
    const endpoint = `https://statsapi.mlb.com/api/v1/people/${playerId}/stats?stats=season&group=${statType}&season=2025`;

    try {
        const res = await fetch(endpoint);
        const data = await res.json();

        const stat = data.stats?.[0]?.splits?.[0]?.stat;
        if (!stat) return null;

        if (isPitcher) {
            return {
                era: stat.era ?? null,
                wins: stat.wins ?? null,
                losses: stat.losses ?? null,
                strikeOuts: stat.strikeOuts ?? null,
            };
        } else {
            return {
                battingAvg: stat.avg ?? null,
                homeRuns: stat.homeRuns ?? null,
                rbi: stat.rbi ?? null,
            };
        }
    } catch (err) {
        console.error(`Error fetching stats for player ${playerId}:`, err);
        return null;
    }
}

// ====== PAGE ROUTING ======
document.addEventListener('DOMContentLoaded', () => {
    if (document.body.classList.contains('p-home')) {
        getStandings?.();
    } else if (document.body.classList.contains('p-schedule')) {
        getSchedule?.();
    } else if (document.body.classList.contains('p-results')) {
        getResults?.();
    } else if (document.body.classList.contains('p-players')) {
        getTeamsAndInitPlayers();
    }
});















