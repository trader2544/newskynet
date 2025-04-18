import Link from "next/link"
import { ArrowRight, MessageSquare, Phone, Shield, MessageCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function SupportPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Remove the SiteHeader component from here */}
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Customer Support</h1>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  We're here to help you with any questions or issues
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Contact Us</div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Get in Touch</h2>
                <p className="text-muted-foreground md:text-xl/relaxed">
                  Our customer support team is available 24/7 to assist you with any questions or issues you may have.
                </p>
                <div className="grid gap-4">
                  <div className="flex items-start gap-4">
                    <Phone className="h-6 w-6 text-primary" />
                    <div>
                      <h3 className="font-bold">Phone Support</h3>
                      <p className="text-sm text-muted-foreground">+254 793 996765</p>
                      <p className="text-sm text-muted-foreground">Available 24/7</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <MessageSquare className="h-6 w-6 text-primary" />
                    <div>
                      <h3 className="font-bold">Email Support</h3>
                      <p className="text-sm text-muted-foreground">gateiokyc254@gmail.com</p>
                      <p className="text-sm text-muted-foreground">We typically respond within 1 hour</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <MessageCircle className="h-6 w-6 text-primary" />
                    <div>
                      <h3 className="font-bold">Talk to Customer Care Now</h3>
                      <p className="text-sm text-muted-foreground mb-2">Get immediate assistance via WhatsApp</p>
                      <Button asChild size="sm">
                        <a href="https://wa.me/qr/V7HPAAOO7QRHF1" target="_blank" rel="noopener noreferrer">
                          Chat on WhatsApp
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Community</div>
                  <h3 className="text-xl font-bold mt-2 mb-4">Join Our Community</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Telegram Group</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          Join our Telegram group for instant updates and community support.
                        </p>
                        <Button asChild size="sm" variant="outline">
                          <a href="https://t.me/skynet254" target="_blank" rel="noopener noreferrer">
                            Join Telegram
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">WhatsApp Community</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          Connect with other users and get support in our WhatsApp group.
                        </p>
                        <Button asChild size="sm" variant="outline">
                          <a href="#" target="_blank" rel="noopener noreferrer">
                            Join WhatsApp
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Send Us a Message</CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you as soon as possible.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="first-name"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        First Name
                      </label>
                      <Input id="first-name" placeholder="John" />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="last-name"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Last Name
                      </label>
                      <Input id="last-name" placeholder="Doe" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Email
                    </label>
                    <Input id="email" placeholder="john.doe@example.com" type="email" />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="subject"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Subject
                    </label>
                    <Input id="subject" placeholder="How can we help you?" />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="message"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Message
                    </label>
                    <Textarea className="min-h-[120px]" id="message" placeholder="Type your message here." />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full gap-1">
                    Send Message
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Frequently Asked Questions</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Quick answers to common questions
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              {[
                {
                  question: "How do I install the VPN configuration?",
                  answer:
                    "After purchase, you'll receive a configuration file via email. Open your VPN application, go to the import section, and select the file. We provide detailed instructions for each supported application.",
                },
                {
                  question: "My configuration stopped working. What should I do?",
                  answer:
                    "First, check if your subscription is still active. If it is, try restarting your device and VPN application. If the issue persists, contact our support team for assistance.",
                },
                {
                  question: "How do I renew my subscription?",
                  answer:
                    "You can renew your subscription by purchasing a new configuration before your current one expires. We'll send you a reminder email a few days before expiration.",
                },
                {
                  question: "Can I use the same configuration on multiple devices?",
                  answer:
                    "Each configuration is licensed for use on one device at a time. If you need to use the service on multiple devices simultaneously, you'll need to purchase additional configurations.",
                },
                {
                  question: "Do you offer refunds?",
                  answer:
                    "We offer a 24-hour money-back guarantee if you're not satisfied with our service. Please contact our customer support team for assistance.",
                },
                {
                  question: "How do I make a payment?",
                  answer:
                    "We accept mobile money transfers, including M-Pesa, as well as bank transfers. After selecting your desired configuration, you'll receive payment instructions. Once payment is confirmed, we'll send your configuration file.",
                },
              ].map((faq, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="flex justify-center">
              <Button className="gap-1">
                <ArrowRight className="h-4 w-4" />
                View All FAQs
              </Button>
            </div>
          </div>
        </section>
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
