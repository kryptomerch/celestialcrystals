import { createEmailTemplate, htmlToText } from '../email';

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  properties?: string[];
}

export interface OrderConfirmationData {
  orderNumber: string;
  customerName: string;
  email: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  paymentMethod: string;
  shippingAddress: {
    firstName?: string;
    lastName?: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  estimatedDelivery: string;
}

export function generateOrderConfirmationEmail(data: OrderConfirmationData) {
  const formatPrice = (price: number) => `$${price.toFixed(2)}`;

  const itemsHtml = data.items.map(item => `
    <tr style="border-bottom: 1px solid #eee;">
      <td style="padding: 15px 0;">
        <strong>${item.name}</strong><br>
        <small style="color: #666;">Qty: ${item.quantity}</small>
        ${item.properties ? `<br><small style="color: #888;">${item.properties.slice(0, 2).join(', ')}</small>` : ''}
      </td>
      <td style="padding: 15px 0; text-align: right;">
        ${formatPrice(item.price * item.quantity)}
      </td>
    </tr>
  `).join('');

  const content = `
    <h1>Order Confirmation - ${data.orderNumber} ✨</h1>
    
    <p>Dear ${data.customerName},</p>
    
    <p>Thank you for your order! We're excited to send you these beautiful crystals to enhance your spiritual journey.</p>
    
    <div class="highlight">
      <h3>📦 Order Details</h3>
      <p><strong>Order Number:</strong> ${data.orderNumber}</p>
      <p><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
      <p><strong>Payment Method:</strong> ${data.paymentMethod === 'stripe' ? 'Credit Card' : 'PayPal'}</p>
    </div>
    
    <h3>Items Ordered</h3>
    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
      ${itemsHtml}
      <tr style="border-top: 2px solid #333;">
        <td style="padding: 10px 0;"><strong>Subtotal:</strong></td>
        <td style="padding: 10px 0; text-align: right;"><strong>${formatPrice(data.subtotal)}</strong></td>
      </tr>
      <tr>
        <td style="padding: 5px 0;">Shipping:</td>
        <td style="padding: 5px 0; text-align: right;">${data.shipping === 0 ? 'FREE' : formatPrice(data.shipping)}</td>
      </tr>
      <tr>
        <td style="padding: 5px 0;">Tax:</td>
        <td style="padding: 5px 0; text-align: right;">${formatPrice(data.tax)}</td>
      </tr>
      <tr style="border-top: 1px solid #333; font-size: 18px;">
        <td style="padding: 10px 0;"><strong>Total:</strong></td>
        <td style="padding: 10px 0; text-align: right;"><strong>${formatPrice(data.total)}</strong></td>
      </tr>
    </table>
    
    <h3>🚚 Shipping Information</h3>
    <p><strong>Shipping Address:</strong><br>
    ${data.shippingAddress.firstName && data.shippingAddress.lastName ? `${data.shippingAddress.firstName} ${data.shippingAddress.lastName}<br>` : ''}
    ${data.shippingAddress.address}<br>
    ${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.zipCode}<br>
    ${data.shippingAddress.country}</p>
    
    <p><strong>Estimated Delivery:</strong> ${data.estimatedDelivery}</p>
    
    <div class="highlight">
      <h3>📱 Track Your Order</h3>
      <p>You'll receive a tracking number via email once your order ships (typically within 1-2 business days).</p>
    </div>
    
    <h3>Crystal Care Reminder</h3>
    <p>When your crystals arrive, remember to:</p>
    <ul>
      <li>Cleanse them with sage, moonlight, or running water</li>
      <li>Set your intentions for how you'd like them to support you</li>
      <li>Keep them in a special place where their energy can work for you</li>
    </ul>
    
    <a href="${process.env.NEXTAUTH_URL}/crystal-care" class="button">Crystal Care Guide</a>
    
    <p>If you have any questions about your order or need assistance, please don't hesitate to contact us.</p>
    
    <p>Thank you for choosing Celestial Crystals!</p>
    
    <p>With gratitude,<br>
    The Celestial Crystals Team</p>
  `;

  const html = createEmailTemplate(content, `Order Confirmation - ${data.orderNumber}`);
  const text = htmlToText(content);

  return {
    subject: `Order Confirmed: ${data.orderNumber} - Your Crystals Are On Their Way! ✨`,
    html,
    text,
  };
}
