var app = new Vue({
    el: '#app',
    data: {
        vmembers: [],
        checkedParties: ["R", "D", "I"],
        checkedPartiesOS: ["Republican", "Democratic", "Independent"],
        sel: "ALL",
        vestados: [],
        ppurl: "",
        mdLegUrl: "",
        mdlegislators: {},
        mdOver: "",
        md: ""
    },
    computed: {
        lealtad: function () {
            if (this.vmembers[0]) {
                let reps = { id: "R", name: "Republicans", cuantos: 0, leal: 0 }
                let dems = { id: "D", name: "Democrats", cuantos: 0, leal: 0 }
                let inds = { id: "I", name: "Independents", cuantos: 0, leal: 0 }
                let result = [reps, dems, inds]
                for (m = 0; m < this.vmembers.length; m++) {
                    if (this.vmembers[m].party == "R") {
                        reps.cuantos++
                        reps.leal += this.vmembers[m].votes_with_party_pct
                    } else if (this.vmembers[m].party == "D") {
                        dems.cuantos++
                        dems.leal += this.vmembers[m].votes_with_party_pct
                    } else if (this.vmembers[m].party == "I") {
                        inds.cuantos++
                        inds.leal += this.vmembers[m].votes_with_party_pct
                    }

                }
                for (r = 0; r < result.length; r++) {
                    result[r].leal = (result[r].leal / result[r].cuantos).toFixed(2)
                }

                return result
            }
        },
        faltantes: function () {

            let porFaltasDec = [...this.vmembers].sort((a, b) => b.missed_votes - a.missed_votes)
            if (porFaltasDec[2]) { console.log(porFaltasDec[0]) }

            let topFaltantes = []

            if (porFaltasDec[2]) {
                let i = 0
                //console.log(porFaltasDec.length / 10)
                while (i < porFaltasDec.length / 10 || porFaltasDec[i + 1].missed_votes == porFaltasDec[i].missed_votes) {
                    topFaltantes.push(porFaltasDec[i])
                    topFaltantes[i].pc_falt = (topFaltantes[i].missed_votes * 100 / topFaltantes[i].total_votes).toFixed(2)


                    i++;
                }
                // console.log(topFaltantes)
                return topFaltantes
            }

            return topFaltantes

        },



        votantes: function () {
            let porFaltas = [... this.vmembers].sort((a, b) => a.missed_votes - b.missed_votes)
            let topVotantes = []
            let v = 0
            while (v < porFaltas.length / 10 || porFaltas[v - 1].missed_votes == porFaltas[v].missed_votes) {
                topVotantes.push(porFaltas[v])
                topVotantes[v].pc_falt = (topVotantes[v].missed_votes * 100 / topVotantes[v].total_votes).toFixed(2)
                v++
            }

            return topVotantes

        },




        least: function () {
            let porInfiel = [... this.vmembers].sort((a, b) => a.votes_with_party_pct - b.votes_with_party_pct)
            let topInfiel = []
            let v = 0
            while (v < porInfiel.length / 10 || porInfiel[v - 1].votes_with_party_pct == porInfiel[v].votes_with_party_pct) {
                topInfiel.push(porInfiel[v])

                v++
            }

            return topInfiel

        },



        most: function () {
            let porFiel = [... this.vmembers].sort((a, b) => b.votes_with_party_pct - a.votes_with_party_pct)
            let topFiel = []
            let v = 0
            while (v < porFiel.length / 10 || porFiel[v - 1].votes_with_party_pct == porFiel[v].votes_with_party_pct) {
                topFiel.push(porFiel[v])

                v++
            }

            return topFiel

        },



        armarSelect: function () {
            estados = []
            for (m = 0; m < this.vmembers.length; m++) {
                if (estados.indexOf(this.vmembers[m].state) < 0) {
                    estados.push(this.vmembers[m].state)
                }

            }

            estados = estados.sort()
            estados.unshift("ALL")
            return estados
        },

        activados: function () {
            listaFiltrada = []

            var checkados = this.checkedParties

            for (m = 0; m < this.vmembers.length; m++) {
                if (checkados.indexOf(this.vmembers[m].party) != -1 && (this.sel == "ALL" || this.sel == this.vmembers[m].state)) {
                    listaFiltrada.push(this.vmembers[m])


                }

            }
            console.log(checkados)
            return listaFiltrada
        },

        activadosM: function () {
            listaFiltrada = []

            var checkados = this.checkedPartiesOS
            console.log(checkados)

            for (m = 0; m < this.mdlegislators.length; m++) {
                if (checkados.indexOf(this.mdlegislators[m].party) != -1 && (this.sel == "ALL" || this.sel == this.mdlegislators[m].state)) {
                    listaFiltrada.push(this.mdlegislators[m])


                }

            }
            return listaFiltrada
        }
    }
}
)
/* 
fetch("https://api.propublica.org/congress/v1/115/senate/members.json", { headers: { "X-API-Key": " CLCkTrBF2iMWiWtvWcqXQvF8yRV2HMVtmRSSeB5L" } })
    .then(response => {
        return response.json()

    }
    )
    .then(json => {
        members = json.results[0].members
        app.members = members

        app.vmembers = members
    }) */
