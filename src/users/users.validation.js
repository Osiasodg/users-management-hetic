// users.validation.js

function isNonEmptyString(value) {
    return typeof value === "string" && value.length >=8
}


function isEmail(value) {
    return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isNonPassword(value) {
    return typeof value === "string" && value.length >=8
}


export function validateUser(UserData){
    const error = {};
   
    const email = UserData.email;
    const password = UserData.password;
    const name = UserData.name;
    
    if (!isEmail(email)) error.email = "email is invalid";
    if (!isStrongPassword(email)) error.email = "Password is invalid";
    if (!isNonEmptyString(email)) error.email = "name is required";

    return{
        ok:Object.keys(error).length === 0,error,
        data:UserData
    };
}