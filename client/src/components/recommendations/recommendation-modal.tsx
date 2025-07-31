import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface Recommendation {
  id: string;
  title: string;
  description: string;
  price?: string;
  image?: string;
}

interface RecommendationModalProps {
  isOpen: boolean;
  onClose: () => void;
  recommendations: Recommendation[];
  category: { name: string; id: string };
}

export default function RecommendationModal({ 
  isOpen, 
  onClose, 
  recommendations, 
  category 
}: RecommendationModalProps) {
  
  const handleSave = () => {
    // Save recommendations to localStorage for guests
    const saved = JSON.parse(localStorage.getItem('saved-recommendations') || '[]');
    const newRecommendations = recommendations.map(rec => ({
      ...rec,
      category: category.id,
      savedAt: new Date().toISOString(),
    }));
    localStorage.setItem('saved-recommendations', JSON.stringify([...saved, ...newRecommendations]));
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto rounded-2xl">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Your Personalized {category.name} Recommendations
          </DialogTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X size={20} />
          </Button>
        </DialogHeader>
        
        <div className="space-y-4">
          {recommendations.length === 0 ? (
            <p className="text-gray-600 text-center py-8">
              No recommendations available yet. Continue chatting to get personalized suggestions!
            </p>
          ) : (
            recommendations.map((item) => (
              <div key={item.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                <div className="flex space-x-4">
                  {item.image && (
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-20 h-20 object-cover rounded-lg" 
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{item.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                    <div className="flex items-center justify-between mt-3">
                      {item.price && (
                        <span className="text-lg font-semibold text-primary">{item.price}</span>
                      )}
                      <Button variant="ghost" size="sm" className="text-primary hover:text-primary-dark">
                        View Options
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {recommendations.length > 0 && (
          <div className="flex space-x-3 pt-6 border-t">
            <Button onClick={handleSave} className="flex-1 bg-primary text-white hover:bg-primary-dark">
              Save Recommendations
            </Button>
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1 border-primary text-primary hover:bg-primary hover:text-white"
            >
              Continue Chatting
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
