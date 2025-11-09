import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Privacy Policy</CardTitle>
            <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="space-y-6 pr-4">
                <section>
                  <h2 className="text-2xl font-semibold mb-3">Introduction</h2>
                  <p className="text-muted-foreground">
                    This Privacy Policy describes how our financial insights application ("we", "our", or "the App") 
                    collects, uses, and protects your personal information when you use our services.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-3">Information We Collect</h2>
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-xl font-medium mb-2">Account Information</h3>
                      <p className="text-muted-foreground">
                        When you create an account, we collect your email address and authentication credentials 
                        to provide you with secure access to our services.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xl font-medium mb-2">Portfolio Data</h3>
                      <p className="text-muted-foreground">
                        We store information about stocks you add to your portfolio, including stock symbols, 
                        number of shares, and purchase prices to provide portfolio tracking and analysis features.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xl font-medium mb-2">Usage Information</h3>
                      <p className="text-muted-foreground">
                        We collect information about how you interact with the App, including pages visited, 
                        features used, and interactions with financial content to improve our services.
                      </p>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-3">How We Use Your Information</h2>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>To provide and maintain our financial tracking services</li>
                    <li>To personalize your experience with stock recommendations and insights</li>
                    <li>To send you important updates about your portfolio and market changes</li>
                    <li>To improve and optimize our App's features and performance</li>
                    <li>To protect against unauthorized access and ensure security</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-3">Data Storage and Security</h2>
                  <p className="text-muted-foreground mb-3">
                    Your data is stored securely using industry-standard encryption and security measures. 
                    We use Supabase as our backend infrastructure, which provides enterprise-grade security 
                    and compliance.
                  </p>
                  <p className="text-muted-foreground">
                    We implement appropriate technical and organizational measures to protect your personal 
                    information against unauthorized access, alteration, disclosure, or destruction.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-3">Third-Party Services</h2>
                  <p className="text-muted-foreground mb-3">
                    We use third-party services to provide stock market data, news, and analytics. These services 
                    may have their own privacy policies:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Financial market data providers for real-time stock prices and information</li>
                    <li>News aggregation services for financial news and articles</li>
                    <li>Analytics services to understand usage patterns and improve our App</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-3">Your Rights</h2>
                  <p className="text-muted-foreground mb-3">You have the right to:</p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Access your personal information we hold about you</li>
                    <li>Request correction of inaccurate personal information</li>
                    <li>Request deletion of your personal information</li>
                    <li>Export your portfolio data at any time</li>
                    <li>Opt-out of promotional communications</li>
                  </ul>
                  <p className="text-muted-foreground mt-4">
                    To request account deletion, please visit our{' '}
                    <a 
                      href="/delete-account" 
                      className="text-primary hover:underline font-medium"
                    >
                      Account Deletion page
                    </a>
                    {' '}for detailed instructions.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-3">Children's Privacy</h2>
                  <p className="text-muted-foreground">
                    Our App is not intended for children under the age of 13. We do not knowingly collect 
                    personal information from children under 13. If you believe we have collected information 
                    from a child under 13, please contact us immediately.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-3">Data Retention</h2>
                  <p className="text-muted-foreground">
                    We retain your personal information for as long as your account is active or as needed to 
                    provide you services. If you wish to delete your account, you may do so through the App 
                    settings, and we will delete your personal information within 30 days.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-3">Changes to This Policy</h2>
                  <p className="text-muted-foreground">
                    We may update this Privacy Policy from time to time. We will notify you of any changes by 
                    posting the new Privacy Policy on this page and updating the "Last updated" date.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-3">Contact Us</h2>
                  <p className="text-muted-foreground">
                    If you have any questions about this Privacy Policy or our data practices, please contact us 
                    through the App's support section.
                  </p>
                </section>

                <section className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground italic">
                    This privacy policy is designed to comply with Google Play Store requirements and general 
                    data protection regulations. Users should review this policy regularly for updates.
                  </p>
                </section>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
