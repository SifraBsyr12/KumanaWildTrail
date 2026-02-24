import { Phone, Mail, MapPin } from 'lucide-react';

export default function ContactSection() {
  return (
    <section id="contact" className="py-16 bg-gray-50 dark:bg-[#111827]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-safari-charcoal dark:text-white font-caveat text-3xl font-normal mb-2">Contact Us</h2>
          <p className="font-aref text-safari-charcoal/80 dark:text-gray-300 max-w-2xl mx-auto text-sm">
            Have questions or ready to book your adventure? Reach out to us — we’ll help you plan the perfect Sri Lankan safari experience.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-10 max-w-5xl mx-auto">
          {/* Contact Form */}
          <div className="md:w-2/3 bg-white dark:bg-[#1f2937] p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="font-aref text-lg font-bold text-[#0D722A] mb-5">Send Us a Message</h3>
            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-[#B0EBB4] dark:bg-[#A3DCA8] focus:outline-none focus:ring-2 focus:ring-[#0D4715] dark:focus:ring-[#038A7D] text-sm font-aref text-safari-charcoal placeholder:text-safari-charcoal/60"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-[#B0EBB4] dark:bg-[#A3DCA8] focus:outline-none focus:ring-2 focus:ring-[#0D4715] dark:focus:ring-[#038A7D] text-sm font-aref text-safari-charcoal placeholder:text-safari-charcoal/60"
                />
              </div>
              <textarea
                rows={4}
                placeholder="Your Message"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-[#B0EBB4] dark:bg-[#A3DCA8] focus:outline-none focus:ring-2 focus:ring-[#0D4715] dark:focus:ring-[#038A7D] text-sm font-aref text-safari-charcoal placeholder:text-safari-charcoal/60"
                />
              <div className="text-center pt-2">
                <button
                  type="submit"
                  className="font-aref bg-safari-green hover:bg-safari-light-green transition-colors text-[#0D722A] px-6 py-2 rounded-full text-sm font-medium"
                >
                  Chat with Rushan
                </button>
              </div>
            </form>
          </div>

          {/* Contact Info */}
          <div className="md:w-1/3 bg-white dark:bg-[#1f2937] p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="font-aref text-lg font-semibold text-[#0D722A] mb-5">Contact Info</h3>
            <div className="space-y-5 text-sm text-safari-charcoal dark:text-white font-aref">
              <div className="flex items-start gap-3">
                <Phone size={18} className="mt-1 text-[#0D722A]" />
                <div>
                  <p>+94 76 661 1421</p>
                  <p>+94 76 338 1942</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail size={18} className="mt-1 text-[#0D722A]" />
                <p>info@wildtrailssafari.com</p>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={18} className="mt-1 text-[#0D722A]" />
                <div>
                  <p>No-33, Panama West,</p>
                  <p>Panama, Sri Lanka</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
