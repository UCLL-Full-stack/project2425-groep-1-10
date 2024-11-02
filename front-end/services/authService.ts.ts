export const loginUser = async (email: string, password: string) => {
    if (email && password) {
        return { success: true, message: "Login successful!" };
    } else {
        throw new Error("Invalid credentials");
    }
};

export const registerUser = async (email: string, password: string, confirmPassword: string) => {
    if (email && password === confirmPassword) {
        return { success: true, message: "Registration successful!" };
    } else {
        throw new Error("Registration failed: Passwords do not match");
    }
};
