import React from "react";
import Link from "next/link";
import Image from "next/image";
import Language from "@components/language/language";
import { useTranslation } from "next-i18next";

const Header: React.FC = () => {
    const { t } = useTranslation("common");

    return (
        <header className="relative p-5 bg-gradient-to-br from-blue-600 to-blue-400 shadow-lg">
            <nav className="flex flex-col items-center">
                <div className="flex flex-col items-center">
                    <Image
                        src="/images/S.png"
                        alt={t("app.logoAlt")}
                        width={120}
                        height={100}
                        priority
                        className="rounded-full shadow-md mb-4"
                    />
                    <div className="flex space-x-8">
                        <Link href="/" className="text-white text-xl font-semibold">
                            {t("home")}
                        </Link>
                        <Link href="/vacancies" className="text-white text-xl font-semibold">
                            {t("headerVacancies")}
                        </Link>
                        <Link href="/progress" className="text-white text-xl font-semibold">
                            {t("progress")}
                        </Link>
                        <Link href="/employer" className="text-white text-xl font-semibold">
                            {t("employer")}
                        </Link>
                    </div>
                </div>
                <ul className="absolute top-5 right-5 list-none flex space-x-8 font-semibold text-xl text-white">
                    <li>
                        <Link href="/login">{t("login")}</Link>
                    </li>
                    <li>
                        <Link href="/register">{t("register")}</Link>
                    </li>
                </ul>
                <div className="absolute top-5 left-5">
                    <Language />
                </div>
            </nav>
        </header>
    );
};

export default Header;
