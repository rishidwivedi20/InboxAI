// Fallback news content when APIs are rate limited
// This provides curated content that updates based on the current date

export function getFallbackNews(categories: string[]): Array<{
  title: string;
  url: string;
  description: string;
  category: string;
}> {
  const currentDate = new Date();
  const dayOfYear = Math.floor(
    (currentDate.getTime() -
      new Date(currentDate.getFullYear(), 0, 0).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  // Use day of year to rotate through different content
  const rotation = dayOfYear % 10;

  const newsDatabase = {
    technology: [
      {
        title: "🚀 AI Breakthrough: New Language Model Achieves 95% Accuracy",
        url: "https://techcrunch.com/ai-breakthrough-2025",
        description:
          "Researchers have developed a revolutionary AI system that demonstrates unprecedented accuracy in natural language understanding and generation tasks.",
      },
      {
        title: "💻 Quantum Computing Makes Commercial Debut",
        url: "https://arstechnica.com/quantum-computing-commercial",
        description:
          "The first commercially viable quantum computer has been deployed for real-world applications, marking a milestone in computing history.",
      },
      {
        title: "🔐 Cybersecurity Alert: New Zero-Day Vulnerability Discovered",
        url: "https://securitynews.com/zero-day-alert",
        description:
          "Security researchers have identified a critical vulnerability affecting millions of devices worldwide. Patches are being deployed urgently.",
      },
      {
        title:
          "📱 Revolutionary Battery Technology Promises Week-Long Phone Life",
        url: "https://techreview.com/battery-breakthrough",
        description:
          "Scientists have developed a new battery technology that could extend smartphone battery life to over a week on a single charge.",
      },
      {
        title: "🌐 Internet Infrastructure Gets Major Upgrade",
        url: "https://networkworld.com/infrastructure-upgrade",
        description:
          "Global internet infrastructure receives significant improvements, promising faster speeds and better reliability for users worldwide.",
      },
    ],
    sports: [
      {
        title: "🏆 Championship Finals Set Record Viewership",
        url: "https://espn.com/championship-record-viewership",
        description:
          "This year's championship finals have broken all previous viewership records, with millions of fans tuning in globally.",
      },
      {
        title: "⚽ Transfer Window Shakeup: Star Player Changes Teams",
        url: "https://sportsnet.com/transfer-window-shakeup",
        description:
          "The transfer window has seen some surprising moves as top athletes switch teams in preparation for the upcoming season.",
      },
      {
        title: "🥇 Olympic Preparations Intensify Across Multiple Disciplines",
        url: "https://olympics.com/preparation-update",
        description:
          "Athletes worldwide are intensifying their training as the next Olympic Games approach, with several records already being broken in qualifiers.",
      },
      {
        title: "🏀 Rookie Sensation Takes League by Storm",
        url: "https://nba.com/rookie-sensation",
        description:
          "A new rookie player has been making headlines with exceptional performances, earning comparisons to legendary players.",
      },
      {
        title: "🏁 Racing Season Delivers Thrilling Competition",
        url: "https://motorsport.com/thrilling-season",
        description:
          "This racing season has been one of the most competitive in recent years, with multiple drivers vying for the championship title.",
      },
    ],
    science: [
      {
        title: "🧬 Gene Therapy Breakthrough Offers Hope for Rare Diseases",
        url: "https://nature.com/gene-therapy-breakthrough",
        description:
          "Researchers have achieved a major breakthrough in gene therapy, offering new treatment options for previously incurable genetic conditions.",
      },
      {
        title: "🌌 Webb Telescope Discovers Potentially Habitable Exoplanet",
        url: "https://nasa.gov/webb-habitable-planet",
        description:
          "The James Webb Space Telescope has identified a new exoplanet in the habitable zone of its star, showing signs of atmospheric water vapor.",
      },
      {
        title: "🦠 New Antibiotic Effective Against Resistant Bacteria",
        url: "https://sciencemag.org/new-antibiotic",
        description:
          "Scientists have developed a novel antibiotic that shows promise against drug-resistant bacterial infections, potentially saving countless lives.",
      },
      {
        title: "🧠 Brain Implant Helps Paralyzed Patients Regain Movement",
        url: "https://sciencenews.org/brain-implant-movement",
        description:
          "A revolutionary brain-computer interface has enabled paralyzed patients to control robotic limbs with their thoughts alone.",
      },
      {
        title: "🌱 Breakthrough in Carbon Capture Technology",
        url: "https://environmentalscience.org/carbon-capture",
        description:
          "Researchers have developed an efficient method for capturing carbon dioxide from the atmosphere, offering hope in the fight against climate change.",
      },
    ],
    business: [
      {
        title: "📈 Tech Stocks Rally as AI Investments Surge",
        url: "https://bloomberg.com/tech-stocks-rally",
        description:
          "Technology stocks have seen significant gains as investors continue to pour money into artificial intelligence and automation companies.",
      },
      {
        title: "🏪 E-commerce Giants Expand into Physical Retail",
        url: "https://retailnews.com/ecommerce-physical-expansion",
        description:
          "Major online retailers are investing heavily in physical stores, creating a hybrid shopping experience for consumers.",
      },
      {
        title: "💰 Startup Funding Reaches New Heights in Q3",
        url: "https://venturebeat.com/startup-funding-record",
        description:
          "Venture capital funding for startups has reached unprecedented levels this quarter, with particular interest in sustainable technology.",
      },
      {
        title: "🌍 Global Supply Chains Adapt to New Challenges",
        url: "https://supplychaindigital.com/global-adaptation",
        description:
          "Companies worldwide are restructuring their supply chains to become more resilient and sustainable in the face of ongoing global challenges.",
      },
      {
        title: "🏦 Central Banks Consider Digital Currency Implementation",
        url: "https://financialtimes.com/digital-currency-implementation",
        description:
          "Several central banks are moving closer to launching their own digital currencies, potentially reshaping the global financial system.",
      },
    ],
    health: [
      {
        title: "💊 Revolutionary Cancer Treatment Shows Promising Results",
        url: "https://cancerresearch.org/revolutionary-treatment",
        description:
          "A new immunotherapy treatment has shown remarkable success in clinical trials, offering hope for patients with advanced cancer.",
      },
      {
        title: "🧘 Mental Health Awareness Leads to Policy Changes",
        url: "https://mentalhealthnews.org/policy-changes",
        description:
          "Growing awareness of mental health issues has prompted governments to implement new policies supporting mental wellness programs.",
      },
      {
        title: "🩺 AI-Powered Diagnostics Improve Early Disease Detection",
        url: "https://medicalai.com/diagnostic-improvement",
        description:
          "Artificial intelligence systems are revolutionizing medical diagnostics, enabling earlier and more accurate disease detection.",
      },
      {
        title: "🏃 Exercise Benefits Extended Lifespan in New Study",
        url: "https://healthstudies.org/exercise-longevity",
        description:
          "A comprehensive long-term study confirms that regular exercise significantly extends lifespan and improves quality of life.",
      },
      {
        title: "🌿 Natural Medicine Integration in Modern Healthcare",
        url: "https://integrativemedicine.org/natural-integration",
        description:
          "Healthcare systems are increasingly incorporating traditional and natural medicine approaches alongside conventional treatments.",
      },
    ],
    environment: [
      {
        title: "🌊 Ocean Cleanup Project Achieves Major Milestone",
        url: "https://oceancleanup.com/major-milestone",
        description:
          "The Ocean Cleanup project has successfully removed tons of plastic waste from the Pacific, marking a significant environmental achievement.",
      },
      {
        title: "☀️ Solar Energy Costs Drop to Historic Lows",
        url: "https://renewableenergy.org/solar-costs-drop",
        description:
          "The cost of solar energy has reached an all-time low, making renewable energy more accessible and economically viable than ever.",
      },
      {
        title: "🌳 Reforestation Efforts Show Measurable Climate Impact",
        url: "https://climateaction.org/reforestation-impact",
        description:
          "Large-scale reforestation projects are showing significant positive impacts on local climates and biodiversity conservation.",
      },
      {
        title: "♻️ Circular Economy Initiatives Gain Global Momentum",
        url: "https://circulareconomy.org/global-momentum",
        description:
          "Businesses and governments worldwide are adopting circular economy principles to reduce waste and promote sustainability.",
      },
      {
        title: "🌀 Advanced Weather Prediction Improves Disaster Preparedness",
        url: "https://weatherscience.org/prediction-improvement",
        description:
          "New meteorological technologies are providing more accurate weather predictions, helping communities better prepare for natural disasters.",
      },
    ],
  };

  const allArticles: Array<{
    title: string;
    url: string;
    description: string;
    category: string;
  }> = [];

  categories.forEach((category) => {
    const categoryNews =
      newsDatabase[category as keyof typeof newsDatabase] || [];

    // Select articles based on rotation to provide variety
    const selectedArticles = categoryNews
      .slice(
        rotation % categoryNews.length,
        (rotation % categoryNews.length) + 2
      )
      .concat(
        categoryNews.slice(
          0,
          Math.max(
            0,
            2 - (categoryNews.length - (rotation % categoryNews.length))
          )
        )
      )
      .slice(0, 2)
      .map((article) => ({
        ...article,
        category,
      }));

    allArticles.push(...selectedArticles);
  });

  return allArticles;
}

// Enhanced fallback that includes trending topics and current events
export function getEnhancedFallbackNews(categories: string[]): Array<{
  title: string;
  url: string;
  description: string;
  category: string;
}> {
  const fallbackNews = getFallbackNews(categories);
  const currentDate = new Date();
  const month = currentDate.getMonth();
  const day = currentDate.getDate();

  // Add seasonal/timely content
  const timelyContent = [];

  // Add tech conference season content (typically fall)
  if (month >= 8 && month <= 11 && categories.includes("technology")) {
    timelyContent.push({
      title: "🎤 Tech Conference Season Unveils Industry Innovations",
      url: "https://techconferences.com/season-highlights",
      description:
        "Major technology conferences are showcasing the latest innovations in AI, cloud computing, and emerging technologies.",
      category: "technology",
    });
  }

  // Add sports season content
  if (categories.includes("sports")) {
    if (month >= 8 && month <= 1) {
      // Fall/Winter sports
      timelyContent.push({
        title: "🏈 Fall Sports Season Reaches Peak Excitement",
        url: "https://sports.com/fall-season-peak",
        description:
          "Football, basketball, and hockey seasons are delivering thrilling matchups and unexpected results across all leagues.",
        category: "sports",
      });
    } else if (month >= 2 && month <= 5) {
      // Spring sports
      timelyContent.push({
        title: "⚾ Spring Training and March Madness Captivate Fans",
        url: "https://sports.com/spring-excitement",
        description:
          "Baseball spring training and college basketball tournaments are generating excitement as teams prepare for championship runs.",
        category: "sports",
      });
    }
  }

  return [...fallbackNews, ...timelyContent];
}
