import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { URL } from "../../config";


const updatePassword = async (data)=>{

    const response = await axios.put(

        `${URL}/user/forgot`,

        {
            login:data.login,

            newpassword:data.password,

            confirmpassword:data.confirmPassword
        }

    );


    return response.data;

};



export const useForgotPassword = ()=>{


    return useMutation({

        mutationFn:updatePassword

    });


};