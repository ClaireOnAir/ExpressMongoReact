const CustomError = require("../error");

exports.emailValidator = (email) => {

    if (!email) { // if (email == null || email == undefined) <----- lo mismo
        throw new CustomError("email esta vacio", 400)
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const result = emailRegex.test(email);
    if (!result) {
        throw new CustomError("email no está en el formato correcto", 400)
    }

}
