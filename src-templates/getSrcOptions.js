module.exports = {
    opts: [
        { 
            folder: "simple", 
            description: "0 - Simple Chart with no callbacks or controls (default)",
            datapath: 'https://raw.githubusercontent.com/RhoInc/data-library/master/data/miscellaneous/elements.csv' 

        },
        { 
            folder: "linkedListing", 
            description: "1 - Line Chart with controls and linked listing defined in callbacks",
            datapath: 'https://raw.githubusercontent.com/RhoInc/data-library/master/data/clinical-trials/sdtm/cdisc-pilot-01/lb.csv' 

        }
    ]
}