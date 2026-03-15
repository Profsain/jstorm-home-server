import { Injectable } from '@nestjs/common';
import { PropertiesService } from '../properties/properties.service';
import { SettingsService } from '../settings/settings.service';

interface Intent {
  type: string;
  score: number;
}

@Injectable()
export class ChatService {
  constructor(
    private readonly propertiesService: PropertiesService,
    private readonly settingsService: SettingsService,
  ) {}

  async getReply(message: string): Promise<string> {
    const lower = message.toLowerCase().trim();
    const intent = this.detectIntent(lower);

    try {
      const [properties, settings] = await Promise.all([
        this.propertiesService.findAll(),
        this.settingsService.getSettings(),
      ]);

      const shortletWhatsapp = settings.shortletWhatsapp || '+44737915649';
      const propertiesWhatsapp = settings.propertiesWhatsapp || '+44737915649';
      const waNumber = shortletWhatsapp.replace('+', '');
      const waSalesNumber = propertiesWhatsapp.replace('+', '');

      switch (intent.type) {
        case 'greeting':
          return this.replyGreeting();

        case 'properties_list':
          return this.replyPropertiesList(properties);

        case 'airbnb':
          return this.replyByType(properties, 'airbnb', 'Airbnb / short-stay', waNumber);

        case 'serviced':
          return this.replyByType(properties, 'serviced', 'serviced apartment', waNumber);

        case 'sale':
          return this.replyByType(properties, 'sale', 'for-sale', waSalesNumber);

        case 'pricing':
          return this.replyPricing(properties, lower);

        case 'availability':
          return this.replyAvailability(properties, waNumber);

        case 'booking':
          return this.replyBooking(waNumber);

        case 'location':
          return this.replyLocation();

        case 'amenities':
          return this.replyAmenities(properties);

        case 'contact':
          return this.replyContact(shortletWhatsapp, propertiesWhatsapp);

        case 'bedrooms':
          return this.replyBedrooms(properties, lower, waNumber);

        case 'guests':
          return this.replyGuests(properties, lower, waNumber);

        case 'checkin':
          return this.replyCheckIn();

        case 'cancellation':
          return this.replyCancellation();

        case 'pets':
          return this.replyPets();

        case 'parking':
          return this.replyParking(properties);

        case 'wifi':
          return this.replyWifi(properties);

        case 'about':
          return this.replyAbout();

        case 'reviews':
          return this.replyReviews(properties);

        case 'thanks':
          return "You're welcome! 😊 Is there anything else I can help you with?";

        default:
          return this.replyFallback(waNumber);
      }
    } catch {
      // If DB is unavailable, use static fallback
      return this.replyStaticFallback(message);
    }
  }

  // ─── Intent Detection ────────────────────────────────────────────────────────

