import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Lightbulb, Target, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const EMOJI_EXPLANATIONS = [
  {
    emoji: "🙂",
    label: "Excited",
    description: "User shows enthusiasm, excitement, or positive emotion about a feature, idea, or experience.",
    example: "\"I love how easy this makes my workflow!\"",
    category: "emotional",
    color: "bg-green-100 text-green-800 border-green-200"
  },
  {
    emoji: "🙁",
    label: "Angry",
    description: "User expresses frustration, anger, or dissatisfaction with current solutions or problems.",
    example: "\"This process is so frustrating, it wastes so much of my time.\"",
    category: "emotional",
    color: "bg-red-100 text-red-800 border-red-200"
  },
  {
    emoji: "😳",
    label: "Embarrassed",
    description: "User feels awkward, uncomfortable, or embarrassed about admitting something or describing a situation.",
    example: "\"I'm embarrassed to say I still use spreadsheets for this.\"",
    category: "emotional",
    color: "bg-pink-100 text-pink-800 border-pink-200"
  },
  {
    emoji: "⚡",
    label: "Pain/Problem",
    description: "Clear pain point, problem, or challenge the user faces. This is what you're trying to solve.",
    example: "\"It takes me 3 hours every week to manually update these reports.\"",
    category: "problem",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200"
  },
  {
    emoji: "🥅",
    label: "Goal/Job-to-be-done",
    description: "What the user is trying to accomplish or achieve. Their desired outcome or objective.",
    example: "\"I want to get insights from customer data without learning SQL.\"",
    category: "outcome",
    color: "bg-blue-100 text-blue-800 border-blue-200"
  },
  {
    emoji: "🟥",
    label: "Obstacle",
    description: "Barriers, blockers, or obstacles preventing the user from reaching their goals.",
    example: "\"My manager needs to approve every change, which slows everything down.\"",
    category: "problem",
    color: "bg-red-100 text-red-800 border-red-200"
  },
  {
    emoji: "↪️",
    label: "Workaround",
    description: "Creative solutions or hacks the user has developed to work around current limitations.",
    example: "\"I export to CSV, clean it in Excel, then import it back.\"",
    category: "behavior",
    color: "bg-purple-100 text-purple-800 border-purple-200"
  },
  {
    emoji: "🏔",
    label: "Context/Background",
    description: "Important context, background information, or environmental factors that influence decisions.",
    example: "\"We're a remote team spread across 5 time zones.\"",
    category: "context",
    color: "bg-gray-100 text-gray-800 border-gray-200"
  },
  {
    emoji: "☑️",
    label: "Feature Request",
    description: "Specific features, functionality, or improvements the user wants or suggests.",
    example: "\"It would be great if I could set up automated alerts.\"",
    category: "outcome",
    color: "bg-green-100 text-green-800 border-green-200"
  },
  {
    emoji: "💲",
    label: "Budget/Purchasing",
    description: "Information about budget, pricing sensitivity, purchasing decisions, or financial constraints.",
    example: "\"We can spend up to $500/month if it saves us 10 hours of work.\"",
    category: "business",
    color: "bg-emerald-100 text-emerald-800 border-emerald-200"
  },
  {
    emoji: "♀️",
    label: "Specific Person/Company",
    description: "References to specific people, companies, competitors, or stakeholders that influence decisions.",
    example: "\"Our CEO mentioned that Salesforce does this really well.\"",
    category: "context",
    color: "bg-indigo-100 text-indigo-800 border-indigo-200"
  },
  {
    emoji: "⭐",
    label: "Follow-up Task",
    description: "Action items, follow-up tasks, or things you need to research or validate later.",
    example: "\"Need to check if this integrates with their existing CRM.\"",
    category: "action",
    color: "bg-amber-100 text-amber-800 border-amber-200"
  }
];

const CATEGORIES = [
  {
    name: "emotional",
    label: "Emotional Responses",
    icon: "😊",
    description: "How users feel about their current situation"
  },
  {
    name: "problem",
    label: "Problems & Pain Points",
    icon: "⚡",
    description: "Challenges and obstacles users face"
  },
  {
    name: "outcome",
    label: "Goals & Outcomes",
    icon: "🎯",
    description: "What users want to achieve"
  },
  {
    name: "behavior",
    label: "Current Behavior",
    icon: "🔄",
    description: "How users currently work around problems"
  },
  {
    name: "context",
    label: "Context & Environment",
    icon: "🌍",
    description: "Background information that influences decisions"
  },
  {
    name: "business",
    label: "Business Context",
    icon: "💼",
    description: "Budget, purchasing, and business considerations"
  },
  {
    name: "action",
    label: "Action Items",
    icon: "✅",
    description: "Follow-up tasks and next steps"
  }
];

export default function Explanation() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to={createPageUrl("Dashboard")}>
            <Button variant="outline" className="mb-6 bg-white/80 border-0">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Notes
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

        {/* Quick Tips */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/20 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Lightbulb className="w-6 h-6 text-blue-600" />
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

        {/* Categories Overview */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Categories Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {CATEGORIES.map((category) => (
              <Card key={category.name} className="bg-white/70 backdrop-blur-sm border-0 shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{category.icon}</span>
                    <h3 className="font-semibold text-gray-900">{category.label}</h3>
                  </div>
                  <p className="text-sm text-gray-600">{category.description}</p>
                  <div className="mt-3">
                    <Badge variant="outline" className="text-xs">
                      {EMOJI_EXPLANATIONS.filter(e => e.category === category.name).length} emojis
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Detailed Explanations */}
        <div className="space-y-8">
          {CATEGORIES.map((category) => (
            <div key={category.name}>
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
                              <Badge className={`mt-1 ${emoji.color} border`}>
                                {category.label}
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-700 mb-4 leading-relaxed">
                            {emoji.description}
                          </p>
                          <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-sm font-medium text-gray-600 mb-1">Example:</p>
                            <p className="text-sm text-gray-800 italic">
                              {emoji.example}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to Start Taking Notes?</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Now that you know how to use the emoji system, start capturing valuable insights 
              from your user research and interviews.
            </p>
            <Link to={createPageUrl("Dashboard")}>
              <Button className="bg-white text-blue-600 hover:bg-blue-50">
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