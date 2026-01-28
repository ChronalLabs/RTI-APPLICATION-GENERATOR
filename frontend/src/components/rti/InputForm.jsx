import { Button } from "../common/Button";
import { useForm } from "react-hook-form";
import { useTranslation } from 'react-i18next';
import { ArrowRight, Sparkles, Loader2, ArrowLeft } from "lucide-react";
import { Card } from "../common/UiElements";

export default function InputForm({ onSubmit, initialData, isLoading, departments }) {
    const { t } = useTranslation();
    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        defaultValues: {
            description: initialData?.description || "",
            department: initialData?.department || ""
        }
    });

    const description = watch("description");

    return (
        <Card className="animate-enter">
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* Description Field */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-300 mb-2 ml-1">
                        {t('steps.describe')}
                    </label>
                    <div className="relative">
                        <textarea
                            {...register("description", { required: "Please describe your request" })}
                            placeholder={t('form.describe_placeholder')}
                            className="input-premium min-h-[160px] resize-none pb-12 w-full"
                        />
                        <div className="absolute bottom-4 right-4 flex gap-2">
                            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-slate-500">
                                AI Powered
                            </span>
                        </div>
                    </div>
                    {errors.description && (
                        <p className="text-red-400 text-sm mt-2 ml-1">{errors.description.message}</p>
                    )}
                </div>

                {/* Department Field */}
                <div className="mb-8">
                    <label className="block text-sm font-medium text-slate-300 mb-2 ml-1">
                        Department (Optional)
                    </label>
                    <div className="relative">
                        <select
                            {...register("department")}
                            className="input-premium appearance-none cursor-pointer w-full"
                        >
                            <option value="">Auto-detect from description... ✨</option>
                            {departments.map((dept) => (
                                <option key={dept.name} value={dept.name}>
                                    {dept.displayName}
                                </option>
                            ))}
                        </select>
                        <ArrowRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none rotate-90" />
                    </div>
                </div>

                <Button
                    type="submit"
                    isLoading={isLoading}
                    className="w-full btn-primary-glow"
                >
                    {isLoading ? "Analyzing..." : (
                        <>
                            <Sparkles className="w-5 h-5" />
                            {t('form.suggest_button')}
                        </>
                    )}
                </Button>
            </form>
        </Card>
    );
}