  private detectIntent(lower: string): Intent {
    const intents: { type: string; keywords: string[] }[] = [
      {
        type: 'greeting',
        keywords: ['hello', 'hi', 'hey', 'howdy', 'good morning', 'good afternoon', 'good evening', 'hiya', 'greetings'],
      },
      {
        type: 'thanks',
        keywords: ['thank', 'thanks', 'cheers', 'appreciate', 'brilliant', 'great'],
      },
      {
        type: 'about',
        keywords: ['who are you', 'what is jstorm', 'about jstorm', 'tell me about', 'company', 'business', 'what do you do'],
      },
      {
        type: 'properties_list',
        keywords: ['all properties', 'list properties', 'show me properties', 'what properties', 'available properties', 'what do you have', 'what you have'],
      },
      {
        type: 'airbnb',
        keywords: ['airbnb', 'short stay', 'short-stay', 'holiday', 'vacation', 'nightly'],
      },
      {
        type: 'serviced',
        keywords: ['serviced', 'serviced apartment', 'long stay', 'corporate', 'business stay', 'extended'],
      },
      {
        type: 'sale',
        keywords: ['for sale', 'buy', 'purchase', 'sale property', 'properties for sale', 'buying'],
      },
      {
        type: 'pricing',
        keywords: ['price', 'pricing', 'cost', 'how much', 'rate', 'fee', 'charge', 'affordable', 'cheap', 'expensive'],
      },
      {
        type: 'availability',
        keywords: ['available', 'availability', 'vacant', 'free', 'open', 'book now', 'space', 'open'],
      },
      {
        type: 'booking',
        keywords: ['book', 'booking', 'reserve', 'reservation', 'how to book', 'make a booking'],
      },
      {
        type: 'location',
        keywords: ['location', 'where', 'address', 'area', 'neighbourhood', 'neighborhood', 'preston', 'nearby', 'city centre', 'city center'],
      },
      {
        type: 'amenities',
        keywords: ['amenities', 'facilities', 'features', 'what included', "what's included", 'include', 'provide', 'kitchen', 'laundry', 'gym'],
      },
      {
        type: 'contact',
        keywords: ['contact', 'phone', 'email', 'reach', 'get in touch', 'whatsapp', 'number', 'call'],
      },
      {
        type: 'bedrooms',
        keywords: ['bedroom', 'bed', 'studio', 'one bed', '1 bed', 'two bed', '2 bed', 'three bed', '3 bed'],
      },
      {
        type: 'guests',
        keywords: ['guest', 'person', 'people', 'how many people', 'family', 'group', 'capacity'],
      },
      {
        type: 'checkin',
        keywords: ['check in', 'check-in', 'checkout', 'check out', 'check-out', 'arrival', 'departure', 'time', 'early', 'late'],
      },
      {
        type: 'cancellation',
        keywords: ['cancel', 'cancellation', 'refund', 'policy', 'flexible'],
      },
      {
        type: 'pets',
        keywords: ['pet', 'dog', 'cat', 'animal'],
      },
      {
        type: 'parking',
        keywords: ['parking', 'park', 'car', 'garage', 'drive'],
      },
      {
        type: 'wifi',
        keywords: ['wifi', 'wi-fi', 'internet', 'broadband', 'connection'],
      },
      {
        type: 'reviews',
        keywords: ['review', 'rating', 'star', 'feedback', 'testimonial', 'guest said'],
      },
    ];

    let best: Intent = { type: 'unknown', score: 0 };
    for (const intent of intents) {
      let score = 0;
      for (const kw of intent.keywords) {
        if (lower.includes(kw)) score += kw.split(' ').length; // longer kw = higher score
      }
      if (score > best.score) best = { type: intent.type, score };
    }
    return best;
  }

  // ─── Reply Builders ──────────────────────────────────────────────────────────

  private replyGreeting(): string {
    return (
      "👋 Hello! Welcome to **JStorm Homes** — your home away from home in Preston!\n\n" +
      "I'm your virtual assistant and I can help you with:\n" +
      "• 🏠 Browsing our properties\n" +
      "• 💷 Pricing & availability\n" +
      "• 📅 How to book\n" +
      "• 📍 Locations & amenities\n" +
      "• 📞 Contact information\n\n" +
      "What would you like to know?"
    );
  }

  private replyPropertiesList(properties: any[]): string {
    if (!properties.length) {
      return "We currently don't have any listed properties, but new ones are added regularly! Please reach out via WhatsApp for the latest availability.";
    }

    const shortlets = properties.filter((p) => p.type !== 'sale');
    const forSale = properties.filter((p) => p.type === 'sale');

    let msg = `🏠 **JStorm Homes – Our Properties**\n\n`;

    if (shortlets.length) {
      msg += `**Short-Stay Apartments (${shortlets.length} available):**\n`;
      for (const p of shortlets) {
        const avail = p.available ? '✅' : '❌';
        msg += `${avail} **${p.name}** — ${p.location} | £${p.price}/night | ${p.bedrooms} bed\n`;
      }
    }

    if (forSale.length) {
      msg += `\n**Properties For Sale (${forSale.length} listed):**\n`;
      for (const p of forSale) {
        msg += `🏡 **${p.name}** — ${p.location} | £${p.price.toLocaleString()} | ${p.bedrooms} bed\n`;
      }
    }

    msg += `\nWould you like details on any specific property, or shall I help you find the right match? 😊`;
    return msg;
  }

