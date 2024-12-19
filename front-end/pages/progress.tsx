import React from "react";
import Head from "next/head";
import Header from "@components/header";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const Progress: React.FC = () => {
    const { t } = useTranslation("common");

    const vacancies = [
        { vacancy: t("vacancy1"), date: t("date"), status: t("status") },
        { vacancy: t("vacancy2"), date: t("date"), status: t("status") },
        { vacancy: t("vacancy3"), date: t("date"), status: t("status") },
        { vacancy: t("vacancy4"), date: t("date"), status: t("status") },
        { vacancy: t("vacancy5"), date: t("date"), status: t("status") },
    ];

    return (
        <>
            <Head>
                <title>{t("progressPage.title")}</title>
                <meta name="description" content={t("progressPage.metaDescription")} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header />
            <main className="min-h-screen bg-blue-100 flex flex-col items-center py-10">
                <h1 className="text-4xl font-bold mb-8 text-blue-600">{t("progressPage.heading")}</h1>
                <div className="w-full max-w-4xl bg-white rounded-lg shadow-md">
                    <div className="grid grid-cols-3 border-b text-center font-semibold text-blue-600 py-4">
                        <div>{t("ProgressVacancies")}</div>
                        <div>{t("date")}</div>
                        <div>{t("status")}</div>
                    </div>
                    {vacancies.map((item, index) => (
                        <div
                            key={index}
                            className="grid grid-cols-3 border-b text-center py-4 text-gray-700 hover:bg-blue-50 transition duration-300"
                        >
                            <div>{item.vacancy}</div>
                            <div>{item.date}</div>
                            <div>{item.status}</div>
                        </div>
                    ))}
                </div>
            </main>
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

export default Progress;
