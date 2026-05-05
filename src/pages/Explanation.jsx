
import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Lightbulb, Target } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";

const EMOJI_EXPLANATIONS = [
  { emoji: "🙂", label: "Excited", description: "Positive emotions or enthusiasm", category: "emotional", color: "bg-green-100 text-green-800 border-green-200"},
  { emoji: "🙁", label: "Angry", description: "Frustration, complaints, or negative feelings", category: "emotional", color: "bg-red-100 text-red-800 border-red-200"},
  { emoji: "😳", label: "Embarrassed", description: "Awkwardness, discomfort, or uncertainty", category: "emotional", color: "bg-pink-100 text-pink-800 border-pink-200"},
  { emoji: "💥", label: "Pain/Problem", description: "Critical insight: the core challenge or pain the user urgently needs solved", category: "problem", color: "bg-yellow-100 text-yellow-800 border-yellow-200"},
  { emoji: "🥅", label: "Goal", description: "What the user ultimately wants to achieve or accomplish", category: "outcome", color: "bg-blue-100 text-blue-800 border-blue-200"},
  { emoji: "🟥", label: "Obstacle", description: "Something blocking progress or creating friction", category: "problem", color: "bg-red-100 text-red-800 border-red-200"},
  { emoji: "↪️", label: "Workaround", description: "A clever or improvised solution the user employs", category: "behavior", color: "bg-purple-100 text-purple-800 border-purple-200"},
  { emoji: "🏔", label: "Context", description: "Additional background details that shape the situation", category: "context", color: "bg-gray-100 text-gray-800 border-gray-200"},
  { emoji: "☑️", label: "Feature Request", description: "A suggestion for new functionality or improvements", category: "outcome", color: "bg-green-100 text-green-800 border-green-200"},
  { emoji: "💲", label: "Budget", description: "Conversations about pricing, spending, or funding", category: "business", color: "bg-emerald-100 text-emerald-800 border-emerald-200"},
  { emoji: "♀️", label: "Person/Company", description: "Mention of a specific individual, organization, competitor, collaborator, or a key decision-maker", category: "context", color: "bg-indigo-100 text-indigo-800 border-indigo-200"},
  { emoji: "⭐", label: "Follow-up", description: "Topics that require a future action, a next step, a to-track-later", category: "action", color: "bg-amber-100 text-amber-800 border-amber-200"}
];

const CATEGORIES = [
  { name: "emotional", label: "Emotional Responses", icon: "😊", description: "How users feel about their current situation" },
  { name: "problem", label: "Problems & Pain Points", icon: "💥", description: "Challenges and obstacles users face" },
  { name: "outcome", label: "Goals & Outcomes", icon: "🎯", description: "What users want to achieve" },
  { name: "behavior", label: "Current Behavior", icon: "🔄", description: "How users currently work around problems" },
  { name: "context", label: "Context & Environment", icon: "🌍", description: "Background information that influences decisions" },
  { name: "business", label: "Business Context", icon: "💼", description: "Budget, purchasing, and business considerations" },
  { name: "action", label: "Action Items", icon: "✅", description: "Follow-up tasks and next steps" }
];

