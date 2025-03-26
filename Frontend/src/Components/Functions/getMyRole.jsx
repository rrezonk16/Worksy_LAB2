import axios from "axios";

const getMyRole = async (role) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8000/api/get-my-permissions", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        
        if (response.data.permissions) {
            localStorage.setItem("permissions", JSON.stringify(response.data.permissions));
        }
        
        const permissions = response.data.permissions || [];
        return permissions.includes(role);
    } catch (error) {
        console.error("Error fetching permissions:", error);
        return false;
    }
};

export default getMyRole;
