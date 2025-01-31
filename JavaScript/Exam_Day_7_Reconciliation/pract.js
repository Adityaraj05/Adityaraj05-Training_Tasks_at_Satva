month = ["jan", "March", "Karna", "tanu", "amnu"]


const filteredMonths = month.filter((month)=>{
    for (let i= 0; i<month.length; i++){
        if(month[i] === 'm' || month[i] === 'M'){
            return month;
        }
    }

})

console.log(filteredMonths);

// or

let result = month.filter((month)=>{
    return month.toLowerCase().includes('m')
})

console.log(result)