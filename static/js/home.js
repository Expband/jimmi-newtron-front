import {Config} from "./Config.js";

let app = new Vue({
    mode: 'production',
    el: '#app',
    data: {
        user: {
            phone: "+380962737288"
        },
        cookieValue: "",
        config: new Config(),
        jwt : "",
        sources:{},
        new_source:{
            source:"",
            capacity:0,
            is_active:true
        },
        consumers:{}
    },
    methods: {
        async verifyToken() {
            let th = this
            let response = await fetch(th.config.BACKEND + "auth/validate",
                {
                    method: "GET",
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem("access_token"),
                        "Content-Type": "application/json"
                    }
                })
            if (!response.ok) {
                localStorage.removeItem("access_token")
                this.redirect()
            }
        },
        is_notified(){
            if (user.is_notified === true){
                return "rgb(255,2,2)";
            }else{
                return "rgba(57, 252, 25, 0.61)"
            }
        },
        async getUser() {
            let th = this
            let suburban = th.jwt["sub"]
            let response = await fetch(th.config.BACKEND + "user?sub=" + suburban,
                {
                    method: "GET",
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem("access_token"),
                        "Content-Type": "application/json"
                    }
                })
            if (response.ok) {
                let data = JSON.parse(await response.text())
                th.user = data.user
                console.log(th.user)
            }
            setTimeout(th.getUser, 15000); // 60000 milliseconds = 1 minute
        },
        redirect() {
            window.location.href = "/login"
        },
        logout() {
            localStorage.removeItem("access_token")
            this.redirect()
        },
        parseJwt(token) {
            var base64Url = token.split('.')[1];
            var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        },
        async getSources(){
            let th = this
            let response = await fetch(th.config.BACKEND + "sources?user_id=" + this.user.id,
                {
                    method: "GET",
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem("access_token"),
                        "Content-Type": "application/json"
                    }
                })
            if (response.ok) {
                let data = JSON.parse(await response.text())
                th.sources = data.sources
                console.log(th.sources)
            }
        },
        showModal(){
            let modal = document.getElementById("modal")
            modal.style.display = "block"

        },
        hideModal(){
            let modal = document.getElementById("modal")
            modal.style.display = "none"
        },
        async createNewSource(){
            let th = this
            th.new_source.user_id=  th.user.id
            let response = await fetch(th.config.BACKEND + "sources",
                {
                    method: "POST",
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem("access_token"),
                        "Content-Type": "application/json"
                    },
                    body:JSON.stringify(th.new_source)
                })
            if (response.ok) {
                th.hideModal()
                th.new_source.source = ""
                th.new_source.capacity= 0
                await this.getSources()
            }
        },
        async getChart(){
            let th = this
            let response = await fetch(th.config.BACKEND + "consumers?user_id=" + this.user.id,
                {
                    method: "GET",
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem("access_token"),
                        "Content-Type": "application/json"
                    }
                })
            if (response.ok) {
                let data = JSON.parse(await response.text()).consumers
                let cnsf = []
                console.log(Object.keys(data))
                for (let i = 0; i <Object.keys(data).length; i ++){
                    let obj = data[Object.keys(data)[i]]
                    cnsf.push(obj)
                }
                console.log(cnsf)
                th.consumers = cnsf
                console.log(th.consumers)
                th.drawChart()
                setTimeout(th.getChart, 15000); // 60000 milliseconds = 1 minute
            }
        },
        async drawChart() {
            document.getElementById("consumers-chart-div").innerHTML = ""
            let consumers = this.consumers;
            console.log(consumers)
            consumers.forEach(d => {
                d.action_time = new Date(d.action_time * 1000);
            });
            let data = consumers
            let container = d3.select("#consumers-chart-div")
            var margin = {top: 10, right: 30, bottom: 30, left: 60},
                width = 900  - margin.right,
                height = 400 - margin.top - margin.bottom;
            // let width = document.getElementById("consumers-chart-div").clientWidth
            console.log(width)

            // let svg = container.append("svg")
            //     .attr(":xmlns:svg", "http://www.w3.org/2000/svg")
            //     .attr("id", "sleep-phase-chart")
            //     .style("width", width)
            //     .style("height", 200)
            //     .attr("class", "thumbnail")
            var svg = d3.select("#consumers-chart-div")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");
            var x = d3.scaleTime()
                .domain(d3.extent(data, function(d) { return d.action_time; }))
                .range([ 0, width ]);
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x));

            var y = d3.scaleLinear()
                .domain([0, d3.max(data, function(d) { return +d.consume; })])
                .range([ height, 0 ]);
            svg.append("g")
                .call(d3.axisLeft(y));

            svg.append("path")
                .datum(data)
                .attr("fill", "none")
                .attr("stroke", "black")
                .attr("stroke-width", 1.5)
                .attr("d", d3.line()
                    .x(function(d) { return x(d.action_time) })
                    .y(function(d) { return y(d.consume) })
                )
        },
        async deleteSource(id){
            let th = this
            let response = await fetch(th.config.BACKEND + "sources?energy_source_id=" + id,
                {
                    method: "DELETE",
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem("access_token"),
                        "Content-Type": "application/json"
                    }
                })
            if (response.ok) {
                location.reload()
            }
        },

    },
    async created() {
        // await this.verifyToken()
        //eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Im5abG5EWFdkTkhfUGl2azAxeC0wUiJ9.eyJpc3MiOiJodHRwczovL2Rldi11NWxlOGNxMW1rcWw4YzJ0LnVzLmF1dGgwLmNvbS8iLCJzdWIiOiJzbXN8NjY2ZWJhZjA0ZDZiZGZkMDM0YTU2MWUyIiwiYXVkIjpbImh0dHBzOi8vYXV0aC1keXBsb21hLWFwaSIsImh0dHBzOi8vZGV2LXU1bGU4Y3ExbWtxbDhjMnQudXMuYXV0aDAuY29tL3VzZXJpbmZvIl0sImlhdCI6MTcxODUzMjk1MCwiZXhwIjoxNzE4NjE5MzUwLCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIiwiYXpwIjoiSXROcmZCMHpxMm93Q2w4UlVvVUFjMlB2VG1wbUxBblIifQ.VUk2zJBjdlETSsTPXxWSs0rKAUwBWC0g_ixRjWHAI7xs4zksmbsuQXXW5YMMM51804P6iRZR7jc9lBZxUzudyjlhO6lJVc9tJsSqeDY9Nu9kjZ5A1GW-53RcbVPIR5IBH_N0lqGbNFrDrZPv9CYRgD-sZTA4zlL6nx6zB2cLs5I9MMAKrvoU9JUwx3sD8HHgJfyDqoq25V4vTSzy0fXkSvGl4IdlPvVJXLXW5aNpJ_mWRS6bb5c1q36PX882qSudzWBsZcd5duC-MXmma9B3yWehBf_7zOsaSz6jTZPdnux0KD5XeTHfxBl01OXw_c-Xo9Ok3Gr3WUZI5nwJ8I6BbA
        // localStorage.setItem("access_token", "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Im5abG5EWFdkTkhfUGl2azAxeC0wUiJ9.eyJpc3MiOiJodHRwczovL2Rldi11NWxlOGNxMW1rcWw4YzJ0LnVzLmF1dGgwLmNvbS8iLCJzdWIiOiJzbXN8NjY2ZWJhZjA0ZDZiZGZkMDM0YTU2MWUyIiwiYXVkIjpbImh0dHBzOi8vYXV0aC1keXBsb21hLWFwaSIsImh0dHBzOi8vZGV2LXU1bGU4Y3ExbWtxbDhjMnQudXMuYXV0aDAuY29tL3VzZXJpbmZvIl0sImlhdCI6MTcxODUzMjk1MCwiZXhwIjoxNzE4NjE5MzUwLCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIiwiYXpwIjoiSXROcmZCMHpxMm93Q2w4UlVvVUFjMlB2VG1wbUxBblIifQ.VUk2zJBjdlETSsTPXxWSs0rKAUwBWC0g_ixRjWHAI7xs4zksmbsuQXXW5YMMM51804P6iRZR7jc9lBZxUzudyjlhO6lJVc9tJsSqeDY9Nu9kjZ5A1GW-53RcbVPIR5IBH_N0lqGbNFrDrZPv9CYRgD-sZTA4zlL6nx6zB2cLs5I9MMAKrvoU9JUwx3sD8HHgJfyDqoq25V4vTSzy0fXkSvGl4IdlPvVJXLXW5aNpJ_mWRS6bb5c1q36PX882qSudzWBsZcd5duC-MXmma9B3yWehBf_7zOsaSz6jTZPdnux0KD5XeTHfxBl01OXw_c-Xo9Ok3Gr3WUZI5nwJ8I6BbA")
        this.jwt = this.parseJwt(localStorage.getItem("access_token"))
        console.log(this.jwt)
        await this.getUser()
        await this.getSources()
        await this.getChart()
    }
})