const data = [
    {
        "month": "2025-03-01",
        "region": "West",
        "price": 1037,
        "cost": 145.18,
        "product": "Product B",
        "quantity": 3
    },
    {
        "month": "2025-02-01",
        "region": "East",
        "price": 1344,
        "cost": 134.4,
        "product": "Product A",
        "quantity": 1
    },
    {
        "month": "2025-03-01",
        "region": "North",
        "price": 517,
        "cost": 67.21,
        "product": "Product B",
        "quantity": 1
    },
    {
        "month": "2025-05-01",
        "region": "South",
        "price": 2277,
        "cost": 182.16,
        "product": "Product C",
        "quantity": 1
    },
    {
        "month": "2025-04-01",
        "region": "East",
        "price": 977,
        "cost": 175.86,
        "product": "Product D",
        "quantity": 2
    },
    {
        "month": "2025-01-01",
        "region": "West",
        "price": 238,
        "cost": 42.84,
        "product": "Product E",
        "quantity": 2
    },
    {
        "month": "2025-04-01",
        "region": "West",
        "price": 1094,
        "cost": 196.92,
        "product": "Product D",
        "quantity": 2
    },
    {
        "month": "2025-02-01",
        "region": "North",
        "price": 244,
        "cost": 43.92,
        "product": "Product E",
        "quantity": 1
    },
    {
        "month": "2025-05-01",
        "region": "West",
        "price": 1106,
        "cost": 121.66,
        "product": "Product D",
        "quantity": 1
    },
    {
        "month": "2025-01-01",
        "region": "South",
        "price": 649,
        "cost": 77.88,
        "product": "Product B",
        "quantity": 3
    },
    {
        "month": "2025-02-01",
        "region": "West",
        "price": 2373,
        "cost": 142.38,
        "product": "Product C",
        "quantity": 1
    },
    {
        "month": "2025-03-01",
        "region": "East",
        "price": 611,
        "cost": 91.65,
        "product": "Product B",
        "quantity": 1
    },
    {
        "month": "2025-05-01",
        "region": "North",
        "price": 1214,
        "cost": 109.26,
        "product": "Product A",
        "quantity": 3
    },
    {
        "month": "2025-04-01",
        "region": "South",
        "price": 247,
        "cost": 49.4,
        "product": "Product E",
        "quantity": 1
    },
    {
        "month": "2025-01-01",
        "region": "East",
        "price": 1258,
        "cost": 138.38,
        "product": "Product A",
        "quantity": 5
    },
    {
        "month": "2025-04-01",
        "region": "North",
        "price": 670,
        "cost": 100.5,
        "product": "Product B",
        "quantity": 1
    },
    {
        "month": "2025-03-01",
        "region": "South",
        "price": 1307,
        "cost": 130.7,
        "product": "Product A",
        "quantity": 3
    },
    {
        "month": "2025-05-01",
        "region": "East",
        "price": 778,
        "cost": 139.08,
        "product": "Product D",
        "quantity": 10
    },
    {
        "month": "2025-02-01",
        "region": "South",
        "price": 2148,
        "cost": 171.84,
        "product": "Product C",
        "quantity": 1
    },
    {
        "month": "2025-01-01",
        "region": "North",
        "price": 590,
        "cost": 106.2,
        "product": "Product B",
        "quantity": 1
    }
]


// const quantityByRegion = {
//     label: "Quantity by region",
//     keyToCheckFor: 'region',
//     columnsToCalc: [
//         {
//             valuesToMutate: ['price','quantity'],
//             operations: 'multiply',
//             title: 'quantity'
//         },
//         {
//             valuesToMutate: ['price','cost'],
//             operations: 'subtract',
//             title: 'profit'
//         }
//     ]
// }

// const getData = (spec, data) => {...}
//
// const result = getData(quantityByRegion, sampleData);
//
// // Quantity by region
// Region      Quantity(sum)
// West        21
// East        26
// North       25
//
// //
//
// // Multiple columns
// Month       Cost(sum)    Price(sum)   Orders(count)  Quantity(sum)    Num products
// 2025-01-01  210          2100         2              3                2
// 2025-02-01  260          2600         2              8                2
// 2025-03-01  255          2550         2              10               2

const getData = (spec, data) => {
    // console.log('received spec:', spec);
    // console.log('received data:', data);

    const allResults = {};
    data.map(item => {
        const itemKey = item[spec.keyToCheckFor];
        spec.columnsToCalc.forEach(calcSpec => {
            const {operations} = calcSpec;
            if (!allResults[itemKey]) {
                allResults[itemKey] = {};
            }
            if (!allResults[itemKey][calcSpec.title]) {
                allResults[itemKey][calcSpec.title] = 0;
            }


            if (operations === 'multiply') {
                const values = calcSpec.valuesToMutate.map(key => item[key]);
                const result = values.reduce((acc, val) => acc * val, 1);
                // console.log(`For item with ${spec.keyToCheckFor}=${itemKey}, calculated ${calcSpec.title}:`, result);

                allResults[itemKey][calcSpec.title] += result;
            }
            else if (operations === 'subtract') {
                const values = calcSpec.valuesToMutate.map(key => item[key]);
                let test = 0;
                values.reduce((acc,val)=>{
                    console.log(acc,val)
                    test = acc-val;
                })
                allResults[itemKey][calcSpec.title] = test;
            }
        });

    });



    console.log('Final aggregated results:', allResults);
    return allResults;

}


getData({
        label: "Quantity by region",
        keyToCheckFor: 'region',
        columnsToCalc: [
            {
                valuesToMutate: ['price','quantity'],
                operations: 'multiply',
                title: 'quantity'
            },
            {
                valuesToMutate: ['price','cost'],
                operations: 'subtract',
                title: 'profit'
            }
        ]
    },
    data
);
