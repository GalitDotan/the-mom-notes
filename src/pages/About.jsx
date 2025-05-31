
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, User, Github, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function About() {
  useEffect(() => {
    document.title = "About - The Mom Notes";
  }, []);

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
          <div className="w-24 h-24 bg-gradient-to-r from-purple-400 to-indigo-600 rounded-3xl mx-auto mb-8 flex items-center justify-center transform rotate-12">
            <User className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            About The Creator
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Meet the person behind The Mom Notes
          </p>
        </motion.div>

        {/* Creator Profile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl overflow-hidden">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="w-32 h-32 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-3xl flex items-center justify-center flex-shrink-0">
                  <span className="text-4xl font-bold text-white">GD</span>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Galit Dotan
                  </h2>
                  <div className="prose prose-lg text-gray-700 space-y-4">
                    <p>
                      This project was created by <strong>Galit Dotan</strong>, an entrepreneur 
                      consistent in building thoughtful, user-centered products. Galit has 
                      experience in innovation, product development, and leveraging customer 
                      insights to drive meaningful solutions.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Connect Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8"
        >
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Connect with Galit
              </h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://www.linkedin.com/in/galit-dotan-337589204/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white shadow-lg transform hover:scale-105 transition-all duration-200">
                    <Linkedin className="w-5 h-5 mr-3" />
                    LinkedIn Profile
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </a>
                <a
                  href="https://github.com/GalitDotan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <Button 
                    variant="outline" 
                    className="w-full sm:w-auto bg-gray-900 text-white border-gray-900 hover:bg-gray-800 shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    <Github className="w-5 h-5 mr-3" />
                    GitHub Profile
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Mission Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white border-0 shadow-xl">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Project Mission</h3>
              <p className="text-lg text-purple-100 leading-relaxed max-w-2xl mx-auto">
                The Mom Notes was created to help entrepreneurs, product managers, and researchers 
                systematically capture and organize customer insights using Rob Fitzpatrick's proven 
                methodology. By making good customer development practices more accessible, we hope 
                to help more people build products that truly matter.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
