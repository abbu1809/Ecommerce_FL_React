import { create } from "zustand";


export const useAdminAuthStore = create((set) => {
    return {
        isAuthenticated: false,
        isLoading: false,
        error: null,
        formData: {
        email: "",
        password: "",
        secretKey: "",
        },
        formErrors: {
        email: null,
        password: null,
        secretKey: null,
        },
        setFormData: (data) => set((state) => ({ formData: { ...state.formData, ...data } })),
        setFormErrors: (errors) => set(() => ({ formErrors: errors })),
        setIsAuthenticated: (status) => set(() => ({ isAuthenticated: status })),
        setIsLoading: (status) => set(() => ({ isLoading: status })),
        setError: (error) => set(() => ({ error })),
    };
});