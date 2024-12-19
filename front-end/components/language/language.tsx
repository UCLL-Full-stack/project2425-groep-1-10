import { useRouter } from "next/router";

interface LanguageProps {
    textColor?: string;
}

const Language: React.FC<LanguageProps> = ({ textColor = "text-white" }) => {
    const router = useRouter();
    const { locale, pathname, asPath, query } = router;

    const handleLanguageChange = async (newLocale: string) => {
        if (newLocale !== locale) {
            await router.push({ pathname, query }, asPath, { locale: newLocale });
        }
    };

    return (
        <div className="flex space-x-4">
            {["en", "nl", "fr"].map((lang) => (
                <button
                    key={lang}
                    className={`font-semibold transition duration-300 ${textColor} hover:underline`}
                    onClick={() => handleLanguageChange(lang)}
                >
                    {lang.toUpperCase()}
                </button>
            ))}
        </div>
    );
};

export default Language;
