document.addEventListener('click', clickHandlers);

function clickHandlers(event) {
    if (!event.target.matches('button')) {
        return;
    }
    fetch("https://jsonplaceholder.typicode.com/posts")
        .then((response) => response.json())
        .then((json) => console.log(json));
}
function showData(data) {
    let content = ""
    for (let i = 0; i < data.length; i++) {
        content += `<h3>${data[i].title}</h3>`;

    }
    document.querySelector(".stories").innerText = data[1].body;
}

