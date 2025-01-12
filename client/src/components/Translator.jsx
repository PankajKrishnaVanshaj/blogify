import { useState } from "react";
import { RiTranslateAi } from "react-icons/ri";
import Draggable from "./Draggable";
import { ImCancelCircle } from "react-icons/im";
import { generateSummary as gemini } from "@/utils/SummaryGeminiAIModal";

const Translator = ({ text }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [translatedText, setTranslatedText] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [activeTab, setActiveTab] = useState("original");

  const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "zh", name: "Chinese" },
    { code: "ar", name: "Arabic" },
    { code: "hi", name: "Hindi" },
    { code: "ja", name: "Japanese" },
    { code: "pt", name: "Portuguese" },
    { code: "ru", name: "Russian" },
  ];

  const handleTranslate = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const inputPrompt = `Translate the following text to ${
        languages.find((lang) => lang.code === selectedLanguage)?.name
      }, ensuring clarity and contextual accuracy. Provide only the translated text:\n\n${text}`;

      const result = await gemini.sendMessage(inputPrompt);
      const responseText = (await result.response.text())
        .replace("```json", "")
        .replace("```", "");

      setTranslatedText(responseText);
      setActiveTab("translated");
    } catch {
      setError("An error occurred while translating. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-2 left-2 z-50">
      {/* Toggle button */}
      <RiTranslateAi
        onClick={() => setIsOpen(!isOpen)}
        size={40}
        className="p-1.5 rounded-xl text-white bg-primary shadow-lg hover:bg-pink-800 transition duration-300 cursor-pointer"
        aria-label="Translate"
        title="Translate"
      />

      {/* Translator Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-10 flex justify-center items-center z-50 pointer-events-none transition-all">
          <Draggable>
            <div className="bg-white p-4 pt-2 rounded-lg max-w-full w-full sm:max-w-md md:max-w-lg space-y-6 z-50 shadow-2xl pointer-events-auto transform transition-all duration-300 scale-105">
              {/* Header */}
              <div className="flex items-center justify-between space-x-5">
                <div className="flex items-center space-x-3 flex-grow justify-center">
                  <label
                    htmlFor="language"
                    className="text-sm font-bold text-gray-600"
                  >
                    Translate to
                  </label>
                  <select
                    id="language"
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="border rounded-lg py-0.5 px-1.5 font-mono text-gray-500 focus:ring-secondary transition"
                  >
                    {languages.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleTranslate}
                    className="bg-primary text-white p-1 rounded-md hover:bg-secondary transition"
                    aria-label="Translate"
                  >
                    <RiTranslateAi size={19} title="Translate" />
                  </button>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-primary hover:text-red-600 transition"
                  aria-label="Close"
                >
                  <ImCancelCircle size={20} title="Close" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex justify-center gap-2">
                {["original", "translated"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-0.5 px-4 rounded-lg text-sm font-medium ${
                      activeTab === tab
                        ? "bg-primary text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {tab === "original" ? "Original" : "Translated"}
                  </button>
                ))}
              </div>

              {/* Content */}
              <div className="overflow-auto max-h-64">
                {isLoading ? (
                  <p className="text-center text-gray-600">Loading...</p>
                ) : error ? (
                  <p className="text-red-500 text-center">{error}</p>
                ) : (
                  <div>
                    <strong className="text-gray-800">
                      {activeTab === "original" ? "Original" : "Translated"}:
                    </strong>
                    <p
                      className="text-black mt-1 text-sm"
                      dangerouslySetInnerHTML={{
                        __html:
                          activeTab === "original" ? text : translatedText,
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </Draggable>
        </div>
      )}
    </div>
  );
};

export default Translator;
