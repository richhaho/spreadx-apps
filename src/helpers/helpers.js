
import bills from "@/navigation/vertical/bills";
import marketplace from '@/navigation/vertical/marketplace';
import axios_demo from '@/plugins/axios_demo';
import axios_koch from '@/plugins/axios_koch';
import { ref } from "vue";


import { default as sliderBar1, default as sliderBar2 } from '@images/logo.svg';




export const supplierAxiosMapping = ((id) => {
    switch (id) {
        case 1: return axios_demo
            break;
        case 4: return axios_koch
            break;
        default: return null;
            break;
    }
})
export const removeLeadingZeros = (number) => {
    var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (number.match(validRegex)) {
        return number;
     }
    const numberString = number.toString().replace(/^0+/, '');
    const result = Number(numberString)
    return result;
}

export const checkUserPermission = ((permissionToCheck) => {
    const currentUser = JSON.parse(localStorage.getItem('userData'));

    if (currentUser && currentUser.roles && currentUser.roles.length > 0 && currentUser.roles[0].name == "SUPER-ADMIN")
        return true

    if (currentUser && currentUser.roles && currentUser.roles.length > 0) {
        const hassAccess = currentUser.roles[0].permissions.filter(item => item.name === permissionToCheck);
        if (hassAccess.length > 0) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
});


export const appsShortCuts = [
    {
        icon: sliderBar1,
        color: 'info',
        title: 'SpreadX Supplier Management',
        subtitle: 'A place to buy and Sell',
        url: 'apps/suppliers',
        to: 'apps-suppliers',
        category: 'supplier'
    },
]

export const navItemsMapping = {
    marketplace,
    bills,
};



const vendors = [
    {
        name: "qline",
        address: "1234567890"
    }
]


export const vendorBaseUrl = ((vendorId) => { })



export const currentAppRoute = (() => {
    const appName = localStorage.getItem('app');
    if (appName) {
        return "apps/" + appName;
    } else {
        return "/";
    }
});






const userData = ref(localStorage.getItem("userData") !== "" ? JSON.parse(localStorage.getItem("userData")) : "")
export const createFormData = (data) => {
    let formData = new FormData();
    for (const [key, value] of Object.entries(data)) {
        formData.append(key, value || "");
    }
    return formData;
};



const userRole = ref()
//come back to revice this
if (userData.value !== "") {

    if (userData.value && userData.value.roles && userData.value.roles.length > 0) {
        userRole.value = userData.value ? userData.value.roles[0].name : "hr";
    } else {
        userRole.value = "SUPER-ADMIN";
    }
}

export const isUserAdmin = (() => {
    return (userRole.value === "SUPER-ADMIN")
})


export const associateMenuToUserAbilities = ((navItems) => {

    if (isUserAdmin())
        
        return navItems

    const userAbilities = JSON.parse(localStorage.getItem('userAbilities'));
    const matchedObjects = [];
    for (const userAbility of userAbilities) {
        for (const navItemGroup of navItems) {
            if (navItemGroup.action === userAbility.action) {
                const matchedObject = {
                    title: navItemGroup.title,
                    icon: navItemGroup.icon,
                    action: navItemGroup.action,
                    subject: navItemGroup.subject,
                    children: navItemGroup.children, //[]=>assign to the emptyb array if we are  propagating the permissions to sub-menus,
                };

                // This part looks for the matching childs incase we are propagating the permissions to sub-menus 
                // for (const child of navItemGroup.children) {

                // if (userAbilities.some(ability => ability.action === child.action)) {
                //    matchedObject.children.push(child);
                //  }
                // }

                matchedObjects.push(matchedObject);
            }
        }
    }

    console.log("matchedMenu" + JSON.stringify(matchedObjects))
    return matchedObjects;
})





export const allowPassedDates = (date) => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0 for accurate comparison
    return date <= currentDate;
};

export const resolveEmployeeStatus = (status) => {
    switch (status) {
        case 4:
            return "Resigned"
            break;
        case 3:
            return "Retired"
            break;
        case 2:
            return "Suspended"
            break;
        case 1:
            return "Actinve"
            break;
        case 0:
            return "Pending"
            break;
        default:
            break;
    }
}


