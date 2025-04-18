import Link from "next/link"
import Image from "next/image"
import { ArrowRight, CheckCircle, Shield, Users, Zap, Server, ExternalLink } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Home() {
  return (
    <div className="flex flex-col">
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Premium VPN Configs for Uninterrupted Connectivity
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Skynet provides optimized VPN configurations for all your connectivity needs. Fast, secure, and
                  reliable.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button size="lg" className="h-12" asChild>
                  <Link href="/login">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="h-12">
                  Learn More
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>Featured VPN Config</CardTitle>
                  <CardDescription>HTTP Custom - Our most popular configuration</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="flex items-center gap-4 text-sm">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <div>Optimized for speed and reliability</div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <div>Works on all major networks</div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <div>24/7 technical support</div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <div>Regular updates for optimal performance</div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" asChild>
                    <Link href="/pricing">Buy Now - Monthly @300</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* New section for Hosting and VPS Services */}
      <section className="w-full py-8 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 rounded-lg border p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <Server className="h-10 w-10 text-primary" />
              <div>
                <h3 className="text-xl font-bold">Exclusive Hosting & VPS Services</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Premium hosting solutions available for experienced members who understand responsible usage.
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild variant="outline" className="gap-1">
                <a href="https://wa.me/qr/V7HPAAOO7QRHF1" target="_blank" rel="noopener noreferrer">
                  Contact on WhatsApp
                  <ExternalLink className="h-4 w-4 ml-1" />
                </a>
              </Button>
              <Button asChild className="gap-1">
                <Link href="/admin">
                  Contact Admin
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Available VPN Configs</div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Choose Your VPN Configuration</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                We offer optimized configurations for popular VPN applications. Select the one that works best for you.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-start gap-6 py-12 lg:grid-cols-3 lg:gap-12">
            <Card>
              <CardHeader className="text-center">
                <CardTitle>HTTP Custom</CardTitle>
                <CardDescription>Fast and reliable connectivity</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="flex justify-center mb-4">
                  <Image src="/images/hc.png" alt="HTTP Custom VPN" width={150} height={150} className="rounded-md" />
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <div>Optimized for all networks</div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <div>Low latency connection</div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <div>Regular updates</div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                <Tabs defaultValue="monthly" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="3days">3 Days</TabsTrigger>
                    <TabsTrigger value="weekly">Weekly</TabsTrigger>
                    <TabsTrigger value="2weeks">2 Weeks</TabsTrigger>
                    <TabsTrigger value="monthly">Monthly</TabsTrigger>
                  </TabsList>
                  <TabsContent value="3days" className="mt-2">
                    <Button className="w-full" asChild>
                      <Link href="/pricing">Buy Now - @50</Link>
                    </Button>
                  </TabsContent>
                  <TabsContent value="weekly" className="mt-2">
                    <Button className="w-full" asChild>
                      <Link href="/pricing">Buy Now - @100</Link>
                    </Button>
                  </TabsContent>
                  <TabsContent value="2weeks" className="mt-2">
                    <Button className="w-full" asChild>
                      <Link href="/pricing">Buy Now - @200</Link>
                    </Button>
                  </TabsContent>
                  <TabsContent value="monthly" className="mt-2">
                    <Button className="w-full" asChild>
                      <Link href="/pricing">Buy Now - @300</Link>
                    </Button>
                  </TabsContent>
                </Tabs>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="text-center">
                <CardTitle>HTTP Injector</CardTitle>
                <CardDescription>Powerful and versatile</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="flex justify-center mb-4">
                  <Image src="/images/hi.png" alt="HTTP Injector VPN" width={150} height={150} className="rounded-md" />
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <div>Advanced configuration options</div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <div>Optimized for streaming</div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <div>Technical support included</div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                <Tabs defaultValue="monthly" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="3days">3 Days</TabsTrigger>
                    <TabsTrigger value="weekly">Weekly</TabsTrigger>
                    <TabsTrigger value="2weeks">2 Weeks</TabsTrigger>
                    <TabsTrigger value="monthly">Monthly</TabsTrigger>
                  </TabsList>
                  <TabsContent value="3days" className="mt-2">
                    <Button className="w-full" asChild>
                      <Link href="/pricing">Buy Now - @50</Link>
                    </Button>
                  </TabsContent>
                  <TabsContent value="weekly" className="mt-2">
                    <Button className="w-full" asChild>
                      <Link href="/pricing">Buy Now - @100</Link>
                    </Button>
                  </TabsContent>
                  <TabsContent value="2weeks" className="mt-2">
                    <Button className="w-full" asChild>
                      <Link href="/pricing">Buy Now - @200</Link>
                    </Button>
                  </TabsContent>
                  <TabsContent value="monthly" className="mt-2">
                    <Button className="w-full" asChild>
                      <Link href="/pricing">Buy Now - @300</Link>
                    </Button>
                  </TabsContent>
                </Tabs>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="text-center">
                <CardTitle>Dark Tunnel</CardTitle>
                <CardDescription>Secure and anonymous</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="flex justify-center mb-4">
                  <Image src="/images/dark.png" alt="Dark Tunnel VPN" width={150} height={150} className="rounded-md" />
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <div>Enhanced privacy features</div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <div>Works on restricted networks</div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <div>Optimized for gaming</div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                <Tabs defaultValue="monthly" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="3days">3 Days</TabsTrigger>
                    <TabsTrigger value="weekly">Weekly</TabsTrigger>
                    <TabsTrigger value="2weeks">2 Weeks</TabsTrigger>
                    <TabsTrigger value="monthly">Monthly</TabsTrigger>
                  </TabsList>
                  <TabsContent value="3days" className="mt-2">
                    <Button className="w-full" asChild>
                      <Link href="/pricing">Buy Now - @50</Link>
                    </Button>
                  </TabsContent>
                  <TabsContent value="weekly" className="mt-2">
                    <Button className="w-full" asChild>
                      <Link href="/pricing">Buy Now - @100</Link>
                    </Button>
                  </TabsContent>
                  <TabsContent value="2weeks" className="mt-2">
                    <Button className="w-full" asChild>
                      <Link href="/pricing">Buy Now - @200</Link>
                    </Button>
                  </TabsContent>
                  <TabsContent value="monthly" className="mt-2">
                    <Button className="w-full" asChild>
                      <Link href="/pricing">Buy Now - @300</Link>
                    </Button>
                  </TabsContent>
                </Tabs>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Coming Soon</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our developers are working on configurations for these VPN applications.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-start gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
            {["HA Tunnel", "Netmod", "EV2Ray", "Open Tunnel", "TC Tunnel", "Psiphon Pro", "NVP Tunnel"].map((vpn) => (
              <Card key={vpn} className="bg-background/50">
                <CardHeader>
                  <CardTitle>{vpn}</CardTitle>
                  <CardDescription>Coming soon</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Our team is working on optimizing configurations for this VPN application.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" disabled className="w-full">
                    Coming Soon
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Why Choose Skynet?</h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  We're dedicated to providing the best VPN configurations for all your connectivity needs.
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-start gap-4">
                  <Shield className="h-8 w-8 text-primary" />
                  <div className="space-y-1">
                    <h3 className="font-bold">Reliable Configurations</h3>
                    <p className="text-sm text-muted-foreground">
                      Our configs are regularly updated to ensure optimal performance.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Zap className="h-8 w-8 text-primary" />
                  <div className="space-y-1">
                    <h3 className="font-bold">Fast Connectivity</h3>
                    <p className="text-sm text-muted-foreground">
                      Optimized for speed and low latency on all networks.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Users className="h-8 w-8 text-primary" />
                  <div className="space-y-1">
                    <h3 className="font-bold">24/7 Support</h3>
                    <p className="text-sm text-muted-foreground">
                      Our customer care team is always ready to assist you.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle className="h-8 w-8 text-primary" />
                  <div className="space-y-1">
                    <h3 className="font-bold">Trusted Service</h3>
                    <p className="text-sm text-muted-foreground">Join thousands of satisfied users across Kenya.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>Customer Testimonial</CardTitle>
                  <CardDescription>John K. - University of Nairobi</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    "Skynet has been a game-changer for me. The VPN configs are reliable and the customer support is
                    excellent. I've recommended it to all my classmates!"
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
      <footer className="w-full border-t bg-background py-6 md:py-8">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-bold">Skynet</span>
          </div>
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} Skynet. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Terms
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
