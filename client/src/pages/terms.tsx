import { Link } from "wouter";
import { Helmet } from "react-helmet";
import { Footer } from "@/components/Footer";

export default function Terms() {
  return (
    <>
      <Helmet>
        <title>Terms of Service | Graphlynk</title>
        <meta name="description" content="Terms governing the use of Graphlynk's services and platform." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <Link href="/">
              <span className="text-xl font-bold text-foreground cursor-pointer" data-testid="link-home">
                Graphlynk
              </span>
            </Link>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-6 py-12">
          <h1 className="text-4xl font-bold text-foreground mb-8" data-testid="heading-terms">Terms of Service</h1>
          
          <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
            <p className="text-muted-foreground text-sm">
              Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>

            <section data-testid="section-introduction">
              <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Introduction</h2>
              <p className="text-foreground/90 leading-relaxed mb-4">
                Welcome to Graphlynk. These Terms of Service ("Terms") govern your access to and use of the Graphlynk website, platform, and services (collectively, the "Services"). By accessing or using our Services, you agree to be bound by these Terms.
              </p>
              <p className="text-foreground/90 leading-relaxed">
                In these Terms, "Graphlynk," "we," "our," and "us" refer to Graphlynk and its affiliates. "You" and "your" refer to any individual or entity accessing or using our Services.
              </p>
            </section>

            <section data-testid="section-services">
              <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Services Overview</h2>
              <p className="text-foreground/90 leading-relaxed mb-4">
                Graphlynk is a professional platform designed to help individuals, creators, and businesses establish authoritative digital entities. Our Services include:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-foreground/90">
                <li>Entity creation and optimization</li>
                <li>Knowledge Graph structuring and management</li>
                <li>Authority and visibility enhancement systems</li>
                <li>Professional entity validation and verification</li>
              </ul>
              <p className="text-foreground/90 leading-relaxed mt-4">
                Our Services are outcome-driven and professionally managed by experienced specialists dedicated to achieving measurable results for our clients.
              </p>
            </section>

            <section data-testid="section-guarantee">
              <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Knowledge Panel Guarantee</h2>
              <p className="text-foreground/90 leading-relaxed mb-4">
                Graphlynk guarantees the establishment of a Knowledge Panel for qualifying clients. To be eligible for this guarantee, you must:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-foreground/90">
                <li>Provide accurate and truthful information about the entity</li>
                <li>Complete all required onboarding and verification steps</li>
                <li>Maintain compliance with platform standards throughout the engagement</li>
              </ul>
              <p className="text-foreground/90 leading-relaxed mt-4">
                If the Knowledge Panel is not achieved within the agreed-upon timeframe, Graphlynk will continue work at no additional cost or provide resolution in accordance with your service agreement.
              </p>
            </section>

            <section data-testid="section-responsibilities">
              <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Client Responsibilities</h2>
              <p className="text-foreground/90 leading-relaxed mb-4">
                As a client of Graphlynk, you agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-foreground/90">
                <li>Provide accurate, complete, and truthful information</li>
                <li>Have proper authorization to represent the entity for which services are requested</li>
                <li>Participate actively in verification processes as required</li>
                <li>Refrain from submitting false, misleading, or impersonated data</li>
              </ul>
            </section>

            <section data-testid="section-acceptable-use">
              <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Acceptable Use</h2>
              <p className="text-foreground/90 leading-relaxed mb-4">
                You agree not to engage in any of the following prohibited activities:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-foreground/90">
                <li>Abuse, manipulation, or misrepresentation of information</li>
                <li>Interference with platform operations or security</li>
                <li>Unauthorized access to systems or data</li>
                <li>Any activity that violates applicable laws or regulations</li>
              </ul>
              <p className="text-foreground/90 leading-relaxed mt-4">
                Graphlynk reserves the right to suspend or terminate access to Services for any user who violates these terms or engages in prohibited conduct.
              </p>
            </section>

            <section data-testid="section-ip">
              <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Intellectual Property</h2>
              <p className="text-foreground/90 leading-relaxed mb-4">
                Graphlynk retains all rights, title, and interest in and to its platform software, systems, methodologies, branding, and designs. All proprietary technologies and content created by Graphlynk remain the exclusive property of Graphlynk.
              </p>
              <p className="text-foreground/90 leading-relaxed mb-4">
                You retain ownership of all content you submit to the platform. By submitting content, you grant Graphlynk a limited, non-exclusive license to use, reproduce, and display such content solely for the purpose of providing the Services to you.
              </p>
            </section>

            <section data-testid="section-disclaimers">
              <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Disclaimers</h2>
              <p className="text-foreground/90 leading-relaxed mb-4">
                While Graphlynk guarantees the establishment of a Knowledge Panel under qualifying conditions, we do not guarantee:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-foreground/90">
                <li>Specific search rankings, traffic levels, or revenue outcomes</li>
                <li>Permanent or indefinite visibility of any established panel</li>
                <li>Results from factors outside our reasonable control</li>
              </ul>
              <p className="text-foreground/90 leading-relaxed mt-4">
                Ongoing visibility of your Knowledge Panel depends on continued accuracy of information and compliance with applicable standards and guidelines.
              </p>
            </section>

            <section data-testid="section-liability">
              <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Limitation of Liability</h2>
              <p className="text-foreground/90 leading-relaxed mb-4">
                To the maximum extent permitted by applicable law, Graphlynk shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or business opportunities.
              </p>
              <p className="text-foreground/90 leading-relaxed">
                In no event shall Graphlynk's total liability exceed the amount paid by you for the Services giving rise to the claim during the twelve (12) months preceding the claim.
              </p>
            </section>

            <section data-testid="section-privacy">
              <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Privacy</h2>
              <p className="text-foreground/90 leading-relaxed">
                Your use of our Services is also governed by our Privacy Policy, which describes how we collect, use, and protect your personal information. By using our Services, you consent to the data practices described in the Privacy Policy.
              </p>
            </section>

            <section data-testid="section-modifications">
              <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Modifications</h2>
              <p className="text-foreground/90 leading-relaxed">
                Graphlynk reserves the right to modify these Terms at any time. We will provide notice of material changes by updating the "Last Updated" date at the top of this page. Your continued use of the Services after any modifications constitutes acceptance of the updated Terms.
              </p>
            </section>

            <section data-testid="section-termination">
              <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Termination</h2>
              <p className="text-foreground/90 leading-relaxed">
                Graphlynk may suspend or terminate your access to the Services at any time, with or without notice, for conduct that we believe violates these Terms, poses a risk to other users, or creates potential legal exposure for Graphlynk.
              </p>
            </section>

            <section data-testid="section-governing-law">
              <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Governing Law</h2>
              <p className="text-foreground/90 leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions. Any disputes arising from these Terms or your use of the Services shall be resolved in the appropriate courts within the United States.
              </p>
            </section>

            <section data-testid="section-contact">
              <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Contact Information</h2>
              <p className="text-foreground/90 leading-relaxed">
                For questions regarding these Terms of Service or other legal inquiries, please contact us at:
              </p>
              <p className="text-foreground/90 leading-relaxed mt-2">
                <strong>Email:</strong> legal@graphlynk.io
              </p>
            </section>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
