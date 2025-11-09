import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle } from "lucide-react";

const DeleteAccount = () => {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Delete Your Finsight Account</CardTitle>
            <p className="text-muted-foreground">Request deletion of your account and associated data</p>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="space-y-6 pr-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Account deletion is permanent and cannot be undone. Please read this page carefully before proceeding.
                  </AlertDescription>
                </Alert>

                <section>
                  <h2 className="text-2xl font-semibold mb-3">How to Request Account Deletion</h2>
                  <p className="text-muted-foreground mb-4">
                    To request deletion of your Finsight account and associated data, please follow these steps:
                  </p>
                  <ol className="list-decimal list-inside space-y-3 text-muted-foreground">
                    <li>
                      <strong>Sign in to your Finsight account</strong> using the app
                    </li>
                    <li>
                      <strong>Navigate to the Settings or Profile section</strong> (if available)
                    </li>
                    <li>
                      <strong>Contact our support team</strong> by sending an email to support@finsight.app with the subject line "Account Deletion Request"
                    </li>
                    <li>
                      <strong>Include your registered email address</strong> in the deletion request for verification
                    </li>
                    <li>
                      <strong>Wait for confirmation</strong> - We will process your request within 7 business days and send you a confirmation email
                    </li>
                  </ol>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-3">What Data Will Be Deleted</h2>
                  <p className="text-muted-foreground mb-3">
                    When you request account deletion, the following data will be permanently deleted from our systems:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li><strong>Account Information:</strong> Your email address, authentication credentials, and profile data</li>
                    <li><strong>Portfolio Data:</strong> All stocks, shares, purchase prices, and portfolio tracking information</li>
                    <li><strong>Personalization Data:</strong> Your saved preferences, interests, and recommendation history</li>
                    <li><strong>Usage History:</strong> Records of your interactions with the app and viewed content</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-3">Data Retention Period</h2>
                  <p className="text-muted-foreground mb-3">
                    Upon receiving your deletion request:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>
                      <strong>Immediate Action (within 7 days):</strong> Your account will be deactivated, and you will no longer be able to access the app
                    </li>
                    <li>
                      <strong>Complete Deletion (within 30 days):</strong> All personal data will be permanently deleted from our production databases
                    </li>
                    <li>
                      <strong>Backup Retention (up to 90 days):</strong> Data in encrypted backups may persist for up to 90 days as part of our disaster recovery procedures, after which it will be permanently purged
                    </li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-3">Data That May Be Retained</h2>
                  <p className="text-muted-foreground mb-3">
                    Certain data may be retained for legal or operational purposes:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>
                      <strong>Anonymized Analytics:</strong> Aggregated, anonymized usage statistics that cannot be linked back to you
                    </li>
                    <li>
                      <strong>Legal Records:</strong> Transaction records or communications required to be kept for compliance with financial regulations (typically 3-7 years)
                    </li>
                    <li>
                      <strong>Support Tickets:</strong> Historical support communications may be retained for quality assurance purposes with identifying information redacted
                    </li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-3">Before You Delete</h2>
                  <p className="text-muted-foreground mb-3">
                    Please consider the following before requesting account deletion:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Export your portfolio data if you want to keep a personal record</li>
                    <li>Download any reports or insights you may need for tax purposes</li>
                    <li>Note that deletion is permanent and you will need to create a new account if you want to use Finsight again</li>
                    <li>Active subscriptions (if any) should be cancelled separately through your app store</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-3">Contact Information</h2>
                  <p className="text-muted-foreground">
                    If you have questions about account deletion or data retention, please contact us at:
                  </p>
                  <p className="text-muted-foreground mt-2">
                    <strong>Email:</strong> support@finsight.app<br />
                    <strong>Subject:</strong> Account Deletion Inquiry
                  </p>
                </section>

                <section className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground italic">
                    This account deletion policy complies with Google Play Store requirements and applicable data protection regulations including GDPR and CCPA.
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

export default DeleteAccount;
