import React, { useState } from 'react';
import { useEffect } from 'react';
import { ArrowLeft, Crown, Calendar, X, Eye, Star, Sparkles } from 'lucide-react';
import ImageUpload from '../components/ImageUpload';
import LoadingSpinner from '../components/LoadingSpinner';
import AnalysisResults from '../components/AnalysisResults';
import PremiumModal from '../components/PremiumModal';
import StorageLimitModal from '../components/StorageLimitModal';
import GradientButton from '../components/GradientButton';
import { useImageProcessing } from '../hooks/useImageProcessing';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { saveAnalysis, getAnalysisCount } from '../lib/history';
import { supabase } from '../lib/supabaseClient';

interface AnalysisPageProps {
  onBack: () => void;
  onNavigate?: (page: string) => void;
}

export default function AnalysisPage({ onBack, onNavigate }: AnalysisPageProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showStorageLimitModal, setShowStorageLimitModal] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const { isPremium, user } = useAuth();
  const { isAnalyzing, analysis, analyzeImage } = useImageProcessing();
  const { t } = useLanguage();

  useEffect(() => { console.log("MOUNT:", "src/pages/AnalysisPage.tsx"); }, []);

  const handleImageSelect = async (file: File) => {
    if (user && isPremium) {
      const count = await getAnalysisCount(user.id);
      if (count >= 10) {
        setPendingFile(file);
        setShowStorageLimitModal(true);
        return;
      }
    }

    await performAnalysis(file);
  };

  const performAnalysis = async (file: File) => {
    const blobUrl = URL.createObjectURL(file);
    setSelectedImage(blobUrl);

    try {
      let storageUrl: string | null = null;

      // Upload image to Supabase Storage if user is authenticated
      if (user) {
        try {
          const fileExt = file.name.split('.').pop() || 'jpg';
          const randomUuid = crypto.randomUUID();
          const filePath = `user-uploads/${user.id}/${randomUuid}.${fileExt}`;

          const { error: uploadError } = await supabase.storage
            .from('user-images')
            .upload(filePath, file, {
              cacheControl: '3600',
              upsert: false,
              contentType: file.type
            });

          if (!uploadError) {
            const { data: urlData } = supabase.storage
              .from('user-images')
              .getPublicUrl(filePath);
            storageUrl = urlData.publicUrl;
          } else {
            console.error('Failed to upload image to storage:', uploadError);
          }
        } catch (error) {
          console.error('Error uploading image to storage:', error);
        }
      }

      const result = await analyzeImage(file);

      if (result && user) {
        try {
          const saveResult = await saveAnalysis({
            userId: user.id,
            imageUrl: storageUrl,
            analysis: result
          });
          if (saveResult.ok) {
            console.log('Analysis saved to history successfully');
            supabase
              .from('facial_profiles')
              .update({ last_active_at: new Date().toISOString() })
              .eq('user_id', user.id)
              .then(() => console.log("last_active_at updated"))
              .catch(err => console.error("update failed", err));
          } else {
            console.error('Failed to save analysis:', saveResult.error);
          }
        } catch (error) {
          console.error('Failed to save analysis to history:', error);
        }
      }
    } catch (error) {
      console.error('Analysis failed:', error);
    }
  };

  const handleContinueWithoutSaving = () => {
    if (pendingFile) {
      performAnalysis(pendingFile);
      setPendingFile(null);
    }
  };

  const handlePremiumFeatureClick = () => setShowPremiumModal(true);

  const handleClearImage = () => {
    if (selectedImage) URL.revokeObjectURL(selectedImage);
    setSelectedImage(null);
  };

  const getOverallGrade = (score: number) => {
    if (score >= 9) return { grade: 'A+', color: 'text-emerald-400' };
    if (score >= 8) return { grade: 'A', color: 'text-emerald-400' };
    if (score >= 7) return { grade: 'B+', color: 'text-yellow-400' };
    if (score >= 6) return { grade: 'B', color: 'text-yellow-400' };
    if (score >= 5) return { grade: 'C+', color: 'text-orange-400' };
    return { grade: 'C', color: 'text-red-400' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-black p-4 pb-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8 pt-4 animate-fade-in">
          <button
            onClick={onBack}
            className="p-3 bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-700/50 hover:border-blue-500/30 hover:bg-slate-700/60 transition-all duration-300 mr-4 group"
          >
            <ArrowLeft className="w-5 h-5 text-white group-hover:text-blue-400 transition-colors duration-300" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">{t.facialAnalysis}</h1>
            <p className="text-slate-400">{t.aiPoweredAssessment}</p>
          </div>
        </div>

        {/* Upload Section */}
        {!selectedImage && (
          <div className="bg-gradient-to-br from-slate-800/60 via-blue-900/20 to-slate-800/60 backdrop-blur-sm rounded-3xl p-8 border border-blue-500/20 mb-8 animate-slide-up shadow-lg shadow-blue-500/10">
            <ImageUpload onImageSelect={handleImageSelect} selectedImage={selectedImage} onClear={handleClearImage} />
          </div>
        )}

        {/* Analysis Results */}
        {selectedImage && (
          <div className="space-y-8 animate-fade-in">
            {isAnalyzing ? (
              <LoadingSpinner 
                message="Analyzing facial features and calculating scores…"
                imageSrc={selectedImage}
              />
            ) : analysis && (
              <AnalysisResults
                analysis={analysis}
                imageUrl={selectedImage}
                isPremium={isPremium}
                onClearImage={handleClearImage}
                onPremiumClick={handlePremiumFeatureClick}
              />
            )}

            {/* Detailed Feature Analysis (kept) */}
            {analysis && (
              <>
                {isPremium ? <></> : <></>}
              </>
            )}
          </div>
        )}
      </div>

      <PremiumModal isOpen={showPremiumModal} onClose={() => setShowPremiumModal(false)} />
      <StorageLimitModal
        isOpen={showStorageLimitModal}
        onClose={() => {
          setShowStorageLimitModal(false);
          setPendingFile(null);
        }}
        onContinue={handleContinueWithoutSaving}
      />
    </div>
  );
}