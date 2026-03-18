import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/v1'; // Assuming FastAPI default

/**
 * Uploads a job description and resumes to the backend for analysis.
 * @param {string} jobDescription Target job description
 * @param {File[]} resumeFiles Array of File objects representing resumes
 * @returns {Promise<Object>} The ranking results
 */
export const analyzeCandidates = async (jobDescription, resumeFiles) => {
    const formData = new FormData();
    formData.append('job_description', jobDescription);
    
    resumeFiles.forEach((file) => {
        formData.append('resumes', file);
    });

    try {
        const response = await axios.post(`${API_BASE_URL}/analyze`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error analyzing candidates:", error);
        throw error;
    }
};
