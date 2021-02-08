function handleInput() {
    var user = document.getElementById("user").value !== "" ? document.getElementById("user").value : 'ahmedhamedaly';
    var token = document.getElementById("token").value !== "" ? document.getElementById("token").value : undefined;

    if (chart1 != null) chart1.destroy();
    if (chart2 != null) chart2.destroy();

    main(user, token);
}

async function getRequest(url, token) {

    const headers = {
        'Authorization': `Token ${token}`
    }

    const response = (token == undefined) ? await fetch(url) : await fetch(url, {
        "method": "GET",
        "headers": headers
    });

    let data = await response.json();
    return data;
}

async function main(user, token) {
    var url = `https://api.github.com/users/${user}/repos`;
    var repo = await getRequest(url, token);

    url = `https://api.github.com/users/${user}`;
    var user_inf = await getRequest(url, token);
    
    introduction(user_inf);
    language_pieChart(repo, user, token);
    commitsNumber_lineChart(repo, user, token)
}

function introduction(user_info) {
    let img = document.getElementById('img');
    img.src = user_info.avatar_url

    let name = document.getElementById('name');
    name.innerHTML = `<b>Name: </b>${user_info.name}`;

    let login = document.getElementById('login');
    login.innerHTML = `<b>Login ID: </b>${user_info.login}`;

    let bio = document.getElementById('bio');
    bio.innerHTML = `<b>Bio: </b>${user_info.bio == null ? 'User hasn\'t set a bio :(' : user_info.bio}`;

    let created_at = document.getElementById('created_at');
    created_at.innerHTML = `<b>Started From </b>${user_info.created_at}`;

    let followers = document.getElementById('followers');
    followers.innerHTML = `<b>Followers: </b>${user_info.followers}`;

    let following = document.getElementById('following');
    following.innerHTML = `<b>Following: </b>${user_info.following}`;

    let location = document.getElementById('location');
    location.innerHTML = `<b>Location: </b>${user_info.location}`;

    let public_repos = document.getElementById('public_repos');
    public_repos.innerHTML = `<b>Public Repos: </b>${user_info.public_repos}`;
}

async function language_pieChart(repo, user, token) {
    let label = [];
    let data = [];
    let backgroundColor = [];

    for (i in repo) {
        let url = `https://api.github.com/repos/${user}/${repo[i].name}/languages`;
        let languages = await getRequest(url, token).catch(error => console.error(error));

        for (language in languages) {

            if (label.includes(language)) {
                for (i = 0; i < label.length; i++)
                    if (language == label[i])
                        data[i] = data[i] + languages[language];

            } else {
                label.push(language);
                data.push(languages[language]);
                backgroundColor.push(`rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.2)`);
            }
        }

    }

    pie_chart('language', label, data, backgroundColor);
}

function pie_chart(ctx, label, data, backgroundColor) {

    let myChart = document.getElementById(ctx).getContext('2d');

    chart1 = new Chart(myChart, {
        type: 'pie',
        data: {
            labels: label,
            datasets: [{
                label: 'languages',
                data: data,
                backgroundColor: backgroundColor,
                borderWidth: 1,
                borderColor: '#444',
                hoverBorderWidth: 2,
                hoverBorderColor: '#000'
            }],

        },
        options: {
            title: {
                display: true,
                text: "Languages",
                fontSize: 20
            },
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    fontColor: '#000'
                }
            },
            layout: {
                padding: {
                    left: 50,
                    right: 0,
                    bottom: 0,
                    top: 0
                }
            },
            tooltips: {
                enabled: true
            }
        }
    });
}



async function commitsNumber_lineChart(repo, user, token) {
    var label = [];
    var data = [];
    var backgroundColor = [];
    var days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    for (i in repo) {
        var url = `https://api.github.com/repos/${user}/${repo[i].name}/commits?per_page=100`;
        var commits = await getRequest(url, token).catch(error => console.error(error));

        for (j in commits) {
            var date = commits[j].commit.author.date;
            var d = new Date(date);
            var day = days[d.getDay()];
            if (label.includes(day)) {
                for (i = 0; i < label.length; i++)
                    if (day == label[i])
                        data[i] += 1;
            } else {
                label.push(day);
                data.push(1);
                backgroundColor.push(`rgba(${Math.floor(Math.random() * 50)}, ${Math.floor(Math.random() * 150)}, ${Math.floor(Math.random() * 250)}, 0.9)`);
            }
        }
    }
    line_chart('commits', `commits in a week`, label, data, backgroundColor);
}

function line_chart(ctx,titvarext, label, data, backgroundColor) {
    var myChart = document.getElementById(ctx).getContext('2d');
    chart2 = new Chart(myChart, {
        type: 'line',
        data: {
            labels: label,
            datasets: [{
                label: "number of commits",
                data: data,
                backgroundColor: backgroundColor,
                borderColor: '#fff',
                hoverBorderWidth: 2,
                hoverBorderColor: '#fff'
            }],
        },
        options: {
            title: {
                display: true,
                text: titvarext,
                fontSize: 20,
            }
        }
    });
}



var chart1 = null;
var chart2 = null;
