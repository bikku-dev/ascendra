import { authApi } from "./authService";


/* =========================================================
   SKILLS
========================================================= */

// Get all skills
export const getAllSkills = async () => {

    const response =
        await authApi.get(
            "/api/skills"
        );

    return response.data;
};


// Get skill by ID
export const getSkillById = async (id) => {

    const response =
        await authApi.get(
            `/api/skills/${id}`
        );

    return response.data;
};


// Create skill
export const createSkill = async (data) => {

    const response =
        await authApi.post(
            "/api/skills",
            data
        );

    return response.data;
};


// Update skill
export const updateSkill = async (
    id,
    data
) => {

    const response =
        await authApi.put(
            `/api/skills/${id}`,
            data
        );

    return response.data;
};


// Delete skill
export const deleteSkill = async (id) => {

    const response =
        await authApi.delete(
            `/api/skills/${id}`
        );

    return response.data;
};