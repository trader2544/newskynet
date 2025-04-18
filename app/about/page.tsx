import Link from "next/link"
import { ArrowRight, CheckCircle, Shield, Users, Zap } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Remove the SiteHeader component from here */}
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">About Skynet</h1>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  A collaboration of developers dedicated to solving connectivity challenges
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Our Story</div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">How Skynet Began</h2>
                <p className="text-muted-foreground md:text-xl/relaxed">
                  Skynet was founded by a group of developers who recognized the connectivity challenges faced by
                  students and professionals in Kenya. What started as a small project to help university students has
                  grown into a trusted service with over 5,000 subscribers across the country.
                </p>
                <p className="text-muted-foreground md:text-xl/relaxed">
                  Our team is composed of experienced developers who are passionate about providing reliable and
                  affordable connectivity solutions. We continuously work to optimize our configurations and expand our
                  offerings to meet the evolving needs of our users.
                </p>
              </div>
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Our Mission</div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">What Drives Us</h2>
                <p className="text-muted-foreground md:text-xl/relaxed">
                  At Skynet, our mission is to provide reliable, affordable, and accessible connectivity solutions to
                  everyone. We believe that stable internet access should be available to all, regardless of location or
                  network restrictions.
                </p>
                <p className="text-muted-foreground md:text-xl/relaxed">
                  We are committed to continuous improvement and innovation. Our team works tirelessly to develop and
                  optimize VPN configurations that deliver the best possible performance on all networks.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Why Users Trust Skynet</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  We've built a reputation for reliability and excellence
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Popular in Universities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Skynet is widely used across universities and colleges in Kenya, where students rely on our
                    configurations for stable and affordable connectivity.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    5,000+ Subscribers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Our social media channels and community have grown to over 5,000 subscribers who trust and rely on
                    our services daily.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    24/7 Customer Support
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    We provide round-the-clock customer care support to ensure our users can get assistance whenever
                    they need it.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Meet Our Team</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  The developers behind Skynet
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  name: "Alex Kamau",
                  role: "Lead Developer",
                  bio: "Specializes in VPN configuration optimization and network security.",
                },
                {
                  name: "Sarah Odhiambo",
                  role: "Backend Developer",
                  bio: "Manages our server infrastructure and ensures reliable service delivery.",
                },
                {
                  name: "James Mwangi",
                  role: "Frontend Developer",
                  bio: "Creates the user-friendly interfaces that make our service accessible to all.",
                },
                {
                  name: "Lucy Njeri",
                  role: "Customer Support Lead",
                  bio: "Ensures all user queries are addressed promptly and effectively.",
                },
                {
                  name: "David Otieno",
                  role: "Network Specialist",
                  bio: "Works on optimizing configurations for different network environments.",
                },
                {
                  name: "Grace Wanjiku",
                  role: "Quality Assurance",
                  bio: "Tests all configurations to ensure they meet our high standards.",
                },
              ].map((member) => (
                <Card key={member.name}>
                  <CardHeader>
                    <CardTitle>{member.name}</CardTitle>
                    <CardDescription>{member.role}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{member.bio}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Join Our Community</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Become part of the growing Skynet family
                </p>
              </div>
            </div>
            <div className="mx-auto flex max-w-md flex-col items-center justify-center gap-4 py-12">
              <p className="text-center text-muted-foreground">
                Join thousands of satisfied users who rely on Skynet for their connectivity needs. Follow us on social
                media and be the first to know about new configurations and updates.
              </p>
              <div className="flex gap-4">
                <Button className="gap-1" asChild>
                  <Link href="/register">
                    <ArrowRight className="h-4 w-4" />
                    Sign Up Now
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/support">Contact Us</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Rest of the page content remains the same... */}
      </main>
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
