import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { URL } from "../../config";

// const Api="http://localhost:5000"
const registerUser = async(userData)=>{

    const response = await axios.post(
        `${URL}/user/signup`,
        userData
    );
      return response.data;
};

export const useRegister = ()=>{

    return useMutation({
        mutationFn: registerUser,
    });

};