  private replyByType(properties: any[], type: string, label: string, waNumber: string): string {
    const filtered = properties.filter((p) => p.type === type && p.available);
    if (!filtered.length) {
      return `We don't have any ${label} properties available right now, but new listings are added regularly. Contact us on WhatsApp: https://wa.me/${waNumber}`;
    }
    let msg = `Here are our **${label}** properties:\n\n`;
    for (const p of filtered) {
      const priceStr = type === 'sale' ? `£${p.price.toLocaleString()}` : `£${p.price}/night`;
      msg += `🏠 **${p.name}**\n`;
      msg += `   📍 ${p.location} | 💷 ${priceStr}\n`;
      msg += `   🛏 ${p.bedrooms} bed | 🚿 ${p.bathrooms} bath`;
      if (p.guests) msg += ` | 👥 Up to ${p.guests} guests`;
      msg += `\n   _${p.shortDescription}_\n\n`;
    }
    msg += `💬 To book or ask about a specific property, message us on WhatsApp: https://wa.me/${waNumber}`;
    return msg;
  }

  private replyPricing(properties: any[], lower: string): string {
    const shortlets = properties.filter((p) => p.type !== 'sale' && p.available);
    if (!shortlets.length) {
      return "Our nightly rates vary by property and season. Please contact us on WhatsApp for current pricing.";
    }

    const min = Math.min(...shortlets.map((p) => p.price));
    const max = Math.max(...shortlets.map((p) => p.price));

    let msg = `💷 **JStorm Homes Pricing**\n\n`;
    msg += `Our short-stay apartments start from **£${min}/night** and go up to **£${max}/night** depending on the property size and type.\n\n`;
    msg += `**Current nightly rates:**\n`;
    for (const p of shortlets) {
      msg += `• **${p.name}** — £${p.price}/night (${p.bedrooms}-bed)\n`;
    }
    msg += `\n💡 _Discounts may be available for longer stays. Message us on WhatsApp to discuss!_`;
    return msg;
  }

  private replyAvailability(properties: any[], waNumber: string): string {
    const available = properties.filter((p) => p.type !== 'sale' && p.available);
    const unavailable = properties.filter((p) => p.type !== 'sale' && !p.available);
    let msg = `📅 **Availability**\n\n`;
    if (available.length) {
      msg += `✅ **Currently Available (${available.length}):**\n`;
      for (const p of available) msg += `• ${p.name} (${p.location})\n`;
    }
    if (unavailable.length) {
      msg += `\n❌ **Fully Booked (${unavailable.length}):**\n`;
      for (const p of unavailable) msg += `• ${p.name}\n`;
    }
    msg += `\n📲 For specific dates, please message us on WhatsApp: https://wa.me/${waNumber}`;
    return msg;
  }

  private replyBooking(waNumber: string): string {
    return (
      `📅 **How to Book with JStorm Homes**\n\n` +
      `Booking is simple and fast:\n\n` +
      `1️⃣ **Browse** our properties on the website\n` +
      `2️⃣ **Use the booking form** on any property page to submit your dates & details\n` +
      `3️⃣ **OR chat directly on WhatsApp** for instant assistance: https://wa.me/${waNumber}\n\n` +
      `We'll confirm availability and guide you through the rest. No complex process — just quick, friendly service! 😊`
    );
  }

  private replyLocation(): string {
    return (
      `📍 **JStorm Homes Locations**\n\n` +
      `All our properties are located in and around **Preston, Lancashire, UK**:\n\n` +
      `• 🏙️ **Preston City Centre** — Walking distance to shops, restaurants & attractions\n` +
      `• ⚓ **Preston Marina** — Scenic waterfront living\n` +
      `• 💼 **Preston Business District** — Perfect for corporate stays\n` +
      `• 🌿 **Preston Riverside** — Peaceful riverside location\n` +
      `• 🏡 **Preston Suburbs & Parks** — Quiet, family-friendly neighbourhoods\n\n` +
      `Preston is well-connected by rail and road, making it an ideal base for exploring Lancashire and the North West.`
    );
  }

