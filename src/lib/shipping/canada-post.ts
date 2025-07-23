import axios from 'axios';
// @ts-ignore - xml2js types not available
import { parseString } from 'xml2js';

export interface ShippingRate {
  service: string;
  serviceName: string;
  price: number;
  deliveryDays: string;
  guaranteed: boolean;
}

export interface ShippingAddress {
  postalCode: string;
  city?: string;
  province?: string;
}

export interface Package {
  weight: number; // in grams
  length: number; // in cm
  width: number;  // in cm
  height: number; // in cm
}

export class CanadaPostService {
  private static readonly BASE_URL = 'https://ct.soa-gw.canadapost.ca/rs';
  private static readonly SANDBOX_URL = 'https://ct.soa-gw.canadapost.ca/rs';

  // Your origin postal code (Hamilton, ON)
  private static readonly ORIGIN_POSTAL_CODE = 'L8P4R6'; // Hamilton, ON

  static async getRates(
    destinationPostalCode: string,
    packages: Package[]
  ): Promise<ShippingRate[]> {
    try {
      // If no Canada Post API key, return fallback rates
      if (!process.env.CANADA_POST_API_KEY) {
        return this.getFallbackRates(destinationPostalCode);
      }

      const xmlRequest = this.buildRateRequest(destinationPostalCode, packages);

      const response = await axios.post(
        `${this.BASE_URL}/ship/price`,
        xmlRequest,
        {
          headers: {
            'Content-Type': 'application/vnd.cpc.ship.rate-v4+xml',
            'Accept': 'application/vnd.cpc.ship.rate-v4+xml',
            'Authorization': `Basic ${Buffer.from(
              `${process.env.CANADA_POST_USERNAME}:${process.env.CANADA_POST_PASSWORD}`
            ).toString('base64')}`,
            'Accept-language': 'en-CA',
          },
        }
      );

      return this.parseRateResponse(response.data);
    } catch (error) {
      console.error('Canada Post API error:', error);
      // Return fallback rates if API fails
      return this.getFallbackRates(destinationPostalCode);
    }
  }

  private static buildRateRequest(destinationPostalCode: string, packages: Package[]): string {
    const totalWeight = packages.reduce((sum, pkg) => sum + pkg.weight, 0);

    return `<?xml version="1.0" encoding="UTF-8"?>
    <mailing-scenario xmlns="http://www.canadapost.ca/ws/ship/rate-v4">
      <customer-number>${process.env.CANADA_POST_CUSTOMER_NUMBER}</customer-number>
      <parcel-characteristics>
        <weight>${totalWeight}</weight>
        <dimensions>
          <length>${Math.max(...packages.map(p => p.length))}</length>
          <width>${Math.max(...packages.map(p => p.width))}</width>
          <height>${packages.reduce((sum, p) => sum + p.height, 0)}</height>
        </dimensions>
      </parcel-characteristics>
      <origin-postal-code>${this.ORIGIN_POSTAL_CODE}</origin-postal-code>
      <destination>
        <domestic>
          <postal-code>${destinationPostalCode.replace(/\s/g, '').toUpperCase()}</postal-code>
        </domestic>
      </destination>
    </mailing-scenario>`;
  }

  private static async parseRateResponse(xmlData: string): Promise<ShippingRate[]> {
    return new Promise((resolve, reject) => {
      parseString(xmlData, (err: any, result: any) => {
        if (err) {
          reject(err);
          return;
        }

        const rates: ShippingRate[] = [];
        const services = result['price-quotes']?.['price-quote'] || [];

        services.forEach((service: any) => {
          rates.push({
            service: service['service-code'][0],
            serviceName: service['service-name'][0],
            price: parseFloat(service['price-details'][0]['due'][0]),
            deliveryDays: service['service-standard'][0]['expected-delivery-date'][0] || 'N/A',
            guaranteed: service['service-standard'][0]['guaranteed-delivery'] === 'true',
          });
        });

        resolve(rates);
      });
    });
  }

  // Fallback rates based on postal code zones (when API is not available)
  private static getFallbackRates(destinationPostalCode: string): ShippingRate[] {
    const zone = this.getShippingZone(destinationPostalCode);

    const baseRates = {
      local: { regular: 8.99, expedited: 12.99, express: 18.99 },
      ontario: { regular: 12.99, expedited: 16.99, express: 24.99 },
      canada: { regular: 16.99, expedited: 22.99, express: 32.99 },
    };

    const rates = baseRates[zone] || baseRates.canada;

    return [
      {
        service: 'DOM.RP',
        serviceName: 'Regular Parcel',
        price: rates.regular,
        deliveryDays: '5-9 business days',
        guaranteed: false,
      },
      {
        service: 'DOM.EP',
        serviceName: 'Expedited Parcel',
        price: rates.expedited,
        deliveryDays: '2-3 business days',
        guaranteed: false,
      },
      {
        service: 'DOM.XP',
        serviceName: 'Xpresspost',
        price: rates.express,
        deliveryDays: '1-2 business days',
        guaranteed: true,
      },
    ];
  }

  private static getShippingZone(postalCode: string): 'local' | 'ontario' | 'canada' {
    const code = postalCode.replace(/\s/g, '').toUpperCase();

    // Hamilton area (L8, L9)
    if (code.startsWith('L8') || code.startsWith('L9')) {
      return 'local';
    }

    // Ontario postal codes (K, L, M, N, P)
    if (['K', 'L', 'M', 'N', 'P'].includes(code[0])) {
      return 'ontario';
    }

    // Rest of Canada
    return 'canada';
  }

