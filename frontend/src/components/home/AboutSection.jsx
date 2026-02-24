export default function AboutSection() {
  return (
    <section id="about" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-safari-charcoal font-caveat text-4xl font-normal mb-2">Who We Are</h2>
          <p className="font-aref text-safari-charcoal/80 max-w-2xl mx-auto text-sm">
            Born from a deep love for the wild and a spirit of adventure, Wild Trails is more than a safari service — 
            <br/>it’s a call to explore, connect, and protect. <br/> We are a team of passionate 
            locals and wildlife enthusiasts committed to delivering raw, authentic <br/> experiences in the heart of Kumana. 
            <br/> Every trail we follow, every story we share, and every footprint we leave behind reflects our respect for 
            <br/> nature and our dedication to responsible travel. <br/>
            Join us not just for the journey, but for the purpose behind it
          </p>
        </div>

        <div className="mt-10">
          <h3 className="text-center font-caveat text-3xl text-safari-charcoal mb-6">Our Story</h3>
          <p className="font-aref text-center text-safari-charcoal/80 max-w-2xl mx-auto text-sm">“From Wilderness to Wonder”</p><br/>
          <p className="font-aref text-safari-charcoal/80 max-w-2xl mx-auto text-sm">   Wild Trails began with a simple dream: to share the untamed beauty of Kumana with the world while
           preserving it for generations to come. What started as a single jeep and a love for wildlife has grown into 
           a full-scale safari experience rooted in passion, knowledge, and respect for nature. Our journey is driven 
           by a deep bond with the land, the animals, and the people who call this region home. At Wild Trails, every
            tour is a chapter in that story — one we’re proud to write with you</p><br/><br/>

          <div className="flex flex-col md:flex-row items-center max-w-4xl mx-auto">
            <div className="md:w-1/3 mb-8 md:mb-0">
              <img 
                src="src/assets/rushan.png" 
                alt="Rushan Thilanka" 
                className="w-48 h-48 object-cover rounded-full mx-auto border-4 border-safari-green"
              />
            </div>

            <div className="md:w-2/3 md:pl-8">
              <h3 className="font-aref text-base font-medium text-safari-charcoal mb-1">Meet Rushan,</h3>
              <h4 className="font-aref font-bold text-xl text-black mb-3">Your Host and Kunming Insider</h4>

              <p className="font-aref text-safari-charcoal leading-relaxed text-sm mb-3">
                Hello! I’m Rushan Thilanka, the founder and driving force behind Wild Trails. Born and raised
                 near the edge of Kumana National Park, this land isn't just my home — it’s my passion and 
                 purpose. With years of experience guiding travelers through the wild and a deep love for 
                 the region’s nature and culture, I created Wild Trails to share the magic of Sri Lanka’s 
                 East Coast with adventurers from around the world. Think of me as your local friend on the 
                 trail — someone who knows every bend in the road, every animal call, and every story the 
                 jungle whispers.
              </p>

              <div className="mt-4">
                <a 
                  href="/#contact" 
                  className="font-aref bg-safari-green hover:bg-safari-light-green text-[#0D722A] px-5 py-2 rounded-full text-sm font-medium transition-colors inline-block"
                >
                  Chat with Rushan
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
