import { createEmailTemplate, htmlToText } from '../email';

export interface WelcomeEmailData {
  firstName: string;
  email: string;
  discountCode?: string;
}

export function generateWelcomeEmail(data: WelcomeEmailData) {
  const content = `
    <h1>Welcome to Your Crystal Journey, ${data.firstName}! ✨</h1>
    
    <p>Thank you for joining the Celestial Crystals family. We're thrilled to have you on this magical journey of healing, growth, and positive energy.</p>
    
    <div class="highlight">
      <h3>🎁 Welcome Gift: 15% Off Your First Order</h3>
      <p>Use code <strong>${data.discountCode || 'WELCOME15'}</strong> at checkout to receive 15% off your first purchase.</p>
      <p><em>Valid for 30 days from signup</em></p>
    </div>
    
    <h3>What Makes Celestial Crystals Special?</h3>
    <ul>
      <li><strong>Authentic Crystals:</strong> Each stone is carefully sourced and authenticated</li>
      <li><strong>Personalized Guidance:</strong> Find crystals based on your birthdate and needs</li>
      <li><strong>Expert Knowledge:</strong> Detailed information about healing properties</li>
      <li><strong>Free Shipping:</strong> On orders over $50</li>
    </ul>
    
    <h3>Start Your Journey</h3>
    <p>Not sure where to begin? Try our personalized crystal finder to discover stones that align with your energy and goals.</p>
    
    <a href="${process.env.NEXTAUTH_URL}/crystals" class="button">Explore Our Collection</a>
    <a href="${process.env.NEXTAUTH_URL}/" class="button" style="background-color: #666; margin-left: 10px;">Find My Crystal Match</a>
    
    <h3>Crystal Care Tips</h3>
    <p>To help you get started, here are some essential tips for caring for your new crystals:</p>
    <ul>
      <li>Cleanse your crystals regularly with sage, moonlight, or running water</li>
      <li>Set clear intentions when working with your stones</li>
      <li>Store them in a safe, clean space when not in use</li>
    </ul>
    
    <p>We're here to support you every step of the way. If you have any questions about crystals, their properties, or your order, don't hesitate to reach out.</p>
    
    <p>With love and light,<br>
    The Celestial Crystals Team</p>
  `;

  const html = createEmailTemplate(content, 'Welcome to Celestial Crystals');
  const text = htmlToText(content);

  return {
    subject: `Welcome to Celestial Crystals, ${data.firstName}! ✨ (15% Off Inside)`,
    html,
    text,
  };
}
