import { useState, useEffect } from "react";
import Header from "../components/layout/Header";
import { templateService } from "../services/api";
import { Loader2 } from "lucide-react";
import { TemplateList } from "../components/templates/TemplateList";
import { TemplatePreview } from "../components/templates/TemplatePreview";
import { TemplateMetadata } from "../components/templates/TemplateMetadata";

export default function TemplatesPage() {
    const [templates, setTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);

    // Live Tester State
    const [isLiveMode, setIsLiveMode] = useState(false);
    const [liveData, setLiveData] = useState({});
    const [previewText, setPreviewText] = useState("");
    const [isPreviewLoading, setIsPreviewLoading] = useState(false);

    useEffect(() => {
        loadTemplates();
    }, []);

    // Fetch preview when live mode is active and data changes
    useEffect(() => {
        const fetchPreview = async () => {
            if (!isLiveMode || !selectedTemplate) return;

            setIsPreviewLoading(true);
            try {
                // Step 8: Backend Template Preview Flow
                // Payload: { templateId, data }
                const response = await templateService.preview({
                    templateId: selectedTemplate._id,
                    data: liveData
                });
                if (response.success && response.data) {
                    setPreviewText(response.data.preview);
                }
            } catch (error) {
                console.error("Preview failed", error);
                setPreviewText("Failed to generate preview.");
            } finally {
                setIsPreviewLoading(false);
            }
        };

        // Debounce slightly to avoid too many calls while typing
        const timer = setTimeout(fetchPreview, 500);
        return () => clearTimeout(timer);
    }, [isLiveMode, liveData, selectedTemplate]);

    const loadTemplates = async () => {
        try {
            const response = await templateService.getAll();
            if (response.success) {
                setTemplates(response.data);
                // Select first template by default if available
                if (response.data.length > 0) {
                    setSelectedTemplate(response.data[0]);
                }
            }
        } catch (error) {
            console.error("Failed to load templates", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectTemplate = (template) => {
        setSelectedTemplate(template);
        setIsLiveMode(false);
        setLiveData({});
        setPreviewText("");
    };

    const handleToggleLive = () => {
        setIsLiveMode(!isLiveMode);
        if (!isLiveMode) {
            // Turning on: Initial preview with empty/current data
            setLiveData({});
        } else {
            setPreviewText("");
        }
    };

    return (
        <div className="min-h-screen flex flex-col pt-16 h-screen overflow-hidden bg-black/20">
            {/* Main Content */}
            <main className="flex-1 max-w-[1800px] mx-auto w-full p-6 h-full overflow-hidden">
                {loading ? (
                    <div className="flex h-full items-center justify-center">
                        <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
                    </div>
                ) : (
                    <div className="grid grid-cols-12 gap-6 h-full overflow-hidden">

                        {/* Left: List (3 cols) */}
                        <div className="col-span-3 h-full flex flex-col glass-panel rounded-xl overflow-hidden">
                            <TemplateList
                                templates={templates}
                                selectedId={selectedTemplate?._id}
                                onSelect={handleSelectTemplate}
                                searchQuery={searchQuery}
                                onSearch={setSearchQuery}
                            />
                        </div>

                        {/* Center: Preview (6 cols) */}
                        <div className="col-span-6 h-full glass-panel rounded-xl overflow-hidden flex flex-col">
                            <TemplatePreview
                                template={selectedTemplate}
                                liveData={liveData}
                                isLiveMode={isLiveMode}
                                previewText={previewText}
                                isLoading={isPreviewLoading}
                            />
                        </div>

                        {/* Right: Metadata (3 cols) */}
                        <div className="col-span-3 h-full flex flex-col glass-panel rounded-xl overflow-hidden">
                            <TemplateMetadata
                                template={selectedTemplate}
                                liveData={liveData}
                                setLiveData={setLiveData}
                                isLiveMode={isLiveMode}
                                toggleLiveMode={handleToggleLive}
                            />
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
