import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Droplet, Droplets, Heart, Zap, Globe, Shield, Users, BookOpen } from "lucide-react"
import Link from "next/link"

export default function DonatePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-white">

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-16 lg:py-20 bg-blue-600 text-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/20 mb-6">
                <Heart className="h-8 w-8" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
                Make a Difference Today
              </h1>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                Your donation helps provide clean, safe water to communities in need around the world.
              </p>
            </div>
          </div>
        </section>

        {/* Donation Form Section */}
        <section className="py-12 md:py-16 lg:py-20">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8 items-start">
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold tracking-tight">Donate Now</h2>
                  <p className="text-gray-600">
                    Every dollar you donate goes directly to funding clean water projects in communities that need it most. 
                    Your support changes lives.
                  </p>
                  
                  <div className="space-y-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center">
                          <Zap className="h-5 w-5 mr-2 text-blue-600" />
                          Quick Donation
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          {[25, 50, 100, 250].map((amount) => (
                            <Button key={amount} variant="outline" className="h-14 text-lg">
                              ${amount}
                            </Button>
                          ))}
                        </div>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                          <input 
                            type="number" 
                            placeholder="Custom amount" 
                            className="w-full pl-8 pr-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </CardContent>
                    </Card>

                    <div className="space-y-4">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-14 text-lg">
                        Donate Now
                      </Button>
                      <p className="text-sm text-gray-500 text-center">
                        Secure payment processing powered by Givebutter
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="bg-white p-6 rounded-lg border shadow-sm">
                    <h3 className="text-xl font-semibold mb-4">How Your Donation Helps</h3>
                    <div className="space-y-6">
                      {[
                        {
                          icon: <Droplet className="h-6 w-6 text-blue-600" />,
                          title: "Clean Water",
                          text: "$25 provides clean water for one person for a year"
                        },
                        {
                          icon: <Users className="h-6 w-6 text-blue-600" />,
                          title: "Community Impact",
                          text: "$100 helps provide water access for an entire family"
                        },
                        {
                          icon: <Globe className="h-6 w-6 text-blue-600" />,
                          title: "Global Reach",
                          text: "$1,000 can fund a water project for a small community"
                        },
                        {
                          icon: <Shield className="h-6 w-6 text-blue-600" />,
                          title: "Sustainable Solutions",
                          text: "We partner with leading organizations like charity:water to ensure long-term impact"
                        }
                      ].map((item, index) => (
                        <div key={index} className="flex items-start space-x-4">
                          <div className="p-2 bg-blue-50 rounded-full">
                            {item.icon}
                          </div>
                          <div>
                            <h4 className="font-medium">{item.title}</h4>
                            <p className="text-sm text-gray-600">{item.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Learn More Section */}
                  <div className="bg-white p-6 rounded-lg border shadow-sm">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <BookOpen className="h-5 w-5 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-semibold">Accountability and Transparency</h3>
                    </div>
                    <p className="text-gray-600 mb-4 text-sm">
                      We are committed to transparency and accountability in our operations. 
                      Your contribution helps provide clean water, improve health, and transform communities around the world.
                    </p>
                    <Link href="/documentation">
                      <Button variant="outline" size="sm" className="border-blue-600 text-blue-600 hover:bg-blue-50 w-full sm:w-auto">
                        Read Our Financial Report
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Givebutter Integration Section */}
        <section className="py-4 md:py-16 bg-gray-50">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold tracking-tight mb-8">Make a Recurring Impact</h2>
              <div className="bg-white p-6 rounded-lg border shadow-sm">
                <div className="aspect-w-16 aspect-h-9 mb-6 rounded-lg overflow-hidden">
                  {/* This is where the Givebutter embed code will go */}
                  <div className="bg-gray-100 h-64 flex items-center justify-center rounded-lg">
                    <p className="text-gray-500">Givebutter Donation Widget Will Appear Here</p>
                  </div>
                </div>
                <p className="text-gray-600 mt-4">
                  Set up a monthly donation to provide sustainable support for clean water initiatives worldwide.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 md:py-16 bg-blue-600 text-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold tracking-tight mb-6">Join Our Mission</h2>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
                Together, we can bring clean water to communities in need and transform lives.
              </p>
              <div className="w-full max-w-md mx-auto">
                <Link href="/quizzes" className="w-full">
                  <Button 
                    variant="secondary" 
                    className="w-full bg-white text-blue-600 hover:bg-blue-50 h-14 px-8 text-lg group"
                  >
                    <Droplet className="!h-7 !w-7 mr-3 text-blue-600 drop-shadow-md" />
                    <span className="text-lg">Start Earning Droplets</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white">
        <div className="container px-4 md:px-6 py-12 mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-2 mb-4 md:mb-0">
                <Droplets className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">WaterForTheWorld</span>
              </div>
              <p className="text-sm text-gray-600">
                © {new Date().getFullYear()} WaterForTheWorld. All rights reserved.
              </p>
            </div>
          </div>
      </footer>
    </div>
  )
}
