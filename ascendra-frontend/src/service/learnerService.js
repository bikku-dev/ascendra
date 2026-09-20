import { authApi } from "./authService";

export const createLearnerProfile = async (data) => {
    const response = await authApi.post(
        "/api/learners",
        data
    );

    return response.data;
};

export const getAllLearnerProfiles = async () => {
    const response = await authApi.get(
        "/api/learners"
    );

    return response.data;
};

export const getLearnerProfile = async (id) => {
    const response = await authApi.get(
        `/api/learners/${id}`
    );

    return response.data;
};

export const getLearnerProfileByUserId = async (userId) => {
    const response = await authApi.get(
        `/api/learners/user/${userId}`
    );

    return response.data;
};

export const updateLearnerProfile = async (
    id,
    data
) => {
    const response = await authApi.put(
        `/api/learners/${id}`,
        data
    );

    return response.data;
};

export const deleteLearnerProfile = async (id) => {
    const response = await authApi.delete(
        `/api/learners/${id}`
    );

    return response.data;
};

export const getAllSkills = async () => {
    const response = await authApi.get(
        "/api/skills"
    );

    return response.data;
};

export const createLearnerSkill = async (data) => {
    const response = await authApi.post(
        "/api/learner-skills",
        data
    );

    return response.data;
};

export const getLearnerSkills = async (learnerId) => {
    const response = await authApi.get(
        `/api/learner-skills/learner/${learnerId}`
    );

    return response.data;
};

export const updateLearnerSkill = async (
    id,
    skillLevel
) => {
    const response = await authApi.put(
        `/api/learner-skills/${id}`,
        null,
        {
            params: {
                skillLevel
            }
        }
    );

    return response.data;
};

export const deleteLearnerSkill = async (id) => {
    const response = await authApi.delete(
        `/api/learner-skills/${id}`
    );

    return response.data;
};

export const createGoal = async (data) => {
    const response = await authApi.post(
        "/api/goals",
        data
    );

    return response.data;
};

export const getLearnerGoals = async (learnerId) => {
    const response = await authApi.get(
        `/api/goals/learner/${learnerId}`
    );

    return response.data;
};

export const getGoal = async (id) => {
    const response = await authApi.get(
        `/api/goals/${id}`
    );

    return response.data;
};

export const updateGoal = async (
    id,
    data
) => {
    const response = await authApi.put(
        `/api/goals/${id}`,
        data
    );

    return response.data;
};

export const updateGoalStatus = async (
    id,
    status
) => {
    const response = await authApi.patch(
        `/api/goals/${id}/status`,
        null,
        {
            params: {
                status
            }
        }
    );

    return response.data;
};

export const deleteGoal = async (id) => {
    const response = await authApi.delete(
        `/api/goals/${id}`
    );

    return response.data;
};