  // Create shipping label (requires Canada Post account)
  static async createShipment(
    order: any,
    shippingAddress: ShippingAddress,
    selectedService: string
  ): Promise<{ trackingNumber: string; labelUrl: string }> {
    try {
      if (!process.env.CANADA_POST_API_KEY) {
        // Return mock tracking for development
        return {
          trackingNumber: `CP${Date.now()}`,
          labelUrl: '/api/shipping/mock-label.pdf',
        };
      }

      // Implementation for actual Canada Post shipment creation
      // This requires a Canada Post Solutions for Small Business account

      const xmlRequest = this.buildShipmentRequest(order, shippingAddress, selectedService);

      const response = await axios.post(
        `${this.BASE_URL}/ship/shipment`,
        xmlRequest,
        {
          headers: {
            'Content-Type': 'application/vnd.cpc.shipment-v8+xml',
            'Accept': 'application/vnd.cpc.shipment-v8+xml',
            'Authorization': `Basic ${Buffer.from(
              `${process.env.CANADA_POST_USERNAME}:${process.env.CANADA_POST_PASSWORD}`
            ).toString('base64')}`,
          },
        }
      );

      // Parse response and extract tracking number and label URL
      return this.parseShipmentResponse(response.data);
    } catch (error) {
      console.error('Shipment creation error:', error);
      throw new Error('Failed to create shipment');
    }
  }

  private static buildShipmentRequest(
    order: any,
    shippingAddress: ShippingAddress,
    selectedService: string
  ): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
    <shipment xmlns="http://www.canadapost.ca/ws/shipment-v8">
      <customer-request-id>${order.id}</customer-request-id>
      <requested-shipping-point>${this.ORIGIN_POSTAL_CODE}</requested-shipping-point>
      <delivery-spec>
        <service-code>${selectedService}</service-code>
        <sender>
          <name>Celestial Crystals</name>
          <company>Celestial Crystals</company>
          <contact-phone>1-800-XXX-XXXX</contact-phone>
          <address-details>
            <address-line-1>Your Address</address-line-1>
            <city>Hamilton</city>
            <prov-state>ON</prov-state>
            <country-code>CA</country-code>
            <postal-zip-code>${this.ORIGIN_POSTAL_CODE}</postal-zip-code>
          </address-details>
        </sender>
        <destination>
          <name>${order.shippingAddress.firstName} ${order.shippingAddress.lastName}</name>
          <address-details>
            <address-line-1>${order.shippingAddress.address1}</address-line-1>
            <city>${order.shippingAddress.city}</city>
            <prov-state>${order.shippingAddress.province}</prov-state>
            <country-code>CA</country-code>
            <postal-zip-code>${shippingAddress.postalCode}</postal-zip-code>
          </address-details>
        </destination>
        <parcel-characteristics>
          <weight>500</weight>
          <dimensions>
            <length>20</length>
            <width>15</width>
            <height>10</height>
          </dimensions>
        </parcel-characteristics>
        <print-preferences>
          <output-format>4x6</output-format>
        </print-preferences>
      </delivery-spec>
    </shipment>`;
  }

  private static async parseShipmentResponse(xmlData: string): Promise<{ trackingNumber: string; labelUrl: string }> {
    return new Promise((resolve, reject) => {
      parseString(xmlData, (err: any, result: any) => {
        if (err) {
          reject(err);
          return;
        }

        const trackingNumber = result.shipment?.['shipment-info']?.[0]?.['tracking-pin']?.[0] || '';
        const labelUrl = result.shipment?.['shipment-info']?.[0]?.['label-url']?.[0] || '';

        resolve({ trackingNumber, labelUrl });
      });
    });
  }

  // Track shipment
  static async trackShipment(trackingNumber: string): Promise<any> {
    try {
      if (!process.env.CANADA_POST_API_KEY) {
        // Return mock tracking data
        return {
          status: 'In Transit',
          location: 'Hamilton, ON',
          estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          events: [
            { date: new Date().toLocaleDateString(), status: 'Package picked up', location: 'Hamilton, ON' },
            { date: new Date().toLocaleDateString(), status: 'In transit', location: 'Mississauga, ON' },
          ],
        };
      }

      const response = await axios.get(
        `${this.BASE_URL}/vis/track/pin/${trackingNumber}/summary`,
        {
          headers: {
            'Accept': 'application/vnd.cpc.track+xml',
            'Authorization': `Basic ${Buffer.from(
              `${process.env.CANADA_POST_USERNAME}:${process.env.CANADA_POST_PASSWORD}`
            ).toString('base64')}`,
          },
        }
      );

      return this.parseTrackingResponse(response.data);
    } catch (error) {
      console.error('Tracking error:', error);
      throw new Error('Failed to track shipment');
    }
  }

  private static async parseTrackingResponse(xmlData: string): Promise<any> {
    return new Promise((resolve, reject) => {
      parseString(xmlData, (err: any, result: any) => {
        if (err) {
          reject(err);
          return;
        }

        // Parse tracking information from Canada Post response
        const trackingInfo = result['tracking-summary'];
        resolve(trackingInfo);
      });
    });
  }
}
