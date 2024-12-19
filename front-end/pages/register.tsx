import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { registerUser } from "../services/authService";
import Language from "@components/language/language";

const Register: React.FC = () => {
    const { t } = useTranslation("common");
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [dob, setDob] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert(t("registerPage.passwordMismatch"));
            return;
        }

        try {
            const response = await registerUser(email, password, firstName, lastName, dob);
            console.log(t("registerPage.success"), response);
            if (response.success) {
                router.push("/");
            }
        } catch (error: any) {
            console.error(t("registerPage.failed"), error.message);
            alert(`${t("registerPage.failed")}: ${error.message}`);
        }
    };

    return (
        <>
            <Head>
                <title>{t("registerPage.title")}</title>
                <meta name="description" content={t("registerPage.metaDescription")} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="min-h-screen flex items-center justify-center bg-blue-100 relative">
                <div className="absolute top-5 left-5">
                    <Language textColor="text-blue-500" />
                </div>
                <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                    <h1 className="text-2xl font-bold mb-6 text-center text-blue-400">{t("registerPage.heading")}</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-gray-700">{t("registerPage.emailLabel")}</label>
                            <input
                                type="email"
                                id="email"
                                className="w-full px-3 py-2 border rounded"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="firstname" className="block text-gray-700">{t("registerPage.firstNameLabel")}</label>
                            <input
                                type="text"
                                id="firstName"
                                className="w-full px-3 py-2 border rounded"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="lastname" className="block text-gray-700">{t("registerPage.lastNameLabel")}</label>
                            <input
                                type="text"
                                id="lastName"
                                className="w-full px-3 py-2 border rounded"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="dob" className="block text-gray-700">{t("registerPage.dobLabel")}</label>
                            <input
                                type="date"
                                id="dob"
                                className="w-full px-3 py-2 border rounded"
                                value={dob}
                                onChange={(e) => setDob(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="block text-gray-700">{t("registerPage.passwordLabel")}</label>
                            <input
                                type="password"
                                id="password"
                                className="w-full px-3 py-2 border rounded"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="confirmPassword" className="block text-gray-700">{t("registerPage.confirmPasswordLabel")}</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                className="w-full px-3 py-2 border rounded"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                        >
                            {t("registerPage.buttonText")}
                        </button>
                    </form>
                    <p className="mt-4 text-center">
                        {t("registerPage.alreadyHaveAccount")}{" "}
                        <Link href="/login" className="text-blue-500">{t("registerPage.loginLink")}</Link>
                    </p>
                </div>
            </div>
        </>
    );
};

export async function getStaticProps({ locale }: { locale: string }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, ["common"])),
        },
    };
}

export default Register;
