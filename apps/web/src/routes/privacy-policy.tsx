import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy-policy")({
    component: PrivacyPolicy,
});

function PrivacyPolicy() {
    return (
        <div className="w-full space-y-4">
            <div className="rounded-xl border border-green-900/30 bg-slate-900/50 p-8 shadow-lg">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
                    <p className="mt-2 text-sm text-slate-400">Last updated: November 24, 2025</p>
                </div>

                <div className="prose prose-invert max-w-none space-y-6 text-slate-300">
                    <section>
                        <h2 className="text-xl font-semibold text-white">1. Introduction</h2>
                        <p>
                            Welcome to Pepe Board Studio ("we," "our," or "us"). We respect your
                            privacy and are committed to protecting your personal data. This privacy
                            policy explains how we collect, use, and safeguard your information when
                            you use our Discord bot and web application.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white">
                            2. Information We Collect
                        </h2>
                        <h3 className="text-lg font-medium text-white">2.1 Discord Bot</h3>
                        <ul className="list-disc space-y-1 pl-6">
                            <li>Discord User IDs (for command usage tracking)</li>
                            <li>Discord Server IDs (for bot functionality)</li>
                            <li>Command inputs (text you provide to generate board images)</li>
                            <li>Usage statistics (command usage frequency, timestamps)</li>
                        </ul>

                        <h3 className="mt-4 text-lg font-medium text-white">2.2 Web Application</h3>
                        <ul className="list-disc space-y-1 pl-6">
                            <li>
                                Browser information (browser type, device type for analytics
                                purposes)
                            </li>
                            <li>Usage data (features used, session duration)</li>
                            <li>
                                All image generation happens locally in your browser - we do not
                                collect or store the images you create
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white">
                            3. How We Use Your Information
                        </h2>
                        <ul className="list-disc space-y-1 pl-6">
                            <li>To provide and maintain our service</li>
                            <li>To improve user experience and bot functionality</li>
                            <li>To monitor usage and detect abuse</li>
                            <li>To enforce rate limits and prevent spam</li>
                            <li>To generate anonymous usage statistics</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white">
                            4. Data Storage and Security
                        </h2>
                        <ul className="list-disc space-y-1 pl-6">
                            <li>
                                We store minimal data necessary for bot operation (user IDs, server
                                IDs, usage logs)
                            </li>
                            <li>Data is stored securely on protected servers</li>
                            <li>
                                We do not sell or share your personal information with third parties
                            </li>
                            <li>Command inputs are not permanently stored</li>
                            <li>
                                Generated images are created client-side and never uploaded to our
                                servers
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white">5. Data Retention</h2>
                        <p>
                            We retain usage logs and statistics for a maximum of 90 days. Server and
                            user IDs are retained as long as the bot remains in your server or until
                            you request deletion.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white">6. Your Rights</h2>
                        <p>You have the right to:</p>
                        <ul className="list-disc space-y-1 pl-6">
                            <li>Request access to your personal data</li>
                            <li>Request deletion of your data</li>
                            <li>Opt-out of data collection by removing the bot from your server</li>
                            <li>Request clarification on how your data is used</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white">
                            7. Third-Party Services
                        </h2>
                        <p>
                            Pepe Board uses Discord's API and complies with Discord's Terms of
                            Service and Privacy Policy. We do not use third-party analytics or
                            tracking services on our web application.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white">8. Children's Privacy</h2>
                        <p>
                            Our service is not directed to children under the age of 13. We do not
                            knowingly collect personal information from children under 13. If you
                            are a parent or guardian and believe your child has provided us with
                            personal information, please contact us.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white">
                            9. Changes to This Privacy Policy
                        </h2>
                        <p>
                            We may update this privacy policy from time to time. We will notify
                            users of any material changes by updating the "Last updated" date at the
                            top of this policy.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white">10. Contact Us</h2>
                        <p>
                            If you have any questions about this privacy policy or wish to exercise
                            your data rights, please contact us through our GitHub repository or
                            visit{" "}
                            <a
                                href="https://kopter.me"
                                target="_blank"
                                rel="noreferrer"
                                className="text-green-400 hover:text-green-300"
                            >
                                kopter.me
                            </a>
                            .
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
