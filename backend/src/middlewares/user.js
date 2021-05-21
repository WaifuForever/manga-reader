const yup = require("yup");
const response = require("../common/response");




const rules = {
    email:  yup.string().email().required(),
    password: yup.string()
                .min(8, response.getMessage("user.invalid.password.short"))
                .matches( /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
                        response.getMessage("user.invalid.password.weak"))
                .required(),
    name: yup.string()
                .min(3, response.getMessage("user.invalid.name.short"))               
                .required(),
    role: yup.string()
                .matches("Scan" || "User", response.getMessage("badRequest")),
    sign_in_password: yup.string()
                .min(8, response.getMessage("user.invalid.password.short"))
                .required()
}

const credentials = {
   
}

module.exports = {
    async valid_sign_up(req, res, next){                                   
               
        const yupObject = yup.object().shape({
            email: rules.email,
            password: rules.password,
            name: rules.name,
            role: rules.role
        });

        yupObject.validate(req.body).then(() => next())
                 .catch((err) => {
                    return res.json(        
                        response.jsonBadRequest(null, response.getMessage("badRequest"), err.errors)              
                    )  
                })
       
    },
    
    async valid_sign_in(req, res, next){
        
        const [hashType, hash] = req.headers.authorization.split(' ');
       
        if(hashType !== "Basic"){
            return res.json(        
                response.jsonUnauthorized(null, null, null)              
            );  
        }
    
        const [email, password] = Buffer.from(hash, "base64").toString().split(":");
                       
        const yupObject = yup.object().shape({
            email: rules.email,
            password: rules.sign_in_password,
        });

        yupObject.validate({email: email, password: password}).then(() => next())
                 .catch((err) => {
                    return res.json(        
                        response.jsonBadRequest(null, response.getMessage("badRequest"), err.errors)              
                    )  
                })

       
    },
   
}