  private replyAmenities(properties: any[]): string {
    // Collect all unique amenities
    const allAmenities = new Set<string>();
    for (const p of properties.filter((p) => p.type !== 'sale')) {
      (p.amenities || []).forEach((a: string) => allAmenities.add(a));
    }

    let msg = `✨ **Amenities at JStorm Homes**\n\nOur apartments are fully furnished and include:\n\n`;
    if (allAmenities.size) {
      for (const a of allAmenities) msg += `✅ ${a}\n`;
    } else {
      msg += `✅ High-speed Wi-Fi\n✅ Smart TV\n✅ Fully equipped kitchen\n✅ Washer/Dryer\n✅ Parking\n✅ Air conditioning\n`;
    }
    msg += `\n_Specific amenities vary by property. Ask about a specific listing for full details!_`;
    return msg;
  }

  private replyContact(shortlet: string, sales: string): string {
    return (
      `📞 **Contact JStorm Homes**\n\n` +
      `**Short-Stay / Airbnb Enquiries:**\n` +
      `📱 WhatsApp: ${shortlet}\n` +
      `🔗 https://wa.me/${shortlet.replace('+', '')}\n\n` +
      `**Property Sales / Buying Enquiries:**\n` +
      `📱 WhatsApp: ${sales}\n` +
      `🔗 https://wa.me/${sales.replace('+', '')}\n\n` +
      `We typically respond within minutes during business hours! ⚡`
    );
  }

  private replyBedrooms(properties: any[], lower: string, waNumber: string): string {
    let beds: number | null = null;
    if (lower.includes('studio') || lower.includes('one bed') || lower.includes('1 bed')) beds = 1;
    else if (lower.includes('two bed') || lower.includes('2 bed')) beds = 2;
    else if (lower.includes('three bed') || lower.includes('3 bed')) beds = 3;
    else if (lower.includes('four bed') || lower.includes('4 bed')) beds = 4;

    const shortlets = properties.filter((p) => p.type !== 'sale');
    const filtered = beds ? shortlets.filter((p) => p.bedrooms === beds) : shortlets;

    if (!filtered.length) {
      return `We don't currently have ${beds ? beds + '-bedroom' : ''} properties available. Please check back or contact us on WhatsApp: https://wa.me/${waNumber}`;
    }

    let msg = beds
      ? `🛏 **${beds}-Bedroom Properties:**\n\n`
      : `🛏 **Our Properties by Bedroom Count:**\n\n`;

    for (const p of filtered) {
      msg += `• **${p.name}** — ${p.bedrooms} bed | £${p.price}/night | ${p.location}\n`;
    }
    return msg;
  }

  private replyGuests(properties: any[], lower: string, waNumber: string): string {
    let guestCount: number | null = null;
    const match = lower.match(/(\d+)\s*(person|people|guest)/);
    if (match) guestCount = parseInt(match[1], 10);

    const shortlets = properties.filter((p) => p.type !== 'sale' && p.available);
    const filtered = guestCount
      ? shortlets.filter((p) => p.guests >= guestCount!)
      : shortlets;

    if (!filtered.length) {
      return `We don't have properties for ${guestCount} guests at the moment. Please message us on WhatsApp: https://wa.me/${waNumber}`;
    }

    let msg = guestCount
      ? `👥 **Properties suitable for ${guestCount}+ guests:**\n\n`
      : `👥 **Our property capacities:**\n\n`;

    for (const p of filtered) {
      msg += `• **${p.name}** — Up to ${p.guests} guests | ${p.bedrooms} bed | £${p.price}/night\n`;
    }
    return msg;
  }

  private replyCheckIn(): string {
    return (
      `🕐 **Check-in & Check-out Times**\n\n` +
      `• **Check-in:** From **3:00 PM** onwards\n` +
      `• **Check-out:** By **11:00 AM**\n\n` +
      `Need early check-in or late check-out? We'll do our best to accommodate — just message us on WhatsApp and we'll arrange it where possible! 😊`
    );
  }

  private replyCancellation(): string {
    return (
      `❌ **Cancellation & Booking Policy**\n\n` +
      `We have a flexible cancellation policy:\n\n` +
      `• **Free cancellation** up to 48 hours before check-in\n` +
      `• Cancellations within 48 hours may be subject to a fee\n` +
      `• Full details will be confirmed at the time of booking\n\n` +
      `For the most accurate information for your specific booking, please contact us directly on WhatsApp.`
    );
  }

  private replyPets(): string {
    return (
      `🐾 **Pet Policy**\n\n` +
      `Pets are considered on a case-by-case basis depending on the property.\n\n` +
      `Please message us on WhatsApp with details about your pet and the property you're interested in — we'll do our best to accommodate you! 🐕`
    );
  }

