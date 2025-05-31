import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Heart, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function Credits() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to={createPageUrl("Dashboard")}>
            <Button variant="outline" className="mb-6 bg-white/80 border-0">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Notes
            </Button>
          </Link>
        </div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="w-24 h-24 bg-gradient-to-r from-red-400 to-pink-600 rounded-3xl mx-auto mb-8 flex items-center justify-center transform rotate-12">
            <Heart className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Credits & Attribution
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            This app stands on the shoulders of giants
          </p>
        </motion.div>

        {/* Rob Fitzpatrick Credit */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl overflow-hidden">
            <CardContent className="p-8">
              <div className="flex items-start gap-6">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-10 h-10 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Inspired by "The Mom Test"
                  </h2>
                  <div className="prose prose-lg text-gray-700 space-y-4">
                    <p>
                      This app is inspired by and gives full credit to <strong>Rob Fitzpatrick</strong>, 
                      author of <em>The Mom Test</em> — a must-read book for anyone doing customer development, 
                      product interviews, or startup validation.
                    </p>
                    <p>
                      We highly recommend you buy the book and support Rob's work:
                    </p>
                    <div className="flex justify-center my-6">
                      <a
                        href="https://momtestbook.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block"
                      >
                        <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-lg px-8 py-4 shadow-lg transform hover:scale-105 transition-all duration-200">
                          <ExternalLink className="w-5 h-5 mr-3" />
                          Get The Mom Test Book
                        </Button>
                      </a>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-800">
                      <p className="text-sm font-medium">
                        <strong>Important:</strong> This project is not affiliated with, endorsed by, 
                        or officially connected to Rob Fitzpatrick or The Mom Test. It's simply a 
                        tribute tool for those who want to apply the lessons in their own workflows.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quote from The Mom Test */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0 shadow-xl">
            <CardContent className="p-8 text-center">
              <blockquote className="text-xl italic mb-4 leading-relaxed">
                "The Mom Test is a set of simple rules for crafting good questions that 
                even your mom can't lie to you about."
              </blockquote>
              <cite className="text-blue-100 font-medium">— Rob Fitzpatrick</cite>
            </CardContent>
          </Card>
        </motion.div>

        {/* Why This Matters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                Why The Mom Test Methodology Matters
              </h3>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">✅</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Better Questions</h4>
                  <p className="text-sm text-gray-600">
                    Learn to ask questions that reveal actual behavior, not just opinions
                  </p>
                </div>
                <div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">💡</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Real Insights</h4>
                  <p className="text-sm text-gray-600">
                    Discover what customers actually do, not what they say they'll do
                  </p>
                </div>
                <div>
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Build Better</h4>
                  <p className="text-sm text-gray-600">
                    Create products people actually want by understanding real problems
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}