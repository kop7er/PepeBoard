import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/terms-of-service")({
    component: TermsOfService,
});

function TermsOfService() {
    return (
        <div className="w-full space-y-4">
            <div className="rounded-xl border border-green-900/30 bg-slate-900/50 p-8 shadow-lg">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white">Terms of Service</h1>
                    <p className="mt-2 text-sm text-slate-400">
                        Last updated: November 24, 2025
                    </p>
                </div>

                <div className="prose prose-invert max-w-none space-y-6 text-slate-300">
                    <section>
                        <h2 className="text-xl font-semibold text-white">1. Agreement to Terms</h2>
                        <p>
                            By accessing or using Pepe Board Studio ("the Service"), including our
                            Discord bot and web application, you agree to be bound by these Terms of
                            Service. If you do not agree to these terms, please do not use the
                            Service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white">2. Description of Service</h2>
                        <p>
                            Pepe Board Studio provides tools for creating Pepe board meme images
                            through:
                        </p>
                        <ul className="list-disc space-y-1 pl-6">
                            <li>A Discord bot that generates images via commands</li>
                            <li>A web application for creating and downloading board images</li>
                        </ul>
                        <p>
                            The Service is provided free of charge and is subject to availability and
                            modification at any time.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white">3. Acceptable Use</h2>
                        <p>You agree to use the Service only for lawful purposes. You must not:</p>
                        <ul className="list-disc space-y-1 pl-6">
                            <li>
                                Create content that is illegal, threatening, abusive, harassing,
                                defamatory, or otherwise objectionable
                            </li>
                            <li>Use the Service to violate Discord's Terms of Service or Community Guidelines</li>
                            <li>Attempt to abuse, exploit, or disrupt the Service</li>
                            <li>Use automated means to access the Service excessively (spam, DDoS)</li>
                            <li>Reverse engineer or attempt to extract source code from the bot</li>
                            <li>Impersonate others or misrepresent your affiliation</li>
                            <li>Create content that infringes on intellectual property rights</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white">4. Rate Limits and Restrictions</h2>
                        <p>
                            To ensure fair usage, we implement rate limits on bot commands and API
                            requests. Excessive use may result in temporary or permanent restriction of
                            access to the Service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white">5. Content and Intellectual Property</h2>
                        <h3 className="text-lg font-medium text-white">5.1 Your Content</h3>
                        <p>
                            You retain all rights to the text you input. By using the Service, you
                            grant us a limited license to process your input text solely for the
                            purpose of generating board images.
                        </p>

                        <h3 className="mt-4 text-lg font-medium text-white">5.2 Generated Images</h3>
                        <p>
                            Images generated through our Service are created using a combination of
                            your text input and base images. You are responsible for ensuring your use
                            of generated images complies with applicable laws and does not infringe on
                            third-party rights.
                        </p>

                        <h3 className="mt-4 text-lg font-medium text-white">5.3 Our Service</h3>
                        <p>
                            The Pepe Board Studio software, bot code, and web application are protected
                            by copyright and other intellectual property laws. Our source code is
                            available under the license specified in our GitHub repository.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white">6. Disclaimer of Warranties</h2>
                        <p>
                            THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF
                            ANY KIND, EITHER EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT:
                        </p>
                        <ul className="list-disc space-y-1 pl-6">
                            <li>The Service will be uninterrupted, timely, secure, or error-free</li>
                            <li>The results obtained from using the Service will be accurate or reliable</li>
                            <li>Any defects in the Service will be corrected</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white">7. Limitation of Liability</h2>
                        <p>
                            TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY
                            INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY
                            LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR
                            ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES RESULTING FROM:
                        </p>
                        <ul className="list-disc space-y-1 pl-6">
                            <li>Your use or inability to use the Service</li>
                            <li>Any unauthorized access to or use of our servers</li>
                            <li>Any interruption or cessation of transmission to or from the Service</li>
                            <li>Any content created using the Service</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white">8. Indemnification</h2>
                        <p>
                            You agree to indemnify and hold harmless Pepe Board Studio and its
                            operators from any claims, damages, losses, liabilities, and expenses
                            (including legal fees) arising from your use of the Service or violation of
                            these Terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white">9. Termination</h2>
                        <p>
                            We reserve the right to suspend or terminate your access to the Service at
                            any time, with or without notice, for any reason, including violation of
                            these Terms. You may discontinue use of the Service at any time by removing
                            the bot from your Discord server.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white">10. Changes to Service and Terms</h2>
                        <p>
                            We reserve the right to modify or discontinue the Service at any time. We
                            may also update these Terms from time to time. Continued use of the Service
                            after changes constitutes acceptance of the modified Terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white">11. Third-Party Services</h2>
                        <p>
                            The Service integrates with Discord and is subject to Discord's Terms of
                            Service. You must comply with Discord's terms when using our bot.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white">12. Governing Law</h2>
                        <p>
                            These Terms shall be governed by and construed in accordance with
                            applicable laws, without regard to conflict of law provisions.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white">13. Contact Information</h2>
                        <p>
                            If you have questions about these Terms of Service, please contact us
                            through our GitHub repository at{" "}
                            <a
                                href="https://github.com/kop7er/PepeBoard"
                                target="_blank"
                                rel="noreferrer"
                                className="text-green-400 hover:text-green-300"
                            >
                                github.com/kop7er/PepeBoard
                            </a>{" "}
                            or visit{" "}
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

                    <section>
                        <h2 className="text-xl font-semibold text-white">14. Severability</h2>
                        <p>
                            If any provision of these Terms is found to be unenforceable or invalid,
                            that provision shall be limited or eliminated to the minimum extent
                            necessary, and the remaining provisions shall remain in full force and
                            effect.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
