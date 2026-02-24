export default function ResponsibleTourismSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="font-aref font-bold text-xl text-black mb-3">
            Responsible Tourism
          </h2>
          <p className="font-aref text-safari-charcoal/80 text-sm max-w-2xl mx-auto">
            “Travel Light. Leave a Legacy”
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          <p className="font-aref text-safari-charcoal text-sm leading-relaxed">
            At Wild Trails, we believe every adventure should protect what makes it special. 
            That’s why we follow eco-friendly practices, limit vehicle impact, and support local 
            communities through fair employment and cultural respect. We collaborate with conservation 
            groups, educate visitors on wildlife ethics, and reinvest a portion of our proceeds into 
            local sustainability projects.
          </p>

          <blockquote className="border-l-4 border-safari-green pl-4 italic font-aref font-bold 
          text-safari-charcoal text-base text-center mx-auto max-w-xl">
            “Wild isn’t just where we go — it’s what we protect”
          </blockquote>
        </div>
      </div>
    </section>
  );
}
