
import { apiConnector } from '../apiconnector';
import { catalogData } from '../apis';
import {toast} from "react-hot-toast"

 export const getCatalogPageData = async(categoryId) => {

    const toastId= toast.loading("Loading...");
    let result=[];
    try {
        const response = await apiConnector("POST", catalogData.CATALOGPAGEDATA_API, {categoryId: categoryId});
        console.log("GET CATALOG API RESPONSE............", response);

        if (!response?.data?.success) {
            throw new Error(response?.data?.message);
        }

        result= response?.data;

    } catch (error) {
        console.log("CATALOG PAGE DATA API ERROR....", error);
        toast.error(error.message);
        result = error.response?.data;
    }
    toast.dismiss(toastId);
    return result;
}

