import { authApi } from "./authService";

const EXPERTS_API = "/api/experts";

const unwrap = (response) => {
    const data = response?.data;

    if (Array.isArray(data)) {
        return data;
    }

    if (Array.isArray(data?.content)) {
        return data.content;
    }

    if (Array.isArray(data?.experts)) {
        return data.experts;
    }

    if (Array.isArray(data?.data)) {
        return data.data;
    }

    return data || [];
};

export const getAllExperts = async () => {
    const response = await authApi.get(EXPERTS_API);
    return unwrap(response);
};

export const getExpertById = async (expertId) => {
    const response = await authApi.get(
        `${EXPERTS_API}/${expertId}`
    );

    return response.data;
};

export const searchExperts = async (keyword) => {
    const response = await authApi.get(
        EXPERTS_API,
        {
            params: {
                search: keyword
            }
        }
    );

    return unwrap(response);
};

export const getExpertsBySkill = async (skill) => {
    const response = await authApi.get(
        EXPERTS_API,
        {
            params: {
                skill
            }
        }
    );

    return unwrap(response);
};

export const getExpertsByExperience = async (experience) => {
    const response = await authApi.get(
        EXPERTS_API,
        {
            params: {
                experience
            }
        }
    );

    return unwrap(response);
};

export const getExpertsByRating = async (rating) => {
    const response = await authApi.get(
        EXPERTS_API,
        {
            params: {
                rating
            }
        }
    );

    return unwrap(response);
};

export const getExpertsByFilters = async (params = {}) => {
    const cleanParams = Object.fromEntries(
        Object.entries(params).filter(
            ([, value]) =>
                value !== undefined &&
                value !== null &&
                value !== ""
        )
    );

    const response = await authApi.get(
        EXPERTS_API,
        {
            params: cleanParams
        }
    );

    return unwrap(response);
};