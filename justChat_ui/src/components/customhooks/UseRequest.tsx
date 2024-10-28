import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { queryClient } from '../../App';
import { useNavigate } from 'react-router-dom';

type  userStatusType = {
    id: string | number,
    username: string,
    email: string,
    profile_image: string | null,
    access: string,
    refresh: string,
}
/**
 *
 * @param {string} url - the url paramenter provides the url of the api endpoint .
 * @param {object} data - the data parameter is used to post data to the provided url if not null.
 * @param {string} - the key parameter is used as an identifier for each query made to provided endpoint .
 * @param {boolean} - the enable parameter provides conditional instances in which UseRequest either execute a fetch request onmount of given component or not
 * @returns {object} - the useRequest hook return an object after execution which contains the response data from the provided endpoint
 */
const UseRequest = (url :string, method: string = "get", key: null | string = null, enabled: boolean = true) => {
    const navigateToLogin = useNavigate()
    console.log("error")
    if (url && method === "get") {
        console.log("error1")
    const fetchFunc = async () => {
        try {
            console.log("error2")
            const userStatus: userStatusType = JSON.parse(sessionStorage.getItem("userProfile")!)
            let config = {
                headers: {
                    Authorization: "Bearer " + userStatus.access
                }
            }
            console.log("fetching data")
            const response = await axios.get(url, config);
            if (response.status === 200 || response.status === 201) {
                console.log(response.data)
                return response.data;
            }
        } catch (error: any) {
            console.log(error.response.status)
            if (error.response && error.response.status === 401) {
                const userStatus: userStatusType = JSON.parse(sessionStorage.getItem("userProfile")!);
                if (userStatus && userStatus.refresh) {
                    try {
                        const refreshResponse = await axios.post("http://127.0.0.1:8000/token-refresh/", { refresh: userStatus.refresh });
                        if (refreshResponse.status === 200) {
                            userStatus.access = refreshResponse.data.access;
                            sessionStorage.setItem("userProfile", JSON.stringify(userStatus));
                            const config = {
                                headers: {
                                    Authorization: "Bearer " + userStatus.access,
                                },
                            };
                            const retryResponse = await axios.get(url, config);
                            if (retryResponse.status === 200) {
                                console.log(retryResponse.data)
                                return retryResponse.data;
                            }
                        }
                    } catch (refreshError) {
                        navigateToLogin("/log-in/")
                        throw new Error("Failed to refresh token.");
                    }
                }
            } else {
                throw new Error("Request failed.");
            }
        }
    };


    const queryResult = useQuery({
        queryKey: [key],
        queryFn: fetchFunc,
        initialData: () => {
            const data = queryClient.getQueryData([key])
            if (data) {
                return data
            }
        },
        enabled,
        refetchInterval: 1000,
    });

    return queryResult;
    }
};

export default UseRequest