import abbreviation

console.log(statesData);
       
       //API DATA
      // data = [{name:"AL", info:"stuff"},{name:"AK", info:"More Stuff"},{name:'AR', info:"Even more stuff"}]
      
    //    for (i = 0; i < 56; i++) {
    //        let abrv = abrivs[i]
    //        console.log(abrv)
    //        //data.append({name: })
    //    }
 


    //    let modifiedStateData = statesData.features.map(state=>{
    //        let dataId = abrivs[state.properties.name] //AL
    //        let stateData = data.find(d=>d.name === dataId)
    //        if(stateData){
    //            state.properties.info = stateData.info;
    //        }
    //        return state;
    //    })
       //console.log(modifiedStateData)
       
        // 
function fetchStates() {
   fetch('https://covidtracking.com/api/states') 
   .then(function(resp) { return resp.json() }) // Convert data to json
    .then(function(data) {
       
       let results = data.map(stat => {
            let stateName = abrivs.find(s=>s.abbreviation === stat.state).name

            let modItem = statesData.features.find(s=>s.properties.name === stateName)

            // If the item includes deaths/not nill, s
            if (modItem) {
                // setting new keys with their respective values
                modItem.properties.deaths = stat.death
                modItem.properties.positiveCases = stat.positive
                modItem.properties.totalTests = stat.totalTestResults
                //console.log(stat)
            }

            //console.log(modItem)
            return modItem

       })

       console.log(results)

        // For each character, check if name is nil
    //    for (i = 0; i < data.length; i++) {
    //        if (data[0].death != "") {
    //            let stateTitle = document.createElement('h3')
    //            stateTitle.innerText = "State: "+data[i].state
    //            document.body.append(stateTitle)
 
    //            let _data = data[i]
 
    //            addLabel("Death: "+_data.death)
    //            addLabel("Hospitalized: "+_data.hospitalized)
    //            addLabel("Recovered: "+_data.recovered)
 
    //        }
    //    }
    //    console.log(data)
   })
   
fetchStates()