  private replyParking(properties: any[]): string {
    const withParking = properties.filter(
      (p) => p.type !== 'sale' && (p.amenities || []).some((a: string) => a.toLowerCase().includes('parking')),
    );
    if (!withParking.length) {
      return "Parking availability varies by property. Please message us on WhatsApp for details about a specific apartment's parking options.";
    }
    let msg = `🚗 **Parking at JStorm Homes**\n\nThe following properties include parking:\n\n`;
    for (const p of withParking) msg += `✅ ${p.name} (${p.location})\n`;
    msg += `\n_Free parking is included in the nightly rate for these properties._`;
    return msg;
  }

  private replyWifi(properties: any[]): string {
    const withWifi = properties.filter(
      (p) => p.type !== 'sale' && (p.amenities || []).some((a: string) => a.toLowerCase().includes('wi-fi') || a.toLowerCase().includes('wifi')),
    );
    const count = withWifi.length;
    return (
      `📶 **Wi-Fi at JStorm Homes**\n\n` +
      `${count > 0 ? `${count} of our properties include **high-speed Wi-Fi** as a standard amenity — completely free of charge.` : 'All our properties include high-speed Wi-Fi.'}\n\n` +
      `Perfect for remote workers, streaming, and staying connected during your stay! 💻`
    );
  }

  private replyAbout(): string {
    return (
      `🏡 **About JStorm Homes**\n\n` +
      `JStorm Homes is a premium short-stay and property company based in **Preston, Lancashire**.\n\n` +
      `We specialise in:\n` +
      `• 🛎 **Luxury short-stay apartments** — Airbnb & serviced accommodation\n` +
      `• 🏠 **Properties for sale** — from modern townhouses to Victorian detached homes\n\n` +
      `**Our Promise:**\n` +
      `✨ Beautifully furnished, professionally cleaned spaces\n` +
      `⚡ Fast, friendly WhatsApp support\n` +
      `🔒 Safe, secure, and sanitised before every stay\n` +
      `🕐 Flexible stays — from one night to extended stays\n\n` +
      `Whether you're visiting for business, leisure, or looking to buy, JStorm Homes has you covered!`
    );
  }

  private replyReviews(properties: any[]): string {
    const shortlets = properties.filter((p) => p.type !== 'sale' && p.rating > 0);
    if (!shortlets.length) {
      return "Our guests consistently love their stays! Check out the testimonials on our website homepage for detailed reviews. ⭐";
    }
    const avgRating = shortlets.reduce((sum, p) => sum + p.rating, 0) / shortlets.length;
    const totalReviews = shortlets.reduce((sum, p) => sum + (p.reviews || 0), 0);

    let msg = `⭐ **Guest Reviews & Ratings**\n\n`;
    msg += `📊 **Overall:** ${avgRating.toFixed(1)}/5.0 across **${totalReviews} reviews**\n\n`;
    for (const p of shortlets) {
      msg += `• **${p.name}** — ${p.rating}⭐ (${p.reviews} reviews)\n`;
    }
    msg += `\nOur guests love the cleanliness, comfort, and excellent location of our properties! 🏡`;
    return msg;
  }

  private replyFallback(waNumber: string): string {
    return (
      `I'm not quite sure about that, but I'd love to help! 😊\n\n` +
      `You can ask me about:\n` +
      `• 🏠 Our properties & locations\n` +
      `• 💷 Pricing & nightly rates\n` +
      `• 📅 Availability & booking\n` +
      `• ✨ Amenities included\n` +
      `• 📞 How to contact us\n\n` +
      `Or chat directly with our team on WhatsApp: https://wa.me/${waNumber}`
    );
  }

  private replyStaticFallback(message: string): string {
    return (
      `Thanks for your message! 😊\n\n` +
      `JStorm Homes offers luxury short-stay apartments and properties for sale in Preston, Lancashire.\n\n` +
      `For the fastest response, please contact us directly on WhatsApp: **+44737915649**\n` +
      `🔗 https://wa.me/44737915649\n\n` +
      `We typically respond within minutes!`
    );
  }
}