export const formatDate = ((date = new Date()) => {
    const year = date.toLocaleString('default', {
        year: 'numeric'
    });
    const month = date.toLocaleString('default', {
        month: '2-digit',
    });
    const day = date.toLocaleString('default', {
        day: '2-digit'
    });

    return [year, month, day].join('-');
})

export const numberFormat = (number, dp = 2) => {
    return parseFloat(number).toFixed(dp);
}


export const paginationMeta = (options, total) => {
    const start = (options.page - 1) * options.itemsPerPage + 1
    const end = Math.min(options.page * options.itemsPerPage, total)

    return `Showing ${total === 0 ? 0 : start} to ${end} of ${total} entries`
}


export const downloadExcelFile = (response) => {
    const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'exported_data.xlsx';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};


export const downloadPdfFile = (response) => {
    const blob = new Blob([response.data], {
        type: 'application/pdf'
    });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'exported_data.pdf';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};


function numberToWords(number) {
    const units = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
    const teens = ["", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
    const tens = ["", "ten", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
    const thousands = ["", "thousand", "million", "billion", "trillion"];

    function convertChunk(chunk) {
        const chunkArr = Array.from(String(chunk), Number);
        const chunkLength = chunkArr.length;
        let result = "";

        if (chunkLength === 3) {
            result += units[chunkArr[0]] + " hundred";
            if (chunkArr[1] !== 0 || chunkArr[2] !== 0) {
                result += " and ";
            }
        }

        if (chunkLength >= 2) {
            if (chunkArr[chunkLength - 2] === 1 && chunkArr[chunkLength - 1] !== 0) {
                result += teens[chunkArr[chunkLength - 1]];
                return result;
            } else {
                result += tens[chunkArr[chunkLength - 2]];
                if (chunkArr[chunkLength - 1] !== 0) {
                    result += " ";
                }
            }
        }

        result += units[chunkArr[chunkLength - 1]];

        return result;
    }

    if (number === 0) {
        return "zero";
    }

    let result = "";
    let chunkIndex = 0;

    while (number > 0) {
        const chunk = number % 1000;
        if (chunk !== 0) {
            result = convertChunk(chunk) + " " + thousands[chunkIndex] + " " + result;
        }
        number = Math.floor(number / 1000);
        chunkIndex++;
    }

    return result.trim();
}

export const numberToWordsWithDecimals = (number) => {
    const units = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
    const teens = ["", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
    const tens = ["", "ten", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
    const thousands = ["", "thousand", "million", "billion", "trillion"];

    function convertChunk(chunk) {
        const chunkArr = Array.from(String(chunk), Number);
        const chunkLength = chunkArr.length;
        let result = "";

        if (chunkLength === 3) {
            result += units[chunkArr[0]] + " hundred";
            if (chunkArr[1] !== 0 || chunkArr[2] !== 0) {
                result += " and ";
            }
        }

        if (chunkLength >= 2) {
            if (chunkArr[chunkLength - 2] === 1 && chunkArr[chunkLength - 1] !== 0) {
                result += teens[chunkArr[chunkLength - 1]];
                return result;
            } else {
                result += tens[chunkArr[chunkLength - 2]];
                if (chunkArr[chunkLength - 1] !== 0) {
                    result += " ";
                }
            }
        }

        result += units[chunkArr[chunkLength - 1]];

        return result;
    }

    function convertDecimal(decimal) {
        const decimalString = String(decimal);
        const decimalLength = decimalString.length;

        if (decimalLength === 1) {
            return units[decimalString[0]] + " cents";
        }

        const decimalTens = tens[decimalString[0]];
        const decimalUnits = units[decimalString[1]];

        return `${decimalTens} ${decimalUnits} cents`;
    }

    const integerPart = Math.floor(number);
    const decimalPart = Math.round((number - integerPart) * 100);

    let result = numberToWords(integerPart);

    if (decimalPart !== 0) {
        result += " and " + convertDecimal(decimalPart);
    }

    return result;
}

// export default createFormData