//console.log("jjj", app.vmembers)
//localStorage.setItem('data',JSON.stringify(members))
//console.log(JSON.parse(localStorage.data))


//////////////////////////////////

//sessionStorage.clear()


function cachedFetch(url, init, cacheKey = url) {

    let x;
    let cached = sessionStorage.getItem(cacheKey);
    if (cached !== null) {

        x = JSON.parse(sessionStorage.getItem(cacheKey))
        //console.log("esto devuelve si no fetch", x)
        return x;
    } else {
        return fetch(url, init).then(response => {
            if (response.status === 200) {
                // response.clone().text().then(content => {
                //sessionStorage.setItem(cacheKey, content);
                //app.vmembers=JSON.parse(sessionStorage.getItem(cacheKey)).results[0].members
                //console.log(JSON.parse(sessionStorage.getItem(cacheKey)))
                return response.json()

            } else { alert(response.statusText) }

        }).then(function (json) {
            x = json
            sessionStorage.setItem(cacheKey, JSON.stringify(json));
            //console.log("esto devuelve si  fetch", x)
            return x
        })
    }


}

let pp_url = "https://api.propublica.org/congress/v1/115/senate/members.json"
let pp_opt = { headers: { "X-API-Key": " CLCkTrBF2iMWiWtvWcqXQvF8yRV2HMVtmRSSeB5L" } }
let url = pp_url
app.ppurl = pp_url
let options = pp_opt
app.vmembers = (cachedFetch(url, options)).results[0].members
console.log(app.vmembers)

//sessionStorage.setItem(pp_url,0)

url = "https://openstates.org/api/v1/legislators/?apikey=8cfd1a43-b3c1-40a6-a7e4-c5d39aa343a3&state=md"
app.mdLegUrl = url
options = {}
app.mdlegislators = cachedFetch(url, options)
console.log('mdleg', app.mdlegislators)
//console.log('open', cachedFetch(url, options))

url = "https://openstates.org/api/v1/metadata/md/?apikey=8cfd1a43-b3c1-40a6-a7e4-c5d39aa343a3"
app.mdOver = url
options = {}
app.md = cachedFetch(url, options)
//console.log('mdover', app.md)
//console.log('open', cachedFetch(url, options))




///////////////////////////////


function getChamberTitle() {
    for (m = 0; m < app.mdlegislators.length; m++) {
        let camara = app.mdlegislators[m].chamber
        //console.log (md.chambers[camara].title)
        app.mdlegislators[m].memberTitle = app.md.chambers[camara].title
    }
}

getChamberTitle()


//////////////////////////////////////

document.getElementById("popup").showpopup = function () {
    document.getElementById("popup").style.display = "block";
    document.getElementById('iframe').src = "http://example.com";
    document.getElementById('page').className = "darken";
    document.getElementById("page").style.display = "block";
}

document.getElementById("bModal").onclick = function (e) {
    e.preventDefault();
    document.getElementById("popup").showpopup();
}

document.getElementById('page').onclick = function () {
    if (document.getElementById("popup").style.display == "block") {
        document.getElementById("popup").style.display = "none";
        document.getElementById("page").style.display = "none";
        document.getElementById('page').className = "";
    }
};