export default function Explanation() {
  const location = useLocation();
  const categoryRefs = useRef({});

  useEffect(() => {
    document.title = "Explanation - The Mom Notes";
    
    // Check if there's a category hash in the URL and scroll to it
    const hash = location.hash.replace('#', '');
    if (hash && categoryRefs.current[hash]) {
      setTimeout(() => {
        categoryRefs.current[hash].scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }, 100);
    }
  }, [location.hash]);

  const scrollToCategory = (categoryName) => {
    if (categoryRefs.current[categoryName]) {
      categoryRefs.current[categoryName].scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
      // Update URL hash without triggering navigation
      window.history.replaceState(null, '', `${location.pathname}#${categoryName}`);
    }
  };

  const handleKeyDown = (event, categoryName) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      scrollToCategory(categoryName);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--ruby-dust-50)] via-white to-[var(--ruby-dust-50)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link to={createPageUrl("DashboardsPage")}>
            <Button variant="outline" className="mb-6 bg-white/80 border-0">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboards
            </Button>
          </Link>
          
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Emoji Guide for Research Notes
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Use these emoji categories to quickly capture and organize insights from user interviews, 
              customer feedback, and research sessions.
            </p>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/20 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-[var(--ruby-dust-100)] rounded-xl flex items-center justify-center flex-shrink-0">
              <Lightbulb className="w-6 h-6 text-[var(--ruby-dust-600)]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Tips</h3>
              <ul className="text-gray-600 space-y-1">
                <li>• Use emojis to quickly categorize insights during interviews</li>
                <li>• One note can contain multiple insights - group related quotes together</li>
                <li>• Focus on exact user quotes rather than your interpretations</li>
                <li>• Review and tag notes immediately after interviews while memory is fresh</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Categories Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {CATEGORIES.map((category) => {
              const categoryEmojis = EMOJI_EXPLANATIONS.filter(e => e.category === category.name);
              
              return (
                <Card 
                  key={category.name} 
                  className="bg-white/70 backdrop-blur-sm border-0 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer focus-within:ring-2 focus-within:ring-[var(--ruby-dust-500)] focus-within:ring-offset-2"
                  onClick={() => scrollToCategory(category.name)}
                  onKeyDown={(e) => handleKeyDown(e, category.name)}
                  tabIndex={0}
                  role="button"
                  aria-label={`Jump to ${category.label} section`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{category.icon}</span>
                      <h3 className="font-semibold text-gray-900">{category.label}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                    
                    {/* Display emojis in this category */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {categoryEmojis.map((emojiItem) => (
                        <span 
                          key={emojiItem.emoji} 
                          className="text-xl bg-gray-50 rounded-md p-1 hover:bg-gray-100 transition-colors"
                          title={emojiItem.label}
                        >
                          {emojiItem.emoji}
                        </span>
                      ))}
                    </div>
                    
                    <Badge variant="outline" className="text-xs">
                      {categoryEmojis.length} emoji{categoryEmojis.length !== 1 ? 's' : ''}
                    </Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="space-y-12">
          {CATEGORIES.map((category) => (
            <div 
              key={category.name}
              ref={el => categoryRefs.current[category.name] = el}
              id={category.name}
              className="scroll-mt-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">{category.icon}</span>
                <h2 className="text-2xl font-bold text-gray-900">{category.label}</h2>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {EMOJI_EXPLANATIONS
                  .filter(emoji => emoji.category === category.name)
                  .map((emoji, index) => (
                    <motion.div
                      key={emoji.emoji}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-md hover:shadow-lg transition-all duration-200">
                        <CardHeader className="pb-4">
                          <div className="flex items-center gap-4">
                            <div className="text-4xl">{emoji.emoji}</div>
                            <div>
                              <CardTitle className="text-xl">{emoji.label}</CardTitle>
                              <Badge 
                                className={`mt-1 ${emoji.color} border cursor-pointer`}
                                onClick={() => scrollToCategory(category.name)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => handleKeyDown(e, category.name)}
                                aria-label={`Jump to ${category.label} section`}
                              >
                                {category.label}
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-700 mb-4 leading-relaxed">
                            {emoji.description}
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-[var(--ruby-dust-500)] to-[var(--ruby-dust-700)] rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to Start Taking Notes?</h3>
            <p className="text-[var(--ruby-dust-100)] mb-6 max-w-2xl mx-auto">
              Now that you know how to use the emoji system, start capturing valuable insights 
              from your user research and interviews.
            </p>
            <Link to={createPageUrl("DashboardsPage")}>
              <Button className="bg-white text-[var(--ruby-dust-600)] hover:bg-[var(--ruby-dust-50)]">
                <Target className="w-5 h-5 mr-2" />
                Start Taking Notes
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
